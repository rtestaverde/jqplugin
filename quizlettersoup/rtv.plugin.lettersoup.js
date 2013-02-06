(function ($){
	$.fn.toLetterSoup = function(options){
		var cnfg = $.extend( {
			numcols: 20,
			numrows: 20,
			cellw: 20,
			cellh: 20,
			words: null,
			positions:{
				wordslist: 'top',
				buttons: 'top'
			}
		}, options);
		var checking = false;
		var sbuffer = '';
		var origin = {y:-1,x:-1};
		var el, words,lettertable;
		var alphabet = 'abcádïefñghéjièlmüníokàpqörìstuóvwyòzç'.toUpperCase();

		function generate(target){
			words = new Array();
			words =  cnfg.words.toUpperCase().split(',');
			words.sort(function() { return 0.5 - Math.random();});
			for(var z=0,len=words.length;z<len;z++)while(putWord(words[z]));
			for(var y=0,ylen=cnfg.numrows;y<ylen;y++)for(var x=0,xlen=cnfg.numcols;x<xlen;x++){
				c=lettertable[y][x]=='#'?alphabet.charAt(Math.floor(Math.random()*alphabet.length)):el.hasClass('test')?lettertable[y][x].fontcolor('red'):lettertable[y][x];
				$(document.createElement('div')).attr('rel',y+'-'+x).html(c).appendTo(target);
			}
		}
		
		function putWord(word){
			var direction = new Array(0,-1,1);
			var ox,oy,dx=0,dy=0;
			while(dx==0&&dy==0){
				dx=direction[Math.floor(direction.length*Math.random())];
				dy=direction[Math.floor(direction.length*Math.random())];
			}
			ox=Math.floor((cnfg.numcols-word.length)*Math.random())+(dx<0?word.length:0);
			oy=Math.floor((cnfg.numrows-word.length)*Math.random())+(dy<0?word.length:0);
			for(i=ox,j=oy,l=0;l<word.length;i+=dx,j+=dy,l++)if(lettertable[i][j]!='#'&&lettertable[i][j]!=word.charAt(l))return true;
			for(i=ox,j=oy,l=0;l<word.length;i+=dx,j+=dy,l++)lettertable[i][j]=word.charAt(l);
			return false;
			
		}
		function initializeTable(){
			lettertable= new Array();
			for(i=0,ylen=cnfg.numrows;i<ylen;i++){
				lettertable[i]=new Array();
				for(j=0,xlen=cnfg.numcols;j<xlen;j++)lettertable[i][j]='#';
			}	
		}
		
		$.expr[":"].econtains = function(obj, index, meta, stack){
			return (obj.textContent || obj.innerText || $(obj).text() || "").toLowerCase() == meta[3].toLowerCase();
		}
		$.fn.letter = function(options){
			var cnfg = $.extend( {
				w: 20,
				h: 20
			}, options);
			return $(this).each(function(){
				var let =$(this);
				let.css({width: cnfg.w, height: cnfg.h, 'float':'left', 'text-align':'center'});
				let.mouseenter(function(){
					if(checking){
						var pos = $(this).attr('rel').split('-');
						pos = {x:parseInt(pos[1]),y: parseInt(pos[0])};
						var r = parseInt(pos.y)==parseInt(origin.y)?3:(parseInt(pos.x)-origin.x)/(parseInt(pos.y)-origin.y);
						var rm = Math.abs(r);
						var rs = r/rm;
						if(rm<=0.5){
							pos.x=parseInt(origin.x);
						}else if(rm<=1){
							pos.x = parseInt(origin.x) +(parseInt(pos.y)-parseInt(origin.y))*rs;
						}else if(rm<=2){
							pos.y= parseInt(origin.y)+(parseInt(pos.x)-parseInt(origin.x))*rs;
						}else{
							pos.y = parseInt(origin.y);
						}
						sbuffer = '';
						$('.cellselected').removeClass('cellselected');
						versor={d:0,x:0,y:0};
						versor.d=pos.x==origin.x?Math.abs(pos.y-origin.y):Math.abs(pos.x-origin.x);
						versor.x = pos.x==origin.x?0:pos.x>origin.x?1:-1;
						versor.y = pos.y==origin.y?0:pos.y>origin.y?1:-1;
						for( var k = 0; k<versor.d;k++){
							var cx = parseInt(origin.x)+k*versor.x;
							var cy = parseInt(origin.y)+k*versor.y;
							var c = $('div[rel='+cy+'-'+cx+']',$(this).parent());
							sbuffer += c.text();
							c.addClass('cellselected');
						}
					}
				});
				let.mouseover(function(){
					$(this).addClass('cellhover');	
				});
				let.mouseout(function(){
					$(this).removeClass('cellhover');	
				});
				let.mousedown(function(event){
					event.preventDefault();
					var p=$(this).attr('rel').split('-');
					if(!checking){
						sbuffer = $(this).text();
						origin.y = p[0];
						origin.x = p[1];
						$(this).addClass('cellselected');
						checking=true;
					}
				});
				let.mouseup(function(){
					checking = false;
					origin.x = origin.y = -1;
					if(sbuffer.length>1){	
						var word = $('b:econtains("'+sbuffer+'"),b:contains("'+sbuffer.split('').reverse().join('')+'")',$(this).parents('.soupframe').children('.wordslist'));
						if(word.length){
							word.replaceWith('<del>'+word.text()+'</del>');
							$('.cellselected',$(this).parent()).addClass('cellverified');
						}
					}
					sbuffer ='';
					$('.cellselected',$(this).parent()).removeClass('cellselected');
					if(!$('b',$(this).parents('.soupframe').children('.wordslist')).length){
						$('button',el).removeAttr('disabled');
					}
				});
				let.disableSelection();
			});
		};
		
		function initializeComponent(){
			initializeTable();
			$('.soupframe',el).empty();
			var w=cnfg.numcols*cnfg.cellw+2;
			var h=cnfg.numrows*cnfg.cellh+2;
			var lettertabcss=(cnfg.positions.wordslist =='bottom' || cnfg.positions.wordslist == 'top')?{width: w,height:h}:{width: w,height:h,'float':'left'};
			var lettertab = $(document.createElement('div')).addClass('lettertable').css(lettertabcss);
			generate(lettertab);
			var wordlistcss=(cnfg.positions.wordslist =='bottom' || cnfg.positions.wordslist == 'top')?{width: w}:{width: 'auto',height:h,'float':'left'};
			var wordlist = $(document.createElement('div')).addClass('wordslist').css(wordlistcss);
			wordlist.html('<b>'+words.sort().join('</b><b>')+'</b>');
			$('.soupframe',el).append(lettertab,wordlist);
			if(cnfg.positions.wordslist =='bottom' || cnfg.positions.wordslist == 'left')
				$('.soupframe',el).append(lettertab,wordlist);
			else
				$('.soupframe',el).append(wordlist,lettertab);
			$('div',lettertab).addClass('cellnormal').letter({w:cnfg.cellw,h:cnfg.cellh});
		}
		return $(this).each(function(){
			el = $(this);
			el.append($(document.createElement('div')).addClass('soupframe'));
			initializeComponent();
			var statusbar = $(document.createElement('div')).addClass('statusbar').css({'clear':'left','text-align':'right'});
			statusbar.append($(document.createElement('button')).text(cnfg.labels.buttons.reset).attr('disabled',true).addClass('btn btn-small')).click(function(){
				initializeComponent();
			});
			el.append(statusbar);
			return el;
		});
	}
})(jQuery);