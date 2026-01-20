/**
 * 安装脚本 - 自动检测 Cocos Creator 版本并配置插件
 */

const fs = require('fs');
const path = require('path');

const PLUGIN_DIR = path.resolve(__dirname, '..');

console.log('[Install] Detecting Cocos Creator version...');

/**
 * 检测版本的多种方式
 */
function detectVersion() {
    // 方式1: 检查项目目录结构
    const projectRoot = findProjectRoot();
    if (projectRoot) {
        // 检查 project.json (v2.x) 或 package.json 中的 editor 字段 (v3.x)
        const projectJsonPath = path.join(projectRoot, 'project.json');
        const packageJsonPath = path.join(projectRoot, 'package.json');

        if (fs.existsSync(projectJsonPath)) {
            const projectJson = JSON.parse(fs.readFileSync(projectJsonPath, 'utf-8'));
            if (projectJson.engine) {
                console.log('[Install] Found project.json, detecting as v2.x');
                return '2';
            }
        }

        if (fs.existsSync(packageJsonPath)) {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
            if (packageJson.creator && packageJson.creator.version) {
                const version = packageJson.creator.version;
                console.log(`[Install] Found package.json with creator version: ${version}`);
                return version.startsWith('3') ? '3' : '2';
            }
        }
    }

    // 方式2: 检查插件目录位置
    const pluginPath = PLUGIN_DIR;
    if (pluginPath.includes('packages')) {
        console.log('[Install] Plugin located in "packages" folder, detecting as v2.x');
        return '2';
    }
    if (pluginPath.includes('extensions')) {
        console.log('[Install] Plugin located in "extensions" folder, detecting as v3.x');
        return '3';
    }

    // 方式3: 环境变量 (可通过 Cocos Creator 设置)
    if (process.env.COCOS_CREATOR_VERSION) {
        const version = process.env.COCOS_CREATOR_VERSION;
        console.log(`[Install] Found environment variable COCOS_CREATOR_VERSION: ${version}`);
        return version.startsWith('3') ? '3' : '2';
    }

    // 默认使用 v3.x
    console.log('[Install] Could not detect version, defaulting to v3.x');
    return '3';
}

/**
 * 查找项目根目录
 */
function findProjectRoot() {
    let dir = PLUGIN_DIR;
    
    // 向上查找项目根目录
    for (let i = 0; i < 5; i++) {
        const parentDir = path.dirname(dir);
        
        // 检查是否存在 assets 目录
        const assetsPath = path.join(parentDir, 'assets');
        if (fs.existsSync(assetsPath) && fs.statSync(assetsPath).isDirectory()) {
            return parentDir;
        }
        
        dir = parentDir;
    }
    
    return null;
}

/**
 * 根据版本复制对应的 package.json
 */
function setupPackageJson(version) {
    const sourceFile = version === '2' ? 'package.v2.json' : 'package.v3.json';
    const sourcePath = path.join(PLUGIN_DIR, sourceFile);
    const targetPath = path.join(PLUGIN_DIR, 'package.json');
    
    if (!fs.existsSync(sourcePath)) {
        console.error(`[Install] Source file not found: ${sourcePath}`);
        return false;
    }

    // 读取版本特定的配置
    const versionConfig = JSON.parse(fs.readFileSync(sourcePath, 'utf-8'));
    
    // 读取基础 package.json（如果存在）
    let baseConfig = {};
    if (fs.existsSync(targetPath)) {
        try {
            baseConfig = JSON.parse(fs.readFileSync(targetPath, 'utf-8'));
        } catch (e) {
            // 忽略解析错误
        }
    }

    // 保留 devDependencies 和 scripts
    const finalConfig = {
        ...versionConfig,
        devDependencies: {
            ...baseConfig.devDependencies,
            ...versionConfig.devDependencies,
        },
        scripts: {
            ...baseConfig.scripts,
            ...versionConfig.scripts,
        },
    };

    // 写入最终配置
    fs.writeFileSync(targetPath, JSON.stringify(finalConfig, null, 4), 'utf-8');
    console.log(`[Install] Updated package.json for v${version}.x`);
    
    return true;
}

/**
 * 创建入口文件软链接或复制
 */
function setupEntryFiles(version) {
    const distDir = path.join(PLUGIN_DIR, 'dist');
    const versionDistDir = path.join(distDir, `v${version}`);
    
    // 确保目录存在
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
    }

    // 创建版本指示文件
    const versionFilePath = path.join(PLUGIN_DIR, '.cocos-version');
    fs.writeFileSync(versionFilePath, version, 'utf-8');
    console.log(`[Install] Created version indicator file: ${versionFilePath}`);

    return true;
}

/**
 * 主函数
 */
function main() {
    console.log('[Install] Starting installation...');
    console.log(`[Install] Plugin directory: ${PLUGIN_DIR}`);

    const version = detectVersion();
    console.log(`[Install] Detected Cocos Creator major version: ${version}`);

    setupPackageJson(version);
    setupEntryFiles(version);

    console.log('[Install] Installation completed successfully!');
    console.log(`[Install] Please run "npm run build:v${version}" to compile the plugin.`);
}

// 运行
main();
