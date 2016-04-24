# didactic-quack

Wrapper around [Telegram](https://telegram.org/) messenger API.

![NPM Stats](https://nodei.co/npm/didactic-quack.png?downloads=true&downloadRank=true&stars=true)

### Installation & setup

1. Download [Telegram app](https://telegram.org/apps) and set it up.

2. Text to [@BotFather](https://telegram.me/botfather) and follow instructions to create a new bot & get `api_token`.

    See Official docs for [Bot API](https://core.telegram.org/bots).

3. Install npm package.
    ```
    $ npm i didactic-quack --save
    ```

## Usage

#### In `app.js`:

```javascript
import { DQ } from 'didactic-quack';
import config from './config/conf.js';
import imageRecognition from './lib/modules/imageRecognition.js';


const dq = new DQ({ token: config.token });

dq.on('message', async (message) => {

	const { to, text, photoUrl } = message;

	let moduleResponse;

	if (text) {

		moduleResponse = dq.initModule(text);

		dq.send({ to, text: moduleResponse });

	} else if (photoUrl) {

		const { gender, age } = await imageRecognition(photoUrl);

		/** Display gender and age */
		dq.send({ to, text: `You look like ${age.ageRange} and you seem like ${gender.gender}.\n` });
	}
});

dq.listen((err) => {
	if (err) console.error(err);
});
```

#### Run:

 ```
$ node app.js
```

#### Commands:

Command implementations are stored in `Modules`. All modules should be registered in `modulesList.js` for bot to
recognise them and referenced in `modules/index.js`.

#### Default commands:

Text this commands directly to you newly created bot.

* `/time` - returns current time.

* `/log <project> | <hours> | <details>` - returns logged data. (Does not do more. Only parses data and returns in user-friendly way).

`<project>` - `String`

`<hours>` - `Double`

`<details>` - `String`

## Changelog:

`v0.3.0` - Refactored almost all. Added modules. Offset now stored in memory.

`v0.2.2` - Fixed path to `offset.txt`.

`v0.2.0` - Removed `Cron` & `Mongoose`. Code cleanup. Changed project structure.

## ToDo:

* Set up a web hook for a bot to receive new messages automatically. (Get rid of "manual" requests to the server).

## License

[MIT license](https://github.com/frenchbread/didactic-quack/blob/master/LICENSE.md).
