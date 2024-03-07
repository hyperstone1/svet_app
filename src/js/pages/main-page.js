if (window.innerWidth >= 769) {
	const banners = document.querySelectorAll(".banner");

	function handleScroll() {
		banners.forEach(banner => {
			const bannerHeight = banner.clientHeight;
			const bannerTop = banner.offsetTop;

			let scrollPosition = window.scrollY;
			let windowHeight = window.innerHeight;
			console.log(scrollPosition, windowHeight);

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
