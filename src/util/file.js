const locate = require('./locate');
const fs = require('fs');

function File(path, useCWD = false) {
    const _path = locate(path, useCWD);

    function save(data) {
        fs.writeFileSync(_path, data);
    }

    function load(buffer = false) {
        if(buffer) return fs.readFileSync(_path);
        return fs.readFileSync(_path, 'utf8');
    }

    function remove() {
        fs.unlinkSync(_path);
    }

    function exists() {
        return fs.existsSync(_path) && fs.lstatSync(_path).isFile();
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