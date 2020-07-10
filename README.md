Create a nexmo application and take note of your application_id and private_key.

Follow [this](https://auth0.com/docs/quickstart/spa/react/01-login) guide until you reach `Install the Auth0 React SDK`.  
**Make sure `Token Endpoint Authentication Method` is set to `none` in your Auth0 application settings even if it's disabled**.  
Take note of `Domain`, `Client ID` and `Client Secret`.

Create another application but this time specify `machine to machine` as its type and take note of `Client ID` and `Client Secret`.  
Create an `Agent` role.  
Create a new rule, call it `add role to claims` and add the following:
```
function (user, context, callback) {
  const namespace = 'http://my-app-domain.com';
  const assignedRoles = (context.authorization || {}).roles;

  let idTokenClaims = context.idToken || {};
  let accessTokenClaims = context.accessToken || {};

  idTokenClaims[`${namespace}/roles`] = assignedRoles;
  accessTokenClaims[`${namespace}/roles`] = assignedRoles;

  context.idToken = idTokenClaims;
  context.accessToken = accessTokenClaims;
  return callback(null, user, context);
}
```
(please refer to [this](https://auth0.com/docs/authorization/concepts/sample-use-cases-rules?_ga=2.49309478.1241163486.1594230471-232950558.1592223389#add-user-roles-to-tokens) if you need more info)

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
