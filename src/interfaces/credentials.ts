import { Credentials as GraphCredentials } from 'graph-interface/lib/interfaces';

interface Credentials {
    auth: GraphCredentials;
    isDelegated: boolean;
}

export default Credentials;
