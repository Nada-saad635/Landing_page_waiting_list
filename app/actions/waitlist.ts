"use server"

import { Resend } from "resend"
import { waitlistSchema } from "@/lib/validations/waitlist"
import { revalidatePath } from "next/cache"
import EmailTemplate from "../components/email-template"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function addToWaitlist(prevState: any, formData: FormData) {
  const validatedFields = waitlistSchema.safeParse({
    email: formData.get("email"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to add to waitlist.",
    }
  }

  const { email } = validatedFields.data

  try {
    const data = await resend.emails.send({
      from: "Waitlist Form <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to the waitlist!",
      react: EmailTemplate({ email: email }),
    })

    revalidatePath("/")
    return { message: "Thanks! You are on the waitlist." }
  } catch (error) {
    return { message: "Failed to send email." }
  }
}
