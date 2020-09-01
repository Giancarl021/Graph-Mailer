const createDirectoryHandler = require('../util/directory');

module.exports = function () {
    const dir = [];

    function build() {
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