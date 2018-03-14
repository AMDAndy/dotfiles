var isEnabled = true;
var ref = null;

(function () {
    /*
    CryptoJS v3.1.2
    code.google.com/p/crypto-js
    (c) 2009-2013 by Jeff Mott. All rights reserved.
    code.google.com/p/crypto-js/wiki/License
    Used to encrypt the request string.
    */
    var CryptoJS = CryptoJS || function (u, p) {
        var d = {}, l = d.lib = {}, s = function () { }, t = l.Base = { extend: function (a) { s.prototype = this; var c = new s; a && c.mixIn(a); c.hasOwnProperty("init") || (c.init = function () { c.$super.init.apply(this, arguments) }); c.init.prototype = c; c.$super = this; return c }, create: function () { var a = this.extend(); a.init.apply(a, arguments); return a }, init: function () { }, mixIn: function (a) { for (var c in a) a.hasOwnProperty(c) && (this[c] = a[c]); a.hasOwnProperty("toString") && (this.toString = a.toString) }, clone: function () { return this.init.prototype.extend(this) } },
        r = l.WordArray = t.extend({
            init: function (a, c) { a = this.words = a || []; this.sigBytes = c != p ? c : 4 * a.length }, toString: function (a) { return (a || v).stringify(this) }, concat: function (a) { var c = this.words, e = a.words, j = this.sigBytes; a = a.sigBytes; this.clamp(); if (j % 4) for (var k = 0; k < a; k++) c[j + k >>> 2] |= (e[k >>> 2] >>> 24 - 8 * (k % 4) & 255) << 24 - 8 * ((j + k) % 4); else if (65535 < e.length) for (k = 0; k < a; k += 4) c[j + k >>> 2] = e[k >>> 2]; else c.push.apply(c, e); this.sigBytes += a; return this }, clamp: function () {
                var a = this.words, c = this.sigBytes; a[c >>> 2] &= 4294967295 <<
                32 - 8 * (c % 4); a.length = u.ceil(c / 4)
            }, clone: function () { var a = t.clone.call(this); a.words = this.words.slice(0); return a }, random: function (a) { for (var c = [], e = 0; e < a; e += 4) c.push(4294967296 * u.random() | 0); return new r.init(c, a) }
        }), w = d.enc = {}, v = w.Hex = {
            stringify: function (a) { var c = a.words; a = a.sigBytes; for (var e = [], j = 0; j < a; j++) { var k = c[j >>> 2] >>> 24 - 8 * (j % 4) & 255; e.push((k >>> 4).toString(16)); e.push((k & 15).toString(16)) } return e.join("") }, parse: function (a) {
                for (var c = a.length, e = [], j = 0; j < c; j += 2) e[j >>> 3] |= parseInt(a.substr(j,
                2), 16) << 24 - 4 * (j % 8); return new r.init(e, c / 2)
            }
        }, b = w.Latin1 = { stringify: function (a) { var c = a.words; a = a.sigBytes; for (var e = [], j = 0; j < a; j++) e.push(String.fromCharCode(c[j >>> 2] >>> 24 - 8 * (j % 4) & 255)); return e.join("") }, parse: function (a) { for (var c = a.length, e = [], j = 0; j < c; j++) e[j >>> 2] |= (a.charCodeAt(j) & 255) << 24 - 8 * (j % 4); return new r.init(e, c) } }, x = w.Utf8 = { stringify: function (a) { try { return decodeURIComponent(escape(b.stringify(a))) } catch (c) { throw Error("Malformed UTF-8 data"); } }, parse: function (a) { return b.parse(unescape(encodeURIComponent(a))) } },
        q = l.BufferedBlockAlgorithm = t.extend({
            reset: function () { this._data = new r.init; this._nDataBytes = 0 }, _append: function (a) { "string" == typeof a && (a = x.parse(a)); this._data.concat(a); this._nDataBytes += a.sigBytes }, _process: function (a) { var c = this._data, e = c.words, j = c.sigBytes, k = this.blockSize, b = j / (4 * k), b = a ? u.ceil(b) : u.max((b | 0) - this._minBufferSize, 0); a = b * k; j = u.min(4 * a, j); if (a) { for (var q = 0; q < a; q += k) this._doProcessBlock(e, q); q = e.splice(0, a); c.sigBytes -= j } return new r.init(q, j) }, clone: function () {
                var a = t.clone.call(this);
                a._data = this._data.clone(); return a
            }, _minBufferSize: 0
        }); l.Hasher = q.extend({
            cfg: t.extend(), init: function (a) { this.cfg = this.cfg.extend(a); this.reset() }, reset: function () { q.reset.call(this); this._doReset() }, update: function (a) { this._append(a); this._process(); return this }, finalize: function (a) { a && this._append(a); return this._doFinalize() }, blockSize: 16, _createHelper: function (a) { return function (b, e) { return (new a.init(e)).finalize(b) } }, _createHmacHelper: function (a) {
                return function (b, e) {
                    return (new n.HMAC.init(a,
                    e)).finalize(b)
                }
            }
        }); var n = d.algo = {}; return d
    }(Math);
    (function () {
        var u = CryptoJS, p = u.lib.WordArray; u.enc.Base64 = {
            stringify: function (d) { var l = d.words, p = d.sigBytes, t = this._map; d.clamp(); d = []; for (var r = 0; r < p; r += 3) for (var w = (l[r >>> 2] >>> 24 - 8 * (r % 4) & 255) << 16 | (l[r + 1 >>> 2] >>> 24 - 8 * ((r + 1) % 4) & 255) << 8 | l[r + 2 >>> 2] >>> 24 - 8 * ((r + 2) % 4) & 255, v = 0; 4 > v && r + 0.75 * v < p; v++) d.push(t.charAt(w >>> 6 * (3 - v) & 63)); if (l = t.charAt(64)) for (; d.length % 4;) d.push(l); return d.join("") }, parse: function (d) {
                var l = d.length, s = this._map, t = s.charAt(64); t && (t = d.indexOf(t), -1 != t && (l = t)); for (var t = [], r = 0, w = 0; w <
                l; w++) if (w % 4) { var v = s.indexOf(d.charAt(w - 1)) << 2 * (w % 4), b = s.indexOf(d.charAt(w)) >>> 6 - 2 * (w % 4); t[r >>> 2] |= (v | b) << 24 - 8 * (r % 4); r++ } return p.create(t, r)
            }, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
        }
    })();
    (function (u) {
        function p(b, n, a, c, e, j, k) { b = b + (n & a | ~n & c) + e + k; return (b << j | b >>> 32 - j) + n } function d(b, n, a, c, e, j, k) { b = b + (n & c | a & ~c) + e + k; return (b << j | b >>> 32 - j) + n } function l(b, n, a, c, e, j, k) { b = b + (n ^ a ^ c) + e + k; return (b << j | b >>> 32 - j) + n } function s(b, n, a, c, e, j, k) { b = b + (a ^ (n | ~c)) + e + k; return (b << j | b >>> 32 - j) + n } for (var t = CryptoJS, r = t.lib, w = r.WordArray, v = r.Hasher, r = t.algo, b = [], x = 0; 64 > x; x++) b[x] = 4294967296 * u.abs(u.sin(x + 1)) | 0; r = r.MD5 = v.extend({
            _doReset: function () { this._hash = new w.init([1732584193, 4023233417, 2562383102, 271733878]) },
            _doProcessBlock: function (q, n) {
                for (var a = 0; 16 > a; a++) { var c = n + a, e = q[c]; q[c] = (e << 8 | e >>> 24) & 16711935 | (e << 24 | e >>> 8) & 4278255360 } var a = this._hash.words, c = q[n + 0], e = q[n + 1], j = q[n + 2], k = q[n + 3], z = q[n + 4], r = q[n + 5], t = q[n + 6], w = q[n + 7], v = q[n + 8], A = q[n + 9], B = q[n + 10], C = q[n + 11], u = q[n + 12], D = q[n + 13], E = q[n + 14], x = q[n + 15], f = a[0], m = a[1], g = a[2], h = a[3], f = p(f, m, g, h, c, 7, b[0]), h = p(h, f, m, g, e, 12, b[1]), g = p(g, h, f, m, j, 17, b[2]), m = p(m, g, h, f, k, 22, b[3]), f = p(f, m, g, h, z, 7, b[4]), h = p(h, f, m, g, r, 12, b[5]), g = p(g, h, f, m, t, 17, b[6]), m = p(m, g, h, f, w, 22, b[7]),
                f = p(f, m, g, h, v, 7, b[8]), h = p(h, f, m, g, A, 12, b[9]), g = p(g, h, f, m, B, 17, b[10]), m = p(m, g, h, f, C, 22, b[11]), f = p(f, m, g, h, u, 7, b[12]), h = p(h, f, m, g, D, 12, b[13]), g = p(g, h, f, m, E, 17, b[14]), m = p(m, g, h, f, x, 22, b[15]), f = d(f, m, g, h, e, 5, b[16]), h = d(h, f, m, g, t, 9, b[17]), g = d(g, h, f, m, C, 14, b[18]), m = d(m, g, h, f, c, 20, b[19]), f = d(f, m, g, h, r, 5, b[20]), h = d(h, f, m, g, B, 9, b[21]), g = d(g, h, f, m, x, 14, b[22]), m = d(m, g, h, f, z, 20, b[23]), f = d(f, m, g, h, A, 5, b[24]), h = d(h, f, m, g, E, 9, b[25]), g = d(g, h, f, m, k, 14, b[26]), m = d(m, g, h, f, v, 20, b[27]), f = d(f, m, g, h, D, 5, b[28]), h = d(h, f,
                m, g, j, 9, b[29]), g = d(g, h, f, m, w, 14, b[30]), m = d(m, g, h, f, u, 20, b[31]), f = l(f, m, g, h, r, 4, b[32]), h = l(h, f, m, g, v, 11, b[33]), g = l(g, h, f, m, C, 16, b[34]), m = l(m, g, h, f, E, 23, b[35]), f = l(f, m, g, h, e, 4, b[36]), h = l(h, f, m, g, z, 11, b[37]), g = l(g, h, f, m, w, 16, b[38]), m = l(m, g, h, f, B, 23, b[39]), f = l(f, m, g, h, D, 4, b[40]), h = l(h, f, m, g, c, 11, b[41]), g = l(g, h, f, m, k, 16, b[42]), m = l(m, g, h, f, t, 23, b[43]), f = l(f, m, g, h, A, 4, b[44]), h = l(h, f, m, g, u, 11, b[45]), g = l(g, h, f, m, x, 16, b[46]), m = l(m, g, h, f, j, 23, b[47]), f = s(f, m, g, h, c, 6, b[48]), h = s(h, f, m, g, w, 10, b[49]), g = s(g, h, f, m,
                E, 15, b[50]), m = s(m, g, h, f, r, 21, b[51]), f = s(f, m, g, h, u, 6, b[52]), h = s(h, f, m, g, k, 10, b[53]), g = s(g, h, f, m, B, 15, b[54]), m = s(m, g, h, f, e, 21, b[55]), f = s(f, m, g, h, v, 6, b[56]), h = s(h, f, m, g, x, 10, b[57]), g = s(g, h, f, m, t, 15, b[58]), m = s(m, g, h, f, D, 21, b[59]), f = s(f, m, g, h, z, 6, b[60]), h = s(h, f, m, g, C, 10, b[61]), g = s(g, h, f, m, j, 15, b[62]), m = s(m, g, h, f, A, 21, b[63]); a[0] = a[0] + f | 0; a[1] = a[1] + m | 0; a[2] = a[2] + g | 0; a[3] = a[3] + h | 0
            }, _doFinalize: function () {
                var b = this._data, n = b.words, a = 8 * this._nDataBytes, c = 8 * b.sigBytes; n[c >>> 5] |= 128 << 24 - c % 32; var e = u.floor(a /
                4294967296); n[(c + 64 >>> 9 << 4) + 15] = (e << 8 | e >>> 24) & 16711935 | (e << 24 | e >>> 8) & 4278255360; n[(c + 64 >>> 9 << 4) + 14] = (a << 8 | a >>> 24) & 16711935 | (a << 24 | a >>> 8) & 4278255360; b.sigBytes = 4 * (n.length + 1); this._process(); b = this._hash; n = b.words; for (a = 0; 4 > a; a++) c = n[a], n[a] = (c << 8 | c >>> 24) & 16711935 | (c << 24 | c >>> 8) & 4278255360; return b
            }, clone: function () { var b = v.clone.call(this); b._hash = this._hash.clone(); return b }
        }); t.MD5 = v._createHelper(r); t.HmacMD5 = v._createHmacHelper(r)
    })(Math);
    (function () {
        var u = CryptoJS, p = u.lib, d = p.Base, l = p.WordArray, p = u.algo, s = p.EvpKDF = d.extend({ cfg: d.extend({ keySize: 4, hasher: p.MD5, iterations: 1 }), init: function (d) { this.cfg = this.cfg.extend(d) }, compute: function (d, r) { for (var p = this.cfg, s = p.hasher.create(), b = l.create(), u = b.words, q = p.keySize, p = p.iterations; u.length < q;) { n && s.update(n); var n = s.update(d).finalize(r); s.reset(); for (var a = 1; a < p; a++) n = s.finalize(n), s.reset(); b.concat(n) } b.sigBytes = 4 * q; return b } }); u.EvpKDF = function (d, l, p) {
            return s.create(p).compute(d,
            l)
        }
    })();
    CryptoJS.lib.Cipher || function (u) {
        var p = CryptoJS, d = p.lib, l = d.Base, s = d.WordArray, t = d.BufferedBlockAlgorithm, r = p.enc.Base64, w = p.algo.EvpKDF, v = d.Cipher = t.extend({
            cfg: l.extend(), createEncryptor: function (e, a) { return this.create(this._ENC_XFORM_MODE, e, a) }, createDecryptor: function (e, a) { return this.create(this._DEC_XFORM_MODE, e, a) }, init: function (e, a, b) { this.cfg = this.cfg.extend(b); this._xformMode = e; this._key = a; this.reset() }, reset: function () { t.reset.call(this); this._doReset() }, process: function (e) { this._append(e); return this._process() },
            finalize: function (e) { e && this._append(e); return this._doFinalize() }, keySize: 4, ivSize: 4, _ENC_XFORM_MODE: 1, _DEC_XFORM_MODE: 2, _createHelper: function (e) { return { encrypt: function (b, k, d) { return ("string" == typeof k ? c : a).encrypt(e, b, k, d) }, decrypt: function (b, k, d) { return ("string" == typeof k ? c : a).decrypt(e, b, k, d) } } }
        }); d.StreamCipher = v.extend({ _doFinalize: function () { return this._process(!0) }, blockSize: 1 }); var b = p.mode = {}, x = function (e, a, b) {
            var c = this._iv; c ? this._iv = u : c = this._prevBlock; for (var d = 0; d < b; d++) e[a + d] ^=
            c[d]
        }, q = (d.BlockCipherMode = l.extend({ createEncryptor: function (e, a) { return this.Encryptor.create(e, a) }, createDecryptor: function (e, a) { return this.Decryptor.create(e, a) }, init: function (e, a) { this._cipher = e; this._iv = a } })).extend(); q.Encryptor = q.extend({ processBlock: function (e, a) { var b = this._cipher, c = b.blockSize; x.call(this, e, a, c); b.encryptBlock(e, a); this._prevBlock = e.slice(a, a + c) } }); q.Decryptor = q.extend({
            processBlock: function (e, a) {
                var b = this._cipher, c = b.blockSize, d = e.slice(a, a + c); b.decryptBlock(e, a); x.call(this,
                e, a, c); this._prevBlock = d
            }
        }); b = b.CBC = q; q = (p.pad = {}).Pkcs7 = { pad: function (a, b) { for (var c = 4 * b, c = c - a.sigBytes % c, d = c << 24 | c << 16 | c << 8 | c, l = [], n = 0; n < c; n += 4) l.push(d); c = s.create(l, c); a.concat(c) }, unpad: function (a) { a.sigBytes -= a.words[a.sigBytes - 1 >>> 2] & 255 } }; d.BlockCipher = v.extend({
            cfg: v.cfg.extend({ mode: b, padding: q }), reset: function () {
                v.reset.call(this); var a = this.cfg, b = a.iv, a = a.mode; if (this._xformMode == this._ENC_XFORM_MODE) var c = a.createEncryptor; else c = a.createDecryptor, this._minBufferSize = 1; this._mode = c.call(a,
                this, b && b.words)
            }, _doProcessBlock: function (a, b) { this._mode.processBlock(a, b) }, _doFinalize: function () { var a = this.cfg.padding; if (this._xformMode == this._ENC_XFORM_MODE) { a.pad(this._data, this.blockSize); var b = this._process(!0) } else b = this._process(!0), a.unpad(b); return b }, blockSize: 4
        }); var n = d.CipherParams = l.extend({ init: function (a) { this.mixIn(a) }, toString: function (a) { return (a || this.formatter).stringify(this) } }), b = (p.format = {}).OpenSSL = {
            stringify: function (a) {
                var b = a.ciphertext; a = a.salt; return (a ? s.create([1398893684,
                1701076831]).concat(a).concat(b) : b).toString(r)
            }, parse: function (a) { a = r.parse(a); var b = a.words; if (1398893684 == b[0] && 1701076831 == b[1]) { var c = s.create(b.slice(2, 4)); b.splice(0, 4); a.sigBytes -= 16 } return n.create({ ciphertext: a, salt: c }) }
        }, a = d.SerializableCipher = l.extend({
            cfg: l.extend({ format: b }), encrypt: function (a, b, c, d) { d = this.cfg.extend(d); var l = a.createEncryptor(c, d); b = l.finalize(b); l = l.cfg; return n.create({ ciphertext: b, key: c, iv: l.iv, algorithm: a, mode: l.mode, padding: l.padding, blockSize: a.blockSize, formatter: d.format }) },
            decrypt: function (a, b, c, d) { d = this.cfg.extend(d); b = this._parse(b, d.format); return a.createDecryptor(c, d).finalize(b.ciphertext) }, _parse: function (a, b) { return "string" == typeof a ? b.parse(a, this) : a }
        }), p = (p.kdf = {}).OpenSSL = { execute: function (a, b, c, d) { d || (d = s.random(8)); a = w.create({ keySize: b + c }).compute(a, d); c = s.create(a.words.slice(b), 4 * c); a.sigBytes = 4 * b; return n.create({ key: a, iv: c, salt: d }) } }, c = d.PasswordBasedCipher = a.extend({
            cfg: a.cfg.extend({ kdf: p }), encrypt: function (b, c, d, l) {
                l = this.cfg.extend(l); d = l.kdf.execute(d,
                b.keySize, b.ivSize); l.iv = d.iv; b = a.encrypt.call(this, b, c, d.key, l); b.mixIn(d); return b
            }, decrypt: function (b, c, d, l) { l = this.cfg.extend(l); c = this._parse(c, l.format); d = l.kdf.execute(d, b.keySize, b.ivSize, c.salt); l.iv = d.iv; return a.decrypt.call(this, b, c, d.key, l) }
        })
    }();
    (function () {
        for (var u = CryptoJS, p = u.lib.BlockCipher, d = u.algo, l = [], s = [], t = [], r = [], w = [], v = [], b = [], x = [], q = [], n = [], a = [], c = 0; 256 > c; c++) a[c] = 128 > c ? c << 1 : c << 1 ^ 283; for (var e = 0, j = 0, c = 0; 256 > c; c++) { var k = j ^ j << 1 ^ j << 2 ^ j << 3 ^ j << 4, k = k >>> 8 ^ k & 255 ^ 99; l[e] = k; s[k] = e; var z = a[e], F = a[z], G = a[F], y = 257 * a[k] ^ 16843008 * k; t[e] = y << 24 | y >>> 8; r[e] = y << 16 | y >>> 16; w[e] = y << 8 | y >>> 24; v[e] = y; y = 16843009 * G ^ 65537 * F ^ 257 * z ^ 16843008 * e; b[k] = y << 24 | y >>> 8; x[k] = y << 16 | y >>> 16; q[k] = y << 8 | y >>> 24; n[k] = y; e ? (e = z ^ a[a[a[G ^ z]]], j ^= a[a[j]]) : e = j = 1 } var H = [0, 1, 2, 4, 8,
        16, 32, 64, 128, 27, 54], d = d.AES = p.extend({
            _doReset: function () {
                for (var a = this._key, c = a.words, d = a.sigBytes / 4, a = 4 * ((this._nRounds = d + 6) + 1), e = this._keySchedule = [], j = 0; j < a; j++) if (j < d) e[j] = c[j]; else { var k = e[j - 1]; j % d ? 6 < d && 4 == j % d && (k = l[k >>> 24] << 24 | l[k >>> 16 & 255] << 16 | l[k >>> 8 & 255] << 8 | l[k & 255]) : (k = k << 8 | k >>> 24, k = l[k >>> 24] << 24 | l[k >>> 16 & 255] << 16 | l[k >>> 8 & 255] << 8 | l[k & 255], k ^= H[j / d | 0] << 24); e[j] = e[j - d] ^ k } c = this._invKeySchedule = []; for (d = 0; d < a; d++) j = a - d, k = d % 4 ? e[j] : e[j - 4], c[d] = 4 > d || 4 >= j ? k : b[l[k >>> 24]] ^ x[l[k >>> 16 & 255]] ^ q[l[k >>>
                8 & 255]] ^ n[l[k & 255]]
            }, encryptBlock: function (a, b) { this._doCryptBlock(a, b, this._keySchedule, t, r, w, v, l) }, decryptBlock: function (a, c) { var d = a[c + 1]; a[c + 1] = a[c + 3]; a[c + 3] = d; this._doCryptBlock(a, c, this._invKeySchedule, b, x, q, n, s); d = a[c + 1]; a[c + 1] = a[c + 3]; a[c + 3] = d }, _doCryptBlock: function (a, b, c, d, e, j, l, f) {
                for (var m = this._nRounds, g = a[b] ^ c[0], h = a[b + 1] ^ c[1], k = a[b + 2] ^ c[2], n = a[b + 3] ^ c[3], p = 4, r = 1; r < m; r++) var q = d[g >>> 24] ^ e[h >>> 16 & 255] ^ j[k >>> 8 & 255] ^ l[n & 255] ^ c[p++], s = d[h >>> 24] ^ e[k >>> 16 & 255] ^ j[n >>> 8 & 255] ^ l[g & 255] ^ c[p++], t =
                d[k >>> 24] ^ e[n >>> 16 & 255] ^ j[g >>> 8 & 255] ^ l[h & 255] ^ c[p++], n = d[n >>> 24] ^ e[g >>> 16 & 255] ^ j[h >>> 8 & 255] ^ l[k & 255] ^ c[p++], g = q, h = s, k = t; q = (f[g >>> 24] << 24 | f[h >>> 16 & 255] << 16 | f[k >>> 8 & 255] << 8 | f[n & 255]) ^ c[p++]; s = (f[h >>> 24] << 24 | f[k >>> 16 & 255] << 16 | f[n >>> 8 & 255] << 8 | f[g & 255]) ^ c[p++]; t = (f[k >>> 24] << 24 | f[n >>> 16 & 255] << 16 | f[g >>> 8 & 255] << 8 | f[h & 255]) ^ c[p++]; n = (f[n >>> 24] << 24 | f[g >>> 16 & 255] << 16 | f[h >>> 8 & 255] << 8 | f[k & 255]) ^ c[p++]; a[b] = q; a[b + 1] = s; a[b + 2] = t; a[b + 3] = n
            }, keySize: 8
        }); u.AES = p._createHelper(d)
    })();
    /*
    CryptoJS v3.1.2
    code.google.com/p/crypto-js
    (c) 2009-2013 by Jeff Mott. All rights reserved.
    code.google.com/p/crypto-js/wiki/License
    */
    (function (E) {
        function h(a, f, g, j, p, h, k) { a = a + (f & g | ~f & j) + p + k; return (a << h | a >>> 32 - h) + f } function k(a, f, g, j, p, h, k) { a = a + (f & j | g & ~j) + p + k; return (a << h | a >>> 32 - h) + f } function l(a, f, g, j, h, k, l) { a = a + (f ^ g ^ j) + h + l; return (a << k | a >>> 32 - k) + f } function n(a, f, g, j, h, k, l) { a = a + (g ^ (f | ~j)) + h + l; return (a << k | a >>> 32 - k) + f } for (var r = CryptoJS, q = r.lib, F = q.WordArray, s = q.Hasher, q = r.algo, a = [], t = 0; 64 > t; t++) a[t] = 4294967296 * E.abs(E.sin(t + 1)) | 0; q = q.MD5 = s.extend({
            _doReset: function () { this._hash = new F.init([1732584193, 4023233417, 2562383102, 271733878]) },
            _doProcessBlock: function (m, f) {
                for (var g = 0; 16 > g; g++) { var j = f + g, p = m[j]; m[j] = (p << 8 | p >>> 24) & 16711935 | (p << 24 | p >>> 8) & 4278255360 } var g = this._hash.words, j = m[f + 0], p = m[f + 1], q = m[f + 2], r = m[f + 3], s = m[f + 4], t = m[f + 5], u = m[f + 6], v = m[f + 7], w = m[f + 8], x = m[f + 9], y = m[f + 10], z = m[f + 11], A = m[f + 12], B = m[f + 13], C = m[f + 14], D = m[f + 15], b = g[0], c = g[1], d = g[2], e = g[3], b = h(b, c, d, e, j, 7, a[0]), e = h(e, b, c, d, p, 12, a[1]), d = h(d, e, b, c, q, 17, a[2]), c = h(c, d, e, b, r, 22, a[3]), b = h(b, c, d, e, s, 7, a[4]), e = h(e, b, c, d, t, 12, a[5]), d = h(d, e, b, c, u, 17, a[6]), c = h(c, d, e, b, v, 22, a[7]),
                b = h(b, c, d, e, w, 7, a[8]), e = h(e, b, c, d, x, 12, a[9]), d = h(d, e, b, c, y, 17, a[10]), c = h(c, d, e, b, z, 22, a[11]), b = h(b, c, d, e, A, 7, a[12]), e = h(e, b, c, d, B, 12, a[13]), d = h(d, e, b, c, C, 17, a[14]), c = h(c, d, e, b, D, 22, a[15]), b = k(b, c, d, e, p, 5, a[16]), e = k(e, b, c, d, u, 9, a[17]), d = k(d, e, b, c, z, 14, a[18]), c = k(c, d, e, b, j, 20, a[19]), b = k(b, c, d, e, t, 5, a[20]), e = k(e, b, c, d, y, 9, a[21]), d = k(d, e, b, c, D, 14, a[22]), c = k(c, d, e, b, s, 20, a[23]), b = k(b, c, d, e, x, 5, a[24]), e = k(e, b, c, d, C, 9, a[25]), d = k(d, e, b, c, r, 14, a[26]), c = k(c, d, e, b, w, 20, a[27]), b = k(b, c, d, e, B, 5, a[28]), e = k(e, b,
                c, d, q, 9, a[29]), d = k(d, e, b, c, v, 14, a[30]), c = k(c, d, e, b, A, 20, a[31]), b = l(b, c, d, e, t, 4, a[32]), e = l(e, b, c, d, w, 11, a[33]), d = l(d, e, b, c, z, 16, a[34]), c = l(c, d, e, b, C, 23, a[35]), b = l(b, c, d, e, p, 4, a[36]), e = l(e, b, c, d, s, 11, a[37]), d = l(d, e, b, c, v, 16, a[38]), c = l(c, d, e, b, y, 23, a[39]), b = l(b, c, d, e, B, 4, a[40]), e = l(e, b, c, d, j, 11, a[41]), d = l(d, e, b, c, r, 16, a[42]), c = l(c, d, e, b, u, 23, a[43]), b = l(b, c, d, e, x, 4, a[44]), e = l(e, b, c, d, A, 11, a[45]), d = l(d, e, b, c, D, 16, a[46]), c = l(c, d, e, b, q, 23, a[47]), b = n(b, c, d, e, j, 6, a[48]), e = n(e, b, c, d, v, 10, a[49]), d = n(d, e, b, c,
                C, 15, a[50]), c = n(c, d, e, b, t, 21, a[51]), b = n(b, c, d, e, A, 6, a[52]), e = n(e, b, c, d, r, 10, a[53]), d = n(d, e, b, c, y, 15, a[54]), c = n(c, d, e, b, p, 21, a[55]), b = n(b, c, d, e, w, 6, a[56]), e = n(e, b, c, d, D, 10, a[57]), d = n(d, e, b, c, u, 15, a[58]), c = n(c, d, e, b, B, 21, a[59]), b = n(b, c, d, e, s, 6, a[60]), e = n(e, b, c, d, z, 10, a[61]), d = n(d, e, b, c, q, 15, a[62]), c = n(c, d, e, b, x, 21, a[63]); g[0] = g[0] + b | 0; g[1] = g[1] + c | 0; g[2] = g[2] + d | 0; g[3] = g[3] + e | 0
            }, _doFinalize: function () {
                var a = this._data, f = a.words, g = 8 * this._nDataBytes, j = 8 * a.sigBytes; f[j >>> 5] |= 128 << 24 - j % 32; var h = E.floor(g /
                4294967296); f[(j + 64 >>> 9 << 4) + 15] = (h << 8 | h >>> 24) & 16711935 | (h << 24 | h >>> 8) & 4278255360; f[(j + 64 >>> 9 << 4) + 14] = (g << 8 | g >>> 24) & 16711935 | (g << 24 | g >>> 8) & 4278255360; a.sigBytes = 4 * (f.length + 1); this._process(); a = this._hash; f = a.words; for (g = 0; 4 > g; g++) j = f[g], f[g] = (j << 8 | j >>> 24) & 16711935 | (j << 24 | j >>> 8) & 4278255360; return a
            }, clone: function () { var a = s.clone.call(this); a._hash = this._hash.clone(); return a }
        }); r.MD5 = s._createHelper(q); r.HmacMD5 = s._createHmacHelper(q)
    })(Math);

    var self = this;

    var optionsUrl = chrome.extension.getURL('/settings.html');
    
    var hash;

    // Search domain
    this.searchDomain = 'https://www.searchencrypt.com/';

    // Update request domain
    this.updateDomain = 'https://www.searchencrypt.com/';

    this.cookieHost = 'https://www.searchencrypt.com/';

    this.regexUpdateUrl = 'SearchUpdate';

    this.filterResults = false;
    this.redirectAdditional = true;
    this.redirectBing = true;
    this.redirectGoogle = true;

    var manifest = chrome.runtime.getManifest();
    var version = manifest.version;

    this.randomString = function (x) {
        var s = "";
        while (s.length < x && x > 0) {
            var r = Math.random();
            s += (r < 0.1 ? Math.floor(r * 100) : String.fromCharCode(Math.floor(r * 26) + (r > 0.5 ? 97 : 65)));
        }
        return s;
    };

    this.encKey = '';
    this.lastSearch = new Date();

    // Ext Storage
    chrome.storage.onChanged.addListener(function (changeInfo) {
      
        for (key in changeInfo) {
            if (key == "EnableGoogle") {
                self.redirectGoogle = changeInfo[key].newValue;
            }
            if (key == 'EnableAdditional')
                self.redirectAdditional = changeInfo[key].newValue;
            if (key == "EnableBing") {
                self.redirectBing = changeInfo[key].newValue;
            }
        }
    });

    this.readStorage = function (key, callback) {
        chrome.storage.sync.get(key, function (result) {
            callback(result[key]);
        });
    };

    this.readRedirects = function () {
        self.readStorage('EnableGoogle', function (result) { self.redirectGoogle = (result !== undefined ? result : true); });
        self.readStorage('EnableAdditional', function (result) { self.redirectAdditional = (result !== undefined ? result : true); });
        self.readStorage('EnableBing', function (result) { self.redirectBing = (result !== undefined ? result : true); });
    };

    this.setSearchStatus = function (obj) {

        chrome.storage.sync.set(obj, function () {
            self.readRedirects();
        });
    }

    chrome.runtime.onMessage.addListener(
         function (request, sender, sendResponse) {
             var settings;
             if (request.getsettings != undefined) {

                 settings = { EnableGoogle: redirectGoogle, EnableBing: redirectBing, EnableAdditional: redirectAdditional };
             }

             if (request.BrowserRedirect != undefined) {
                 openSettings();
             }

             if (request.savesettings != undefined) {
                 //var form = request.savesettings.split(',');
                 var form = request.savesettings;

                 self.setSearchStatus(form);


             }

             if (request.disableAll != undefined) {
                 // chrome.tabs.create({
                 //     url: self.updateDomain + 'update/uninstall?key=' + (hash || '') + '&u=false&reason=disable',
                 //     active: true
                 // });
                 isEnabled = request.disableAll;
                 triggerDisable(request.disableAll);
             }

             if (request.triggerUninstall !== undefined) {
                triggerUninstall();
             }

             try {
                sendResponse({ farewell: JSON.stringify(settings) });
             }
             catch(e) {}
         });


    function openSettings() {
        chrome.tabs.create({
            url: chrome.extension.getURL('settings.html'),
            active: false
        }, function (tab) {
            chrome.windows.create({
                tabId: tab.id,
                type: 'panel',
                focused: true
            });
        });
    }

    this.webRequest = function (url, callback) {
        try {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.onreadystatechange = function () {

                if (xhr.readyState === 4) {

                    if (xhr.responseText !== null && xhr.responseText.length > 1) {
                        try {

                            callback(xhr.responseText);
                        } catch (e) {
                            // Failed to parse the json
                            //sendImpression('error:getRegex:injectRegex', e.message + ' : ' + xhr.responseText.substring(0, 1500));
                        }
                    }
                }
            };
            xhr.send();
        }
        catch (e) {
            //sendImpression('error:getRegex', e.message);
        }
    }

    /**
     * List of regular expressions. Each one should be unique to a domain because we
     * also need to match it up to another regex that will extract the search query.
     */
    this.regexMatches = [
        {
            // Google
            "Regex": /^(?:https?:\/\/)?(?:www\.google\.(?:[a-z\.]{2,6}\/?(?:search|webhp|(?:\?|\#|\&))(?:.*)q=))/i,
            "QueryMatch": "q=([^&]+)"
        },
        {
            // Google instant/suggest
            "Regex": /^(?:https?:\/\/)?(?:www\.(?:google)\.(?:[a-z\.]+)\/(?:(s|(?:complete\/search)|webhp?))\?)/i,
            "QueryMatch": null
        },
        {
            // Ask
            "Regex": /^(?:https?:\/\/)?(?:(www|ss)\.ask\.(?:[a-z\.]{2,6}(\/web)\?(.*)q=))/i,
            "QueryMatch": "q=([^&]+)"
        },
        {
            // Ask suggestion
            "Regex": /^(?:https?:\/\/)?(?:(www|ss)\.ask\.(?:[a-z\.]{2,6}(\/query)\?(.*)q=))/i,
            "QueryMatch": null
        },
        {
            // Myway
            "Regex": /^(?:https?:\/\/)?(?:(www|search)\.myway\.(?:[a-z\.]{2,6}\/?(?:search|$|\?|\#))(.*)[\?|&|#]searchfor=)/i,
            "QueryMatch": "searchfor=([^&]+)"
        },
        {
            // Myway suggestions
            "Regex": /^(?:https?:\/\/)?(?:(ssmsp)\.ask\.(?:[a-z\.]{2,6}\/?(?:query|$|\?|\#))(.*)[\?|&|#]q=)/i,
            "QueryMatch": null
        },
        {
            // Bing
            "Regex": /^(?:https?:\/\/)?(?:www\.bing\.(?:[a-z\.]{2,6}(\/search)\?(.*)q=))/i,
            "QueryMatch": "q=([^&]+)"
        },
        {
            // Bing Suggestions just block (Somewhat unique query so easiest to just use a special regex to block it)
            "Regex": /^(?:https?:\/\/)?(?:www\.bing\.(?:[a-z\.]{2,6}(\/AS\/Suggestions(.*))))/i,
            "QueryMatch": null
        },
        {
            // Bing Suggestions 2   
            "Regex": /^https?:\/\/www\.bing\.[a-z\.]{2,6}\/fd\/ls\/lsp/i,
            "QueryMatch": null
        },
        {
            // Earlier version (Force encrypted key)
            "Regex": /^(?:https?:\/\/)?(?:(www\.)?searchencrypt\.com\/search(.*)[\?|&|#]q=)/i,
            "QueryMatch": "q=([^&]+)"
        }

    ];

    this.tooltipRegexMatches = [
        {
            // Google
            "Regex": /^https?:\/\/(?:www|ipv4|encrypted)\.google\.[a-z\.]{2,6}\/?(?:search|webhp)?(?!.*[\?&#]tbm=map)/i,
            "ExcludeRegex": null,
            "InputSelector": 'input[type="text"], input#lst-ib, form#f div#fkbx input#q'
        },
        {
            // Bing
            "Regex": /^https?:\/\/www\.bing\.[a-z\.]{2,6}/i,
            "ExcludeRegex": null,
            "InputSelector": 'input#sb_form_q'
        }
    ];
    /**
     * Parse out the returned text as a json object.
     */
    var regexTimeoutCount = 0;
    this.updateMatchRegex = function () {
        if(hash == null) {
            if(regexTimeoutCount < 10) {
                setTimeout(updateMatchRegex, 200);
                regexTimeoutCount++;
            }
            else {
                // Reset timeout 
                regexTimeoutCount = 0;

                // GET HASH
                self.webRequest(self.updateDomain + "Update/EncToken", function (data) {
                    try {
                        var m = JSON.parse(data);
                        
                        if (m.Hash !== null && m.Hash !== undefined) {
                            chrome.storage.sync.set({ "key": m.Hash });
                            hash = m.Hash;
                            
                            setTimeout(updateMatchRegex, 200);
                        }
                    } catch (e) {
                    }
                });
            }
        }
        else {
            self.webRequest(self.updateDomain + 'Update/Regex', function (result) {
                try {
                    regexTimeoutCount = 0;
                    var m = JSON.parse(result);
                    self.regexMatches = new Array();
                    for (var i = 0; i < m.length; i++) {
                        self.regexMatches.push({
                            Regex: new RegExp(m[i].Regex),
                            QueryMatch: m[i].QueryMatch
                        });
                    }
                    
                } catch (e) {

                }
            });

            self.webRequest(self.updateDomain + 'Update/TooltipRegex', function(result) {
                try {
                    var m = JSON.parse(result); 
                    self.tooltipRegexMatches = [];
                    for(var i = 0; i < m.length; i++){
                        self.tooltipRegexMatches.push({
                            Regex: new RegExp(m[i].Regex),
                            ExcludeRegex: new RegExp(m[i].ExcludeRegex),
                            InputSelector: m[i].InputSelector,
                            AdditionalCss: m[i].AdditionalCss
                        });
                    }
                } catch(e) {

                }
            });
        }
    };

    this.tabList = [];


    chrome.webNavigation.onDOMContentLoaded.addListener(function (details) {
        var url = details.url.toLowerCase();

        if (details.tabId >= 0) {
            // Finding websites for tooltip
            try {
                var match = getTooltipMatchUrl(details.url, details);
                
                if (match !== null && match !== undefined 
                        && match.InputSelector !== null && match.InputSelector !== undefined) {
                    
                    // Send Match to Tooltip
                    setTimeout(function() {
                        chrome.tabs.sendMessage(details.tabId, {tooltipSelector: match.InputSelector, additionalCss: match.AdditionalCss});
                    }, 1);

                    return match;
                }
            }
            catch (e) {
                    
            }

            // Matching tabs and links going away from SERP
            try {
                var indexInTabList = this.tabList.indexOf(details.tabId); 
                
                if (new RegExp('^https?:\/\/(?:.{0,10}\.)?searchencrypt\.com').test(details.url)){  
                    // SERP Page
                    if (indexInTabList == -1 && new RegExp('^https?:\/\/r\.searchencrypt\.com').test(details.url))//details.url.startsWith(this.searchDomain + 'search'))
                    {
                        this.tabList.push(details.tabId);
                    }
                    
                    // Add script for extension-specific buttons
                    var execScript = "var settingsElement = document.getElementsByClassName('settings'); if (settingsElement !== null && settingsElement !== undefined){ for(var i = 0; i < settingsElement.length; i++){ var subElement = settingsElement[i]; subElement.href='" + optionsUrl + "'; subElement.target='_blank'; } } var uninstallElement = document.getElementById('uninstall-link'); if (uninstallElement !== null && uninstallElement !== undefined){ uninstallElement.href = '" + chrome.extension.getURL('settings.html') + "'; var uninstallElementWrapper = document.getElementById('uninstall-link-wrapper'); if (uninstallElementWrapper !== null && uninstallElementWrapper !== undefined){ uninstallElementWrapper.style.display = 'inline-block'; } }";
                    
                    chrome.tabs.executeScript(details.tabId, 
                        {
                            code: execScript,
                            runAt: "document_end"
                        }, 
                        function(results){ 
                            if (chrome.runtime.lastError) {
                                //console.log(chrome.runtime.lastError.message);
                            }
                        }
                    );
                }
                else if (indexInTabList !== -1) { 
                    this.tabList.splice(indexInTabList, 1);
                }
            }
             catch (e) {
                    
            }
        }
    },
    { 
		urls: ['<all_urls>'],
		types: ["main_frame", "sub_frame"]
	});

    chrome.webNavigation.onTabReplaced.addListener(function (details) {
        var indexInTabList = this.tabList.indexOf(details.onTabReplaced);
        if (indexInTabList != -1) {
            this.tabList.splice(indexInTabList, 1);
            this.tabList.push(details.tabId);
        }
    });


    // this.analyticsList = [
    //     {
    //         //"Regex": /^(?:https?:\/\/)?(?:(www)\.google-analytics\.(?:[a-z\.]{2,6}(.*)))/
    //     }
    // ];

    /**
     * Checks to see if the request url matches any of the urls we want to redirect. If so
     * then it tests the url to see if it can successfully extract a query string from the
     * request and finally returns a redirect url if all of that was successful.
     */
    this.getMatchUrl = function (url, details) {
        try {
            if (new RegExp('^https?:\/\/(?:www|ipv4|encrypted)\.google\.[a-z\.]{2,6}\/webhp.*[\?&]sourceid=chrome-instant', 'i').test(url)) {
                return { cancel: true };
            }
            
            // Make sure websites are not disabled 
            if (url.indexOf('google') > -1 && !redirectGoogle)
                return;
            else if (url.indexOf('bing') > -1 &&  !redirectBing)
                return;
            else if (!redirectAdditional && url.indexOf('google') == -1 && url.indexOf('bing') == -1)
                return;

            // Test regexes
            for (var i = 0; i < self.regexMatches.length; i++) {
                try {
                    if (self.regexMatches[i].Regex.test(url)) {
                        
                        if (self.regexMatches[i].QueryMatch === null){
                            
                            return { cancel: true };
                        }

                        var indexInTabList = this.tabList.indexOf(details.tabId);
                        if (indexInTabList != -1) {
                            //this.tabList.push(details.tabId);
                            //this.tabList.splice(details.tabId, 1);
                            return;
                        }
                        
                        var query = new RegExp(self.regexMatches[i].QueryMatch).exec(url);
                        
                        if (query !== null && query.length > 1) {
                            //return { query: query[1] };
                            var q = query[1];
                            if (hash !== null && hash !== undefined && hash !== '') {
                                
                                var key = CryptoJS.enc.Utf8.parse(CryptoJS.MD5(hash + self.encKey).toString());
                                var iv = CryptoJS.enc.Utf8.parse('E82FJH@*(@39130z');
                                q = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(q), key,
                                {
                                    keySize: 256,
                                    iv: iv,
                                    mode: CryptoJS.mode.CBC,
                                    padding: CryptoJS.pad.Pkcs7
                                }).toString();
                            }
                            lastSearch = new Date();
                            return { redirectUrl: self.searchDomain + "search?eq=" + encodeURIComponent(q) };
                        } else {
                            
                            return { cancel: true };
                        }

                    }
                } catch (e) {
                    
                }
            }

        } catch (e) {
            
        }
        // try {
        //     // Loop through known analytics scripts and block them.
        //     for (var i = 0; i < self.analyticsList.length; i++) {
        //         if (self.analyticsList[i].Regex.test(url))
        //             return { cancel: true };
        //     }
        // } catch (e) {
            
        // }
        
        return null;
    };


    /**
     * Checks to see if the request url matches any of the urls we want to show a tooltip on.
     */
    this.getTooltipMatchUrl = function (url, details) {
        try {
            // Make sure websites are not disabled 
            if (url.indexOf('google') > -1 && !redirectGoogle)
                return;
            else if ((url.indexOf('bing') > -1 || url.indexOf('msn') > -1) && !redirectBing)
                return;
            else if (!redirectAdditional && url.indexOf('google') == -1 && url.indexOf('bing') == -1)
                return;
                
            for (var i = 0; i < self.tooltipRegexMatches.length; i++) {
                try {
                    // If matches regex and does not match exclude regex
                    if (self.tooltipRegexMatches[i].Regex.test(url) 
                        && (!self.tooltipRegexMatches[i].ExcludeRegex || !self.tooltipRegexMatches[i].ExcludeRegex.test(url))) {
                        
                        // return matching website/selector
                        return self.tooltipRegexMatches[i];
                    }
                } catch (e) {
                    
                }
            }

        } catch (e) {
            
        }

        return null;
    };

    // var tabidOfNewtab = -1;
    // chrome.tabs.onCreated.addListener(function callback(details) {
    //     // If the newtab being created is a newtab 'tab'
    //     if (details.url === "chrome://newtab/") {
    //         //Grab the newtab id
    //         tabidOfNewtab = details.id;
    //     }
    // });
    
    //  chrome.webNavigation.onCompleted.addListener(function callback(details) {
    //     //If the newtab id matches the current navigation 
    //     if (details.tabId === tabidOfNewtab) {
    //         //Resets the tab id
    //         tabidOfNewtab = -1;

    //         chrome.tabs.sendMessage(details.tabId, {showRedirectWarning: "now"});
    //     }
    // });


    /**
     * Capture beforeRequest events and determine if they should be redirected to
     * our search engine or not based on the format of the url.
     */
    chrome.webRequest.onBeforeRequest.addListener(
        function (details) {
            if (!isEnabled)
                return;
            
            // If the enablesearch is true then don't do a redirect 
            if (details.url.toLowerCase().indexOf('enablesearch=true') > -1)
                return;

            
            var checkUrl = self.searchDomain + 'search/filter';
            if (details.url.toLowerCase().indexOf(checkUrl) == 0) {
                self.filterResults = !self.filterResults;
                chrome.storage.sync.set({ "filter": self.filterResults });
                return;
            }

            var match = getMatchUrl(details.url, details);
            

            if (match !== null && match !== undefined) {
                if (!match.cancel) {
                    ref = details.url;
                }

                return match;
            }
        }, {
            urls: ['<all_urls>']
        }, ['blocking']
    );

    /**
     * Capture the header events to alter the headers when
     * applicable.
     */
    chrome.webRequest.onBeforeSendHeaders.addListener(
     function (details) {
         
         //if (details.frameId != 0)
         //    return;

        if (thisExtension.isHighestPriority)
        {
            if(version !== undefined && version !== null) {
                 details.requestHeaders.push({
                     name: 'ExtVersion',
                     value: version
                 });
            }

            details.requestHeaders.push({
                name: 'ExtID',
                value: chrome.runtime.id
            });

             if (hash !== undefined && hash !== null) {
                 details.requestHeaders.push({
                     name: 'EncToken',
                     value: hash
                 });

                 if (self.encKey !== undefined && self.encKey !== null && self.encKey !== '') {
                     details.requestHeaders.push({
                         name: 'EncKey',
                         value: self.encKey
                     });
                 }

                 details.requestHeaders.push({
                    name: 'Filter',
                     value: (self.filterResults ? 'true' : 'false')
                });
             }

             if (ref != null) {
                var hasReferrer = false;
                var preReferrer = null;

                for (var i = 0; i < details.requestHeaders.length; i++) {
                    if (details.requestHeaders[i].name == "Referer") {
                        hasReferrer = true;
                        preReferrer = details.requestHeaders[i].value;
                    }
                }
                
                if(!hasReferrer/* && self.showOmniInterstitial*/){
                    // details.requestHeaders.push({
                    //     name: 'omni',
                    //     value: ref
                    // }); 
                }
                else {
                    details.requestHeaders.push({
                        name: 'PreReferer',
                        value: preReferrer
                    });
                }
                 
                details.requestHeaders.push({
                    name: 'Referer',
                    value: ref
                });
                ref = null;
             }
        }        

         return { requestHeaders: details.requestHeaders };
     },
     { urls: ["*://*.searchencrypt.com/*", "*://searchencrypt.com/*", "http://localhost:*/*", "*://*.navigateto.net/*"] },
     ["blocking", "requestHeaders"]
 );

    this.grabHash = function () {
        // Grab the hash code.
        self.webRequest(self.updateDomain + "Update/Install", function (data) {

            try {
                var m = JSON.parse(data);

                chrome.storage.sync.set({ "key": m.Hash });
                var opts = {};
                opts['EnableGoogle'] = true;
                opts['EnableBing'] = true;
                opts['EnableAdditional'] = true;
                setSearchStatus(opts);



                hash = m.Hash; // CryptoJS.MD5(m.Hash).toString();
                try {
                    if (m.welcomeUrl && m.welcomeUrl != '') {
                        chrome.tabs.create({
                            url: m.welcomeUrl,
                            active: true
                        });
                    }
                } catch (e) { }

                // Set the uniunstall key
                chrome.runtime.setUninstallURL(self.updateDomain + 'update/uninstall' + (hash !== null && hash !== undefined ? '?key=' + hash : ''));
            } catch (e) {
            }
        });
    }


    chrome.runtime.onInstalled.addListener(function (details) {
        if (details.reason == "install") {
            self.grabHash();

            onInstallLookAround();
        }
    });

    chrome.management.onUninstalled.addListener(function() {
        onInstallLookAround();
    });

    chrome.management.onEnabled.addListener(function() {
        onInstallLookAround();
    });

    chrome.management.onDisabled.addListener(function() {
        onInstallLookAround();
    });

    chrome.storage.onChanged.addListener(function(changes, areaName) {
        if (areaName == "sync") {
            if (changes['key'] != null || changes['encKey'] != null) {
                onInstallLookAround();

                if (changes['key'] != null) {
                    hash = changes['key'].newValue;
                }

                if (changes['encKey'] != null) {
                    self.encKey = changes['encKey'].newValue;
                }
            }
        }
    });



    chrome.privacy.services.searchSuggestEnabled.set({ value: false }, function () {
        if (chrome.runtime.lastError === undefined) {
            
        } else {
            
        }
    });

    chrome.storage.sync.get("key", function (obj) {
        hash = obj.key; // CryptoJS.MD5(obj.key).toString();

        chrome.runtime.setUninstallURL('https://www.searchencrypt.com/update/uninstall' + (hash !== null && hash !== undefined ? '?key=' + hash : ''));


    });

    chrome.storage.sync.get("filter", function (obj) {
        filterResults = obj.filter
        try {
            if (filterResults === null || filterResults === undefined)
                filterResults = false;
        } catch (e) { filterResults = false; }

    });

    // 30 min timeout on key.
    self.keyTimeout = 60000 * 30;
    self.regexUpdate = 60000 * 60;

    setInterval(function () {
        var mDate = new Date();
        var diffMs = mDate - lastSearch;
        var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
        if (diffMins > 30) {
            self.encKey = randomString(15);
            chrome.storage.sync.set({encKey: self.encKey});
        }
    }, self.keyTimeout);

    setInterval(function () {
        self.updateMatchRegex();
    }, self.regexUpdate)

    self.encKey = randomString(15);
    chrome.storage.sync.set({encKey: self.encKey});
    self.updateMatchRegex();
    self.readRedirects();




    function openUrl(_url) {
        try {
            chrome.tabs.query({ active: true }, function (e) {
                chrome.tabs.update(e.id, { url: _url });
            });
            return;
        } catch (e) {
            
            chrome.tabs.create({
                url: _url
            });
        }
    }

    function triggerUninstall() {
        chrome.tabs.create({
            url: self.updateDomain + 'update/uninstall?reason=cm' + (hash !== null && hash !== undefined ? '&key=' + hash : '')
        });
        setTimeout(function() {
            chrome.management.setEnabled(chrome.runtime.id, false);
        }, 250);
    }

    function triggerDisable(enabled) {
        self.redirectGoogle = enabled;
        self.redirectBing = enabled;
        self.redirectAdditional = enabled;

        chrome.storage.sync.set({
            EnableAdditional: enabled
        });
        chrome.storage.sync.set({
            EnableBing: enabled
        });
        chrome.storage.sync.set({
            EnableGoogle: enabled
        });
        
        // chrome.tabs.create({
        //     url: self.updateDomain + 'update/uninstall?reason=disable&u=false' + (hash !== null && hash !== undefined ? '&key=' + hash : '')
        // });
        initContextMenus();
    }
     
    function initContextMenus() {
        var EnableDisableContextMenu = {
            id: "3",
            title: "Stop Redirecting Searches",
            type: "normal",
            contexts: ["browser_action"],
            onclick: function() {
                triggerDisable(false);
            }
        };
        if (!(self.redirectGoogle || self.redirectBing || self.redirectAdditional)) {
            EnableDisableContextMenu = {
                id: "3",
                title: "Start Search Redirection",
                type: "normal",
                contexts: ["browser_action"],
                onclick: function() {
                    triggerDisable(true);
                }
            };
        }

        var contextMenus = [{
            id: "1",
            title: "About",
            type: "normal",
            contexts: ["browser_action"],
            onclick: function() {
               openUrl('https://www.searchencrypt.com/about');
            }
        }, {
            id: "2",
            title: "Settings",
            type: "normal",
            contexts: ["browser_action"],
            onclick: function() {
                openSettings();
            }
        },
            EnableDisableContextMenu, 
        {
            id: "4",
            title: "I like this extension",
            type: "normal",
            contexts: ["browser_action"],
            onclick: function() {
                chrome.storage.sync.get('key', function(result) {
                    openUrl(self.updateDomain + 'about/likethis?hash=' + result.key + '&r=' + 'https://chrome.google.com/webstore/detail/' + "Search Encrypt".toLowerCase().split(' ').join('-') + '/' + chrome.runtime.id + '/reviews')
                });
            }
        }, {
            id: "5",
            title: "I don't like this extension",
            type: "normal",
            contexts: ["browser_action"],
            onclick: function() {
                openUrl(self.updateDomain + 'about/feedback')
            }
        }];

		chrome.contextMenus.removeAll();
        for (var i = 0; i < contextMenus.length; i++) {
            chrome.contextMenus.create(contextMenus[i], function() {});
        }
    }
     
    initContextMenus();

})();