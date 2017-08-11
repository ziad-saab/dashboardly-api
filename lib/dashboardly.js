const bcrypt = require('bcrypt-as-promised');
const knex = require('knex')({ client: 'mysql' });
const validate = require('./validations');
const util = require('./util');

const HASH_ROUNDS = 10;
const USER_FIELDS = ['id', 'email', 'createdAt', 'updatedAt', 'avatarUrl'];
const BOARD_FIELDS = ['id', 'ownerId', 'title', 'description', 'createdAt', 'updatedAt', 'isListed'];
const BOARD_WRITE_FIELDS = ['ownerId', 'title', 'description', 'isListed'];

const BOOKMARKS_FIELDS = ['id', 'boardId', 'title', 'url', 'createdAt', 'updatedAt', 'description'];
const BOOKMARKS_WRITE_FIELDS = ['boardId', 'title', 'url' ,'description'];
const BOOKMARKS_UPDATE_FIELDS = ['title', 'url' ,'description'];

class DashboardlyDataLoader {
  constructor(conn) {
    this.conn = conn;
  }

  query(sql) {
    return this.conn.query(sql);
  }

  // User methods
  createUser(userData) {
    const errors = validate.user(userData);
    if (errors) {
      return Promise.reject({ errors: errors });
    }
    return bcrypt.hash(userData.password, HASH_ROUNDS)
    .then((hashedPassword) => {
      return this.query(
        knex
        .insert({
          email: userData.email,
          password: hashedPassword,
          avatarUrl: userData.avatarUrl
        })
        .into('users')
        .toString()
      );
    })
    .then((result) => {
      return this.query(
        knex
        .select(USER_FIELDS)
        .from('users')
        .where('id', result.insertId)
        .toString()
      );
    })
    .then(result => result)
    .catch(error => {
      // Special error handling for duplicate entry
      // console.log("Error =", error.code);
      if (error.code === 'ER_DUP_ENTRY') {
        console.log("Error =", error.code);
        throw new Error('A user with this email already exists');
      } else {
        throw error;
      }
    });
  }

  deleteUser(userId) {
    return this.query(
      knex.delete().from('users').where('id', userId).toString()
    );
  }

  getUserFromSession(sessionToken) {
    return this.query(
      knex
      .select(util.joinKeys('users', USER_FIELDS))
      .from('sessions')
      .join('users', function () {
        this.on('sessions.userId', '=', 'users.id')
      })
      .where({
        'sessions.token': sessionToken
      })
      .toString()
    )
    .then((result) => {
      if (result.length === 1) {
        //console.log("user=", result[0]);
        return result;
      }

      return null;
    });
  }

  createTokenFromCredentials(email, password) {
    const errors = validate.credentials({
      email: email,
      password: password
    });
    if (errors) {
      return Promise.reject({ errors: errors });
    }

    let sessionToken; //available in all thens
    let user;
    return this.query(
      knex
      .select('id', 'password')
      .from('users')
      .where('email', email)
      .toString()
    )
    .then((results) => {
      if (results.length === 1) {
        console.log("We are inside the bcrypt");
        user = results[0];
        console.log("User from table = ", user);
        return bcrypt.compare(password, user.password)
                      .catch(() => false);
      }
      //return false if password doesnt match
      console.log("If in bcrypt failed");
      return false;
    })
    .then((result) => {
      if (result === true) {
        console.log("right b4 getRandomToken");
        return util.getRandomToken();
      }
      throw new Error('Username or password invalid');
    })
    .then((token) => {
      sessionToken = token;
      console.log("Right before inserting into sessions table");
      return this.query(
        knex
        .insert({
          userId: user.id,
          token: sessionToken
        })
        .into('sessions')
        .toString()
      );
    })
    .then(() => {
      console.log("We are returning sesToken = ", sessionToken );
      return sessionToken;
    });
  }

  deleteToken(token) {
    return this.query(
      knex
      .delete()
      .from('sessions')
      .where('token', token)
      .toString()
    )
    .then(() => true);
  }


  // Board methods
  getAllBoards(options) {
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 20;
    const offset = (page - 1) * limit;

    return this.query(
      knex
      .select(BOARD_FIELDS)
      .from('boards')
      .where('isListed', 1)
      .limit(limit)
      .offset(offset)
      .toString()
    );
  }

  getSingleBoard(boardId) {
    return this.query(
      knex
      .select(BOARD_FIELDS)
      .from('boards')
      .where('id', boardId)
      .toString()
    );
  }

  createBoard(boardData) {
    const errors = validate.board(boardData);
    if (errors) {
      return Promise.reject({ errors: errors });
    }

    return this.query(
      knex
      .insert(util.filterKeys(BOARD_WRITE_FIELDS, boardData))
      .into('boards')
      .toString()
    )
    .then((result) => {
      return this.query(
        knex
        .select(BOARD_FIELDS)
        .from('boards')
        .where('id', result.insertId)
        .toString()
      );
    });
  }

  boardBelongsToUser(boardId, userId) {
    return this.query(
      knex
      .select('id')
      .from('boards')
      .where({
        id: boardId,
        ownerId: userId
      })
      .toString()
    )
    .then((results) => {
      if (results.length === 1) {
        return true;
      }

      throw new Error('Access denied');
    });
  }

  updateBoard(boardId, boardData) {
    const errors = validate.boardUpdate(boardData);
    if (errors) {
      return Promise.reject({ errors: errors });
    }

    return this.query(
      knex('boards')
      .update(util.filterKeys(BOARD_WRITE_FIELDS, boardData))
      .where('id', boardId)
      .toString()
    )
    .then(() => {
      return this.query(
        knex
        .select(BOARD_FIELDS)
        .from('boards')
        .where('id', boardId)
        .toString()
      );
    });
  }

  deleteBoard(boardId) {
    return this.query(
      knex
      .delete()
      .from('boards')
      .where('id', boardId)
      .toString()
    );
  }

  // Bookmark methods
  getAllBookmarksForBoard(boardId) {
    return this.query(
      knex
        .select('*')
        .from('bookmarks')
        .where('boardId', boardId)
        .toString()
    );
  }

/*  getUserFromBoard(boardId) {
    return this.query(
      knex
        .select('email')
        .from('users')
        .join('boards', function () {
          this.on('users.id', '=', 'boards.ownerId')
        })
        .where('boards.id', boardId)
        .toString()
    )
      .then((result) => {
        console.log('Result: ', result);
        if (result.length === 1) {
          return result[0];
        }
        return false;
      });
  }*/

  createBookmark(bookmarkData) {
    console.log("bookmarkData",bookmarkData);
    return this.query(
      knex
        .select('users.id')
        .from('users')
        .join('boards', function () {
          this.on('users.id', '=', 'boards.ownerId')
        })
        .where('boards.id', bookmarkData.boardId)
        .toString()
    )
    .then((result) => {
      console.log('Result id: ', result);
      console.log('Result id: ', result[0].id);
      console.log('req.user_id: ', bookmarkData.user.users_id);
      if (result[0].id === bookmarkData.user.users_id) {
        return result[0];
      }
      return false;
    })
    .then(result=>{
      console.log(result);
      if (result) {
        console.log("I am here in if");
        return this.query(
          knex
            .insert(util.filterKeys(BOOKMARKS_WRITE_FIELDS, bookmarkData))
            .into('bookmarks')
            .toString()
        )
      }
      else{
        console.log("I am here in else");
        throw new Error("Invalid user for creating bookmark under this board");
      }
    })
    .then((result) => {
      if (!result.error){
        return this.query(
          knex
            .select(BOOKMARKS_FIELDS)
            .from('bookmarks')
            .where('id', result.insertId)
            .toString()
        );
      }
      return result;
    });
  }


  bookmarkBelongsToUser(bookmarkId, userId) {
    return this.query(
      knex
        .select('users.id as users_id, users.email as users_email, boards.id as boards_id,' +
                'boards.ownerId as boards_ownerId, boards.title as boards_title,' +
                'bookmarks.id as bookmarks_id, bookmarks.boardId as bookmarks_boardId,' +
                 'bookmarks.title as bookmarks_title')
        .from('users').join('boards', function () {
          this.on('users.id', '=', 'boards.ownerId')
      }).join('bookmarks', function () {
          this.on('boards.ownerId', '=', 'bookmarks.boardId')
      })
        .where({
          'users.id': userId,
          'bookmarks.id': bookmarkId
        })
        .toString()
    )
      .then((results) => {
        if (results.length === 1) {
          return true;
        }
        return false;

        //throw new Error('No records found');
      })

  }

  updateBookmark(bookmarkId, bookmarkData) {
    /*const errors = validate.bookmarkUpdate(bookmarkData);
    if (errors) {
      return Promise.reject({ errors: errors });
    }*/
    return this.query(
      knex()
        .select('boardId')
        .from('bookmarks')
        .where('id', bookmarkId)
        .toString()
    )
    .then(result => {
      //[ RowDataPacket { boardId: 4 }
      //console.log(result);
      return this.query(
        knex
        .select('users.id')
        .from('users')
        .join('boards', function () {
          this.on('users.id', '=', 'boards.ownerId')
        })
        .where('boards.id', result[0].boardId)
        .toString()
      )
    })
    .then(result => {
      // console.log(result);
      // console.log(result[0].id);
      // console.log(bookmarkData.user.users_id);
      if (result[0].id === bookmarkData.user.users_id){
        console.log("Hell yeah")
        return this.query(
          knex('bookmarks')
            .update(util.filterKeys(BOOKMARKS_UPDATE_FIELDS, bookmarkData))
            .where('id', bookmarkId)
            .toString()
        )
      }
      else {
        return false;
      }
    })
    .then(result =>{
      if(result){
        console.log(result);
        return this.query(
          knex
            .select(BOOKMARKS_FIELDS)
            .from('bookmarks')
            .where('id', bookmarkId)
            .toString()
        );
      }
      throw new Error ("You do no have permission to modify this bookmark")
    })

    /*
    return this.query(
      knex('bookmarks')
        .update(util.filterKeys(BOOKMARKS_WRITE_FIELDS, bookmarkData))
        .where('id', bookmarkId)
        .toString()
    )
      .then(() => {
        return this.query(
          knex
            .select(BOOKMARKS_FIELDS)
            .from('bookmarks')
            .where('id', bookmarkId)
            .toString()
        );*/
      //});
  }

  deleteBookmark(bookmarkData) {
    /*this.query(
      knex
        .delete()
        .from('bookmarks')
        .where('id', bookmarkId)
        .toString()
    );*/

    // Query retrieves the boardId from the requested bookmark id
    return this.query(
      knex
        .select('boardId')
        .from('bookmarks')
        .where('id', bookmarkData.bookmarkId)
        .toString()
    )
      .then(data => {
        console.log('my data: ', data[0].boardId);
        // Query joins tables users and boards
        return this.query(
          knex
            .select('users.id')
            .from('users').join('boards', function () {
              this.on('users.id', '=', 'boards.ownerId')
          })
            .where('boards.id', data[0].boardId)
            .toString()
        )
          .then(data => {
            console.log('User of the bookmark: ', data[0].id);

            if(data[0].id === bookmarkData.userId) {
              return this.query(
                knex
                  .delete()
                  .from('bookmarks')
                  .where('id', bookmarkData.bookmarkId)
                  .toString()
              );
            }
            else {
              throw new Error('Access denied');
            }
          })
    });
  }
}

module.exports = DashboardlyDataLoader;
