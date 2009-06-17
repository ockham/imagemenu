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
			duration: 0.4, // dureation in seconds
			open: null,
			border: 0
		};
	},

	initialize: function(elements, options){
		this.options = Object.extend(this.getOptions(), options);
		this.elements = elements;
		this.widths = {};
		this.widths.closed = parseInt(this.elements[0].getStyle('width'), 10);
		this.widths.openSelected = this.options.openWidth;
		this.widths.openOthers = Math.round(((this.widths.closed*this.elements.length) - (this.widths.openSelected+this.options.border)) / (this.elements.length-1));		
		this.elements.each(function(el,i){
			el.observe('mouseenter', function(e){
				e.stop();
        // delay so only one effect batch will run at a time
        // without the delay you see stuttering because multiple effects for expanding/contracting are running at the same time
        clearTimeout(this.resetTimer);
				this.resetTimer = this.reset.bind(this, i).delay(0.1);
				
			}.bind(this));
			
			el.observe('mouseleave', function(e){
				e.stop();
        // delay so only one effect batch will run at a time
        // without the delay you see stuttering because multiple effects for expanding/contracting are running at the same time
        clearTimeout(this.resetTimer);
				this.resetTimer = this.reset.bind(this, this.options.open).delay(0.1);
				
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
    var width;
		if(Object.isNumber(num)){
			width = this.widths.openOthers;
			if(num+1 == this.elements.length){
				width += this.options.border;
			}
		}else{
			width = this.widths.closed;
		}
		
		var obj = {};
		this.elements.each(function(el,i){
			var w = width;
			if(i == this.elements.length-1){
				w = width+5;
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
