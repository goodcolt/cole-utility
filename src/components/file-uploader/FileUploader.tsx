import { useEffect, useRef, useState } from 'react'
import { hasData } from '../../lib/validation';
import { open } from '@tauri-apps/api/dialog';
import { readTextFile } from '@tauri-apps/api/fs';
import './file-uploader.css'

interface Props {
  onFileChange?: (jsonFile: JSON) => void;
}

// Note, currently just does JSON files
const FileUploader = (props: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileContent, setFileContent] = useState<any>();
  const [fileName, setFileName] = useState<string>();

  useEffect(() => {
    props.onFileChange && props.onFileChange(fileContent);
  }, [fileContent])

  const openWebFile = (e: any) => {
    const reader = new FileReader();
    const [file] = e.target.files as File[];

    // No file selected
    if (file === null) {
      return;
    }

    reader.readAsText(file, 'UTF-8');

    reader.onload = (f) => {
      const fileData = f?.target?.result?.toString() as string;

      if (!hasData(fileData)) {
        return;
      }

      // Parse to JSON
      const jsonFile = JSON.parse(fileData);

      if (!jsonFile) {
        return;
      }

      setFileName(file.name);
      setFileContent(jsonFile);
    };
  };

  const openTauriFile = async () => {
    // Select file
    const selectedFile = await open({
      multiple: false,
      filters: [{
        name: 'JSON',
        extensions: ['json']
      }]
    }) as string;

    // User cancelled the selection
    if (!hasData(selectedFile)) {
      return;
    }

    // Read file
    const jsonFileText: string = await readTextFile(selectedFile);

    if (!jsonFileText) {
      return;
    }

    // Parse to JSON
    const jsonFile = JSON.parse(jsonFileText);

    if (!jsonFile) {
      return null;
    }

    setFileName(selectedFile);
    setFileContent(jsonFile);
  }

  const handleOpenFile = (e: any) => {
    // Tauri file explorer
    if (window.__TAURI__) {
      openTauriFile();
      return;
    }

    // Browser file explorer
    !!fileRef.current && fileRef.current.click()
  };

  return (
    <div className={'file-uploader'}>
      <button onClick={handleOpenFile}>
        Open File
      </button>
      <input type='file' accept='application/JSON' multiple={false} ref={fileRef} hidden onChange={openWebFile} />  
      <div>  
        <label>{'File: '}</label>
        <span>{hasData(fileName) && fileName || 'No File Chosen'}</span> 
      </div>   
    </div>
  );
}

export default FileUploader
