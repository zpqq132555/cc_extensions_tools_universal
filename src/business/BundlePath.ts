import fs from "fs";
import path from "path";
import { getAsset, getEditor, isV2 } from "..";

/**
 * @author OldPoint
 * @date 2026-01-21 12:25
 * @filePath packages\extensions_tools_universal\src\business\BundlePath.ts
 * @description 生成bundle路径映射
 */
export class BundlePath {

    /* 单例 */
    private static _instance: BundlePath = new BundlePath()
    private constructor() { }

    private readonly logTitle = "[BundleAssetTool]";
    private bundleArr: Array<string> = [];
    private bundleObj: Record<string, any> = {};
    private editor = getEditor();

    public static run(): void {
        this._instance.findModuleType();
    }
    private findModuleType(): void {
        this.bundleArr = [];
        this.bundleObj = {};
        this.editor.log(this.logTitle, '开始生成bundlePath--------');
        this.editor.log(this.logTitle, "开始扫描bundle...");

        // 确定要扫描的bundle路径
        let bundleScanPath: string = path.join(this.editor.getProjectPath(), 'assets');

        this.editor.log(this.logTitle, "扫描路径:", bundleScanPath);
        // 扫描所有bundle
        this.scanAllBundles(bundleScanPath);

        this.editor.log(this.logTitle, "扫描完成，发现的bundle:", this.bundleArr);

        this.writeFile();

        // 输出统计信息
        for (const bundleName of Object.keys(this.bundleObj)) {
            if (this.bundleArr.includes(bundleName)) {
                const bundle = this.bundleObj[bundleName];
                const fileCount = this.countFiles(bundle);
                this.editor.log(this.logTitle, `Bundle "${bundleName}": ${fileCount} 个文件`);
            }
        }
        this.editor.log(this.logTitle, '生成bundlePath结束--------');
    }

    /**
     * 统计对象中的文件数量
     * @param obj 要统计的对象
     * @returns 文件数量
     */
    private countFiles(obj: any): number {
        let count = 0;

        for (const key of Object.keys(obj)) {
            const value = obj[key];
            if (typeof value === 'string') {
                // 这是一个文件路径
                count++;
            } else if (typeof value === 'object') {
                // 这是一个目录，递归统计
                count += this.countFiles(value);
            }
        }

        return count;
    }

    /** 写入文件 */
    private writeFile(): void {
        // 生成配置字符串
        let bundleStr = "";
        this.bundleArr.forEach(bundleName => {
            if (bundleName != "resources") {
                bundleStr += `\n    "${bundleName.toUpperCase()}" = "${bundleName}",`;
            }
        });
        const newString = `/** 插件自动生成,请勿修改 */
export enum BundleName {${bundleStr}
}
/** 资源映射,插件自动生成,请勿修改 */
export const AssetPath = ${JSON.stringify(this.bundleObj, null, 4)}`;
        
        getAsset().create('assets/scripts/BundleAssetsConfig.ts', newString);

        this.editor.log(this.logTitle, "生成路径映射成功");
    }

    /**
     * 扫描所有bundle目录
     * @param bundlePath bundle根目录
     * @returns 所有bundle的层级结构
     */
    private scanAllBundles(bundlePath: string): void {
        this.scanDirectory(bundlePath);
    }

    /**
     * 递归扫描目录，只处理bundle
     * @param dirPath 要扫描的目录路径
     * @returns bundle结构对象
     */
    private scanDirectory(dirPath: string): void {
        try {
            const files = fs.readdirSync(dirPath, 'utf-8');

            // 过滤掉不需要的文件
            const validFiles = files.filter(file => this.checkName(file));

            for (const file of validFiles) {
                const fullPath = path.join(dirPath, file);
                const stat = fs.statSync(fullPath);
                const fileName = file.split('.')[0]; // 去掉扩展名

                if (stat.isDirectory()) {
                    // 检查是否为bundle
                    if (this.isBundle(fullPath)) {
                        // 如果是bundle，直接获取其下所有资源路径
                        const bundleResources = this.scanBundleResources(fullPath, fileName);
                        if (bundleResources && Object.keys(bundleResources).length > 0) {
                            this.bundleObj[fileName] = bundleResources;
                        }
                        this.bundleArr.push(fileName);
                    } else {
                        // 如果不是bundle，递归扫描其下可能存在的bundle
                        this.scanDirectory(fullPath);
                    }
                }
                // 不是bundle的文件不需要扫描
            }
        } catch (error) {
            this.editor.error(this.logTitle, `扫描目录失败: ${dirPath}`, error);
        }
    }

    /**
     * 扫描bundle下的所有资源（bundle下的子目录不会是bundle）
     * @param bundlePath bundle目录路径
     * @param bundleName bundle名称
     * @param relativePath 当前相对路径（用于递归）
     * @returns bundle资源结构
     */
    private scanBundleResources(bundlePath: string, bundleName: string, relativePath: string = ""): Record<string, any> {
        const result: Record<string, any> = {};

        try {
            const files = fs.readdirSync(bundlePath, 'utf-8');
            const validFiles = files.filter(file => this.checkName(file));

            for (const file of validFiles) {
                const fullPath = path.join(bundlePath, file);
                const stat = fs.statSync(fullPath);
                const fileName = file.split('.')[0];

                if (stat.isDirectory()) {
                    // bundle下的子目录不会是bundle，直接递归获取资源
                    const newRelativePath = relativePath ? `${relativePath}/${fileName}` : fileName;
                    const subResult = this.scanBundleResources(fullPath, fileName, newRelativePath);
                    if (subResult && Object.keys(subResult).length > 0) {
                        result[fileName] = subResult;
                    }
                } else if (fileName != "") {
                    // 文件记录相对路径，不包含bundle名称
                    const filePath = relativePath ? `${relativePath}/${fileName}` : fileName;
                    result[fileName] = filePath;
                }
            }
        } catch (error) {
            this.editor.error(this.logTitle, `扫描bundle资源失败: ${bundlePath}`, error);
        }

        return result;
    }

    /**
     * 检查目录是否为bundle
     * @param dirPath 目录路径
     * @returns 是否为bundle
     */
    private isBundle(dirPath: string): boolean {
        try {
            const metaPath = dirPath + '.meta';
            if (fs.existsSync(metaPath)) {
                const metaContent = fs.readFileSync(metaPath, 'utf-8');
                // 解析JSON格式的meta文件
                const metaData = JSON.parse(metaContent);
                if (isV2()) {
                    return metaData.isBundle === true;
                }
                return metaData.userData && metaData.userData.isBundle === true;
            }
        } catch (error) {
            this.editor.error(this.logTitle, `读取meta文件失败: ${dirPath}.meta`, error);
        }
        return false;
    }

    private checkName(name: string): boolean {
        //名字前不带$号 且 不为.meta结尾
        if (name.endsWith(".meta") || name.substring(0, 1) == "$") {
            return false;
        } else {
            return true;
        }
    }
}