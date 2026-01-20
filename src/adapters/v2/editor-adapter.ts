/**
 * V2.x Editor 适配器
 */

import { CocosVersion, IEditorAdapter } from '../../core/interfaces';

declare const Editor: any;

export class EditorAdapterV2 implements IEditorAdapter {
    getVersion(): string {
        try {
            return Editor.versions?.creator || 'unknown';
        } catch {
            return 'unknown';
        }
    }

    getMajorVersion(): CocosVersion {
        return CocosVersion.V2;
    }

    log(message: string, ...args: any[]): void {
        Editor.log(`[Plugin] ${message}`, ...args);
    }

    warn(message: string, ...args: any[]): void {
        Editor.warn(`[Plugin] ${message}`, ...args);
    }

    error(message: string, ...args: any[]): void {
        Editor.error(`[Plugin] ${message}`, ...args);
    }

    getProjectPath(): string {
        return Editor.Project?.path || Editor.projectPath || '';
    }

    getPackagePath(packageName: string): string {
        return Editor.url(`packages://${packageName}/`);
    }
}
