# The Car Website

## Developer Setup

### Set the Node version
The `Node` version is set and managed using `NVM (Node Version Manager)`. A `.nvmrc` file is used to set the `Node` version to install and use for the project. This is saved in the root of the project folder.

```
24.20.0
```

To install and/or set the `Node` version:

```shell
# Install the Node version using NVM if not already installed
$ nvm install
# Set the Node version to use
$ nvm use
```

### Add the .gitignore
The `.gitignore` file lists all the files and directories to not be added to version control when commits or changes are made. These may include: `node_modules` and configuration files. The `.gitignore` file is added to the root of the project folder.

```
node_modules/
dist/
.astro/
.env
.env.*
```

### Install Astro
We are using `Astro` as the frontend framework for this project. To install and setup `Astro`, use the following terminal commands:

```shell
# Install and setup Astro
$ npm create astro@latest .
# Install dependencies and devDependency packages. Generates the node_modules folder
$ npm install
# Run the application on the local development server
$ npm run dev
```

The application will be available to view locally here: `http://localhost:4321/`.