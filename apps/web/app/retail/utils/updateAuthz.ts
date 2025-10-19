// Utility function to update localStorage authorization data with purchase page permissions
// This can be called manually if needed to update existing user permissions

export const updateLocalStorageAuthz = () => {
    if (typeof window === 'undefined') return false;

    try {
        const authzData = localStorage.getItem('authz_data');
        if (!authzData) {
            console.log('ℹ️ No authorization data found in localStorage');
            return false;
        }

        const authz = JSON.parse(authzData);

        // Check if retail tile exists and is allowed
        if (!authz.tiles?.retail?.allowed) {
            console.log('ℹ️ Retail tile not allowed or not found');
            return false;
        }

        // Check if purchase page already exists
        if (authz.tiles.retail.pages?.purchase) {
            console.log('ℹ️ Purchase page permissions already exist');
            return false;
        }

        // Add purchase page to retail tile
        authz.tiles.retail.pages = {
            ...authz.tiles.retail.pages,
            purchase: {
                allowed: true,
                actions: {
                    create: true,
                    update: true,
                    delete: true,
                    save: true,
                    print: true,
                    pdf: true,
                    view: true,
                    process: true,
                    manageVendors: true
                }
            }
        };

        // Update localStorage
        localStorage.setItem('authz_data', JSON.stringify(authz));
        console.log('✅ Authorization data updated with purchase page permissions');

        // Force page reload to pick up new permissions
        setTimeout(() => {
            window.location.reload();
        }, 100);

        return true;
    } catch (error) {
        console.error('❌ Error updating authorization data:', error);
        return false;
    }
};

// Auto-update on module load (for immediate effect)
if (typeof window !== 'undefined') {
    // Only run if we're in the retail section
    if (window.location.pathname.startsWith('/retail')) {
        updateLocalStorageAuthz();
    }
}
