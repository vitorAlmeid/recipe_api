'use strict';
module.exports = {
    trimAll(string) {
        const searchRegExp = new RegExp(' ', 'g');
        return string.replace(searchRegExp, '');
    }
};
