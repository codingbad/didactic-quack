import { DQ } from './DQ.js';
import config from './config/conf.js';
import logger from 'intel';

import watson from 'watson-developer-cloud';
import fs from 'fs';
import request from 'request';

import credentials from './credentials.json';
import makePromise from './lib/make-promise.js';
require('babel-polyfill');

const alchemy_vision = watson.alchemy_vision({
	api_key: credentials.alchemy.apikey
});

const alchemy_vision_Pr = makePromise(
	alchemy_vision.recognizeFaces,
	alchemy_vision);

// (async () => {

// 	await new Promise((resolve, reject) => {
// 		request('https://scontent-arn2-1.xx.fbcdn.net/v/t34.0-12/13084333_1779439385621466_1503497067_n.jpg?oh=ea6c2e7255dce395184768194e6bb0e3&oe=571E2340')
// 			.pipe(fs.createWriteStream('temp.png'))
// 			.on('close', (response) => { resolve(response); })
// 			.on('error', (error) => { reject(error); });
// 	});

// 	let alchemyResult = await alchemy_vision_Pr({
// 		image: fs.createReadStream('temp.png')
// 	});

// 	console.log('alchemyResult: ');
// 	const { age, gender } = alchemyResult.imageFaces[0];
// 	console.log(age, gender);
// })().catch((error) => {
// 	console.error(error);
// });

const dq = new DQ({
	token: config.token,
	parent: config.parent
});

dq.on('message', (message) => {
	const { to, text, photo } = message;

	let moduleResponse;

	if (text) {
		moduleResponse = dq.initModule(text);
		dq.send({ to, text: moduleResponse });
	} else if (photo) {
		// do something with photo
		dq.send({ to, text: 'Got an Image!' });
	}
})


dq.listen((err) => {
	if (err) logger.error(err);
});
