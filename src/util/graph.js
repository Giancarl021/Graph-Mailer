const createGraphInterface = require('graph-interface');
const createDesktopMiddleware = require('graph-interface-desktop-provider');

const credentials = {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    tenantId: process.env.TENANT_ID
};

module.exports = async function () {
    const graph = await createGraphInterface(credentials, {
        authenticationProvider: createDesktopMiddleware({ refreshTokenPath: '.gphauth' })
    });

    return graph;
}