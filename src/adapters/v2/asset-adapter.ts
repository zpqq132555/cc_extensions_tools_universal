/**
 * V2.x Asset 适配器
 */

import { IAssetAdapter, IAssetInfo } from '../../core/interfaces';

declare const Editor: any;

export class AssetAdapterV2 implements IAssetAdapter {
    /**
     * 将文件系统绝对路径转换为 db:// URL
     * 例如: E:\project\cc_games_v2\assets\scripts\data → db://assets/scripts/data
     * 不在 assets 目录下的路径返回 null（v2 资源数据库只管理 assets 下的文件）
     */
    private toDbUrl(fsPath: string): string | null {
        // 已经是 db:// 格式
        if (fsPath.startsWith('db://')) return fsPath;

        // 获取项目根路径
        const projectPath = Editor.Project?.path || Editor.projectPath || '';
        if (!projectPath) return null;

        // 规范化路径分隔符
        const normalizedInput = fsPath.replace(/\\/g, '/');
        const normalizedProject = projectPath.replace(/\\/g, '/');

        // 计算相对路径
        if (normalizedInput.startsWith(normalizedProject)) {
            let relativePath = normalizedInput.substring(normalizedProject.length);
            // 去掉开头的 /
            if (relativePath.startsWith('/')) relativePath = relativePath.substring(1);

            // v2 资源数据库只管理 assets/ 下的文件
            if (relativePath.startsWith('assets/') || relativePath === 'assets') {
                return `db://${relativePath}`;
            }
            // 不在 assets 下，不属于资源数据库管理范围
            return null;
        }

        return null;
    }

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
        if (!path || typeof path !== 'string') {
            console.warn('[AssetAdapterV2] refresh: invalid path, skipping');
            return;
        }
        const dbPath = this.toDbUrl(path);
        if (!dbPath) {
            // 路径不在 assets 目录下，无需刷新资源数据库
            console.log('[AssetAdapterV2] refresh: path is outside assets dir, skipping:', path);
            return;
        }
        return new Promise((resolve, reject) => {
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
