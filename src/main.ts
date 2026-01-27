/**
 * 插件主入口文件
 * 这是一个兼容 v2.x 和 v3.x 的入口
 */

import path from 'path';
import { BundlePath } from './business/BundlePath';
import { BasePlugin, createPluginMain, MessageMethod } from './index';
import { Tools } from './tools/Tools';

/**
 * 主插件类
 */
class ExtensionsToolsPlugin extends BasePlugin {
    private pluginName: string;

    constructor() {
        super();
        this.pluginName = 'extensions_tools';
    }

    load(): void {
        this.log(`${this.pluginName} loaded successfully!`);
        this.log(`Cocos Creator Version: ${this.editor.getVersion()}`);
        this.log(`Running in ${this.isV2 ? 'v2.x' : 'v3.x'} mode`);
        this.syncExtensionScripts();
    }

    unload(): void {
        this.log(`${this.pluginName} unloaded.`);
    }

    /**
     * 同步扩展脚本（双向同步）
     * 
     * V3 版本：通过 package.v3.json 的 asset-db.mount 配置自动挂载
     * V2 版本：手动将插件 assets 目录与项目的 extensionScripts 目录双向同步
     */
    private syncExtensionScripts(): void {
        // V3 版本通过 asset-db.mount 自动挂载，无需手动同步
        if (!this.isV2) return;

        const pluginAssetsPath = path.join(this.editor.getPackagePath(this.pluginName), "assets");
        const projectScriptsPath = path.join(this.editor.getProjectPath(), "assets", "extensionScripts");

        // 使用通用双向同步工具
        const result = Tools.BidirectionalSync(pluginAssetsPath, projectScriptsPath, {
            ignorePatterns: ['.meta', '.git', '.DS_Store'],
            deletePatterns: ['.meta'],
            preferDir: 'auto',
            onLog: (msg) => this.log(msg),
            onWarn: (msg) => this.warn(msg),
            onError: (msg) => this.error(msg)
        });

        // 如果同步到项目，刷新资源数据库
        if (result.synced && result.direction === 'A_to_B') {
            this.asset.refresh("db://assets/extensionScripts").catch(err => {
                this.warn("Failed to refresh asset database: " + err);
            });
        }

        // 如果同步到插件，提示用户提交 git
        if (result.synced && result.direction === 'B_to_A') {
            this.log("You can now commit the changes to the git submodule.");
        }
    }

    // ==================== 业务逻辑 ====================
    /** 生成 Bundle 路径映射 */
    @MessageMethod
    private bundlePath(): void {
        BundlePath.run();
    }
    /* // V2.x 消息处理器
    messages = {
        'open': () => this.handleOpen(),
        'say-hello': () => this.handleSayHello(),
        'clicked': () => this.handleClicked(),
    };
 
    // V3.x 方法处理器
    methods = {
        openPanel: () => this.handleOpen(),
        sayHello: () => this.handleSayHello(),
        clicked: () => this.handleClicked(),
    };
    private handleOpen(): void {
        this.log('Opening panel...');
        this.openPanel(this.pluginName);
    }
 
    private handleSayHello(): void {
        this.log('Hello from Extensions Tools!');
 
        // 发送消息到面板
        if (this.isV2) {
            this.sendToPanel(this.pluginName, `${this.pluginName}:hello`);
        } else {
            // V3.x 使用 methods
            this.sendToPanel(`${this.pluginName}.default`, 'hello');
        }
    }
 
    private handleClicked(): void {
        this.log('Panel button clicked!');
    } */
}

// 创建插件实例
const plugin = new ExtensionsToolsPlugin();
const exportedModule = createPluginMain(plugin);

// CommonJS 导出 (v2.x)
module.exports = exportedModule;

// ES Module 导出 (v3.x)
export const load = exportedModule.load;
export const unload = exportedModule.unload;
export const methods = exportedModule.methods;
