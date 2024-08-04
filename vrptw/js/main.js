(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('shadow-sm').css('top', '-100px');
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Date and time picker
    $('.datePick1').datetimepicker({
        format: 'L'
    });
    $('.datePick2').datetimepicker({
        format: 'L'
    });
    


    // Header carousel
    $(".header-carousel").owlCarousel({
        autoplay: false,
        animateOut: 'fadeOutLeft',
        items: 1,
        dots: true,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ]
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: false,
        smartSpeed: 1000,
        center: true,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            768:{
                items:2
            }
        }
    });

    
})(jQuery);



//Quote Generator
const quotes = [
    { content: "To be or not to be, that is the question.", author: "William Shakespeare" },
    { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { content: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
    { content: "The way to get started is to quit talking and begin doing.", author: "Walt Disney"},
    { content: "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful.", author: "Albert Schweitzer"},
    { content: "The only place where success comes before work is in the dictionary.", author: "Vidal Sassoon"},
    { content: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller"},
    { content: "Opportunities don't happen, you create them.", author: "Chris Grosser"},
    { content: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau"},
    { content: "If you are not willing to risk the usual, you will have to settle for the ordinary.", author: "Jim Rohn"},
    { content: "The secret of success is to do the common thing uncommonly well.", author: "John D. Rockefeller Jr."},
    { content: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson"},
    { content: "Do not be embarrassed by your failures, learn from them and start again.", author: "Richard Branson"}
];

function getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
}

function displayRandomQuote() {
    const quoteContainer = document.getElementById('quoteContainer');
    const randomQuote = getRandomQuote();
    quoteContainer.innerHTML = `
        <p class="quote">${randomQuote.content}</p>
        <p class="author">- ${randomQuote.author}</p>
    `;
}

displayRandomQuote();



