(function($) {
  "use strict"; // Start of use strict

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top - 70)
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  // Scroll to top button appear
  $(document).scroll(function() {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#mainNav',
    offset: 80
  });

  // Collapse Navbar
  var navbarCollapse = function() {
    if ($("#mainNav").offset().top > 100) {
      $("#mainNav").addClass("navbar-shrink");
    } else {
      $("#mainNav").removeClass("navbar-shrink");
    }
  };
  // Collapse now if page is not at top
  navbarCollapse();
  // Collapse the navbar when page is scrolled
  $(window).scroll(navbarCollapse);

  // Modal popup$(function () {
  /*$('.modal-item').magnificPopup({
    type: 'inline',
    preloader: false,
    focus: '#username',
    modal: true
  });
  $(document).on('click', '.portfolio-modal-dismiss', function(e) {
    e.preventDefault();
    $.magnificPopup.close();
  });*/

  $('.customItem').on("click", function() {
    $('.modal-customItem').show();
    window.item = $(this).find(".portfolio-item-footer").text();
  });

  $('.thanks').on("click", function() {
    
    $('.cmodal-container').hide();
    document.getElementById("loader").style.display = "block";

    // Update DBB with message
    var httpRequest = new XMLHttpRequest();
    
    var data = {
      "id": $('#stdMsgId').val(), 
      "msg": $('#customMsg').val()
    };
    console.log(JSON.stringify(data));
    
    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === 4) {
          
        // move to thanks modal
        document.getElementById("loader").style.display = "none";
        $('.modal-thanks').show();

      }
    };
    
    httpRequest.open('POST', 'https://x97t9hqk1e.execute-api.eu-west-3.amazonaws.com/prod/message', true);
    httpRequest.setRequestHeader('Content-Type', 'application/json');
    httpRequest.send(JSON.stringify(data));
    return false;

  });

  $('.modalClose').on("click", function() {
    $('.cmodal-container').hide();
    return false;
  });


  // Floating label headings for the contact form
  $(function() {
    $("body").on("input propertychange", ".floating-label-form-group", function(e) {
      $(this).toggleClass("floating-label-form-group-with-value", !!$(e.target).val());
    }).on("focus", ".floating-label-form-group", function() {
      $(this).addClass("floating-label-form-group-with-focus");
    }).on("blur", ".floating-label-form-group", function() {
      $(this).removeClass("floating-label-form-group-with-focus");
    });
  });

})(jQuery); // End of use strict
