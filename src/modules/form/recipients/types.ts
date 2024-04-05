interface BaseParams {
	state: StateCheckboxes
	saveButton: HTMLButtonElement
	continueButton: HTMLButtonElement
}

export interface GetDomElementsParams {
	recipientsForm: HTMLFormElement
	title: HTMLHeadingElement
	continueButton: HTMLButtonElement
	saveButton: HTMLButtonElement
	checkboxes: NodeListOf<HTMLInputElement>
}

export interface GetCheckedCheckboxesParams {
	checkboxes: NodeListOf<HTMLInputElement>
}

export interface HandleCheckboxChangeParams extends BaseParams {
	updateSaveButtonState: (params: ButtonStateParams) => void
	updateContinueButtonState: (params: ButtonStateParams) => void
	checkboxes: NodeListOf<HTMLInputElement>
}

export interface CheckboxEventListenersParams extends BaseParams {
	checkboxes: NodeListOf<HTMLInputElement>
	updateSaveButtonState: (params: ButtonStateParams) => void
	updateContinueButtonState: (params: ButtonStateParams) => void
}

export interface FormSubmitEventListenerParams extends BaseParams {
	recipientsForm: HTMLFormElement
	title: HTMLHeadingElement
	callback?: (selectedRecipients: string[]) => void
}

export interface ButtonStateParams {
	saveButton?: HTMLButtonElement
	continueButton?: HTMLButtonElement
	checkedCheckboxes: string[]
	selectedRecipients: string[]
}

export interface FormSubmitParams {
	state: StateCheckboxes
	event: Event
	recipientsForm: HTMLFormElement
	title: HTMLHeadingElement
	saveButton: HTMLButtonElement
	continueButton: HTMLButtonElement
	callback?: (selectedRecipients: string[]) => void
}

export interface DispatchRecipientFormEventsParams {
	state: StateCheckboxes
	callback?: (selectedRecipients: string[]) => void
}

export interface StateCheckboxes {
	selectedRecipients: string[]
}
