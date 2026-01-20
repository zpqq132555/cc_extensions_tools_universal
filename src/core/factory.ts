/**
 * 工厂模式 - 根据版本创建对应的适配器
 */

import {
    CocosVersion,
    IAdapterManager,
    IAssetAdapter,
    IEditorAdapter,
    IIPCAdapter,
    IPanelAdapter,
    ISceneAdapter
} from './interfaces';
import { VersionDetector } from './version-detector';

// 适配器将在运行时动态加载
let v2Adapters: any = null;
let v3Adapters: any = null;

/**
 * 适配器工厂类
 */
export class AdapterFactory {
    private static _instance: IAdapterManager | null = null;

    /**
     * 获取适配器管理器单例
     */
    static getInstance(): IAdapterManager {
        if (!this._instance) {
            this._instance = this.createAdapterManager();
        }
        return this._instance;
    }

    /**
     * 创建适配器管理器
     */
    private static createAdapterManager(): IAdapterManager {
        const version = VersionDetector.detect();

        switch (version) {
            case CocosVersion.V2:
                return this.createV2Adapters();
            case CocosVersion.V3:
                return this.createV3Adapters();
            default:
                throw new Error(`[AdapterFactory] Unsupported Cocos Creator version: ${version}`);
        }
    }

    /**
     * 创建 v2.x 适配器集合
     */
    private static createV2Adapters(): IAdapterManager {
        if (!v2Adapters) {
            // 动态加载 v2 适配器
            v2Adapters = {
                EditorAdapter: require('../adapters/v2/editor-adapter').EditorAdapterV2,
                PanelAdapter: require('../adapters/v2/panel-adapter').PanelAdapterV2,
                IPCAdapter: require('../adapters/v2/ipc-adapter').IPCAdapterV2,
                AssetAdapter: require('../adapters/v2/asset-adapter').AssetAdapterV2,
                SceneAdapter: require('../adapters/v2/scene-adapter').SceneAdapterV2,
            };
        }

        return {
            version: CocosVersion.V2,
            editor: new v2Adapters.EditorAdapter(),
            panel: new v2Adapters.PanelAdapter(),
            ipc: new v2Adapters.IPCAdapter(),
            asset: new v2Adapters.AssetAdapter(),
            scene: new v2Adapters.SceneAdapter(),
        };
    }

    /**
     * 创建 v3.x 适配器集合
     */
    private static createV3Adapters(): IAdapterManager {
        if (!v3Adapters) {
            // 动态加载 v3 适配器
            v3Adapters = {
                EditorAdapter: require('../adapters/v3/editor-adapter').EditorAdapterV3,
                PanelAdapter: require('../adapters/v3/panel-adapter').PanelAdapterV3,
                IPCAdapter: require('../adapters/v3/ipc-adapter').IPCAdapterV3,
                AssetAdapter: require('../adapters/v3/asset-adapter').AssetAdapterV3,
                SceneAdapter: require('../adapters/v3/scene-adapter').SceneAdapterV3,
            };
        }

        return {
            version: CocosVersion.V3,
            editor: new v3Adapters.EditorAdapter(),
            panel: new v3Adapters.PanelAdapter(),
            ipc: new v3Adapters.IPCAdapter(),
            asset: new v3Adapters.AssetAdapter(),
            scene: new v3Adapters.SceneAdapter(),
        };
    }

    /**
     * 创建特定类型的适配器
     */
    static createEditor(): IEditorAdapter {
        return this.getInstance().editor;
    }

    static createPanel(): IPanelAdapter {
        return this.getInstance().panel;
    }

    static createIPC(): IIPCAdapter {
        return this.getInstance().ipc;
    }

    static createAsset(): IAssetAdapter {
        return this.getInstance().asset;
    }

    static createScene(): ISceneAdapter {
        return this.getInstance().scene;
    }

    /**
     * 重置工厂（用于测试）
     */
    static reset(): void {
        this._instance = null;
        v2Adapters = null;
        v3Adapters = null;
    }
}

// 导出便捷访问器
export const getAdapter = () => AdapterFactory.getInstance();
export const getEditor = () => AdapterFactory.createEditor();
export const getPanel = () => AdapterFactory.createPanel();
export const getIPC = () => AdapterFactory.createIPC();
export const getAsset = () => AdapterFactory.createAsset();
export const getScene = () => AdapterFactory.createScene();
