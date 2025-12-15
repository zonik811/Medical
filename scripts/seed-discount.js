const { Client, Databases, ID, Query } = require('node-appwrite');

const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = '6940300b0005ebab7eb6';
const API_KEY = 'standard_e0ebfe8783cf155bcd59f7174150188ec507d3a26e5e7e2c3300afcbfa9862e14ee69d170165ac1762f64e0de1c5452b6c39619f40cea20a612dfd7d4b1a077c8024b8da45b3b91a648bf37803d9f95c0686193197e85f967c2f3af570c1367320d7ca4d3946db63430a6c171a4e7b88ab64666fc0f26318308b625c12450a79';
const BUSINESS_ID = '694062d100189a008a18'; // Tu negocio
const DATABASE_ID = 'menu-digital-db';
const COLLECTION_PRODUCTS = 'products';
const COLLECTION_DISCOUNTS = 'discounts';

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

async function seedDiscount() {
    try {
        console.log('🔍 Buscando un producto para aplicar descuento...');

        // 1. Obtener el primer producto del negocio
        const products = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_PRODUCTS,
            [Query.equal('businessId', BUSINESS_ID), Query.limit(1)]
        );

        if (products.documents.length === 0) {
            console.log('⚠️ No tienes productos. Crea un producto primero.');
            return;
        }

        const product = products.documents[0];
        console.log(`🍔 Producto encontrado: ${product.name} (Precio: $${product.price})`);

        // 2. Calcular descuento (20%)
        const percentage = 20;
        const discountAmount = product.price * (percentage / 100);
        const finalPrice = product.price - discountAmount;

        console.log(`📉 Aplicando descuento del ${percentage}%...`);
        console.log(`   Precio Original: $${product.price}`);
        console.log(`   Precio Final: $${finalPrice}`);

        // 3. Guardar en colección discounts
        // Primero verificamos si ya existe descuento para ese producto para no duplicar en demo
        const existing = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_DISCOUNTS,
            [Query.equal('productId', product.$id)]
        );

        if (existing.documents.length > 0) {
            console.log('⚠️ Este producto ya tenía un descuento. Borrándolo para crear uno nuevo...');
            await databases.deleteDocument(DATABASE_ID, COLLECTION_DISCOUNTS, existing.documents[0].$id);
        }

        await databases.createDocument(
            DATABASE_ID,
            COLLECTION_DISCOUNTS,
            ID.unique(),
            {
                businessId: BUSINESS_ID,
                productId: product.$id,
                originalPrice: Number(product.price), // Asegurar float
                percentage: percentage,
                finalPrice: Number(finalPrice)
            }
        );

        console.log('✅ ¡Descuento creado exitosamente!');
        console.log('👉 Ve a tu tienda y deberías ver el badge de -20% en el primer producto.');

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

seedDiscount();
