import IMask from 'imask';
import $ from 'jquery';
import { openModal } from './modal';

$(document).ready(function () {
	const phone = document.querySelectorAll('[type="tel"]');
	const maskOptions = {
		mask: '+{7} (000) 000-00-00',
	};

	phone.forEach(function (element) {
		const mask = IMask(element, maskOptions);
	});

	$('.form').on('submit', evt => {
		evt.preventDefault();
		const currentForm = $(evt.currentTarget);

		if (validationForm(currentForm) === true) {
			if (currentForm.hasClass('feedback-modal__form')) {
				switchModalContent('.feedback-modal');
			} else if (currentForm.hasClass('feedback__form')) {
				switchModalContent('.feedback-modal');
				openModal('.feedback-modal');
			}
			currentForm.find('input').val('');
			currentForm.find('textarea').val('');
		}
	});
});

function switchModalContent(modal) {
	$(modal).find('.modal-content--first').removeClass('active');
	$(modal).find('.modal-content--second').addClass('active');
}

function validationForm(form) {
	let result = true;

	form.find('input').each(function (index, element) {
		removeError($(element));

		if ($(element).data('minLength')) {
			if ($(element).val().length < 18) {
				removeError($(element));
				createError($(element), `Минимальное кол-во символов: ${$(element).data('minLength')}`);
				result = false;
			}
		}

		if ($(element).data('required')) {
			if ($(element).val().length == 0) {
				removeError($(element));
				createError($(element), 'Поле должно быть заполнено');
				result = false;
			}
		}
	});

	// form.find('.textarea-review').each(function (index, element) {
	// 	removeError($(element));

	// 	if ($(element).data('required')) {
	// 		if ($(element).val().length == 0) {
	// 			removeError($(element));
	// 			createError($(element), 'Заполните поле');
	// 			result = false;
	// 		}
	// 	}
	// });

	function removeError(input) {
		const parent = input.parent();
		if (parent.hasClass('error')) {
			parent.find('.error-text').remove();
			parent.removeClass('error');
		}
	}

	function createError(input, text) {
		const errorText = $(`<p class="error-text">${text}</p>`);
		input.parent().addClass('error').append(errorText);
	}
	return result;
}
