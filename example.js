import 'babel-polyfill';

import { DQ } from './DQ.js';
import config from './config/conf.js';
import logger from 'intel';
import imageRecognition from './lib/modules/imageRecognition.js';

import string from 'string';

import Dialog from './lib/modules/dialog.js';

import _ from 'lodash';

import m from 'moment'

const pizzaDialog = new Dialog();

const dq = new DQ({
	token: config.token,
	parent: config.parent
});

dq.on('message', async (message) => {

	const { to, text, photoUrl, location, first_name } = message;

	function c (text, keys) {
		return _.some(keys, (key) => _.includes(_.words(text), key));
	}

	if (text) {

		if (c(text, ['/start', 'help', 'assist'])) {

			// send default message
			dq.send({ to, text: "Hi "+first_name+"! \n\n1. Upload your selfie to see some cool stuff!\n"+
			"2. Start conversation with a HealthAssistant Bot.\n"+
		 	"3. Get the nearest Health Assistant location by sharing your locaion."});

		} else if (c(text, ['remind', 'Remind'])) {

			const finalDate = m().add('hours', parseInt(text.match(/\d+/)[0]));

			dq.send({to, text: "I'll remind you " + finalDate.calendar() });

		} else if (c(text, ['afternoon'])){
			dq.send({to, text: 'Hei '+first_name+'. Can you please upload your picture. We need to process more information about you.'})
		} else if (c(text, ['sick'])) {
			dq.send({to, text: "Oh sorry to hear that "+first_name+"! Let me try to help you with that. Give me specifics on what's wrong."});
		} else if (c(text, ['headache', 'head', 'head-', 'stomachache'])){
			dq.send({to, text: "Don't worry I can help you with that. On a scale of 1 to 5, how serious do you think it is?"});
		} else if (c(text, ['3', '4', '5', 'serious'])) {
			dq.send({to, text: 'You can give me your location, and I will suggest the nearest doctor.'});
		} else if (c(text, ['map'])) {
			dq.send({to, text: 'Alright, let me share the map.'});
		} else if (c(text, ['thank'])) {
			dq.send({to, text: 'Good bye '+first_name+'! Hopefully you will feel better soon'})
		}
		else {

			// go with dialog thing
			const botResponse =  await pizzaDialog.input({
				input: text,
				telegramId: to
			});

			dq.send({ to, text: botResponse.response.join('') });
		}

	} else if (photoUrl) {
		const { gender, age } = await imageRecognition(photoUrl);

		let q = age.ageRange;
		let a = q.split('-');
		let b = (parseInt(a[0])+parseInt(a[1]))/2;

		/** Display gender and age */
		dq.send({ to, text: `It's always tricky to guess the age, or especilly the gender. I apologize before I use my algorithms to figure your picture out (type help in case of a mistake).\n 
			So you look like a ${b} years old ${gender.gender}.\n
			My confidence level is at ${Math.ceil(gender.score * 100)}%.\n
			Is there anything I can help you with?` });
	} else if (location) {

		if (location.hasOwnProperty('title') && location.hasOwnProperty('address')) {
			dq.send({
				to,
				text: `Right now you are in ${location.title} in ${location.address}. The nearest medical assistance you can get is in a 100 meters. It is in Tarkkampujankuja 6.`
			})
		}
	}
})


dq.listen((err) => {
	if (err) logger.error(err);
});
