If you like this plugin, [leave it a :star: on Github!](https://github.com/glconti/insomnia-plugin-azure-keyvault-secrets)

# Azure Key Vault Secrets for Insomnia

![Azure Key Vault Secrets for Insomnia Logo](https://unpkg.com/insomnia-plugin-azure-keyvault-secrets/plugin-background.png)

A plugin for Insomnia to retrieve secrets from Azure Key Vault and use them in your environment.

This plugin installs a [template tag](https://docs.insomnia.rest/insomnia/template-tags) to read secrets from a Azure Key Vault.

### Prerequisites
- Install the Azure Cli and login with `az login`. The plugin will automaticlaly read the cached credentials.

### Installation
You can find the plugin at this [link](https://insomnia.rest/plugins/insomnia-plugin-azure-keyvault-secrets).

### How to use it
- Install the plugin from the [Insomnia plugin Hub](https://insomnia.rest/plugins/insomnia-plugin-azure-keyvault-secrets).
- Add an environment variable with the name `AZURE_KEYVAULT`, only the name will do, the plugin will create the full url. For example if the full key vault url is `https://my-key-vault-name.vault.azure.net`, the variable will be `"AZURE_KEYVAULT": "my-key-vault-name"`.

![image](https://user-images.githubusercontent.com/13535297/205342705-b6b1a760-d6be-41c4-8477-9a0450faf65b.png)

- Hit `Ctrl + Space` in any place where an environment variable is available and pick `Azure Key Vault Secret`

![image](https://user-images.githubusercontent.com/13535297/205342824-e0227fcb-d0a4-4ecc-991e-9a8e2de4a1b2.png)

- The template tag will become red indicating an error, in fact it requires a secret name, click on it

![image](https://user-images.githubusercontent.com/13535297/205342990-200ad999-288e-40a2-94eb-7155a24ca633.png)

- Set the secret name

![image](https://user-images.githubusercontent.com/13535297/205344816-5ed8e14e-b740-4b45-b67d-2d522d58b68a.png)

The live preview will show the value. Click Done.

- The template tag shows now the secret name

![image](https://user-images.githubusercontent.com/13535297/205344947-a68de70e-d9fc-417d-814a-80e4b0e3766f.png)

### Notes
The secrets are retrieved once and cached for the lifetime of the application because Insomnia evaluates all environment variables and template tags very often.
To force the retrieval of the secrets simply restart Insomnia.
