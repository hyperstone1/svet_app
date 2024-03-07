import rem from "../utils/rem";

window.onscroll = function () {
	myFunction();
};
window.onload = function () {
	myFunction();
};

var header = document.querySelector(".header");
var sticky = header.offsetTop;

function myFunction() {
	console.log("rem: ", rem(10));
	if (window.innerWidth < 769) {
		if (window.pageYOffset > rem(10)) {
			header.classList.add("sticky");
		} else {
			header.classList.remove("sticky");
		}
	} else {
		if (window.pageYOffset > rem(4.1)) {
			header.classList.add("sticky");
		} else {
			header.classList.remove("sticky");
		}
	}
}
