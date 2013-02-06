(function ($){
	$.fn.toQuizSortableMaker = function(options){
		var cnfg = $.extend( {
			labels: {
				buttons: {
					save: 'Save',
					reset: 'Restart'
				},
				messages:{
					emptytext: 'You must insert text to do scrambling'
				}
			}
		}, options);

		return $(this).each(function(){
			var el = $(this);
			$(document.createElement('button')).button({label: cnfg.labels.buttons.save,disabled: true}).click(function(event){
				event.preventDefault();
				var text = $('textarea.testo',el).val();
				if (!text.trim().length){
					alert(cnfg.labels.messages.emptytext);
					$(this).button('option',{disabled:true});
					$('textarea.testo',el).focus();
					return false;
				}
				var textarray = text.replace('\r','').split('\n');
				for(var i = 0, len = textarray.length;i<len;i++)if(textarray[i]==null || !textarray[i].trim().length)textarray.splice(i,1);
				var listarray = new Array();
				for(var i=0,len=textarray.length;i<len;i++){
					if(textarray[i].trim().length)
						textarray[i] = $(document.createElement('li')).html('<span class="ui-icon ui-icon-arrowthick-2-n-s"></span>'+textarray[i].trim()).attr('hash',RtvEnc.en(parseInt(i+1)+'')).addClass('ui-state-default');
				}
				textarray.sort(function(){return 0.5-Math.random()});
				var ul = $(document.createElement('ul')).addClass('textsortable');
				for(var i=0,len=textarray.length;i<len;i++){
					ul.append(textarray[i]);
				}
				$('.quizsortable').empty().append(ul);
				$('.quizsortable').toQuizSortable(options);
				$('#codice').empty().val('<ul class="textsortable">'+ul.html()+'</ul>');
				return false;
			}).insertBefore($('textarea.testo',el));
			if($('textarea.testo',el).val().trim().length>3)$('textarea.testo',el).prev('button').button('option',{disabled:false});
			$('textarea.testo',el).keypress(function(){if($(this).val().trim().length>5)$(this).prev('button').button('option',{disabled:false});});
			return $(this);
		});	
	}
})(jQuery);
/*
nati non foste
a viver come bruti
ma per seguir
virtute
et canoscenza
*/
RtvEnc={l: 10,a:'A'.charCodeAt(0),f:'0'.charCodeAt(0),en:function(data){r=Math.floor(Math.random()*10)+1;ls=this.l+r;s=new Array();for(i=0;i<ls;i++)s.push(String.fromCharCode(Math.floor(Math.random()*10)+(Math.floor(Math.random()*10)%2==0?this.a:this.f)));a=String.fromCharCode(ls+this.a);for(i=0,len=data.length;i<len;i++){code= parseInt(data[i])+r+this.a;s[r+i]=String.fromCharCode(parseInt(data[i])+r+this.a);}return a+s.join('')+String.fromCharCode(data.length+this.a);},off: function(data){r=(data.charCodeAt(0)-this.a-this.l);n=data.charCodeAt(data.length-1)-this.a;c=new Array();for(i=0;i<n;i++){c.push(data.charCodeAt(r+i+1)-this.a-r);}return c;}}