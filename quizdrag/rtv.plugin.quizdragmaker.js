(function ($){
	$.fn.toQuizDragMaker = function(options){
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
			
			function getSelected(){
				if($('#framebox').children().length == 0)return false;
				if($('.questionselected').length) return $('.questionselected').attr('rel');
				return false;
			}
			
			function setSelected(){
				$('.selected').removeClass('selected');
				$('#framebox [rel='+$(this).attr('rel')+']').addClass('selected');
			}
			
			function setHighlight(){
				$('#framebox [rel='+$(this).attr('rel')+']').addClass('highlight');
			}
			
			function removeHighlight(){
				$('.highlight').removeClass('highlight');
			}
			
			function makeQuestion(k,v){
				while($('#framebox').find('dt[rel='+(rel = Math.ceil(Math.random()*50))+']').length);
				var dt = $(document.createElement('dt')).attr('rel',rel).text(k).click(setSelected).mouseover(setHighlight).mouseout(removeHighlight);
				var dd = $(document.createElement('dd')).attr('rel',rel).text(v).click(setSelected).mouseover(setHighlight).mouseout(removeHighlight);
				$('#framebox').append(dt);
				$('#framebox').append(dd);
				return rel;
			}
			$('#formAddQuestion').dialog({
				modal:true,
				autoOpen: false,
				onopen: function(){
						$(this).find('input').val('');
						},
				buttons: {
					Afegir: function() {
						if((k=$('input[name=question]',$(this)).val())==''){
							alert('pregunta vacía');
							return;
						}
						if((v=$('input[name=answer]',$(this)).val())==''){
							alert('respuesta vacía');
							return;
						}
						var rel = makeQuestion(k,v);
						$('input',$(this)).val('');
						$( this ).dialog( "close" );
					},
					'Cancel-lar': function() {
						$('input',$(this)).val('');
						$( this ).dialog( "close" );
					}
				}
			});
						
			$('button[value="add"]',$(this)).click(function(){
				$('#formAddQuestion').dialog('open');
			});
			
			$('button[value="delete"]',$(this)).click(function(){
					if(confirm('Realment desitja eliminar aquest registre ?')){
							$('.selected').remove();
					}
			});
			
			var oSaveButton = cnfg.oButtonSave == null ? $('button[value=save]',$(this)):cnfg.oButtonSave;
			
			oSaveButton.click(function(){
				create();
				return true;
			});
			
			if(cnfg.oButtonApply != null){
				create();
				return true;
			}
			
			
			function create(){
				$('.highlight, .selected').removeAttr('class');
				var dest = $(document.createElement('div'));
				dest.addClass('dragquiz');
				var framebox = $('#framebox').clone().removeAttr('id').addClass('dragquiztest').appendTo($(dest));
				var options = $(document.createElement('div')).addClass('dragquizoptions');
				var optionlist = new Array();
				$('dt[rel]',framebox).each(function(){
					var rel = $(this).attr('rel');
					var option = $(document.createElement('span')).addClass('dragquizoption').text($('dd[rel='+rel+']').text()).attr('check',rel);
					$('dd[rel='+rel+']',framebox).removeAttr('rel').attr('hash',RtvEnc.en(rel)).text('...');
					$(this).removeAttr('rel');
					optionlist.push(option);
				});
				optionlist.sort(function(){
						return (Math.round(Math.random())-0.5); 
				});
				for(var i=0,len=optionlist.length;i<len;i++)options.append(optionlist[i]);
				dest.append(options);
				
				$('textarea[name=contingut]').val(dest.html());
				$('.testgenerated').empty().append(dest);
				act();
				return;
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