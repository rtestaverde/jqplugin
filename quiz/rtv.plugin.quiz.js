(function ($){
	$.fn.toQuiz = function(options){
		var cnfg = $.extend( {
			questionClass: null,
			answerBoxClass: null,
			questionSuccessClass: 'questionsuccess',
			questionErrorClass: 'questionerror',
			questionNoAnswerClass: 'questionnoanswer'
		}, options);
		checkSuccess= function(hash){
			var question = $('li[hash='+hash+']').children('span');
			question.removeClass(cnfg.questionErrorClass+' '+cnfg.questionNoAnswerClass).addClass(cnfg.questionSuccessClass);
			$('span[rel="testvalue"]').trigger('increase',1);
		};
		checkError = function(hash){
			var question = $('li[hash='+hash+']').children('span');
			question.removeClass(cnfg.questionSuccessClass+' '+cnfg.questionNoAnswerClass).addClass(cnfg.questionErrorClass);
			$('span[rel="testvalue"]').trigger('increase',0);
			return;
		}
		checkNoAnswer = function(hash){
			var question = $('li[hash='+hash+']').children('span');
			question.removeClass(cnfg.questionSuccessClass+' '+cnfg.questionErrorClass).addClass(cnfg.questionNoAnswerClass);
			$('span[rel="testvalue"]').trigger('increase',0);
			return;
		}
	
		
		return $(this).each(function(){
			var el = $(this);
			//settings 
			if(cnfg.questionClass)el.removeClass().addClass(cnfg.questionClass);
			$(this).parent().append('<div class="button-append"><button value="check" type="button" class="btn btn-mini">Check</button><button value="reset" type="button" class="btn btn-mini">Reset</button><button value="show" type="button" class="btn btn-mini">Show</button><span rel="testvaluelabel">Total:&nbsp;</span><span rel="testvalue">0</span></div>');
			$('button[value="check"]',$(this).parent()).click(function(){
				$('span[rel="testvalue"]',$(this).parent()).trigger('reset');
				$('[rel="questionblock"]',el).each(function(){
					var answers = new Array();
					var hash = $(this).attr('hash');
					var n = $('input',$(this)).length;
					$('input:checked',$(this)).each(function(){
						answers.push($(this).val());
					});
					if(answers.length){
						RtvEnc.off(hash,n).join()==answers.join()?checkSuccess(hash):checkError(hash);
					}else{
						checkNoAnswer(hash);
					}
				});
				$('button[value="show"]',el.parent()).attr('disabled',false);
				$('button[value="reset"]',el.parent()).attr('disabled',false);
			});
			$('button[value="reset"]',$(this).parent()).attr('disabled',true).click(function(){
				$('span[rel="testvalue"]',$(this).parent()).trigger('reset');
				$('span',el).removeClass(cnfg.questionSuccessClass+' '+cnfg.questionErrorClass+' '+cnfg.questionNoAnswerClass);
				$('input:checked').removeAttr('checked');
				$('li',el).removeClass('answerrigth');
				$(this).attr('disabled',true);
				$('button[value="show"]',el.parent()).attr('disabled',true);
				$('button[value="check"]',el.parent()).attr('disabled',false);
			});
			$('button[value="show"]',$(this).parent()).attr('disabled',true).click(function(){
				$('span[rel="testvalue"]',$(this).parent()).trigger('reset');
				$('[rel="questionblock"]',el).each(function(){
					var hash = $(this).attr('hash');
					var c = $('input',$(this));
					vals = RtvEnc.off(hash,c.length);
					c.each(function(){
						if(jQuery.inArray(parseInt($(this).val()),vals)>-1){
							$(this).parent().addClass('answerrigth');	
						}
					});
					$('span[rel]',$(this)).removeClass(cnfg.questionSuccessClass+' '+cnfg.questionErrorClass+' '+cnfg.questionNoAnswerClass);
				});
				$('button[value="check"]',el.parent()).attr('disabled',true);
				$('button[value="reset"]',el.parent()).attr('disabled',false);
				$(this).attr('disabled',true);
			});
			$('span[rel="testvalue"]',el.parent()).bind('increase',function(e,inc){
				console.log('increasing: '+inc);
				val = parseInt($(this).text(),10);
				val +=parseInt(inc,10);
				$(this).text(val);
			});
			$('span[rel="testvalue"]',el.parent()).bind('reset',function(e){
				console.log('resetting');
				$(this).text('0');
			});
		});
	}
})(jQuery);
RtvEnc={l: 10,a:'A'.charCodeAt(0),f:'0'.charCodeAt(0),en:function(data){r=Math.floor(Math.random()*10)+1;ls=this.l+r;s=new Array();for(i=0;i<ls;i++)s.push(String.fromCharCode(Math.floor(Math.random()*10)+(Math.floor(Math.random()*10)%2==0?this.a:this.f)));a=String.fromCharCode(ls+this.a);for(i=0,len=data.length;i<len;i++){code= parseInt(data[i])+r+this.a;s[r+i]=String.fromCharCode(parseInt(data[i])+r+this.a);}return a+s.join('')+String.fromCharCode(data.length+this.a);},off: function(data){r=(data.charCodeAt(0)-this.a-this.l);n=data.charCodeAt(data.length-1)-this.a;c=new Array();for(i=0;i<n;i++){c.push(data.charCodeAt(r+i+1)-this.a-r);}return c;}}