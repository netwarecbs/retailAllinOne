import { Authorization, TileKey } from '../types/auth';
export declare function getEmptyAuthz(): Authorization;
export declare function allowTile(authz: Authorization, tile: TileKey): Authorization;
export declare function allowPage(authz: Authorization, tile: TileKey, page: string, actions?: Record<string, boolean>): Authorization;
export declare function getAuthzForRole(role: string): Authorization;
