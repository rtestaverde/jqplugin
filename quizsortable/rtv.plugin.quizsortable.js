(function ($){
	$.fn.toQuizSortable = function(options){
		var cnfg = $.extend({
			labels:{
				buttons:{
					reset: 'Reset'
				}
			}
		}, options);
		$.expr[":"].econtains = function(obj, index, meta, stack){
			return (obj.textContent || obj.innerText || $(obj).text() || "").toLowerCase() == meta[3].toLowerCase();
		}
		return $(this).each(function(){
			function scramble(){
				$('.ordered').removeClass('ordered');
				items = $('ul.textsortable',el).children('li');
				for(var i = 0, len = items.length;i<len;i++){
					var tmp = $(items[i]).remove();
					while((j=Math.floor(Math.random()*len))==i);
					$(items[j]).after(tmp);
				}
				$('ul.textsortable',el).sortable('refresh');
				$('button',el).button('option',{disabled:true});
			}
			var el = $(this);
			$('ul.textsortable',el).sortable({
				cursor: 'crosshair',
				containment: 'parent',
				opacity: 0.6,
				update: function(event,ui){
					items = $(this).children('li');
					for(var i = 0, len = items.length;i<len;i++)if(RtvEnc.off($(items[i]).attr('hash')).join('')!=i+1) {
						var similar = $('li:econtains("'+$(items[i]).text()+'")',$(this)).not($(items[i]));
						if(similar.length){
							for(var j =0;j<similar.length;j++){
								if(RtvEnc.off($(similar[j]).attr('hash')).join('')==i+1){
									var tmporigin = $(items[i]).clone();
									$(items[i]).replaceWith($(similar[j]).clone().addClass('ordered'));
									$(similar[j]).replaceWith(tmporigin.removeClass('ordered'));
								}
							}
						}
						return;
					}else{
						$(items[i]).addClass('ordered');
					}
					$('ul.textsortable',el).sortable('deativate');
					$('button',el).button('option',{disabled:false});
				}
			});
			el.append(
				$(document.createElement('div')).css({'text-align':'right'}).append(
					$(document.createElement('button')
				).button({label:cnfg.labels.buttons.reset,disabled:true}).click(scramble))
			);
			$('ul.textsortable',el).disableSelection();
		});
	}
})(jQuery);
RtvEnc={l: 10,a:'A'.charCodeAt(0),f:'0'.charCodeAt(0),en:function(data){r=Math.floor(Math.random()*10)+1;ls=this.l+r;s=new Array();for(i=0;i<ls;i++)s.push(String.fromCharCode(Math.floor(Math.random()*10)+(Math.floor(Math.random()*10)%2==0?this.a:this.f)));a=String.fromCharCode(ls+this.a);for(i=0,len=data.length;i<len;i++){code= parseInt(data[i])+r+this.a;s[r+i]=String.fromCharCode(parseInt(data[i])+r+this.a);}return a+s.join('')+String.fromCharCode(data.length+this.a);},off: function(data){r=(data.charCodeAt(0)-this.a-this.l);n=data.charCodeAt(data.length-1)-this.a;c=new Array();for(i=0;i<n;i++){c.push(data.charCodeAt(r+i+1)-this.a-r);}return c;}}