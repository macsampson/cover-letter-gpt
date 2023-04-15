import { validateForm } from './validateForm'
import { sendFormData } from './sendFormData'

const handleSubmit = async (
	e: React.FormEvent<HTMLFormElement>,
	state: any,
	setState: any,
	resultRef: React.MutableRefObject<string>,
	resume: File | null,
	jd: string
) => {
	e.preventDefault()
	// console.log('handleSubmit')
	setState((prevState: any) => ({
		...prevState,
		loading: true,
		apiResponse: '',
	}))
	const formData = new FormData()
	// console.log(e.currentTarget)
	formData.append('file', resume as Blob)
	formData.append('text', jd as string)
	const { alert, loading } = validateForm(
		formData.get('file') as File,
		formData.get('text') as string
	)
	// console.log(formData)
	if (alert) {
		// console.log('alert')
		setState((prevState: any) => ({ ...prevState, alert, loading }))
		return
	}

	const { loading: streamLoading } = await sendFormData(
		formData,
		setState,
		resultRef
	)

	setState((prevState: any) => ({
		...prevState,
		loading: streamLoading,
	}))

	// console.log((Date.now() - start) / 1000)
}

export default handleSubmit
