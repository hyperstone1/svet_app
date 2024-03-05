import $ from 'jquery';
$(document).ready(function () {
	if ($(window).outerWidth() <= 768) {
		$('.footer__main-title').each(function () {
			let el = $(this);
			if (el.next().length) {
				el.click(function () {
					if (el.parent().hasClass('active')) {
						$('.footer__main-list').css('max-height', 0);
						$('.footer__main-item').removeClass('active');
					} else {
						el.next().css('display', 'flex');
						$('.footer__main-list').css('max-height', 0);
						el.next().css('max-height', el.next()[0].scrollHeight + 'px');
						$('.footer__main-item').removeClass('active');
						el.parent().addClass('active');
					}
				});
			}
		});
	}
});
