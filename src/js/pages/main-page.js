import { WOW } from "wowjs";
import "animate.css";
import "wowjs/css/libs/animate.css";

new WOW({
	mobile: true,
	// resetAnimation: false,
	// callback: function (box) {
	// 	if (box.classList.contains("request__content-text--anim")) {
	// 		setTimeout(() => {
	// 			box.classList.add("anim-fill-text");
	// 		}, 2200);
	// 	}
	// 	// the callback is fired every time an animation is started
	// 	// the argument that is passed in is the DOM node being animated
	// },
}).init();

if (window.innerWidth >= 769) {
	const banners = document.querySelectorAll(".banner");

	function handleScroll() {
		banners.forEach(banner => {
			const bannerHeight = banner.clientHeight;
			const bannerTop = banner.offsetTop;

			let scrollPosition = window.scrollY;
			let windowHeight = window.innerHeight;

			if (
				scrollPosition + windowHeight > bannerTop &&
				scrollPosition < bannerTop + bannerHeight
			) {
				let position = (scrollPosition - bannerTop) / 2;
				banner.style.backgroundPosition = `center ${position}px`;
			} else {
				banner.style.backgroundPosition = "center 0";
			}
		});
	}

	window.addEventListener("scroll", handleScroll);
	window.addEventListener("load", handleScroll);
}
