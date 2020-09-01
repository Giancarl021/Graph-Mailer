module.exports = async function (subject, bodyType, content, recipients) {
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