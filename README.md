# Dashboardly API
The [contract for this API](apiary.apib) is hosted on [apiary.io](http://docs.dashboardly.apiary.io/#).

## Supporting libraries
This project uses the following libraries:

### [`bcrypt-as-promised`](https://github.com/iceddev/bcrypt-as-promised)
This library is used to hash passwords at signup and check hashed passwords at login.

### [`ExpressJS`](https://expressjs.com/)
This is one of the most popular NodeJS web server frameworks.

### [`knex`](http://knexjs.org/)
This library helps build SQL queries that are dynamic without losing one's head.

### [`validate.js`](http://validatejs.org/#validators-format)
This library has an expressive API for validating user input.

---

## Project structure

### `/index.js`
This is the main file of the project. It starts a web server after establishing a database connection pool and associated data loader. Instead of writing all the handlers in this file, the code is delegated to so-called "controllers", which are in the `/controllers` directory.

### `.editorconfig`
Check `http://editorconfig.org/` for more information on what this file does.

### `apiary.apib`
This file uses the [API Blueprint](https://apiblueprint.org/) markdown format to describe the API contract. The Apiary.io service generates [documentation and mock API servers](http://docs.dashboardly.apiary.io/) based on this document.

### `/controllers`
Each module in this directory takes care of one URL path in the application: `/auth`, `/boards` and `/bokmarks`, as specified in the API. The controllers use the data loader to talk to the database and return appropriate JSON responses, headers, and response code.

### `/database/tables.sql`
This file contains the SQL statements that need to be executed to get a fresh database. **`SOURCE`ing this script will destroy any existing database, be careful!**

### `/lib/check-login-token.js`
Middleware that checks the `Authorization` header for a token. If found, will add the token to the Request object under the `sessionToken` key, as well as associated user under the `user` key.

### `/lib/dashboardly.js`
This is the so-called "data loader". It's a layer between the database and any application code wanting to use it directly. Normally every operation should go through the API, but the API code itself needs a way to access the data layer. This is what this module takes care of. This module uses the `knex.js` to make building SQL queries easier. **To add new queries, you should always write the desired SQL query first and test it, before trying to implement it with `knex.js`!**

### `/lib/only-logged-in.js`
This middleware will check if there is a `user` under the Request object (added by `check-login-token`). If there is not, then the middleware will short-circuit the request, and respond with a `401 Unauthorized`. This middleware is meant to be used selectively. Check the controllers for an example of how it's used.

### `/lib/util.js`
General utility functions. If this file starts getting too large, it would be a good idea to split it up in whatever way is logical at that time.

### `/lib/validations.js`
This module uses the `validate.js` library to expose functions that check data going into the data loader.

---

## Contributing

### Linting
This project is linted by `eslint` and the rules are specified in `package.json`. Your IDE should automatically pick up this configuration and warn you of any errors in your code style.

### Editorconfig
This project has a `.editorconfig` file that should be picked up by your IDE and enforce two spaces per indent. If it's not picked up by your IDE, make sure to configure your IDE for two spaces per indent. Otherwise ESLint will warn you.

### Developing
To work on this project:

1. Fork this repo
2. Clone your own fork
3. Run `npm install` or `yarn`
4. Run `npm start` to start developing with Nodemon

**NOTE**: Make sure you have a Node version of at least 7. You can use NVM to install an appropriate Node version.
**NOTE 2**: Make sure you have MySQL Server 5.6+. Failing to do so, you will not be able to create all the tables with `CURRENT_TIMESTAMP` defaults. If you are on Cloud9, this can be accomplished with the following commands:

```bash
sudo apt-get update
sudo apt-get install mysql-server-core-5.6 mysql-server-5.6
```

When you want to start working on a new feature:

1. Make sure to `git pull origin master` before starting
2. Create a feature branch off of `master`
3. Commit often
4. After your first commit, push your branch and open a PR
5. Keep committing and pushing often
5. Have someone code review your PR and merge it when ready
