import { DQ } from './DQ.js';
import config from './config/conf.js';
import logger from 'intel';

const dq = new DQ({
    token: config.token,
    parent: config.parent
});

dq.on('message', (message) => {

  const to = message.to;
  const text = message.text;
  const photo = message.photo;

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
