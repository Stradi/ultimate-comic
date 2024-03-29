declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      REVALIDATION_SECRET: string;
      NEXT_PUBLIC_GA_ID: string;
    }
  }
}

export {};
