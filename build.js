const createDirectoryHandler = require('./src/util/directory');
const { compile } = require('nexe');

async function main() {
    const dir = createDirectoryHandler('build');
    dir.make();

    await compile({
        output: 'build/mailer.exe'
    });
}

main().catch(console.error);