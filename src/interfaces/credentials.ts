import AccountType from 'graph-interface-desktop-provider/lib/src/interfaces/options/account-type';
import { Credentials as GraphCredentials } from 'graph-interface/lib/interfaces';

interface Credentials {
    auth: GraphCredentials;
    accountType: AccountType;
}

export default Credentials;
