const Constants = require('./Constants.js');

class StringUtil {
  boldify(str) {
    return '**' + str.replace(Constants.regexes.markdown, '') + '**';
  }

  isNullOrWhiteSpace(input) {
    return typeof input !== 'string' || input.replace(/\s+/g, '').length === 0;
  }

  upperFirstChar(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

module.exports = new StringUtil();
