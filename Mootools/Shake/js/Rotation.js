Fx.Rotation = new Class({
	Extends: Fx,
	
	engines: {
		1: 'ie',
		2: 'firefox',
		3: 'safari',
		4: 'chrome',
		5: 'opera',
	},

	initialize: function(element, options)
	{
		this.element = $(element);
		this.detectBrowser();
		this.parent(options);
	},

	detectBrowser: function()
	{
		if (Browser.ie)
		{
			this.prefix = 'ie';
		}

		if(Browser.firefox)
		{
			this.prefix = 'firefox';
		}
		 
		if (Browser.chrome)
		{
		   	this.prefix = 'chrome';
		}

		if (Browser.safari)
		{
		   	this.prefix = 'safari';
		}

		if (Browser.opera)
		{
		   	this.prefix = 'opera';
		}
	},

	set: function(current)
	{
		switch(this.prefix)
		{
			case 'ie':
				var filter = (current/90)%4;
				this.element.setStyles({'-ms-transform': 'rotate('+current+'deg)',
				'filter:progid': 'DXImageTransform.Microsoft.BasicImage(rotation='+filter+')'});
				break;
			case 'firefox':
				this.element.setStyle('-moz-transform', 'rotate('+current+'deg)');
				break;
			case 'opera':
				this.element.setStyle('-o-transform', 'rotate('+current+'deg)');
				break;
			case 'chrome':
			case 'safari':
				this.element.setStyle('-webkit-transform', 'rotate('+current+'deg)');
				break;
		}
	},

	start: function(from, to)
	{
		this.parent(from, to);
	},

});