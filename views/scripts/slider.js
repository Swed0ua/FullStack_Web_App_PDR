$('.main__slider').slick({
    dots: true,
    arrows: true,
    slidesToShow: 1,
    autoplay: true,
    autoplaySpeed: 5000
});

$('.main__slider').on('init', function(event, slick) {
    updateNextSlideDot(slick.currentSlide, slick.slideCount);
});
$('.main__slider').on('beforeChange', function(event, slick, currentSlide, nextSlide) {
    updateNextSlideDot(nextSlide, slick.slideCount);
});

function updateNextSlideDot(nextSlide, slideCount) {
    var nextDot = nextSlide + 1 + 1;
    if (nextDot > slideCount) {
        nextDot = 1;
    }

    console.log(nextDot, nextSlide)

    $('.slick-dots li').removeClass('next-slide-dot');
    $('.slick-dots li:nth-child(' + nextDot + ')').addClass('next-slide-dot');
}
