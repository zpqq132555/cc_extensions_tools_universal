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
    public static Clone<T>(srcArr: Array<T>, out?: Array<T>): Array<T> {
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
     * 洗牌数组
     * @param arr 
     * @returns 
     */
    public static Shuffle<T>(arr: Array<T>): Array<T> {
        if (null == arr || 0 == arr.length) return arr;
        const length = arr.length;
        for (let i = 0; i < length; i++) {
            const random = MathUtil.RandomRangeInt(0, length);
            const item = arr[random];
            arr[random] = arr[random];
            arr[random] = item;
        }
        return arr
    }
    /* 
    var n = t("MathUtil"),
            i = function() {
                function t() {}
                return t.shuffle = function(t) {
                    if (null == t || 0 == t.length) return t;
                    for (var e = t.length, o = 0; o < e; o++) {
                        var i = n.default.randomRangeInt(0, e),
                            r = t[o];
                        t[o] = t[i], t[i] = r
                    }
                    return t
                }, t.clone = function(t, e) {
                    return t ? (e ? e.length = 0 : e = [], t.forEach(function(t) {
                        e.push(t)
                    }), e) : []
                }, t.deepCopy = function(t) {
                    var e = JSON.stringify(t);
                    return JSON.parse(e)
                }, t.no_repeatArray = function(t) {
                    for (var e = [], o = 0; o < t.length; o++) - 1 === e.indexOf(t[o]) && e.push(t[o]);
                    return e
                }, t.splice = function(t, e) {
                    var o = t.indexOf(e); - 1 != o && t.splice(o, 1)
                }, t
            }
    */

}