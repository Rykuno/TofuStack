import type { EmailTemplate } from './email-template.interface';

export type SendProps = {
  to: string | string[];
  template: EmailTemplate;
};

export interface Mailer {
  send: (data: SendProps) => Promise<void>;
}
