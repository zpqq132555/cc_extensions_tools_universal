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
    public static isEmpty(str: string | null | undefined): boolean {
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
    public static isBlank(str: string | null | undefined): boolean {
        if (str == null) return true;
        return str.trim().length === 0;
    }

}