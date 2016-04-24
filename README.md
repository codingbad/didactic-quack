# health-assistant-bot

Wrapper around [Telegram](https://telegram.org/) messenger API.

### Installation & setup

1. Download [Telegram app](https://telegram.org/apps) and set it up.

2. Text to [@BotFather](https://telegram.me/botfather) and follow instructions to create a new bot & get `api_token`.

    See Official docs for [Bot API](https://core.telegram.org/bots).

3. Install npm package.
    ```
    $ npm i health-assistant-bot --save
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
$ npm i webpack -g
$ npm i
$ npm start
```

## License

[MIT license](https://github.com/codingbad/health-assistant-bot/blob/master/LICENSE.md).
