Element.Events.action = {
	base: 'click',
	condition: function(event)
	{
		if(event.target.hasClass('action'))
			return true;
		else
			return false;
	},
};

Event.implement({
	storage: {},

	store: function(key, item)
	{
		this.storage = Object.merge(this.storage, {key: item});
		console.log(this.storage)
	},

	retrieve: function(key)
	{
		if($defined(key))
			return this.storage.key;
		else
			return this.storage;
	}
});

var Wrapper = new Class({

	options:{

		controls: {
			close: new Element('div').setStyles({
				'width': 'inherit',
				'height': 'inherit',
				'display': 'block',
				'position': 'relative',
				'float': 'right',
			}),
		},

		input: new Element('input'),

	},

	initialize: function(item, options)
	{
		this.setItem(item);
		this.setOptions(options);
	},

	setItem: function(item)
	{
		switch(typeOf(item))
		{
			case 'string': this.item = $(item); break;
			case 'element': this.item = item; break;
			default: return false;
		}
		this.item.addEvent('click', this.toogleWrap.bind(this));
	},
	

});

var Tool = new Class({
	Implements: [Options, Events],

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
			case 'element': this.element = elements; break;
			default: return false;
		}
	},

	setItem: function(item)
	{
		this.item = item;
	},

	getItem: function()
	{
		return this.item;
	},

	action: function(event, copyId)
	{
		var copy = this.getItem().clone().cloneEvents(this.getItem());
		copy.set('id', copyId);
		event.store('item', copy);
	},
});

var imgId = 0;

var ImageTool = new Class({
	Extends: Tool,

	options: {

		itemStyle: {
			width: '256px',
			height: '256px',
			position: 'relative',
			padding: '4px',
			'background-color': 'grey',
			border: '2px solid',
			cursor: 'pointer',
		},

		itemClass: undefined,

		defaultImage: './img/input/insert-image.png',

		altText: 'Click to insert an image.',
	},

	initialize: function(element, options)
	{
		this.parent(element, options);
		this.setItem();
		this.element.addEvent('action', this.action.bind(this));
	},

	setItem: function(item)
	{
		if(!$defined(item))
		{
			item = new Element('img', {
				'alt': this.options.altText,
				'src': this.options.defaultImage,
			});
			var defaultStyle = null;
			if(!$defined(this.options.itemClass))
			{
				defaultStyle = this.options.itemStyle;
				item.setStyles(defaultStyle);
			}
			else
				item.addClass(this.options.itemClass);
		}
		this.parent(item);
	},

	action: function(event)
	{
		var id = 'img' + imgId;
		imgId += 1;
		this.parent(event, id);
	}
});