(function(x){
	var android=navigator.userAgent.indexOf('Android')>-1;
	document.createElement('x-scroller');
	x.xhtml.scrollbox={
		lifecycle:{
			inserted: function(){
				this.xtag.pulldown=this.getAttribute('pulldown')=="none"?false:true;
				this.xtag.pullup=this.getAttribute('pullup')=="none"?false:true;
				if(this.xtag.pullup){
					this.xtag.timer=null;
					x.addEvent(this,'scroll',function(){
						this.xtag.timer&&clearTimeout(this.xtag.timer);
						this.xtag.timer=setTimeout(function(){
							if(this.scrollHeight-this.offsetHeight-this.scrollTop<=1){
								x.trigger(this,'xpullup');
							}
						}.bind(this),100);
					});
				}
				x.trigger(this,'xready');
			},
			removed:function(){
				this.xtag={};
			}
		},
		methods:{
			stopLoading:function(){
				var scroller=this.querySelector('x-scroller');
				if(scroller){
					x.animate(scroller,{transform:"translateY(0px)"},300,'ease',function(){
						x.removeClass(scroller,'loading');
						scroller.style.cssText="";
					});
				}
			},
			showLoading:function(){
				var scroller=this.querySelector('x-scroller');
				if(scroller){
					x.addClass(scroller,'loading');
					x.css(scroller,{transform:"translateY(40px)"});
				}
			}
		},
		events:{
			'touchstart':function(e){
				if(this.xtag.pulldown){
					var scroller=this.querySelector('x-scroller');
					if(!this.xtag.scroller){
						this.xtag.scroller=scroller;
					}
					if(!this.xtag.initPageY&&this.scrollTop==0){
						this.xtag.initPageY=e.changedTouches[0].pageY;
					}
				}
			},
			'touchmove':function(e){
				if(this.xtag.pulldown){
					var pageY=e.changedTouches[0].pageY;
					if(this.xtag.initPageY&&this.xtag.initPageY<pageY){
						e.preventDefault();
						e.stopPropagation();
						if(this.xtag.scroller){
							var top=pageY-this.xtag.initPageY;
							top=top>100?100:top;
							x.css(this.xtag.scroller,{'will-change':'transform',transform:"translateY("+top+"px)"});
							if(this.xtag.initPageY&&pageY-this.xtag.initPageY>60){
								x.addClass(this.xtag.scroller,'active');
							}else{
								x.removeClass(this.xtag.scroller,'active');
							}
						}
					}
					if(!this.xtag.initPageY&&this.scrollTop<=0){
						this.xtag.initPageY=pageY;
					}else if(this.scrollTop>0){
						this.xtag.initPageY=null;
					}
				}
			},
			'touchend':function(e){
				if(this.xtag.pulldown){
					var pageY=e.changedTouches[0].pageY;
					if(this.xtag.initPageY&&this.xtag.scroller&&this.xtag.initPageY<pageY){
						if(pageY-this.xtag.initPageY>60){
							setTimeout(function(){
								x.animate(this.xtag.scroller,{transform:"translateY(40px)"},500,'ease',function(){
									x.removeClass(this.xtag.scroller,'active');
									x.addClass(this.xtag.scroller,'loading');
									x.trigger(this,'xpulldown');
								}.bind(this));
							}.bind(this),600);
						}else{
							x.animate(this.xtag.scroller,{transform:'translateY(0)'},360,'ease',function(){
								x.removeClass(this.xtag.scroller,'active');
								this.xtag.scroller.style.cssText="";
							}.bind(this));
						}
						if(this.xtag.initPageY!=pageY){
							e.stopPropagation();
							e.preventDefault();
						}
					}
					this.xtag.initPageY=null;
				}
			}
		}
	}
	x.xhtml.register('x-scrollbox',x.xhtml.scrollbox);
})(xtag);