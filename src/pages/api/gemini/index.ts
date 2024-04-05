import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai'
import type { APIRoute } from 'astro'

const generationConfig = {
	stopSequences: ['red'],
	maxOutputTokens: 8000,
	topP: 1,
	topK: 16,
}

const safetySettings = [
	{ category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
	{
		category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
		threshold: HarmBlockThreshold.BLOCK_NONE,
	},
	{
		category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
		threshold: HarmBlockThreshold.BLOCK_NONE,
	},
	{
		category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
		threshold: HarmBlockThreshold.BLOCK_NONE,
	},
]

function createModel() {
	const genAI = new GoogleGenerativeAI(import.meta.env.GOOGLE_API_KEY || '')
	return genAI.getGenerativeModel({ model: 'gemini-pro', generationConfig, safetySettings })
}

function formatUserInputPrompt({
	trainingInput,
	prompt,
}: {
	trainingInput: string
	prompt: string
}) {
	return `Estas, son algunas de los parámetros qué te pido ${trainingInput}\nEn seguida te envío la petición del usuario:\n${prompt}`
}

async function generateContent({
	trainingInput,
	prompt,
	temperature,
}: {
	trainingInput: string
	prompt: string
	temperature: number
}) {
	const model = createModel()

	const formattedUserInputPrompt = formatUserInputPrompt({ trainingInput, prompt })

	try {
		const req = {
			contents: [{ role: 'user', parts: [{ text: formattedUserInputPrompt }] }],
			generationConfig: { ...generationConfig, temperature },
		}

		const result = await model.generateContentStream(req)
		const response = await result.response
		return await response.text()
	} catch (error) {
		console.error('Error generating content:', error)
		return 'Error generando contenido'
	}
}

function createResponse({ text }: { text: string }) {
	return new Response(
		JSON.stringify({
			message: { text },
		}),
		{
			status: 200,
		}
	)
}

export const runtime = 'edge'

export const POST: APIRoute = async ({ request }) => {
	if (request.headers.get('Content-Type') !== 'application/json') {
		return new Response(null, { status: 400 })
	}

	const body = await request.json()
	const { trainingInput, prompt, temperature } = body

	const text = await generateContent({ trainingInput, prompt, temperature })

	return createResponse({ text })
}
