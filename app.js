const { SecretClient } = require("@azure/keyvault-secrets");
const { DefaultAzureCredential } = require("@azure/identity");

const logAppName = '[azure-keyvault-secrets]';

const secretsCache = {
    _secrets: {},
    getSecret(secretName) {
        return this._secrets[secretName] ?? null;
    },
    setSecret(secretName, secretValue) {
        this._secrets[secretName] = secretValue;
    },
};

const getKeyVaultSecret = async function (keyVaultName, secretName) {
    const cacheSecretName = `${keyVaultName}${secretName}`;
    const cachedSecretValue = secretsCache.getSecret(cacheSecretName);

    if (cachedSecretValue !== null) {
        console.log(logAppName, `read secret ${secretName} from cache`);
        return cachedSecretValue;
    }

    const credential = new DefaultAzureCredential();
    const url = `https://${keyVaultName}.vault.azure.net`;

    var clientOptions = undefined;
    if (process.env.NODE_EXTRA_CA_CERTS) {
        clientOptions = {
            tlsOptions: {
                ca: fs.readFileSync(process.env.NODE_EXTRA_CA_CERTS)
            }
        };
    }

    const client = new SecretClient(url, credential, clientOptions);

    try {
        const secret = await client.getSecret(secretName);
        console.log(logAppName, `read secret ${secretName} from ${url}`);

        const secretValue = secret?.value;
        secretsCache.setSecret(cacheSecretName, secretValue);

        return secretValue;
    } catch (error) {
        console.error(logAppName, `failed to read secret ${secretName} from ${url}: ${error}`);
        return null;
    }
};

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