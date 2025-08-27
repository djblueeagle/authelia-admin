import type { PageServerLoad } from './$types';
import { ldapClient } from '$lib/server/ldap';

export const load: PageServerLoad = async () => {
    try {
        const groups = await ldapClient.getGroups();
        const ldapServer = await ldapClient.getServerInfo();
        
        // Sort groups by name
        groups.sort((a, b) => a.cn.localeCompare(b.cn));
        
        return {
            error: null,
            groups,
            ldapServer
        };
    } catch (error) {
        console.error('Error fetching LDAP groups:', error);
        const ldapServer = await ldapClient.getServerInfo();
        
        return {
            error: `Failed to fetch groups from LDAP: ${(error as Error).message}`,
            groups: [],
            ldapServer
        };
    }
};