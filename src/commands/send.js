const isValid = require('../util/isValid');
const sendMail = require('../services/sendMail');
const validateEmail = require('../util/email-validator');
const createFileHandler = require('../util/file');
const marked = require('marked');
const getStyles = require('../util/md-style');

const types = ['text', 'html', 'md'];

module.exports = async function (args, flags) {
    const [ to, subject, body ] = args;

    let type = String(flags.type || flags.t || 'text').toLowerCase();
    const cc = parseList(flags.cc || '', validateEmail, 'cc');
    const bcc = parseList(flags.bcc || '', validateEmail, 'bcc');

    if(!to) {
        throw new Error('The argument "to" is required');
    }
    if(!isValid(subject)) {
        throw new Error('The argument "subject" is required');
    }
    if(!isValid(body)) {
        throw new Error('The argument "body" is required');
    }

    if(!types.includes(type)) {
        throw new Error('The flag "type" need to be one of the values: ' + types.join(', '));
    }

    let content = parseFrom(body);

    if(type === 'md') {
        content = `<style>${getStyles()}</style>\n${parseMarkdown(content)}`;
        type = 'html';
    }

    await sendMail(subject, type, content, parseList(to, validateEmail, 'to'), cc, bcc);
    return 'E-mail sent';
}

function parseList(string, validator = () => true, name = '') {
    if(!string) return [];
    const s = string
        .split(',')
        .map(e => e.trim());
    if(s.some(e => !validator(e))) {
        throw new Error('Invalid parameter(s)' + (name ? ` in parameter "${name}"` : ''));
    }

    return s;
}

function parseFrom(string) {
    if(string.startsWith('@from:')) {
        const file = createFileHandler(string.replace('@from:', ''), true);
        if(!file.exists()) {
            throw new Error(`File "${file.path}" does not exists`);
        }

        return file.load();
    } else {
        return string;
    }
}

function parseMarkdown(md) {
    return marked(md);
}