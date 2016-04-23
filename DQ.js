'use strict';

import util from 'util';

import _ from 'lodash';
import request from 'request';
import URL from 'url';
import string from 'string';
import logger from 'intel';

import modulesList from './lib/modulesList';
import modules from './lib/modules';
import { EventEmitter } from 'events';

export class DQ extends EventEmitter {
	constructor(params) {
		super(params);
		this._token = params.token;
		this._host = URL.format({
			protocol: 'https',
			host: 'api.telegram.org',
			pathname: 'bot'
		});
		this._parent = (typeof params.parent === 'undefined') ? null : params.parent;
		this._recipient = null;
		this._offset = 0;
		this._httpGetUpdatesUrl = this._host + this._token + '/getUpdates';
		this._sendMessageUrl = this._host + this._token + '/sendMessage';
		this._moduleList = (typeof params.moduleList === 'undefined') ? modulesList : params.moduleList;
		this._modules = (typeof params.modules === 'undefined') ? modules : params.modules;
	}

	listen(cb) {
		setInterval(() => {

			this._getUpdates((err) => {
				if (err) cb(er);
			});

		}, 3000);

	}
	send(data, cb) {

		const to = data.to;
		const text = data.text;

		const url = this._sendMessageUrl + "?chat_id=" + to + "&text=" + text;

		request(url, (err, response, body) => {

			if (err) cb(err);

			console.log("Message sent.")
		});
	}

	initModule(text) {

		if (this._hasCommand(text)) {

			const moduleName = this._getCommandName(text);

			return this._modules[moduleName](text);

		} else return this._modules.default();
	}

	_httpGet(cb) {

		const url = this._httpGetUpdatesUrl + "?offset=" + this._offset;

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

		_.forEach(msgs, (msg) => {

			const to = this._recipient = msg.message.from.id;
			const text = msg.message.text;

			cb(null, {
				to,
				text
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


}

// export default {DQ};
