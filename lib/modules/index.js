import m from 'moment';


exports.time = (text) => "Current time is: " + m().format("h:mma DD/MM/YYYY") ;

exports.start = () => "Hi there! \n\n Upload your selfie to see some cool stuff!";

exports.default = async (text, to) => {

	// return "ABCBASIFHASIFHKA";
};
