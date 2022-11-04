# lineup

Generate your team's lineup

## Architecture Overview

This project was built using [Next.js](https://nextjs.org/docs), and follows the associated file organization.

The main structure of the data can be described in the [Hierarchy document](lib/game/README.md).

## Getting Started

This project was built using a specific version of Node, found in the package.json file. If using nvm, you can switch to a valid version of Node using:

```
$ nvm use
```

Install dependencies:

```
$ yarn
```

Run the server with automatic restart:

```
$ yarn dev
```

The application will then be viewable at: `http://localhost:3000`

### Production

For production, run the following commands:

```
$ yarn build

...

$ yarn production
```

The application will be viewable on port 3000 (by default).

## Config

Configuration for the application is available within the [`config/index.js`](config/index.js) file.

### Logging

The default log level is set to `'info'`. Most of the log messages within the application are at lower levels.

## Tests

ESLint has been configured for the project. To lint the files:

```
$ yarn lint
```

Tests are written along side the source files, and include `.test.` in the file name. To execute the tests, run the following command:

```
$ yarn test
```

To run the tests in watch mode:

```
$ yarn test:watch
```
