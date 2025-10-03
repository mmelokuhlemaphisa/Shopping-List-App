// src/env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_SECRET_KEY: string;
  }
}
