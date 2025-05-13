declare global {
  namespace NodeJS {
    interface ProcessEnv {
      RECAPTCHA_SECRET_KEY?: string
      GF_API_KEY?: string
      GF_API_SECRET?: string
      WP_URL?: string
      FORM_ID?: string
      CONTACT_FORM_ID?: string
    }
  }
}

export {}
