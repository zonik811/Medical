const sdk = require('node-appwrite');

const client = new sdk.Client();

// Arguments: Project ID, API Key
const projectId = process.argv[2];
const apiKey = process.argv[3];
const email = 'admin@menu.com';
const password = 'password123';
const name = 'Admin User';

if (!projectId || !apiKey) {
    console.error("Usage: node create-admin.js <PROJECT_ID> <API_KEY>");
    process.exit(1);
}

client
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject(projectId)
    .setKey(apiKey);

const users = new sdk.Users(client);

async function createAdmin() {
    console.log(`🚀 Creando usuario administrador: ${email}...`);

    try {
        await users.create(
            sdk.ID.unique(),
            email,
            undefined, // phone
            password,
            name
        );
        console.log('✅ Usuario Administrador creado exitosamente.');
        console.log(`📧 Email: ${email}`);
        console.log(`🔑 Password: ${password}`);
    } catch (error) {
        if (error.code === 409) {
            console.log('⚠️ El usuario ya existe.');
        } else {
            console.error('❌ Error creando usuario:', error.message);
        }
    }
}

createAdmin().catch(console.error);
