# Graph-Mailer

![Logo](assets/logo.png)

CLI tool that send emails on behalf of a user using Microsoft Graph API.

> **Note:** This package uses the [graph-interface](https://github.com/Giancarl021/graph-interface) package behind the scenes.

## Installation

You can install this package globally from [NPM](https://npmjs.com/package/graph-mailer).

## Graph API

To use this tool, an [Azure App Registration](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app) is required.

The App Registration must have the following permissions:

* `User.Read` (Delegated);
* `Mail.Send` (Delegated).

The redirect URI must be set to web and have the value of `http://localhost:9090`.

The App Registration must have a client secret.

The required values to use in this tool are:

* Client ID;
* Client Secret;
* Tenant ID.

## Usage

[//]: # 'Insert any custom documentation ABOVE this line'
[//]: # 'DOCS_START'

-   [auth](docs/mailer-auth.md): Manages authentication with Microsoft Graph API;
-   [send](docs/mailer-send.md): Send an email of behalf of the logged in user.

[//]: # 'DOCS_END'
[//]: # 'Insert any custom documentation BELOW this line'
