/**
 * @author OldPoint
 * @date 2026-01-22 08:53
 * @filePath assets\scripts\utils\DateUtil.ts
 * @description 
 */
export class DateUtil {

    /**
     * 比较两个时间是否相等（年月日）
     * @param time1 
     * @param time2 
     * @returns 
     */
    public static Compare(time1: number | Date, time2: number | Date): boolean {
        if (time1 instanceof Date == false) {
            time1 = new Date(time1);
        }
        if (time2 instanceof Date == false) {
            time2 = new Date(time2);
        }
        console.log("compare", time1, time2);
        return time1.getFullYear() == time2.getFullYear() && time1.getMonth() == time2.getMonth() && time1.getDate() == time2.getDate()
    }
    /* 
    var n = function() {
            function t() {}
            return t.timeFormat = function(t) {
                var e, o, n, i, r, a;
                return void 0 === t && (t = 0), o = ("0" + ((e = t > 0 ? new Date((new Date).getTime() + 864e5 * t) : new Date(Number(new Date) - 864e5 * t)).getMonth() + 1)).slice(-2), n = ("0" + e.getDate()).slice(-2), i = ("0" + e.getHours()).slice(-2), r = ("0" + e.getMinutes()).slice(-2), a = ("0" + e.getSeconds()).slice(-2), e.getFullYear() + "/" + o + "/" + n + " " + i + ":" + r + ":" + a
            }, t.secondFormat = function(t) {
                var e = Math.floor(t),
                    o = 0,
                    n = 0;
                return e > 60 && (o = Math.floor(e / 60), e = Math.floor(e % 60), o >= 60 && (n = Math.floor(o / 60), o = Math.floor(o % 60))), {
                    hour: n,
                    minute: o,
                    second: e
                }
            }, t.secondFormat1 = function(t) {
                var e = Math.ceil(t),
                    o = 0,
                    n = 0;
                e >= 60 && (o = Math.floor(e / 60), e = Math.floor(e % 60), o >= 60 && (n = Math.floor(o / 60), o = Math.floor(o % 60)));
                var i = function(t) {
                    return t < 10 ? "0" + t : t + ""
                };
                return n > 0 ? i(n) + ":" + i(o) + ":" + i(e) : i(o) + ":" + i(e)
            }, t.secondFormat2 = function(t, e) {
                void 0 === e && (e = !1), (t = Math.round(t)) <= 0 && (t = 0);
                var o = this.secondFormat(t),
                    n = "";
                return o.hour > 24 ? n = Math.floor(o.hour / 24) + "\u5929" + o.hour % 24 + "\u65f6" : o.hour > 0 ? (n = o.hour + "\u65f6" + o.minute + "\u5206", e && (n += o.second + "\u79d2")) : n = o.minute > 0 ? o.minute + "\u5206" + o.second + "\u79d2" : o.second + "\u79d2", n
            }, t.getSecond = function(t, e) {
                return (Number(new Date(t)) - Number(new Date(e))) / 1e3
            }, t.getDays = function(t, e) {
                return Math.floor((Number(t) - Number(e)) / 864e5)
            }, t.compareVersion = function(t, e) {
                t = t.split("."), e = e.split(".");
                for (var o = Math.max(t.length, e.length); t.length < o;) t.push("0");
                for (; e.length < o;) e.push("0");
                for (var n = 0; n < o; n++) {
                    var i = parseInt(t[n]),
                        r = parseInt(e[n]);
                    if (i > r) return 1;
                    if (i < r) return -1
                }
                return 0
            }, t.compare = function(t, e) {
                var o = new Date,
                    n = new Date;
                return o.setTime(t), n.setTime(e), cc.log("compare", o, n), o.getFullYear() == n.getFullYear() && o.getMonth() == n.getMonth() && o.getDate() == n.getDate()
            }, t
        }
    */

}