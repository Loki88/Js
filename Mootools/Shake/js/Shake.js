Element.Properties.initialDimensions = {
	get: function()
	{
        return this.initialDimensions;
    },
 
    set: function(value)
    {
    	this.initialDimensions = value;
    }
}

var Shake = new Class({
	Implements: Options,

	options: {

		morph: {
			fps: 70,
			duration: 200,
			link: 'chain',
			unit: 'px',
		},

		events: {
			click: function(){alert('click example');},
		},

		travel: [1, [1,2], 4, [3,2], 3],

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
			if(el.retrieve('setted', false))
			{
				var initDim = Object.map(el.getStyles('margin-top', 'margin-left', 'margin-bottom', 'margin-right'), function(value, key){
					console.log(value);
					return value.toFloat();
				});
				var coordinates = el.getCoordinates();
				Object.merge(initDim, coordinates);
				console.log(initDim);
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
		console.log(dimensions);
		var numSize = size.toFloat();
		travel.each(function(el){
			if(typeOf(el)=='array')
			{
				var keys = ['margin-'+el[0], 'margin-'+el[1]];
				var values = [dimensions['margin-'+el[0]]+numSize, dimensions['margin-'+el[1]]+numSize];
				var obj = values.associate(keys);
				this.morph(obj);
			}
			else
			{
				var property = 'margin-'+el;
				console.log(property);
				var keys = ['margin-'+el,];
				var values = [dimensions['margin-'+el]+numSize,];
				var obj = values.associate(keys);
				this.morph(obj);
			}
		}, this);
	},

	stopShaking: function()
	{
		var dimensions = this.get('initialDimensions');
		console.log(dimensions);
		this.morph(dimensions);
	},

	mouseover: function(event)
	{
		var shake = undefined;
		if(!$defined(this.options.shake))
			shake = this.shaking.bind(event.target, [this.options.size, this.travel]);
		else
			shake = this.options.shake.bind(event.target, this.travel);
		shake();
	},

	mouseout: function(event)
	{
		var stop = undefined;
		console.log(event.target);
		if(!$defined(this.options.stopShake))
			stop = this.stopShaking.bind(event.target);
		else
			stop = this.options.stopShake.bind(event.target);
		stop();
	},

});