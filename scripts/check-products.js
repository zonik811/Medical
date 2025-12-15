
const { Client, Databases, Query } = require('node-appwrite');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

// If you have an API key for admin access, set it here. 
// For public read access, we don't need it if permissions allow.
// But node-appwrite strictly speaking usually requires API key for server-side ops.
// However, we are simulating a client-side query as much as possible, 
// but node-appwrite IS a server SDK. It might fail without API key if using server methods.
// Let's rely on the user having set permissions to Any.
// Wait, node-appwrite will throw if no API key is provided for most operations.
// Let's assume the user has an API Key in .env.local or we can try to use a dummy session?
// Actually, let's just inspect the .env.local file first to see what keys we have.
// If we only have public keys, we might not be able to run this script easily from Node unless we use the web SDK polyfilled or if we have an API Key.

console.log('Endpoint:', process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT);
console.log('Project:', process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
console.log('Database:', process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID);

const databases = new Databases(client);

async function check() {
    try {
        console.log('Querying products for businessId="demo"...');
        const response = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'menu-digital-db',
            'products',
            [Query.equal('businessId', 'demo')]
        );

        console.log(`Found ${response.total} documents.`);
        console.log(JSON.stringify(response.documents, null, 2));
    } catch (error) {
        console.error('Error querying database:', error.message);
        if (error.code === 401) {
            console.log('NOTE: Verification script failed due to missing API Key permissions. This is expected if running from Node without an API Key, even if public read is enabled (Node SDK expects authentication).');
        }
    }
}

check();
