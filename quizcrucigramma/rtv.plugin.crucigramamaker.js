(function($){
	$.fn.toCrucigramaMaker=function(options){
		var cnfg = $.extend({
			olwidth: 20,
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
		
		$.fn.letter = function(options){
			var cnfg = $.extend( {
				classname: 'crucigramaletter',
				width: 20,
				key: false,
				keyclass: 'crucigramakeyletter'
			}, options);
			return $(this).each(function(){
				var icell=$('<input type="text" value="" maxlength="1">')
				.addClass(cnfg.classname)
				.css({display:'block','float':'left',width: cnfg.width-2,'text-align':'center'});
				if(cnfg.key)icell.addClass(cnfg.keyclass);
				$(this).replaceWith(icell);
				return $(this);
			});
		}
		function encode(text){
			var h = new Array();
			for(var c = 0, clen=text.length;c<clen;c++)h.push(text.charCodeAt(c));
			return RtvEnc.en(h);
		}
		return $(this).each(function(){
			var el = $(this);
			var words = new Array();
			var key;
			var frame = $('.crucigrama');
			var btn = $(document.createElement('button')).button({label:cnfg.labels.buttons.save}).click(function(){
				frame.empty();
				words = $('textarea',el).val();
				words = words.split(',');
				key = words.shift();
				if(!words.length){console.log('no words found');return el;}
				if(key.length!=words.length){console.log('words number don\'t match key lenght');return el;}
				frame.attr('hash',encode(key));
				var starts = [], ends = [];
				for (var i = 0, len = words.length;i<len;i++){
					starts[i] = words[i].indexOf(key.charAt(i));
					ends[i]= words[i].length - starts[i];
				}
				var min = Math.max.apply(null,starts);
				var max = Math.max.apply(null,ends);
				var num = min+max;
				var w = Math.floor((cnfg.box.width-cnfg.olwidth)/num);
				for (var i = 0, len = words.length;i<len;i++){
					var row = $(document.createElement('div')).addClass('crucigramarow').attr('hash',encode(words[i])).css({overflow:'hidden'});
					row.append($('<div>').addClass('crucigramaol').css({'float':'left',width:cnfg.olwidth}).text(i+1));
					for(var j=0;j<num;j++){
						var cell = $('<div>').addClass('crucigramaempty').css({'float':'left',width:w,height:'1em'});
						row.append(cell);
						if(j>=min-starts[i] && j<min-starts[i]+words[i].length){
							keyletter = (j==min);
							cell.letter({classname: 'crucigrammaletter',width:w,key:keyletter});
						}else{cell.text(' ');}
					}
					frame.append(row);
				}
				
				$('#codice').val('<div class="crucigrama">'+frame.html()+'</div>');
				frame.toCrucigrama({labels: cnfg.labels});
			});
			el.append(btn);
		});
	}
})(jQuery);
RtvEnc={l: 10,a:'A'.charCodeAt(0),f:'0'.charCodeAt(0),en:function(data){r=Math.floor(Math.random()*10)+1;ls=this.l+r;s=new Array();for(i=0;i<ls;i++)s.push(String.fromCharCode(Math.floor(Math.random()*10)+(Math.floor(Math.random()*10)%2==0?this.a:this.f)));a=String.fromCharCode(ls+this.a);for(i=0,len=data.length;i<len;i++){code= parseInt(data[i])+r+this.a;s[r+i]=String.fromCharCode(parseInt(data[i])+r+this.a);}return a+s.join('')+String.fromCharCode(data.length+this.a);},off: function(data){r=(data.charCodeAt(0)-this.a-this.l);n=data.charCodeAt(data.length-1)-this.a;c=new Array();for(i=0;i<n;i++){c.push(data.charCodeAt(r+i+1)-this.a-r);}return c;}}