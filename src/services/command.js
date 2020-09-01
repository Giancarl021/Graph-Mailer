const commands = {
    send: require('../commands/send'),
};

const helper = require('../commands/help');

module.exports = function(command, args, flags) {

    async function run() {
        if(flags['?']) {
            const nav = [];
            if(command) nav.push(command);
            if(args) nav.push(...args);
            console.log(helper(nav));
            return;
        }
        if(!commands[command]) {
            console.log('This command does not exists');
            return;
        }

        let result;
        try {
            result = await commands[command](args, flags);
            console.log(result);
        } catch(error) {
            console.log('Error: ' + error.message);
        }
    }

    return {
        run
    };
}