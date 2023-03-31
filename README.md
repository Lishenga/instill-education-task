# BoredAPI-MongoDB Projects

This repository contains two projects:

1. `nodejs-boredapi-mongodb`: A Node.js GraphQL server using Apollo Server and MongoDB.
2. `reactjs-boredapi-mongodb`: A React.js frontend app that queries the GraphQL server.

## Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/en/download/) (>= 14.0.0)
- [npm](https://www.npmjs.com/get-npm) (>= 6.0.0)

## Setup and Running the Backend (nodejs-boredapi-mongodb)

1. Navigate to the `nodejs-boredapi-mongodb` directory in your terminal.

2. Install the required dependencies by running:

```bash
    npm install
```

3. Build the TypeScript files by running:

```bash
    npm run build
```

4. Start the server by running:

```bash
    npm start
```

The server should now be running on [http://localhost:3010/graphql](http://localhost:3010/graphql).

## Setup and Running the Frontend (reactjs-boredapi-mongodb)

1. In a separate terminal, navigate to the `reactjs-boredapi-mongodb` directory.

2. Install the required dependencies by running:

```bash
    npm install
```

3. Start the frontend app by running:

```bash
    npm start
```

The frontend app should now be running on [http://localhost:3000](http://localhost:3000).

## Accessing the Frontend App

1. Open your browser and go to [http://localhost:3000](http://localhost:3000).

2. On the frontend app, you will see an input field to search for activities by their type. Type the activity type you want to search for and press Enter or click the search button.

3. The activities of the specified type will be displayed below the input field. If there are no activities of that type, you will see a message indicating that no activities were found.

4. To see all activities, clear the input field and press Enter or click the search button.
