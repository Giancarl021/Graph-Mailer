const help = require('./src/util/help.json');
const createFileHandler = require('./src/util/file');

const regex = /\[\/\/\]: # \(\^\)(.|\n|\r)*\[\/\/\]: # \(\$\)/gm;

function replacer() {
    return `[//]: # (^)\n\n${markdown(help)}\n\n[//]: # ($)`;

    function markdown(o, depth = 0) {
        const commands = [];
        for (const key in o) {
            const command = o[key];
            const i = Array(3 + depth).fill('#');
            commands.push(`${i.join('')} ${key} ${command.args ? '``' + command.args.join('`` ``') + '``' : ''}` +
                `\n${command.description || (typeof command === 'string' ? command : 'No description.')}` +
                (command.operations ? '\n\n**Operations:**\n\n' + parseOperations(command.operations) : '') +
                (command.flags ? '\n\n**Flags:**' + parseFlags(command.flags) : '')
            );
        }

        const r = commands.join('\n');

        return r;

        function parseOperations(operations) {
            return markdown(operations, depth + 1);
        }

        function parseFlags(flags) {
            if(typeof flags === 'string') {
                return '\n* ' + flags;
            }
            let r = '\n';
            for(const key in flags) {
                const flag = flags[key];
                
                r += `* \`\`${parseKey(flag, key)}\`\`${flag.required ? ' **[REQUIRED]**' : ''}: ${flag.description}${flag.value ? `.  \n*Value:* \`\`${flag.value}\`\`.` : ''}\n`;
            }

            r += '\n';

            return r;

            function parseKey(o, key) {
                let r = dash(key);
        
                if (o.alias) {
                    r += ' | ' + dash(o.alias);
                }
        
                return r;
        
                function dash(key) {
                    return key.length === 1 ? '-' + key : '--' + key;
                }
            }
        }
    }

    function specialChars(str) {
        const regex = /(<|>)/g;
        return str.replace(regex, _ => '\\' + _);
    }
}

function main() {
    const readme = createFileHandler('README.md');
    const content = readme.load();
    const r = replacer();
    readme.save(content.replace(regex, r));
}

main();