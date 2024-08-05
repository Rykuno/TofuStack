import nodemailer from 'nodemailer';
import { injectable } from 'tsyringe';
import type { Email } from '../interfaces/email.interface';
import { config } from '../common/config';


type SendProps = {
	to: string | string[];
	email: Email;
}

@injectable()
export class MailerService {
	private async sendDev({ to, email }: SendProps) {
		const message = await nodemailer.createTransport({
			host: 'smtp.ethereal.email',
			port: 587,
			secure: false, // Use `true` for port 465, `false` for all other ports
			auth: {
				user: 'adella.hoppe@ethereal.email',
				pass: 'dshNQZYhATsdJ3ENke'
			}
		}).sendMail({
			from: '"Example" <example@ethereal.email>',
			bcc: to,
			subject: email.subject(),
			text: email.html(),
			html: email.html()
		});
		console.log(nodemailer.getTestMessageUrl(message));
	}

	private async sendProd({ to, email }: SendProps) {
		// CONFIGURE MAILER
	}

	async send({ to, email }: SendProps) {
		if (config.isProduction) {
			await this.sendProd({ to, email });
		} else {
			await this.sendDev({ to, email });
		}
	}
}
