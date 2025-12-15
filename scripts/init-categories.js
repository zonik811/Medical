const { Client, Databases, ID, Permission, Role } = require('node-appwrite');

// Configuración manual para el script
const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = '6940300b0005ebab7eb6'; // ID de Proyecto Corregido
const API_KEY = 'standard_e0ebfe8783cf155bcd59f7174150188ec507d3a26e5e7e2c3300afcbfa9862e14ee69d170165ac1762f64e0de1c5452b6c39619f40cea20a612dfd7d4b1a077c8024b8da45b3b91a648bf37803d9f95c0686193197e85f967c2f3af570c1367320d7ca4d3946db63430a6c171a4e7b88ab64666fc0f26318308b625c12450a79'; // TU API KEY DE ADMIN

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

const DATABASE_ID = 'menu-digital-db';
const COLLECTIONS = {
    products: 'products',
    businesses: 'businesses',
    categories: 'categories',
    themeSettings: 'themeSettings'
};

async function initDB() {
    try {
        console.log('Iniciando configuración de Base de Datos...');

        // 1. Verificar si existe la DB, si no, crearla (opcional, asumimos que existe por el error reportado)
        // Pero el usuario ya tiene productos, así que la DB existe.

        // 2. Crear Colección de Categorías si no existe
        try {
            await databases.getCollection(DATABASE_ID, COLLECTIONS.categories);
            console.log(`✅ La colección '${COLLECTIONS.categories}' ya existe.`);
        } catch (error) {
            console.log(`⚠️ La colección '${COLLECTIONS.categories}' no existe. Creando...`);
            await databases.createCollection(
                DATABASE_ID,
                COLLECTIONS.categories,
                'Categorías',
                [
                    Permission.read(Role.any()),
                    Permission.create(Role.any()), // Idealmente solo admins
                    Permission.update(Role.any()),
                    Permission.delete(Role.any()),
                ]
            );
            console.log(`✅ Colección '${COLLECTIONS.categories}' creada.`);

            // Crear atributos
            console.log('Creando atributos para Categorías...');
            await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.categories, 'name', 255, true);
            await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.categories, 'slug', 255, true);
            await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.categories, 'businessId', 255, true);
            console.log('✅ Atributos creados.');
        }

    } catch (error) {
        console.error('Error Fatal:', error);
    }
}

initDB();
