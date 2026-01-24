/**
 * @author OldPoint
 * @date 2026-01-22 08:45
 * @filePath assets\scripts\utils\MathUtil.ts
 * @description 
 */
export class MathUtil {

    /**
     * 区间随机整数
     * @param min 最小值
     * @param max 最大值
     * @returns 区间随机数
     */
    public static RandomRangeInt(min: number, max: number): number {
        return min + Math.floor(Math.random() * (max - min));
    }
    /**
     * 生成指定长度的随机字符串
     * @param length 字符串长度
     * @returns 随机字符串
     */
    public static RandomString(length: number): string {
        const baseCharacterSet = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
        let numberString = "";
        for (let i = 0; i < length; i++) {
            numberString += baseCharacterSet.charAt(Math.floor(Math.random() * baseCharacterSet.length));
        }
        return numberString;
    }

    /* 
    var i = t("ArrayUtil"),
            r = function() {
                function t() {}
                return t.randomRangeInt = function(t, e) {
                    var o = Math.random();
                    return t + Math.floor(o * (e - t))
                }, t.randomRangeFloat = function(t, e) {
                    return t + Math.random() * (e - t)
                }, t.randomArray = function(t) {
                    return t[0 | this.randomRangeInt(0, t.length)]
                }, t.RandomIntBoth = function(t, e, o) {
                    if ((t = Math.floor(t)) >= (e = Math.floor(e)) || e - t < o || 0 == o) return console.error("min > max ||  max - min < num || num == 0"), null;
                    for (var n = [], r = t; r < e; r++) n.push(r);
                    i.default.shuffle(n);
                    var a = Math.min(n.length, o),
                        s = [];
                    for (r = 0; r < a; r++) s.push(n.shift());
                    return s
                }, t.getAngle = function(t) {
                    return 180 * t / Math.PI
                }, t.getRadian = function(t) {
                    return t / 180 * Math.PI
                }, t.getRadianTwoPoint = function(t, e) {
                    var o = e.x - t.x,
                        n = e.y - t.y;
                    return Math.atan2(n, o)
                }, t.getAngleTwoPoint = function(t, e) {
                    var o, n = e.y - t.y,
                        i = e.x - t.x;
                    return 0 == n ? i < 0 ? 180 : 0 : 0 == i ? (n > 0 ? o = 90 : n < 0 && (o = 270), o) : (o = this.getAngle(Math.atan(Math.abs(n) / Math.abs(i))), i > 0 ? n < 0 && (o = 360 - o) : o = n > 0 ? 180 - o : 180 + o, o)
                }, t.getDistance = function(t, e) {
                    if (!t || !e) return 1e4;
                    var o = e.x - t.x,
                        n = e.y - t.y,
                        i = Math.pow(o, 2) + Math.pow(n, 2);
                    return Math.sqrt(i)
                }, t.exactCount = function(t, e) {
                    void 0 === e && (e = 0);
                    var o = Math.pow(10, e);
                    return (t * o | 0) / o
                }, t.calculateTriangleSides = function(t, e, o) {
                    var i = t * (Math.PI / 180),
                        r = o ? e / Math.cos(i) : e / Math.sin(i),
                        a = o ? e * Math.tan(i) : void 0,
                        s = o ? void 0 : e / Math.tan(i);
                    return n(n({
                        hypotenuse: r
                    }, void 0 !== a && {
                        opposite: a
                    }), void 0 !== s && {
                        adjacent: s
                    })
                }, t.calculateRightTriangleSides = function(t, e) {
                    var o = t * (Math.PI / 180);
                    return {
                        opposite: e * Math.sin(o),
                        adjacent: e * Math.cos(o)
                    }
                }, t.getBezierCutAngle = function(t, e, o, n) {
                    var i = 2 * (t.x * (n - 1) + e.x * (1 - 2 * n) + o.x * n),
                        r = 2 * (t.y * (n - 1) + e.y * (1 - 2 * n) + o.y * n);
                    return this.getAngle(Math.atan2(r, i))
                }, t.getBezierPoint = function(t, e, o, n, i) {
                    return void 0 === i && (i = null), i || (i = new cc.Vec2), i.x = (1 - n) * (1 - n) * t.x + 2 * n * (1 - n) * e.x + n * n * o.x, i.y = (1 - n) * (1 - n) * t.y + 2 * n * (1 - n) * e.y + n * n * o.y, i
                }, t.getBezier3Point = function(t, e, o, n, i, r) {
                    void 0 === r && (r = null), r || (r = new cc.Vec2);
                    var a = 3 * (e.x - t.x),
                        s = 3 * (o.x - e.x) - a,
                        c = n.x - t.x - a - s,
                        l = 3 * (e.y - t.y),
                        u = 3 * (o.y - e.y) - l,
                        p = n.y - t.y - l - u;
                    return r.x = c * i * i * i + s * i * i + a * i + t.x, r.y = p * i * i * i + u * i * i + l * i + t.y, r
                }, t.getBezier3CutAngle = function(t, e, o, n, i) {
                    var r = 3 * t.x * (1 - i) * (1 - i) * -1 + 3 * e.x * ((1 - i) * (1 - i) + 2 * i * (1 - i) * -1) + 3 * o.x * (2 * i * (1 - i) + i * i * -1) + 3 * n.x * i * i,
                        a = 3 * t.y * (1 - i) * (1 - i) * -1 + 3 * e.y * ((1 - i) * (1 - i) + 2 * i * (1 - i) * -1) + 3 * o.y * (2 * i * (1 - i) + i * i * -1) + 3 * n.y * i * i;
                    return this.getAngle(Math.atan2(a, r))
                }, t.randomString = function(t) {
                    for (var e = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678", o = e.length, n = "", i = 0; i < t; i++) n += e.charAt(Math.floor(Math.random() * o));
                    return n
                }, t.isInRange = function(t, e, o) {
                    return o >= t && o <= e
                }, t.rotatePoint = function(e, o, n, i) {
                    if (void 0 === n && (n = cc.v3()), 0 == o) return cc.v3(e.x, e.y);
                    var r = t.getRadian(o),
                        a = (e.x - n.x) * Math.cos(r) - (e.y - n.y) * Math.sin(r) + n.x,
                        s = (e.x - n.x) * Math.sin(r) + (e.y - n.y) * Math.cos(r) + n.y;
                    return i ? (i.x = a, i.y = s, i) : cc.v3(a, s)
                }, t.v3Copy = function(t, e) {
                    return e || (e = cc.v3()), e.x = t.x, e.y = t.y, e.z = t.z, e
                }, t
            }
    */

}