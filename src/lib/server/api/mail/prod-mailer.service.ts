import { injectable } from "@needle-di/core";
import type { Mailer, SendProps } from "./interfaces/mailer.interface";

@injectable()
export class ProdMailerService implements Mailer {
  async send({ to, template }: SendProps) {
    console.log(`Sending email to ${to}`);
    console.log(`Email: ${template}`);
    return await Promise.resolve();
  }
}
