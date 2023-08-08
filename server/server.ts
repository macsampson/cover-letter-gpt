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
<<<<<<< HEAD
	apiKey: process.env.OPENAI_API_KEY,
	organization: process.env.ORG_ID,
});
const openai = new OpenAIApi(configuration);
const port = 5000;
=======
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.ORG_ID,
})
const openai = new OpenAIApi(configuration)
const port = 5000
>>>>>>> c2335e4d60a0e761c7c22d23b72cd14cac4effb6

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req: Request, res: Response) => {
<<<<<<< HEAD
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
							content: `here is my resume: "${resume}"  here is the job description: "${fields.text}"`,
						},
						{
							role: `system`,
							content: `Please compose a compelling cover letter in 200 words or less explaining why I am the best fit for this role. Do not just list skills and experiences from my resume or job description word for word.  If there are some skills required for the job description that are not in the resume, express interest in learning them. Please sign off with my name.`,
						},
					],
					temperature: 0.9,
					max_tokens: 1200,
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
=======
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
              content: `You will be given a resume and job description. Using my resume as a reference, please create a cover letter for the role in the job description.`,
            },
            {
              role: `user`,
              content: `here is my resume: "${resume}"  here is the job description: "${fields.text}"`,
            },
            {
              role: `system`,
              content: `Please write a cover letter, with metrics, based on the job description above, use my resume for reference and keep it less than 400 words.`,
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
>>>>>>> c2335e4d60a0e761c7c22d23b72cd14cac4effb6
