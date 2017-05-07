# Grampsboard API
The [contract for this API](apiary.apib) is hosted on [apiary.io](http://docs.grampsboard.apiary.io/#reference).

## Supporting libraries
This project uses the following libraries:

### `bcrypt`
This library is used to hash passwords at signup and check hashed passwords at login.

### `express`
This is one of the most popular NodeJS web server frameworks.

### `knex`
This library helps build SQL queries that are dynamic without losing one's head.

### `validator.js`
This library has an expressive API for validating user input.

## Contributing

### Linting
This project is linted by `eslint` and the rules are specified in `package.json`. Your IDE should automatically pick up this configuration and warn you of any errors in your code style.

### Editorconfig
This project has a `.editorconfig` file that should be picked up by your IDE and enforce two spaces per indent. If it's not picked up by your IDE, make sure to configure your IDE for two spaces per indent. Otherwise ESLint will warn you.

To work on this project:

1. Fork this repo
2. Clone your own fork
3. Run `npm install` or `yarn`

When you want to start working on a new feature:

1. Make sure to `git pull origin master` before starting
2. Create a feature branch off of `master`
3. Commit often
4. After your first commit, push your branch and open a PR
5. Keep committing and pushing often
5. Have someone code review your PR and merge it when ready
