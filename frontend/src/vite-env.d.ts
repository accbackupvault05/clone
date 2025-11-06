/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_SOCKET_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_MAX_FILE_SIZE: string;
  readonly VITE_SUPPORTED_IMAGE_FORMATS: string;
  readonly VITE_SUPPORTED_VIDEO_FORMATS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}