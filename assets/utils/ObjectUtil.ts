type ObjectType = "null" | "undefined" | "string" | "number" | "boolean" | "array" | "Date" | "RegExp" | "function" | "object";
/**
 * @author OldPoint
 * @date 2026-01-22 08:44
 * @filePath assets\scripts\utils\ObjectUtil.ts
 * @description 
 */
export class ObjectUtil {

    /**
     * 识别对象类型
     * @param t 对象
     * @returns 类型字符串
     */
    public static IdentifyType(t: any): ObjectType {
        if (null === t) return "null";
        if (undefined === t) return "undefined";
        if ("string" == typeof t) return "string";
        if ("number" == typeof t) return "number";
        if ("boolean" == typeof t) return "boolean";
        if (Array.isArray(t)) return "array";
        if (t instanceof Date) return "Date";
        if (t instanceof RegExp) return "RegExp";
        if ("function" == typeof t) return "function";
        return "object";
    }


}