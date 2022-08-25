export {};

// This can be used to determine if you are running locally in tauri 
declare global {
  interface Window {
    __TAURI__: boolean;
  }
}