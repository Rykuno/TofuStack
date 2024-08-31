import { injectable } from 'tsyringe';
import { env } from '../configs/envs.config';
import type { Email } from '../common/inferfaces/email.interface';

type SendProps = {
	to: string | string[];
	email: Email;
}

@injectable()
export class MailerService {

	async send(data: SendProps) {
		const mailer = env.isProduction ? this.sendProd : this.sendDev;
		await mailer(data);
	}

	private async sendDev({ to, email }: SendProps) {
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				Attachments: [],
				From: { Email: "noreply@tofustack.com", Name: "TofuStack" },
				HTML: email.html(),
				Subject: email.subject(),
				Text: email.html(),
				To: Array.isArray(to) ? to.map(to => ({ Email: to, Name: to })) : [{ Email: to, Name: to }],
			})
		};

		const response = await fetch('http://localhost:8025/api/v1/send', options)
		const data = await response.json()
		console.log(`http://localhost:8025/view/${data.ID}`)
	}

	private async sendProd({ to, email }: SendProps) {
		// CONFIGURE MAILER
	}

}
