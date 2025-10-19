export function getEmptyAuthz() {
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
            retail: {
                allowed: false,
                pages: {
                    dashboard: { allowed: false },
                    inventory: { allowed: false },
                    purchase: { allowed: false },
                    sales: { allowed: false },
                    customers: { allowed: false },
                    reports: { allowed: false },
                    pos: { allowed: false },
                },
            },
        },
    };
}
export function allowTile(authz, tile) {
    const clone = JSON.parse(JSON.stringify(authz));
    if (!clone.tiles[tile])
        return clone;
    clone.tiles[tile].allowed = true;
    return clone;
}
export function allowPage(authz, tile, page, actions) {
    const clone = JSON.parse(JSON.stringify(authz));
    if (!clone.tiles[tile])
        return clone;
    const pageEntry = clone.tiles[tile].pages[page] || { allowed: false };
    pageEntry.allowed = true;
    if (actions) {
        pageEntry.actions = { ...(pageEntry.actions || {}), ...actions };
    }
    clone.tiles[tile].pages[page] = pageEntry;
    return clone;
}
export function getAuthzForRole(role) {
    const base = getEmptyAuthz();
    switch (role.toLowerCase()) {
        case 'ceo':
        case 'admin': {
            const a1 = allowTile(base, 'garment');
            const a2 = allowTile(a1, 'pharmacy');
            const a3 = allowTile(a2, 'retail');
            const a4 = allowPage(a3, 'garment', 'dashboard');
            const a5 = allowPage(a4, 'garment', 'purchase', { create: true, save: true, print: true, pdf: true, delete: true });
            const a6 = allowPage(a5, 'garment', 'inventory', { create: true, update: true, delete: true, export: true, print: true });
            const a7 = allowPage(a6, 'garment', 'sales', { save: true, print: true, pdf: true });
            const a8 = allowPage(a7, 'garment', 'pos', { save: true, print: true });
            const a9 = allowPage(a8, 'pharmacy', 'dashboard');
            const a10 = allowPage(a9, 'retail', 'dashboard', { viewSales: true, viewInventory: true, viewCustomers: true, viewOrders: true });
            const a11 = allowPage(a10, 'retail', 'inventory', { create: true, update: true, delete: true, export: true, print: true, generateBarcode: true, manageCategories: true, manageBrands: true, stockAdjustment: true, lowStockAlert: true });
            const a11a = allowPage(a11, 'retail', 'purchase', { create: true, update: true, delete: true, save: true, print: true, pdf: true, view: true, process: true, manageVendors: true });
            const a12 = allowPage(a11a, 'retail', 'sales', { create: true, update: true, delete: true, save: true, print: true, pdf: true, hold: true, view: true, refund: true, exchange: true });
            const a13 = allowPage(a12, 'retail', 'customers', { create: true, update: true, delete: true, view: true, export: true, import: true, manageLoyalty: true, viewHistory: true });
            const a14 = allowPage(a13, 'retail', 'reports', { viewSales: true, viewInventory: true, viewCustomers: true, viewProfit: true, export: true, print: true, schedule: true, custom: true });
            const a15 = allowPage(a14, 'retail', 'pos', { create: true, save: true, print: true, pdf: true, hold: true, view: true, refund: true, exchange: true, discount: true, tax: true });
            return a15;
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
        case 'retail_manager': {
            let a = allowTile(base, 'retail');
            a = allowPage(a, 'retail', 'dashboard', { viewSales: true, viewInventory: true, viewCustomers: true, viewOrders: true });
            a = allowPage(a, 'retail', 'inventory', { create: true, update: true, delete: true, export: true, print: true, generateBarcode: true, manageCategories: true, manageBrands: true, stockAdjustment: true, lowStockAlert: true });
            a = allowPage(a, 'retail', 'purchase', { create: true, update: true, delete: true, save: true, print: true, pdf: true, view: true, process: true, manageVendors: true });
            a = allowPage(a, 'retail', 'sales', { create: true, update: true, delete: true, save: true, print: true, pdf: true, hold: true, view: true, refund: true, exchange: true });
            a = allowPage(a, 'retail', 'customers', { create: true, update: true, delete: true, view: true, export: true, import: true, manageLoyalty: true, viewHistory: true });
            a = allowPage(a, 'retail', 'reports', { viewSales: true, viewInventory: true, viewCustomers: true, viewProfit: true, export: true, print: true, schedule: true, custom: true });
            a = allowPage(a, 'retail', 'pos', { create: true, save: true, print: true, pdf: true, hold: true, view: true, refund: true, exchange: true, discount: true, tax: true });
            return a;
        }
        case 'retail_cashier': {
            let a = allowTile(base, 'retail');
            a = allowPage(a, 'retail', 'dashboard', { viewSales: true, viewInventory: true, viewCustomers: true, viewOrders: true });
            a = allowPage(a, 'retail', 'sales', { create: true, save: true, print: true, pdf: true, hold: true, view: true, refund: true, exchange: true });
            a = allowPage(a, 'retail', 'pos', { create: true, save: true, print: true, pdf: true, hold: true, view: true, refund: true, exchange: true, discount: true, tax: true });
            return a;
        }
        default:
            return base;
    }
}
