/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** API origin with optional trailing slash, e.g. https://api.course-ing.com/ */
  readonly VITE_API_ORIGIN?: string;
}
