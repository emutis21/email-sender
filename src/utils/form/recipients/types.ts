interface BaseParams {
	state: State
	saveButton: HTMLButtonElement
	continueButton: HTMLButtonElement
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
	state: State
	event: Event
	recipientsForm: HTMLFormElement
	title: HTMLHeadingElement
	saveButton: HTMLButtonElement
	continueButton: HTMLButtonElement
	callback?: (selectedRecipients: string[]) => void
}

export interface DispatchRecipientFormEventsParams {
	state: State
	callback?: (selectedRecipients: string[]) => void
}

export interface State {
	selectedRecipients: string[]
}
