const dotenv = require('dotenv');
const createDirectoryHandler = require('../util/directory');

module.exports = function () {
    const dir = [
        '.gphauth'
    ];

    function build() {
        dotenv.config();
        dir.forEach(path => createDirectoryHandler(path).make(true));
    }

    function destroy() {
        dir.forEach(path => createDirectoryHandler(path).remove(true));
    }

    return {
        build,
        destroy
    };
}