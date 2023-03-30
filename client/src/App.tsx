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
import LoadingButton from '@mui/lab/LoadingButton'
import DescriptionIcon from '@mui/icons-material/Description'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import TwitterIcon from '@mui/icons-material/Twitter'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

const theme = createTheme({
	typography: {
		fontFamily: 'Roboto',
	},
})

interface Props {}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
	'& .MuiDialogContent-root': {
		padding: theme.spacing(2),
	},
	'& .MuiDialogActions-root': {
		padding: theme.spacing(1),
	},
}))

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
	props,
	ref
) {
	return (
		<MuiAlert
			elevation={6}
			ref={ref}
			variant="filled"
			{...props}
		/>
	)
})

const App: React.FC<Props> = () => {
	const [count, setCount] = useState(0)

	const [isDragging, setIsDragging] = useState(false)
	const [file, setFile] = useState<File | null>(null)
	const [text, setText] = useState('')
	let [apiResponse, setApiResponse] = useState('')
	let [loading, SetLoading] = useState(false)
	let [alert, SetAlert] = useState(false)
	let [privacyDialog, SetPrivacyDialog] = useState(false)

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
		if (!file || !text) {
			SetAlert(true)
			SetLoading(false)
			return
		}
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
			// console.log()
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

	const handleBrowseClick = () => {
		const input = document.querySelector<HTMLInputElement>('input[type="file"]')
		input && input.click()
	}

	const handleAlert = () => {
		SetAlert(true)
	}

	const handleClose = (
		event?: React.SyntheticEvent | Event,
		reason?: string
	) => {
		if (reason === 'clickaway') {
			return
		}

		SetAlert(false)
	}

	const handleClickDialog = () => {
		SetPrivacyDialog(true)
	}
	const handleCloseDialog = () => {
		SetPrivacyDialog(false)
	}

	interface DialogTitleProps {
		id: string
		children?: React.ReactNode
		onClose: () => void
	}

	function BootstrapDialogTitle(props: DialogTitleProps) {
		const { children, onClose, ...other } = props

		return (
			<DialogTitle
				sx={{ m: 0, p: 2 }}
				{...other}
			>
				{children}
				{onClose ? (
					<IconButton
						aria-label="close"
						onClick={onClose}
						sx={{
							position: 'absolute',
							right: 8,
							top: 8,
							color: (theme) => theme.palette.grey[500],
						}}
					>
						<CloseIcon />
					</IconButton>
				) : null}
			</DialogTitle>
		)
	}

	// const handleClick = (e: React.FormEvent<HTMLFormElement>) => {
	// 	handleSubmit(e)
	// }

	return (
		<main>
			<ThemeProvider theme={theme}>
				<Grid2
					container
					spacing={2}
					justifyContent="center"
					padding={0}
					fontFamily="Roboto"
					id="title"
					lg={12}
				>
					<h1>Cover Letter GPT 📃</h1>
				</Grid2>

				<Grid2
					className="mainGrid"
					container
					spacing={2}
					padding={2}
					// justifyContent="center"
					// display="flex"
				>
					<Grid2
						spacing={2}
						justifyContent="center"
						fontFamily="Roboto"
						lg={12}
						padding={2}
						paddingLeft={15}
						paddingRight={15}
					>
						<p>
							Create a professional cover letter in seconds with this
							GPT-powered web app. Simply attach your resume, enter a job
							description, and let it create a cover letter for you.
						</p>
						<br></br>
						<p
							style={{
								textAlign: 'center',
							}}
						>
							Try it now and land your dream job!
						</p>
					</Grid2>
					<Grid2 lg={6}>
						<form onSubmit={handleSubmit}>
							<Grid2>
								<div
									style={{
										padding: '7px',
										backgroundColor: 'white',
										borderRadius: '10px',
									}}
								>
									<div
										className={`drag-and-drop-container ${
											isDragging ? 'dragging' : ''
										}`}
										onDragEnter={handleDragEnter}
										onDragLeave={handleDragLeave}
										onDragOver={handleDragOver}
										onDrop={handleDrop}
									>
										<svg
											className="dropIcon"
											viewBox="0 0 1024 1024"
											focusable="false"
											data-icon="inbox"
											width="3em"
											height="3em"
											fill="#1677ff"
											aria-hidden="true"
										>
											<path d="M885.2 446.3l-.2-.8-112.2-285.1c-5-16.1-19.9-27.2-36.8-27.2H281.2c-17 0-32.1 11.3-36.9 27.6L139.4 443l-.3.7-.2.8c-1.3 4.9-1.7 9.9-1 14.8-.1 1.6-.2 3.2-.2 4.8V830a60.9 60.9 0 0060.8 60.8h627.2c33.5 0 60.8-27.3 60.9-60.8V464.1c0-1.3 0-2.6-.1-3.7.4-4.9 0-9.6-1.3-14.1zm-295.8-43l-.3 15.7c-.8 44.9-31.8 75.1-77.1 75.1-22.1 0-41.1-7.1-54.8-20.6S436 441.2 435.6 419l-.3-15.7H229.5L309 210h399.2l81.7 193.3H589.4zm-375 76.8h157.3c24.3 57.1 76 90.8 140.4 90.8 33.7 0 65-9.4 90.3-27.2 22.2-15.6 39.5-37.4 50.7-63.6h156.5V814H214.4V480.1z"></path>
										</svg>
										<p>Drop your PDF or Word Resume</p>
										<div style={{ paddingTop: '10px' }}>
											<a
												// id="browseFiles"
												href="#"
												onClick={handleBrowseClick}
											>
												Browse my Computer
											</a>
										</div>
										<input
											type="file"
											accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
											onChange={handleFileChange}
										/>
										{file && <p id="resume">{file.name}</p>}
									</div>
								</div>
							</Grid2>

							<Grid2>
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
										// style={{ width: '100%' }}
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
								<LoadingButton
									// sx={{
									// 	'.MuiLoadingButton-root': { borderRadius: '10px' },
									// }}
									type="submit"
									size="medium"
									// onClick={handleClick}
									endIcon={<DescriptionIcon />}
									loading={loading}
									loadingPosition="end"
									variant="contained"
								>
									<span>Generate Cover Letter</span>
								</LoadingButton>
								{/* <Button
									sx={{ '.MuiButtonBase-root': { borderRadius: '10px' } }}
									variant="contained"
									type="submit"
									color="primary"
								>
									Generate Cover Letter
								</Button> */}
							</Grid2>
							{/* <Grid2
								style={{ textAlign: 'center' }}
								display="flex"
								justifyContent="center"
								direction="column"
								alignItems="flex-end"
							>
								{loading && (
									<CircularProgress
										thickness={7}
										color="primary"
									/>
								)}
							</Grid2> */}
						</form>
					</Grid2>
					<Grid2 lg={6}>
						<Grid2>
							<TextField
								sx={{ '.MuiInputBase-root': { borderRadius: '10px' } }}
								id="cover-letter-result"
								placeholder="Waiting for cover letter generation..."
								value={apiResponse}
								// onChange={(e) => setApiResponse(e.target.value)}
								multiline
								// style={{ width: '100%' }}
							></TextField>
						</Grid2>
					</Grid2>
				</Grid2>
				<Snackbar
					open={alert}
					autoHideDuration={6000}
					onClose={handleClose}
					anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				>
					<Alert
						onClose={handleClose}
						severity="error"
						sx={{ width: '100%' }}
					>
						Missing resume or job description!
					</Alert>
				</Snackbar>
				<Grid2
					style={{ textAlign: 'center' }}
					display="flex"
					justifyContent="center"
					direction="column"
					alignItems="flex-end"
					paddingRight={3}
					paddingTop={9}
				>
					<Button
						target="_blank"
						href="https://twitter.com/_macsampson_"
						size="small"
						variant="outlined"
						endIcon={<TwitterIcon />}
						// sx={{ position: 'absolute', bottom: '5vh', borderRadius: '10px' }}
					>
						Follow me on Twitter
					</Button>
				</Grid2>
				<Grid2
					style={{ textAlign: 'center' }}
					display="flex"
					justifyContent="center"
					direction="column"
					alignItems="flex-end"
					paddingRight={3}
					paddingTop={2}
				>
					<a onClick={handleClickDialog}>- Privacy -</a>
					<BootstrapDialog
						onClose={handleCloseDialog}
						aria-labelledby="customized-dialog-title"
						open={privacyDialog}
					>
						<BootstrapDialogTitle
							id="customized-dialog-title"
							onClose={handleCloseDialog}
						>
							Privacy Policy
						</BootstrapDialogTitle>
						<DialogContent dividers>
							<h4>Collection of Information</h4>
							<Typography
								gutterBottom
								paddingTop={1}
								paddingBottom={1}
							>
								This app does not collect any personal data from users, and the
								only information that is processed is the resume and job
								description data submitted through our app. This data is
								processed in memory while the app is in use and is not persisted
								anywhere.
							</Typography>
							<h4>Use of Information</h4>
							<Typography
								gutterBottom
								paddingTop={1}
								paddingBottom={1}
							>
								This app uses the resume and job description data submitted by
								users solely for the purpose of generating a customized cover
								letter for the user. It does not share this information with any
								third parties and does not use it for any other purposes.
							</Typography>
							<h4>Protection of Information</h4>
							<Typography
								gutterBottom
								paddingTop={1}
								paddingBottom={1}
							>
								Reasonable measures are taken to protect the data submitted by
								users. This app processes the data in memory and does not
								persist it anywhere, ensuring that it is not accessible to
								unauthorized parties.
							</Typography>
						</DialogContent>
					</BootstrapDialog>
				</Grid2>
			</ThemeProvider>
		</main>
	)
}

export default App
