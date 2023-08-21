// import { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable';
import { Configuration, OpenAIApi } from 'openai';
// import { Transform } from 'stream'
import { AxiosResponse } from 'axios';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import cors from 'cors';

const reader = require('any-text');

dotenv.config();

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
	organization: process.env.ORG_ID,
});
const openai = new OpenAIApi(configuration);
const port = 5000;

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req: Request, res: Response) => {
	res.status(200).send({
		message: 'haihsfadF',
	});
});

app.post('/', async (req: Request, res: Response) => {
	const form = formidable.formidable({ keepExtensions: true });

	form.parse(req, async (err, fields, files) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: 'Error parsing file data' });
		}

		const file = files.file;
		// console.log(resume)

		if (!file && !fields.text) {
			return res.status(400).json({
				message: 'Please provide both a resume and a job description',
			});
		}

		const resume = await reader.getText((file as any).filepath);
		if (!resume) {
			return res
				.status(400)
				.json({ message: 'There was an error reading file data' });
		}
		// Do something with the file and text data
		try {
			const response: AxiosResponse<any> = await openai.createChatCompletion(
				{
					model: 'gpt-4',
					messages: [
						{
							role: `user`,
							content: `here is my resume: "${resume}" and here is the job description: "${fields.text}"`,
						},
						{
							role: `system`,
							content: `Assume you are an expert Human Resources Manager, with years of experience and a Doctorate in Business Administration.
									You are working with a job-seeker on their Cover Letter.
									The cover letter you output must be short and sweet.
									Your main goal is to maximize the chances of the job seeker getting hired with this cover letter.
									You only have to mention the applicants qualifications that are relevant to the keywords from the Job Description.
									You can reorganize and paraphrase the letter as needed to prioritize the most job-relevant information.
									Write only the body of the letter, don't write the headers of the letter.
									Make it 65% Professional; 35% Warm and personal.
									Don't use textual text from the applicant's profile.
									The letter must cover these 4 topics, in any order:
									- Engaging introduction
									- Express passion and interest in the position
									- Persuasively highlight how the applicant’s background relates to the job position
									- The things you believe distinguish you from other candidates

									Make sure the Cover Letter is short, professional and meaningful, avoiding sounding like ChatGPT or an AI helper.
									Make sure all paragraphs in the cover letter are well connected with each other, most paragraphs should have topic sentences, concluding sentences and connecting clauses. The text must flow through ideas naturally and logically.
									Please keep it to 250 words or less.`,
						},
					],
					temperature: 0.75,
					max_tokens: 500,
					stream: true,
				},
				{ responseType: 'stream' }
			);
			// .then((resp: any) => {
			response.data.on('data', (data: any) => {
				res.write(`${data}\n\n`);
			});
			response.data.on('end', () => {
				console.log('stream complete');
				return res.status(200).end();
			});
			// })
		} catch (error) {
			console.log(error); // handle error
			return res.status(500).json({ message: 'An error occurred' });
		}
	});
});

app.listen(port, () => {
	console.log(`Server is running on port http://localhost:${port}`);
});
