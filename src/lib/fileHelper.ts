import { open } from '@tauri-apps/api/dialog';
import { readTextFile } from '@tauri-apps/api/fs';

export const selectJsonFile = async () => {
  const selected = await open({
    filters: [{
      name: 'JSON',
      extensions: ['json']
    }]
  });

  // user cancelled the selection
  if (selected === null) { return null; }

  return selected as string;
}

export const readJsonFile = async (filePath: string) => {
  const jsonFileText : string = await readTextFile(filePath);

  if (!jsonFileText) { return null; }

  const jsonFile = JSON.parse(jsonFileText);

  if (!jsonFile) { return null; }

  return jsonFile;
}
