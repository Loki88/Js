var ControlBox = new Class({
	Implements: Options,
	
	options: {
		offsetSize: 4,

		bColor: 'black',

		itemHighLighted:
		{
			'border-color': 'yellow',
		},
	},

	initialize: function(element, options)
	{
		this.setElement(element);
		this.setOptions(options);
	},

	setElement: function(element)
	{
		switch(typeOf(element))
		{
			case 'string': this.element = $(element); break;
			case 'element': this.element = element; break;
			default: return false;
		}
		this.wrap();
	},

	wrap: function()
	{
		this.wrapper = new Element('div');
		var size = this.element.getSize();
		var offsetSize = this.options.offsetSize;
		var styles = this.element.getStyles('display', 'position', 'z-index', 'margin-left', 'margin-top',
			'margin-bottom', 'margin-right', 'top', 'left');
		this.wrapper.setStyles({
			display: 'inline-block',
			position: styles.position,
			'z-index': styles['z-index']+1,
			'margin-top': styles['margin-top']-offsetSize,
			'margin-left': styles['margin-left']-offsetSize,
			'margin-bottom': styles['margin-bottom']-offsetSize,
			'margin-right': styles['margin-right']-offsetSize,
			'top': styles['top']-offsetSize,
			'left': styles['left']-offsetSize,
			'height': size.y,
			'width': size.x,
			'border': offsetSize+'px solid '+this.options.bColor,
			opacity: 0.8,
		});
		this.controlBar = new Element('div');
		this.controlBar.setStyles({
			display: 'block',
			position: 'absolute',
			height: size.y/4,
			width: size.x,
			top: 0+'px',
			'background-color': this.options.bColor,
			opacity: 0.5,
			'z-index': 2,
		});
		this.controlBar.addEvents({
			mouseenter: function(event)
			{
				this.setStyle('opacity', 0.8);
			},
			mouseleave: function(event)
			{
				this.setStyle('opacity', 0.5);
			}
		});
		var wrapper = this.wrapper;
		wrapper.adopt(this.controlBar);
		var highlight = this.options.itemHighLighted;
		this.element.addEvents({
			mouseenter: function(event)
			{
				wrapper.wraps(this);
				// this.setStyles(highlight);
			},
			mouseleave: function(event)
			{
				this.replaces(wrapper);
				// if($defined(defaultStyle))
				// 	this.setStyles(defaultStyle);
				// else
				// 	this.removeProperty('styles');
			},
		});
	},

});


var Controller = new Class({
	Implements: Options,

	options: {
		
	},

	initialize: function(controller, options)
	{
		this.setController(controller);
		this.setOptions(options);
	},

	setController: function(controller)
	{
		if($defined(this.controller))
			this.controller.removeEvent('action');
		switch(typeOf(controller))
		{
			case 'string': this.controller = $(controller); break;
			case 'element': this.controller = controller; break;
			default: return false;
		}
		this.controller.addEvent('action', this.respondToInteraction.bind(this));
	},

	getController: function()
	{
		if($defined(this.controller))
			return this.controller;
		else
			return false;
	},

	setDisplay: function(display)
	{
		switch(typeOf(display))
		{
			case 'string': this.display = $(display); break;
			case 'element': this.display = display; break;
			default: return false;
		}
	},

	getDisplay: function()
	{
		if($defined(this.display))
			return this.display;
		else
			return false;
	},

	respondToInteraction: function(event)
	{
		var item = event.retrieve('item');
		this.display.grab(item);
		var wrapper = new ControlBox(item);
		console.log(wrapper);
		
	}
});