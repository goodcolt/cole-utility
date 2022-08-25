import { ChangeEvent, useState } from 'react'
import FileUploader from '../../components/file-uploader/FileUploader';
import PackageLockListView from './PackageLockListView';
import { hasItem } from '../../lib/validation';
import './package-lock.css'
import Input from '../../components/input/Input';

const parseLockFile = (lockFileJson: any): IPackageLock => {
  let packageLock: IPackageLock = {
    projectName: '',
    dependencyList: []
  };

  if (!lockFileJson) {
    return packageLock;
  }

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

  if (!requiresJson) {
    return requireList;
  }

  const requirekeys: string[] = Object.keys(requiresJson);

  if (!hasItem(requirekeys)) {
    return requireList;
  }

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
  const [packageLock, setPackageLock] = useState<IPackageLock>();
  const [packageName, setPackageName] = useState<string>();

  const handleFileChange = (jsonFile: any) => {
    // No file selected
    if (!jsonFile) {
      return;
    }

    // TODO - make sure a package lock is selected first

    // Read and parse lock file
    const lockFile: IPackageLock = parseLockFile(jsonFile)

    setPackageLock(lockFile);
  }

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPackageName(event.target.value)
  }

  return (
    <div className={'packagelock'}>
      <FileUploader onFileChange={handleFileChange} />
      <Input
        label={'Filter Package:'}
        onChange={handleSearchChange}
      />
      <PackageLockListView
        dependencyList={packageLock?.dependencyList}
        filterName={packageName}
      />
    </div>
  )
}

export default PackageLock
