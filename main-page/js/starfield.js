/* Galaxy star-field background. No dependencies, no console output. */
(function () {
'use strict';
var CONFIG = {
    density: 9000, maxStars: 260, smallStars: 120, maxAlpha: 0.70,
    bandShare: 0.40, bandAngle: -22, bandSigma: 0.18,
    hazeAlpha: 1, driftScale: 1, twinkleShare: 1, fpsCap: 30, seed: 20260107
};
var canvas = document.getElementById('starfield');
if (!canvas) return;
var ctx = canvas.getContext('2d');
if (!ctx) return;
function rng32(a) {
    return function () {
        a |= 0; a = (a + 0x6D2B79F5) | 0;
        var t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
function hex(h) {
    h = h.trim();
    if (h[0] === '#') h = h.slice(1);
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16), o = [232, 235, 243];
    return isNaN(n) ? o : [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
var gs = getComputedStyle(document.documentElement);
var COL = [hex(gs.getPropertyValue('--text') || '#E8EBF3'), hex(gs.getPropertyValue('--star') || '#F0CE86'), hex(gs.getPropertyValue('--accent') || '#8DB4FF')];
var RM = window.matchMedia('(prefers-reduced-motion: reduce)');
var W = 0, H = 0, stars = [], haze = null, cache = {}, last = 0, acc = 0, raf = 0, on = false, prev = 0;
function css(ci, a) {
    var q = Math.round(a * 20) / 20, k = ci + '|' + q, s = cache[k], c;
    if (!s) { c = COL[ci]; s = cache[k] = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + q + ')'; }
    return s;
}
function build() {
    var r = rng32(CONFIG.seed), i, L;
    W = window.innerWidth; H = window.innerHeight;
    var low = W <= 768 || (navigator.hardwareConcurrency || 8) <= 4;
    var n = Math.min(CONFIG.maxStars, Math.floor(W * H / CONFIG.density));
    if (low) n = Math.min(n, CONFIG.smallStars);
    var dm = (low ? 0.5 : 1) * CONFIG.driftScale, tm = (low || RM.matches) ? 0 : CONFIG.twinkleShare;
    var an = CONFIG.bandAngle * Math.PI / 180, dx = Math.cos(an), dy = Math.sin(an);
    var nx = -dy, ny = dx, cx = W / 2, cy = H / 2, dg = Math.sqrt(W * W + H * H), sg = CONFIG.bandSigma * H;
    function gs2() { var u = 0, v = 0; while (!u) u = r(); while (!v) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.2832 * v); }
    function wr(v, m) { var t = m + 40; v = (v + 20) % t; return (v < 0 ? v + t : v) - 20; }
    var LY = [[0.55, 0.5, 0.7, 0.15, 0.35, 0, 0.06], [0.33, 0.8, 1.0, 0.25, 0.50, 3, 0.12], [0.12, 1.1, 1.5, 0.40, 0.70, 6, 0.18]];
    var want = [0, 0, 0], got = [0, 0, 0], li;
    for (i = 0; i < 3; i++) want[i] = Math.round(n * LY[i][0]);
    stars = [];
    for (i = 0; i < n; i++) {
        li = i % 3;
        if (got[li] >= want[li]) li = want[0] > got[0] ? 0 : (want[1] > got[1] ? 1 : 2);
        got[li]++;
        L = LY[li];
        var x, y;
        if (r() < CONFIG.bandShare) {
            var s = (r() - 0.5) * dg * 1.2, o = gs2() * sg;
            x = wr(cx + dx * s + nx * o, W); y = wr(cy + dy * s + ny * o, H);
        } else { x = r() * W; y = r() * H; }
        var cr = r(), ci = cr < 0.82 ? 0 : (cr < 0.92 ? 1 : 2), dr = L[5] * dm;
        stars.push({ x: x, y: y, ix: Math.round(x), iy: Math.round(y),
            sz: L[1] + r() * (L[2] - L[1]),
            b: Math.min(L[3] + r() * (L[4] - L[3]), CONFIG.maxAlpha), ci: ci,
            vx: dx * dr, vy: dy * dr, mv: dr > 0,
            tw: r() < L[6] * tm, pd: 4 + r() * 6, ph: r() * 6.2832 });
    }
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    haze = document.createElement('canvas');
    var hs = 0.5;
    haze.width = Math.max(2, Math.round(W * hs)); haze.height = Math.max(2, Math.round(H * hs));
    var hc = haze.getContext('2d');
    hc.scale(hs, hs);
    var bl = [[-0.28, 0.34, 0.16, COL[2], 0.035], [0.02, 0.40, 0.20, COL[2], 0.025], [0.30, 0.30, 0.15, COL[1], 0.020]];
    for (i = 0; i < 3; i++) {
        var B = bl[i], bx = cx + dx * B[0] * dg, by = cy + dy * B[0] * dg, R = B[1] * W;
        hc.save(); hc.translate(bx, by); hc.rotate(an); hc.scale(1, B[2] / B[1]);
        var g = hc.createRadialGradient(0, 0, 0, 0, 0, R), al = B[4] * CONFIG.hazeAlpha;
        g.addColorStop(0, 'rgba(' + B[3][0] + ',' + B[3][1] + ',' + B[3][2] + ',' + al + ')');
        g.addColorStop(1, 'rgba(' + B[3][0] + ',' + B[3][1] + ',' + B[3][2] + ',0)');
        hc.fillStyle = g; hc.fillRect(-R, -R, R * 2, R * 2); hc.restore();
    }
}
function draw(now) {
    var t = now / 1000, i, st, a, dt;
    ctx.clearRect(0, 0, W, H);
    if (CONFIG.hazeAlpha > 0) ctx.drawImage(haze, 0, 0, W, H);
    for (i = 0; i < stars.length; i++) {
        st = stars[i];
        a = st.tw ? st.b * (0.65 + 0.35 * Math.sin(6.2832 * t / st.pd + st.ph)) : st.b;
        if (st.mv) {
            dt = Math.min((now - last) / 1000, 0.1);
            st.x += st.vx * dt; st.y += st.vy * dt;
            if (st.x > W + 20) st.x -= W + 40; else if (st.x < -20) st.x += W + 40;
            if (st.y > H + 20) st.y -= H + 40; else if (st.y < -20) st.y += H + 40;
            ctx.fillStyle = css(st.ci, a);
            ctx.beginPath(); ctx.arc(st.x, st.y, st.sz, 0, 6.2832); ctx.fill();
        } else {
            ctx.fillStyle = css(st.ci, a);
            ctx.fillRect(st.ix, st.iy, st.sz, st.sz);
        }
    }
    last = now;
}
function loop(now) {
    if (!on) return;
    acc += now - (prev || now); prev = now;
    var step = 1000 / CONFIG.fpsCap;
    if (acc >= step) { acc = acc % step; draw(now); }
    raf = requestAnimationFrame(loop);
}
function start() {
    if (on || RM.matches) return;
    on = true; prev = 0; acc = 0; last = performance.now();
    raf = requestAnimationFrame(loop);
}
function stop() { on = false; if (raf) cancelAnimationFrame(raf); raf = 0; }
function still() { stop(); last = performance.now(); draw(last); }
var rsT = 0;
window.addEventListener('resize', function () {
    if (rsT) clearTimeout(rsT);
    rsT = setTimeout(function () { build(); if (RM.matches || document.hidden) still(); }, 150);
});
document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
    else if (!RM.matches) { build(); start(); }
});
if (typeof RM.addEventListener === 'function') RM.addEventListener('change', function () { build(); if (RM.matches) still(); else start(); });
build();
if (RM.matches) still(); else start();
})();
