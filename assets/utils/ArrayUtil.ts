import { MathUtil } from "./MathUtil";

/**
 * @author OldPoint
 * @date 2026-01-22 09:56
 * @filePath assets\scripts\utils\ArrayUtil.ts
 * @description 
 */
export class ArrayUtil {

    /**
     * 克隆数组
     * @param srcArr 源数组
     * @param out 输出数组（可选）
     * @returns 克隆后的数组
     */
    public static Clone<T>(srcArr?: Array<T>, out?: Array<T>): Array<T> {
        if (out) {
            out.length = 0;
        } else {
            out = [];
        }
        if (!srcArr) return out;
        srcArr.forEach(item => out.push(item));
        return out;
    }

    /**
     * 洗牌数组（Fisher-Yates 洗牌算法）
     * @description 使用随机交换的方式打乱数组元素的顺序，保证每种排列的概率相等
     * @param arr 需要洗牌的数组
     * @returns 洗牌后的原数组（就地修改）
     * @example
     * const arr = [1, 2, 3, 4, 5];
     * ArrayUtil.Shuffle(arr); // [3, 1, 5, 2, 4] (随机结果)
     */
    public static Shuffle<T>(arr: Array<T>): Array<T> {
        if (null == arr || 0 == arr.length) return arr;
        const length = arr.length;
        for (let i = 0; i < length; i++) {
            const random = MathUtil.RandomRangeInt(0, length);
            const temp = arr[i];
            arr[i] = arr[random];
            arr[random] = temp;
        }
        return arr;
    }

    /**
     * 深拷贝对象或数组
     * @description 通过 JSON 序列化和反序列化实现深拷贝，适用于纯数据对象
     * @param source 需要深拷贝的源对象或数组
     * @returns 深拷贝后的新对象或数组
     * @warning 不支持拷贝函数、undefined、Symbol、循环引用等特殊类型
     * @example
     * const original = { a: 1, b: { c: 2 } };
     * const copy = ArrayUtil.DeepCopy(original);
     * copy.b.c = 3; // 不会影响 original
     */
    public static DeepCopy<T>(source: T): T {
        const jsonString = JSON.stringify(source);
        return JSON.parse(jsonString);
    }

    /**
     * 数组去重
     * @description 移除数组中的重复元素，返回只包含唯一值的新数组
     * @param arr 需要去重的数组
     * @returns 去重后的新数组
     * @example
     * const arr = [1, 2, 2, 3, 3, 3];
     * ArrayUtil.NoRepeatArray(arr); // [1, 2, 3]
     */
    public static NoRepeatArray<T>(arr: Array<T>): Array<T> {
        const result: Array<T> = [];
        for (let i = 0; i < arr.length; i++) {
            if (result.indexOf(arr[i]) === -1) {
                result.push(arr[i]);
            }
        }
        return result;
    }

    /**
     * 从数组中移除指定元素
     * @description 查找并移除数组中第一个匹配的元素（就地修改）
     * @param arr 目标数组
     * @param item 需要移除的元素
     * @returns 是否成功移除元素
     * @example
     * const arr = [1, 2, 3, 4];
     * ArrayUtil.Splice(arr, 2); // arr = [1, 3, 4], 返回 true
     * ArrayUtil.Splice(arr, 5); // arr = [1, 3, 4], 返回 false
     */
    public static Splice<T>(arr: Array<T>, item: T): boolean {
        const index = arr.indexOf(item);
        if (index !== -1) {
            arr.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * 比较两个数组，看它们是否具有相同的元素以及相同的出现频率。
     *
     * 行为说明（保持原有语义）：
     * - 在计数时，元素会被转换为字符串键（与使用对象属性查找相同）。这意味着非原始对象可能会通过它们的字符串表示进行比较（例如 `[object Object]`）。
     * - 比较不考虑顺序，但计数必须完全匹配。
     *
     * @param arr1 第一个要比较的数组
     * @param arr2 第二个要比较的数组
     * @returns 如果两个数组包含相同的多重集合元素，则返回 true，否则返回 false
     *
     * 示例：
     * ArrayUtil.CompareArr([1,2,2], [2,1,2]) === true
     * ArrayUtil.CompareArr(['a','a','b'], ['a','b','b']) === false
     */
    public static CompareArr<T>(arr1: Array<T>, arr2: Array<T>): boolean {
        if (!arr1 || !arr2 || arr1.length !== arr2.length) return false;

        // 使用字符串化的键以保持原有行为（对象属性键）
        const counts1: Record<string, number> = {};
        const counts2: Record<string, number> = {};

        for (let i = 0; i < arr1.length; i++) {
            const key = String(arr1[i]);
            counts1[key] = (counts1[key] || 0) + 1;
        }

        for (let i = 0; i < arr2.length; i++) {
            const key = String(arr2[i]);
            counts2[key] = (counts2[key] || 0) + 1;
        }

        const keys1 = Object.keys(counts1);
        if (keys1.length !== Object.keys(counts2).length) return false;

        for (let i = 0; i < keys1.length; i++) {
            const k = keys1[i];
            if (counts1[k] !== counts2[k]) return false;
        }
        return true;
    }

}