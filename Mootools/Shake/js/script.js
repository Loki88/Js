window.addEvent('domready', function(){
	var shake = new Shake($$('.shake'), {size: '2px', random: {isRandom: true,}, morph: {duration: 50,}});
	// var rotation = new Fx.Rotation($('rotate'));
	// rotation.start(0, 360);
});