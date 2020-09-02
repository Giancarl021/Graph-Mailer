# Graph-Mailer

Microsoft Graph API client that send emails on behalf of a user by a CLI interface

## Installation

npm:

```bash
npm install --global graph-mailer
```

yarn:

```bash
yarn add global graph-mailer
```

## Connection with a Microsoft Graph Instance

To this app work as expected, you need to provide a connection with a [Graph API](https://docs.microsoft.com/en/graph/use-the-api) from your [Azure Tenant](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-create-new-tenant).

The permissions needed in the Graph instance are:

* ``User.Read`` (Delegated)
* ``Mail.Send`` (Delegated)

Then you need to fill a ``.env`` file on the root of the project with the values:

```env
TENANT_ID="..."
CLIENT_ID="..."
CLIENT_SECRET="..."
PERSONAL=true
```

The ``PERSONAL`` value **must** be true if you want to use accounts like ``foo@hotmail.com``.

## Authentication

After all the environment variables are configured, when you first execute the project, a oAuth2 window will be popped up, for the first authentication and authorization. After that you will not need to sign in again.

## Commands

[//]: # (^)

### send ``<destination[,destination[,...]]>`` ``<subject>`` ``<body or @from:path/to/file>``
Send an email

**Flags:**
* ``-t | --type``: The type of the body.  
*Value:* ``text | html | md``.



[//]: # ($)