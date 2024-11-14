export interface EmailTemplate {
  subject(): string
  html(): string;
}
