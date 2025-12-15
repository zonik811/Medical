const sdk = require('node-appwrite');

const client = new sdk.Client();

// Arguments: Project ID, API Key
const projectId = process.argv[2];
const apiKey = process.argv[3];

if (!projectId || !apiKey) {
    console.error("Usage: node setup-db.js <PROJECT_ID> <API_KEY>");
    process.exit(1);
}

client
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject(projectId)
    .setKey(apiKey);

const databases = new sdk.Databases(client);
const storage = new sdk.Storage(client);

const DB_ID = 'menu-digital-db';
const BUCKET_ID = 'product-images';

async function setup() {
    console.log('🚀 Iniciando configuración de Appwrite...');

    // 1. Create Database
    try {
        await databases.get(DB_ID);
        console.log('✅ Base de datos ya existe.');
    } catch {
        console.log('Creates Database...');
        await databases.create(DB_ID, 'Menu Digital DB');
        console.log('✅ Base de datos creada.');
    }

    // 2. Create Products Collection
    await createCollection('products', 'Productos', [
        { key: 'name', type: 'string', size: 128, required: true },
        { key: 'description', type: 'string', size: 1000, required: false },
        { key: 'price', type: 'double', required: true },
        { key: 'categoryId', type: 'string', size: 64, required: false },
        { key: 'businessId', type: 'string', size: 64, required: true },
        { key: 'isAvailable', type: 'boolean', required: true },
        { key: 'imageUrl', type: 'string', size: 512, required: false }, // Store URL here
    ]);

    // 3. Create Businesses Collection
    await createCollection('businesses', 'Negocios', [
        { key: 'name', type: 'string', size: 128, required: true },
        { key: 'slug', type: 'string', size: 64, required: true },
        { key: 'isActive', type: 'boolean', required: true, default: true },
    ]);

    // 4. Create Theme Settings Collection
    await createCollection('themeSettings', 'Configuración de Tema', [
        { key: 'businessId', type: 'string', size: 64, required: true },
        { key: 'primaryColor', type: 'string', size: 32, required: false },
        { key: 'secondaryColor', type: 'string', size: 32, required: false },
        { key: 'backgroundColor', type: 'string', size: 32, required: false },
        { key: 'borderRadius', type: 'string', size: 16, required: false },
    ]);

    // 5. Create Storage Bucket
    try {
        await storage.getBucket(BUCKET_ID);
        console.log('✅ Bucket de imágenes ya existe.');
    } catch {
        console.log('Creando bucket de imágenes...');
        await storage.createBucket(BUCKET_ID, 'Imágenes de Productos', ['read("any")'], false, true, undefined, ['jpg', 'png', 'webp', 'jpeg']);
        console.log('✅ Bucket creado.');
    }

    console.log('🎉 ¡Configuración completada con éxito!');
    console.log('Ahora puedes configurar tu .env.local con los IDs.');
}

async function createCollection(id, name, attributes) {
    try {
        await databases.getCollection(DB_ID, id);
        console.log(`✅ Colección ${name} ya existe.`);
    } catch {
        console.log(`Creando colección ${name}...`);
        await databases.createCollection(DB_ID, id, name, ['read("any")']); // Public read for demo
        console.log(`✅ Colección ${name} creada.`);

        // Create attributes
        for (const attr of attributes) {
            try {
                if (attr.type === 'string') {
                    await databases.createStringAttribute(DB_ID, id, attr.key, attr.size, attr.required, attr.default);
                } else if (attr.type === 'double') {
                    await databases.createFloatAttribute(DB_ID, id, attr.key, attr.required, 0, undefined, attr.default);
                } else if (attr.type === 'boolean') {
                    await databases.createBooleanAttribute(DB_ID, id, attr.key, attr.required, attr.default);
                } else if (attr.type === 'integer') {
                    await databases.createIntegerAttribute(DB_ID, id, attr.key, attr.required, 0, undefined, attr.default);
                }
                console.log(`   - Atributo ${attr.key} creado.`);
                // Small delay to avoid race conditions in attribute creation limits
                await new Promise(r => setTimeout(r, 500));
            } catch (e) {
                console.log(`   - Atributo ${attr.key} ya existía o error:`, e.message);
            }
        }

        // Wait for attributes to be processed
        console.log('   Esperando a que se procesen los atributos...');
        await new Promise(r => setTimeout(r, 2000));
    }
}

setup().catch(console.error);
