import credentials from '../../credentials.json';
import watson from 'watson-developer-cloud';
import makePromise from '../makePromise.js';
import fs from 'fs';
import path from 'path';

const dialog_service = watson.dialog({
	username: credentials.dialog.username,
	password: credentials.dialog.password,
	version: credentials.dialog.version
});

let backlog = [];

export default class Dialog {
	constructor(xmlTemplate) {
		_.assign(this, {
			xmlTemplate
		});

	}

	async input({ input, telegramId }) {
		const result = await makePromise(dialog_service.getDialogs, dialog_service)({});
		console.log('result', result);
		const {dialogs} = result;
		/** If pizza template exists, skip this function. */
		if (dialogs.some((item) => item.name == path.basename(this.xmlTemplate))) {
			/** If the pizza template exists... */
			/** 1. Get the dialog_id */
			console.log('Pizza found');
			const dialog_id = _.find(dialogs, { name: path.basename(this.xmlTemplate) })
				.dialog_id;

			console.log('Dialog_id: ', dialog_id);

			/** 2. Get all the conversions */
			const conversions = await makePromise(dialog_service.getConversation, dialog_service)({
				dialog_id
			});

			let res = await makePromise(dialog_service.conversation, dialog_service)({
				dialog_id,
				input: userInput
			});

			const { client_id, conversation_id, response } = res;
			console.log(res.response);

			let res2 = await makePromise(dialog_service.conversation, dialog_service)({
				dialog_id,
				client_id,
				conversation_id,
				input: 'Small?'
			});

			console.log(res2.response);
		} else {
			console.log('Created pizza template');
			await makePromise(dialog_service.createDialog, dialog_service)({
				name: 'pizza',
				file: fs.createReadStream(path.resolve(__dirname, this.xmlTemplate))
			});
		}
	}
}