const { SecretClient } = require("@azure/keyvault-secrets");
const { DefaultAzureCredential } = require("@azure/identity");

const logAppName = '[azure-keyvault-secrets]'

const secretsCache = {
    _secrets: {},
    getSecret(secretName) {
        return this._secrets[secretName] || null;
    },
    setSecret(secretName, secretValue) {
        this._secrets[secretName] = secretValue;
    }
}

const getKeyVaultSecret = async function (keyVaultName, secretName) {

    var cacheSecretName = keyVaultName + secretName
    var cachedSecretValue = secretsCache.getSecret(cacheSecretName);

    if (cachedSecretValue == null) {

        const credential = new DefaultAzureCredential();

        const url = "https://" + keyVaultName + ".vault.azure.net";
        const client = new SecretClient(url, credential);

        const secret = await client.getSecret(secretName);

        console.log(logAppName, `read secret ${secretName} from ${url}`);

        cachedSecretValue = secret.value;

        secretsCache.setSecret(cacheSecretName, cachedSecretValue);
    }
    else {
        console.log(logAppName, `read secret ${secretName} from cache`);
    }

    return cachedSecretValue;
}

const secretTag = {
    name: 'azureSecret',
    displayName: 'Azure Key Vault Secret',
    liveDisplayName: (args) => {
        return `Secret => ${args[0].value}`;
    },
    description: 'Retrieve an azure Key Vault Secret by name',
    args: [{
        displayName: 'Secret Name',
        description: 'The name of the Key Vault secret',
        type: 'string',
        defaultValue: ''
    }],
    async run(context, secretName) {

        const keyVaultName = await context.context.AZURE_KEYVAULT;

        if (typeof keyVaultName === 'undefined') {
            console.error(logAppName, 'missing AZURE_KEYVAULT environment variable');
            return '';
        }

        const secretValue = getKeyVaultSecret(keyVaultName, secretName);

        return secretValue;
    }
}

module.exports.templateTags = [secretTag];