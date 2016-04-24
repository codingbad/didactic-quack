import 'babel-polyfill';

import { DQ } from './DQ.js';
import config from './config/conf.js';
import logger from 'intel';
import imageRecognition from './lib/modules/imageRecognition.js';


const dq = new DQ({
	token: config.token,
	parent: config.parent
});

dq.on('message', async (message) => {
	const { to, text, photoUrl } = message;
	console.log(message);

	let moduleResponse;

	if (text) {
		moduleResponse = dq.initModule(text);
		dq.send({ to, text: moduleResponse });
	} else if (photoUrl) {
		const res = await imageRecognition(photoUrl);
		/** Display gender and age */
		dq.send({ to, text: JSON.stringify(res) });
	}
})


dq.listen((err) => {
	if (err) logger.error(err);
});
