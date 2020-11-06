/**
 * An object that will configure common functionality for carousels
 * @class
 */
function Carousel() {

    this.$featuredCarousel = $("[data-carousel]");
}

/**
 * Adds the carousel functionality to the page
 */
Carousel.prototype.addCarousels = function() {

    this.$featuredCarousel.slick({

        focusOnSelect: true,
        slidesToShow: 3,
        slidesToScroll: 3,
        autoplay: true,
        arrows: true
    });
}

$(function() {

    var carousel = new Carousel();
    carousel.addCarousels();
})