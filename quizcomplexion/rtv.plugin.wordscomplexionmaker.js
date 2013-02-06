(function ($){
	$.fn.toWordsComplexionMaker = function(options){
		var cnfg = $.extend( {
			labels: {
				buttons: {
					save: 'Save',
					reset: 'Reset',
					show: 'Show'
				}
			}
		}, options);
		
		return $(this).each(function(){
			var el = $(this);
			var textarea = $('textarea',el);
			textarea.htmlarea({toolbar: [
					[{
						css: 'code',
						text: 'select text',
						action: function(btn){
							var html = $('<p>'+this.getSelectedHTML()+'</p>').text();
							this.pasteHTML(' [%'+this.getSelectedHTML().trim()+'%] ');
						}
					}],
					[{
						css: 'save',
						text: 'save',
						action: function(btn){
							var html = this.toString();
							console.log(html);
							var tags = html.match(/\[%(\s*[\w\d\'\"גהאבךכטיןמםלצפעףüûשתסח\-|]+\s*)+%\]/gi);
							for(var j = 0, jlen =  tags.length;j<jlen;j++){
								var text = tags[j].replace('[%','').replace('%]','').trim();
								placeholder = '';
								if(text.indexOf('|')>-1){
									tmp = text.split('|');
									placeholder = tmp[1];
									text = tmp[0];
								}
								var h = new Array();
								for(var c = 0, clen=text.length;c<clen;c++)h.push(text.charCodeAt(c));
								var hash = RtvEnc.en(h);
								if(placeholder.length==0){
									for(var p =0;p<clen;p++)placeholder+='_';
								}
								var inputstring = '<span hash="'+hash+'" class="wordcomplexioninput" plh="'+placeholder+'">'+placeholder+'</span>';
								html=html.replace(tags[j],inputstring);
							}
							frame = $(document.createElement('div')).addClass('wordcomplexion').html(html);
							$('.testgenerated').empty().append(frame);
							$('textarea[id=codice]').val($('.testgenerated').html());	
							frame.toWordsComplexion(cnfg);
						}
					}]
				]});			
			return $(this);
		});	
	}
})(jQuery);
RtvEnc={l: 10,a:'A'.charCodeAt(0),f:'0'.charCodeAt(0),en:function(data){r=Math.floor(Math.random()*10)+1;ls=this.l+r;s=new Array();for(i=0;i<ls;i++)s.push(String.fromCharCode(Math.floor(Math.random()*10)+(Math.floor(Math.random()*10)%2==0?this.a:this.f)));a=String.fromCharCode(ls+this.a);for(i=0,len=data.length;i<len;i++){code= parseInt(data[i])+r+this.a;s[r+i]=String.fromCharCode(parseInt(data[i])+r+this.a);}return a+s.join('')+String.fromCharCode(data.length+this.a);},off: function(data){r=(data.charCodeAt(0)-this.a-this.l);n=data.charCodeAt(data.length-1)-this.a;c=new Array();for(i=0;i<n;i++){c.push(data.charCodeAt(r+i+1)-this.a-r);}return c;}}