var Carousel = new Class({
	
	Implements: [Options, Events],
	
	options: {
		height: '300px',
		width: '600px',
		color: 'black',
		left: '0px',
		top: '0px',
		margin: '10px 10px 10px 10px',
		text_color: 'yellow',
		border: 'solid',
		border_radius: '10px',
		border_width: '1px',
		border_color: 'black',
		slider_visibility: 'hover',
		image_choice: false,
		slider_left: './img/left_arrow.png',
		slider_right: './img/right_arrow.png',
		images:{
			links: [],
			start: 0,
			length: 0,
			current: 0,
			cicle_time: '5000',
		},
		morph:{
			fps: 70,
			duration: '1500',
			transition: Fx.Transitions.Expo.easeInOut,
		},
		play: './img/play.png',
		pause: './img/pause.png',
	},

	initialize: function(options, element)
	{
		this.setOptions(options);
		this.images = [];
		//element represents the box
		if(this.setBox(element) && $defined(this.options.images.links))
		{
			this.options.images.length = this.options.images.links.length;
			this.start();
		}
	},

	setBox: function(element)
	{
		if($defined(element))
		{
			this.element = element;
			this.element.setStyles({
				display: 'block',
				position: 'relative',
				left: this.options.left,
				top: this.options.top,
				width: this.options.width,
				height: this.options.height,
				"background-color": this.options.color,
				color: this.options.text_color,
				border: this.options.border,
				'border-width': this.options.border_width,
				"border-radius": this.options.border_radius,
				'border-color': this.options.border_color,
				margin: this.options.margin,
				padding: '0px',
			});
			this.setSliders();
			this.setSlideShow();
			this.setControls();
			return true;
		}
		else
			return false;
	},

	setSliders: function()
	{
		var sliders_width = (this.options.width.toFloat()/10)+this.options.width.replace(this.options.width.toFloat(), '');
		this.left_slider = new Element('div', {
			styles: {
				display: 'block',
				position: 'absolute',
				float: 'left',
				width: sliders_width,
				height: '100%',
				opacity: 0,
				'background-color': 'white',
				'z-index': 2,
			}
		});
		this.right_slider = this.left_slider.clone().setStyles({
			float: 'right',
			right: '0px',
		});
		this.element.adopt(this.left_slider, this.right_slider);
		var left_arrow = new Element('img', {
			styles:{
				display: 'block',
				position: 'relative',
				width: '90%',
				'margin': 'auto',
				cursor: 'pointer',
			},
			src: this.options.slider_left,
		});
		this.left_slider.adopt(left_arrow);
		var arrow_margin = (this.options.height.toFloat()-left_arrow.getStyle('height').toFloat())/2+
			this.options.height.replace(this.options.height.toFloat(), '');
		left_arrow.setStyle('margin-top', arrow_margin);
		var right_arrow = left_arrow.clone().set('src', this.options.slider_right);
		this.right_slider.adopt(right_arrow);
		this.left_slider.addEvents({
			'mouseover': this.sliderMouseIn,
			'mouseout': this.sliderMouseOut,
		});
		this.right_slider.addEvents({
			'mouseover': this.sliderMouseIn,
			'mouseout': this.sliderMouseOut,
		});
		var lslide = this.slideLeft.bind(this);
		var rslide = this.slideRight.bind(this);
		left_arrow.addEvent('click', lslide);
		right_arrow.addEvent('click', rslide);
	},

	setSlideShow: function()
	{
		this.slideShow = new Element('div', {
			styles: {
				display: 'block',
				position: 'relative',
				height: '100%',
				'padding': '0px '+(this.left_slider.getSize().x+2)+'px',
				width: 'auto',
				overflow: 'hidden',
			}
		});
		this.element.adopt(this.slideShow);
	},

	setControls: function()
	{
		this.controlBox = new Element('div', {
			styles:{
				display: 'block',
				position: 'absolute',
				'z-index': '-1',
				border: 'solid',
				'border-radius': this.options.border_radius,
				'border-color': 'black',
				'border-width': '1px',
				'background-color': 'black',
				height: this.options.height.toFloat()/4+this.options.height.replace(this.options.height.toFloat(), ''),
				width: this.options.width.toFloat()/2+this.options.width.replace(this.options.width.toFloat(), ''),
				'margin-left': this.options.width.toFloat()/4+this.options.width.replace(this.options.width.toFloat(), ''),
				overflow: 'hidden',
			morph: this.options.morph,
			}
		});
		this.element.adopt(this.controlBox);
		var slider = new Element('div', {
			styles:{
				display: 'block',
				position: 'absolute',
				'z-index': 1,
				border: 'solid',
				'border-color': 'gray',
				'border-width': '1px',
				'background-color': 'gray',
				height: '15%',
				width: '100%',
				cursor: 'pointer',
				top: '85%',
			},
		});
		this.controlBox.adopt(slider);
		var top = this.options.height.toFloat() - this.controlBox.getSize().y + slider.getSize().y;
		this.controlBox.setStyle('top', top+"px");
		this.controlBox.store('closed', top+'px');
		this.controlBox.store('opened', top+this.controlBox.getSize().y*0.75+'px');
		this.controlBox.store('open', false);
		slider.addEvent('click', this.slideControl.bind(this.controlBox));
		var play = new Element('img', {
			styles:{
				display: 'block',
				position: 'relative',
				height: '50%',
				top: '25%',
				float: 'left',
				'margin-left': '10px',
				'margin-right': '10px',
				cursor: 'pointer',
				opacity: '0.5',
			},
			src: this.options.play,
		});
		var pause = play.clone().set('src', this.options.pause);
		this.controlBox.adopt(play);
		this.controlBox.adopt(pause);
		var margin = (this.controlBox.getSize().x-(play.getSize().x+pause.getSize().x+22))/2;
		play.setStyle('margin-left', margin+'px');
		pause.setStyle('margin-right', margin+'px');
		var opacity = function(opacity)
		{
			this.setStyle('opacity', opacity)
		}
		play.addEvents({
			'mouseover': opacity.bind(play, 1),
			'mouseout': opacity.bind(play, 0.5),
			'click': this.run.bind(this),
		});
		pause.addEvents({
			'mouseover': opacity.bind(pause, 1),
			'mouseout': opacity.bind(pause, 0.5),
			'click': this.stop.bind(this),
		});
	},

	slideControl: function(event)
	{
		if(this.retrieve('open'))
		{
			this.store('open', false);
			this.morph({top: this.retrieve('closed'),});
		}
		else
		{
			this.store('open', true);
			this.morph({top: this.retrieve('opened'),});
		}
	},

	getImage: function(number)
	{
		if(!$defined(this.images[number]))
		{
			var image = new Element('img', {
				styles: {
					display: 'block',
					position: 'absolute',
					height: '100%',
					visibility: 'hidden',
					float: 'left',
				},
				src: this.options.images.links[number],
				morph: this.options.morph,
			});
			this.images[number] = image;
			this.slideShow.adopt(this.images[number]);
			var slide_size = this.slideShow.getSize();
			var image_size = image.getSize();
			var margin = (slide_size.x-image_size.x-
					this.slideShow.getStyle('padding-left').toFloat()*2)/2;
			image.store('margin', margin);
			image.setStyles({
				'margin-left': margin,
				'margin-right': margin,
			});
			//image.setSize()
		}
	},

	sliderMouseIn: function(event)
	{
		this.setStyle('opacity', 0.5);
	},

	sliderMouseOut: function(event)
	{
		this.setStyle('opacity', 0);
	},

	slideLeft: function(event)
	{
		var previous = this.normalizeNumber(this.getCurrent()-1);
		this.setCurrent(previous);
		this.show();
	},

	slideRight: function(event)
	{
		var next = this.normalizeNumber(this.getCurrent()+1);
		this.setCurrent(next);
		this.show();
	},

	setCurrent: function(number)
	{
		var current = this.getCurrent(); 
		var image = this.images[current];
		if($defined(image))
		 	image.setStyle('visibility', 'hidden');
		this.setOptions({images:{
			current: number,
		}});
		this.getImage(number);
		this.images[this.getCurrent()].setStyle('visibility', 'visible');
	},

	normalizeNumber: function(number)
	{
		if(number < 0)
			number = (this.options.images.length + number) % this.options.images.length;
		if(number >= this.options.images.length)
			number = number%this.options.images.length;
		return number;
	},

	getCurrent: function()
	{
		return this.options.images.current;
	},

	getPrevious: function()
	{
		var previous = this.normalizeNumber(this.getCurrent()-1);
		if(!$defined(this.images[previous]))
		{
			this.getImage(previous);
		}
	},

	getNext: function()
	{
		var next = this.normalizeNumber(this.getCurrent()+1);
		if(!$defined(this.images[next]))
		{
			this.getImage(next);
		}
	},

	start: function(number)
	{
		if($defined(this.options.images.length))
			this.options.images.length = this.options.images.links.length;
		if(!$defined(number))
			number = this.getCurrent();
		else
			number = this.normalizeNumber(number);
		this.setCurrent(number);
		this.show();
	},

	show: function()
	{
		/*this.images[this.getCurrent()].setStyle('visibility', 'visible');*/
		this.getPrevious();
		this.getNext();
	},

	run: function(event)
	{
		if(!$defined(this.intervalID))
		{
			var runImages = function()
			{
				var current = this.normalizeNumber(this.getCurrent()+1);
				 
				this.setCurrent(current);
				this.show();
			}
			this.intervalID = runImages.periodical(this.options.images.cicle_time, this);
		}
	},

	stop: function(event)
	{
		if($defined(this.intervalID))
		{
			clearInterval(this.intervalID);
			this.intervalID = undefined;
		}
	},
});

window.addEvent('domready', function(){
	var carousel = new Carousel({images:{links: ['./img/images/mele.jpeg', './img/images/bonsai.jpeg', './img/images/earth.png']}}, $(document).getElement('.carousel'));
});