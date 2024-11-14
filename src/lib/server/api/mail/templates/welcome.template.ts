import { type EmailTemplate } from "../interfaces/email-template.interface";

export class WelcomeEmail implements EmailTemplate {
	constructor() { }

	subject(): string {
		return 'Welcome!'
	}

	html(): string {
		return /*html*/ `	 	
		<html lang='en'>
			<head>
				<meta http-equiv='X-UA-Compatible' content='IE=edge' />
				<meta name='viewport' content='width=device-width, initial-scale=1.0' />
				<title>Message</title>
			</head>
			<body>
				<p class='title'>Welcome to Example</p>
				<p>
					Thanks for using example.com. We want to make sure it's really you. Please enter the following
					verification code when prompted. If you don't have an exmaple.com an account, you can ignore
					this message.</p>
			</body>
			<style>
				.title { font-size: 24px; font-weight: 700; } .token-text { font-size: 24px; font-weight: 700;
				margin-top: 8px; } .token-title { font-size: 18px; font-weight: 700; margin-bottom: 0px; }
				.center { display: flex; justify-content: center; align-items: center; flex-direction: column;}
				.token-subtext { font-size: 12px; margin-top: 0px; }
			</style>
		</html>
		`;
	}
}
