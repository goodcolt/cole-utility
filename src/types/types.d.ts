interface IPackageLock {
  projectName: string;
  dependencyList: IDependency[];
}

interface IDependency {
  name: string;
  version: string;
  dependencyList: IDependency[];
  requireList: IPackage[];
}

interface IPackage {
  name: string;
  version: string;
}
