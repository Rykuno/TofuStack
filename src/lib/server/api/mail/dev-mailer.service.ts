import { injectable } from "@needle-di/core";
import type { Mailer, SendProps } from "./interfaces/mailer.interface";

@injectable()
export class DevMailerService implements Mailer {
  async send({ to, template }: SendProps) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Attachments: [],
        From: { Email: "noreply@tofustack.com", Name: "TofuStack" },
        HTML: template.html(),
        Subject: template.subject(),
        Text: template.html(),
        To: Array.isArray(to)
          ? to.map((to) => ({ Email: to, Name: to }))
          : [{ Email: to, Name: to }],
      }),
    };

    const response = await fetch("http://localhost:8025/api/v1/send", options);
    const data = await response.json();
    // @ts-ignore idk
    console.log(
      `%chttp://localhost:8025/view/${data.ID}`,
      `color: blue;`,
    );
  }
}
