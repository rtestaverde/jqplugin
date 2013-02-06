toSvgLineGameHelper={
    drawline: function(e,src,lc){
        var prefix = $(src).attr('id').split('_')[0];
        var frame = $(src).parentsUntil($('[activeline]')).parent();
        do{
            unique = prefix+'_line_'+Math.floor(Math.random()*100);
        }while($('#'+unique).length>0);
        var lc = $(src).attr('linecolor')||'#aaf';
        var line = RtvSvg.line($(src).attr('cx'),$(src).attr('cy'),$(src).attr('cx'),$(src).attr('cy'),lc,3,null,{id:unique});
        $(src).parent().append(line);
        frame.attr('activeline',unique);
        frame.bind('mousemove',function(e){
            var el = $(this);
            if(el.attr('activeline'))$('#'+el.attr('activeline')).attr('x2',(e.pageX-2-el.offset().left)).attr('y2',(e.pageY-2-el.offset().top));
        });
        frame.html(frame.html());
    },
    endline: function(e,src){
        var frame = $(src).parentsUntil($('[activeline]')).parent();
        if(frame.attr('activeline')){
            frame.unbind('mousemove');
            var line = $('#'+frame.attr('activeline'));
            var x1 = line.attr('x1');
            var y1 = line.attr('y1');
            var x2 = $(src).attr('cx');
            var y2 = $(src).attr('cy');
            line.attr('x2',x2).attr('y2',y2);
            if($('line[x1='+x1+'][y1='+y1+'][x2='+x2+'][y2='+y2+']').length>1)line.remove();
            frame.attr('activeline',false);
        }
    }
};
(function($){
    $.fn.toSvgLineGame=function(options){
        var cnfg = $.extend({
            linecolor: '#cfc',
            marker:{
                radius: 5,
                border: 4,
                fill: '#ffc',
                stroke: 'black'
            },
            success:{fill:'#ffc',stroke:'#0f0'},
            error:{fill:'#ffc',stroke:'#f00'},
            noasnwer:{fill:'#ffc',stroke:'#ccc'},
			labels:{
				buttons:{
					save: 'check',
					reset: 'reset',
					show: 'show'
				}
			}
        },options);

        return $(this).each(function(){
            var el = $(this);
            $('circle[hash]',el).attr('linecolor',cnfg.linecolor);
            var checkButton = $('<button class="btn btn-mini" type="button">'+cnfg.labels.buttons.save+'</button>').click(function(){
                showButton.attr('disabled',false);
                var linelist=$('line',el);
                var questions = $('circle[hash]',el);
                questions.each(function(){
                    var q = $(this);
                    var hash = RtvEnc.off(q.attr('hash'));
                    var lines = $('line[x1='+q.attr('cx')+'][y1='+q.attr('cy')+']',el);
                    if(!lines.length){
                        q.css({stroke:cnfg.noasnwer.stroke,fill:cnfg.noasnwer.fill});
                        return;
                    }
                    if(lines.length!=hash.length){
                        q.css({stroke:cnfg.error.stroke,fill:cnfg.error.fill});
                        return;
                    }
                    var questionsuccess=true;
                    lines.each(function(){
                        var l=$(this);
                        var check = $('circle[cx='+l.attr('x2')+'][cy='+l.attr('y2')+']').attr('check');
                        if(hash.indexOf(parseInt(check))<0)questionsuccess=false;
                    });

                    if(!questionsuccess){
                        q.css({stroke:cnfg.error.stroke,fill:cnfg.error.fill});
                        return;
                    }
                    q.css({stroke:'#0a0'});
                    return;
                });
                return;
            });

            var resetButton = $('<button class="btn btn-mini" type="button">'+cnfg.labels.buttons.reset+'</button>').click(function(){
                $('line',el).remove();
                $('circle[hash]',el).css({'fill':cnfg.marker.fill,'stroke': cnfg.marker.stroke});
                showButton.attr('disabled',true);
                checkButton.attr('disabled',false);
                return;
            });

            var showButton = $('<button class="btn btn-mini" type="button">'+cnfg.labels.buttons.show+'</button>').click(function(){
                resetButton.click();
                $('circle[hash]',el).each(function(){
                    var q=$(this);
                    var hash = RtvEnc.off(q.attr('hash'));
                    for(var i=0,ilen=hash.length;i<ilen;i++){
                        var a = $('circle[check='+hash[i]+']');
                        RtvSvg.line(q.attr('cx'),q.attr('cy'),a.attr('cx'),a.attr('cy'),cnfg.linecolor,3).appendTo(q.parent());
                    }
                });
                el.html(el.html());
                $(this).attr('disabled',true);
                checkButton.attr('disabled',true);
            });

            el.after(resetButton)
            el.after(checkButton);
            el.after(showButton);
            showButton.attr('disabled',true);
            return el;
        });
    }
})(jQuery);
RtvEnc={l: 10,a:'A'.charCodeAt(0),f:'0'.charCodeAt(0),en:function(data){r=Math.floor(Math.random()*10)+1;ls=this.l+r;s=new Array();for(i=0;i<ls;i++)s.push(String.fromCharCode(Math.floor(Math.random()*10)+(Math.floor(Math.random()*10)%2==0?this.a:this.f)));a=String.fromCharCode(ls+this.a);for(i=0,len=data.length;i<len;i++){code= parseInt(data[i])+r+this.a;s[r+i]=String.fromCharCode(parseInt(data[i])+r+this.a);}return a+s.join('')+String.fromCharCode(data.length+this.a);},off: function(data){r=(data.charCodeAt(0)-this.a-this.l);n=data.charCodeAt(data.length-1)-this.a;c=new Array();for(i=0;i<n;i++){c.push(data.charCodeAt(r+i+1)-this.a-r);}return c;}};
RtvSvg={addattrs: function(attrs){var str='';if(typeof attrs == 'object'){for (a in attrs) str += ' '+a+'="'+attrs[a]+'" ';}return str;},addevents: function(events){var str='';if(typeof events == 'object')for (e in events) str += ' on'+e+'="'+events[e]+'(evt,this)" ';return str;},container:function(x1,y1,w,h,events,attrs){var str = '<svg x="'+x1+'" y="'+y1+'" width="'+w+'" height="'+h+'" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink= "http://www.w3.org/1999/xlink"';str +=RtvSvg.addevents(events);str +=RtvSvg.addattrs(attrs);str +='></svg>';return $(str);},group: function(events,attrs){var str = '<g';str +=RtvSvg.addevents(events);str +=RtvSvg.addattrs(attrs);str +='></g>';return $(str);},circle: function(cx,cy,r,fill,stroke,strokew,events,attrs){var str = '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'"';style='';if(fill)style +='fill:'+fill+';';if(stroke)style +='stroke:'+stroke+';';if(strokew)style +='stroke-width:'+strokew+';';if(style.length)str +=' style="'+style+'" ';str +=RtvSvg.addevents(events);str +=RtvSvg.addattrs(attrs);str +='/>';return $(str);},line: function(x1,y1,x2,y2,stroke,strokew,events,attrs){var str = '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'"';style='';if(stroke)style +='stroke:'+stroke+';';if(strokew)style +='stroke-width:'+strokew+';';if(style.length)str +=' style="'+style+'" ';str +=RtvSvg.addevents(events);str +=RtvSvg.addattrs(attrs);str +='/>';return $(str);},text: function(x,y,txt,fill,stroke,strokew,events,attrs){var str = '<text x="'+x+'" y="'+y+'"';style='';if(fill)style +='fill:'+fill+';';if(stroke)style +='stroke:'+stroke+';';if(strokew)style +='stroke-width:'+strokew+';';if(style.length)str +=' style="'+style+'" ';str += '>'+txt+'</text>';return $(str);}};