import type { Email } from "../common/types/email"

export class LoginVerificationEmail implements Email {
	constructor(private readonly token: string) { }

	subject(): string {
		return 'Email Verification'
	}

	html() {
		return /*html*/ `
		<html lang='en'>
			<head>
				<meta http-equiv='X-UA-Compatible' content='IE=edge' />
				<meta name='viewport' content='width=device-width, initial-scale=1.0' />
				<title>Message</title>
			</head>
			<body>
				<p class='title'>Verify your email address</p>
				<p>
					Thanks for using example.com. We want to make sure it's really you. Please enter the following
					verification code when prompted. If you don't have an exmaple.com an account, you can ignore
					this message.</p>
				<div class='center'>
					<p class='token-title'>Verification Code</p>
					<p class='token-text'>${this.token}</p>
					<p class='token-subtext'>(This code is valid for 15 minutes)</p>
				</div>
			</body>
			<style>
				.title { font-size: 24px; font-weight: 700; } .token-text { font-size: 24px; font-weight: 700;
				margin-top: 8px; } .token-title { font-size: 18px; font-weight: 700; margin-bottom: 0px; }
				.center { display: flex; justify-content: center; align-items: center; flex-direction: column;}
				.token-subtext { font-size: 12px; margin-top: 0px; }
			</style>
		</html>
		`
	}
}
