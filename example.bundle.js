/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _DQ = __webpack_require__(1);

	var _conf = __webpack_require__(13);

	var _conf2 = _interopRequireDefault(_conf);

	var _intel = __webpack_require__(7);

	var _intel2 = _interopRequireDefault(_intel);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var dq = new _DQ.DQ({
	  token: _conf2.default.token,
	  parent: _conf2.default.parent
	});

	dq.on('message', function (message) {

	  var to = message.to;
	  var text = message.text;
	  var moduleResponse = dq.initModule(text);

	  dq.send({ to: to, text: moduleResponse });
	});

	dq.listen(function (err) {
	  if (err) _intel2.default.error(err);
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.DQ = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _util = __webpack_require__(2);

	var _util2 = _interopRequireDefault(_util);

	var _underscore = __webpack_require__(3);

	var _underscore2 = _interopRequireDefault(_underscore);

	var _request = __webpack_require__(4);

	var _request2 = _interopRequireDefault(_request);

	var _url = __webpack_require__(5);

	var _url2 = _interopRequireDefault(_url);

	var _string = __webpack_require__(6);

	var _string2 = _interopRequireDefault(_string);

	var _intel = __webpack_require__(7);

	var _intel2 = _interopRequireDefault(_intel);

	var _modulesList = __webpack_require__(8);

	var _modulesList2 = _interopRequireDefault(_modulesList);

	var _modules = __webpack_require__(9);

	var _modules2 = _interopRequireDefault(_modules);

	var _events = __webpack_require__(12);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var DQ = exports.DQ = function (_EventEmitter) {
		_inherits(DQ, _EventEmitter);

		function DQ(params) {
			_classCallCheck(this, DQ);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DQ).call(this, params));

			_this._token = params.token;
			_this._host = _url2.default.format({
				protocol: 'https',
				host: 'api.telegram.org',
				pathname: 'bot'
			});
			_this._parent = typeof params.parent === 'undefined' ? null : params.parent;
			_this._recipient = null;
			_this._offset = 0;
			_this._httpGetUpdatesUrl = _this._host + _this._token + '/getUpdates';
			_this._sendMessageUrl = _this._host + _this._token + '/sendMessage';
			_this._moduleList = typeof params.moduleList === 'undefined' ? _modulesList2.default : params.moduleList;
			_this._modules = typeof params.modules === 'undefined' ? _modules2.default : params.modules;
			return _this;
		}

		_createClass(DQ, [{
			key: 'listen',
			value: function listen(cb) {
				var _this2 = this;

				setInterval(function () {

					_this2._getUpdates(function (err) {
						if (err) cb(er);
					});
				}, 3000);
			}
		}, {
			key: 'send',
			value: function send(data, cb) {

				var to = data.to;
				var text = data.text;

				var url = this._sendMessageUrl + "?chat_id=" + to + "&text=" + text;

				(0, _request2.default)(url, function (err, response, body) {

					if (err) cb(err);

					console.log("Message sent.");
				});
			}
		}, {
			key: 'initModule',
			value: function initModule(text) {

				if (this._hasCommand(text)) {

					var moduleName = this._getCommandName(text);

					return this._modules[moduleName](text);
				} else return this._modules.default();
			}
		}, {
			key: '_httpGet',
			value: function _httpGet(cb) {
				var _this3 = this;

				var url = this._httpGetUpdatesUrl + "?offset=" + this._offset;

				(0, _request2.default)(url, function (err, res, body) {

					if (err) cb(err);

					var bodyObj = JSON.parse(body);

					if (bodyObj.ok) {

						var messages = bodyObj.result;

						if (messages.length > 0) {

							_this3._updateOffset(messages);

							cb(null, messages);
						} else {

							_intel2.default.info("No new messages..");

							return cb(null);
						}
					} else return cb("Response looks wrong..");
				});
			}
		}, {
			key: '_getUpdates',
			value: function _getUpdates(cb) {
				var _this4 = this;

				this._httpGet(function (err, messages) {

					if (err) cb(err);

					_this4._eachMessage(messages, function (err, message) {

						if (err) _intel2.default.error(err);

						_this4.emit('message', message);
					});
				});
			}
		}, {
			key: '_eachMessage',
			value: function _eachMessage(msgs, cb) {
				var _this5 = this;

				_underscore2.default.each(msgs, function (msg) {

					var to = _this5._recipient = msg.message.from.id;
					var text = msg.message.text;

					cb(null, {
						to: to,
						text: text
					});
				});
			}
		}, {
			key: '_hasCommand',
			value: function _hasCommand(text) {

				var modules = this._moduleList;

				for (var key in modules) {

					if (modules.hasOwnProperty(key)) {

						if ((0, _string2.default)(text).contains(modules[key])) return true;
					}
				}

				return false;
			}
		}, {
			key: '_getCommandName',
			value: function _getCommandName(text) {

				var modules = this._moduleList;

				for (var key in modules) {

					if (modules.hasOwnProperty(key)) {

						if ((0, _string2.default)(text).contains(modules[key])) return key;
					}
				}
			}
		}, {
			key: '_updateOffset',
			value: function _updateOffset(messages) {

				this._offset = this._getHighestOffset(messages) + 1;
				_intel2.default.info("Updating offset..");
			}
		}, {
			key: '_getHighestOffset',
			value: function _getHighestOffset(messages) {

				var arr = [];

				_underscore2.default.map(messages, function (msg) {

					arr.push(msg.update_id);
				});

				return Math.max.apply(null, arr);
			}
		}]);

		return DQ;
	}(_events.EventEmitter);

	// export default {DQ};

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("util");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("underscore");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("request");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("url");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("string");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("intel");

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	    time: '/time',
	    log: '/log'
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var m = __webpack_require__(10);

	exports.time = function (text) {
	    return "Current time is: " + m().format("h:mma DD/MM/YYYY");
	};

	exports.log = __webpack_require__(11);

	exports.default = function () {

	    return "Hi there! \n \n" + "/time - returns current time. \n" + "/log <project(String)> | <hours(Double)> | <details(String)> - logs hours to db.";
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("moment");

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (text) {

	    var data = text.split("|");

	    var project = data[0].replace('/log', '');
	    var hours = data[1];
	    var details = data[2];

	    if (project) {

	        project = project.trim();

	        if (hours) {

	            hours = hours.trim();

	            if (isFloat(hours)) {

	                if (details) {

	                    details = details.trim();

	                    var hour = {
	                        project: project,
	                        hours: hours,
	                        details: details
	                    };

	                    return "project: " + hour.project + "\nhours: " + hour.hours + "\ndetails: " + hour.details;
	                } else return "<details> missing.";
	            } else return "<hours> must be <double> e.g 1.5";
	        } else return "<hours> missing.";
	    } else return "<project> missing.";
	};

	function isFloat(value) {
	    var x = parseFloat(value);
	    return !isNaN(x);
	}

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = require("events");

/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	  token: "128778707:AAGrHymqEOAy0oTkXZ_8QiZLbue9hHmUjM0",
	  parent: "",
	  credentials: {
	    url: "https://gateway.watsonplatform.net/visual-recognition-beta/api",
	    password: "fIIW07A3acOT",
	    username: "096c58ab-e734-4480-a04c-3730361e20f4"
	  }
	};

/***/ }
/******/ ]);