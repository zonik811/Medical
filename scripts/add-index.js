const { Client, Databases } = require('node-appwrite');

// Configuración importada de tu setup anterior
const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = '6940300b0005ebab7eb6';
const API_KEY = 'standard_e0ebfe8783cf155bcd59f7174150188ec507d3a26e5e7e2c3300afcbfa9862e14ee69d170165ac1762f64e0de1c5452b6c39619f40cea20a612dfd7d4b1a077c8024b8da45b3b91a648bf37803d9f95c0686193197e85f967c2f3af570c1367320d7ca4d3946db63430a6c171a4e7b88ab64666fc0f26318308b625c12450a79';

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

const DATABASE_ID = 'menu-digital-db';
const COLLECTION_CATEGORIES = 'categories';

async function addIndex() {
    try {
        console.log('🔍 Verificando índices en Categorías...');

        // Intentar crear el índice
        // createIndex(databaseId, collectionId, key, type, attributes, orders)
        // key: nombre del índice, type: "key" (normal), attributes: array de atributos
        console.log('➕ Creando índice para búsquedas por businessId...');

        await databases.createIndex(
            DATABASE_ID,
            COLLECTION_CATEGORIES,
            'idx_businessId', // Nombre del índice
            'key',            // Tipo de índice
            ['businessId'],   // Atributos
            ['ASC']           // Orden (opcional, pero requerido por la firma en algunas versiones)
        );

        console.log('✅ ¡Índice creado exitosamente!');
        console.log('Ahora las búsquedas por businessId funcionarán.');

    } catch (error) {
        if (error.code === 409) {
            console.log('✅ El índice ya existía (Error 409). Todo está bien.');
        } else {
            console.error('❌ Error al crear índice:', error);
        }
    }
}

addIndex();
