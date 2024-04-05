export interface GetDomElementsParams {
	contactForm: HTMLFormElement
	emailSender: HTMLInputElement
	subjectbox: HTMLInputElement
	message: HTMLTextAreaElement
	sendButton: HTMLButtonElement
}

export interface ClearEventParams {
	inputElement: HTMLInputElement | HTMLTextAreaElement
	clearButton: HTMLButtonElement
}

export interface ToggleClassParams {
	element: HTMLElement | null
	removeClass: string
	addClass: string
}

export interface HandleInputArgs {
	inputElement: HTMLInputElement | HTMLTextAreaElement
	errorClass: string
	altClass: string
}

export interface HandleClearButtonClickArgs {
	button: HTMLButtonElement
	inputElement: HTMLInputElement | HTMLTextAreaElement
}

export interface HandleContactFormSubmitArgs {
	form: HTMLFormElement
	emailSender: HTMLInputElement
	subjectbox: HTMLInputElement
	message: HTMLTextAreaElement
	state: StateContactForm
}

export interface EmailContent {
	id: `${string}-${string}-${string}-${string}-${string}`
	emailSender: string
	subjectbox: string
	message: string
}

export interface StateContactForm {
	emailContent: EmailContent
}

export interface DispatchContactFormEventsArgs {
	state: StateContactForm
}

export interface HandleInputFocusArgs {
	inputElement: HTMLInputElement | HTMLTextAreaElement
	button: HTMLButtonElement
}
