import m from 'moment';
import Dialog from './dialog.js';

const pizzaDialog = new Dialog('pizza.xml');

exports.time = (text) => "Current time is: " + m().format("h:mma DD/MM/YYYY") ;

exports.start = () => "Hi there! \n\n Upload your selfie to see some cool stuff!";

exports.default = (text, to) => {
	// const botResponse =  await pizzaDialog.input({
	// 	input: text,
	// 	telegramId: to
	// });
	/** Session... TelegramId */
	// return botResponse;
	return "ABCBASIFHASIFHKA";
};
