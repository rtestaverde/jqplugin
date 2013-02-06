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
	text: function(x,y,txt,fill,stroke,strokew,events,attrs){
		var str = '<text x="'+x+'" y="'+y+'"';
		style='';
		if(fill)style +='fill:'+fill+';';
		if(stroke)style +='stroke:'+stroke+';';
		if(strokew)style +='stroke-width:'+strokew+';';
		if(style.length)str +=' style="'+style+'" ';
		str += '>'+txt+'</text>';
		return $(str);
	}
};

(function($){
	$.fn.toSvgLineGameMaker=function(options){
		var cnfg = $.extend({
		    srcobjectid: 'srclist',
			containerHeight: false,
			marker:{
				radius: 5,
				border: 4,
				fill: '#ffc',
				stroke: 'black'
			}
		},options);
		return $(this).each(function(){
			var el = $(this);
			var prefix = $(this).attr('id');
			var svgwidth= Math.floor(el.width()/3);
			var container = $('<table>').css({width:el.width(),margin:0,padding:0,border:0,borderCollapse:'collapse'}).attr({'cellpadding':0,'cellspacing':0}).appendTo(el);
			var tdquestions = $('<td>').addClass('questions').css({margin:0,padding:0,width: svgwidth}).appendTo(container);
			var tdsvg = $('<td>').addClass('svgframe').css({margin:0,padding:0,width:svgwidth}).appendTo(container);
			var tdanswers = $('<td>').addClass('answers').css({margin:0,padding:0,width:svgwidth}).appendTo(container);
			$('div.questionslist',$('#'+cnfg.srcobjectid)).children('div[check]').each(function(){
			    $(this).clone().appendTo(tdquestions);
			});
			$('div.answerslist',$('#'+cnfg.srcobjectid)).children('div[check]').each(function(){
                $(this).clone().appendTo(tdanswers);
            });
            containerHeight=cnfg.containerHeight?cnfg.containerHeight:Math.max(tdquestions.outerHeight(),tdanswers.outerHeight());
            container.css({height:containerHeight});
			tdsvg.attr('activeline', false);
			var svgframe = RtvSvg.container(0,0,svgwidth,containerHeight,null,{id:prefix+'_framebox'}).appendTo(tdsvg);
			var qn = tdquestions.children('div[check]').length;
			var qrh = Math.floor(containerHeight/qn);
			var counter = 0;
			tdquestions.children('div[check]').each(function(){
			    var qel =$(this);
			    qel.css({height:qrh,textAlign:'right'});
			    do{circleid = prefix+'_startmark_'+Math.floor(Math.random()*100);}while($('#'+circleid).length>0);
			    var h= RtvEnc.en(qel.attr('check').split(','));
			    qel.removeAttr('check');
			    var y = Math.floor(qrh/2+qrh*(counter++)+(cnfg.marker.radius+cnfg.marker.border)/2);
			    RtvSvg.circle(10,y,cnfg.marker.radius,cnfg.marker.fill,cnfg.marker.stroke,cnfg.marker.border,{click:'toSvgLineGameHelper.drawline'},{id:circleid,hash:h}).appendTo(svgframe);
			});
			var an = tdanswers.children('div[check]').length;
            var arh = Math.floor(containerHeight/an);
            counter = 0;
            tdanswers.children('div[check]').each(function(){
                var ael =$(this);
                ael.css({height:arh+'px',textAlign:'left'});
                do{circleid = prefix+'_endmark_'+Math.floor(Math.random()*100);}while($('#'+circleid).length>0);
                var c= ael.attr('check');
                ael.removeAttr('check');
                var y = Math.floor(arh/2+arh*(counter++)+(cnfg.marker.radius+cnfg.marker.border)/2);
                var x = svgwidth-(cnfg.marker.radius+cnfg.marker.border)*2;
                RtvSvg.circle(x,y,cnfg.marker.radius,cnfg.marker.fill,cnfg.marker.stroke,cnfg.marker.border,{click:'toSvgLineGameHelper.endline'},{id:circleid,check:c}).appendTo(svgframe);
            });
			el.html(el.html());
			el.toSvgLineGame(cnfg);
			$('textarea[name=code]').val(el.html());
		});
	}//end toSvgMaker plugin
})(jQuery);
RtvEnc={l: 10,a:'A'.charCodeAt(0),f:'0'.charCodeAt(0),en:function(data){r=Math.floor(Math.random()*10)+1;ls=this.l+r;s=new Array();for(i=0;i<ls;i++)s.push(String.fromCharCode(Math.floor(Math.random()*10)+(Math.floor(Math.random()*10)%2==0?this.a:this.f)));a=String.fromCharCode(ls+this.a);for(i=0,len=data.length;i<len;i++){code= parseInt(data[i])+r+this.a;s[r+i]=String.fromCharCode(parseInt(data[i])+r+this.a);}return a+s.join('')+String.fromCharCode(data.length+this.a);},off: function(data){r=(data.charCodeAt(0)-this.a-this.l);n=data.charCodeAt(data.length-1)-this.a;c=new Array();for(i=0;i<n;i++){c.push(data.charCodeAt(r+i+1)-this.a-r);}return c;}};