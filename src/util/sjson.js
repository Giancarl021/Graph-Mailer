const createHash = require('./hash');
const createCryptHandler = require('./crypt');
const createFileHandler = require('./file');

module.exports = function (path, password, hashFilename = false) {
    const crypt = createCryptHandler(password);
    const file = createFileHandler(hashFilename ? _getPath() : path);

    function save(data) {
        const dec = JSON.stringify(data, null, Math.floor(Math.random() * 8));
        const enc = crypt.encrypt(dec);
        file.save(enc);
    }

    function load() {
        const enc = file.load();
        const dec = crypt.decrypt(enc);
        return JSON.parse(dec);
    }

    function _getPath() {
        const s = path.replace(/\\/g, '/').split('/');
        const filename = createHash(s.pop());
        return s.join('/') + '/' + filename;
    }

    return {
        load,
        save,
        remove: file.remove,
        exists: file.exists,
        path: file.path
    };
}