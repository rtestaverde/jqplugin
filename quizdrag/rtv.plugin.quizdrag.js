(function ($){
	$.fn.toQuizDrag = function(options){
		var cnfg = $.extend( {
			hoverClass: 'hover',
			tollerance: 'fit',
			questionSuccessClass: 'dragquestionsuccess',
			questionErrorClass: 'dragquestionerror',
			questionNoAnswerClass: 'dragquestionnoanswer'
		}, options);
		checkSuccess= function(hash){
			var question = $('dd[hash='+hash+']').prev('dt');
			question.removeClass(cnfg.questionErrorClass+' '+cnfg.questionNoAnswerClass).addClass(cnfg.questionSuccessClass);
			$('span[rel="testvalue"]').trigger('increase',1);
		};
		checkError = function(hash){
			var question = $('dd[hash='+hash+']').prev('dt');
			question.removeClass(cnfg.questionSuccessClass+' '+cnfg.questionNoAnswerClass).addClass(cnfg.questionErrorClass);
			$('span[rel="testvalue"]').trigger('increase',0);
			return;
		}
		checkNoAnswer = function(hash){
			var question = $('dd[hash='+hash+']').prev('dt');
			question.removeClass(cnfg.questionSuccessClass+' '+cnfg.questionErrorClass).addClass(cnfg.questionNoAnswerClass);
			$('span[rel="testvalue"]').trigger('increase',0);
			return;
		}
		return $(this).each(function(){
			var el = $(this);
			while($('.dragquiz scope['+(scopeid = 'quiztest'+Math.ceil(Math.random()*50))+']').length);
			$('.dragquizoption',el).draggable({
				opacity: 0.5,
				scope: scopeid,
				revert: 'invalid',
				snap: 'ui-droppable',
				snapMode: 'inner',
				snapTolerance: 20
			 });
			$('dd',el).droppable({
				accept:  '.dragquizoption',
				scope: scopeid,
				hoverClass: cnfg.hoverClass,
				tolerance: cnfg.tollerance,
				drop: function(event, ui){
					var el = ui.draggable.clone();
					ui.draggable.hide();
					el.css({ opacity: 1.0, color: 'red', position: 'static','top':0,'left':0});
					$(this).text('').append(el);
				}
			});
			//settings 
			$(this).parent().append('<div class="button-append"><button value="check" type="button" class="btn btn-mini">Check</button><button value="reset" type="button" class="btn btn-mini">Reset</button><button value="show" type="button" class="btn btn-mini">Show</button><span rel="testvaluelabel">Total:&nbsp;</span><span rel="testvalue">0</span></div>');
			$('button[value="check"]',$(this).parent()).click(function(){
				$('span[rel="testvalue"]',$(this).parent()).trigger('reset');
				$('[hash]',el).each(function(){
					var hash = $(this).attr('hash');
					var answer = $(this).find('span').attr('check');
					if(answer){
						RtvEnc.off(hash,1).join('')==answer?checkSuccess(hash):checkError(hash);
					}else{
						checkNoAnswer(hash);
					}
				});
				$('button[value="show"]',el.parent()).attr('disabled',false);
				$('button[value="reset"]',el.parent()).attr('disabled',false);
			});
			$('button[value="reset"]',$(this).parent()).attr('disabled',true).click(function(){
				$('span[rel="testvalue"]',$(this).parent()).trigger('reset');
				$('[reset]',el).remove();
				$('dt',el).removeClass(cnfg.questionSuccessClass+' '+cnfg.questionErrorClass+' '+cnfg.questionNoAnswerClass);
				$('dd',el).text('...').remove('span[check]');
				$('.dragquizoptions span[check]',el).show().css({top:0,left:0});
				$(this).attr('disabled',true);
				$('button[value="show"]',el.parent()).attr('disabled',true);
				$('button[value="check"]',el.parent()).attr('disabled',false);
			});
			$('button[value="show"]',$(this).parent()).attr('disabled',true).click(function(){
				$('span[rel="testvalue"]',$(this).parent()).trigger('reset');
				var answers = new Array();
				$('[hash]',el).each(function(){
					answers[RtvEnc.off($(this).attr('hash'),1).join('')]=$(this).offset();
				});
				$('[check]',el).each(function(){
					span = $(this).clone().appendTo($(this).parent());
					$(this).hide('slow');
					var check=span.attr('check');
					span.css({position:'absolute',top:$(this).offset().top,left:$(this).offset().left}).attr('reset',true).animate({top:answers[check].top ,left: answers[check].left},1000);
				});
				$('button[value="check"]',el.parent()).attr('disabled',true);
				$('button[value="reset"]',el.parent()).attr('disabled',false);
				$(this).attr('disabled',true);
			});
			
			$('span[rel="testvalue"]',el.parent()).bind('increase',function(e,inc){
				val = parseInt($(this).text(),10);
				val +=parseInt(inc,10);
				$(this).text(val);
			});
			$('span[rel="testvalue"]',el.parent()).bind('reset',function(e){
				$(this).text('0');
			});
		});
	}
})(jQuery);
RtvEnc={l: 10,a:'A'.charCodeAt(0),f:'0'.charCodeAt(0),en:function(data){r=Math.floor(Math.random()*10)+1;ls=this.l+r;s=new Array();for(i=0;i<ls;i++)s.push(String.fromCharCode(Math.floor(Math.random()*10)+(Math.floor(Math.random()*10)%2==0?this.a:this.f)));a=String.fromCharCode(ls+this.a);for(i=0,len=data.length;i<len;i++){code= parseInt(data[i])+r+this.a;s[r+i]=String.fromCharCode(parseInt(data[i])+r+this.a);}return a+s.join('')+String.fromCharCode(data.length+this.a);},off: function(data){r=(data.charCodeAt(0)-this.a-this.l);n=data.charCodeAt(data.length-1)-this.a;c=new Array();for(i=0;i<n;i++){c.push(data.charCodeAt(r+i+1)-this.a-r);}return c;}}