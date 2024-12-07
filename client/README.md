# Client

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

Custom-made command:
```sh
npm run test
```

Default command:
```sh
npm run test:unit
```

Check test coverage:
```sh
npx vitest run --coverage
```

or (custom command)
``sh
npm run coverage
``

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
### Format code

```sh
npm run format
```

## Client Folder Organization

The `client` folder is structured to support a Vue 3 application using Vite as the build tool. Below is a description of the key files and directories:

- **`src/`**: Contains the source code for the application.
    - **`assets/`**: Contains static assets like CSS files and images.
    - **`components/`**: Contains Vue components used in the application.
        - **`__tests__/`**: Contains unit tests for the Vue components.
    - **`models/`**: Classes and interfaces used in the website code.
    - **`router/`**: Contains the routing configuration for the application.
    - **`services/`**: Pieces of business logic related to a single functionality.
    - **`stores/`**: Contains Vuex stores or Pinia stores for state management.
    - **`views/`**: Contains Vue components that represent different views or pages in the application.
    - **`App.vue`**: The root Vue component.
    - **`main.ts`**: The entry point for the application, where the Vue app is created and mounted.

- **`public/`**: Contains static files that are served directly without processing.

- **`index.html`**: The main HTML file for the application.

- **`tsconfig.json`**: TypeScript configuration file that includes references to other TypeScript configuration files.

- **`tsconfig.app.json`**: TypeScript configuration specific to the application code.

- **`tsconfig.vitest.json`**: TypeScript configuration specific to the Vitest testing framework.

- **`env.d.ts`**: TypeScript declaration file for Vite environment variables.

- **`package.json`**: Contains metadata about the project and its dependencies, as well as scripts for various tasks.

- **`vite.config.ts`**: Configuration file for Vite.

- **`.editorconfig`**: Configuration file for maintaining consistent coding styles between different editors and IDEs.

- **`.prettierrc.json`**: Configuration file for Prettier, a code formatter.

- **`eslint.config.js`**: Configuration file for ESLint, a tool for identifying and fixing linting issues in the code.

- **`Dockerfile`**: Contains instructions for building a Docker image for the application.