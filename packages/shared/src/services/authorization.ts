import { Authorization, TileKey, PageKey } from '../types/auth';

export function isTileAllowed(authz: Authorization | null | undefined, tile: TileKey): boolean {
    if (!authz) return false;
    const tileEntry = authz.tiles?.[tile];
    return !!tileEntry?.allowed;
}

export function isPageAllowed(
    authz: Authorization | null | undefined,
    tile: TileKey,
    page: PageKey
): boolean {
    if (!authz) return false;
    const tileEntry = authz.tiles?.[tile];
    if (!tileEntry?.allowed) return false;
    const pageEntry = tileEntry.pages?.[page];
    return !!pageEntry?.allowed;
}

export function isActionAllowed(
    authz: Authorization | null | undefined,
    tile: TileKey,
    page: PageKey,
    action: string
): boolean {
    if (!isPageAllowed(authz, tile, page)) return false;
    const pageEntry = authz!.tiles![tile]!.pages?.[page as string];
    return !!pageEntry?.actions?.[action];
}

export function getAllowedPages(
    authz: Authorization | null | undefined,
    tile: TileKey
): Record<string, boolean> {
    const result: Record<string, boolean> = {};
    if (!authz || !isTileAllowed(authz, tile)) return result;
    const pages = authz.tiles?.[tile]?.pages || {};
    Object.keys(pages).forEach((k) => {
        result[k] = !!pages[k]?.allowed;
    });
    return result;
}


