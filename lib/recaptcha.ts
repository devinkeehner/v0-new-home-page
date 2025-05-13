// Verify reCAPTCHA token with Google's API
export async function verifyRecaptchaToken(token: string): Promise<{
  success: boolean
  score?: number
  error?: string
}> {
  try {
    const secret = process.env.RECAPTCHA_SECRET_KEY

    if (!secret) {
      console.error("RECAPTCHA_SECRET_KEY is not defined in environment variables")
      return { success: false, error: "reCAPTCHA configuration error" }
    }

    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${secret}&response=${token}`,
    })

    const data = await response.json()

    if (data.success) {
      return {
        success: true,
        score: data.score,
      }
    } else {
      console.error("reCAPTCHA verification failed:", data["error-codes"])
      return {
        success: false,
        error: "reCAPTCHA verification failed",
      }
    }
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error)
    return {
      success: false,
      error: "Error verifying reCAPTCHA",
    }
  }
}
