import { Resend } from "resend";

export default defineEventHandler(async (event) => {
  // Check environment first before creating Resend instance
  if (!process.env.RESEND_API_KEY) {
    throw createError({
      statusCode: 500,
      statusMessage: "Email service not configured",
    });
  }

  // Create Resend instance only after environment validation
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    // Get form data from the request
    const { email, message } = await readBody(event);

    // Validate the data
    if (!email || !message) {
      throw createError({
        statusCode: 400,
        statusMessage: "Email and message are required",
      });
    }

    // Send email using Resend
    const { data: _data, error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: ["derzsidezso@gmail.com"], // Replace with your email
      subject: `New Portfolio Contact from ${email}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <div style="background: var(--color-email-bg, #f5f5f5); padding: 15px; border-radius: 5px; margin: 10px 0;">
          ${message.replace(/\n/g, "<br>")}
        </div>
        <hr>
        <p style="color: var(--color-email-text, #666); font-size: 12px;">Sent from your portfolio contact form</p>
      `,
    });

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to send email",
      });
    }

    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Contact form error:", error);
    throw error;
  }
});
