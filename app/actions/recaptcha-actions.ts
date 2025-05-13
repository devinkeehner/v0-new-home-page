"use server"

// This server action safely provides the reCAPTCHA site key
export async function getReCaptchaSiteKey() {
  // Use the environment variable or fallback to a test key
  const siteKey = process.env.RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
  return { siteKey }
}
