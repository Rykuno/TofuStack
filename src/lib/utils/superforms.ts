import { toast } from "svelte-sonner";
import { message, type ErrorStatus, type SuperForm, type SuperValidated } from "sveltekit-superforms";

export type Message = {
  type: 'error' | 'success',
  text: string
}

export function errorMessage(form: SuperValidated<any>, text: string | null, status: ErrorStatus = 500) {
  return message(form, {text: text || "Error", type: 'error'}, {status})
}

export function successMessage(form: SuperValidated<any>, text: string | null) {
  return message(form, {text: text || "Success", type: 'success'})
}

export function toastMessage(message: Message| undefined) {
  if (!message) return
  toast[message.type](message.text)
}