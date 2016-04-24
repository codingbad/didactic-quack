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

	const { to, text, photoUrl, location } = message;

	function c (text, keys) {
		_.has(keys, (key) => {
			return string(text).contains(key)
		})
	}

	if (text) {

		if (c(text, ['/start', 'help', 'assist'])) {

			// send default message
			dq.send({ to, text: "Hi there! \n\n1. Upload your selfie to see some cool stuff!\n"+
			"2. Start conversation with a HealthAssistant Bot.\n"+
		 	"3. Get the nearest Health Assistant location by sharing your locaion."});

		} else if (c(text, 'Hello, how are you?')) {
			dq.send({to, text: "I am fine, thanks!"});

		} else if (c(text, ['remind', 'Remind'])) {

			const nowHours = m();
			const finalDate = m().add('hours', 5);
			const hours = m().hours();

			dq.send({to, text: "I'll remind you at " + hours });

		} else {

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
		dq.send({ to, text: `You look like ${b} and you seem like ${gender.gender}.\n` });
	} else if (location) {

		if (location.hasOwnProperty('title') && location.hasOwnProperty('address')) {
			dq.send({
				to,
				text: `Your location is ${location.title} in ${location.address}. The neares health assistant is located in about 100 meters towards F-building, Health Care MAMK center.`
			})
		}
	}
})


dq.listen((err) => {
	if (err) logger.error(err);
});
