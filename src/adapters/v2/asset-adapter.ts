/**
 * V2.x Asset 适配器
 */

import { IAssetAdapter, IAssetInfo } from '../../core/interfaces';

declare const Editor: any;

export class AssetAdapterV2 implements IAssetAdapter {
    async queryAssetInfo(uuid: string): Promise<IAssetInfo | null> {
        return new Promise((resolve) => {
            Editor.assetdb.queryInfoByUuid(uuid, (error: any, info: any) => {
                if (error || !info) {
                    resolve(null);
                    return;
                }
                resolve({
                    uuid: info.uuid,
                    path: info.path,
                    url: info.url,
                    type: info.type,
                    name: info.name || this.getNameFromPath(info.path),
                });
            });
        });
    }

    async queryAssetByPath(path: string): Promise<IAssetInfo | null> {
        return new Promise((resolve) => {
            const dbPath = path.startsWith('db://') ? path : `db://${path}`;
            Editor.assetdb.queryAssets(dbPath, null, (error: any, results: any[]) => {
                if (error || !results || results.length === 0) {
                    resolve(null);
                    return;
                }
                const info = results[0];
                resolve({
                    uuid: info.uuid,
                    path: info.path,
                    url: info.url,
                    type: info.type,
                    name: info.name || this.getNameFromPath(info.path),
                });
            });
        });
    }

    async refresh(path: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const dbPath = path.startsWith('db://') ? path : `db://${path}`;
            Editor.assetdb.refresh(dbPath, (error: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    async create(path: string, content: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const dbPath = path.startsWith('db://') ? path : `db://${path}`;
            Editor.assetdb.create(dbPath, content, (error: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    async delete(path: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const dbPath = path.startsWith('db://') ? path : `db://${path}`;
            Editor.assetdb.delete(dbPath, (error: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    private getNameFromPath(path: string): string {
        const parts = path.split('/');
        return parts[parts.length - 1] || '';
    }
}
