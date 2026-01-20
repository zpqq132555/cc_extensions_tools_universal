/**
 * 版本检测器 - 自动识别 Cocos Creator 版本
 */

import { CocosVersion } from './interfaces';

declare const Editor: any;

export class VersionDetector {
    private static _version: CocosVersion | null = null;
    private static _versionString: string = '';

    /**
     * 检测当前 Cocos Creator 版本
     */
    static detect(): CocosVersion {
        if (this._version !== null) {
            return this._version;
        }

        try {
            // 尝试多种方式获取版本
            this._versionString = this.getVersionString();
            this._version = this.parseVersion(this._versionString);
        } catch (error) {
            console.error('[VersionDetector] Failed to detect version:', error);
            this._version = CocosVersion.UNKNOWN;
        }

        console.log(`[VersionDetector] Detected Cocos Creator version: ${this._versionString} (${this._version})`);
        return this._version;
    }

    /**
     * 获取版本字符串
     */
    private static getVersionString(): string {
        // 方式1: Editor.App.version (v3.x)
        if (typeof Editor !== 'undefined' && Editor.App && Editor.App.version) {
            return Editor.App.version;
        }

        // 方式2: Editor.versions['creator'] (v2.x)
        if (typeof Editor !== 'undefined' && Editor.versions && Editor.versions['creator']) {
            return Editor.versions['creator'];
        }

        // 方式3: 通过 package.json 的 editor 字段推断
        // 这种方式需要在安装脚本中处理

        // 方式4: 检查 API 特征
        if (this.hasV3Features()) {
            return '3.0.0';
        }

        if (this.hasV2Features()) {
            return '2.0.0';
        }

        return 'unknown';
    }

    /**
     * 解析版本号
     */
    private static parseVersion(versionString: string): CocosVersion {
        if (!versionString || versionString === 'unknown') {
            return CocosVersion.UNKNOWN;
        }

        // 提取主版本号
        const match = versionString.match(/^(\d+)/);
        if (!match) {
            return CocosVersion.UNKNOWN;
        }

        const majorVersion = parseInt(match[1], 10);

        if (majorVersion >= 3) {
            return CocosVersion.V3;
        } else if (majorVersion === 2) {
            return CocosVersion.V2;
        }

        return CocosVersion.UNKNOWN;
    }

    /**
     * 检查是否具有 v3.x 特征
     */
    private static hasV3Features(): boolean {
        if (typeof Editor === 'undefined') {
            return false;
        }

        // v3.x 特有的 API
        const v3Features = [
            () => typeof Editor.Panel?.define === 'function',
            () => typeof Editor.Message !== 'undefined',
            () => typeof Editor.App !== 'undefined',
        ];

        return v3Features.some(check => {
            try {
                return check();
            } catch {
                return false;
            }
        });
    }

    /**
     * 检查是否具有 v2.x 特征
     */
    private static hasV2Features(): boolean {
        if (typeof Editor === 'undefined') {
            return false;
        }

        // v2.x 特有的 API
        const v2Features = [
            () => typeof Editor.Panel?.extend === 'function',
            () => typeof Editor.Ipc !== 'undefined',
            () => typeof Editor.versions !== 'undefined',
        ];

        return v2Features.some(check => {
            try {
                return check();
            } catch {
                return false;
            }
        });
    }

    /**
     * 获取完整版本字符串
     */
    static getFullVersion(): string {
        if (!this._versionString) {
            this.detect();
        }
        return this._versionString;
    }

    /**
     * 获取大版本
     */
    static getMajorVersion(): CocosVersion {
        return this.detect();
    }

    /**
     * 是否是 v2.x
     */
    static isV2(): boolean {
        return this.detect() === CocosVersion.V2;
    }

    /**
     * 是否是 v3.x
     */
    static isV3(): boolean {
        return this.detect() === CocosVersion.V3;
    }

    /**
     * 重置检测结果（用于测试）
     */
    static reset(): void {
        this._version = null;
        this._versionString = '';
    }
}

// 导出便捷函数
export const detectVersion = () => VersionDetector.detect();
export const isV2 = () => VersionDetector.isV2();
export const isV3 = () => VersionDetector.isV3();
