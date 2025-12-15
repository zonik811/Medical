const sdk = require('node-appwrite');

const client = new sdk.Client();

// Arguments: Project ID, API Key
const projectId = process.argv[2];
const apiKey = process.argv[3];

if (!projectId || !apiKey) {
    console.error("Usage: node fix-permissions.js <PROJECT_ID> <API_KEY>");
    process.exit(1);
}

client
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject(projectId)
    .setKey(apiKey);

const databases = new sdk.Databases(client);
const storage = new sdk.Storage(client);

const DB_ID = 'menu-digital-db';

async function fixPermissions() {
    console.log('🔧 Corrigiendo permisos...');

    const collections = ['products', 'businesses', 'themeSettings'];
    const permissions = [
        sdk.Permission.read(sdk.Role.any()),
        sdk.Permission.create(sdk.Role.users()),
        sdk.Permission.update(sdk.Role.users()),
        sdk.Permission.delete(sdk.Role.users()),
    ];

    // 1. Update Collections
    for (const colId of collections) {
        try {
            console.log(`Actualizando colección: ${colId}...`);
            // We need to fetch the collection to get current name (or just update permissions if name is not required, but updateCollection requires name)
            // Easier to just assume names or re-fetch. Let's fetch first.
            const col = await databases.getCollection(DB_ID, colId);

            await databases.updateCollection(
                DB_ID,
                colId,
                col.name,
                permissions
            );
            console.log(`✅ Permisos actualizados para ${colId}`);
        } catch (e) {
            console.error(`❌ Error en colección ${colId}:`, e.message);
        }
    }

    // 2. Update Storage Bucket
    try {
        console.log('Actualizando bucket de imágenes...');
        const BUCKET_ID = 'product-images';
        const bucket = await storage.getBucket(BUCKET_ID);

        await storage.updateBucket(
            BUCKET_ID,
            bucket.name,
            permissions,
            false, // fileSecurity
            true, // enabled
            undefined, // maxFileSize
            ['jpg', 'png', 'webp', 'jpeg'] // allowedExtensions
        );
        console.log(`✅ Permisos actualizados para Bucket`);
    } catch (e) {
        console.error('❌ Error en Bucket:', e.message);
    }

    console.log('🎉 ¡Permisos corregidos! Intenta crear el producto de nuevo.');
}

fixPermissions().catch(console.error);
