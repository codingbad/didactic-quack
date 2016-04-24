import watson from 'watson-developer-cloud';
import fs from 'fs';
import request from 'request';

import credentials from '../../credentials.json';
import makePromise from '../makePromise.js';

const alchemy_vision = watson.alchemy_vision({
	api_key: credentials.alchemy.apikey
});

const alchemy_vision_Pr = makePromise(
	alchemy_vision.recognizeFaces,
	alchemy_vision);

export default async (imgUrl) => {
	await new Promise((resolve, reject) => {
		request(imgUrl)
			.pipe(fs.createWriteStream('temp.png'))
			.on('close', (response) => { resolve(response); })
			.on('error', (error) => { reject(error); });
	});

	let alchemyResult = await alchemy_vision_Pr({
		image: fs.createReadStream('temp.png')
	});

	console.log('alchemyResult: ');
	const { age, gender } = alchemyResult.imageFaces[0];
	console.log(age, gender);

	return { age, gender };
}