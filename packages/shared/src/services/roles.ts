import { Authorization, AuthorizationPage, TileKey } from '../types/auth';

export function getEmptyAuthz(): Authorization {
    return {
        version: 1,
        tiles: {
            garment: {
                allowed: false,
                pages: {
                    dashboard: { allowed: false },
                    purchase: { allowed: false },
                    inventory: { allowed: false },
                    sales: { allowed: false },
                    pos: { allowed: false },
                },
            },
            pharmacy: {
                allowed: false,
                pages: {
                    dashboard: { allowed: false },
                },
            },
        },
    };
}

export function allowTile(authz: Authorization, tile: TileKey): Authorization {
    const clone: Authorization = JSON.parse(JSON.stringify(authz));
    if (!clone.tiles[tile]) return clone;
    clone.tiles[tile]!.allowed = true;
    return clone;
}

export function allowPage(
    authz: Authorization,
    tile: TileKey,
    page: string,
    actions?: Record<string, boolean>
): Authorization {
    const clone: Authorization = JSON.parse(JSON.stringify(authz));
    if (!clone.tiles[tile]) return clone;
    const pageEntry: AuthorizationPage = clone.tiles[tile]!.pages[page] || { allowed: false };
    pageEntry.allowed = true;
    if (actions) {
        pageEntry.actions = { ...(pageEntry.actions || {}), ...actions };
    }
    clone.tiles[tile]!.pages[page] = pageEntry;
    return clone;
}

export function getAuthzForRole(role: string): Authorization {
    const base = getEmptyAuthz();
    switch (role.toLowerCase()) {
        case 'ceo':
        case 'admin': {
            const a1 = allowTile(base, 'garment');
            const a2 = allowTile(a1, 'pharmacy');
            const a3 = allowPage(a2, 'garment', 'dashboard');
            const a4 = allowPage(a3, 'garment', 'purchase', { create: true, save: true, print: true, pdf: true, delete: true });
            const a5 = allowPage(a4, 'garment', 'inventory', { create: true, update: true, delete: true, export: true, print: true });
            const a6 = allowPage(a5, 'garment', 'sales', { save: true, print: true, pdf: true });
            const a7 = allowPage(a6, 'garment', 'pos', { save: true, print: true });
            const a8 = allowPage(a7, 'pharmacy', 'dashboard');
            return a8;
        }
        case 'garment_manager': {
            let a = allowTile(base, 'garment');
            a = allowPage(a, 'garment', 'dashboard');
            a = allowPage(a, 'garment', 'purchase', { create: true, save: true, print: true, pdf: true });
            a = allowPage(a, 'garment', 'inventory', { create: true, update: true, export: true });
            a = allowPage(a, 'garment', 'sales', { save: true, print: true, pdf: true });
            a = allowPage(a, 'garment', 'pos');
            return a;
        }
        case 'cashier': {
            let a = allowTile(base, 'garment');
            a = allowPage(a, 'garment', 'dashboard');
            a = allowPage(a, 'garment', 'sales', { save: true, print: true });
            a = allowPage(a, 'garment', 'pos', { save: true, print: true });
            return a;
        }
        case 'pharmacist': {
            let a = allowTile(base, 'pharmacy');
            a = allowPage(a, 'pharmacy', 'dashboard');
            return a;
        }
        default:
            return base;
    }
}


