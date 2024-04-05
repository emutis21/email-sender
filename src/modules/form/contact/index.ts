import { navigate } from 'astro:transitions/client'

import { LOCAL_STORAGE_KEY_RECIPIENTS, LOCAL_STORAGE_KEY_CONTACT } from '../consts'

import type {
	DispatchContactFormEventsArgs,
	EmailContent,
	GetDomElementsParams,
	HandleClearButtonClickArgs,
	HandleContactFormSubmitArgs,
	HandleInputArgs,
	HandleInputFocusArgs,
	ToggleClassParams,
} from './types'

function getDomElements(): GetDomElementsParams | null {
	const contactForm = document.querySelector('#contactForm') as HTMLFormElement

	if (!contactForm) return null

	const emailSender = contactForm.querySelector('#identifier') as HTMLInputElement
	const subjectbox = contactForm.querySelector('#subjectbox') as HTMLInputElement
	const message = contactForm.querySelector('#message') as HTMLTextAreaElement
	const sendButton = contactForm.querySelector('#sendButton') as HTMLButtonElement

	return { contactForm, emailSender, subjectbox, message, sendButton }
}

function getClearButton() {
	const { emailSender, subjectbox, message } = getDomElements() as GetDomElementsParams

	const clearEmailSenderButton = document.querySelector(
		`#clear-${emailSender?.name}`
	) as HTMLButtonElement

	const clearSubjectboxButton = document.querySelector(
		`#clear-${subjectbox?.name}`
	) as HTMLButtonElement

	const clearMessageButton = document.querySelector(`#clear-${message?.id}`) as HTMLButtonElement

	return { clearEmailSenderButton, clearSubjectboxButton, clearMessageButton }
}

function clearInput(inputElement: HTMLInputElement | HTMLTextAreaElement) {
	inputElement.value = ''
}

function toggleClass({ element, removeClass, addClass }: ToggleClassParams) {
	if (element) {
		element.classList.remove(removeClass)
		element.classList.add(addClass)
	}
}

function handleInput({ inputElement, errorClass, altClass }: HandleInputArgs): boolean {
	const isValid = Boolean(inputElement.value)
	const classToRemove = isValid ? errorClass : altClass
	const classToAdd = isValid ? altClass : errorClass

	if (inputElement instanceof HTMLTextAreaElement) {
		toggleClass({ element: inputElement, removeClass: classToRemove, addClass: classToAdd })
	} else {
		const inputBorder = inputElement.nextElementSibling as HTMLElement | null
		toggleClass({ element: inputBorder, removeClass: classToRemove, addClass: classToAdd })
	}

	if (!isValid) {
		inputElement.focus()
	}

	return isValid
}

function handleInputFocus({ inputElement, button }: HandleInputFocusArgs) {
	inputElement.addEventListener('focus', () => {
		if (inputElement.value) {
			button.classList.remove('hidden')
			button.classList.add('block')
		}
	})

	inputElement.addEventListener('blur', () => {
		setTimeout(() => {
			button.classList.add('hidden')
			button.classList.remove('block')
		}, 200)
	})

	inputElement.addEventListener('input', () => {
		if (inputElement.value) {
			button.classList.remove('hidden')
			button.classList.add('block')
		} else {
			button.classList.add('hidden')
			button.classList.remove('block')
		}
	})
}

function handleClearButtonClick({ button, inputElement }: HandleClearButtonClickArgs) {
	button.addEventListener('click', () => clearInput(inputElement))
}

function handleContactFormSubmit({
	form,
	emailSender,
	subjectbox,
	message,
	state,
}: HandleContactFormSubmitArgs) {
	form.addEventListener('submit', (event) => {
		event.preventDefault()

		const data: EmailContent = {
			id: crypto.randomUUID(),
			emailSender: emailSender?.value,
			subjectbox: subjectbox?.value,
			message: message?.value,
		}

		const isValidEmailSender = handleInput({
			inputElement: emailSender,
			errorClass: 'input-border-error',
			altClass: 'input-border-alt',
		})
		const isValidSubjectbox = handleInput({
			inputElement: subjectbox,
			errorClass: 'input-border-error',
			altClass: 'input-border-alt',
		})
		const isValidMessage = handleInput({
			inputElement: message,
			errorClass: 'textarea-error',
			altClass: 'textarea',
		})

		if (!isValidEmailSender || !isValidSubjectbox || !isValidMessage) return

		state.emailContent = data
		localStorage.setItem(LOCAL_STORAGE_KEY_CONTACT, JSON.stringify(state.emailContent))

		window.toast({
			title: 'Mensaje enviado con éxito',
			location: 'top-center',
			dismissible: true,
			type: 'success',
			icon: true,
		})
		console.log(data)
	})
}

export function dispatchContactFormEvents({ state }: DispatchContactFormEventsArgs): boolean {
	const domElements = getDomElements()

	if (!domElements) return false

	if (localStorage.getItem(LOCAL_STORAGE_KEY_RECIPIENTS) == null) navigate('/')

	const { contactForm, emailSender, subjectbox, message } = domElements

	const { clearEmailSenderButton, clearSubjectboxButton, clearMessageButton } = getClearButton()

	handleClearButtonClick({ button: clearEmailSenderButton, inputElement: emailSender })
	handleClearButtonClick({ button: clearSubjectboxButton, inputElement: subjectbox })
	handleClearButtonClick({ button: clearMessageButton, inputElement: message })

	handleInputFocus({ inputElement: emailSender, button: clearEmailSenderButton })
	handleInputFocus({ inputElement: subjectbox, button: clearSubjectboxButton })
	handleInputFocus({ inputElement: message, button: clearMessageButton })

	emailSender.value = state.emailContent.emailSender ?? ''
	subjectbox.value = state.emailContent.subjectbox ?? ''
	message.value = state.emailContent.message ?? ''

	handleContactFormSubmit({ form: contactForm, emailSender, subjectbox, message, state })

	return true
}
