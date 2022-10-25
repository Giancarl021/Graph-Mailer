# auth login

Login with Microsoft Graph API

## Usage

```bash
mailer auth login <flags>
```

## Flags

-   `--client-id` | `-c`: The App Registration Client ID. Value: `<client-id>`;
-   `--client-secret` | `-s`: The App Registration Client Secret. Value: `<client-secret>`;
-   `--tenant-id` | `-t`: The App Registration Tenant ID. Value: `<tenant-id>`;
-   `--account-type` | `-a`: The account type of the user. Default 'both'. Values: `personal` | `corporate` | `both`;
-   `--force` | `-f`: Overwrite credentials if already logged in.
