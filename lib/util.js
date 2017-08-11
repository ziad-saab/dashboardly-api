const crypto = require('crypto');

exports.filterKeys = function filterKeys(validKeys, obj) {
  return validKeys.reduce((newObj, key) => {
    if (obj[key] !== undefined) {
      newObj[key] = obj[key];
    }

    return newObj;
  }, {});
};

exports.joinKeys = function joinKeys(prefix, keys) {
  return keys.map(key => `${prefix}.${key} AS ${prefix}_${key}`);
};

//returns a random token
//generates random token in base64 I guess, Ask about this
exports.getRandomToken = function getRandomToken() {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(50, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer.toString('base64'));
      }
    });
  });
};
