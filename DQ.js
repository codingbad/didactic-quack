'use strict';

import util from 'util';
import fs from 'fs';

import _ from 'lodash';
import request from 'request';
import URL from 'url';
import string from 'string';
import logger from 'intel';

import modulesList from './lib/modulesList';
import modules from './lib/modules';
import { EventEmitter } from 'events';
import makePromise from './lib/makePromise.js';

export class DQ extends EventEmitter {
	constructor(params) {
		super(params);
		this._token = params.token;
		this._textHost = URL.format({
			protocol: 'https',
			host: 'api.telegram.org',
			pathname: 'bot'
		});
		this._fileHost = URL.format({
			protocol: 'https',
			host: 'api.telegram.org',
			pathname: 'file/bot'
		})
		this._parent = (typeof params.parent === 'undefined') ? null : params.parent;
		this._recipient = null;
		this._offset = 0;
		this._getUpdatesUrl = `${this._textHost}${this._token}/getUpdates`;
		this._sendMessageUrl = `${this._textHost}${this._token}/sendMessage`;
		this._getFileUrl = `${this._textHost}${this._token}/getFile`;
		this._getDownloadFileUrl = `${this._fileHost}${this._token}`;
		this._moduleList = (typeof params.moduleList === 'undefined') ? modulesList : params.moduleList;
		this._modules = (typeof params.modules === 'undefined') ? modules : params.modules;
	}

	listen(cb) {
		setInterval(() => {


			this._getUpdates((err) => {
				if (err) cb(err);
			});

		}, 3000);

	}

	send(data, cb) {
		const to = data.to;
		const text = data.text;
		const url = `${this._sendMessageUrl}?chat_id=${to}&text=${text}`;
		request(url, (err, response, body) => {
			if (err) cb(err);
			console.log("Message sent.")
		});
	}

	initModule(text) {
		// Check if message text contains any command from list
		if (this._hasCommand(text)) {
			// If it does then fire up specific command
			const moduleName = this._getCommandName(text);
			return this._modules[moduleName](text);
		} else return this._modules.default(); // if Not fire up the default IBM dialog
	}

	_httpGet(cb) {
		const url = this._getUpdatesUrl + "?offset=" + this._offset;

		request(url, (err, res, body) => {
			if (err) cb(err);

			const bodyObj = JSON.parse(body);
			if (bodyObj.ok) {
				const messages = bodyObj.result;
				if (messages.length > 0) {
					this._updateOffset(messages);
					cb(null, messages);
				} else {
					logger.info("No new messages..");
					return cb(null);
				}
			} else return cb("Response looks wrong..");
		});
	}

	_httpGetFileDownloadUrl(fileId, cb) {

		const url = `${this._getFileUrl}?file_id=${fileId}`;

		request(url, (err, res, body) => {

			if (err) cb(err);

			const bodyObj = JSON.parse(body);

			if (bodyObj.ok) {
				const fileDownloadUrl = `${this._getDownloadFileUrl}/${bodyObj.result.file_path}?file_id=${fileId}`;
				cb(null, fileDownloadUrl);
			}
		});
	}

	_httpGetFinalDownloadFile(fileId, cb) {

		this._httpGetFileDownloadUrl(fileId, (err, fileDownloadUrl) => {
			if (err) cb(err);
			cb(null, fileDownloadUrl);
			// this._downloadFile(fileDownloadUrl, 'image.png', () => {
			// 	console.log('file downloaded');
			// })
		});
	}

	// _downloadFile(url, filename, cb) {
	// 	request.head(url, (err, res, body) => {
	// 		if (err) cb(err);
	// 		request(url).pipe(fs.createWriteStream(filename)).on('close', cb);
	// 	});
	// }

	_getUpdates(cb) {
		this._httpGet((err, messages) => {
			if (err) cb(err);
			this._eachMessage(messages, (err, message) => {
				if (err) logger.error(err);
				this.emit('message', message);
			});
		});
	}

	_eachMessage(msgs, cb) {
		_.forEach(msgs, async (msg) => {
			let to, text, photoUrl;
			to = this._recipient = msg.message.from.id;
			if (msg.message.text) {
				text = msg.message.text;
			} else if (msg.message.photo) {
				let photo = this._getLargestFile(msg.message.photo);
				try {
					photoUrl = await makePromise(this._httpGetFinalDownloadFile, this)(photo.file_id);
				} catch (err) {
					cb(err);
					return;
				}
				console.log('URL', photoUrl);
			} else if (msg.message.document) {
				console.log("documents are not supported yet.");
			}

			cb(null, {
				to,
				text,
				photoUrl
			});
		});
	}

	_hasCommand(text) {
		const modules = this._moduleList;
		for (let key in modules) {
			if (modules.hasOwnProperty(key)) {
				if (string(text).contains(modules[key])) return true;
			}
		}

		return false;
	}

	_getCommandName(text) {
		const modules = this._moduleList;
		for (let key in modules) {
			if (modules.hasOwnProperty(key)) {
				if (string(text).contains(modules[key])) return key;
			}
		}
	}

	_updateOffset(messages) {
		this._offset = this._getHighestOffset(messages) + 1;
		logger.info("Updating offset..");
	}

	_getHighestOffset(messages) {
		let arr = [];
		_.map(messages, (msg) => {
			arr.push(msg.update_id);
		});

		return Math.max.apply(null, arr);
	}

	_getLargestFile(arr) {

		return _.maxBy(arr, function (item) { return item.file_size; });
	}
}
