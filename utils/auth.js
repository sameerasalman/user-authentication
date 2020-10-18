const crypto = require('crypto');

const hashPassowrd = (plainText) => {
    return crypto.createHmac('sha256', 'secret key')
    .update(plainText)
    .digest('hex');
}

module.exports = { hashPassowrd };
