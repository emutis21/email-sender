import { dispatchRecipientFormEvents } from './recipients/index.ts'

const state = {
	selectedRecipients: localStorage.getItem('selectedRecipients')
		? JSON.parse(localStorage.getItem('selectedRecipients') as string)
		: [],
}

dispatchRecipientFormEvents({ state })

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
