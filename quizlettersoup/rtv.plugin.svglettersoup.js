toSvgLetterSoupGameHelper={
	drawline: function(e,src,lc){
		var prefix = $(src).attr('id').split('-')[0];
		var el = $('#'+prefix);
		var frame = $('svg',el);
		var activeline = frame.attr('activeline')=='false'?false:frame.attr('activeline');
		var lc = frame.attr('linecolor')||'#aaf';
		var lw = frame.attr('linew')||2;
		var cell = $('#'+src.id.replace('-t-','-c-'));
		var x = parseInt(cell.attr('x'))+cell.attr('width')/2;
		var y = parseInt(cell.attr('y'))+cell.attr('height')/2;
		if(activeline){
			toSvgLetterSoupGameHelper.chekline('#'+activeline,x,y,'#'+prefix);
			return;
		}
		
		do{
			unique = prefix+'-line-'+Math.floor(Math.random()*100);
        }while($('#'+unique).length>0);
		
		var line = RtvSvg.line(x,y,x,y,lc,lw,null,{id:unique});
		frame.append(line);
		$('#'+prefix+'-letterframe').html($('#'+prefix+'-letterframe').html());
		frame = $('svg',$('#'+prefix));
		frame.attr('activeline',unique);
		frame.bind('mousemove',function(e){
			var el = $(this);
			if(el.attr('activeline'))$('#'+el.attr('activeline')).attr('x2',(e.pageX-1-el.offset().left)).attr('y2',(e.pageY-3-el.offset().top));
		});
	},
    chekline: function(lineid,x2,y2,parentid){
		var svgframe = $(parentid+'-svglettertable');
		var frame = $(parentid+'-letterframe');
		var wordslist = $(parentid+'-wordslist');
		svgframe.attr('activeline',false);
		svgframe.unbind('mousemove');
		var line = $(lineid);
		var x1 = parseInt(line.attr('x1'));
		var y1 = parseInt(line.attr('y1'));
		var x2 = parseInt(x2);
		var y2 = parseInt(y2);

		var n = $('line[x1='+x1+'][y1='+y1+'][x2='+x2+'][y2='+y2+']',frame).length+$('line[x1='+x2+'][y1='+y2+'][x2='+x1+'][y2='+y1+']',frame).length;
		if(n>0){
			line.remove();
			return;
		}

		if(x1==x2 && y1==y2){
			line.remove();
			return;
		}
		
		if(Math.abs(x2-x1)!=Math.abs(y2-y1)&&!(x2-x1==0||y2-y1==0)){
			line.remove();
			return;
		}
		
		var cw = parseInt($(parentid+'-c-0-0').attr('width'));
		var cw2=cw/2;
		var sx = (x1-cw2)/cw;
		var ex = (x2-cw2)/cw;
		var sy = (y1-cw2)/cw;
		var ey = (y2-cw2)/cw;
		var sbuffer='';

		if(Math.abs(ex-sx)==0){
			var fromy = Math.min(sy,ey);
			var toy = Math.max(sy,ey);
			for(var y=fromy;y<toy+1;y++){
				sbuffer+= $(parentid+'-t-'+y+'-'+sx).text();
			}
		}else{
			var fromx= Math.min(sx,ex);
			var tox= Math.max(sx,ex);
			for(var x=fromx;x<tox+1;x++){
				var fx=(x-sx)*(ey-sy)/(ex-sx)+sy;
				sbuffer+= $(parentid+'-t-'+Math.abs(fx)+'-'+Math.abs(x)).text();
			}
		}
		
		if(sbuffer.length>1){
			var word = $('b:econtains("'+sbuffer+'"),b:contains("'+sbuffer.split('').reverse().join('')+'")',wordslist);
			if(word.length){
				word.replaceWith('<del>'+word.text()+'</del>');
				line.attr('x2',x2).attr('y2',y2);
				return;
			}
		}
		line.remove();
		return
    },
	mouseover: function(e,src){
		$('#'+src.id.replace('-t-','-c-')).css({fill: '#fcc'});
	},
	mouseout: function(e,src){
		$('#'+src.id.replace('-t-','-c-')).css({fill: '#fff'});
	}
};
(function ($){
	$.fn.toSvgLetterSoup = function(options){
		var cnfg = $.extend( {
			numcols: 20,
			numrows: 20,
			cellw: 20,
			cellh: 20,
			buttonbarcss:{
				textAlign: 'right'
			},
			wordslistcss:{
				fontSize: '14px',
				margin: '5px 10px'
			},
			svgframecss:{
				borderRight: '1px solid red',
				borderBottom: '1px solid red'
			},
			textcss:{
				fontFamily: 'arial',
				fontSize: '14px',
				cursor: 'pointer'
			},
			words: null,
			linecolor: '#f00',
			linew: 1,
			positions:{
				wordslist: 'right',
				buttons: 'bottom'
			}
		}, options);
		var el,words,lettertable,idprefix;
		var alphabet = 'abc�d�ef�gh�j-i�lm��n�ok�pq�r�stu�vwy�z�'.toUpperCase();
		
		function cell(x,y,w,h,t,target,color){
			var xpos = x*w;
			var xtpos = x*w+w/2;
			var ypos = y*h;
			var ytpos = y*h+(h/2)+5;
			var rel = x+'-'+y;
			var ev={
				mousedown:'toSvgLetterSoupGameHelper.drawline',
				mouseover:'toSvgLetterSoupGameHelper.mouseover',
				mouseout:'toSvgLetterSoupGameHelper.mouseout'};
			var c = RtvSvg.rectangle(xpos,ypos,w,h,'#fff','#ccc',1,ev,{id: el.attr('id')+'-c-'+y+'-'+x}).appendTo(target);
			c.css({cursor:'pointer'});
			
			var text = RtvSvg.text(xtpos,ytpos,t,color,null,null,ev,{'text-anchor':'middle',id: el.attr('id')+'-t-'+y+'-'+x}).appendTo(target);
			text.css(cnfg.textcss);
			return;
		}

		function generate(target){
			var words =  cnfg.words;
			words.sort(function(){ return 0.5 - Math.random();});
			for(var z=0,len=words.length;z<len;z++)while(putWord(words[z]));
			var test = el.hasClass('test');
			for(var y=0,ylen=cnfg.numrows;y<ylen;y++)for(var x=0,xlen=cnfg.numcols;x<xlen;x++){
				color = lettertable[y][x]!='#'&& test ?'#f00':'#000';
				c=lettertable[y][x]=='#'?alphabet.charAt(Math.floor(Math.random()*alphabet.length)):lettertable[y][x];
				cell(x,y,cnfg.cellw,cnfg.cellh,c,target,color);
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
			for(i=ox,j=oy,l=0;l<word.length;i+=dx,j+=dy,l++){if(lettertable[i][j]!='#'&&lettertable[i][j]!=word.charAt(l))return true;}
			for(i=ox,j=oy,l=0;l<word.length;i+=dx,j+=dy,l++){lettertable[i][j]=word.charAt(l);}
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

		function initializeComponent(letterframe,wordslist){
			initializeTable();
			var svglettertable = $('svg',letterframe);
			letterframe.empty();
			wordslist.empty();
			wordslist.html('<b>'+cnfg.words.join('</b>'+(cnfg.positions.wordslist =='top'||cnfg.positions.wordslist =='bottom'?' | ':'<br>')+'<b>')+'</b>');
			generate(svglettertable);
			letterframe.append(svglettertable);
			letterframe.html(letterframe.html());
			return;
		}
		
		return $(this).each(function(){
			el = $(this);
			el.empty();
			cnfg.words = el.attr('data').toUpperCase().split(',').sort();
			var w=cnfg.numcols*cnfg.cellw;
			var h=cnfg.numrows*cnfg.cellh;
			idprefix = el.attr('id')+'-';
			var letterframe = $('<div>').attr('id',idprefix+'letterframe');
			var svglettertable = RtvSvg.container(0,0,w,h,null,{'class':'svglettertable','id':idprefix+'svglettertable'}).appendTo(letterframe);
			svglettertable.css(cnfg.svgframecss);
			svglettertable.attr('activeline',false);
			svglettertable.attr('linecolor',cnfg.linecolor);
			svglettertable.attr('linew',cnfg.linew);
			
			var wordslist = $(document.createElement('div')).addClass('wordslist').attr({id:idprefix+'wordslist'}).css(cnfg.wordslistcss);
			
			if(cnfg.positions.wordslist =='left'||cnfg.positions.wordslist =='right'){
				svglettertable.css({'float':'left'});
				wordslist.css({'float':'left'});
			}
			
			if(cnfg.positions.wordslist=='top'||cnfg.positions.wordslist=='left'){
				el.append(wordslist,letterframe);
			}else{
				el.append(letterframe,wordslist);
			}
			initializeComponent(letterframe,wordslist);
			var statusbar = $(document.createElement('div')).addClass('statusbar').css({'clear':'left'}).css(cnfg.buttonbarcss);
			statusbar.append($(document.createElement('button')).text(cnfg.labels.buttons.reset).attr('disabled',false).addClass('btn btn-small')).click(function(){
				el.empty().toSvgLetterSoup(cnfg);
			});
			if(cnfg.positions.buttons=='top'){el.prepend(statusbar)}else{el.append(statusbar);}
			return el;
		});
	}
})(jQuery);


RtvSvg={
	addattrs: function(attrs){
		var str='';
		if(typeof attrs == 'object'){
			for (a in attrs) str += ' '+a+'="'+attrs[a]+'" ';
		}
		return str;
	},
	addevents: function(events){
		var str='';
		if(typeof events == 'object')for (e in events) str += ' on'+e+'="'+events[e]+'(evt,this)" ';
		return str;
	},
	container:function(x1,y1,w,h,events,attrs){
		var str = '<svg x="'+x1+'" y="'+y1+'" width="'+w+'" height="'+h+'" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink= "http://www.w3.org/1999/xlink"';
		str +=RtvSvg.addevents(events);
		str +=RtvSvg.addattrs(attrs);
		str +='></svg>';
		return $(str);
	},
	group: function(events,attrs){
		var str = '<g';
		str +=RtvSvg.addevents(events);
		str +=RtvSvg.addattrs(attrs);
		str +='></g>';
		return $(str);
	},
	circle: function(cx,cy,r,fill,stroke,strokew,events,attrs){
		var str = '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'"';
		style='';
		if(fill)style +='fill:'+fill+';';
		if(stroke)style +='stroke:'+stroke+';';
		if(strokew)style +='stroke-width:'+strokew+';';
		if(style.length)str +=' style="'+style+'" ';
		str +=RtvSvg.addevents(events);
		str +=RtvSvg.addattrs(attrs);
		str +='/>';
		return $(str);
	},
	line: function(x1,y1,x2,y2,stroke,strokew,events,attrs){
		var str = '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'"';
		style='';
		if(stroke)style +='stroke:'+stroke+';';
		if(strokew)style +='stroke-width:'+strokew+';';
		if(style.length)str +=' style="'+style+'" ';
		str +=RtvSvg.addevents(events);
		str +=RtvSvg.addattrs(attrs);
		str +='/>';
		return $(str);
	},
	rectangle: function(x,y,w,h,fill,stroke,strokew,events,attrs){
		var str='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'"';
		var style = '';
		if(fill!==null) style +='fill:'+fill+';';
		if(stroke!==null) style +='stroke:'+stroke+';';
		if(strokew!==null) style +='stroke-width:'+strokew+';';
		if(style.length) str +=' style="'+style+'"';
		str +=RtvSvg.addevents(events);
		str +=RtvSvg.addattrs(attrs);
		str +='/>';
		return $(str);
	},
	text: function(x,y,txt,fill,stroke,strokew,events,attrs){
		var str = '<text x="'+x+'" y="'+y+'"';
		style='';
		if(fill)style +='fill:'+fill+';';
		if(stroke)style +='stroke:'+stroke+';';
		if(strokew)style +='stroke-width:'+strokew+';';
		if(style.length)str +=' style="'+style+'" ';
		str +=RtvSvg.addevents(events);
		str +=RtvSvg.addattrs(attrs);
		str += '>'+txt+'</text>';
		return $(str);
	}
};