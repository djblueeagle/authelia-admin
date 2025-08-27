import type { PageServerLoad } from './$types';
import { ldapClient } from '$lib/server/ldap';

export const load: PageServerLoad = async () => {
    try {
        const users = await ldapClient.getUsers();
        const ldapServer = await ldapClient.getServerInfo();
        
        // Sort users by username
        users.sort((a, b) => a.uid.localeCompare(b.uid));
        
        return {
            error: null,
            users,
            ldapServer
        };
    } catch (error) {
        console.error('Error fetching LDAP users:', error);
        const ldapServer = await ldapClient.getServerInfo();
        
        return {
            error: `Failed to fetch users from LDAP: ${(error as Error).message}`,
            users: [],
            ldapServer
        };
    }
};