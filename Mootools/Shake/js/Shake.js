Element.Properties.initialDimensions = {
	get: function()
	{
        return this.initialDimensions;
    },
 
    set: function(value)
    {
    	this.initialDimensions = value;
    }
};

function randomizer(min, max){
	var length = Number.random(min, max);
	var randomTravel = [];
	for(var i=0; i<length; i++)
	{
		var direction = Number.random(1, 4);
		var direction2 = 0;
		if(Number.random(0, 1))
		{
			if(Number.random(0, 1))
			{
				direction2 = direction+1;
				if(direction2 > 4)
					direction2 = direction2 % 4;
			}
			else
			{
				direction2 = direction-1;
				if(direction2<1)
					direction2 = 4;
			}
			randomTravel.append([[direction, direction2]]);
		}
		else
			randomTravel.append([direction]);
	}
	return randomTravel;
};

var Shake = new Class({
	Implements: Options,

	options: {

		morph: {
			fps: 70,
			duration: 200,
			link: 'chain',
			unit: 'px',
		},

		rotation: false,

		repeat: 500,

		random: {
			isRandom: false,
			minTravel: 4,
			maxTravel: 15,
			generator: randomizer,
		},

		events: {
			click: function(){alert('click example');},
		},

		travel: [1, [1,2], 4, [3,2], 3, 2, 3, 1],

		size: '1px',

		map: {
			1: 'top',
			2: 'left',
			3: 'bottom',
			4: 'right',
		},

		shake: this.shaking,

		stopShake: this.stopShaking,

	},

	initialize: function(elements, options)
	{
		this.elements = [];
		this.setOptions(options);
		this.setElements(elements);
		this.ready();
	},

	setElements: function(elements)
	{
		if(typeOf(elements) == 'array')
		{
			if($defined(this.elements))
			{
				this.elements.combine(elements);
			}
			else
			{
				this.elements = elements;
			}
		}
		else
		{
			if($defined(this.elements))
			{
				this.elements.combine(elements);
			}
			else
			{
				this.elements = [elements,];
			}
		}
	},

	ready: function()
	{
		this.elements.each(function(el){
			if(!el.retrieve('setted', false))
			{
				var initDim = Object.map(el.getStyles('margin-top', 'margin-left', 'margin-bottom', 'margin-right'), function(value, key){
					return value.toFloat();
				});
				var coordinates = el.getCoordinates(el.getOffsetParent());
				Object.merge(initDim, coordinates);
				el.set('initialDimensions', initDim);
				el.set('morph', this.options.morph);
				el.store('setted', true);
			}
			el.addEvents(this.options.events);
			if(!$defined(this.options.events.mouseover))
				el.addEvent('mouseover', this.mouseover.bind(this));
			if(!$defined(this.options.events.mouseout))
				el.addEvent('mouseout', this.mouseout.bind(this));
			return el;
		}, this);
		this.setTravel();
	},

	setTravel: function(travel)
	{
		if($defined(travel))
		{
			this.options.travel = travel;
		}
		var map = this.options.map;
		this.travel = this.options.travel.map(function(el){
			if(typeOf(el) == 'array')
			{
				var map2 = el.map(function(el){
					return map[el];
				});
				return map2;
			}
			else
				return map[el];
		});
	},

	shaking: function(size, travel)
	{
		var dimensions = this.get('initialDimensions');
		var numSize = size.toFloat();
		travel.each(function(el){
			if(typeOf(el) != 'array')
				el = [el,];
			var values = [];
			var keys = el.map(function(value){
				var otherValue = '';
				switch(value)
				{
					case 'left': otherValue = 'margin-right'; break;
					case 'right': otherValue = 'margin-left'; break;
					case 'top': otherValue = 'margin-bottom'; break;
					case 'bottom': otherValue = 'margin-top'; break;
				}
				value = 'margin-'+value;
				values.append([dimensions[value]+numSize, dimensions[otherValue]-numSize]);
				return [value, otherValue];
			});
			var obj = values.associate(keys.flatten());
			this.morph(obj);
		}, this);
	},

	stopShaking: function()
	{
		this.get('morph').stop();
		this.removeProperty('style');
	},

	mouseover: function(event)
	{
		var shake = undefined;
		if(this.options.random.isRandom)
		{
			var generator = this.options.random.generator.bind(this, [this.options.random.minTravel, this.options.random.maxTravel]);
			var travel = generator();
			this.setTravel(travel);
		}
		if(!$defined(this.options.shake))
			shake = this.shaking.bind(event.target, [this.options.size, this.travel]);
		else
			shake = this.options.shake.bind(event.target, this.travel);
		if($defined(this.options.repeat))
		{
			var period = this.options.morph.duration * this.travel.length;
			console.log(period);
			this.shakeRepeat = shake.periodical(period);
		}
		else
			shake();
	},

	mouseout: function(event)
	{
		var stop = undefined;
		if($defined(this.options.repeat))
			clearInterval(this.shakeRepeat);
		if(!$defined(this.options.stopShake))
			stop = this.stopShaking.bind(event.target);
		else
			stop = this.options.stopShake.bind(event.target);
		stop();
	},

});