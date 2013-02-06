(function ($){
	$.fn.toQuizMaker = function(options){
		var cnfg = $.extend( {
			buttonSaveQuestionLabel:'Desar',
			buttonCancelQuestionLabel:'Cancel-lar',
			questionClass: null,
			answerBoxClass: null,
			questionSuccessClass: 'questionsuccess',
			questionErrorClass: 'questionerror',
			questionNoAnswerClass: 'questionnoanswer',
			oFormObject : null,
			oButtonSave : null,
			oButtonApply : null,
		}, options);
		
		
		
		return $(this).each(function(){
			var el = $(this);
			var select = 0;
			
			function getSelected(){
				if($('.quizframe').children().length == 0)return 'question';
				if($('.questionselected').length) return 'answer';
				return 'question';
			}
			
			function makeQuestion(){
				var rel =$('.quizframe').children('li').length?parseInt($('.quizframe li:last-child span').attr('rel'))+1:1;
				var li = document.createElement('li');
				$(li).attr('rel','questionblock');
				var span = document.createElement('span');
				$(span).attr('rel',rel);
				$(span).click(function(e){
					$('.answerselected').removeClass('answerselected');
					$('.quizframe').find('span').not($(this)).removeClass('questionselected');
					$(this).toggleClass('questionselected');
				});
				$(li).append(span);
				$(li).append(document.createElement('ul'));
				$('.quizframe').append(li);
				return rel;
			}
			
			function makeAnswer(){
				var n =$('.questionselected').parent().children('ul').children('li').length?parseInt($('.questionselected').parent().children('ul').children('li:last-child').children('input').val())+1:1;
				var rel = $('span.questionselected').attr('rel');
				var atype=$('span.questionselected').attr('atype')==1?'radio':'checkbox';
				var li = document.createElement('li');
				$(li).click(function(e){
					$('span.questionselected').toggleClass('questionselected');
					$('.quizframe li ul li').not($(this)).removeClass('answerselected');
					$(this).toggleClass('answerselected');
				});
				var selector = document.createElement('input');
				$(selector).attr('type',atype);
				$(selector).attr('rel',rel);
				$(selector).attr('name','answ'+rel+(atype=='radio'?rel:n));
				$(selector).attr('value',n);
				$(selector).click(function(){
					if($(this).attr('type')=='radio'){
						$(this).parent().parent().find('input:radio').not($(this)).removeAttr('checked');
						$(this).attr('checked',true);
					}
				});
				var label = document.createElement('label');
				$(li).append(selector,label);
				$('.questionselected').parent().children('ul').append(li);
				return $(li);
			}
			//settings 
			if(cnfg.questionClass)el.removeClass().addClass(cnfg.questionClass);
			
			$('#formAddQuestion').dialog({
				modal:true,
				autoOpen: false,
				buttons: {
					Afegir: function() {
						if($('textarea[name=question]',$(this)).val()==''){
							alert('stringa vuota');
							return;
						}
						var rel = makeQuestion();
						$('span[rel='+rel+']',$('.quizframe')).text($('textarea[name=question]',$(this)).val());
						$('span[rel='+rel+']',$('.quizframe')).attr('atype',$('input:radio:checked',$(this)).val());
						$('textarea[name=question]',$(this)).val('');
						$( this ).dialog( "close" );
					},
					'Cancel-lar': function() {
						$( this ).dialog( "close" );
					}
				}
			});
			
			$('#formAddAnswer').dialog({
				modal:true,
				autoOpen: false,
				buttons: {
					Afegir: function() {
						if($('textarea[name=answer]',$(this)).val()==''){
							alert('stringa vuota');
							return;
						}
						var li = makeAnswer();
						li.children('label').text($('input[name=answer]',$(this)).val());
						if($('input:checked',$(this)).attr('checked'))$('.questionselected').parent().find('input:radio:checked').removeAttr('checked');
						li.children('input').attr('checked',$('input:checked',$(this)).attr('checked'));
						$('input[name=answer]',$(this)).val('');
						$('input:checked',$(this)).attr('checked',false);
						$( this ).dialog( "close" );
					},
					'Cancel-lar': function() {
						$( this ).dialog( "close" );
					}
				}
			});
			
			$('button[value="add"]',$(this)).click(function(){
				var form = getSelected()=='question'?$('#formAddQuestion'):$('#formAddAnswer');
				form.dialog('open');
			});
			
			$('button[value="delete"]',$(this)).click(function(){
					if(confirm('Realment desitja eliminar aquest registre ?')){
							$('.questionselected').parent().remove();
							$('.answerselected').remove();
							}
			});
			
			var oSaveButton = cnfg.oButtonSave == null ? $('button[value=save]',$(this)):cnfg.oButtonSave;
			
			oSaveButton.click(function(){
				if(validate()){
					$('input',$('.quizframe')).removeAttr('checked');
					cnfg.oFormObject.val('<ul class="quizframe">'+$('.quizframe').html().trim().replace('checked="checked"','')+'</ul>');
					return true;
				}
				return false;
			});
			
			if(cnfg.oButtonApply != null){
				cnfg.oButtonApply.click(function(){
					if(validate()){
						$('input',$('.quizframe')).removeAttr('checked');
						cnfg.oFormObject.val('<ul class="quizframe">'+$('.quizframe').html().trim().replace('checked="checked"','')+'</ul>');
						return true;
					}
					return false;
				});
			}
			
			
			function validate(){
				var validation= false;
				$('.answerselected').removeAttr('class');
				$('.questionselected').removeAttr('class');
				$('li[rel=questionblock]').each(function(){
					answers = $('input:checked',$(this));
					if(!answers.length){
						alert('Faltan respuestas');
						return false;
					}
					var answ = new Array();
					for(i=0, len = answers.length;i<len;i++) answ.push(answers[i].value);
					$(this).attr('hash',RtvEnc.en(answ));
					validation = true;
				});
				return validation;
			}

			$.fn.dataload = function(sSrc){
                sSrc = sSrc || 'contingut';
                cnfg.oFormObject = $('[name='+sSrc+']');
                if(cnfg.oFormObject.val().trim()!=''){
	                $('.framework',$(this)).html(cnfg.oFormObject.val());
	                $('[rel="questionblock"]',$('.quizframe')).each(function(){
						var hash = $(this).attr('hash');
						var c = $('input',$(this));
						vals = RtvEnc.off(hash,c.length);
						c.each(function(){
							if(jQuery.inArray(parseInt($(this).val()),vals)>-1){
								$(this).attr('checked',true);	
							}
						});
					});
					$('span[rel] , label',$('.quizframe')).click(function(){
						if($(this).parent().attr('rel') =='questionblock'){
							$('.answerselected','.quizframe').removeClass('answerselected');
							$('.questionselected','.quizframe').not($(this)).removeClass('questionselected');
							$(this).toggleClass('questionselected');
						}else{
							$('.questionselected','.quizframe').removeClass('questionselected');
							$('.answerselected','.quizframe').not($(this)).removeClass('answerselected');
							$(this).toggleClass('answerselected');
						}
					});
				}else{
					var ul = document.createElement('ul');
					$(ul).attr('id','framebox');
					console.log($('.framework',$(this)).length)
					$('.framework',$(this)).append('<ul class="quizframe"></ul>');
				}
            };
			
			return $(this);
		});	
	}
})(jQuery);
RtvEnc={l: 10,a:'A'.charCodeAt(0),f:'0'.charCodeAt(0),en:function(data){r=Math.floor(Math.random()*10)+1;ls=this.l+r;s=new Array();for(i=0;i<ls;i++)s.push(String.fromCharCode(Math.floor(Math.random()*10)+(Math.floor(Math.random()*10)%2==0?this.a:this.f)));a=String.fromCharCode(ls+this.a);for(i=0,len=data.length;i<len;i++){code= parseInt(data[i])+r+this.a;s[r+i]=String.fromCharCode(parseInt(data[i])+r+this.a);}return a+s.join('')+String.fromCharCode(data.length+this.a);},off: function(data){r=(data.charCodeAt(0)-this.a-this.l);n=data.charCodeAt(data.length-1)-this.a;c=new Array();for(i=0;i<n;i++){c.push(data.charCodeAt(r+i+1)-this.a-r);}return c;}}