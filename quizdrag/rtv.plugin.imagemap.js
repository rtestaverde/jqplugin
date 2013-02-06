(function($){
	$.fn.toImageMap=function(options){
		var cnfg=$.extend({
			oButtonSave: null,
			sBoxBackground: 'red',
			sBoxTargetClassName: 'imgDragTargetBox',
			iBoxMinWidth : 40,
			iBoxHeight: 20
		},options);
		$.fn.box=function(options){
			var cnfg=$.extend({
				test: 'test',
				iBoxHeight: 20,
				oContainer: null
			},options);
			return $(this).each(function(){
				var box = $(this);
				box.css({position: cnfg.sPosition,background: cnfg.sBoxBackground,top: cnfg.top,left:cnfg.left,width:cnfg.iBoxMinWidth,height:cnfg.iBoxHeight,textAlign: 'center'}).addClass(cnfg.sBoxTargetClassName);
				box.append($(document.createElement('div')).addClass('textcontainer'));
				box.resizable({containment: cnfg.oContainer,minHeight: cnfg.iBoxHeight,minWidth:cnfg.iBoxHeight,maxHeight: cnfg.iBoxHeight,grid:1});
				box.draggable({cursor:'move',containment: cnfg.oContainer,scroll: false,grid:[1,1]});
				box.dblclick(function(){$('[role=dialog]').remove();box.remove();});
				box.click(function() {
					$('<div id="formAddDefinition"><input type="text" value="" /></div>').dialog({
							title: 'Add definition',
							buttons:{
									'save':function(){
											$('.textcontainer',box).text($('input[type=text]',$(this)).val());
											$(this).dialog('close');
											$(this).remove();
											},
									Cancel: function(){
											$(this).dialog('close');
											$(this).remove();
											}
							}
					});
				});
				return $(this);
			})
		}
		return $(this).each(function(){
			var el = $(this);
			el.css({border: '1px solid black'});
			el.disableSelection();
			el.css({position: 'relative'});
			el.parent().css({position:'relative'});
			el.live('selectstart dragstart', function(e){ 
				e.preventDefault(); 
				return false; });
			el.bind('click',function(e){
				var x=Math.floor(e.pageX - el.offset().left);
				var y=Math.floor(e.pageY - el.offset().top);
				while(el.parent().find('div[rel='+(rel = Math.ceil(Math.random()*50))+']').length);
				el.after($(document.createElement('div')).attr('rel',rel).box($.extend({oContainer: el,top:y,left:x,width:cnfg.iBoxMinWidth,sPosition:'absolute'},cnfg)));
			});
			
			var oSaveButton = cnfg.oButtonSave == null ? $('button[value=save]'):cnfg.oButtonSave;
			
			oSaveButton.click(function(){
				var cssStyle = 'div.dragquiz.mapa {overflow: hidden;}\n';
				cssStyle +='dl.dragquiztest.mapa {\n\tmargin: 0px;\n\tpadding: 0px;\n\tmargin-bottom: 20px;\n\tfloat: none;\n\toverflow: visible;\n\tposition: relative;\n}\n';
				
				var dest = $(document.createElement('div')).addClass('dragquiz mapa');
				var dl = $(document.createElement('dl')).addClass('dragquiztest mapa').appendTo(dest);
				dl.attr('style','background: url(\''+el.attr('src')+'\') no-repeat;width: '+el.css('width')+';height: '+el.css('height'));
				var options = $('<div>').addClass('dragquizoptions mapa').appendTo(dest);
				var optionlist = new Array();
				el.parent().find('[rel]').each(function(){
					dl.append($('<dt>&nbsp;</dt>'));
					dl.append($('<dd>...</dd>').css({'position':'absolute','top':$(this).css('top'),'left':$(this).css('left')}).attr('hash',RtvEnc.en($(this).attr('rel'))));
					optionlist.push($('<span>').addClass('dragquizoption').attr('check',$(this).attr('rel')).text($(this).text()));
				});
				optionlist.sort(function(){
						return (Math.round(Math.random())-0.5); 
				});
				for(var i=0,len=optionlist.length;i<len;i++)options.append(optionlist[i]);
				$('textarea[name=code]').val(dest.html());
				$('textarea[name=cssStyle]').val(cssStyle);
				
				return true;
			});
			
			return el;
		});
	}
})(jQuery);
RtvEnc={l: 10,a:'A'.charCodeAt(0),f:'0'.charCodeAt(0),en:function(data){r=Math.floor(Math.random()*10)+1;ls=this.l+r;s=new Array();for(i=0;i<ls;i++)s.push(String.fromCharCode(Math.floor(Math.random()*10)+(Math.floor(Math.random()*10)%2==0?this.a:this.f)));a=String.fromCharCode(ls+this.a);for(i=0,len=data.length;i<len;i++){code= parseInt(data[i])+r+this.a;s[r+i]=String.fromCharCode(parseInt(data[i])+r+this.a);}return a+s.join('')+String.fromCharCode(data.length+this.a);},off: function(data){r=(data.charCodeAt(0)-this.a-this.l);n=data.charCodeAt(data.length-1)-this.a;c=new Array();for(i=0;i<n;i++){c.push(data.charCodeAt(r+i+1)-this.a-r);}return c;}}