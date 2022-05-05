declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      REVALIDATION_SECRET: string;

      STRAPI_URL: string;
      STRAPI_AUTH_TOKEN: string;
    }
  }
}

export {};
