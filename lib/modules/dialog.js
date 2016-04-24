import credentials from '../../credentials.json';
import watson from 'watson-developer-cloud';
import makePromise from '../makePromise.js';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const dialog_service = watson.dialog({
	username: credentials.dialog.username,
	password: credentials.dialog.password,
	version: credentials.dialog.version
});

const replyTo = makePromise(dialog_service.conversation, dialog_service);

let sessions = [];
/** 

sessions = [
	{
		telegramId: 12345,
		clientId: 7777, // Coming from the Watson Dialog API
		conversationId: 54321,
	}
];

 */

export default class Dialog {
	constructor(xmlTemplate) {
		_.assign(this, {
			xmlTemplate
		});

	}

	async input({ input, telegramId }) {
		const result = await makePromise(dialog_service.getDialogs, dialog_service)({});
		// console.log('result', result);
		const {dialogs} = result;
		/** If pizza template exists, skip this function. */
		if (dialogs.some((item) => item.name == 'pizza')) {
			/** If the pizza template exists... */
			/** 1. Get the dialog_id */
			console.log('Pizza found');
			const dialog_id = _.find(dialogs, { name: 'pizza' })
				.dialog_id;

			console.log('Dialog_id: ', dialog_id);

			/** 2. Get all the conversations */
			// const {conversations} = await makePromise(dialog_service.getConversation, dialog_service)({
			// 	dialog_id
			// });
			// console.log(conversations);

			/** 3.1 Check if the telegramId exists in the sessions, get
			the clientId, and the conversationId */
			/** 3.2 If not, initiate the first question and
			after that, save the session into `sessions` */
			let conversationId, clientId;

			let finding = _.find(sessions, { telegramId });
			console.log('Finding: ', finding);
			if (finding) {
				conversationId = finding.conversationId;
				clientId = finding.clientId;
				
				let reply = await replyTo({
					dialog_id,
					conversation_id: conversationId,
					client_id: clientId,
					input
				});
				console.log('reply: ', reply);
				console.log('sessions: ', sessions);
				return reply;
			} else {
				let initCon = await replyTo({
					dialog_id,
					input
				});
				console.log('initCon: ', initCon);
				sessions.push({
					telegramId: telegramId,
					conversationId: initCon.conversation_id,
					clientId: initCon.client_id
				});
				console.log('sessions: ', sessions);
				return initCon;
			}

			// let res = await makePromise(dialog_service.conversation, dialog_service)({
			// 	dialog_id,
			// 	input: input
			// });

			// const { client_id, conversation_id, response } = res;
			// console.log(res.response);

			// let res2 = await makePromise(dialog_service.conversation, dialog_service)({
			// 	dialog_id,
			// 	client_id,
			// 	conversation_id,
			// 	input: 'Small?'
			// });

			// console.log(res2.response);
		} else {
			console.log('Created pizza template');
			await makePromise(dialog_service.createDialog, dialog_service)({
				name: 'pizza',
				file: fs.createReadStream(path.resolve(__dirname, 'pizza.xml'))
			});
		}
	}
}