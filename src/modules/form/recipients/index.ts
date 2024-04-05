import { LOCAL_STORAGE_KEY_RECIPIENTS } from '../consts'

import type {
	ButtonStateParams,
	CheckboxEventListenersParams,
	DispatchRecipientFormEventsParams,
	FormSubmitEventListenerParams,
	FormSubmitParams,
	GetCheckedCheckboxesParams,
	GetDomElementsParams,
	HandleCheckboxChangeParams,
} from './types'

function getDomElements(): GetDomElementsParams | null {
	const recipientsForm = document.querySelector('#recipientsForm') as HTMLFormElement
	if (!recipientsForm) return null
	const title = recipientsForm.querySelector('h2') as HTMLHeadingElement
	const continueButton = document.querySelector('#continueButton') as HTMLButtonElement
	const saveButton = recipientsForm.querySelector('#saveButton') as HTMLButtonElement
	const checkboxes = recipientsForm.querySelectorAll(
		'input[type="checkbox"]'
	) as NodeListOf<HTMLInputElement>

	return { recipientsForm, title, continueButton, saveButton, checkboxes }
}

function updateSaveButtonState({
	saveButton,
	checkedCheckboxes,
	selectedRecipients,
}: ButtonStateParams) {
	const isAnyCheckboxChecked = checkedCheckboxes.length > 0
	const isDifferentFromLocalStorage =
		JSON.stringify(checkedCheckboxes.sort()) !== JSON.stringify(selectedRecipients.sort())

	if (isAnyCheckboxChecked && isDifferentFromLocalStorage) saveButton?.classList.remove('disable')
	else saveButton?.classList.add('disable')
}

function updateContinueButtonState({
	continueButton,
	checkedCheckboxes,
	selectedRecipients,
}: ButtonStateParams) {
	const isSameAsLocalStorage =
		checkedCheckboxes.length > 0 &&
		selectedRecipients.length > 0 &&
		JSON.stringify(checkedCheckboxes.sort()) === JSON.stringify(selectedRecipients.sort())

	if (!isSameAsLocalStorage) continueButton?.classList.add('disable')

	if (isSameAsLocalStorage) continueButton?.classList.remove('disable')
}

function handleCheckboxChange({
	state,
	updateSaveButtonState,
	updateContinueButtonState,
	checkboxes,
	saveButton,
	continueButton,
}: HandleCheckboxChangeParams) {
	const checkedCheckboxes = getCheckedCheckboxes({ checkboxes })

	updateSaveButtonState({
		saveButton,
		checkedCheckboxes,
		selectedRecipients: state.selectedRecipients,
	})
	updateContinueButtonState({
		continueButton,
		checkedCheckboxes,
		selectedRecipients: state.selectedRecipients,
	})
}

function getCheckedCheckboxes({ checkboxes }: GetCheckedCheckboxesParams) {
	return Array.from(checkboxes)
		.filter((checkbox) => checkbox.checked)
		.map((checkbox) => checkbox.name)
}

function handleFormSubmit({
	state,
	event,
	recipientsForm,
	title,
	saveButton,
	continueButton,
	callback,
}: FormSubmitParams) {
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
	localStorage.setItem(LOCAL_STORAGE_KEY_RECIPIENTS, JSON.stringify(state.selectedRecipients))

	if (typeof callback === 'function') {
		callback(selectedRecipients)
	}

	saveButton.classList.add('disable')

	const checkboxes = recipientsForm.querySelectorAll(
		'input[type="checkbox"]'
	) as NodeListOf<HTMLInputElement>
	const checkedCheckboxes = getCheckedCheckboxes({ checkboxes })

	updateSaveButtonState({
		saveButton,
		checkedCheckboxes,
		selectedRecipients: state.selectedRecipients,
	})

	updateContinueButtonState({
		continueButton,
		checkedCheckboxes,
		selectedRecipients: state.selectedRecipients,
	})

	window.toast({
		title: 'Destinatarios seleccionados',
		location: 'top-center',
		dismissible: true,
		type: 'success',
		icon: true,
	})
}

function initializeCheckboxesState({
	checkboxes,
	selectedRecipients,
}: {
	checkboxes: NodeListOf<HTMLInputElement>
	selectedRecipients: string[]
}) {
	checkboxes.forEach((checkbox) => {
		if (selectedRecipients.includes(checkbox.name)) {
			checkbox.checked = true
		}
	})
}

function addCheckboxEventListeners({
	state,
	checkboxes,
	updateSaveButtonState,
	updateContinueButtonState,
	saveButton,
	continueButton,
}: CheckboxEventListenersParams) {
	checkboxes.forEach((checkbox) => {
		checkbox.addEventListener('change', () => {
			handleCheckboxChange({
				state,
				updateSaveButtonState,
				updateContinueButtonState,
				checkboxes,
				saveButton,
				continueButton,
			})
		})
	})
}

function addFormSubmitEventListener({
	state,
	recipientsForm,
	title,
	saveButton,
	continueButton,
	callback,
}: FormSubmitEventListenerParams) {
	recipientsForm.addEventListener('submit', (event) => {
		handleFormSubmit({ state, event, recipientsForm, title, saveButton, continueButton, callback })
	})
}

export function dispatchRecipientFormEvents(
	{ state, callback }: DispatchRecipientFormEventsParams = { state: { selectedRecipients: [] } }
) {
	const domElements = getDomElements()

	if (!domElements) return

	const { recipientsForm, title, continueButton, saveButton, checkboxes } = domElements

	initializeCheckboxesState({ checkboxes, selectedRecipients: state.selectedRecipients })

	const checkedCheckboxes = getCheckedCheckboxes({ checkboxes })

	updateSaveButtonState({
		saveButton,
		checkedCheckboxes,
		selectedRecipients: state.selectedRecipients,
	})
	updateContinueButtonState({
		continueButton,
		checkedCheckboxes,
		selectedRecipients: state.selectedRecipients,
	})

	addCheckboxEventListeners({
		state: state,
		checkboxes,
		updateSaveButtonState,
		updateContinueButtonState,
		saveButton,
		continueButton,
	})

	addFormSubmitEventListener({
		state: state,
		recipientsForm,
		title,
		saveButton,
		continueButton,
		callback: callback,
	})
}
