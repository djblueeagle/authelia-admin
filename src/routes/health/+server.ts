import type { RequestHandler } from './$types';
import { getDatabaseConfig, createDatabaseAdapter } from '$lib/server/database';

export const GET: RequestHandler = async () => {
    let db = null;
    
    try {
        const config = await getDatabaseConfig();
        
        if (!config) {
            throw new Error('Database configuration not found');
        }
        
        db = await createDatabaseAdapter(config);
        await db.healthCheck();
        
        return new Response('', { status: 200 });
    } catch (error) {
        console.error('Health check failed:', error);
        return new Response('', { status: 500 });
    } finally {
        if (db) {
            try {
                await db.close();
            } catch (closeError) {
                console.error('Error closing database connection:', closeError);
            }
        }
    }
};