const bcrypt = require('bcrypt-as-promised');

const HASH_ROUNDS = 10;

const CREATE_USER_SQL = 'INSERT INTO users (email, password) VALUES (?, ?)';
const SELECT_USER_SQL = 'SELECT id, email, createdAt, updatedAt FROM users WHERE id = ?';
const DELETE_USER_SQL = 'DELETE FROM users WHERE id = ?';

const SELECT_BOARDS_SQL = 'SELECT id, ownerId, title, createdAt, updatedAt FROM boards LIMIT ? OFFSET ?';

class GrampsDataLoader {
  constructor(conn) {
    this.conn = conn;
  }

  // User methods
  createUser(user) {
    return bcrypt.hash(user.password, HASH_ROUNDS)
    .then(hashedPassword => this.conn.query(CREATE_USER_SQL, [user.email, hashedPassword]))
    .then(result => this.conn.query(SELECT_USER_SQL, [result.insertId]))
    .then(result => result[0])
    .catch((error) => {
      // Special error handling for duplicate entry
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('A user with this email already exists');
      } else {
        throw error;
      }
    });
  }

  deleteUser(userId) {
    return this.conn.query(DELETE_USER_SQL, [userId]).then(() => true);
  }

  getUserFromSession(sessionToken) {

  }


  // Board methods
  getAllBoards(options) {
    const page = options.page || 1;
    const limit = options.count || 20;
    const offset = (page - 1) * limit;

    return this.conn.query(SELECT_BOARDS_SQL, [limit, offset]);
  }
}

module.exports = GrampsDataLoader;
