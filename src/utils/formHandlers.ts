import { navigate } from 'astro:transitions/client'

let state = {
	selectedRecipients: localStorage.getItem('selectedRecipients')
		? JSON.parse(localStorage.getItem('selectedRecipients') as string)
		: [],
}

export function handleRecipientFormEvents(callback?: (selectedRecipients: string[]) => void) {
	const recipientsForm = document.querySelector('#recipientsForm') as HTMLFormElement
	const title = recipientsForm.querySelector('h2') as HTMLHeadingElement
	const continueButton = document.querySelector('#continueButton') as HTMLButtonElement
	const saveButton = recipientsForm.querySelector('#saveButton') as HTMLButtonElement
	const checkboxes = recipientsForm.querySelectorAll(
		'input[type="checkbox"]'
	) as NodeListOf<HTMLInputElement>

	if (!recipientsForm) return

	for (const recipient of state.selectedRecipients) {
		const checkbox = document.querySelector(`input[name="${recipient}"]`) as HTMLInputElement
		checkbox.checked = true
	}

	function updateSaveButtonState() {
		const checkedCheckboxes = Array.from(checkboxes)
			.filter((checkbox) => checkbox.checked)
			.map((checkbox) => checkbox.name)

		const isAnyCheckboxChecked = checkedCheckboxes.length > 0
		const isDifferentFromLocalStorage =
			JSON.stringify(checkedCheckboxes.sort()) !== JSON.stringify(state.selectedRecipients.sort())

		if (isAnyCheckboxChecked && isDifferentFromLocalStorage) {
			saveButton.classList.remove('disable')
		} else {
			saveButton.classList.add('disable')
		}

		if (isAnyCheckboxChecked) continueButton.classList.remove('disable')

		if (!isAnyCheckboxChecked) continueButton.classList.add('disable')
	}

	checkboxes.forEach((checkbox) => {
		checkbox.addEventListener('change', updateSaveButtonState)
	})

	updateSaveButtonState()

	recipientsForm.addEventListener('submit', async (event) => {
		event.preventDefault()

		const formData = new FormData(recipientsForm)
		const selectedRecipients = Array.from(formData.keys())

		if (selectedRecipients.length === 0) {
			title.innerText = 'Selecciona al menos un destinatario'
			title.classList.add('text-red-500')

			return
		}

		if (selectedRecipients.length > 0) {
			title.innerText = 'Selecciona los destinatarios'

			if (title.classList.contains('text-red-500')) {
				title.classList.remove('text-red-500')
			}
		}

		state.selectedRecipients = selectedRecipients

		if (typeof callback === 'function') {
			callback(selectedRecipients)
		}

		window.toast({
			title: 'Destinatarios seleccionados',
			location: 'top-right',
			dismissible: true,
			type: 'success',
			icon: true,
		})
	})
}

export function handleContactFormEvents() {
	const contactForm = document.querySelector('#contactForm') as HTMLFormElement
	const emailSender = document.querySelector('#identifier') as HTMLInputElement
	const subjectbox = document.querySelector('#subjectbox') as HTMLInputElement
	const message = document.querySelector('#message') as HTMLTextAreaElement

	contactForm.addEventListener('submit', (e) => {
		e.preventDefault()

		const data = {
			emailSender: emailSender?.value,
			subjectbox: subjectbox?.value,
			message: message?.value,
		}

		if (!data.emailSender) {
			const inputBorder = emailSender.nextElementSibling as HTMLElement

			emailSender.focus()

			inputBorder.classList.remove('input-border-alt')
			inputBorder.classList.add('input-border-error')

			return
		}

		if (!data.subjectbox) {
			const inputBorder = subjectbox.nextElementSibling as HTMLElement

			subjectbox.focus()

			inputBorder.classList.remove('input-border-alt')
			inputBorder.classList.add('input-border-error')

			return
		}

		if (!data.message) {
			message.focus()

			message.classList.remove('focus:outline-royal-blue-950')
			message.classList.add('focus:outline-red-500')

			return
		}

		if (data.emailSender) {
			const inputBorder = emailSender.nextElementSibling as HTMLElement

			inputBorder.classList.remove('input-border-error')
			inputBorder.classList.add('input-border-alt')
		}

		if (data.subjectbox) {
			const inputBorder = subjectbox.nextElementSibling as HTMLElement

			inputBorder.classList.remove('input-border-error')
			inputBorder.classList.add('input-border-alt')
		}

		if (data.message) {
			message.classList.remove('focus:outline-red-500')
			message.classList.add('focus:outline-royal-blue-950')
		}

		console.log(data)
	})
}
