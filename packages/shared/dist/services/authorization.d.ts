import { Authorization, TileKey, PageKey } from '../types/auth';
export declare function isTileAllowed(authz: Authorization | null | undefined, tile: TileKey): boolean;
export declare function isPageAllowed(authz: Authorization | null | undefined, tile: TileKey, page: PageKey): boolean;
export declare function isActionAllowed(authz: Authorization | null | undefined, tile: TileKey, page: PageKey, action: string): boolean;
export declare function getAllowedPages(authz: Authorization | null | undefined, tile: TileKey): Record<string, boolean>;
