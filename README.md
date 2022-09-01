# Cole Utility Tool

## How to Use

#### Package-Lock Tool
Currently this is the only tool added. This tool helps you search for nested dependencies and easily determine what packages are dependent on it.

1. Open the package lock file of interest
     - This will list all dependencies from the lock file. ```D``` indicates a ```dependencies``` package and ```R``` indicates a ```requires``` package.
     - ```requires``` can be shared among all other top levels dependencies, while ```dependencies``` are standalone, belonging only to the module requiring them.
     - ![Package Lock Example](/public/package-lock-example.png)
2. Enter the package name you are interested in to filter the list
     - This will filter the dependency list to show that package and al of those dependent on it somewhere in the dependency tree.
       - Blue indicates the package found
       - Purple indicates the highest level package that is dependent on it. 
         - If you are looking to update a package this is often the one to look into first.
     - ![Package Lock Example](/public/package-lock-filter-example.png)

## How to Run
You can run this tool in the browser or build it for a desktop app with Tauri.

#### Web Browser

##### Run Locally:
To start it up, run ```npm run dev```. This will build in development mode and start a server listening at ```localhost:5173```.

#### Desktop App
Tauri is used to build the desktop application version. This is a Rust based framework. 

##### Prerequisites:
You need to have Microsoft Visual Studio C++ Build Tools, WebView2 (Included in Windows 11), and Rust installed on you machine.

https://tauri.app/v1/guides/getting-started/prerequisites

##### Run Locally:
To start it up, run ```npm run tauri dev```. This will build in development mode. The first time you run it will take longer as it needs to install rust packages similar to the npm install step.

##### Build for desktop install:
You are able to build the application to install as a small desktop application. Then you can simply open the application rather than run it in development each time.

To create a build, run ```npm run tauri build```. It will build your Frontend, compile the Rust binary, collect all external binaries and resources, and finally produce neat platform-specific bundles and installers.

https://tauri.app/v1/guides/building/
