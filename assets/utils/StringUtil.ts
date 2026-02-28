/**
 * @author OldPoint
 * @date 2026-02-12 11:54
 * @filePath assets\extensionScripts\utils\StringUtil.ts
 * @description 
 */
export class StringUtil {

    /**
     * 判断字符串是否为空。
     *
     * 本方法对以下情况都返回 true：
     * - 传入 `null` 或 `undefined`
     * - 传入空字符串 `""` 或长度为 0 的字符串
     *
     * 注意：不会对字符串内容做 trim 操作——如果需要忽略空白字符，应先调用 `str.trim()` 后再判断。
     *
     * 示例：
     * StringUtil.isEmpty(null) => true
     * StringUtil.isEmpty("") => true
     * StringUtil.isEmpty(" \t\n ") => false (如果需要视为空请使用 `isBlank` 风格的方法)
     *
     * @param str 待检测的字符串，允许为 null 或 undefined
     * @returns 当字符串为 null/undefined 或长度为 0 时返回 true，否则返回 false
     */
    public static IsEmpty(str: string | null | undefined): boolean {
        return !str || str.length <= 0;
    }

    /**
     * 判断字符串是否为空或仅包含空白字符（空格、制表符、换行等）。
     *
     * 如果传入 null/undefined 也会返回 true。此方法在需要忽略前后或整体空白时更方便。
     *
     * 示例：
     * StringUtil.isBlank(" \t\n ") => true
     * StringUtil.isBlank("a") => false
     *
     * @param str 待检测的字符串
     */
    public static IsBlank(str: string | null | undefined): boolean {
        if (str == null) return true;
        return str.trim().length === 0;
    }

    /**
     * 为字符串添加随机数字后缀；若末尾已有可替换数字则执行替换。
     *
     * 规则：
     * - 从区间 `[min, max)` 中生成随机整数 `suffix`
     * - 若原字符串最后一位是数字，且该数字也在 `[min, max)` 内：替换最后一位
     * - 否则：将 `suffix` 追加到字符串末尾
     *
     * @param str 原始字符串
     * @param min 随机区间下界（包含）
     * @param max 随机区间上界（不包含）
     * @returns 处理后的字符串；当 `str` 为空或区间非法（`max <= min`）时返回原字符串
     */
    public static AppendOrReplaceRandomSuffix(str: string, min: number, max: number): string {
        if (this.IsEmpty(str) || max <= min) return str;

        const suffix = min + Math.floor(Math.random() * (max - min));
        const lastChar = str.charAt(str.length - 1);

        if (/\d/.test(lastChar)) {
            const lastDigit = parseInt(lastChar, 10);
            if (lastDigit >= min && lastDigit < max) {
                return str.slice(0, -1) + suffix;
            }
        }

        return str + suffix;
    }

    /**
     * 过滤字符串中的常见特殊符号，仅保留字母、数字、中文等普通字符。
     *
     * 注意：
     * - 该方法按“字符逐个过滤”实现
     * - 仅移除正则中定义的特殊符号，不会改变字符顺序
     *
     * @param str 原始字符串
     * @returns 去除特殊符号后的字符串
     */
    public static RemoveSpecialCharacters(str: string): string {
        const specialCharacterRegex = /[`~!@#$^&*()=|{}':;',\[\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%+_]/g;
        let result = "";
        for (let index = 0; index < str.length; index++) {
            result += str.charAt(index).replace(specialCharacterRegex, "");
        }
        return result;
    }

    /**
     * 移除字符串首尾空白字符（空格、制表符、换行等）。
     *
     * @param str 原始字符串
     * @returns 去除首尾空白后的字符串
     */
    public static TrimOuterWhitespace(str: string): string {
        return str.trim();
    }

    /**
     * 获取字符串展示长度（中文按 2 个单位，其它字符按 1 个单位）。
     *
     * 常用于：限制输入长度、UI 截断计算等“中英文混排”场景。
     *
     * @param str 原始字符串
     * @returns 计算后的展示长度
     */
    public static GetDisplayLength(str: string): number {
        let length = 0;
        for (let index = 0; index < str.length; index++) {
            length += this.ContainsChinese(str.charAt(index)) ? 2 : 1;
        }
        return length;
    }

    /**
     * 判断字符串中是否包含中文字符。
     *
     * @param str 待检测字符串
     * @returns 包含中文返回 true，否则返回 false
     */
    public static ContainsChinese(str: string): boolean {
        return /[一-龥]/.test(str);
    }

    /**
     * 将字符串转换为以分号分隔的 16 进制码元串。
     *
     * 示例：
     * - 输入：`AB`
     * - 输出：`;41;42`
     *
     * @param str 原始字符串
     * @returns 分号分隔的 16 进制码元字符串（保留历史格式，首位包含分号）
     */
    public static ToHexCodeUnits(str: string): string {
        let result = "";
        for (let index = 0; index < str.length; index++) {
            result += ";" + str.charCodeAt(index).toString(16);
        }
        return result;
    }

    /**
     * 将分号分隔的 16 进制码元串，转换为 `\\uXXXX` 形式的 Unicode 转义文本。
     *
     * 注意：返回的是“转义文本字符串”，例如 `\\u4f60\\u597d`，
     * 而不是直接返回“你好”。
     *
     * @param str 分号分隔的 16 进制码元字符串
     * @returns Unicode 转义文本
     */
    public static ToUnicodeEscapeString(str: string): string {
        let result = "";
        const segments = str.split(";");

        for (let index = 0; index < segments.length; index++) {
            let hex = segments[index];
            if (hex.length === 0) continue;
            while (hex.length < 4) {
                hex = "0" + hex;
            }
            result += "\\u" + hex;
        }

        return result;
    }

    /**
     * 按展示长度截断字符串，并在发生截断时追加省略号 `...`。
     *
     * 计数规则：
     * - 中文按 2
     * - 非中文按 1
     *
     * @param str 原始字符串
     * @param maxLength 最大展示长度
     * @returns 截断结果；未超长则返回原字符串
     */
    public static TruncateByDisplayLength(str: string, maxLength: number): string {
        if (maxLength <= 0) return "";

        let currentLength = 0;
        let endIndex = 0;

        for (const char of str) {
            const charLength = this.ContainsChinese(char) ? 2 : 1;
            if (currentLength + charLength > maxLength) {
                break;
            }
            currentLength += charLength;
            endIndex += char.length;
        }

        if (endIndex >= str.length) {
            return str;
        }

        return str.slice(0, endIndex) + "...";
    }

    /** @deprecated 请使用 `removeSpecialCharacters` */
    public static FilterStr(str: string): string {
        return this.RemoveSpecialCharacters(str);
    }

    /** @deprecated 请使用 `trimOuterWhitespace` */
    public static TrimSpace(str: string): string {
        return this.TrimOuterWhitespace(str);
    }

    /** @deprecated 请使用 `getDisplayLength` */
    public static GetLength(str: string): number {
        return this.GetDisplayLength(str);
    }

    /** @deprecated 请使用 `containsChinese` */
    public static IsChinese(str: string): boolean {
        return this.ContainsChinese(str);
    }

    /** @deprecated 请使用 `toHexCodeUnits` */
    public static StringToCode16(str: string): string {
        return this.ToHexCodeUnits(str);
    }

    /** @deprecated 请使用 `toUnicodeEscapeString` */
    public static Code16ToString(str: string): string {
        return this.ToUnicodeEscapeString(str);
    }

    /** @deprecated 请使用 `truncateByDisplayLength` */
    public static cutOutStr(str: string, maxLength: number): string {
        return this.TruncateByDisplayLength(str, maxLength);
    }

}