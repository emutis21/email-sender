import { LOCAL_STORAGE_KEY_CONTACT, LOCAL_STORAGE_KEY_RECIPIENTS } from './consts.ts'

import { dispatchContactFormEvents } from './contact/index.ts'
import { dispatchRecipientFormEvents } from './recipients/index.ts'

import type { StateContactForm } from './contact/types.ts'
import type { StateCheckboxes } from './recipients/types.ts'

function handleRecipientFormEvents() {
	const stateRecipients: StateCheckboxes = {
		selectedRecipients: localStorage.getItem(LOCAL_STORAGE_KEY_RECIPIENTS)
			? JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_RECIPIENTS) as string)
			: [],
	}

	dispatchRecipientFormEvents({ state: stateRecipients })
}

function handleContactFormEvents(): boolean {
	const stateContactForm: StateContactForm = {
		emailContent: localStorage.getItem(LOCAL_STORAGE_KEY_CONTACT)
			? JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_CONTACT) as string)
			: {},
	}

	return dispatchContactFormEvents({ state: stateContactForm })
}

export { handleRecipientFormEvents, handleContactFormEvents }
