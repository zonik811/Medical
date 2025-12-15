const { Client, Databases } = require('node-appwrite');

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
const COLLECTION_BUSINESSES = 'businesses';

async function debugCategories() {
    try {
        console.log('🕵️ Iniciando diagnóstico de Categorías...');

        // 1. Listar TODOS los negocios para saber qué IDs son válidos
        try {
            const businesses = await databases.listDocuments(DATABASE_ID, COLLECTION_BUSINESSES);
            console.log('\n🏢 Negocios encontrados:', businesses.total);
            businesses.documents.forEach(b => {
                console.log(`   - Nombre: ${b.name}, ID: ${b.$id}, Slug: ${b.slug}`);
            });
        } catch (e) {
            console.log('⚠️ Error listando negocios:', e.message);
        }

        // 2. Listar TODAS las categorías (sin filtrar)
        console.log('\n📂 Consultando TODAS las categorías en BD...');
        const categories = await databases.listDocuments(DATABASE_ID, COLLECTION_CATEGORIES);

        console.log(`📊 Total encontradas: ${categories.total}`);

        if (categories.total === 0) {
            console.log('❌ No hay categorías creadas. Verifica que hayas creado el documento en la colección correcta.');
        } else {
            categories.documents.forEach(cat => {
                console.log(`   - ID: ${cat.$id}`);
                console.log(`     Nombre: "${cat.name}"`);
                console.log(`     BusinessId asignado: "${cat.businessId}"`);
                console.log('     ------------------------------');
            });
        }

    } catch (error) {
        console.error('❌ Error de conexión:', error.message);
    }
}

debugCategories();
