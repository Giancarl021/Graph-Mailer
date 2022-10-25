# send

Send an email of behalf of the logged in user

## Usage

```bash
mailer send <email1[,email2[,...]]> <subject> <body|@path/to/file> <flags>
```

## Flags

* `--carbon-copy` | `--cc`: Carbon copy recipients. Value: `email1[,email2[,...]`;
* `--blinded-carbon-copy` | `--bcc`: Blinded carbon copy recipients. Value: `email1[,email2[,...]`;
* `--type` | `-t`: The type of body of the email (if file have correct extension will be inferred). Values: `text` | `html` | `markdown`;
* `--graph-version`: The Graph API version used in the request. Values: `v1.0` | `beta`;
* `--css` | `--style`: The URL or path to a CSS file to be used with a Markdown body. Values: `url` | `@path/to/file`.

