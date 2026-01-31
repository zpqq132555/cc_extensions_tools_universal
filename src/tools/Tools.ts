import * as child_process from 'child_process';
import * as fs from "fs";
import * as path from "path";
import * as readline from 'readline';

type ExtType = "json" | "js" | "xlsx" | "";

/**
 * @author OldP
 * @data 2025-09-10 08:54
 * @filePath src\tools\Tools.ts
 * @description 常用工具类
 */
export class Tools {
    /**
     * 拷贝文件（同步方法）
     * @param srcFile 源文件路径
     * @param destFile 目标文件路径
     * @returns 
     */
    public static CopyFileSync(srcFile: string, destFile: string): void {
        srcFile = path.resolve(srcFile);
        destFile = path.resolve(destFile);
        if (!fs.existsSync(srcFile) || !fs.statSync(srcFile).isFile()) {
            console.error(`Source file does not exist or is not a file: ${srcFile}`);
            return;
        }
        fs.copyFileSync(srcFile, destFile);
    }
    /**
     * 拷贝文件夹内容到目标文件夹（同步方法）
     * @param srcDir 源文件夹
     * @param destDir 目标文件夹
     */
    public static CopyDirSync(srcDir: string, destDir: string, isShowLog: boolean = false): void {
        srcDir = path.resolve(srcDir);
        destDir = path.resolve(destDir);
        if (!fs.existsSync(srcDir) || !fs.statSync(srcDir).isDirectory()) {
            console.error(`Source directory does not exist or is not a directory: ${srcDir}`);
            return;
        }
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }
        const items = fs.readdirSync(srcDir);
        for (const item of items) {
            const srcPath = path.join(srcDir, item);
            const destPath = path.join(destDir, item);
            if (fs.statSync(srcPath).isDirectory()) {
                this.CopyDirSync(srcPath, destPath, isShowLog);
            } else {
                // 比对两个文件的内容，相同则跳过
                const srcContent = fs.readFileSync(srcPath);
                if (fs.existsSync(destPath)) {
                    const destContent = fs.readFileSync(destPath);
                    if (srcContent.equals(destContent)) {
                        if (isShowLog) {
                            console.log(`Skipping identical file: ${srcPath}`);
                        }
                        continue;
                    }
                }
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }
    /**
     * 同步写入文件，支持递归创建目录
     * @param file 文件路径
     * @param data 文件内容
     * @param options 写入选项
     * @param recursive 是否递归创建目录
     */
    public static WriteFileSync(file: string, data: string | NodeJS.ArrayBufferView, options?: fs.WriteFileOptions, recursive: boolean = true): void {
        try {
            const outputPath = path.dirname(file);
            if (recursive && !fs.existsSync(outputPath)) {
                fs.mkdirSync(outputPath, { recursive: true });
            }
            fs.writeFileSync(file, data, options);
            // console.log(`File written successfully to ${file}`);
        } catch (error) {
            console.error(`Error writing file ${file}:`, error);
        }
    }

    /**
     * 弹出界面选择文件夹，并进行基本校验
     * @param defaultPath 默认打开的文件夹路径
     * @returns 选中的文件夹路径；若取消或无效则返回空字符串
     */
    public static async OpenInterfaceSelectFolder(defaultPath?: string): Promise<string> {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        while (true) {
            const folderPath = await this.SelectFolder(defaultPath);
            if (!folderPath) {
                console.log('No folder selected. Exiting...');
                break;
            }
            if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
                console.log('Folder does not exist or is not a directory. Please try again.');
                continue;
            }
            rl.close();
            return folderPath;
        }
        rl.close();
        return "";
    }
    /** 选择文件夹（Windows，仅在支持 Windows.Forms 的环境下可用） */
    private static SelectFolder(defaultPath?: string): Promise<string> {
        return new Promise((resolve) => {
            const tempFile = 'temp_selected_folder.txt';
            const initialDir = defaultPath && fs.existsSync(defaultPath) ? defaultPath : path.join(__dirname, '..', '..');
            const psCommand = `Add-Type -AssemblyName System.Windows.Forms; $fbd = New-Object System.Windows.Forms.FolderBrowserDialog; $fbd.Description = 'Select a folder'; ${initialDir ? `$fbd.SelectedPath = '${initialDir}';` : ''} $null = $fbd.ShowDialog(); $fbd.SelectedPath | Out-File -FilePath '${tempFile}' -Encoding UTF8`;
            const ps = child_process.spawn('powershell', [
                '-Command',
                psCommand
            ]);

            ps.on('close', (code) => {
                if (code !== 0) {
                    console.error('Error opening folder dialog');
                    resolve('');
                    return;
                }

                fs.readFile(tempFile, 'utf8', (err, data) => {
                    fs.unlink(tempFile, () => { });
                    if (err) {
                        console.error('Error reading selected folder:', err);
                        resolve('');
                        return;
                    }
                    resolve(data.trim());
                });
            });
        });
    }
    /**
     * 选择文件（Windows，仅在支持 Windows.Forms 的环境下可用）
     * @param extname 指定文件后缀名，默认为空字符串表示不限制
     * @param defaultPath 默认打开的文件夹路径
     * @returns 选中的文件路径；若取消或无效则返回空字符串
     */
    public static async OpenInterfaceSelectFile(extname: ExtType = "", defaultPath?: string): Promise<string> {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        while (true) {
            const filePath = await this.SelectFile(extname, defaultPath);
            if (!filePath) {
                console.log('No file selected. Exiting...');
                break;
            }

            if (!fs.existsSync(filePath)) {
                console.log('File does not exist. Please try again.');
                continue;
            }
            if (extname !== "" && !filePath.endsWith(extname)) {
                console.log(`Please select a ${extname} file.`);
                continue;
            }
            rl.close();
            return filePath;
        }
        rl.close();
        return "";
    }
    /** 选择文件（Windows，仅在支持 Windows.Forms 的环境下可用） */
    private static SelectFile(extname: ExtType, defaultPath?: string): Promise<string> {
        return new Promise((resolve) => {
            const tempFile = 'temp_selected_file.txt';
            const initialDir = defaultPath && fs.existsSync(defaultPath) ? defaultPath : '';
            const filterText = extname ? `${extname.toUpperCase()} Files (*.${extname})|*.${extname}` : 'All Files (*.*)|*.*';
            const psCommand = `Add-Type -AssemblyName System.Windows.Forms; $FileBrowser = New-Object System.Windows.Forms.OpenFileDialog; $FileBrowser.Filter = '${filterText}'; $FileBrowser.Title = 'Select File'; ${initialDir ? `$FileBrowser.InitialDirectory = '${initialDir}';` : ''} $FileBrowser.ShowDialog() | Out-Null; $FileBrowser.FileName | Out-File -FilePath '${tempFile}' -Encoding UTF8`;
            const ps = child_process.spawn('powershell', [
                '-Command',
                psCommand
            ]);

            ps.on('close', (code) => {
                if (code !== 0) {
                    console.error('Error opening file dialog');
                    resolve('');
                    return;
                }

                fs.readFile(tempFile, 'utf8', (err, data) => {
                    fs.unlink(tempFile, () => { });

                    if (err) {
                        console.error('Error reading selected file:', err);
                        resolve('');
                        return;
                    }

                    resolve(data.trim());
                });
            });
        });
    }

    /**
     * 读取指定目录下的所有文件
     * @param dirPath 目录路径
     * @param callback 处理每个文件的回调函数，接收文件路径和文件名作为参数
     * @returns Promise<void>
     */
    public static ReadDir(dirPath: string, callback: (filePath: string, fileName: string) => void): void {
        const files = fs.readdirSync(dirPath);
        let curPath = '';
        for (let i = 0; i < files.length; i++) {
            const element = files[i];
            curPath = path.join(dirPath, element);
            if (fs.lstatSync(curPath).isDirectory()) {
                this.ReadDir(curPath, callback);
            } else {
                callback(dirPath, element);
            }
        }
    }

    // /**
    //  * 遍历xlsx工作表
    //  * @param sheet xlsx工作表
    //  * @param callback 回调函数
    //  */
    // public static traverseSheet<T = string | number | boolean | Date | null>(sheet: xlsx.WorkSheet, callback: (value: T, column: string, row: number) => void): void {
    //     // 直接遍历实际存在的单元格，而不是整块范围，效率更高
    //     Object.keys(sheet)
    //         .filter((addr) => addr[0] !== "!") // 排除 '!ref' 等元信息
    //         .forEach((addr) => {
    //             const cell = sheet[addr];
    //             if (cell) {
    //                 const [col, row] = addr.match(/[A-Z]+|[0-9]+/g) || [];
    //                 callback(cell.v as T, col || "", Number(row));
    //             }
    //         });
    // }

    /** 判断两个数组内容是否相等 */
    public static ArraysEqual<T>(arr1: Array<T>, arr2: Array<T>): boolean {
        if (arr1.length !== arr2.length) return false;
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
        return true;
    }

    /**
     * 递归获取目录的最新修改时间
     * @param dirPath 目录路径
     * @param ignorePatterns 忽略的文件/文件夹模式（如 ['.meta', '.git']）
     * @returns 最新修改时间戳（毫秒），目录不存在返回 0
     */
    public static GetDirectoryModifyTime(dirPath: string, ignorePatterns: string[] = ['.meta', '.git', '.DS_Store']): number {
        if (!fs.existsSync(dirPath)) return 0;

        let latestTime = 0;

        const processDir = (dir: string) => {
            try {
                const stat = fs.statSync(dir);
                if (stat.mtimeMs > latestTime) {
                    latestTime = stat.mtimeMs;
                }

                if (stat.isDirectory()) {
                    const items = fs.readdirSync(dir);
                    for (const item of items) {
                        // 检查是否匹配忽略模式
                        const shouldIgnore = ignorePatterns.some(pattern => {
                            if (pattern.startsWith('.')) {
                                // 后缀匹配或前缀匹配
                                return item.endsWith(pattern) || item.startsWith(pattern);
                            }
                            return item === pattern;
                        });
                        if (shouldIgnore) continue;

                        const fullPath = path.join(dir, item);
                        try {
                            const fileStat = fs.statSync(fullPath);
                            if (fileStat.mtimeMs > latestTime) {
                                latestTime = fileStat.mtimeMs;
                            }
                            if (fileStat.isDirectory()) {
                                processDir(fullPath);
                            }
                        } catch (e) {
                            // 忽略
                        }
                    }
                }
            } catch (e) {
                // 忽略
            }
        };

        processDir(dirPath);
        return latestTime;
    }

    /**
     * 删除目录下匹配指定模式的文件
     * @param dirPath 目录路径
     * @param patterns 要删除的文件模式（如 ['.meta']）
     */
    public static DeleteFilesByPattern(dirPath: string, patterns: string[]): void {
        if (!fs.existsSync(dirPath)) return;

        const filesToDelete: string[] = [];
        this.ReadDir(dirPath, (filePath: string, fileName: string) => {
            const shouldDelete = patterns.some(pattern => {
                if (pattern.startsWith('.')) {
                    return fileName.endsWith(pattern);
                }
                return fileName === pattern;
            });
            if (shouldDelete) {
                filesToDelete.push(path.join(filePath, fileName));
            }
        });

        for (const file of filesToDelete) {
            try {
                fs.unlinkSync(file);
            } catch (e) {
                // 忽略删除失败
            }
        }
    }

    /**
     * 双向同步两个目录
     * 根据修改时间自动判断同步方向，将较新的目录内容同步到较旧的目录
     * 
     * @param dirA 目录 A 路径
     * @param dirB 目录 B 路径
     * @param options 同步选项
     * @returns 同步结果
     */
    public static BidirectionalSync(
        dirA: string,
        dirB: string,
        options: IBidirectionalSyncOptions = {}
    ): IBidirectionalSyncResult {
        const {
            ignorePatterns = ['.meta', '.git', '.DS_Store'],
            deletePatterns = ['.meta'],
            preferDir = 'auto',
            onLog = console.log,
            onWarn = console.warn,
            onError = console.error
        } = options;

        const result: IBidirectionalSyncResult = {
            synced: false,
            direction: 'none',
            sourceDir: '',
            targetDir: '',
            message: ''
        };

        // 检查目录 A 是否存在
        const dirAExists = fs.existsSync(dirA);
        const dirBExists = fs.existsSync(dirB);

        if (!dirAExists && !dirBExists) {
            result.message = "Both directories do not exist.";
            onWarn(result.message);
            return result;
        }

        // 获取两个目录的修改时间
        const timeA = dirAExists ? this.GetDirectoryModifyTime(dirA, ignorePatterns) : 0;
        const timeB = dirBExists ? this.GetDirectoryModifyTime(dirB, ignorePatterns) : 0;

        // 判断同步方向
        let sourceDir: string;
        let targetDir: string;
        let direction: 'A_to_B' | 'B_to_A' | 'none';

        if (!dirAExists) {
            // A 不存在，从 B 同步到 A
            sourceDir = dirB;
            targetDir = dirA;
            direction = 'B_to_A';
            result.message = `Directory A not found, syncing from B to A...`;
        } else if (!dirBExists) {
            // B 不存在，从 A 同步到 B
            sourceDir = dirA;
            targetDir = dirB;
            direction = 'A_to_B';
            result.message = `Directory B not found, syncing from A to B...`;
        } else if (preferDir === 'A') {
            // 强制使用 A
            sourceDir = dirA;
            targetDir = dirB;
            direction = 'A_to_B';
            result.message = `Forced sync from A to B...`;
        } else if (preferDir === 'B') {
            // 强制使用 B
            sourceDir = dirB;
            targetDir = dirA;
            direction = 'B_to_A';
            result.message = `Forced sync from B to A...`;
        } else if (timeA > timeB) {
            // A 更新，从 A 同步到 B
            sourceDir = dirA;
            targetDir = dirB;
            direction = 'A_to_B';
            result.message = `Directory A is newer, syncing to B...`;
        } else if (timeB > timeA) {
            // B 更新，从 B 同步到 A
            sourceDir = dirB;
            targetDir = dirA;
            direction = 'B_to_A';
            result.message = `Directory B is newer, syncing to A...`;
        } else {
            // 时间相同，无需同步
            result.message = "Directories are up to date.";
            result.direction = 'none';
            onLog(result.message);
            return result;
        }

        onLog(result.message);

        try {
            // 执行同步
            this.CopyDirSync(sourceDir, targetDir);

            // 删除指定模式的文件
            if (deletePatterns.length > 0) {
                this.DeleteFilesByPattern(targetDir, deletePatterns);
            }

            result.synced = true;
            result.direction = direction;
            result.sourceDir = sourceDir;
            result.targetDir = targetDir;
            result.message = `Synced successfully: ${sourceDir} → ${targetDir}`;
            onLog(result.message);
        } catch (e) {
            result.message = `Sync failed: ${e}`;
            onError(result.message);
        }

        return result;
    }

}

/**
 * 双向同步选项
 */
export interface IBidirectionalSyncOptions {
    /** 计算修改时间时忽略的文件模式，默认 ['.meta', '.git', '.DS_Store'] */
    ignorePatterns?: string[];
    /** 同步后要删除的文件模式，默认 ['.meta'] */
    deletePatterns?: string[];
    /** 
     * 优先使用的目录
     * - 'auto': 自动根据修改时间判断（默认）
     * - 'A': 强制使用目录 A 作为源
     * - 'B': 强制使用目录 B 作为源
     */
    preferDir?: 'auto' | 'A' | 'B';
    /** 日志回调 */
    onLog?: (message: string) => void;
    /** 警告回调 */
    onWarn?: (message: string) => void;
    /** 错误回调 */
    onError?: (message: string) => void;
}

/**
 * 双向同步结果
 */
export interface IBidirectionalSyncResult {
    /** 是否执行了同步 */
    synced: boolean;
    /** 同步方向 */
    direction: 'A_to_B' | 'B_to_A' | 'none';
    /** 源目录 */
    sourceDir: string;
    /** 目标目录 */
    targetDir: string;
    /** 结果消息 */
    message: string;
}