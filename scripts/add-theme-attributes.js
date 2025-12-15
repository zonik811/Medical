/**
 * Script para agregar atributos faltantes a themeSettings
 * Ejecutar con: node scripts/add-theme-attributes.js
 */

const sdk = require('node-appwrite');

const client = new sdk.Client();
const databases = new sdk.Databases(client);

client
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject('6940300b0005ebab7eb6')
    .setKey(process.env.APPWRITE_API_KEY || '');

const databaseId = 'menu-digital-db';
const collectionId = 'themeSettings';

async function addMissingAttributes() {
    try {
        console.log('🔧 Adding missing attributes to themeSettings...');

        const newAttributes = [
            { key: 'accentColor', default: '#FFE66D' },
            { key: 'mutedColor', default: '#6C757D' },
            { key: 'buttonRadius', default: '0.5rem' },
            { key: 'cardRadius', default: '0.75rem' },
            { key: 'buttonStyle', default: 'solid' },
            { key: 'buttonSize', default: 'md' },
            { key: 'cardStyle', default: 'elevated' },
            { key: 'badgeStyle', default: 'solid' },
            { key: 'shadowIntensity', default: 'medium' }
        ];

        for (const attr of newAttributes) {
            try {
                await databases.createStringAttribute(
                    databaseId,
                    collectionId,
                    attr.key,
                    50,
                    false, // NOT required - allows default value
                    attr.default
                );
                console.log(`  ✅ ${attr.key} created`);
                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 700));
            } catch (error) {
                if (error.code === 409) {
                    console.log(`  ⚠️  ${attr.key} already exists, skipping`);
                } else {
                    console.error(`  ❌ Error creating ${attr.key}:`, error.message);
                }
            }
        }

        console.log('\n✅ All missing attributes added successfully!');
        console.log('\n⏳ IMPORTANT: Wait 2-3 minutes for Appwrite to index the new attributes before using the editor.');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

addMissingAttributes();
