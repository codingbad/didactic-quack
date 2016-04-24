const m = require('moment');

exports.time = (text) => "Current time is: " + m().format("h:mma DD/MM/YYYY") ;

exports.start = () => "Hi there! \n\n Upload your selfie to see some cool stuff!";

exports.default = () => "Sorry, I do not upderstand what do you mean.";
