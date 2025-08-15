export function isTileAllowed(authz, tile) {
    if (!authz)
        return false;
    const tileEntry = authz.tiles?.[tile];
    return !!tileEntry?.allowed;
}
export function isPageAllowed(authz, tile, page) {
    if (!authz)
        return false;
    const tileEntry = authz.tiles?.[tile];
    if (!tileEntry?.allowed)
        return false;
    const pageEntry = tileEntry.pages?.[page];
    return !!pageEntry?.allowed;
}
export function isActionAllowed(authz, tile, page, action) {
    if (!isPageAllowed(authz, tile, page))
        return false;
    const pageEntry = authz.tiles[tile].pages?.[page];
    return !!pageEntry?.actions?.[action];
}
export function getAllowedPages(authz, tile) {
    const result = {};
    if (!authz || !isTileAllowed(authz, tile))
        return result;
    const pages = authz.tiles?.[tile]?.pages || {};
    Object.keys(pages).forEach((k) => {
        result[k] = !!pages[k]?.allowed;
    });
    return result;
}
