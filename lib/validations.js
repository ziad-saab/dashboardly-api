const validate = require('validate.js');

const VALID_ID = {
  onlyInteger: true,
  greaterThan: 0
};

const USER_VALIDATION = {
  email: {
    presence: true,
    email: true
  },
  password: {
    presence: true,
    length: {
      minimum: 12,
      message: 'must be at least 12 characters'
    }
  },
  avatarUrl: {
    // presence: {
    //   allowEmpty: true
    // },
    url: true
  }
};
exports.user = function validateUser(userData) {
  return validate(userData, USER_VALIDATION);
};

const BOARD_VALIDATION = {
  ownerId: {
    presence: true,
    numericality: VALID_ID
  },
  title: {
    presence: true
  }
};
exports.board = function validateBoard(boardData) {
  return validate(boardData, BOARD_VALIDATION);
};

const BOARD_UPDATE_VALIDATION = {
  ownerId: {
    numericality: VALID_ID
  }
};
exports.boardUpdate = function validateBoardUpdate(boardData) {
  return validate(boardData, BOARD_UPDATE_VALIDATION);
};


const BOOKMARKS_VALIDATION = {
    boardId: {
      presence: true,
      numericality: VALID_ID
    },
    title: {
      presence: true
    },
    url: {
      presence: true,
      url: true
    }
    // description: {
    //   presence: {
    //     allowEmpty: true
    //   }
    // }
};
exports.bookmark = function validateBookmark(bookmarkData){
  return validate(bookmarkData, BOOKMARKS_VALIDATION)
};

const BOOKMARKS_UPDATE_VALIDATION = {
  boardId: {
    presence: {
      allowEmpty: true
    },
    numericality: VALID_ID
  },
  // title: {
  //   presence: {
  //     allowEmpty: true
  //   }
  // },
  url: {
    // presence: {
    //   allowEmpty: true
    // },
    url: true
  },
  // description: {
  //   presence: {
  //     allowEmpty: true
  //   }
  // }
};
exports.bookmarkUpdate = function validateBookmarkUpdate(bookmarkData){
  return validate(bookmarkData, BOOKMARKS_UPDATE_VALIDATION)
};

const CREDS_VALIDATION = {
    email: {
      presence: true,
      email: true
    },
    password: {
      presence: true
    }
};

exports.credentials = function validateCredentials(credsData) {
  return validate(credsData, CREDS_VALIDATION);
};

