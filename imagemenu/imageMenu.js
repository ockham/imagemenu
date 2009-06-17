/**************************************************************

	Script	: Image Menu for prototype & script.aculo.us
	Version	: 0.1
	Authors	: Bernhard Reiter, Samuel Birch
	Desc	: Based upon Samuel Birch's Image Menu 2.2
	Licence	: Open Source MIT Licence
	Ack	: to users ilyak, gf3 on #prototype for helping
	Requires: Prototype v1.6.1 or later

**************************************************************/

var ImageMenu = Class.create({
	
	getOptions: function(){
		return {
			onOpen: false,
			onClose: Class.empty,
			openWidth: 200,
			transition: Effect.Transitions.linear, // TODO: quadOut ?
			duration: 400,
			open: null,
			border: 0
		};
	},

	initialize: function(elements, options){
		this.options = this.getOptions();
		if (options.onOpen)	this.options.onOpen = options.onOpen;
		if (options.onClose)	this.options.onClose = options.onClose;
		if (options.openWidth)	this.options.openWidth = options.openWidth;
		if (options.transition) this.options.transition = options.transition;
		if (options.duration)	this.options.duration = options.duration;
		if (options.open)	this.options.open = options.open;
		if (options.border)	this.options.border = options.border;

		this.options.duration = this.options.duration / 1000; // seconds, as opposed to mootols' milliseconds

		this.elements = elements;
		this.widths = {};
		this.widths.closed = parseInt(this.elements[0].getStyle('width'));
		this.widths.openSelected = this.options.openWidth;
		this.widths.openOthers = Math.round(((this.widths.closed*this.elements.length) - (this.widths.openSelected+this.options.border)) / (this.elements.length-1));		

		this.elements.each(function(el,i){
			el.observe('mouseenter', function(e){
				e.stop();
				this.reset(i);
				
			}.bind(this));
			
			el.observe('mouseleave', function(e){
				e.stop();
				this.reset(this.options.open);
				
			}.bind(this));
			
			var obj = this;
			
			el.observe('click', function(e){

				if(obj.options.onOpen){
					new Event(e).stop();
					if(obj.options.open == i){
						obj.options.open = null;
						obj.options.onClose(this.href, i);
					}else{
						obj.options.open = i;
						obj.options.onOpen(this.href, i);
					}
					
					
				}
				
			})
			
		}.bind(this));
		
		if(this.options.open){
			if(Object.isNumber(this.options.open)){
				this.reset(this.options.open);
			}else{
				this.elements.each(function(el,i){
					if(el.id == this.options.open){
						this.reset(i);
					}
				},this);
			}
		}
		
	},
	
	reset: function(num){
		if(Object.isNumber(num)){
			var width = this.widths.openOthers;
			if(num+1 == this.elements.length){
				width += this.options.border;
			}
		}else{
			var width = this.widths.closed;
		}
		
		var obj = {};
		this.elements.each(function(el,i){
			var w = width;
			if(i == this.elements.length-1){
				w = width+5
			}
			obj[i] = {'width': w};
		}.bind(this));
		
		if(Object.isNumber(num)){
			obj[num] = {'width': this.widths.openSelected};
		}
				
		this.elements.each(function(el,i){
			new Effect.Morph(el, {style: {width: obj[i].width+'px'}, duration: this.options.duration
							, transition: this.options.transition });
		}.bind(this));
	}
	
});

/*************************************************************/
