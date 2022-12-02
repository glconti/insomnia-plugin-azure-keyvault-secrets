const { SecretClient } = require("@azure/keyvault-secrets");
const { DefaultAzureCredential } = require("@azure/identity");

const logAppName = '[azure-keyvault-secrets]'

const getKeyVaultSecret = async function (keyVaultName, secretName) {

    const credential = new DefaultAzureCredential();

    const url = "https://" + keyVaultName + ".vault.azure.net";
    const client = new SecretClient(url, credential);

    const secret = await client.getSecret(secretName);

    console.log(logAppName, `read secret ${secretName} from ${url}`);

    return secret.value;
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
        console.log(logAppName, `getting azureSecret ${secretName}`);

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