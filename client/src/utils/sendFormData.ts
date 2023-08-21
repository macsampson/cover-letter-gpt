// sendFormData.ts

// create two constants, one for prod and one for dev
const prod = {
	url: {
		API_URL: 'https://cover-letter-gpt.onrender.com',
	},
}

const dev = {
	url: {
		API_URL: 'http://localhost:5000',
	},
}

let dev_mode = true

// set the API_URL to the correct constant
const API_URL = dev_mode ? dev.url.API_URL : prod.url.API_URL

interface ResponseState {
	loading: boolean
}

export const sendFormData = async (
	formData: FormData,
	setState: any,
	resultRef: React.MutableRefObject<string>
): Promise<ResponseState> => {
	// console.log('sendFormData')
	try {
		const response = await fetch(API_URL, {
			method: 'POST',
			body: formData,
		})
		const reader = response.body?.getReader()
		const decoder = new TextDecoder()
		let responseText = ''

		while (true && reader) {
			const { done, value } = await reader.read()
			const text = decoder.decode(value)
			if (done) {
				// The stream has been fully read
				reader.cancel()
				break
			}

			let dataDone = false
			const arr = text.toString().split('\n')
			arr.forEach((data: any) => {
				if (data.length === 0) return // ignore empty message
				if (data.startsWith(':')) return // ignore sse comment message
				if (data === 'data: [DONE]') {
					dataDone = true
					return
				}
				const message = data.replace(/^data: /, '')
				const json = JSON.parse(message)
				if (json.choices[0].delta.content) {
					resultRef.current =
						resultRef.current + json.choices[0].delta.content.toString()
					setState((prevState: any) => ({
						...prevState,
						apiResponse: resultRef.current,
					}))
				}
			})

			if (dataDone) break
			if (done) break
		}

		return { loading: false }
	} catch (error) {
		console.error(error)
		return { loading: false }
	}
}

export default sendFormData
