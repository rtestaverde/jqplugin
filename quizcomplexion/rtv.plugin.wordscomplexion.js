(function ($){
	$.fn.toWordsComplexion = function(options){
		var cnfg = $.extend( {
			labels: {
				buttons: {
					save: 'Save',
					reset: 'Reset',
					show: 'Show'
				}
			}
		}, options);
		
		$.fn.word = function(options){
			var cnfg = $.extend( {
			}, options);
			return $(this).each(function(){
				var word =$(this);
				word.removeAttr('contenteditable');
				var span=word,input=false;
				word.click(function(){
					if($(this).hasClass('wordcomplexionshow'))return;
					var fsize=word.css('font-size').replace('px','');
					var ffam=word.css('font-family')
					var w=(word.text().length*fsize*0.5)+'px';
					input = $('<input type="text" plh="'+word.text()+'" placeholder="'+word.text().replace(/_/gi,'').trim()+'" value="">').css({width: w,fontSize:fsize,fontFamily:ffam,margin:0,padding:0});
					span=word.replaceWith(input);
					input.blur(function(){
						var el = $(this).parents('div.wordcomplexion');
						$('button',el).removeAttr('disabled');
						var dec = RtvEnc.off(span.attr('hash'));
						for(var k =0,klen=dec.length;k<klen;k++)dec[k]=String.fromCharCode(dec[k]);
						span.text(input.val().length?input.val():input.attr('plh'));
						input.replaceWith(span);
						span.word();
						if(dec.join('')==span.text().trim()){
							span.removeClass('wordcomplexionerror wordcomplexionshow').addClass('wordcomplexionsuccess');
						}else{
							span.removeClass('wordcomplexionsuccess wordcomplexionshow').addClass('wordcomplexionerror');
						}
					})
					input.focus();
				});
			});
		};
		return $(this).each(function(){
			var el = $(this);
			$('span.wordcomplexioninput',el).word();
			var btnbar = $(document.createElement('div')).css({'text-align':'right'});
			btnbar.append($(document.createElement('button')).addClass('btn btn-mini').attr({disabled:true,type:'button'}).text(cnfg.labels.buttons.reset).click(function(){
				$('span.wordcomplexioninput',el).each(function(){
					$(this).removeClass('wordcomplexionsuccess wordcomplexionerror wordcomplexionshow');
					$(this).text($(this).attr('plh'));
				});
				$('span.wordcomplexioninput',el).word();
				$('button',el).attr('disabled',true);
			}));
			btnbar.append($(document.createElement('button')).addClass('btn btn-mini').attr({disabled:true,type:'button'}).text(cnfg.labels.buttons.show).click(function(){
				$('span.wordcomplexioninput',el).each(function(){
					var dec = RtvEnc.off($(this).attr('hash'));
					for(var k =0,klen=dec.length;k<klen;k++)dec[k]=String.fromCharCode(dec[k]);
					$(this).text(dec.join(''));
					$(this).removeClass('wordcomplexionsuccess wordcomplexionerror').addClass('wordcomplexionshow');
				});
				el.button('option',{disabled:true});
			}));
			el.append(btnbar);
			return $(this);
		});
	}
})(jQuery);
RtvEnc={l: 10,a:'A'.charCodeAt(0),f:'0'.charCodeAt(0),en:function(data){r=Math.floor(Math.random()*10)+1;ls=this.l+r;s=new Array();for(i=0;i<ls;i++)s.push(String.fromCharCode(Math.floor(Math.random()*10)+(Math.floor(Math.random()*10)%2==0?this.a:this.f)));a=String.fromCharCode(ls+this.a);for(i=0,len=data.length;i<len;i++){code= parseInt(data[i])+r+this.a;s[r+i]=String.fromCharCode(parseInt(data[i])+r+this.a);}return a+s.join('')+String.fromCharCode(data.length+this.a);},off: function(data){r=(data.charCodeAt(0)-this.a-this.l);n=data.charCodeAt(data.length-1)-this.a;c=new Array();for(i=0;i<n;i++){c.push(data.charCodeAt(r+i+1)-this.a-r);}return c;}}