// import { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import { Configuration, OpenAIApi } from 'openai'
// import { Transform } from 'stream'
import { AxiosResponse } from 'axios'
import dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import cors from 'cors'

const reader = require('any-text')

dotenv.config()

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
	organization: process.env.ORG_ID,
})
const openai = new OpenAIApi(configuration)
const port = 5000

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req: Request, res: Response) => {
	res.status(200).send({
		message: 'haihsfadF',
	})
})

app.post('/', async (req: Request, res: Response) => {
	const form = formidable.formidable({ keepExtensions: true })

	form.parse(req, async (err, fields, files) => {
		if (err) {
			console.error(err)
			return res.status(500).json({ message: 'Error parsing file data' })
		}

		const file = files.file
		// console.log(resume)

		if (!file && !fields.text) {
			return res
				.status(400)
				.json({ message: 'Please provide both a resume and a job description' })
		}

		const resume = await reader.getText((file as any).filepath)
		if (!resume) {
			return res
				.status(400)
				.json({ message: 'There was an error reading file data' })
		}
		// Do something with the file and text data
		try {
			const response: AxiosResponse<any> = await openai.createChatCompletion(
				{
					model: 'gpt-3.5-turbo',
					messages: [
						{
							role: `system`,
							content: `You will be given a resume and job description. Using my resume as a reference, please create a cover letter for the role in the job description. If there are some skills required for the job description that are not in the resume, express interest in learning them.`,
						},
						{
							role: `user`,
							content: `here is my resume: "${resume}"  here is the job description: "${fields.text}"`,
						},
						{
							role: `assistant`,
							content: `Dear Francis,

Two months ago, I shattered a record I had previously considered unbreakable. My solutions for developing and optimizing ABC’s flagship apps and online software helped increase annual mean NPS to a staggering 61.8 (37% increase.) Soon after that, I came across the opening for Software Development Team Lead at XYZ Corp. As a lifelong fan of your cutting-edge software solutions, I immediately knew that this post was the perfect match for my skills and expertise.

I know your chief focus for the upcoming 18 months will be on developing new mobile apps for personal finance management. In my current position as IT Team Lead with ABC Inc., my primary challenge has been to supervise the development and design of our mobile and desktop applications for flawless user experience. Here are some of my most recent results:

 

   - 3 out of 4 apps I developed in 2017 have been rated above 4.7 stars in both AppStore and Google Play.
   - Upgraded premium versions of our products increased quarterly revenue by 86% in 2017 Q4.
   - New Help Desk solutions cut Customer Effort Scores by 31%.

 

With more than 10 years of experience in software engineering, I am positive I can help XYZ Corp achieve similar results.

End User Satisfaction has always been the single most important KPI for measuring my teams’ performance. I know that this value is also the cornerstone of XYZ’s mission and vision—that’s why I was so excited when I first saw your opening.

When can we schedule a meeting and discuss how my success at ABC can translate into IT Happiness growth for you?

Kind Regards,

Tabitha Hirvanen`,
						},
						{
							role: `system`,
							content: `Please compose a compelling cover letter in 200 words or less explaining why I am the best fit for this role. Do not just list skills and experiences from my resume or job description word for word. Please sign off with my name.`,
						},
					],
					temperature: 0.9,
					max_tokens: 1200,
					stream: true,
				},
				{ responseType: 'stream' }
			)
			// .then((resp: any) => {
			response.data.on('data', (data: any) => {
				res.write(`${data}\n\n`)
			})
			response.data.on('end', () => {
				console.log('stream complete')
				return res.status(200).end()
			})
			// })
		} catch (error) {
			console.log(error) // handle error
			return res.status(500).json({ message: 'An error occurred' })
		}
	})
})

app.listen(port, () => {
	console.log(`Server is running on port http://localhost:${port}`)
})
