(function ($){
	$.fn.toQuizGridWordsText = function(options){
		var cnfg = $.extend( {
			styles:{
				success: 'success',
				error: 'error',
				noanswer: ''
			},
			labels:{
				buttons:{
					save: 'Check',
					reset: 'Reset',
					show: 'Show'
				}	
			}
		}, options);
		$.fn.cell=function(options){
			var cnfg = $.extend({},options);
			return $(this).each(function(){
				var cell = $(this);
				var tit = 'Afegir '+$('h3',cell).text();
				var dlg=$('<div><input name="word" value=""></div>').appendTo(cell);
				dlg.dialog({
					autoOpen: false,
					title: tit,
					resizable: false,
					modal: true,
					show: {
						effect: "blind",
						duration: 500
					},
					hide: {
						effect: "explode",
						duration: 500
					},
					buttons:{
						Ok: function(){
							if($('input',$(this)).val().trim().length>0)cell.append($('<div>'+$('input',$(this)).val()+'</div>'));
							$('input',$(this)).val('');
							$(this).dialog( "close" );
						},
						Cancel: function(){
							$('input',$(this)).val('');
							$(this).dialog( "close" );
						}
					}
				});
				
				$('h3',cell).append($('<button>').addClass('btn btn-mini').html('&raquo;').css({cursor:'pointer',marginLeft:20}).click(function(){
					dlg.dialog('open');
				}));
				return cell;
			});
		};
		return $(this).each(function(){
			var el = $(this);
			$('div.gridwordstextcell',el).cell({});
			$('<button name="check">'+cnfg.labels.buttons.save+'</button>').click(function(){
				$('div.gridwordstextcell',el).each(function(){
					$('button[name=show]',el).removeAttr('disabled');
					var data=$(this).parent().attr('data').split(',');
					var words=[];
					$(this).find('div').each(function(){words.push($(this).text());return;});
					var check = RtvEnc.off($(this).attr('check'));
					if(check.length!=words.legth){
						$(this).addClass(cnfg.styles.error);
						return;
					}
					var success=true;
					for(var i=0,ilen=words.length;i<ilen;i++){
						if(check.indexOf(data.indexOf(words[i])+1)<0)success=false;
					}
					if(success){$(this).addClass(cnfg.styles.success);}else{$(this).addClass(cnfg.styles.error);}
					return;
				});
			}).appendTo(el);
			$('<button name="reset">'+cnfg.labels.buttons.reset+'</button>').click(function(){
				$('div.gridwordstextcell div',el).remove();
				$('.'+cnfg.styles.success+',.'+cnfg.styles.error,el).removeClass(cnfg.styles.success+' '+cnfg.styles.error,el);
				$('button[name=chek]',el).removeAttr('disabled');
				$('button[name=show]',el).attr('disabled',true);
			}).appendTo(el);
			$('<button name="show">'+cnfg.labels.buttons.show+'</button>').click(function(){
				$('<button name="reset">'+cnfg.labels.buttons.reset+'</button>').click();
				$('button[name=chek]',el).attr('disabled',true);
				$('div.gridwordstextcell',el).each(function(){
					var check = RtvEnc.off($(this).attr('check'));
					var data=$(this).parent().attr('data').split(',');
					for(var i=0,ilen=check.length;i<ilen;i++)$(this).append($('<div>').text(data[check[i]-1]));
					return;
				});	
			}).attr('disabled',true).appendTo(el);
			return el;
		});
	}
})(jQuery);
RtvEnc={l: 10,a:'A'.charCodeAt(0),f:'0'.charCodeAt(0),en:function(data){r=Math.floor(Math.random()*10)+1;ls=this.l+r;s=new Array();for(i=0;i<ls;i++)s.push(String.fromCharCode(Math.floor(Math.random()*10)+(Math.floor(Math.random()*10)%2==0?this.a:this.f)));a=String.fromCharCode(ls+this.a);for(i=0,len=data.length;i<len;i++){code= parseInt(data[i])+r+this.a;s[r+i]=String.fromCharCode(parseInt(data[i])+r+this.a);}return a+s.join('')+String.fromCharCode(data.length+this.a);},off: function(data){r=(data.charCodeAt(0)-this.a-this.l);n=data.charCodeAt(data.length-1)-this.a;c=new Array();for(i=0;i<n;i++){c.push(data.charCodeAt(r+i+1)-this.a-r);}return c;}}