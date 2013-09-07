window.addEvent('domready', function(){
	var shake = new Shake($$('.shake'));
	console.log($$('.shake')[0].get('initialDimensions'));
});