Create a nexmo application and take note of your application_id and private_key.

Follow [this](https://auth0.com/docs/quickstart/spa/react/01-login) guide until you reach `Install the Auth0 React SDK`.  
**Make sure `Token Endpoint Authentication Method` is set to `none` even if it's disabled**.  
Take note of `Domain` and `Client ID`.

You can now [![button](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/jacopomaroli/nexmo_client_sdk_react_tutorial) and fill in the required details.

Take the website url from netlify and add it in the APP settings on Auth0 in `Allowed Callback URLs` `Allowed Logout URLs` `Allowed Web Origins` (fields are a comma separated url list)

Congrats: you just deployed a nexmo react application :)

## Available Scripts

In the project directory, you can run:

### `npm start:app`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `start:mock-server`
Runs a local version of a lambda server for development purposes
