import { hasData, hasItem } from "../../lib/validation";

interface Props {
  dependencyList?: IDependency[];
  filterName?: string;
}

const getFilteredDepenencyList = (dependencies: IDependency[], dependencyName: string) => {
  // No filter or dependencies provided
  if (!hasData(dependencyName)) {
    return dependencies;
  }

  // Get all required packages related to the depenency 
  const requiredPackagesSet = getRequiredPackagesSet(dependencies, dependencyName);

  // Filter dependency list
  return filterDependencies(dependencies, dependencyName, requiredPackagesSet)
}

const getRequiredPackagesSet = (dependencies: IDependency[], dependencyName: string): Set<string> => {
  const requiredByMap: Map<string, Set<string>> = setRequiredByMap(dependencies);
  let requiredPackagesSet: Set<string> = new Set<string>();

  if (!hasItem(requiredByMap)) {
    return requiredPackagesSet;
  }

  requiredPackagesSet = requiredByMap.get(dependencyName) as Set<string>;

  if (!hasItem(requiredPackagesSet)) {
    return requiredPackagesSet;
  }

  // Get dependency and all required packages related to it
  requiredPackagesSet = getTotalRequiredPackagesSet(requiredByMap, requiredPackagesSet);
  requiredPackagesSet.add(dependencyName);

  return requiredPackagesSet;
}

const getTotalRequiredPackagesSet = (
  requiredByMap: Map<string, Set<string>>,
  requiredPackagesSet: Set<string> = new Set<string>(),
  totalRequiredPackagesSet: Set<string> = new Set<string>()
) => {

  if (!hasItem(requiredPackagesSet)) {
    return totalRequiredPackagesSet;
  }

  requiredPackagesSet.forEach(requiredPackage => {
    if (!totalRequiredPackagesSet.has(requiredPackage)) {
      totalRequiredPackagesSet.add(requiredPackage);
    }

    const nestedSet: Set<string> = requiredByMap.get(requiredPackage) as Set<string>;

    if (!hasItem(nestedSet)) {
      return;
    }

    getTotalRequiredPackagesSet(requiredByMap, nestedSet, totalRequiredPackagesSet);
  });

  return totalRequiredPackagesSet;
}

const setRequiredByMap = (dependencies: IDependency[], requiredByMap = new Map<string, Set<string>>()): Map<string, Set<string>> => {
  if (!hasItem(dependencies)) {
    return requiredByMap;
  }

  dependencies.forEach(dependency => {
    // Update required by packages map
    if (hasData(dependency.name) && hasItem(dependency.requireList)) {

      dependency.requireList.forEach(requiredPackage => {
        if (!requiredPackage.name) {
          return;
        }

        if (!requiredByMap.has(requiredPackage.name)) {
          const requiredSet = new Set<string>();
          requiredSet.add(dependency.name as string);
          requiredByMap.set(requiredPackage.name, requiredSet)
          return;
        }

        requiredByMap.get(requiredPackage.name)?.add(dependency.name as string);
      })
    }

    // No more dependencies to check 
    if (!hasItem(dependency?.dependencyList)) {
      return;
    }

    // Check nested dependencies
    setRequiredByMap(dependency.dependencyList, requiredByMap);
  })

  return requiredByMap;
}

const filterDependencies = (dependencies: IDependency[], dependencyName: string, requiredPackagesSet: Set<string>): IDependency[] => {
  const filteredDependencyList: IDependency[] = [];

  if (!hasItem(dependencies)) {
    return [];
  }

  dependencies.forEach(dependency => {
    let filteredDependency: IDependency;

    filteredDependency = {
      name: dependency.name,
      version: dependency.version,
      dependencyList: [],
      requireList: []
    }

    // Match found
    if (dependency.name === dependencyName || hasItem(requiredPackagesSet) && requiredPackagesSet.has(dependency.name)) {
      if (hasItem(requiredPackagesSet)) {
        filteredDependency.requireList = dependency.requireList.filter(r => requiredPackagesSet.has(r.name))
      }

      filteredDependency.dependencyList = filterDependencies(dependency.dependencyList, dependencyName, requiredPackagesSet);
      filteredDependencyList.push(filteredDependency);
      return;
    }

    // No more dependencies to check 
    if (!hasItem(dependency?.dependencyList)) {
      return;
    }

    filteredDependency.dependencyList = filterDependencies(dependency.dependencyList, dependencyName, requiredPackagesSet);

    // No nested matches found
    if (filteredDependency.dependencyList.length < 1) {
      return;
    }

    if (hasItem(requiredPackagesSet) && requiredPackagesSet.has(dependency.name)) {
      filteredDependency.requireList = dependency.requireList.filter(r => requiredPackagesSet.has(r.name))

      filteredDependencyList.push(filteredDependency);
      return;
    }

    filteredDependencyList.push(filteredDependency);
  })

  return filteredDependencyList;
}

const getDependencySuggestions = (dependencies: IDependency[]): Set<string> => {
  const requiredByMap: Map<string, Set<string>> = setRequiredByMap(dependencies);
  const dependencySuggestionSet: Set<string> = new Set<string>();

  if (!hasItem(requiredByMap)) {
    return dependencySuggestionSet;
  }

  dependencies.forEach(dependency => {
    if (!requiredByMap.has(dependency.name)) {
      dependencySuggestionSet.add(dependency.name);
    }
  })

  return dependencySuggestionSet;
}

const renderDepenencyList = (dependencies: IDependency[], dependencySuggestions: Set<string>, dependencyName: string) => {
  if (!hasItem(dependencies)) {
    return;
  }

  return (
    <ul className="dependencies">
      {dependencies.map(dependency => {
        let isSuggestedPackage: boolean = hasItem(dependencySuggestions) && dependencySuggestions.has(dependency.name);

        return (
          <>
            <li className={isSuggestedPackage ? 'suggested' : ''}>
              {dependency.name} : {dependency.version}
            </li>
            {renderDepenencyList(dependency.dependencyList, dependencySuggestions, dependencyName)}
            {renderRequireList(dependency.requireList as IPackage[], dependencyName)}
          </>
        )
      })}
    </ul>
  );
}

const renderRequireList = (requiredPackages: IPackage[], dependencyName: string) => {
  if (!hasItem(requiredPackages)) {
    return;
  }

  return (
    <ul className="requiredPackages">
      {requiredPackages.map(requiredPackage => {

        return (
          <li className={requiredPackage.name === dependencyName ? 'filteredPackage' : ''}>
            {requiredPackage.name} : {requiredPackage.version}
          </li>
        )
      })}
    </ul>
  );
}

const PackageLockListView = (props: Props) => {
  // TODO: this is double rendering. Find out why
  const filteredDependencyList: IDependency[] = getFilteredDepenencyList(props?.dependencyList as IDependency[], props?.filterName as string);
  const dependencySuggestions: Set<string> = getDependencySuggestions(filteredDependencyList);

  return (
    <div className='packagelock-results'>
      {renderDepenencyList(filteredDependencyList, dependencySuggestions, props?.filterName as string)}
    </div>
  )
}
export default PackageLockListView
