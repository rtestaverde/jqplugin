(function($){
	$.fn.toCrucigrama=function(options){
		var cnfg = $.extend({
			box:{
				width: 430	
			},
			labels: {
				buttons: {
					check: 'Check',
					save: 'Save',
					reset: 'Reset',
					show: 'Show'
				}
			}
		}, options);
		var btncheck;
		$.fn.letter = function(options){
			return $(this).each(function(){
				return $(this).bind('keydown',function(e){
					switch(e.keyCode){
						case 13:case 9:case 27:case 32:case 37:case 38:case 39:case 40:
							e.preventDefault();
							break;
						case 8:
							if(!$(this).val().length){
								$(this).prev('input').focus().val('');
							}
							break;
						default:
							if($(this).val().length)$(this).next('input').focus().val('');
					}
					btncheck.removeAttr('disabled');	
					return;
				}).bind('click',function(){$(this).val('');});
			});
		}
		return $(this).each(function(){
			var el = $(this);
			var rows = $('div.crucigramarow',el);
			el.css({width: cnfg.box.width});
			$('input',el).letter();
			//buttonbar
			var buttonbar = $(document.createElement('div')).addClass('btnbar');
			
			btncheck = $(document.createElement('button')).addClass('btn btn-mini').click(function(){
				for(var i = 0, len =rows.length;i<len;i++){
					var string='';
					$('input',$(rows[i])).each(function(){string+=$(this).val();});
					if(string.length){
						var dec = RtvEnc.off($(rows[i]).attr('hash'));
						for(var k =0,klen=dec.length;k<klen;k++)dec[k]=String.fromCharCode(dec[k]);
						$(rows[i]).addClass(string==dec.join('')?'crucigramarowsuccess':'crucigramarowerror');
					}else
						$(rows[i]).addClass('crucigramarownoanswer');
				}
				btnshow.removeAttr('disabled');
				btnreset.removeAttr('disabled');
			}).text(cnfg.labels.buttons.check).attr('disabled',true);
			
			var btnshow = $(document.createElement('button')).addClass('btn btn-mini').click(function(){
				for(var i=0,len = rows.length;i<len;i++){
					var dec = RtvEnc.off($(rows[i]).attr('hash'));
					for(var k=0,klen=dec.length;k<klen;k++)
						$('input:eq('+k+')',$(rows[i])).val(String.fromCharCode(dec[k]));
				}
			}).text(cnfg.labels.buttons.show).attr('disabled',true);
			
			var btnreset = $(document.createElement('button')).addClass('btn btn-mini').click(function(){
				$('input',el).each(function(){$(this).val('')});
				$('.crucigramarowsuccess,.crucigramarowerror,.crucigramarownoanswer').removeClass('crucigramarowsuccess crucigramarowerror crucigramarownoanswer');
				btncheck.attr('disabled',true);
				btnshow.attr('disabled',true);
				$(this).attr('disabled',true);
			}).text(cnfg.labels.buttons.reset).attr('disabled',true);
			buttonbar.append(btncheck,btnshow,btnreset);
			el.append(buttonbar);
			return el;
		});
	}
})(jQuery);
RtvEnc={l: 10,a:'A'.charCodeAt(0),f:'0'.charCodeAt(0),en:function(data){r=Math.floor(Math.random()*10)+1;ls=this.l+r;s=new Array();for(i=0;i<ls;i++)s.push(String.fromCharCode(Math.floor(Math.random()*10)+(Math.floor(Math.random()*10)%2==0?this.a:this.f)));a=String.fromCharCode(ls+this.a);for(i=0,len=data.length;i<len;i++){code= parseInt(data[i])+r+this.a;s[r+i]=String.fromCharCode(parseInt(data[i])+r+this.a);}return a+s.join('')+String.fromCharCode(data.length+this.a);},off: function(data){r=(data.charCodeAt(0)-this.a-this.l);n=data.charCodeAt(data.length-1)-this.a;c=new Array();for(i=0;i<n;i++){c.push(data.charCodeAt(r+i+1)-this.a-r);}return c;}}