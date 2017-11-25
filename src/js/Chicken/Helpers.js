Chicken.helper('uiNumber', (params) => {

	// Get value
	let nr = parseInt(Chicken.getValue(params[0]));
	return window.numbers[nr];	
	
});