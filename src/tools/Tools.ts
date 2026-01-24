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

}