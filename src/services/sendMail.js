const getGraph = require('../util/graph');

module.exports = async function (subject, bodyType, content, recipients) {
    const graph = await getGraph();
    await graph.unit('me/sendMail', {
        method: 'POST',
        body: {
            message: {
                subject,
                body: {
                    contentType: bodyType,
                    content
                },
                toRecipients: recipients.map(to => ({
                    emailAddress: {
                        address: to
                    }
                }))
            }
        }
    });
}