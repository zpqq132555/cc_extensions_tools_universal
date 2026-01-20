/**
 * V3.x Asset 适配器
 */

import { IAssetAdapter, IAssetInfo } from '../../core/interfaces';

declare const Editor: any;

export class AssetAdapterV3 implements IAssetAdapter {
    async queryAssetInfo(uuid: string): Promise<IAssetInfo | null> {
        try {
            const info = await Editor.Message.request('asset-db', 'query-asset-info', uuid);
            if (!info) {
                return null;
            }
            return {
                uuid: info.uuid,
                path: info.path || info.file,
                url: info.url,
                type: info.type,
                name: info.name || this.getNameFromPath(info.path || info.file),
            };
        } catch (error) {
            console.error('[AssetAdapterV3] queryAssetInfo error:', error);
            return null;
        }
    }

    async queryAssetByPath(path: string): Promise<IAssetInfo | null> {
        try {
            // V3.x 使用 db:// 协议
            const dbPath = path.startsWith('db://') ? path : `db://${path}`;
            const info = await Editor.Message.request('asset-db', 'query-asset-info', dbPath);
            if (!info) {
                return null;
            }
            return {
                uuid: info.uuid,
                path: info.path || info.file,
                url: info.url,
                type: info.type,
                name: info.name || this.getNameFromPath(info.path || info.file),
            };
        } catch (error) {
            console.error('[AssetAdapterV3] queryAssetByPath error:', error);
            return null;
        }
    }

    async refresh(path: string): Promise<void> {
        try {
            const dbPath = path.startsWith('db://') ? path : `db://${path}`;
            await Editor.Message.request('asset-db', 'refresh-asset', dbPath);
        } catch (error) {
            console.error('[AssetAdapterV3] refresh error:', error);
            throw error;
        }
    }

    async create(path: string, content: string): Promise<void> {
        try {
            const dbPath = path.startsWith('db://') ? path : `db://${path}`;
            await Editor.Message.request('asset-db', 'create-asset', dbPath, content);
        } catch (error) {
            console.error('[AssetAdapterV3] create error:', error);
            throw error;
        }
    }

    async delete(path: string): Promise<void> {
        try {
            const dbPath = path.startsWith('db://') ? path : `db://${path}`;
            await Editor.Message.request('asset-db', 'delete-asset', dbPath);
        } catch (error) {
            console.error('[AssetAdapterV3] delete error:', error);
            throw error;
        }
    }

    private getNameFromPath(path: string): string {
        const parts = path.split('/');
        return parts[parts.length - 1] || '';
    }
}
