/**
 * jQuery PageSlide
 *
 * This jQuery plugin was inspired by the UI designs of Aza Raskin (http://www.azarask.in/),
 * in his Firefox mobile and Ubiquity mouse gesture prototypes, adapted for use as a jQuery lightBox-esque plugin.
 *
 * @name jquery-pageslide-0.2.js
 * @author Scott Robbin - http://srobbin.com
 * @version 0.2
 * @date January 7, 2009
 * @category jQuery plugin
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 **/

(function($){
    var cId = 0;
    $.fn.pageSlide = function(options) {
        // Define default settings and override with options.
		var settings = $.extend({
		    width:          "300px", // Accepts fixed widths
		    contentSource:  "ajax", // Accepts either "ajax" or "inline"
		    duration:       "normal", // Accepts standard jQuery effects speeds (i.e. fast, normal or milliseconds)
		    start:          function(){},
		    stop:           function(){},
        loaded:         function(){}
		}, options);
		
		function _initialize() {
		    
		    // Create and prepare elements for pageSlide
		    var psBodyWrap = document.createElement("div");
		    $(psBodyWrap).attr("id", "pageslide-body-wrap").width( $("body").width() );
		    
		    var psSlideContent = document.createElement("div");
		    $(psSlideContent).attr("id", "pageslide-content").width( settings.width );
		    
		    var psSlideWrap = document.createElement("div");
		    $(psSlideWrap).attr("id", "pageslide-slide-wrap").append( psSlideContent );
		    		    
		    // Wrap and append so that we have the slide containers
		    $("body").contents().wrapAll( psBodyWrap );
		    $("body").append( psSlideWrap );
		    
		    // If a user clicks the document, we should hide the pageslide
		    // and override that click functionality for the slide pane itself
		    $(document).click(function() {
		        _closeSlide();
		    });
		    $("#pageslide-slide-wrap").click(function(){ return false; });
		    
		    // Callback events for window resizing
		    $(window).resize(function(){
              $("#pageslide-body-wrap").width( $("body").width() );
            });
		};
		/**
		* Start the jQuery pageslide plugin
		*
		* Wraps the body's children inside of a DIV, so that it can slide upon start action
		*/
		// function _setupInline(info) {
		//      if (settings.contentSource == 'inline') {
		//        var thisId = 'psContent-' + info.callId + '-' + info.index, 
		//            thisLink = $(info.link)[0].hash;
		//        $(thisLink).data('id', thisId);
		//        $(thisLink).hide().clone(true).attr('id', thisId).appendTo('body');
		//        cId++;
		//      }
		//    }
		function _openSlide(el) {
		    settings.start();
			$("#pageslide-slide-wrap").animate({width: settings.width}, settings.duration);
		    $("#pageslide-body-wrap").animate({left: "-" + settings.width}, settings.duration, function() {
		            settings.stop();
		    });
		    if (settings.contentSource == 'ajax') {
  		    $.ajax({
  		        type: "GET",
  		        url: $(el).attr("href"),
  		        success: function(data) {
                _populateContent(data);
              }
  		    });
		      
		    } else if (settings.contentSource == 'inline') {
		      var contentId = el.hash;
		      
		      var inlineContent = $(contentId).clone(true).attr('id', 'secondary');
		      _populateContent(inlineContent);
		    } else {
		      return;
		    }
		}
		
		function _populateContent(content) {
		  $("#pageslide-content").html(content)
      .queue( function() {
        settings.loaded();
        $(this).dequeue();
        $(this).find('.pageslide-close').click(function(){_closeSlide(); });
      });  
		}
		
		function _closeSlide() {
		    settings.start();
		    $("#pageslide-body-wrap").animate({left: "0" }, settings.duration);
	      $("#pageslide-slide-wrap").animate({width: "0"}, settings.duration, function() {
	            $("#pageslide-content").empty();
	            settings.stop();
	        });
		}
        
        // Initalize pageslide, if it hasn't already been done.
		if($("#pageslide-body-wrap").length == 0) _initialize();
		return this.each(function(idx){
      // _setupInline({link: this, callId: cId, index: idx});
			$(this).unbind("click").bind("click", function(){
			    _openSlide(this);
				return false;
			});
		});
    };

})(jQuery);