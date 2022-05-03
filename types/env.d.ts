declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      REVALIDATION_SECRET: string;
    }
  }
}

export {};
