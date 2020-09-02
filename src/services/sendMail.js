const getGraph = require('../util/graph');

module.exports = async function (subject, bodyType, content, to, cc, bcc) {
    const graph = await getGraph();

    const toRecipient = to => ({
        emailAddress: {
            address: to
        }
    });

    await graph.unit('me/sendMail', {
        method: 'POST',
        body: {
            message: {
                subject,
                body: {
                    contentType: bodyType,
                    content
                },
                toRecipients: to.map(toRecipient),
                ccRecipients: cc.map(toRecipient),
                bccRecipients: bcc.map(toRecipient)
            }
        }
    });
}