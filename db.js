const Datastopr = require('nedb');

const session = new Datastore({ filename: __dirname+'/db/sesstions.db'});

module.sessions = sessions;
