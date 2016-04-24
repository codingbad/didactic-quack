const Datastore = require('nedb');

const sessions = new Datastore({ filename: __dirname + '/db/sessions.db'});

exports.sessions = sessions;
