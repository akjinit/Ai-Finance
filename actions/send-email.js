"use server";

import { Resend } from "resend";

export async function sendEmail({ to, subject, react, html, text }) {
  if (!process.env.RESEND_API_KEY) {
    return {
      success: false,
      error: "RESEND_API_KEY is not configured",
    };
  }

  const resend = new Resend(process.env.RESEND_API_KEY || "");

  try {
    const payload = {
      from: process.env.RESEND_FROM_EMAIL || "Finance App <onboarding@resend.dev>",
      to,
      subject,
    };

    if (html) payload.html = html;
    else if (text) payload.text = text;
    else if (react) payload.react = react;

    const { data, error } = await resend.emails.send(payload);

    if (error) {
      console.error("Failed to send email:", error);
      return {
        success: false,
        error: error.message || "Resend rejected the email request",
        details: JSON.parse(JSON.stringify(error)),
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return {
      success: false,
      error: error.message || "Failed to send email",
      details: {
        name: error.name,
        statusCode: error.statusCode,
      },
    };
  }
}
