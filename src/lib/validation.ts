declare type anyString = string | undefined | null;
declare type anyCollection = Array<any> | Map<any, any> | Set<any> | undefined | null;

export function hasItem(value: anyCollection): boolean {
  if (Array.isArray(value)) {
    return value.length > 0
  }

  return !!value && value.size > 0;
};

export function hasData(value: anyString): boolean {
  return !!value && value.trim() !== '';
};

export function isTauri(): boolean {
  return !!window.__TAURI__;
};
