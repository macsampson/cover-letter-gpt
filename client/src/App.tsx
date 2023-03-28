import React, { useState, useRef, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Button from '@mui/material/Button'
import { TextField, CircularProgress } from '@mui/material'
import Grid from '@mui/material/Grid' // Grid version 1
import Grid2 from '@mui/material/Unstable_Grid2' // Grid version 2
import InputLabel from '@mui/material/InputLabel'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { fontSize } from '@mui/system'

const theme = createTheme({
	typography: {
		fontFamily: 'Roboto',
	},
})

interface Props {}

const App: React.FC<Props> = () => {
	const [count, setCount] = useState(0)

	const [isDragging, setIsDragging] = useState(false)
	const [file, setFile] = useState<File | null>(null)
	const [text, setText] = useState('')
	let [apiResponse, setApiResponse] = useState('')
	let [loading, SetLoading] = useState(false)

	const resultRef = useRef('')

	useEffect(() => {
		resultRef.current = apiResponse
	}, [apiResponse])

	const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(true)
	}

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(false)
	}

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		e.dataTransfer.dropEffect = 'copy'
		setIsDragging(true)
	}

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		const { files } = e.dataTransfer
		const file = files[0]
		if (
			file.type === 'application/pdf' ||
			file.type === 'application/msword' ||
			file.type ===
				'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
		) {
			setFile(file)
		}
		setIsDragging(false)
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target
		const file = files ? files[0] : null
		if (
			file &&
			(file.type === 'application/pdf' ||
				file.type === 'application/msword' ||
				file.type ===
					'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
		) {
			setFile(file)
		}
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		SetLoading(true)
		setApiResponse('')
		const formData = new FormData()
		// const source = new EventSource('/api/upload')
		formData.append('file', file as Blob)
		formData.append('text', text)

		const start = Date.now()
		try {
			const response = await fetch('https://cover-letter-gpt.onrender.com', {
				method: 'POST',
				body: formData,
			})

			SetLoading(false)
			const respTime = Date.now() - start
			console.log(respTime / 1000)
			// if (!reader) return
			const reader = response.body?.getReader()

			if (reader) {
				const decoder = new TextDecoder()

				while (true) {
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
						// console.log(json)
						if (json.choices[0].delta.content) {
							resultRef.current =
								resultRef.current + json.choices[0].delta.content.toString()
							setApiResponse(resultRef.current)
						}
					})
					if (dataDone) break

					if (done) {
						// The stream has been fully read
						break
					}
				}
			}

			console.log('stream complete')
		} catch (error) {
			console.error(error)
		}
	}

	function readChunks(reader: ReadableStreamDefaultReader<Uint8Array>) {
		return {
			async *[Symbol.asyncIterator]() {
				let readResult = await reader.read()
				while (!readResult.done) {
					yield readResult.value
					readResult = await reader.read()
				}
			},
		}
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setText(e.target.value)
	}

	return (
		<main>
			<ThemeProvider theme={theme}>
				<Grid2
					container
					spacing={2}
					justifyContent="center"
					padding={2}
					fontFamily="Roboto"
					id="title"
				>
					<h1>Cover Letter GPT 📃</h1>
				</Grid2>
				<Grid2
					container
					spacing={2}
					padding={3}
				>
					<Grid2
						// container
						// justifyContent="center"
						lg={6}
					>
						<form onSubmit={handleSubmit}>
							<Grid2>
								<div
									className={`drag-and-drop-container ${
										isDragging ? 'dragging' : ''
									}`}
									onDragEnter={handleDragEnter}
									onDragLeave={handleDragLeave}
									onDragOver={handleDragOver}
									onDrop={handleDrop}
								>
									<p>
										Drag and drop your PDF or Word Resume here, or browse local
										files.
									</p>
									<input
										type="file"
										accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
										onChange={handleFileChange}
									/>
									{file && <p>{file.name}</p>}
								</div>
							</Grid2>

							<Grid2>
								{/* <InputLabel
								htmlFor="text-input"
								style={{ textAlign: 'center', fontSize: '1.5em' }}
								className="textField"
							>
								Job Description
							</InputLabel> */}
								<div id="job-description">
									<TextField
										sx={{ '.MuiInputBase-root': { borderRadius: '10px' } }}
										id="text-input"
										placeholder="Please paste a job description..."
										value={text}
										onChange={handleInputChange}
										// className={styles.textBox}
										multiline
										maxRows={5}
										minRows={5}
										style={{ width: '100%' }}
									/>
								</div>
							</Grid2>
							<Grid2
								style={{ textAlign: 'center' }}
								display="flex"
								justifyContent="center"
								direction="column"
								alignItems="flex-end"
							>
								<Button
									sx={{ '.MuiButtonBase-root': { borderRadius: '10px' } }}
									variant="contained"
									type="submit"
									color="success"
								>
									Generate Cover Letter
								</Button>
							</Grid2>
							<Grid2
								style={{ textAlign: 'center' }}
								display="flex"
								justifyContent="center"
								direction="column"
								alignItems="flex-end"
							>
								{loading && (
									<CircularProgress
										thickness={7}
										color="success"
									/>
								)}
							</Grid2>
						</form>
					</Grid2>
					<Grid2
						// container
						// spacing={2}
						// padding={3}
						// justifyContent="center"
						lg={6}
					>
						<Grid2>
							{/* <InputLabel
								htmlFor="text-input"
								style={{ textAlign: 'center', fontSize: '1.5em' }}
								className="textField"
							>
								Cover Letter
							</InputLabel> */}
							<TextField
								sx={{ '.MuiInputBase-root': { borderRadius: '10px' } }}
								id="cover-letter-result"
								placeholder="Waiting for cover letter generation..."
								value={apiResponse}
								// onChange={(e) => setApiResponse(e.target.value)}
								multiline
								style={{ width: '100%' }}
							></TextField>
						</Grid2>
					</Grid2>
				</Grid2>
			</ThemeProvider>
		</main>
	)
}

export default App
