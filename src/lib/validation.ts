export function hasItem (value: Array<any> | Map<any, any> | Set<any> | undefined | null): boolean {
  if (Array.isArray(value)) {
    return !!value && value.length > 0
  }

  return !!value && value.size > 0;
};

export function hasData (value: string | undefined | null): boolean {
  return !!value && value.trim() !== '';
};