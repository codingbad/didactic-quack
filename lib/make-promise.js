export default function makePromise(action, context) {
	return function (...args) {
		// console.log(context);
		return new Promise((resolve, reject) => {

			// console.log('arags: ', args);
			action.apply(context, [...args, function (error, result) {
				// console.log('result: ');
				// console.dir(result);
				if (error) return reject(error);

				resolve(result);
			}]);
			
		});
	}
}
