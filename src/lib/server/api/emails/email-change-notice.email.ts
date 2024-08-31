import type { Email } from "../common/inferfaces/email.interface"

export class EmailChangeNoticeEmail implements Email {
	constructor() { }

	subject(): string {
		return 'Email Change Notice'
	}

	html() {
		return /*html*/ `
		<html lang='en'>
			<head>
				<meta http-equiv='X-UA-Compatible' content='IE=edge' />
				<meta name='viewport' content='width=device-width, initial-scale=1.0' />
				<title>Email Change Request</title>
			</head>
			<body>
				<p class='title'>Email address change notice </p>
				<p>
					An update to your email address has been requested. If this is unexpected or you did not perform this action, please login and secure your account.</p>
			</body>
			<style>
				.title { font-size: 24px; font-weight: 700; } .token-text { font-size: 24px; font-weight: 700; margin-top: 8px; }
				.token-title { font-size: 18px; font-weight: 700; margin-bottom: 0px; }
				.center { display: flex; justify-content: center; align-items: center; flex-direction: column;}
				.token-subtext { font-size: 12px; margin-top: 0px; }
			</style>
		</html>
		`
	}
}
