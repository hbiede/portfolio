(function($) { "use strict";


	//Home fit screen	

	$(function(){"use strict";
		$('.home').css({'height':($(window).height())+'px'});
		$(window).resize(function(){
		$('.home').css({'height':($(window).height())+'px'});
		});
	});		
 
 
	//Navigation	

	$('ul.slimmenu').on('click',function(){
		var width = $(window).width(); 
		if ((width <= 800)){ 
			$(this).slideToggle();}	
	});	
	
	$('ul.slimmenu').slimmenu(
	{
		resizeWidth: '800',
		collapserTitle: '',
		easingEffect:'easeInOutQuint',
		animSpeed:'medium',
		indentChildren: true,
		childrenIndenter: '&raquo;'
	});

	
	//Counter 
	
    jQuery(document).ready(function( $ ) {
        $('.counter').counterUp({
            delay: 100,
            time: 3000
        });
    });	

	
	//Parallax
	
	$(document).ready(function(){
			$('.parallax-1').parallax("50%", 0.5);
			$('.parallax-2').parallax("50%", 0.5);
			$('.parallax-3').parallax("50%", 0.3);
	});	
	
	
	//Clients Carousel

	$(document).ready(function() {
	 
	  var sync1 = $("#sync1");
	  var sync2 = $("#sync2");
	 
	  sync1.owlCarousel({
		singleItem : true,
		autoPlay : 5000,
		slideSpeed : 1000,
		navigation: false,
		pagination:false,
		afterAction : syncPosition,
		responsiveRefreshRate : 200
	  });

	  
	  sync2.owlCarousel({
		items : 3,
		itemsDesktop      : [1199,3],
		itemsDesktopSmall     : [979,2],
		itemsTablet       : [768,1],
		itemsMobile       : [479,1],
		pagination:false,
		responsiveRefreshRate : 100,
		afterInit : function(el){
		  el.find(".owl-item").eq(0).addClass("synced");
		}
	  });
	 
	  function syncPosition(el){
		var current = this.currentItem;
		$("#sync2")
		  .find(".owl-item")
		  .removeClass("synced")
		  .eq(current)
		  .addClass("synced")
		if($("#sync2").data("owlCarousel") !== undefined){
		  center(current)
		}
	  }
	 
	  $("#sync2").on("click", ".owl-item", function(e){
		e.preventDefault();
		var number = $(this).data("owlItem");
		sync1.trigger("owl.goTo",number);
	  });
	 
	  function center(number){
		var sync2visible = sync2.data("owlCarousel").owl.visibleItems;
		var num = number;
		var found = false;
		for(var i in sync2visible){
		  if(num === sync2visible[i]){
			var found = true;
		  }
		}
	 
		if(found===false){
		  if(num>sync2visible[sync2visible.length-1]){
			sync2.trigger("owl.goTo", num - sync2visible.length+2)
		  }else{
			if(num - 1 === -1){
			  num = 0;
			}
			sync2.trigger("owl.goTo", num);
		  }
		} else if(num === sync2visible[sync2visible.length-1]){
		  sync2.trigger("owl.goTo", sync2visible[1])
		} else if(num === sync2visible[0]){
		  sync2.trigger("owl.goTo", num-1)
		}
		
	  }
	 
	});	 	 
 
	
	//Work
	
	$(function() {

		var $grid = $( '#tp-grid' ),
			$name = $( '#name' ),
			$close = $( '#close' ),
			$loader = $( '<div class="loader"><i></i><i></i><i></i><i></i><i></i><i></i><span>Loading...</span></div>' ).insertBefore( $grid ),
			stapel = $grid.stapel( {
				randomAngle : true,
				delay : 50,
				gutter : 70,
				pileAngles : 4,
				onLoad : function() {
					$loader.remove();
				},
				onBeforeOpen : function( pileName ) {
					$name.html( pileName );
				},
				onAfterOpen : function( pileName ) {
					$close.show();
				}
			} );

		$close.on( 'click', function() {
			$close.hide();
			$name.empty();
			stapel.closePile();
		} );

	} ); 
  })(jQuery); 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 





	