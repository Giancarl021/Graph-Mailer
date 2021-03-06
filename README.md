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

Then you need to add the credentials of your instance with the ``credentials set`` command.

## Authentication

After all the environment variables are configured, when you first execute the project, a oAuth2 window will be popped up, for the first authentication and authorization. After that you will not need to sign in again.

## Commands

[//]: # (^)

### send ``<destination[,destination[,...]]>`` ``<subject>`` ``<body or @from:path/to/file>``
Send an email

**Flags:**
* ``-t | --type``: The type of the body.  
*Value:* ``text | html | md``.
* ``--cc``: Carbon-Copy email addresses.  
*Value:* ``<email>``.
* ``--bcc``: Blinded Carbon-Copy email addresses.  
*Value:* ``<email>``.


### credentials 
Manage the credentials to Graph API

**Operations:**

#### get 
Returns the credentials saved
#### set 
Save credentials

**Flags:**
* ``-t | --tenant-id``: The Tenant ID of the graph instance
* ``-c | --client-id``: The Client ID of the graph instance
* ``-s | --client-secret``: The Client Secret of the graph instance
* ``-f | --force``: Overwrite if existent without asking
* ``-p | --personal``: The credentials to be saved aim personal accounts
* ``--no-p | --no-personal``: The credentials to be saved aim organizational accounts


#### remove 
Remove current credentials

**Flags:**
* ``-f | --force``: Force remove without asking



[//]: # ($)