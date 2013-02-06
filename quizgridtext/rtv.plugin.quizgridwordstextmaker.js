(function ($){
	$.fn.toQuizGridWordsTextMaker = function(options){
		var cnfg = $.extend( {
		}, options);
		return $(this).each(function(){
			var el = $(this);
			var src = $(cnfg.src).val();
			var target = $(cnfg.target);
			target.val('');
			el.empty();
			var groups = src.split(';');
			var groupslabels=[],groupsdata=[];
			for(var i = 0,ilen=groups.length;i<ilen;i++){
				var g=groups[i].split(':');
				groupslabels.push(g[0]);
				groupsdata.push(g[1].split(','));
			}
			var data =[];
			for(var i=0,ilen=groupsdata.length;i<ilen;i++)data=data.concat(groupsdata[i]);
			for(var k=0;k<3;k++)for(var i=0,ilen=data.length;i<ilen; i++)data.push(data.splice(Math.random()*(ilen-i),1)[0]);
			var frame = $('<div>').addClass('gridwordstext').css({width:430}).attr('data',data.join(',')).appendTo(el);
			for(var i=0,ilen=groupslabels.length;i<ilen;i++){
				var cell= $('<div>').addClass('gridwordstextcell').appendTo(frame);
				var check=[];
				for(var j=0,jlen=groupsdata[i].length;j<jlen;j++){
					check.push(data.indexOf(groupsdata[i][j])+1);	
				}
				cell.attr('check',RtvEnc.en(check));
				$('<h3>').text(groupslabels[i]).appendTo(cell);
			}
			target.val(el.html());
			el.toQuizGridWordsText();
			return el;
		});	
	}
})(jQuery);
RtvEnc={l: 10,a:'A'.charCodeAt(0),f:'0'.charCodeAt(0),en:function(data){r=Math.floor(Math.random()*10)+1;ls=this.l+r;s=new Array();for(i=0;i<ls;i++)s.push(String.fromCharCode(Math.floor(Math.random()*10)+(Math.floor(Math.random()*10)%2==0?this.a:this.f)));a=String.fromCharCode(ls+this.a);for(i=0,len=data.length;i<len;i++){code= parseInt(data[i])+r+this.a;s[r+i]=String.fromCharCode(parseInt(data[i])+r+this.a);}return a+s.join('')+String.fromCharCode(data.length+this.a);},off: function(data){r=(data.charCodeAt(0)-this.a-this.l);n=data.charCodeAt(data.length-1)-this.a;c=new Array();for(i=0;i<n;i++){c.push(data.charCodeAt(r+i+1)-this.a-r);}return c;}}