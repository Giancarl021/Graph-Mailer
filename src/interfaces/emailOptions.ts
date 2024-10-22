import BodyType from './bodyType';
import GraphInterfaceInstance from './graphInstance';

interface EmailOptions {
    graph: GraphInterfaceInstance;
    originalBodyPath: string;
    subject: string;
    body: string;
    type: BodyType;
    to: string[];
    cc: string[];
    bcc: string[];
    markdownStyles: string;
}

export default EmailOptions;
