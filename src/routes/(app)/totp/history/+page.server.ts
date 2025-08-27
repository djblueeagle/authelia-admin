import type { PageServerLoad } from './$types';
import { getDatabaseConfig, createDatabaseAdapter } from '$lib/server/database';

export const load: PageServerLoad = async ({ url }) => {
    try {
        // Get limit from query params, default to 100
        const limit = parseInt(url.searchParams.get('limit') || '100');
        
        const dbConfig = await getDatabaseConfig();
        
        if (!dbConfig) {
            return {
                error: 'Database configuration not found in Authelia config',
                storageType: null,
                history: []
            };
        }
        
        if (dbConfig.type !== 'sqlite') {
            return {
                error: `Database type "${dbConfig.type}" is not yet supported. Only SQLite is currently supported.`,
                storageType: dbConfig.type,
                history: []
            };
        }
        
        const adapter = await createDatabaseAdapter(dbConfig);
        
        try {
            const history = await adapter.getTOTPHistory(limit);
            
            // Group history by username for better visualization
            const groupedHistory = history.reduce((acc, entry) => {
                if (!acc[entry.username]) {
                    acc[entry.username] = [];
                }
                acc[entry.username].push(entry);
                return acc;
            }, {} as Record<string, typeof history>);
            
            // Get statistics
            const stats = {
                totalEntries: history.length,
                uniqueUsers: Object.keys(groupedHistory).length,
                mostRecentUse: history[0]?.created_at || null,
                oldestEntry: history[history.length - 1]?.created_at || null
            };
            
            return {
                error: null,
                storageType: dbConfig.type,
                dbPath: dbConfig.path,
                history,
                groupedHistory,
                stats,
                limit
            };
        } finally {
            await adapter.close();
        }
        
    } catch (error) {
        return {
            error: `Failed to load TOTP history: ${(error as Error).message}`,
            storageType: null,
            history: []
        };
    }
};