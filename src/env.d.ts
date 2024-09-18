/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_ISSUE_URL: string;
  readonly VITE_TREE_FILES: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
