import React, { useState, useRef, useEffect } from 'react'
import PrivacyPolicy from './components/PrivacyPolicy'
import ResumeUpload from './components/ResumeUpload'
import JobDescription from './components/JobDescription'
import CoverLetter from './components/CoverLetter'
import InputAlert from './components/InputAlert'
import './App.css'
import Button from '@mui/material/Button'
import Grid2 from '@mui/material/Unstable_Grid2' // Grid version 2
import { createTheme, ThemeProvider } from '@mui/material/styles'
import LoadingButton from '@mui/lab/LoadingButton'
import DescriptionIcon from '@mui/icons-material/Description'
import TwitterIcon from '@mui/icons-material/Twitter'
import 'typeface-roboto'
import handleSubmit from './utils/handleSubmit'

const theme = createTheme({
	typography: {
		fontFamily: 'Roboto',
	},
})

interface Props {}

const App: React.FC<Props> = () => {
	const [file, setFile] = useState<File | null>(null)
	const [text, setText] = useState<string | ''>('')
	const [state, setState] = useState({
		loading: false,
		apiResponse: '',
		alert: false,
	})

	const resultRef = useRef('')

	// function to set file to the file being passed back from resumeupload
	const handleFileUpload = (resume: File | null) => {
		setFile(resume)
	}

	// function to handle jd input and set text to it
	const handleJDInput = (jd: string | '') => {
		setText(jd)
	}

	// function to handle alert and set alert to it
	const handleAlertClose = (alert: boolean) => {
		setState({ ...state, alert: alert })
	}

	useEffect(() => {
		resultRef.current = state.apiResponse
	}, [state.apiResponse])

	return (
		<main>
			<ThemeProvider theme={theme}>
				<Grid2
					container
					spacing={2}
					justifyContent="center"
					padding={0}
					fontFamily="Roboto"
					className="title"
					lg={12}
					alignItems="center"
					display="flex"
				>
					<h1
						style={{
							paddingRight: '15px',
						}}
					>
						Cover Letter GPT
					</h1>
					<img
						src="/favicon.png"
						alt="logo"
						style={{}}
					/>
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
						textAlign="center"
						fontFamily="Roboto"
						lg={12}
						padding={2}
						className="blurb"
					>
						<p>
							Create a professional cover letter in seconds with this
							GPT-powered cover letter generator. Simply attach your resume, enter a job
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
					<Grid2
						lg={6}
						sm={12}
						xs={12}
					>
						<form
							onSubmit={(e) =>
								handleSubmit(e, state, setState, resultRef, file, text)
							}
						>
							<Grid2>
								<ResumeUpload onFileUpload={handleFileUpload} />
							</Grid2>

							<Grid2>
								<JobDescription onJDInput={handleJDInput} />
							</Grid2>
							<Grid2
								style={{ textAlign: 'center' }}
								display="flex"
								justifyContent="center"
								direction="column"
								alignItems="flex-end"
							>
								<LoadingButton
									type="submit"
									size="medium"
									endIcon={<DescriptionIcon />}
									loading={state.loading}
									loadingPosition="end"
									variant="contained"
									className="generate-cover-letter-button"
								>
									<span>Generate Cover Letter</span>
								</LoadingButton>
							</Grid2>
						</form>
					</Grid2>
					<Grid2
						lg={6}
						sm={12}
						xs={12}
					>
						<Grid2>
							<CoverLetter apiResponse={state.apiResponse} />
						</Grid2>
					</Grid2>
				</Grid2>
				<InputAlert
					open={state.alert}
					onAlertClose={handleAlertClose}
				/>
				<footer className="footer">
					<Grid2
						style={{ textAlign: 'center' }}
						display="flex"
						justifyContent="center"
						direction="column"
						alignItems="flex-end"
					>
						{/* <Button
							target="_blank"
							href="https://twitter.com/macxsampson"
							size="small"
							variant="outlined"
							endIcon={<TwitterIcon />}
							className="twitter-button"
						>
							Follow me on Twitter
						</Button> */}
					</Grid2>
					<Grid2
						style={{ textAlign: 'center' }}
						display="flex"
						justifyContent="center"
						direction="column"
						alignItems="flex-end"
					>
						<PrivacyPolicy />
					</Grid2>
				</footer>
			</ThemeProvider>
		</main>
	)
}

export default App
