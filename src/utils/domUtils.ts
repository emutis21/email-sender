function toggleVisibility(element: HTMLElement, isVisible: boolean) {
	if (isVisible) {
		element.classList.remove('hidden')
		element.classList.add('flex')
	} else {
		element.classList.add('hidden')
		element.classList.remove('flex')
	}
}

export { toggleVisibility }
