import type { Recipient as IRecipient } from './types'

import Papa from 'papaparse'

interface RawRecipient extends IRecipient {
	type: 'recipient'
}

class Recipient implements IRecipient {
	id!: IRecipient['id']
	recipientName!: IRecipient['recipientName']
	recipientEmail!: IRecipient['recipientEmail']
	recipientPhone!: IRecipient['recipientPhone']

	set(recipient: RawRecipient) {
		Object.assign(this, {
			id: recipient.id,
			recipientName: recipient.recipientName,
			recipientEmail: recipient.recipientEmail,
			recipientPhone: recipient.recipientPhone,
		})
	}

	toJSON(): IRecipient {
		const recipient = {
			id: this.id,
			recipientName: this.recipientName,
			recipientEmail: this.recipientEmail,
			recipientPhone: this.recipientPhone,
		}

		return recipient
	}
}

function normalize(data: RawRecipient[]) {
	const recipients = new Map<RawRecipient['id'], Recipient>()

	for (const person of data) {
		const baseRecipient = new Recipient()

		baseRecipient.set(person as RawRecipient)

		recipients.set(baseRecipient.id, baseRecipient)
	}

	const normalized: IRecipient[] = Object.values(Object.fromEntries(recipients)).map((recipient) =>
		recipient.toJSON()
	)

	return normalized
}

const api = {
	list: async (): Promise<IRecipient[]> => {
		return fetch(import.meta.env.RECIPIENTS_DATA!).then(async (response) => {
			const cvs = await response.text()

			return new Promise<IRecipient[]>((resolve, reject) => {
				Papa.parse(cvs, {
					header: true,
					complete: (results) => {
						const data = normalize(results.data as RawRecipient[])

						return resolve(data)
					},
					error: (error: Error) => reject(error.message),
				})
			})
		})
	},
	fetch: async (id: IRecipient['id']): Promise<IRecipient> => {
		const recipients = await api.list()
		const recipient = recipients.find((recipient) => recipient.id === id)

		if (!recipient) return Promise.reject('Recipient not found')

		return recipient
	},
	mock: {
		list: (mock: string): Promise<IRecipient[]> =>
			import(`./mocks/${mock}.json`).then((result: { default: RawRecipient[] }) =>
				normalize(result.default)
			),
	},
}

export default api
