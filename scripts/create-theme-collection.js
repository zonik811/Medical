/**
 * Script para crear la colección themeSettings en Appwrite
 * Ejecutar con: node scripts/create-theme-collection.js
 */

const sdk = require('node-appwrite');

const client = new sdk.Client();
const databases = new sdk.Databases(client);

client
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject('6940300b0005ebab7eb6')
    .setKey(process.env.APPWRITE_API_KEY || '');

const databaseId = 'menu-digital-db';

async function createThemeSettingsCollection() {
    try {
        console.log('🎨 Creating themeSettings collection...');

        const collection = await databases.createCollection(
            databaseId,
            'themeSettings',
            'Theme Settings',
            [
                sdk.Permission.read(sdk.Role.any()),
                sdk.Permission.create(sdk.Role.users()),
                sdk.Permission.update(sdk.Role.users()),
                sdk.Permission.delete(sdk.Role.users())
            ]
        );

        console.log('✅ Collection created:', collection.$id);

        // Create attributes
        const attributes = [
            { key: 'businessId', type: 'string', size: 255, required: true },
            { key: 'primaryColor', type: 'string', size: 50, required: true, default: '#FF6B6B' },
            { key: 'secondaryColor', type: 'string', size: 50, required: true, default: '#4ECDC4' },
            { key: 'accentColor', type: 'string', size: 50, required: true, default: '#FFE66D' },
            { key: 'backgroundColor', type: 'string', size: 50, required: true, default: '#FFFFFF' },
            { key: 'surfaceColor', type: 'string', size: 50, required: true, default: '#F8F9FA' },
            { key: 'textColor', type: 'string', size: 50, required: true, default: '#2C3E50' },
            { key: 'mutedColor', type: 'string', size: 50, required: true, default: '#6C757D' },
            { key: 'borderRadius', type: 'string', size: 50, required: true, default: '0.5rem' },
            { key: 'buttonRadius', type: 'string', size: 50, required: true, default: '0.5rem' },
            { key: 'cardRadius', type: 'string', size: 50, required: true, default: '0.75rem' },
            { key: 'buttonStyle', type: 'string', size: 50, required: true, default: 'solid' },
            { key: 'buttonSize', type: 'string', size: 50, required: true, default: 'md' },
            { key: 'cardStyle', type: 'string', size: 50, required: true, default: 'elevated' },
            { key: 'badgeStyle', type: 'string', size: 50, required: true, default: 'solid' },
            { key: 'shadowIntensity', type: 'string', size: 50, required: true, default: 'medium' }
        ];

        console.log('📝 Creating attributes...');

        for (const attr of attributes) {
            await databases.createStringAttribute(
                databaseId,
                collection.$id,
                attr.key,
                attr.size,
                attr.required,
                attr.default
            );
            console.log(`  ✓ ${attr.key}`);
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Create index for businessId
        console.log('📊 Creating index...');
        await databases.createIndex(
            databaseId,
            collection.$id,
            'businessId_index',
            'key',
            ['businessId']
        );

        console.log('\n✅ ThemeSettings collection created successfully!');
        console.log(`Collection ID: ${collection.$id}`);
        console.log('\nAdd this to your appwriteConfig:');
        console.log(`themeSettings: '${collection.$id}',`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.code === 409) {
            console.log('Collection already exists!');
        }
    }
}

createThemeSettingsCollection();
