const locate = require('./locate');
const fs = require('fs');

function File(path) {
    const _path = locate(path);

    function save(data) {
        fs.writeFileSync(_path, data);
    }

    function load() {
        return fs.readFileSync(_path, 'utf8');
    }

    function remove() {
        fs.unlinkSync(_path);
    }

    function exists() {
        return fs.existsSync(_path);
    }

    function copy(dest) {
        const _dest = locate(dest);
        fs.copyFileSync(_path, _dest);
        return File(_dest);
    }

    return {
        save,
        load,
        remove,
        exists,
        copy,
        path: _path
    }
}

module.exports = File;