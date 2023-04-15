// validateForm.ts
interface ValidationState {
	alert: boolean
	loading: boolean
}

export const validateForm = (file: File, text: string): ValidationState => {
	// console.log(file, text)
	if (!file || !text) {
		console.log('missing file or text')
		return { alert: true, loading: false }
	}
	return { alert: false, loading: true }
}

export default validateForm
