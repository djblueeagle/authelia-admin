import type { PageServerLoad, Actions } from './$types';
import { getDatabaseConfig, createDatabaseAdapter } from '$lib/server/database';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
    try {
        const dbConfig = await getDatabaseConfig();
        
        if (!dbConfig) {
            return {
                error: 'Database configuration not found in Authelia config',
                storageType: null,
                configurations: []
            };
        }
        
        if (dbConfig.type !== 'sqlite') {
            return {
                error: `Database type "${dbConfig.type}" is not yet supported. Only SQLite is currently supported.`,
                storageType: dbConfig.type,
                configurations: []
            };
        }
        
        const adapter = await createDatabaseAdapter(dbConfig);
        
        try {
            const configurations = await adapter.getTOTPConfigurations();
            
            return {
                error: null,
                storageType: dbConfig.type,
                dbPath: dbConfig.path,
                configurations: configurations.map(config => ({
                    ...config,
                    created_at: config.created_at,
                    last_used_at: config.last_used_at,
                    secret: '[ENCRYPTED]'
                }))
            };
        } finally {
            await adapter.close();
        }
        
    } catch (error) {
        return {
            error: `Failed to load TOTP configurations: ${(error as Error).message}`,
            storageType: null,
            configurations: []
        };
    }
};

export const actions: Actions = {
    delete: async ({ request }) => {
        try {
            const formData = await request.formData();
            const id = formData.get('id')?.toString();
            const username = formData.get('username')?.toString();
            
            if (!id) {
                return fail(400, { error: 'Configuration ID is required' });
            }
            
            const dbConfig = await getDatabaseConfig();
            
            if (!dbConfig) {
                return fail(500, { error: 'Database configuration not found' });
            }
            
            if (dbConfig.type !== 'sqlite') {
                return fail(501, { error: `Database type "${dbConfig.type}" is not yet supported` });
            }
            
            const adapter = await createDatabaseAdapter(dbConfig);
            
            try {
                const success = await adapter.deleteTOTPConfiguration(parseInt(id));
                
                if (!success) {
                    return fail(404, { error: `TOTP configuration not found` });
                }
                
                return { success: true, message: `TOTP configuration for user "${username}" has been deleted` };
            } finally {
                await adapter.close();
            }
            
        } catch (error) {
            console.error('Error deleting TOTP configuration:', error);
            return fail(500, { error: `Failed to delete TOTP configuration: ${(error as Error).message}` });
        }
    }
};