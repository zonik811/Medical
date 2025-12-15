const { Client, Databases, Permission, Role } = require('node-appwrite');

const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = '6940300b0005ebab7eb6';
const API_KEY = 'standard_e0ebfe8783cf155bcd59f7174150188ec507d3a26e5e7e2c3300afcbfa9862e14ee69d170165ac1762f64e0de1c5452b6c39619f40cea20a612dfd7d4b1a077c8024b8da45b3b91a648bf37803d9f95c0686193197e85f967c2f3af570c1367320d7ca4d3946db63430a6c171a4e7b88ab64666fc0f26318308b625c12450a79';

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

const DATABASE_ID = 'menu-digital-db';
const COLLECTION_DISCOUNTS = 'discounts';

async function initDiscounts() {
    try {
        console.log('🚀 Iniciando configuración de Descuentos...');

        // 1. Crear Colección de Descuentos
        try {
            await databases.getCollection(DATABASE_ID, COLLECTION_DISCOUNTS);
            console.log(`✅ La colección '${COLLECTION_DISCOUNTS}' ya existe.`);
        } catch (error) {
            console.log(`⚠️ La colección '${COLLECTION_DISCOUNTS}' no existe. Creando...`);
            await databases.createCollection(
                DATABASE_ID,
                COLLECTION_DISCOUNTS,
                'Descuentos',
                [
                    Permission.read(Role.any()), // Público para ver precios
                    Permission.create(Role.any()), // Debería ser solo admin, pero para demo OK
                    Permission.update(Role.any()),
                    Permission.delete(Role.any()),
                ]
            );
            console.log(`✅ Colección '${COLLECTION_DISCOUNTS}' creada.`);

            // Crear atributos
            console.log('Creando atributos para Descuentos...');

            // Relación con producto
            await databases.createStringAttribute(DATABASE_ID, COLLECTION_DISCOUNTS, 'productId', 64, true);

            // Relación con negocio (para filtrar rápido)
            await databases.createStringAttribute(DATABASE_ID, COLLECTION_DISCOUNTS, 'businessId', 64, true);

            // Datos del descuento
            await databases.createFloatAttribute(DATABASE_ID, COLLECTION_DISCOUNTS, 'originalPrice', true);
            await databases.createIntegerAttribute(DATABASE_ID, COLLECTION_DISCOUNTS, 'percentage', true); // ej: 20 -> 20%
            await databases.createFloatAttribute(DATABASE_ID, COLLECTION_DISCOUNTS, 'finalPrice', true);

            console.log('✅ Atributos base creados.');

            // Crear índices para busquedas rápidas
            console.log('⏳ Esperando para crear índices...');
            await new Promise(resolve => setTimeout(resolve, 2000));

            await databases.createIndex(
                DATABASE_ID,
                COLLECTION_DISCOUNTS,
                'idx_productId',
                'key',
                ['productId']
            );

            await databases.createIndex(
                DATABASE_ID,
                COLLECTION_DISCOUNTS,
                'idx_businessId',
                'key',
                ['businessId']
            );

            console.log('✅ Índices creados.');
        }

    } catch (error) {
        console.error('❌ Error Fatal:', error.message);
    }
}

initDiscounts();
