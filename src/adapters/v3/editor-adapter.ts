/**
 * V3.x Editor 适配器
 */

import { CocosVersion, IEditorAdapter } from '../../core/interfaces';

declare const Editor: any;

export class EditorAdapterV3 implements IEditorAdapter {
    getVersion(): string {
        try {
            return Editor.App?.version || 'unknown';
        } catch {
            return 'unknown';
        }
    }

    getMajorVersion(): CocosVersion {
        return CocosVersion.V3;
    }

    log(message: string, ...args: any[]): void {
        console.log(`[Plugin] ${message}`, ...args);
    }

    warn(message: string, ...args: any[]): void {
        console.warn(`[Plugin] ${message}`, ...args);
    }

    error(message: string, ...args: any[]): void {
        console.error(`[Plugin] ${message}`, ...args);
    }

    getProjectPath(): string {
        return Editor.Project?.path || '';
    }

    getPackagePath(packageName: string): string {
        return Editor.Package?.getPath(packageName) || '';
    }
}
