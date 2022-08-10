import { ChangeEvent, useState } from 'react'
import { readJsonFile, selectJsonFile } from '../../lib/fileHelper';
import PackageLockListView from './PackageLockListView';
import './package-lock.css'

const parseLockFile = (lockFileJson: any): IPackageLock => {
  let packageLock: IPackageLock = {
    projectName: '',
    dependencyList: []
  };

  if (lockFileJson.hasOwnProperty('name')) {
    packageLock.projectName = lockFileJson.name;
  }

  if (lockFileJson.hasOwnProperty('dependencies')) {
    packageLock.dependencyList = parseDependencies(lockFileJson.dependencies);
  }

  return packageLock;
}

const parseDependencies = (dependenciesJson: any): IDependency[] => {
  let dependencyList: IDependency[] = [];
  let dependency: IDependency;

  const dependencykeys: string[] = Object.keys(dependenciesJson);
  if (dependencykeys.length < 1) { return dependencyList; }

  for (let key of dependencykeys) {
    dependency = {
      name: key,
      version: dependenciesJson[key].version,
      dependencyList: [],
      requireList: []
    };

    if (dependenciesJson[key].hasOwnProperty('requires')) {
      dependency.requireList = parseRequires(dependenciesJson[key].requires);
    }

    // Recursively get nested dependencies
    if (dependenciesJson[key].hasOwnProperty('dependencies')) {
      dependency.dependencyList = parseDependencies(dependenciesJson[key].dependencies);
    }

    dependencyList.push(dependency);
  }

  return dependencyList;
}

const parseRequires = (requiresJson: any): IPackage[] => {
  let requireList: IPackage[] = [];
  let requirePackage: IPackage;

  const requirekeys: string[] = Object.keys(requiresJson);
  if (requirekeys.length < 1) { return requireList; }

  for (let key of requirekeys) {
    requirePackage = {
      name: key,
      version: requiresJson[key]
    };

    requireList.push(requirePackage);
  }

  return requireList;
}

const PackageLock = () => {
  const [filePath, setFilePath] = useState<string>();
  const [packageLock, setPackageLock] = useState<IPackageLock>();
  const [packageName, setPackageName] = useState<string>();

  const openPackageLockFile = async () => {
    const selectedFile = await selectJsonFile();

    // No file selected
    if (selectedFile === null) {
      return;
    }

    // TODO - make sure a package lock is selected first

    // Read and parse lock file
    const jsonFile = await readJsonFile(selectedFile);
    const lockFile: IPackageLock = parseLockFile(jsonFile)

    setFilePath(selectedFile);
    setPackageLock(lockFile);
  }

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {

    setPackageName(event.target.value)
  }

  // TODO - This is ugly code... Organize this and stop being lazy with your CSS
  return (
    <div className={'packagelock'}>
      <button onClick={() => openPackageLockFile()}> Open File </button>
      <div>
        <h3>
          Package Lock: {filePath}
        </h3>
      </div>
      <div>
        Search Package:
        <br />
        <input onChange={handleSearchChange} />
      </div>
      <div >
        <PackageLockListView
          dependencyList={packageLock?.dependencyList}
          filterName={packageName}
        />
      </div>
    </div>
  )
}

export default PackageLock