/*	Table OF Contents
	==========================
	Carousel
	Customs Script [Modal Thumb | List View  Grid View + Add to Wishlist Click Event + Others ]
	Custom Parallax 
	Custom Scrollbar
	Custom animated.css effect
	Equal height ( subcategory thumb)
	responsive fix
	*/
$(document).ready(function() {

    /*==================================
	Carousel
	====================================*/

    // NEW ARRIVALS Carousel
    $("#productslider").owlCarousel({
        navigation: true,
        items: 4,
        itemsTablet: [768, 2]
    });


    // BRAND  carousel
    var owl = $(".brand-carousel");

    owl.owlCarousel({
        //navigation : true, // Show next and prev buttons
        navigation: false,
        pagination: false,
        items: 8,
        itemsTablet: [768, 4],
        itemsMobile: [400, 2]


    });

    // Custom Navigation Events
    $("#nextBrand").click(function() {
        owl.trigger('owl.next');
    })
    $("#prevBrand").click(function() {
        owl.trigger('owl.prev');
    })


    // YOU MAY ALSO LIKE  carousel

    $("#SimilarProductSlider").owlCarousel({
        navigation: true

    });


    // Home Look 2 || Single product showcase 

    // productShowCase  carousel
    var pshowcase = $("#productShowCase");

    pshowcase.owlCarousel({
        autoPlay : 4000,
        stopOnHover: true,
        navigation: false,
        paginationSpeed: 1000,
        goToFirstSpeed: 2000,
        singleItem: true,
        autoHeight: true


    });

    // Custom Navigation Events
    $("#ps-next").click(function() {
        pshowcase.trigger('owl.next');
    })
    $("#ps-prev").click(function() {
        pshowcase.trigger('owl.prev');
    })
	
	
	
	// Home Look 3 || image Slider 

    // imageShowCase  carousel
    var imageShowCase = $("#imageShowCase");

    imageShowCase.owlCarousel({
        autoPlay: 4000,
        stopOnHover: true,
        navigation: false,
        pagination: false,
        paginationSpeed: 1000,
        goToFirstSpeed: 2000,
        singleItem: true,
        autoHeight: true


    });

    // Custom Navigation Events
    $("#ps-next").click(function() {
        imageShowCase.trigger('owl.next');
    })
    $("#ps-prev").click(function() {
        imageShowCase.trigger('owl.prev');
    })


    /*==================================
	Customs Script
	====================================*/
	
	 // Product Details Modal Change large image when click thumb image
	$(".modal-product-thumb a").click(function(){
	var largeImage= $(this).find("img").attr('data-large');
	$(".product-largeimg").attr('src',largeImage);
	$(".zoomImg").attr('src',largeImage);
	});
	
    // collapse according add  active class
    $('.collapseWill').on('click', function(e) {
        $(this).toggleClass("pressed"); //you can list several class names 
        e.preventDefault();
    });

    $('.search-box .getFullSearch').on('click', function(e) {
        $('.search-full').addClass("active"); //you can list several class names 
        e.preventDefault();
    });

    $('.search-close').on('click', function(e) {
        $('.search-full').removeClass("active"); //you can list several class names 
        e.preventDefault();
    });



    // Customs tree menu script	
    $(".dropdown-tree-a").click(function() { //use a class, since your ID gets mangled
        $(this).parent('.dropdown-tree').toggleClass("open-tree active"); //add the class to the clicked element
    });
	

    // Add to Wishlist Click Event	 // Only For Demo Purpose	
	
	$('.add-fav').click(function(e) { 
        e.preventDefault();
        $(this).addClass("active"); // ADD TO WISH LIST BUTTON 
		$(this).attr('data-original-title', 'Added to Wishlist');// Change Tooltip text 
    });

    // List view and Grid view 

    $('.list-view').click(function(e) { //use a class, since your ID gets mangled
        e.preventDefault();
        $('.item').addClass("list-view"); //add the class to the clicked element
		 $('.add-fav').attr("data-placement",$(this).attr("left"));
		
		
    });

    $('.grid-view').click(function(e) { //use a class, since your ID gets mangled
        e.preventDefault();
        $('.item').removeClass("list-view"); //add the class to the clicked element
    });


    // product details color switch 
    $(".swatches li").click(function() {
        $(".swatches li.selected").removeClass("selected");
        $(this).addClass('selected');

    });
	
	// Modal thumb link selected 
    $(".modal-product-thumb a").click(function() {
        $(".modal-product-thumb a.selected").removeClass("selected");
        $(this).addClass('selected');

    });


    if (/IEMobile/i.test(navigator.userAgent)) {
        // Detect windows phone//..
        $('.navbar-brand').addClass('windowsphone');
    }



    // top navbar IE & Mobile Device fix
    var isMobile = function() {
        //console.log("Navigator: " + navigator.userAgent);
        return /(iphone|ipod|ipad|android|blackberry|windows ce|palm|symbian)/i.test(navigator.userAgent);
    };


    if (isMobile()) {
        // For  mobile , ipad, tab

    } else {
		
			
		 $(function() {

            //Keep track of last scroll
            var tshopScroll = 0;
            $(window).scroll(function(event) {
                //Sets the current scroll position
                var ts = $(this).scrollTop();
                //Determines up-or-down scrolling
                if (ts > tshopScroll) {
                    // downward-scrolling
                    $('.navbar').addClass('stuck');
             
                } else {
                    // upward-scrolling
                    $('.navbar').removeClass('stuck');
                }
				
				if (ts < 600) {
                    // downward-scrolling
                    $('.navbar').removeClass('stuck');
					//alert()
                } 
				
				
				tshopScroll = ts;
				
                //Updates scroll position
              
            });
        });
		
        

    } // end Desktop else




    


    /*==================================
	Custom  animated.css effect
	====================================*/

    window.onload = (function() {
        $(window).scroll(function() {
            if ($(window).scrollTop() > 86) {
                // Display something
                $('.parallax-image-aboutus .animated').removeClass('fadeInDown');
                $('.parallax-image-aboutus .animated').addClass('fadeOutUp');
            } else {
                // Display something
                $('.parallax-image-aboutus .animated').addClass('fadeInDown');
                $('.parallax-image-aboutus .animated').removeClass('fadeOutUp');


            }

            if ($(window).scrollTop() > 250) {
                // Display something
            } else {
                // Display something

            }

        })
    })


  
    /*=======================================================================================
	 Code for tablet device || responsive check
	========================================================================================*/


    if ($(window).width() < 989) {


        $('.collapseWill').trigger('click');

    } else {
        // ('More than 960');
    }


    $(".tbtn").click(function() {
        $(".themeControll").toggleClass("active");
    });






    /*=======================================================================================
		end  
	========================================================================================*/


}); // end Ready