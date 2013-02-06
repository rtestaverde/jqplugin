(function ($){
	$.fn.toLetterSoupMaker = function(options){
		var cnfg = $.extend( {
			words: null,
			labels: {
				buttons: {
					save: 'Save',
					reset: 'Reset'
				}
			}
		}, options);
		return $(this).each(function(){
			var el = $(this);
			if(cnfg.words!=null)
				$('#framebox').val(cnfg.words.toUpperCase().split(',').join('\r\n'));

			$('button[value="save"]',el).text(cnfg.labels.buttons.save).button().click(function(){
				cnfg.words = $('#framebox').val().trim().replace('\r','').split('\n').join();
				$('.testgenerated').empty().toLetterSoup(cnfg);
			});
			
			return el;
		});	
	}
})(jQuery);