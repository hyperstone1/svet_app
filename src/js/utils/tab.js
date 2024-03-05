document.addEventListener('DOMContentLoaded', function () {
	const tabContent = document.querySelectorAll('.tab-content');
	!!tabContent && tabInit();
});

function tabInit() {
	const tabButtons = document.querySelectorAll('.tab-btn');
	tabButtons.forEach((el, i, arr) => tabEventClick(el, i, arr));
}

function tabEventClick(button, index, array) {
	const tabWrappers = document.querySelectorAll('.tab-content__wrapper');

	button.addEventListener('click', () => {
		array.forEach(btn => btn.classList.remove('active'));
		button.classList.add('active');

		tabWrappers.forEach(wrapper => wrapper.classList.remove('active'));
		tabWrappers[index].classList.add('active');
	});
}
