;
window.Modernizr = (function(window, document, undefined) {
    var version = '2.8.3',
        Modernizr = {},
        enableClasses = false,
        docElement = document.documentElement,
        mod = 'modernizr',
        modElem = document.createElement(mod),
        mStyle = modElem.style,
        inputElem, toString = {}.toString,
        prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),
        omPrefixes = 'Webkit Moz O ms',
        cssomPrefixes = omPrefixes.split(' '),
        domPrefixes = omPrefixes.toLowerCase().split(' '),
        ns = {
            'svg': 'http://www.w3.org/2000/svg'
        },
        tests = {},
        inputs = {},
        attrs = {},
        classes = [],
        slice = classes.slice,
        featureName, injectElementWithStyles = function(rule, callback, nodes, testnames) {
            var style, ret, node, docOverflow, div = document.createElement('div'),
                body = document.body,
                fakeBody = body || document.createElement('body');
            if (parseInt(nodes, 10)) {
                while (nodes--) {
                    node = document.createElement('div');
                    node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
                    div.appendChild(node);
                }
            }
            style = ['&#173;', '<style id="s', mod, '">', rule, '</style>'].join('');
            div.id = mod;
            (body ? div : fakeBody).innerHTML += style;
            fakeBody.appendChild(div);
            if (!body) {
                fakeBody.style.background = '';
                fakeBody.style.overflow = 'hidden';
                docOverflow = docElement.style.overflow;
                docElement.style.overflow = 'hidden';
                docElement.appendChild(fakeBody);
            }
            ret = callback(div, rule);
            if (!body) {
                fakeBody.parentNode.removeChild(fakeBody);
                docElement.style.overflow = docOverflow;
            } else {
                div.parentNode.removeChild(div);
            }
            return !!ret;
        },
        isEventSupported = (function() {
            var TAGNAMES = {
                'select': 'input',
                'change': 'input',
                'submit': 'form',
                'reset': 'form',
                'error': 'img',
                'load': 'img',
                'abort': 'img'
            };

            function isEventSupported(eventName, element) {
                element = element || document.createElement(TAGNAMES[eventName] || 'div');
                eventName = 'on' + eventName;
                var isSupported = eventName in element;
                if (!isSupported) {
                    if (!element.setAttribute) {
                        element = document.createElement('div');
                    }
                    if (element.setAttribute && element.removeAttribute) {
                        element.setAttribute(eventName, '');
                        isSupported = is(element[eventName], 'function');
                        if (!is(element[eventName], 'undefined')) {
                            element[eventName] = undefined;
                        }
                        element.removeAttribute(eventName);
                    }
                }
                element = null;
                return isSupported;
            }
            return isEventSupported;
        })(),
        _hasOwnProperty = ({}).hasOwnProperty,
        hasOwnProp;
    if (!is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined')) {
        hasOwnProp = function(object, property) {
            return _hasOwnProperty.call(object, property);
        };
    } else {
        hasOwnProp = function(object, property) {
            return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
        };
    }
    if (!Function.prototype.bind) {
        Function.prototype.bind = function bind(that) {
            var target = this;
            if (typeof target != "function") {
                throw new TypeError();
            }
            var args = slice.call(arguments, 1),
                bound = function() {
                    if (this instanceof bound) {
                        var F = function() {};
                        F.prototype = target.prototype;
                        var self = new F();
                        var result = target.apply(self, args.concat(slice.call(arguments)));
                        if (Object(result) === result) {
                            return result;
                        }
                        return self;
                    } else {
                        return target.apply(that, args.concat(slice.call(arguments)));
                    }
                };
            return bound;
        };
    }

    function setCss(str) {
        mStyle.cssText = str;
    }

    function setCssAll(str1, str2) {
        return setCss(prefixes.join(str1 + ';') + (str2 || ''));
    }

    function is(obj, type) {
        return typeof obj === type;
    }

    function contains(str, substr) {
        return !!~('' + str).indexOf(substr);
    }

    function testProps(props, prefixed) {
        for (var i in props) {
            var prop = props[i];
            if (!contains(prop, "-") && mStyle[prop] !== undefined) {
                return prefixed == 'pfx' ? prop : true;
            }
        }
        return false;
    }

    function testDOMProps(props, obj, elem) {
        for (var i in props) {
            var item = obj[props[i]];
            if (item !== undefined) {
                if (elem === false) return props[i];
                if (is(item, 'function')) {
                    return item.bind(elem || obj);
                }
                return item;
            }
        }
        return false;
    }

    function testPropsAll(prop, prefixed, elem) {
        var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1),
            props = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');
        if (is(prefixed, "string") || is(prefixed, "undefined")) {
            return testProps(props, prefixed);
        } else {
            props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
            return testDOMProps(props, prefixed, elem);
        }
    }
    tests['touch'] = function() {
        var bool;
        if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
            bool = true;
        } else {
            injectElementWithStyles(['@media (', prefixes.join('touch-enabled),('), mod, ')', '{#modernizr{top:9px;position:absolute}}'].join(''), function(node) {
                bool = node.offsetTop === 9;
            });
        }
        return bool;
    };
    tests['rgba'] = function() {
        setCss('background-color:rgba(150,255,150,.5)');
        return contains(mStyle.backgroundColor, 'rgba');
    };
    tests['multiplebgs'] = function() {
        setCss('background:url(https://),url(https://),red url(https://)');
        return (/(url\s*\(.*?){3}/).test(mStyle.background);
    };
    tests['flexbox'] = function() {
        return testPropsAll('flexWrap');
    };
    tests['csstransitions'] = function() {
        return testPropsAll('transition');
    };
    tests['csstransforms'] = function() {
        return !!testPropsAll('transform');
    };
    tests['csstransforms3d'] = function() {
        var ret = !!testPropsAll('perspective');
        if (ret && 'webkitPerspective' in docElement.style) {
            injectElementWithStyles('@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}', function(node, rule) {
                ret = node.offsetLeft === 9 && node.offsetHeight === 3;
            });
        }
        return ret;
    };
    for (var feature in tests) {
        if (hasOwnProp(tests, feature)) {
            featureName = feature.toLowerCase();
            Modernizr[featureName] = tests[feature]();
            classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
        }
    }
    Modernizr.addTest = function(feature, test) {
        if (typeof feature == 'object') {
            for (var key in feature) {
                if (hasOwnProp(feature, key)) {
                    Modernizr.addTest(key, feature[key]);
                }
            }
        } else {
            feature = feature.toLowerCase();
            if (Modernizr[feature] !== undefined) {
                return Modernizr;
            }
            test = typeof test == 'function' ? test() : test;
            if (typeof enableClasses !== "undefined" && enableClasses) {
                docElement.className += ' ' + (test ? '' : 'no-') + feature;
            }
            Modernizr[feature] = test;
        }
        return Modernizr;
    };
    setCss('');
    modElem = inputElem = null;;
    (function(window, document) {
        var version = '3.7.0';
        var options = window.html5 || {};
        var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;
        var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;
        var supportsHtml5Styles;
        var expando = '_html5shiv';
        var expanID = 0;
        var expandoData = {};
        var supportsUnknownElements;
        (function() {
            try {
                var a = document.createElement('a');
                a.innerHTML = '<xyz></xyz>';
                supportsHtml5Styles = ('hidden' in a);
                supportsUnknownElements = a.childNodes.length == 1 || (function() {
                    (document.createElement)('a');
                    var frag = document.createDocumentFragment();
                    return (typeof frag.cloneNode == 'undefined' || typeof frag.createDocumentFragment == 'undefined' || typeof frag.createElement == 'undefined');
                }());
            } catch (e) {
                supportsHtml5Styles = true;
                supportsUnknownElements = true;
            }
        }());

        function addStyleSheet(ownerDocument, cssText) {
            var p = ownerDocument.createElement('p'),
                parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;
            p.innerHTML = 'x<style>' + cssText + '</style>';
            return parent.insertBefore(p.lastChild, parent.firstChild);
        }

        function getElements() {
            var elements = html5.elements;
            return typeof elements == 'string' ? elements.split(' ') : elements;
        }

        function getExpandoData(ownerDocument) {
            var data = expandoData[ownerDocument[expando]];
            if (!data) {
                data = {};
                expanID++;
                ownerDocument[expando] = expanID;
                expandoData[expanID] = data;
            }
            return data;
        }

        function createElement(nodeName, ownerDocument, data) {
            if (!ownerDocument) {
                ownerDocument = document;
            }
            if (supportsUnknownElements) {
                return ownerDocument.createElement(nodeName);
            }
            if (!data) {
                data = getExpandoData(ownerDocument);
            }
            var node;
            if (data.cache[nodeName]) {
                node = data.cache[nodeName].cloneNode();
            } else if (saveClones.test(nodeName)) {
                node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
            } else {
                node = data.createElem(nodeName);
            }
            return node.canHaveChildren && !reSkip.test(nodeName) && !node.tagUrn ? data.frag.appendChild(node) : node;
        }

        function createDocumentFragment(ownerDocument, data) {
            if (!ownerDocument) {
                ownerDocument = document;
            }
            if (supportsUnknownElements) {
                return ownerDocument.createDocumentFragment();
            }
            data = data || getExpandoData(ownerDocument);
            var clone = data.frag.cloneNode(),
                i = 0,
                elems = getElements(),
                l = elems.length;
            for (; i < l; i++) {
                clone.createElement(elems[i]);
            }
            return clone;
        }

        function shivMethods(ownerDocument, data) {
            if (!data.cache) {
                data.cache = {};
                data.createElem = ownerDocument.createElement;
                data.createFrag = ownerDocument.createDocumentFragment;
                data.frag = data.createFrag();
            }
            ownerDocument.createElement = function(nodeName) {
                if (!html5.shivMethods) {
                    return data.createElem(nodeName);
                }
                return createElement(nodeName, ownerDocument, data);
            };
            ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' + 'var n=f.cloneNode(),c=n.createElement;' + 'h.shivMethods&&(' +
                getElements().join().replace(/[\w\-]+/g, function(nodeName) {
                    data.createElem(nodeName);
                    data.frag.createElement(nodeName);
                    return 'c("' + nodeName + '")';
                }) + ');return n}')(html5, data.frag);
        }

        function shivDocument(ownerDocument) {
            if (!ownerDocument) {
                ownerDocument = document;
            }
            var data = getExpandoData(ownerDocument);
            if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
                data.hasCSS = !!addStyleSheet(ownerDocument, 'article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}' + 'mark{background:#FF0;color:#000}' + 'template{display:none}');
            }
            if (!supportsUnknownElements) {
                shivMethods(ownerDocument, data);
            }
            return ownerDocument;
        }
        var html5 = {
            'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video',
            'version': version,
            'shivCSS': (options.shivCSS !== false),
            'supportsUnknownElements': supportsUnknownElements,
            'shivMethods': (options.shivMethods !== false),
            'type': 'default',
            'shivDocument': shivDocument,
            createElement: createElement,
            createDocumentFragment: createDocumentFragment
        };
        window.html5 = html5;
        shivDocument(document);
    }(this, document));
    Modernizr._version = version;
    Modernizr._prefixes = prefixes;
    Modernizr._domPrefixes = domPrefixes;
    Modernizr._cssomPrefixes = cssomPrefixes;
    Modernizr.hasEvent = isEventSupported;
    Modernizr.testProp = function(prop) {
        return testProps([prop]);
    };
    Modernizr.testAllProps = testPropsAll;
    Modernizr.testStyles = injectElementWithStyles;
    Modernizr.prefixed = function(prop, obj, elem) {
        if (!obj) {
            return testPropsAll(prop, 'pfx');
        } else {
            return testPropsAll(prop, obj, elem);
        }
    };
    docElement.className = docElement.className.replace(/(^|\s)no-js(\s|$)/, '$1$2') +
        (enableClasses ? ' js ' + classes.join(' ') : '');
    return Modernizr;
})(this, this.document);
(function(a, b, c) {
    function d(a) {
        return "[object Function]" == o.call(a)
    }

    function e(a) {
        return "string" == typeof a
    }

    function f() {}

    function g(a) {
        return !a || "loaded" == a || "complete" == a || "uninitialized" == a
    }

    function h() {
        var a = p.shift();
        q = 1, a ? a.t ? m(function() {
            ("c" == a.t ? B.injectCss : B.injectJs)(a.s, 0, a.a, a.x, a.e, 1)
        }, 0) : (a(), h()) : q = 0
    }

    function i(a, c, d, e, f, i, j) {
        function k(b) {
            if (!o && g(l.readyState) && (u.r = o = 1, !q && h(), l.onload = l.onreadystatechange = null, b)) {
                "img" != a && m(function() {
                    t.removeChild(l)
                }, 50);
                for (var d in y[c]) y[c].hasOwnProperty(d) && y[c][d].onload()
            }
        }
        var j = j || B.errorTimeout,
            l = b.createElement(a),
            o = 0,
            r = 0,
            u = {
                t: d,
                s: c,
                e: f,
                a: i,
                x: j
            };
        1 === y[c] && (r = 1, y[c] = []), "object" == a ? l.data = c : (l.src = c, l.type = a), l.width = l.height = "0", l.onerror = l.onload = l.onreadystatechange = function() {
            k.call(this, r)
        }, p.splice(e, 0, u), "img" != a && (r || 2 === y[c] ? (t.insertBefore(l, s ? null : n), m(k, j)) : y[c].push(l))
    }

    function j(a, b, c, d, f) {
        return q = 0, b = b || "j", e(a) ? i("c" == b ? v : u, a, b, this.i++, c, d, f) : (p.splice(this.i++, 0, a), 1 == p.length && h()), this
    }

    function k() {
        var a = B;
        return a.loader = {
            load: j,
            i: 0
        }, a
    }
    var l = b.documentElement,
        m = a.setTimeout,
        n = b.getElementsByTagName("script")[0],
        o = {}.toString,
        p = [],
        q = 0,
        r = "MozAppearance" in l.style,
        s = r && !!b.createRange().compareNode,
        t = s ? l : n.parentNode,
        l = a.opera && "[object Opera]" == o.call(a.opera),
        l = !!b.attachEvent && !l,
        u = r ? "object" : l ? "script" : "img",
        v = l ? "script" : u,
        w = Array.isArray || function(a) {
            return "[object Array]" == o.call(a)
        },
        x = [],
        y = {},
        z = {
            timeout: function(a, b) {
                return b.length && (a.timeout = b[0]), a
            }
        },
        A, B;
    B = function(a) {
        function b(a) {
            var a = a.split("!"),
                b = x.length,
                c = a.pop(),
                d = a.length,
                c = {
                    url: c,
                    origUrl: c,
                    prefixes: a
                },
                e, f, g;
            for (f = 0; f < d; f++) g = a[f].split("="), (e = z[g.shift()]) && (c = e(c, g));
            for (f = 0; f < b; f++) c = x[f](c);
            return c
        }

        function g(a, e, f, g, h) {
            var i = b(a),
                j = i.autoCallback;
            i.url.split(".").pop().split("?").shift(), i.bypass || (e && (e = d(e) ? e : e[a] || e[g] || e[a.split("/").pop().split("?")[0]]), i.instead ? i.instead(a, e, f, g, h) : (y[i.url] ? i.noexec = !0 : y[i.url] = 1, f.load(i.url, i.forceCSS || !i.forceJS && "css" == i.url.split(".").pop().split("?").shift() ? "c" : c, i.noexec, i.attrs, i.timeout), (d(e) || d(j)) && f.load(function() {
                k(), e && e(i.origUrl, h, g), j && j(i.origUrl, h, g), y[i.url] = 2
            })))
        }

        function h(a, b) {
            function c(a, c) {
                if (a) {
                    if (e(a)) c || (j = function() {
                        var a = [].slice.call(arguments);
                        k.apply(this, a), l()
                    }), g(a, j, b, 0, h);
                    else if (Object(a) === a)
                        for (n in m = function() {
                                var b = 0,
                                    c;
                                for (c in a) a.hasOwnProperty(c) && b++;
                                return b
                            }(), a) a.hasOwnProperty(n) && (!c && !--m && (d(j) ? j = function() {
                            var a = [].slice.call(arguments);
                            k.apply(this, a), l()
                        } : j[n] = function(a) {
                            return function() {
                                var b = [].slice.call(arguments);
                                a && a.apply(this, b), l()
                            }
                        }(k[n])), g(a[n], j, b, n, h))
                } else !c && l()
            }
            var h = !!a.test,
                i = a.load || a.both,
                j = a.callback || f,
                k = j,
                l = a.complete || f,
                m, n;
            c(h ? a.yep : a.nope, !!i), i && c(i)
        }
        var i, j, l = this.yepnope.loader;
        if (e(a)) g(a, 0, l, 0);
        else if (w(a))
            for (i = 0; i < a.length; i++) j = a[i], e(j) ? g(j, 0, l, 0) : w(j) ? B(j) : Object(j) === j && h(j, l);
        else Object(a) === a && h(a, l)
    }, B.addPrefix = function(a, b) {
        z[a] = b
    }, B.addFilter = function(a) {
        x.push(a)
    }, B.errorTimeout = 1e4, null == b.readyState && b.addEventListener && (b.readyState = "loading", b.addEventListener("DOMContentLoaded", A = function() {
        b.removeEventListener("DOMContentLoaded", A, 0), b.readyState = "complete"
    }, 0)), a.yepnope = k(), a.yepnope.executeStack = h, a.yepnope.injectJs = function(a, c, d, e, i, j) {
        var k = b.createElement("script"),
            l, o, e = e || B.errorTimeout;
        k.src = a;
        for (o in d) k.setAttribute(o, d[o]);
        c = j ? h : c || f, k.onreadystatechange = k.onload = function() {
            !l && g(k.readyState) && (l = 1, c(), k.onload = k.onreadystatechange = null)
        }, m(function() {
            l || (l = 1, c(1))
        }, e), i ? k.onload() : n.parentNode.insertBefore(k, n)
    }, a.yepnope.injectCss = function(a, c, d, e, g, i) {
        var e = b.createElement("link"),
            j, c = i ? h : c || f;
        e.href = a, e.rel = "stylesheet", e.type = "text/css";
        for (j in d) e.setAttribute(j, d[j]);
        g || (n.parentNode.insertBefore(e, n), m(c, 0))
    }
})(this, document);
Modernizr.load = function() {
    yepnope.apply(window, [].slice.call(arguments, 0));
};;
/*!
 * Detectizr v2.1.0
 * http://barisaydinoglu.github.com/Detectizr/
 *
 * Written by Baris Aydinoglu (http://baris.aydinoglu.info) - Copyright 2012
 * Released under the MIT license
 *
 * Date: 2015-01-03
 */
window.Detectizr = (function(window, navigator, document, undefined) {
    var Detectizr = {},
        Modernizr = window.Modernizr,
        deviceTypes = ["tv", "tablet", "mobile", "desktop"],
        options = {
            addAllFeaturesAsClass: false,
            detectDevice: true,
            detectDeviceModel: false,
            detectScreen: false,
            detectOS: true,
            detectBrowser: true,
            detectPlugins: false
        },
        plugins2detect = [{
            name: "adobereader",
            substrs: ["Adobe", "Acrobat"],
            progIds: ["AcroPDF.PDF", "PDF.PDFCtrl.5"]
        }, {
            name: "flash",
            substrs: ["Shockwave Flash"],
            progIds: ["ShockwaveFlash.ShockwaveFlash.1"]
        }, {
            name: "wmplayer",
            substrs: ["Windows Media"],
            progIds: ["wmplayer.ocx"]
        }, {
            name: "silverlight",
            substrs: ["Silverlight"],
            progIds: ["AgControl.AgControl"]
        }, {
            name: "quicktime",
            substrs: ["QuickTime"],
            progIds: ["QuickTime.QuickTime"]
        }],
        rclass = /[\t\r\n]/g,
        docElement = document.documentElement,
        resizeTimeoutId, oldOrientation;

    function extend(obj, extObj) {
        var a, b, i;
        if (arguments.length > 2) {
            for (a = 1, b = arguments.length; a < b; a += 1) {
                extend(obj, arguments[a]);
            }
        } else {
            for (i in extObj) {
                if (extObj.hasOwnProperty(i)) {
                    obj[i] = extObj[i];
                }
            }
        }
        return obj;
    }

    function is(key) {
        return Detectizr.browser.userAgent.indexOf(key) > -1;
    }

    function test(regex) {
        return regex.test(Detectizr.browser.userAgent);
    }

    function exec(regex) {
        return regex.exec(Detectizr.browser.userAgent);
    }

    function trim(value) {
        return value.replace(/^\s+|\s+$/g, "");
    }

    function toCamel(string) {
        if (string === null || string === undefined) {
            return "";
        }
        return String(string).replace(/((\s|\-|\.)+[a-z0-9])/g, function($1) {
            return $1.toUpperCase().replace(/(\s|\-|\.)/g, "");
        });
    }

    function removeClass(element, value) {
        var class2remove = value || "",
            cur = element.nodeType === 1 && (element.className ? (" " + element.className + " ").replace(rclass, " ") : "");
        if (cur) {
            while (cur.indexOf(" " + class2remove + " ") >= 0) {
                cur = cur.replace(" " + class2remove + " ", " ");
            }
            element.className = value ? trim(cur) : "";
        }
    }

    function addVersionTest(version, major, minor) {
        if (!!version) {
            version = toCamel(version);
            if (!!major) {
                major = toCamel(major);
                addConditionalTest(version + major, true);
                if (!!minor) {
                    addConditionalTest(version + major + "_" + minor, true);
                }
            }
        }
    }

    function addConditionalTest(feature, test) {
        if (!!feature && !!Modernizr) {
            if (options.addAllFeaturesAsClass) {
                Modernizr.addTest(feature, test);
            } else {
                test = typeof test === "function" ? test() : test;
                if (test) {
                    Modernizr.addTest(feature, true);
                } else {
                    delete Modernizr[feature];
                    removeClass(docElement, feature);
                }
            }
        }
    }

    function setVersion(versionType, versionFull) {
        versionType.version = versionFull;
        var versionArray = versionFull.split(".");
        if (versionArray.length > 0) {
            versionArray = versionArray.reverse();
            versionType.major = versionArray.pop();
            if (versionArray.length > 0) {
                versionType.minor = versionArray.pop();
                if (versionArray.length > 0) {
                    versionArray = versionArray.reverse();
                    versionType.patch = versionArray.join(".");
                } else {
                    versionType.patch = "0";
                }
            } else {
                versionType.minor = "0";
            }
        } else {
            versionType.major = "0";
        }
    }

    function checkOrientation() {
        window.clearTimeout(resizeTimeoutId);
        resizeTimeoutId = window.setTimeout(function() {
            oldOrientation = Detectizr.device.orientation;
            if (window.innerHeight > window.innerWidth) {
                Detectizr.device.orientation = "portrait";
            } else {
                Detectizr.device.orientation = "landscape";
            }
            addConditionalTest(Detectizr.device.orientation, true);
            if (oldOrientation !== Detectizr.device.orientation) {
                addConditionalTest(oldOrientation, false);
            }
        }, 10);
    }

    function detectPlugin(substrs) {
        var plugins = navigator.plugins,
            plugin, haystack, pluginFoundText, j, k;
        for (j = plugins.length - 1; j >= 0; j--) {
            plugin = plugins[j];
            haystack = plugin.name + plugin.description;
            pluginFoundText = 0;
            for (k = substrs.length; k >= 0; k--) {
                if (haystack.indexOf(substrs[k]) !== -1) {
                    pluginFoundText += 1;
                }
            }
            if (pluginFoundText === substrs.length) {
                return true;
            }
        }
        return false;
    }

    function detectObject(progIds) {
        var j;
        for (j = progIds.length - 1; j >= 0; j--) {
            try {
                new ActiveXObject(progIds[j]);
            } catch (e) {}
        }
        return false;
    }

    function detect(opt) {
        var i, j, device, os, browser, plugin2detect, pluginFound;
        options = extend({}, options, opt || {});
        if (options.detectDevice) {
            Detectizr.device = {
                type: "",
                model: "",
                orientation: ""
            };
            device = Detectizr.device;
            if (test(/googletv|smarttv|smart-tv|internet.tv|netcast|nettv|appletv|boxee|kylo|roku|dlnadoc|roku|pov_tv|hbbtv|ce\-html/)) {
                device.type = deviceTypes[0];
                device.model = "smartTv";
            } else if (test(/xbox|playstation.3|wii/)) {
                device.type = deviceTypes[0];
                device.model = "gameConsole";
            } else if (test(/ip(a|ro)d/)) {
                device.type = deviceTypes[1];
                device.model = "ipad";
            } else if ((test(/tablet/) && !test(/rx-34/)) || test(/folio/)) {
                device.type = deviceTypes[1];
                device.model = String(exec(/playbook/) || "");
            } else if (test(/linux/) && test(/android/) && !test(/fennec|mobi|htc.magic|htcX06ht|nexus.one|sc-02b|fone.945/)) {
                device.type = deviceTypes[1];
                device.model = "android";
            } else if (test(/kindle/) || (test(/mac.os/) && test(/silk/))) {
                device.type = deviceTypes[1];
                device.model = "kindle";
            } else if (test(/gt-p10|sc-01c|shw-m180s|sgh-t849|sch-i800|shw-m180l|sph-p100|sgh-i987|zt180|htc(.flyer|\_flyer)|sprint.atp51|viewpad7|pandigital(sprnova|nova)|ideos.s7|dell.streak.7|advent.vega|a101it|a70bht|mid7015|next2|nook/) || (test(/mb511/) && test(/rutem/))) {
                device.type = deviceTypes[1];
                device.model = "android";
            } else if (test(/bb10/)) {
                device.type = deviceTypes[1];
                device.model = "blackberry";
            } else {
                device.model = exec(/iphone|ipod|android|blackberry|opera mini|opera mobi|skyfire|maemo|windows phone|palm|iemobile|symbian|symbianos|fennec|j2me/);
                if (device.model !== null) {
                    device.type = deviceTypes[2];
                    device.model = String(device.model);
                } else {
                    device.model = "";
                    if (test(/bolt|fennec|iris|maemo|minimo|mobi|mowser|netfront|novarra|prism|rx-34|skyfire|tear|xv6875|xv6975|google.wireless.transcoder/)) {
                        device.type = deviceTypes[2];
                    } else if (test(/opera/) && test(/windows.nt.5/) && test(/htc|xda|mini|vario|samsung\-gt\-i8000|samsung\-sgh\-i9/)) {
                        device.type = deviceTypes[2];
                    } else if ((test(/windows.(nt|xp|me|9)/) && !test(/phone/)) || test(/win(9|.9|nt)/) || test(/\(windows 8\)/)) {
                        device.type = deviceTypes[3];
                    } else if (test(/macintosh|powerpc/) && !test(/silk/)) {
                        device.type = deviceTypes[3];
                        device.model = "mac";
                    } else if (test(/linux/) && test(/x11/)) {
                        device.type = deviceTypes[3];
                    } else if (test(/solaris|sunos|bsd/)) {
                        device.type = deviceTypes[3];
                    } else if (test(/cros/)) {
                        device.type = deviceTypes[3];
                    } else if (test(/bot|crawler|spider|yahoo|ia_archiver|covario-ids|findlinks|dataparksearch|larbin|mediapartners-google|ng-search|snappy|teoma|jeeves|tineye/) && !test(/mobile/)) {
                        device.type = deviceTypes[3];
                        device.model = "crawler";
                    } else {
                        device.type = deviceTypes[2];
                    }
                }
            }
            for (i = 0, j = deviceTypes.length; i < j; i += 1) {
                addConditionalTest(deviceTypes[i], (device.type === deviceTypes[i]));
            }
            if (options.detectDeviceModel) {
                addConditionalTest(toCamel(device.model), true);
            }
        }
        if (options.detectScreen) {
            device.screen = {};
            if (!!Modernizr && !!Modernizr.mq) {
                if (Modernizr.mq("only screen and (max-width: 240px)")) {
                    device.screen.size = "veryVerySmall";
                    addConditionalTest("veryVerySmallScreen", true);
                } else if (Modernizr.mq("only screen and (max-width: 320px)")) {
                    device.screen.size = "verySmall";
                    addConditionalTest("verySmallScreen", true);
                } else if (Modernizr.mq("only screen and (max-width: 480px)")) {
                    device.screen.size = "small";
                    addConditionalTest("smallScreen", true);
                }
                if (device.type === deviceTypes[1] || device.type === deviceTypes[2]) {
                    if (Modernizr.mq("only screen and (-moz-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)")) {
                        device.screen.resolution = "high";
                        addConditionalTest("highresolution", true);
                    }
                }
            }
            if (device.type === deviceTypes[1] || device.type === deviceTypes[2]) {
                window.onresize = function(event) {
                    checkOrientation(event);
                };
                checkOrientation();
            } else {
                device.orientation = "landscape";
                addConditionalTest(device.orientation, true);
            }
        }
        if (options.detectOS) {
            Detectizr.os = {};
            os = Detectizr.os;
            if (device.model !== "") {
                if (device.model === "ipad" || device.model === "iphone" || device.model === "ipod") {
                    os.name = "ios";
                    setVersion(os, (test(/os\s([\d_]+)/) ? RegExp.$1 : "").replace(/_/g, "."));
                } else if (device.model === "android") {
                    os.name = "android";
                    setVersion(os, (test(/android\s([\d\.]+)/) ? RegExp.$1 : ""));
                } else if (device.model === "blackberry") {
                    os.name = "blackberry";
                    setVersion(os, (test(/version\/([^\s]+)/) ? RegExp.$1 : ""));
                } else if (device.model === "playbook") {
                    os.name = "blackberry";
                    setVersion(os, (test(/os ([^\s]+)/) ? RegExp.$1.replace(";", "") : ""));
                }
            }
            if (!os.name) {
                if (is("win") || is("16bit")) {
                    os.name = "windows";
                    if (is("windows nt 6.3")) {
                        setVersion(os, "8.1");
                    } else if (is("windows nt 6.2") || test(/\(windows 8\)/)) {
                        setVersion(os, "8");
                    } else if (is("windows nt 6.1")) {
                        setVersion(os, "7");
                    } else if (is("windows nt 6.0")) {
                        setVersion(os, "vista");
                    } else if (is("windows nt 5.2") || is("windows nt 5.1") || is("windows xp")) {
                        setVersion(os, "xp");
                    } else if (is("windows nt 5.0") || is("windows 2000")) {
                        setVersion(os, "2k");
                    } else if (is("winnt") || is("windows nt")) {
                        setVersion(os, "nt");
                    } else if (is("win98") || is("windows 98")) {
                        setVersion(os, "98");
                    } else if (is("win95") || is("windows 95")) {
                        setVersion(os, "95");
                    }
                } else if (is("mac") || is("darwin")) {
                    os.name = "mac os";
                    if (is("68k") || is("68000")) {
                        setVersion(os, "68k");
                    } else if (is("ppc") || is("powerpc")) {
                        setVersion(os, "ppc");
                    } else if (is("os x")) {
                        setVersion(os, (test(/os\sx\s([\d_]+)/) ? RegExp.$1 : "os x").replace(/_/g, "."));
                    }
                } else if (is("webtv")) {
                    os.name = "webtv";
                } else if (is("x11") || is("inux")) {
                    os.name = "linux";
                } else if (is("sunos")) {
                    os.name = "sun";
                } else if (is("irix")) {
                    os.name = "irix";
                } else if (is("freebsd")) {
                    os.name = "freebsd";
                } else if (is("bsd")) {
                    os.name = "bsd";
                }
            }
            if (!!os.name) {
                addConditionalTest(os.name, true);
                if (!!os.major) {
                    addVersionTest(os.name, os.major);
                    if (!!os.minor) {
                        addVersionTest(os.name, os.major, os.minor);
                    }
                }
            }
            if (test(/\sx64|\sx86|\swin64|\swow64|\samd64/)) {
                os.addressRegisterSize = "64bit";
            } else {
                os.addressRegisterSize = "32bit";
            }
            addConditionalTest(os.addressRegisterSize, true);
        }
        if (options.detectBrowser) {
            browser = Detectizr.browser;
            if (!test(/opera|webtv/) && (test(/msie\s([\d\w\.]+)/) || is("trident"))) {
                browser.engine = "trident";
                browser.name = "ie";
                if (!window.addEventListener && document.documentMode && document.documentMode === 7) {
                    setVersion(browser, "8.compat");
                } else if (test(/trident.*rv[ :](\d+)\./)) {
                    setVersion(browser, RegExp.$1);
                } else {
                    setVersion(browser, (test(/trident\/4\.0/) ? "8" : RegExp.$1));
                }
            } else if (is("firefox")) {
                browser.engine = "gecko";
                browser.name = "firefox";
                setVersion(browser, (test(/firefox\/([\d\w\.]+)/) ? RegExp.$1 : ""));
            } else if (is("gecko/")) {
                browser.engine = "gecko";
            } else if (is("opera")) {
                browser.name = "opera";
                browser.engine = "presto";
                setVersion(browser, (test(/version\/([\d\.]+)/) ? RegExp.$1 : (test(/opera(\s|\/)([\d\.]+)/) ? RegExp.$2 : "")));
            } else if (is("konqueror")) {
                browser.name = "konqueror";
            } else if (is("chrome")) {
                browser.engine = "webkit";
                browser.name = "chrome";
                setVersion(browser, (test(/chrome\/([\d\.]+)/) ? RegExp.$1 : ""));
            } else if (is("iron")) {
                browser.engine = "webkit";
                browser.name = "iron";
            } else if (is("crios")) {
                browser.name = "chrome";
                browser.engine = "webkit";
                setVersion(browser, (test(/crios\/([\d\.]+)/) ? RegExp.$1 : ""));
            } else if (is("applewebkit/")) {
                browser.name = "safari";
                browser.engine = "webkit";
                setVersion(browser, (test(/version\/([\d\.]+)/) ? RegExp.$1 : ""));
            } else if (is("mozilla/")) {
                browser.engine = "gecko";
            }
            if (!!browser.name) {
                addConditionalTest(browser.name, true);
                if (!!browser.major) {
                    addVersionTest(browser.name, browser.major);
                    if (!!browser.minor) {
                        addVersionTest(browser.name, browser.major, browser.minor);
                    }
                }
            }
            addConditionalTest(browser.engine, true);
            browser.language = navigator.userLanguage || navigator.language;
            addConditionalTest(browser.language, true);
        }
        if (options.detectPlugins) {
            browser.plugins = [];
            for (i = plugins2detect.length - 1; i >= 0; i--) {
                plugin2detect = plugins2detect[i];
                pluginFound = false;
                if (window.ActiveXObject) {
                    pluginFound = detectObject(plugin2detect.progIds);
                } else if (navigator.plugins) {
                    pluginFound = detectPlugin(plugin2detect.substrs);
                }
                if (pluginFound) {
                    browser.plugins.push(plugin2detect.name);
                    addConditionalTest(plugin2detect.name, true);
                }
            }
            if (navigator.javaEnabled()) {
                browser.plugins.push("java");
                addConditionalTest("java", true);
            }
        }
    }
    Detectizr.detect = function(settings) {
        return detect(settings);
    };
    Detectizr.init = function() {
        if (Detectizr !== undefined) {
            Detectizr.browser = {
                userAgent: (navigator.userAgent || navigator.vendor || window.opera).toLowerCase()
            };
            Detectizr.detect();
        }
    };
    Detectizr.init();
    return Detectizr;
}(this, this.navigator, this.document));
/*! jQuery v1.8.3 jquery.com | jquery.org/license */
(function(e, t) {
    function _(e) {
        var t = M[e] = {};
        return v.each(e.split(y), function(e, n) {
            t[n] = !0
        }), t
    }

    function H(e, n, r) {
        if (r === t && e.nodeType === 1) {
            var i = "data-" + n.replace(P, "-$1").toLowerCase();
            r = e.getAttribute(i);
            if (typeof r == "string") {
                try {
                    r = r === "true" ? !0 : r === "false" ? !1 : r === "null" ? null : +r + "" === r ? +r : D.test(r) ? v.parseJSON(r) : r
                } catch (s) {}
                v.data(e, n, r)
            } else r = t
        }
        return r
    }

    function B(e) {
        var t;
        for (t in e) {
            if (t === "data" && v.isEmptyObject(e[t])) continue;
            if (t !== "toJSON") return !1
        }
        return !0
    }

    function et() {
        return !1
    }

    function tt() {
        return !0
    }

    function ut(e) {
        return !e || !e.parentNode || e.parentNode.nodeType === 11
    }

    function at(e, t) {
        do e = e[t]; while (e && e.nodeType !== 1);
        return e
    }

    function ft(e, t, n) {
        t = t || 0;
        if (v.isFunction(t)) return v.grep(e, function(e, r) {
            var i = !!t.call(e, r, e);
            return i === n
        });
        if (t.nodeType) return v.grep(e, function(e, r) {
            return e === t === n
        });
        if (typeof t == "string") {
            var r = v.grep(e, function(e) {
                return e.nodeType === 1
            });
            if (it.test(t)) return v.filter(t, r, !n);
            t = v.filter(t, r)
        }
        return v.grep(e, function(e, r) {
            return v.inArray(e, t) >= 0 === n
        })
    }

    function lt(e) {
        var t = ct.split("|"),
            n = e.createDocumentFragment();
        if (n.createElement)
            while (t.length) n.createElement(t.pop());
        return n
    }

    function Lt(e, t) {
        return e.getElementsByTagName(t)[0] || e.appendChild(e.ownerDocument.createElement(t))
    }

    function At(e, t) {
        if (t.nodeType !== 1 || !v.hasData(e)) return;
        var n, r, i, s = v._data(e),
            o = v._data(t, s),
            u = s.events;
        if (u) {
            delete o.handle, o.events = {};
            for (n in u)
                for (r = 0, i = u[n].length; r < i; r++) v.event.add(t, n, u[n][r])
        }
        o.data && (o.data = v.extend({}, o.data))
    }

    function Ot(e, t) {
        var n;
        if (t.nodeType !== 1) return;
        t.clearAttributes && t.clearAttributes(), t.mergeAttributes && t.mergeAttributes(e), n = t.nodeName.toLowerCase(), n === "object" ? (t.parentNode && (t.outerHTML = e.outerHTML), v.support.html5Clone && e.innerHTML && !v.trim(t.innerHTML) && (t.innerHTML = e.innerHTML)) : n === "input" && Et.test(e.type) ? (t.defaultChecked = t.checked = e.checked, t.value !== e.value && (t.value = e.value)) : n === "option" ? t.selected = e.defaultSelected : n === "input" || n === "textarea" ? t.defaultValue = e.defaultValue : n === "script" && t.text !== e.text && (t.text = e.text), t.removeAttribute(v.expando)
    }

    function Mt(e) {
        return typeof e.getElementsByTagName != "undefined" ? e.getElementsByTagName("*") : typeof e.querySelectorAll != "undefined" ? e.querySelectorAll("*") : []
    }

    function _t(e) {
        Et.test(e.type) && (e.defaultChecked = e.checked)
    }

    function Qt(e, t) {
        if (t in e) return t;
        var n = t.charAt(0).toUpperCase() + t.slice(1),
            r = t,
            i = Jt.length;
        while (i--) {
            t = Jt[i] + n;
            if (t in e) return t
        }
        return r
    }

    function Gt(e, t) {
        return e = t || e, v.css(e, "display") === "none" || !v.contains(e.ownerDocument, e)
    }

    function Yt(e, t) {
        var n, r, i = [],
            s = 0,
            o = e.length;
        for (; s < o; s++) {
            n = e[s];
            if (!n.style) continue;
            i[s] = v._data(n, "olddisplay"), t ? (!i[s] && n.style.display === "none" && (n.style.display = ""), n.style.display === "" && Gt(n) && (i[s] = v._data(n, "olddisplay", nn(n.nodeName)))) : (r = Dt(n, "display"), !i[s] && r !== "none" && v._data(n, "olddisplay", r))
        }
        for (s = 0; s < o; s++) {
            n = e[s];
            if (!n.style) continue;
            if (!t || n.style.display === "none" || n.style.display === "") n.style.display = t ? i[s] || "" : "none"
        }
        return e
    }

    function Zt(e, t, n) {
        var r = Rt.exec(t);
        return r ? Math.max(0, r[1] - (n || 0)) + (r[2] || "px") : t
    }

    function en(e, t, n, r) {
        var i = n === (r ? "border" : "content") ? 4 : t === "width" ? 1 : 0,
            s = 0;
        for (; i < 4; i += 2) n === "margin" && (s += v.css(e, n + $t[i], !0)), r ? (n === "content" && (s -= parseFloat(Dt(e, "padding" + $t[i])) || 0), n !== "margin" && (s -= parseFloat(Dt(e, "border" + $t[i] + "Width")) || 0)) : (s += parseFloat(Dt(e, "padding" + $t[i])) || 0, n !== "padding" && (s += parseFloat(Dt(e, "border" + $t[i] + "Width")) || 0));
        return s
    }

    function tn(e, t, n) {
        var r = t === "width" ? e.offsetWidth : e.offsetHeight,
            i = !0,
            s = v.support.boxSizing && v.css(e, "boxSizing") === "border-box";
        if (r <= 0 || r == null) {
            r = Dt(e, t);
            if (r < 0 || r == null) r = e.style[t];
            if (Ut.test(r)) return r;
            i = s && (v.support.boxSizingReliable || r === e.style[t]), r = parseFloat(r) || 0
        }
        return r + en(e, t, n || (s ? "border" : "content"), i) + "px"
    }

    function nn(e) {
        if (Wt[e]) return Wt[e];
        var t = v("<" + e + ">").appendTo(i.body),
            n = t.css("display");
        t.remove();
        if (n === "none" || n === "") {
            Pt = i.body.appendChild(Pt || v.extend(i.createElement("iframe"), {
                frameBorder: 0,
                width: 0,
                height: 0
            }));
            if (!Ht || !Pt.createElement) Ht = (Pt.contentWindow || Pt.contentDocument).document, Ht.write("<!doctype html><html><body>"), Ht.close();
            t = Ht.body.appendChild(Ht.createElement(e)), n = Dt(t, "display"), i.body.removeChild(Pt)
        }
        return Wt[e] = n, n
    }

    function fn(e, t, n, r) {
        var i;
        if (v.isArray(t)) v.each(t, function(t, i) {
            n || sn.test(e) ? r(e, i) : fn(e + "[" + (typeof i == "object" ? t : "") + "]", i, n, r)
        });
        else if (!n && v.type(t) === "object")
            for (i in t) fn(e + "[" + i + "]", t[i], n, r);
        else r(e, t)
    }

    function Cn(e) {
        return function(t, n) {
            typeof t != "string" && (n = t, t = "*");
            var r, i, s, o = t.toLowerCase().split(y),
                u = 0,
                a = o.length;
            if (v.isFunction(n))
                for (; u < a; u++) r = o[u], s = /^\+/.test(r), s && (r = r.substr(1) || "*"), i = e[r] = e[r] || [], i[s ? "unshift" : "push"](n)
        }
    }

    function kn(e, n, r, i, s, o) {
        s = s || n.dataTypes[0], o = o || {}, o[s] = !0;
        var u, a = e[s],
            f = 0,
            l = a ? a.length : 0,
            c = e === Sn;
        for (; f < l && (c || !u); f++) u = a[f](n, r, i), typeof u == "string" && (!c || o[u] ? u = t : (n.dataTypes.unshift(u), u = kn(e, n, r, i, u, o)));
        return (c || !u) && !o["*"] && (u = kn(e, n, r, i, "*", o)), u
    }

    function Ln(e, n) {
        var r, i, s = v.ajaxSettings.flatOptions || {};
        for (r in n) n[r] !== t && ((s[r] ? e : i || (i = {}))[r] = n[r]);
        i && v.extend(!0, e, i)
    }

    function An(e, n, r) {
        var i, s, o, u, a = e.contents,
            f = e.dataTypes,
            l = e.responseFields;
        for (s in l) s in r && (n[l[s]] = r[s]);
        while (f[0] === "*") f.shift(), i === t && (i = e.mimeType || n.getResponseHeader("content-type"));
        if (i)
            for (s in a)
                if (a[s] && a[s].test(i)) {
                    f.unshift(s);
                    break
                }
        if (f[0] in r) o = f[0];
        else {
            for (s in r) {
                if (!f[0] || e.converters[s + " " + f[0]]) {
                    o = s;
                    break
                }
                u || (u = s)
            }
            o = o || u
        }
        if (o) return o !== f[0] && f.unshift(o), r[o]
    }

    function On(e, t) {
        var n, r, i, s, o = e.dataTypes.slice(),
            u = o[0],
            a = {},
            f = 0;
        e.dataFilter && (t = e.dataFilter(t, e.dataType));
        if (o[1])
            for (n in e.converters) a[n.toLowerCase()] = e.converters[n];
        for (; i = o[++f];)
            if (i !== "*") {
                if (u !== "*" && u !== i) {
                    n = a[u + " " + i] || a["* " + i];
                    if (!n)
                        for (r in a) {
                            s = r.split(" ");
                            if (s[1] === i) {
                                n = a[u + " " + s[0]] || a["* " + s[0]];
                                if (n) {
                                    n === !0 ? n = a[r] : a[r] !== !0 && (i = s[0], o.splice(f--, 0, i));
                                    break
                                }
                            }
                        }
                    if (n !== !0)
                        if (n && e["throws"]) t = n(t);
                        else try {
                            t = n(t)
                        } catch (l) {
                            return {
                                state: "parsererror",
                                error: n ? l : "No conversion from " + u + " to " + i
                            }
                        }
                }
                u = i
            }
        return {
            state: "success",
            data: t
        }
    }

    function Fn() {
        try {
            return new e.XMLHttpRequest
        } catch (t) {}
    }

    function In() {
        try {
            return new e.ActiveXObject("Microsoft.XMLHTTP")
        } catch (t) {}
    }

    function $n() {
        return setTimeout(function() {
            qn = t
        }, 0), qn = v.now()
    }

    function Jn(e, t) {
        v.each(t, function(t, n) {
            var r = (Vn[t] || []).concat(Vn["*"]),
                i = 0,
                s = r.length;
            for (; i < s; i++)
                if (r[i].call(e, t, n)) return
        })
    }

    function Kn(e, t, n) {
        var r, i = 0,
            s = 0,
            o = Xn.length,
            u = v.Deferred().always(function() {
                delete a.elem
            }),
            a = function() {
                var t = qn || $n(),
                    n = Math.max(0, f.startTime + f.duration - t),
                    r = n / f.duration || 0,
                    i = 1 - r,
                    s = 0,
                    o = f.tweens.length;
                for (; s < o; s++) f.tweens[s].run(i);
                return u.notifyWith(e, [f, i, n]), i < 1 && o ? n : (u.resolveWith(e, [f]), !1)
            },
            f = u.promise({
                elem: e,
                props: v.extend({}, t),
                opts: v.extend(!0, {
                    specialEasing: {}
                }, n),
                originalProperties: t,
                originalOptions: n,
                startTime: qn || $n(),
                duration: n.duration,
                tweens: [],
                createTween: function(t, n, r) {
                    var i = v.Tween(e, f.opts, t, n, f.opts.specialEasing[t] || f.opts.easing);
                    return f.tweens.push(i), i
                },
                stop: function(t) {
                    var n = 0,
                        r = t ? f.tweens.length : 0;
                    for (; n < r; n++) f.tweens[n].run(1);
                    return t ? u.resolveWith(e, [f, t]) : u.rejectWith(e, [f, t]), this
                }
            }),
            l = f.props;
        Qn(l, f.opts.specialEasing);
        for (; i < o; i++) {
            r = Xn[i].call(f, e, l, f.opts);
            if (r) return r
        }
        return Jn(f, l), v.isFunction(f.opts.start) && f.opts.start.call(e, f), v.fx.timer(v.extend(a, {
            anim: f,
            queue: f.opts.queue,
            elem: e
        })), f.progress(f.opts.progress).done(f.opts.done, f.opts.complete).fail(f.opts.fail).always(f.opts.always)
    }

    function Qn(e, t) {
        var n, r, i, s, o;
        for (n in e) {
            r = v.camelCase(n), i = t[r], s = e[n], v.isArray(s) && (i = s[1], s = e[n] = s[0]), n !== r && (e[r] = s, delete e[n]), o = v.cssHooks[r];
            if (o && "expand" in o) {
                s = o.expand(s), delete e[r];
                for (n in s) n in e || (e[n] = s[n], t[n] = i)
            } else t[r] = i
        }
    }

    function Gn(e, t, n) {
        var r, i, s, o, u, a, f, l, c, h = this,
            p = e.style,
            d = {},
            m = [],
            g = e.nodeType && Gt(e);
        n.queue || (l = v._queueHooks(e, "fx"), l.unqueued == null && (l.unqueued = 0, c = l.empty.fire, l.empty.fire = function() {
            l.unqueued || c()
        }), l.unqueued++, h.always(function() {
            h.always(function() {
                l.unqueued--, v.queue(e, "fx").length || l.empty.fire()
            })
        })), e.nodeType === 1 && ("height" in t || "width" in t) && (n.overflow = [p.overflow, p.overflowX, p.overflowY], v.css(e, "display") === "inline" && v.css(e, "float") === "none" && (!v.support.inlineBlockNeedsLayout || nn(e.nodeName) === "inline" ? p.display = "inline-block" : p.zoom = 1)), n.overflow && (p.overflow = "hidden", v.support.shrinkWrapBlocks || h.done(function() {
            p.overflow = n.overflow[0], p.overflowX = n.overflow[1], p.overflowY = n.overflow[2]
        }));
        for (r in t) {
            s = t[r];
            if (Un.exec(s)) {
                delete t[r], a = a || s === "toggle";
                if (s === (g ? "hide" : "show")) continue;
                m.push(r)
            }
        }
        o = m.length;
        if (o) {
            u = v._data(e, "fxshow") || v._data(e, "fxshow", {}), "hidden" in u && (g = u.hidden), a && (u.hidden = !g), g ? v(e).show() : h.done(function() {
                v(e).hide()
            }), h.done(function() {
                var t;
                v.removeData(e, "fxshow", !0);
                for (t in d) v.style(e, t, d[t])
            });
            for (r = 0; r < o; r++) i = m[r], f = h.createTween(i, g ? u[i] : 0), d[i] = u[i] || v.style(e, i), i in u || (u[i] = f.start, g && (f.end = f.start, f.start = i === "width" || i === "height" ? 1 : 0))
        }
    }

    function Yn(e, t, n, r, i) {
        return new Yn.prototype.init(e, t, n, r, i)
    }

    function Zn(e, t) {
        var n, r = {
                height: e
            },
            i = 0;
        t = t ? 1 : 0;
        for (; i < 4; i += 2 - t) n = $t[i], r["margin" + n] = r["padding" + n] = e;
        return t && (r.opacity = r.width = e), r
    }

    function tr(e) {
        return v.isWindow(e) ? e : e.nodeType === 9 ? e.defaultView || e.parentWindow : !1
    }
    var n, r, i = e.document,
        s = e.location,
        o = e.navigator,
        u = e.jQuery,
        a = e.$,
        f = Array.prototype.push,
        l = Array.prototype.slice,
        c = Array.prototype.indexOf,
        h = Object.prototype.toString,
        p = Object.prototype.hasOwnProperty,
        d = String.prototype.trim,
        v = function(e, t) {
            return new v.fn.init(e, t, n)
        },
        m = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,
        g = /\S/,
        y = /\s+/,
        b = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
        w = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,
        E = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        S = /^[\],:{}\s]*$/,
        x = /(?:^|:|,)(?:\s*\[)+/g,
        T = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
        N = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g,
        C = /^-ms-/,
        k = /-([\da-z])/gi,
        L = function(e, t) {
            return (t + "").toUpperCase()
        },
        A = function() {
            i.addEventListener ? (i.removeEventListener("DOMContentLoaded", A, !1), v.ready()) : i.readyState === "complete" && (i.detachEvent("onreadystatechange", A), v.ready())
        },
        O = {};
    v.fn = v.prototype = {
        constructor: v,
        init: function(e, n, r) {
            var s, o, u, a;
            if (!e) return this;
            if (e.nodeType) return this.context = this[0] = e, this.length = 1, this;
            if (typeof e == "string") {
                e.charAt(0) === "<" && e.charAt(e.length - 1) === ">" && e.length >= 3 ? s = [null, e, null] : s = w.exec(e);
                if (s && (s[1] || !n)) {
                    if (s[1]) return n = n instanceof v ? n[0] : n, a = n && n.nodeType ? n.ownerDocument || n : i, e = v.parseHTML(s[1], a, !0), E.test(s[1]) && v.isPlainObject(n) && this.attr.call(e, n, !0), v.merge(this, e);
                    o = i.getElementById(s[2]);
                    if (o && o.parentNode) {
                        if (o.id !== s[2]) return r.find(e);
                        this.length = 1, this[0] = o
                    }
                    return this.context = i, this.selector = e, this
                }
                return !n || n.jquery ? (n || r).find(e) : this.constructor(n).find(e)
            }
            return v.isFunction(e) ? r.ready(e) : (e.selector !== t && (this.selector = e.selector, this.context = e.context), v.makeArray(e, this))
        },
        selector: "",
        jquery: "1.8.3",
        length: 0,
        size: function() {
            return this.length
        },
        toArray: function() {
            return l.call(this)
        },
        get: function(e) {
            return e == null ? this.toArray() : e < 0 ? this[this.length + e] : this[e]
        },
        pushStack: function(e, t, n) {
            var r = v.merge(this.constructor(), e);
            return r.prevObject = this, r.context = this.context, t === "find" ? r.selector = this.selector + (this.selector ? " " : "") + n : t && (r.selector = this.selector + "." + t + "(" + n + ")"), r
        },
        each: function(e, t) {
            return v.each(this, e, t)
        },
        ready: function(e) {
            return v.ready.promise().done(e), this
        },
        eq: function(e) {
            return e = +e, e === -1 ? this.slice(e) : this.slice(e, e + 1)
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        slice: function() {
            return this.pushStack(l.apply(this, arguments), "slice", l.call(arguments).join(","))
        },
        map: function(e) {
            return this.pushStack(v.map(this, function(t, n) {
                return e.call(t, n, t)
            }))
        },
        end: function() {
            return this.prevObject || this.constructor(null)
        },
        push: f,
        sort: [].sort,
        splice: [].splice
    }, v.fn.init.prototype = v.fn, v.extend = v.fn.extend = function() {
        var e, n, r, i, s, o, u = arguments[0] || {},
            a = 1,
            f = arguments.length,
            l = !1;
        typeof u == "boolean" && (l = u, u = arguments[1] || {}, a = 2), typeof u != "object" && !v.isFunction(u) && (u = {}), f === a && (u = this, --a);
        for (; a < f; a++)
            if ((e = arguments[a]) != null)
                for (n in e) {
                    r = u[n], i = e[n];
                    if (u === i) continue;
                    l && i && (v.isPlainObject(i) || (s = v.isArray(i))) ? (s ? (s = !1, o = r && v.isArray(r) ? r : []) : o = r && v.isPlainObject(r) ? r : {}, u[n] = v.extend(l, o, i)) : i !== t && (u[n] = i)
                }
            return u
    }, v.extend({
        noConflict: function(t) {
            return e.$ === v && (e.$ = a), t && e.jQuery === v && (e.jQuery = u), v
        },
        isReady: !1,
        readyWait: 1,
        holdReady: function(e) {
            e ? v.readyWait++ : v.ready(!0)
        },
        ready: function(e) {
            if (e === !0 ? --v.readyWait : v.isReady) return;
            if (!i.body) return setTimeout(v.ready, 1);
            v.isReady = !0;
            if (e !== !0 && --v.readyWait > 0) return;
            r.resolveWith(i, [v]), v.fn.trigger && v(i).trigger("ready").off("ready")
        },
        isFunction: function(e) {
            return v.type(e) === "function"
        },
        isArray: Array.isArray || function(e) {
            return v.type(e) === "array"
        },
        isWindow: function(e) {
            return e != null && e == e.window
        },
        isNumeric: function(e) {
            return !isNaN(parseFloat(e)) && isFinite(e)
        },
        type: function(e) {
            return e == null ? String(e) : O[h.call(e)] || "object"
        },
        isPlainObject: function(e) {
            if (!e || v.type(e) !== "object" || e.nodeType || v.isWindow(e)) return !1;
            try {
                if (e.constructor && !p.call(e, "constructor") && !p.call(e.constructor.prototype, "isPrototypeOf")) return !1
            } catch (n) {
                return !1
            }
            var r;
            for (r in e);
            return r === t || p.call(e, r)
        },
        isEmptyObject: function(e) {
            var t;
            for (t in e) return !1;
            return !0
        },
        error: function(e) {
            throw new Error(e)
        },
        parseHTML: function(e, t, n) {
            var r;
            return !e || typeof e != "string" ? null : (typeof t == "boolean" && (n = t, t = 0), t = t || i, (r = E.exec(e)) ? [t.createElement(r[1])] : (r = v.buildFragment([e], t, n ? null : []), v.merge([], (r.cacheable ? v.clone(r.fragment) : r.fragment).childNodes)))
        },
        parseJSON: function(t) {
            if (!t || typeof t != "string") return null;
            t = v.trim(t);
            if (e.JSON && e.JSON.parse) return e.JSON.parse(t);
            if (S.test(t.replace(T, "@").replace(N, "]").replace(x, ""))) return (new Function("return " + t))();
            v.error("Invalid JSON: " + t)
        },
        parseXML: function(n) {
            var r, i;
            if (!n || typeof n != "string") return null;
            try {
                e.DOMParser ? (i = new DOMParser, r = i.parseFromString(n, "text/xml")) : (r = new ActiveXObject("Microsoft.XMLDOM"), r.async = "false", r.loadXML(n))
            } catch (s) {
                r = t
            }
            return (!r || !r.documentElement || r.getElementsByTagName("parsererror").length) && v.error("Invalid XML: " + n), r
        },
        noop: function() {},
        globalEval: function(t) {
            t && g.test(t) && (e.execScript || function(t) {
                e.eval.call(e, t)
            })(t)
        },
        camelCase: function(e) {
            return e.replace(C, "ms-").replace(k, L)
        },
        nodeName: function(e, t) {
            return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
        },
        each: function(e, n, r) {
            var i, s = 0,
                o = e.length,
                u = o === t || v.isFunction(e);
            if (r) {
                if (u) {
                    for (i in e)
                        if (n.apply(e[i], r) === !1) break
                } else
                    for (; s < o;)
                        if (n.apply(e[s++], r) === !1) break
            } else if (u) {
                for (i in e)
                    if (n.call(e[i], i, e[i]) === !1) break
            } else
                for (; s < o;)
                    if (n.call(e[s], s, e[s++]) === !1) break; return e
        },
        trim: d && !d.call("\ufeff\u00a0") ? function(e) {
            return e == null ? "" : d.call(e)
        } : function(e) {
            return e == null ? "" : (e + "").replace(b, "")
        },
        makeArray: function(e, t) {
            var n, r = t || [];
            return e != null && (n = v.type(e), e.length == null || n === "string" || n === "function" || n === "regexp" || v.isWindow(e) ? f.call(r, e) : v.merge(r, e)), r
        },
        inArray: function(e, t, n) {
            var r;
            if (t) {
                if (c) return c.call(t, e, n);
                r = t.length, n = n ? n < 0 ? Math.max(0, r + n) : n : 0;
                for (; n < r; n++)
                    if (n in t && t[n] === e) return n
            }
            return -1
        },
        merge: function(e, n) {
            var r = n.length,
                i = e.length,
                s = 0;
            if (typeof r == "number")
                for (; s < r; s++) e[i++] = n[s];
            else
                while (n[s] !== t) e[i++] = n[s++];
            return e.length = i, e
        },
        grep: function(e, t, n) {
            var r, i = [],
                s = 0,
                o = e.length;
            n = !!n;
            for (; s < o; s++) r = !!t(e[s], s), n !== r && i.push(e[s]);
            return i
        },
        map: function(e, n, r) {
            var i, s, o = [],
                u = 0,
                a = e.length,
                f = e instanceof v || a !== t && typeof a == "number" && (a > 0 && e[0] && e[a - 1] || a === 0 || v.isArray(e));
            if (f)
                for (; u < a; u++) i = n(e[u], u, r), i != null && (o[o.length] = i);
            else
                for (s in e) i = n(e[s], s, r), i != null && (o[o.length] = i);
            return o.concat.apply([], o)
        },
        guid: 1,
        proxy: function(e, n) {
            var r, i, s;
            return typeof n == "string" && (r = e[n], n = e, e = r), v.isFunction(e) ? (i = l.call(arguments, 2), s = function() {
                return e.apply(n, i.concat(l.call(arguments)))
            }, s.guid = e.guid = e.guid || v.guid++, s) : t
        },
        access: function(e, n, r, i, s, o, u) {
            var a, f = r == null,
                l = 0,
                c = e.length;
            if (r && typeof r == "object") {
                for (l in r) v.access(e, n, l, r[l], 1, o, i);
                s = 1
            } else if (i !== t) {
                a = u === t && v.isFunction(i), f && (a ? (a = n, n = function(e, t, n) {
                    return a.call(v(e), n)
                }) : (n.call(e, i), n = null));
                if (n)
                    for (; l < c; l++) n(e[l], r, a ? i.call(e[l], l, n(e[l], r)) : i, u);
                s = 1
            }
            return s ? e : f ? n.call(e) : c ? n(e[0], r) : o
        },
        now: function() {
            return (new Date).getTime()
        }
    }), v.ready.promise = function(t) {
        if (!r) {
            r = v.Deferred();
            if (i.readyState === "complete") setTimeout(v.ready, 1);
            else if (i.addEventListener) i.addEventListener("DOMContentLoaded", A, !1), e.addEventListener("load", v.ready, !1);
            else {
                i.attachEvent("onreadystatechange", A), e.attachEvent("onload", v.ready);
                var n = !1;
                try {
                    n = e.frameElement == null && i.documentElement
                } catch (s) {}
                n && n.doScroll && function o() {
                    if (!v.isReady) {
                        try {
                            n.doScroll("left")
                        } catch (e) {
                            return setTimeout(o, 50)
                        }
                        v.ready()
                    }
                }()
            }
        }
        return r.promise(t)
    }, v.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(e, t) {
        O["[object " + t + "]"] = t.toLowerCase()
    }), n = v(i);
    var M = {};
    v.Callbacks = function(e) {
        e = typeof e == "string" ? M[e] || _(e) : v.extend({}, e);
        var n, r, i, s, o, u, a = [],
            f = !e.once && [],
            l = function(t) {
                n = e.memory && t, r = !0, u = s || 0, s = 0, o = a.length, i = !0;
                for (; a && u < o; u++)
                    if (a[u].apply(t[0], t[1]) === !1 && e.stopOnFalse) {
                        n = !1;
                        break
                    }
                i = !1, a && (f ? f.length && l(f.shift()) : n ? a = [] : c.disable())
            },
            c = {
                add: function() {
                    if (a) {
                        var t = a.length;
                        (function r(t) {
                            v.each(t, function(t, n) {
                                var i = v.type(n);
                                i === "function" ? (!e.unique || !c.has(n)) && a.push(n) : n && n.length && i !== "string" && r(n)
                            })
                        })(arguments), i ? o = a.length : n && (s = t, l(n))
                    }
                    return this
                },
                remove: function() {
                    return a && v.each(arguments, function(e, t) {
                        var n;
                        while ((n = v.inArray(t, a, n)) > -1) a.splice(n, 1), i && (n <= o && o--, n <= u && u--)
                    }), this
                },
                has: function(e) {
                    return v.inArray(e, a) > -1
                },
                empty: function() {
                    return a = [], this
                },
                disable: function() {
                    return a = f = n = t, this
                },
                disabled: function() {
                    return !a
                },
                lock: function() {
                    return f = t, n || c.disable(), this
                },
                locked: function() {
                    return !f
                },
                fireWith: function(e, t) {
                    return t = t || [], t = [e, t.slice ? t.slice() : t], a && (!r || f) && (i ? f.push(t) : l(t)), this
                },
                fire: function() {
                    return c.fireWith(this, arguments), this
                },
                fired: function() {
                    return !!r
                }
            };
        return c
    }, v.extend({
        Deferred: function(e) {
            var t = [
                    ["resolve", "done", v.Callbacks("once memory"), "resolved"],
                    ["reject", "fail", v.Callbacks("once memory"), "rejected"],
                    ["notify", "progress", v.Callbacks("memory")]
                ],
                n = "pending",
                r = {
                    state: function() {
                        return n
                    },
                    always: function() {
                        return i.done(arguments).fail(arguments), this
                    },
                    then: function() {
                        var e = arguments;
                        return v.Deferred(function(n) {
                            v.each(t, function(t, r) {
                                var s = r[0],
                                    o = e[t];
                                i[r[1]](v.isFunction(o) ? function() {
                                    var e = o.apply(this, arguments);
                                    e && v.isFunction(e.promise) ? e.promise().done(n.resolve).fail(n.reject).progress(n.notify) : n[s + "With"](this === i ? n : this, [e])
                                } : n[s])
                            }), e = null
                        }).promise()
                    },
                    promise: function(e) {
                        return e != null ? v.extend(e, r) : r
                    }
                },
                i = {};
            return r.pipe = r.then, v.each(t, function(e, s) {
                var o = s[2],
                    u = s[3];
                r[s[1]] = o.add, u && o.add(function() {
                    n = u
                }, t[e ^ 1][2].disable, t[2][2].lock), i[s[0]] = o.fire, i[s[0] + "With"] = o.fireWith
            }), r.promise(i), e && e.call(i, i), i
        },
        when: function(e) {
            var t = 0,
                n = l.call(arguments),
                r = n.length,
                i = r !== 1 || e && v.isFunction(e.promise) ? r : 0,
                s = i === 1 ? e : v.Deferred(),
                o = function(e, t, n) {
                    return function(r) {
                        t[e] = this, n[e] = arguments.length > 1 ? l.call(arguments) : r, n === u ? s.notifyWith(t, n) : --i || s.resolveWith(t, n)
                    }
                },
                u, a, f;
            if (r > 1) {
                u = new Array(r), a = new Array(r), f = new Array(r);
                for (; t < r; t++) n[t] && v.isFunction(n[t].promise) ? n[t].promise().done(o(t, f, n)).fail(s.reject).progress(o(t, a, u)) : --i
            }
            return i || s.resolveWith(f, n), s.promise()
        }
    }), v.support = function() {
        var t, n, r, s, o, u, a, f, l, c, h, p = i.createElement("div");
        p.setAttribute("className", "t"), p.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", n = p.getElementsByTagName("*"), r = p.getElementsByTagName("a")[0];
        if (!n || !r || !n.length) return {};
        s = i.createElement("select"), o = s.appendChild(i.createElement("option")), u = p.getElementsByTagName("input")[0], r.style.cssText = "top:1px;float:left;opacity:.5", t = {
            leadingWhitespace: p.firstChild.nodeType === 3,
            tbody: !p.getElementsByTagName("tbody").length,
            htmlSerialize: !!p.getElementsByTagName("link").length,
            style: /top/.test(r.getAttribute("style")),
            hrefNormalized: r.getAttribute("href") === "/a",
            opacity: /^0.5/.test(r.style.opacity),
            cssFloat: !!r.style.cssFloat,
            checkOn: u.value === "on",
            optSelected: o.selected,
            getSetAttribute: p.className !== "t",
            enctype: !!i.createElement("form").enctype,
            html5Clone: i.createElement("nav").cloneNode(!0).outerHTML !== "<:nav></:nav>",
            boxModel: i.compatMode === "CSS1Compat",
            submitBubbles: !0,
            changeBubbles: !0,
            focusinBubbles: !1,
            deleteExpando: !0,
            noCloneEvent: !0,
            inlineBlockNeedsLayout: !1,
            shrinkWrapBlocks: !1,
            reliableMarginRight: !0,
            boxSizingReliable: !0,
            pixelPosition: !1
        }, u.checked = !0, t.noCloneChecked = u.cloneNode(!0).checked, s.disabled = !0, t.optDisabled = !o.disabled;
        try {
            delete p.test
        } catch (d) {
            t.deleteExpando = !1
        }!p.addEventListener && p.attachEvent && p.fireEvent && (p.attachEvent("onclick", h = function() {
            t.noCloneEvent = !1
        }), p.cloneNode(!0).fireEvent("onclick"), p.detachEvent("onclick", h)), u = i.createElement("input"), u.value = "t", u.setAttribute("type", "radio"), t.radioValue = u.value === "t", u.setAttribute("checked", "checked"), u.setAttribute("name", "t"), p.appendChild(u), a = i.createDocumentFragment(), a.appendChild(p.lastChild), t.checkClone = a.cloneNode(!0).cloneNode(!0).lastChild.checked, t.appendChecked = u.checked, a.removeChild(u), a.appendChild(p);
        if (p.attachEvent)
            for (l in {
                    submit: !0,
                    change: !0,
                    focusin: !0
                }) f = "on" + l, c = f in p, c || (p.setAttribute(f, "return;"), c = typeof p[f] == "function"), t[l + "Bubbles"] = c;
        return v(function() {
            var n, r, s, o, u = "padding:0;margin:0;border:0;display:block;overflow:hidden;",
                a = i.getElementsByTagName("body")[0];
            if (!a) return;
            n = i.createElement("div"), n.style.cssText = "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px", a.insertBefore(n, a.firstChild), r = i.createElement("div"), n.appendChild(r), r.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", s = r.getElementsByTagName("td"), s[0].style.cssText = "padding:0;margin:0;border:0;display:none", c = s[0].offsetHeight === 0, s[0].style.display = "", s[1].style.display = "none", t.reliableHiddenOffsets = c && s[0].offsetHeight === 0, r.innerHTML = "", r.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;", t.boxSizing = r.offsetWidth === 4, t.doesNotIncludeMarginInBodyOffset = a.offsetTop !== 1, e.getComputedStyle && (t.pixelPosition = (e.getComputedStyle(r, null) || {}).top !== "1%", t.boxSizingReliable = (e.getComputedStyle(r, null) || {
                width: "4px"
            }).width === "4px", o = i.createElement("div"), o.style.cssText = r.style.cssText = u, o.style.marginRight = o.style.width = "0", r.style.width = "1px", r.appendChild(o), t.reliableMarginRight = !parseFloat((e.getComputedStyle(o, null) || {}).marginRight)), typeof r.style.zoom != "undefined" && (r.innerHTML = "", r.style.cssText = u + "width:1px;padding:1px;display:inline;zoom:1", t.inlineBlockNeedsLayout = r.offsetWidth === 3, r.style.display = "block", r.style.overflow = "visible", r.innerHTML = "<div></div>", r.firstChild.style.width = "5px", t.shrinkWrapBlocks = r.offsetWidth !== 3, n.style.zoom = 1), a.removeChild(n), n = r = s = o = null
        }), a.removeChild(p), n = r = s = o = u = a = p = null, t
    }();
    var D = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
        P = /([A-Z])/g;
    v.extend({
        cache: {},
        deletedIds: [],
        uuid: 0,
        expando: "jQuery" + (v.fn.jquery + Math.random()).replace(/\D/g, ""),
        noData: {
            embed: !0,
            object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
            applet: !0
        },
        hasData: function(e) {
            return e = e.nodeType ? v.cache[e[v.expando]] : e[v.expando], !!e && !B(e)
        },
        data: function(e, n, r, i) {
            if (!v.acceptData(e)) return;
            var s, o, u = v.expando,
                a = typeof n == "string",
                f = e.nodeType,
                l = f ? v.cache : e,
                c = f ? e[u] : e[u] && u;
            if ((!c || !l[c] || !i && !l[c].data) && a && r === t) return;
            c || (f ? e[u] = c = v.deletedIds.pop() || v.guid++ : c = u), l[c] || (l[c] = {}, f || (l[c].toJSON = v.noop));
            if (typeof n == "object" || typeof n == "function") i ? l[c] = v.extend(l[c], n) : l[c].data = v.extend(l[c].data, n);
            return s = l[c], i || (s.data || (s.data = {}), s = s.data), r !== t && (s[v.camelCase(n)] = r), a ? (o = s[n], o == null && (o = s[v.camelCase(n)])) : o = s, o
        },
        removeData: function(e, t, n) {
            if (!v.acceptData(e)) return;
            var r, i, s, o = e.nodeType,
                u = o ? v.cache : e,
                a = o ? e[v.expando] : v.expando;
            if (!u[a]) return;
            if (t) {
                r = n ? u[a] : u[a].data;
                if (r) {
                    v.isArray(t) || (t in r ? t = [t] : (t = v.camelCase(t), t in r ? t = [t] : t = t.split(" ")));
                    for (i = 0, s = t.length; i < s; i++) delete r[t[i]];
                    if (!(n ? B : v.isEmptyObject)(r)) return
                }
            }
            if (!n) {
                delete u[a].data;
                if (!B(u[a])) return
            }
            o ? v.cleanData([e], !0) : v.support.deleteExpando || u != u.window ? delete u[a] : u[a] = null
        },
        _data: function(e, t, n) {
            return v.data(e, t, n, !0)
        },
        acceptData: function(e) {
            var t = e.nodeName && v.noData[e.nodeName.toLowerCase()];
            return !t || t !== !0 && e.getAttribute("classid") === t
        }
    }), v.fn.extend({
        data: function(e, n) {
            var r, i, s, o, u, a = this[0],
                f = 0,
                l = null;
            if (e === t) {
                if (this.length) {
                    l = v.data(a);
                    if (a.nodeType === 1 && !v._data(a, "parsedAttrs")) {
                        s = a.attributes;
                        for (u = s.length; f < u; f++) o = s[f].name, o.indexOf("data-") || (o = v.camelCase(o.substring(5)), H(a, o, l[o]));
                        v._data(a, "parsedAttrs", !0)
                    }
                }
                return l
            }
            return typeof e == "object" ? this.each(function() {
                v.data(this, e)
            }) : (r = e.split(".", 2), r[1] = r[1] ? "." + r[1] : "", i = r[1] + "!", v.access(this, function(n) {
                if (n === t) return l = this.triggerHandler("getData" + i, [r[0]]), l === t && a && (l = v.data(a, e), l = H(a, e, l)), l === t && r[1] ? this.data(r[0]) : l;
                r[1] = n, this.each(function() {
                    var t = v(this);
                    t.triggerHandler("setData" + i, r), v.data(this, e, n), t.triggerHandler("changeData" + i, r)
                })
            }, null, n, arguments.length > 1, null, !1))
        },
        removeData: function(e) {
            return this.each(function() {
                v.removeData(this, e)
            })
        }
    }), v.extend({
        queue: function(e, t, n) {
            var r;
            if (e) return t = (t || "fx") + "queue", r = v._data(e, t), n && (!r || v.isArray(n) ? r = v._data(e, t, v.makeArray(n)) : r.push(n)), r || []
        },
        dequeue: function(e, t) {
            t = t || "fx";
            var n = v.queue(e, t),
                r = n.length,
                i = n.shift(),
                s = v._queueHooks(e, t),
                o = function() {
                    v.dequeue(e, t)
                };
            i === "inprogress" && (i = n.shift(), r--), i && (t === "fx" && n.unshift("inprogress"), delete s.stop, i.call(e, o, s)), !r && s && s.empty.fire()
        },
        _queueHooks: function(e, t) {
            var n = t + "queueHooks";
            return v._data(e, n) || v._data(e, n, {
                empty: v.Callbacks("once memory").add(function() {
                    v.removeData(e, t + "queue", !0), v.removeData(e, n, !0)
                })
            })
        }
    }), v.fn.extend({
        queue: function(e, n) {
            var r = 2;
            return typeof e != "string" && (n = e, e = "fx", r--), arguments.length < r ? v.queue(this[0], e) : n === t ? this : this.each(function() {
                var t = v.queue(this, e, n);
                v._queueHooks(this, e), e === "fx" && t[0] !== "inprogress" && v.dequeue(this, e)
            })
        },
        dequeue: function(e) {
            return this.each(function() {
                v.dequeue(this, e)
            })
        },
        delay: function(e, t) {
            return e = v.fx ? v.fx.speeds[e] || e : e, t = t || "fx", this.queue(t, function(t, n) {
                var r = setTimeout(t, e);
                n.stop = function() {
                    clearTimeout(r)
                }
            })
        },
        clearQueue: function(e) {
            return this.queue(e || "fx", [])
        },
        promise: function(e, n) {
            var r, i = 1,
                s = v.Deferred(),
                o = this,
                u = this.length,
                a = function() {
                    --i || s.resolveWith(o, [o])
                };
            typeof e != "string" && (n = e, e = t), e = e || "fx";
            while (u--) r = v._data(o[u], e + "queueHooks"), r && r.empty && (i++, r.empty.add(a));
            return a(), s.promise(n)
        }
    });
    var j, F, I, q = /[\t\r\n]/g,
        R = /\r/g,
        U = /^(?:button|input)$/i,
        z = /^(?:button|input|object|select|textarea)$/i,
        W = /^a(?:rea|)$/i,
        X = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
        V = v.support.getSetAttribute;
    v.fn.extend({
        attr: function(e, t) {
            return v.access(this, v.attr, e, t, arguments.length > 1)
        },
        removeAttr: function(e) {
            return this.each(function() {
                v.removeAttr(this, e)
            })
        },
        prop: function(e, t) {
            return v.access(this, v.prop, e, t, arguments.length > 1)
        },
        removeProp: function(e) {
            return e = v.propFix[e] || e, this.each(function() {
                try {
                    this[e] = t, delete this[e]
                } catch (n) {}
            })
        },
        addClass: function(e) {
            var t, n, r, i, s, o, u;
            if (v.isFunction(e)) return this.each(function(t) {
                v(this).addClass(e.call(this, t, this.className))
            });
            if (e && typeof e == "string") {
                t = e.split(y);
                for (n = 0, r = this.length; n < r; n++) {
                    i = this[n];
                    if (i.nodeType === 1)
                        if (!i.className && t.length === 1) i.className = e;
                        else {
                            s = " " + i.className + " ";
                            for (o = 0, u = t.length; o < u; o++) s.indexOf(" " + t[o] + " ") < 0 && (s += t[o] + " ");
                            i.className = v.trim(s)
                        }
                }
            }
            return this
        },
        removeClass: function(e) {
            var n, r, i, s, o, u, a;
            if (v.isFunction(e)) return this.each(function(t) {
                v(this).removeClass(e.call(this, t, this.className))
            });
            if (e && typeof e == "string" || e === t) {
                n = (e || "").split(y);
                for (u = 0, a = this.length; u < a; u++) {
                    i = this[u];
                    if (i.nodeType === 1 && i.className) {
                        r = (" " + i.className + " ").replace(q, " ");
                        for (s = 0, o = n.length; s < o; s++)
                            while (r.indexOf(" " + n[s] + " ") >= 0) r = r.replace(" " + n[s] + " ", " ");
                        i.className = e ? v.trim(r) : ""
                    }
                }
            }
            return this
        },
        toggleClass: function(e, t) {
            var n = typeof e,
                r = typeof t == "boolean";
            return v.isFunction(e) ? this.each(function(n) {
                v(this).toggleClass(e.call(this, n, this.className, t), t)
            }) : this.each(function() {
                if (n === "string") {
                    var i, s = 0,
                        o = v(this),
                        u = t,
                        a = e.split(y);
                    while (i = a[s++]) u = r ? u : !o.hasClass(i), o[u ? "addClass" : "removeClass"](i)
                } else if (n === "undefined" || n === "boolean") this.className && v._data(this, "__className__", this.className), this.className = this.className || e === !1 ? "" : v._data(this, "__className__") || ""
            })
        },
        hasClass: function(e) {
            var t = " " + e + " ",
                n = 0,
                r = this.length;
            for (; n < r; n++)
                if (this[n].nodeType === 1 && (" " + this[n].className + " ").replace(q, " ").indexOf(t) >= 0) return !0;
            return !1
        },
        val: function(e) {
            var n, r, i, s = this[0];
            if (!arguments.length) {
                if (s) return n = v.valHooks[s.type] || v.valHooks[s.nodeName.toLowerCase()], n && "get" in n && (r = n.get(s, "value")) !== t ? r : (r = s.value, typeof r == "string" ? r.replace(R, "") : r == null ? "" : r);
                return
            }
            return i = v.isFunction(e), this.each(function(r) {
                var s, o = v(this);
                if (this.nodeType !== 1) return;
                i ? s = e.call(this, r, o.val()) : s = e, s == null ? s = "" : typeof s == "number" ? s += "" : v.isArray(s) && (s = v.map(s, function(e) {
                    return e == null ? "" : e + ""
                })), n = v.valHooks[this.type] || v.valHooks[this.nodeName.toLowerCase()];
                if (!n || !("set" in n) || n.set(this, s, "value") === t) this.value = s
            })
        }
    }), v.extend({
        valHooks: {
            option: {
                get: function(e) {
                    var t = e.attributes.value;
                    return !t || t.specified ? e.value : e.text
                }
            },
            select: {
                get: function(e) {
                    var t, n, r = e.options,
                        i = e.selectedIndex,
                        s = e.type === "select-one" || i < 0,
                        o = s ? null : [],
                        u = s ? i + 1 : r.length,
                        a = i < 0 ? u : s ? i : 0;
                    for (; a < u; a++) {
                        n = r[a];
                        if ((n.selected || a === i) && (v.support.optDisabled ? !n.disabled : n.getAttribute("disabled") === null) && (!n.parentNode.disabled || !v.nodeName(n.parentNode, "optgroup"))) {
                            t = v(n).val();
                            if (s) return t;
                            o.push(t)
                        }
                    }
                    return o
                },
                set: function(e, t) {
                    var n = v.makeArray(t);
                    return v(e).find("option").each(function() {
                        this.selected = v.inArray(v(this).val(), n) >= 0
                    }), n.length || (e.selectedIndex = -1), n
                }
            }
        },
        attrFn: {},
        attr: function(e, n, r, i) {
            var s, o, u, a = e.nodeType;
            if (!e || a === 3 || a === 8 || a === 2) return;
            if (i && v.isFunction(v.fn[n])) return v(e)[n](r);
            if (typeof e.getAttribute == "undefined") return v.prop(e, n, r);
            u = a !== 1 || !v.isXMLDoc(e), u && (n = n.toLowerCase(), o = v.attrHooks[n] || (X.test(n) ? F : j));
            if (r !== t) {
                if (r === null) {
                    v.removeAttr(e, n);
                    return
                }
                return o && "set" in o && u && (s = o.set(e, r, n)) !== t ? s : (e.setAttribute(n, r + ""), r)
            }
            return o && "get" in o && u && (s = o.get(e, n)) !== null ? s : (s = e.getAttribute(n), s === null ? t : s)
        },
        removeAttr: function(e, t) {
            var n, r, i, s, o = 0;
            if (t && e.nodeType === 1) {
                r = t.split(y);
                for (; o < r.length; o++) i = r[o], i && (n = v.propFix[i] || i, s = X.test(i), s || v.attr(e, i, ""), e.removeAttribute(V ? i : n), s && n in e && (e[n] = !1))
            }
        },
        attrHooks: {
            type: {
                set: function(e, t) {
                    if (U.test(e.nodeName) && e.parentNode) v.error("type property can't be changed");
                    else if (!v.support.radioValue && t === "radio" && v.nodeName(e, "input")) {
                        var n = e.value;
                        return e.setAttribute("type", t), n && (e.value = n), t
                    }
                }
            },
            value: {
                get: function(e, t) {
                    return j && v.nodeName(e, "button") ? j.get(e, t) : t in e ? e.value : null
                },
                set: function(e, t, n) {
                    if (j && v.nodeName(e, "button")) return j.set(e, t, n);
                    e.value = t
                }
            }
        },
        propFix: {
            tabindex: "tabIndex",
            readonly: "readOnly",
            "for": "htmlFor",
            "class": "className",
            maxlength: "maxLength",
            cellspacing: "cellSpacing",
            cellpadding: "cellPadding",
            rowspan: "rowSpan",
            colspan: "colSpan",
            usemap: "useMap",
            frameborder: "frameBorder",
            contenteditable: "contentEditable"
        },
        prop: function(e, n, r) {
            var i, s, o, u = e.nodeType;
            if (!e || u === 3 || u === 8 || u === 2) return;
            return o = u !== 1 || !v.isXMLDoc(e), o && (n = v.propFix[n] || n, s = v.propHooks[n]), r !== t ? s && "set" in s && (i = s.set(e, r, n)) !== t ? i : e[n] = r : s && "get" in s && (i = s.get(e, n)) !== null ? i : e[n]
        },
        propHooks: {
            tabIndex: {
                get: function(e) {
                    var n = e.getAttributeNode("tabindex");
                    return n && n.specified ? parseInt(n.value, 10) : z.test(e.nodeName) || W.test(e.nodeName) && e.href ? 0 : t
                }
            }
        }
    }), F = {
        get: function(e, n) {
            var r, i = v.prop(e, n);
            return i === !0 || typeof i != "boolean" && (r = e.getAttributeNode(n)) && r.nodeValue !== !1 ? n.toLowerCase() : t
        },
        set: function(e, t, n) {
            var r;
            return t === !1 ? v.removeAttr(e, n) : (r = v.propFix[n] || n, r in e && (e[r] = !0), e.setAttribute(n, n.toLowerCase())), n
        }
    }, V || (I = {
        name: !0,
        id: !0,
        coords: !0
    }, j = v.valHooks.button = {
        get: function(e, n) {
            var r;
            return r = e.getAttributeNode(n), r && (I[n] ? r.value !== "" : r.specified) ? r.value : t
        },
        set: function(e, t, n) {
            var r = e.getAttributeNode(n);
            return r || (r = i.createAttribute(n), e.setAttributeNode(r)), r.value = t + ""
        }
    }, v.each(["width", "height"], function(e, t) {
        v.attrHooks[t] = v.extend(v.attrHooks[t], {
            set: function(e, n) {
                if (n === "") return e.setAttribute(t, "auto"), n
            }
        })
    }), v.attrHooks.contenteditable = {
        get: j.get,
        set: function(e, t, n) {
            t === "" && (t = "false"), j.set(e, t, n)
        }
    }), v.support.hrefNormalized || v.each(["href", "src", "width", "height"], function(e, n) {
        v.attrHooks[n] = v.extend(v.attrHooks[n], {
            get: function(e) {
                var r = e.getAttribute(n, 2);
                return r === null ? t : r
            }
        })
    }), v.support.style || (v.attrHooks.style = {
        get: function(e) {
            return e.style.cssText.toLowerCase() || t
        },
        set: function(e, t) {
            return e.style.cssText = t + ""
        }
    }), v.support.optSelected || (v.propHooks.selected = v.extend(v.propHooks.selected, {
        get: function(e) {
            var t = e.parentNode;
            return t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex), null
        }
    })), v.support.enctype || (v.propFix.enctype = "encoding"), v.support.checkOn || v.each(["radio", "checkbox"], function() {
        v.valHooks[this] = {
            get: function(e) {
                return e.getAttribute("value") === null ? "on" : e.value
            }
        }
    }), v.each(["radio", "checkbox"], function() {
        v.valHooks[this] = v.extend(v.valHooks[this], {
            set: function(e, t) {
                if (v.isArray(t)) return e.checked = v.inArray(v(e).val(), t) >= 0
            }
        })
    });
    var $ = /^(?:textarea|input|select)$/i,
        J = /^([^\.]*|)(?:\.(.+)|)$/,
        K = /(?:^|\s)hover(\.\S+|)\b/,
        Q = /^key/,
        G = /^(?:mouse|contextmenu)|click/,
        Y = /^(?:focusinfocus|focusoutblur)$/,
        Z = function(e) {
            return v.event.special.hover ? e : e.replace(K, "mouseenter$1 mouseleave$1")
        };
    v.event = {
            add: function(e, n, r, i, s) {
                var o, u, a, f, l, c, h, p, d, m, g;
                if (e.nodeType === 3 || e.nodeType === 8 || !n || !r || !(o = v._data(e))) return;
                r.handler && (d = r, r = d.handler, s = d.selector), r.guid || (r.guid = v.guid++), a = o.events, a || (o.events = a = {}), u = o.handle, u || (o.handle = u = function(e) {
                    return typeof v == "undefined" || !!e && v.event.triggered === e.type ? t : v.event.dispatch.apply(u.elem, arguments)
                }, u.elem = e), n = v.trim(Z(n)).split(" ");
                for (f = 0; f < n.length; f++) {
                    l = J.exec(n[f]) || [], c = l[1], h = (l[2] || "").split(".").sort(), g = v.event.special[c] || {}, c = (s ? g.delegateType : g.bindType) || c, g = v.event.special[c] || {}, p = v.extend({
                        type: c,
                        origType: l[1],
                        data: i,
                        handler: r,
                        guid: r.guid,
                        selector: s,
                        needsContext: s && v.expr.match.needsContext.test(s),
                        namespace: h.join(".")
                    }, d), m = a[c];
                    if (!m) {
                        m = a[c] = [], m.delegateCount = 0;
                        if (!g.setup || g.setup.call(e, i, h, u) === !1) e.addEventListener ? e.addEventListener(c, u, !1) : e.attachEvent && e.attachEvent("on" + c, u)
                    }
                    g.add && (g.add.call(e, p), p.handler.guid || (p.handler.guid = r.guid)), s ? m.splice(m.delegateCount++, 0, p) : m.push(p), v.event.global[c] = !0
                }
                e = null
            },
            global: {},
            remove: function(e, t, n, r, i) {
                var s, o, u, a, f, l, c, h, p, d, m, g = v.hasData(e) && v._data(e);
                if (!g || !(h = g.events)) return;
                t = v.trim(Z(t || "")).split(" ");
                for (s = 0; s < t.length; s++) {
                    o = J.exec(t[s]) || [], u = a = o[1], f = o[2];
                    if (!u) {
                        for (u in h) v.event.remove(e, u + t[s], n, r, !0);
                        continue
                    }
                    p = v.event.special[u] || {}, u = (r ? p.delegateType : p.bindType) || u, d = h[u] || [], l = d.length, f = f ? new RegExp("(^|\\.)" + f.split(".").sort().join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
                    for (c = 0; c < d.length; c++) m = d[c], (i || a === m.origType) && (!n || n.guid === m.guid) && (!f || f.test(m.namespace)) && (!r || r === m.selector || r === "**" && m.selector) && (d.splice(c--, 1), m.selector && d.delegateCount--, p.remove && p.remove.call(e, m));
                    d.length === 0 && l !== d.length && ((!p.teardown || p.teardown.call(e, f, g.handle) === !1) && v.removeEvent(e, u, g.handle), delete h[u])
                }
                v.isEmptyObject(h) && (delete g.handle, v.removeData(e, "events", !0))
            },
            customEvent: {
                getData: !0,
                setData: !0,
                changeData: !0
            },
            trigger: function(n, r, s, o) {
                if (!s || s.nodeType !== 3 && s.nodeType !== 8) {
                    var u, a, f, l, c, h, p, d, m, g, y = n.type || n,
                        b = [];
                    if (Y.test(y + v.event.triggered)) return;
                    y.indexOf("!") >= 0 && (y = y.slice(0, -1), a = !0), y.indexOf(".") >= 0 && (b = y.split("."), y = b.shift(), b.sort());
                    if ((!s || v.event.customEvent[y]) && !v.event.global[y]) return;
                    n = typeof n == "object" ? n[v.expando] ? n : new v.Event(y, n) : new v.Event(y), n.type = y, n.isTrigger = !0, n.exclusive = a, n.namespace = b.join("."), n.namespace_re = n.namespace ? new RegExp("(^|\\.)" + b.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, h = y.indexOf(":") < 0 ? "on" + y : "";
                    if (!s) {
                        u = v.cache;
                        for (f in u) u[f].events && u[f].events[y] && v.event.trigger(n, r, u[f].handle.elem, !0);
                        return
                    }
                    n.result = t, n.target || (n.target = s), r = r != null ? v.makeArray(r) : [], r.unshift(n), p = v.event.special[y] || {};
                    if (p.trigger && p.trigger.apply(s, r) === !1) return;
                    m = [
                        [s, p.bindType || y]
                    ];
                    if (!o && !p.noBubble && !v.isWindow(s)) {
                        g = p.delegateType || y, l = Y.test(g + y) ? s : s.parentNode;
                        for (c = s; l; l = l.parentNode) m.push([l, g]), c = l;
                        c === (s.ownerDocument || i) && m.push([c.defaultView || c.parentWindow || e, g])
                    }
                    for (f = 0; f < m.length && !n.isPropagationStopped(); f++) l = m[f][0], n.type = m[f][1], d = (v._data(l, "events") || {})[n.type] && v._data(l, "handle"), d && d.apply(l, r), d = h && l[h], d && v.acceptData(l) && d.apply && d.apply(l, r) === !1 && n.preventDefault();
                    return n.type = y, !o && !n.isDefaultPrevented() && (!p._default || p._default.apply(s.ownerDocument, r) === !1) && (y !== "click" || !v.nodeName(s, "a")) && v.acceptData(s) && h && s[y] && (y !== "focus" && y !== "blur" || n.target.offsetWidth !== 0) && !v.isWindow(s) && (c = s[h], c && (s[h] = null), v.event.triggered = y, s[y](), v.event.triggered = t, c && (s[h] = c)), n.result
                }
                return
            },
            dispatch: function(n) {
                n = v.event.fix(n || e.event);
                var r, i, s, o, u, a, f, c, h, p, d = (v._data(this, "events") || {})[n.type] || [],
                    m = d.delegateCount,
                    g = l.call(arguments),
                    y = !n.exclusive && !n.namespace,
                    b = v.event.special[n.type] || {},
                    w = [];
                g[0] = n, n.delegateTarget = this;
                if (b.preDispatch && b.preDispatch.call(this, n) === !1) return;
                if (m && (!n.button || n.type !== "click"))
                    for (s = n.target; s != this; s = s.parentNode || this)
                        if (s.disabled !== !0 || n.type !== "click") {
                            u = {}, f = [];
                            for (r = 0; r < m; r++) c = d[r], h = c.selector, u[h] === t && (u[h] = c.needsContext ? v(h, this).index(s) >= 0 : v.find(h, this, null, [s]).length), u[h] && f.push(c);
                            f.length && w.push({
                                elem: s,
                                matches: f
                            })
                        }
                d.length > m && w.push({
                    elem: this,
                    matches: d.slice(m)
                });
                for (r = 0; r < w.length && !n.isPropagationStopped(); r++) {
                    a = w[r], n.currentTarget = a.elem;
                    for (i = 0; i < a.matches.length && !n.isImmediatePropagationStopped(); i++) {
                        c = a.matches[i];
                        if (y || !n.namespace && !c.namespace || n.namespace_re && n.namespace_re.test(c.namespace)) n.data = c.data, n.handleObj = c, o = ((v.event.special[c.origType] || {}).handle || c.handler).apply(a.elem, g), o !== t && (n.result = o, o === !1 && (n.preventDefault(), n.stopPropagation()))
                    }
                }
                return b.postDispatch && b.postDispatch.call(this, n), n.result
            },
            props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
            fixHooks: {},
            keyHooks: {
                props: "char charCode key keyCode".split(" "),
                filter: function(e, t) {
                    return e.which == null && (e.which = t.charCode != null ? t.charCode : t.keyCode), e
                }
            },
            mouseHooks: {
                props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
                filter: function(e, n) {
                    var r, s, o, u = n.button,
                        a = n.fromElement;
                    return e.pageX == null && n.clientX != null && (r = e.target.ownerDocument || i, s = r.documentElement, o = r.body, e.pageX = n.clientX + (s && s.scrollLeft || o && o.scrollLeft || 0) - (s && s.clientLeft || o && o.clientLeft || 0), e.pageY = n.clientY + (s && s.scrollTop || o && o.scrollTop || 0) - (s && s.clientTop || o && o.clientTop || 0)), !e.relatedTarget && a && (e.relatedTarget = a === e.target ? n.toElement : a), !e.which && u !== t && (e.which = u & 1 ? 1 : u & 2 ? 3 : u & 4 ? 2 : 0), e
                }
            },
            fix: function(e) {
                if (e[v.expando]) return e;
                var t, n, r = e,
                    s = v.event.fixHooks[e.type] || {},
                    o = s.props ? this.props.concat(s.props) : this.props;
                e = v.Event(r);
                for (t = o.length; t;) n = o[--t], e[n] = r[n];
                return e.target || (e.target = r.srcElement || i), e.target.nodeType === 3 && (e.target = e.target.parentNode), e.metaKey = !!e.metaKey, s.filter ? s.filter(e, r) : e
            },
            special: {
                load: {
                    noBubble: !0
                },
                focus: {
                    delegateType: "focusin"
                },
                blur: {
                    delegateType: "focusout"
                },
                beforeunload: {
                    setup: function(e, t, n) {
                        v.isWindow(this) && (this.onbeforeunload = n)
                    },
                    teardown: function(e, t) {
                        this.onbeforeunload === t && (this.onbeforeunload = null)
                    }
                }
            },
            simulate: function(e, t, n, r) {
                var i = v.extend(new v.Event, n, {
                    type: e,
                    isSimulated: !0,
                    originalEvent: {}
                });
                r ? v.event.trigger(i, null, t) : v.event.dispatch.call(t, i), i.isDefaultPrevented() && n.preventDefault()
            }
        }, v.event.handle = v.event.dispatch, v.removeEvent = i.removeEventListener ? function(e, t, n) {
            e.removeEventListener && e.removeEventListener(t, n, !1)
        } : function(e, t, n) {
            var r = "on" + t;
            e.detachEvent && (typeof e[r] == "undefined" && (e[r] = null), e.detachEvent(r, n))
        }, v.Event = function(e, t) {
            if (!(this instanceof v.Event)) return new v.Event(e, t);
            e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || e.returnValue === !1 || e.getPreventDefault && e.getPreventDefault() ? tt : et) : this.type = e, t && v.extend(this, t), this.timeStamp = e && e.timeStamp || v.now(), this[v.expando] = !0
        }, v.Event.prototype = {
            preventDefault: function() {
                this.isDefaultPrevented = tt;
                var e = this.originalEvent;
                if (!e) return;
                e.preventDefault ? e.preventDefault() : e.returnValue = !1
            },
            stopPropagation: function() {
                this.isPropagationStopped = tt;
                var e = this.originalEvent;
                if (!e) return;
                e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0
            },
            stopImmediatePropagation: function() {
                this.isImmediatePropagationStopped = tt, this.stopPropagation()
            },
            isDefaultPrevented: et,
            isPropagationStopped: et,
            isImmediatePropagationStopped: et
        }, v.each({
            mouseenter: "mouseover",
            mouseleave: "mouseout"
        }, function(e, t) {
            v.event.special[e] = {
                delegateType: t,
                bindType: t,
                handle: function(e) {
                    var n, r = this,
                        i = e.relatedTarget,
                        s = e.handleObj,
                        o = s.selector;
                    if (!i || i !== r && !v.contains(r, i)) e.type = s.origType, n = s.handler.apply(this, arguments), e.type = t;
                    return n
                }
            }
        }), v.support.submitBubbles || (v.event.special.submit = {
            setup: function() {
                if (v.nodeName(this, "form")) return !1;
                v.event.add(this, "click._submit keypress._submit", function(e) {
                    var n = e.target,
                        r = v.nodeName(n, "input") || v.nodeName(n, "button") ? n.form : t;
                    r && !v._data(r, "_submit_attached") && (v.event.add(r, "submit._submit", function(e) {
                        e._submit_bubble = !0
                    }), v._data(r, "_submit_attached", !0))
                })
            },
            postDispatch: function(e) {
                e._submit_bubble && (delete e._submit_bubble, this.parentNode && !e.isTrigger && v.event.simulate("submit", this.parentNode, e, !0))
            },
            teardown: function() {
                if (v.nodeName(this, "form")) return !1;
                v.event.remove(this, "._submit")
            }
        }), v.support.changeBubbles || (v.event.special.change = {
            setup: function() {
                if ($.test(this.nodeName)) {
                    if (this.type === "checkbox" || this.type === "radio") v.event.add(this, "propertychange._change", function(e) {
                        e.originalEvent.propertyName === "checked" && (this._just_changed = !0)
                    }), v.event.add(this, "click._change", function(e) {
                        this._just_changed && !e.isTrigger && (this._just_changed = !1), v.event.simulate("change", this, e, !0)
                    });
                    return !1
                }
                v.event.add(this, "beforeactivate._change", function(e) {
                    var t = e.target;
                    $.test(t.nodeName) && !v._data(t, "_change_attached") && (v.event.add(t, "change._change", function(e) {
                        this.parentNode && !e.isSimulated && !e.isTrigger && v.event.simulate("change", this.parentNode, e, !0)
                    }), v._data(t, "_change_attached", !0))
                })
            },
            handle: function(e) {
                var t = e.target;
                if (this !== t || e.isSimulated || e.isTrigger || t.type !== "radio" && t.type !== "checkbox") return e.handleObj.handler.apply(this, arguments)
            },
            teardown: function() {
                return v.event.remove(this, "._change"), !$.test(this.nodeName)
            }
        }), v.support.focusinBubbles || v.each({
            focus: "focusin",
            blur: "focusout"
        }, function(e, t) {
            var n = 0,
                r = function(e) {
                    v.event.simulate(t, e.target, v.event.fix(e), !0)
                };
            v.event.special[t] = {
                setup: function() {
                    n++ === 0 && i.addEventListener(e, r, !0)
                },
                teardown: function() {
                    --n === 0 && i.removeEventListener(e, r, !0)
                }
            }
        }), v.fn.extend({
            on: function(e, n, r, i, s) {
                var o, u;
                if (typeof e == "object") {
                    typeof n != "string" && (r = r || n, n = t);
                    for (u in e) this.on(u, n, r, e[u], s);
                    return this
                }
                r == null && i == null ? (i = n, r = n = t) : i == null && (typeof n == "string" ? (i = r, r = t) : (i = r, r = n, n = t));
                if (i === !1) i = et;
                else if (!i) return this;
                return s === 1 && (o = i, i = function(e) {
                    return v().off(e), o.apply(this, arguments)
                }, i.guid = o.guid || (o.guid = v.guid++)), this.each(function() {
                    v.event.add(this, e, i, r, n)
                })
            },
            one: function(e, t, n, r) {
                return this.on(e, t, n, r, 1)
            },
            off: function(e, n, r) {
                var i, s;
                if (e && e.preventDefault && e.handleObj) return i = e.handleObj, v(e.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler), this;
                if (typeof e == "object") {
                    for (s in e) this.off(s, n, e[s]);
                    return this
                }
                if (n === !1 || typeof n == "function") r = n, n = t;
                return r === !1 && (r = et), this.each(function() {
                    v.event.remove(this, e, r, n)
                })
            },
            bind: function(e, t, n) {
                return this.on(e, null, t, n)
            },
            unbind: function(e, t) {
                return this.off(e, null, t)
            },
            live: function(e, t, n) {
                return v(this.context).on(e, this.selector, t, n), this
            },
            die: function(e, t) {
                return v(this.context).off(e, this.selector || "**", t), this
            },
            delegate: function(e, t, n, r) {
                return this.on(t, e, n, r)
            },
            undelegate: function(e, t, n) {
                return arguments.length === 1 ? this.off(e, "**") : this.off(t, e || "**", n)
            },
            trigger: function(e, t) {
                return this.each(function() {
                    v.event.trigger(e, t, this)
                })
            },
            triggerHandler: function(e, t) {
                if (this[0]) return v.event.trigger(e, t, this[0], !0)
            },
            toggle: function(e) {
                var t = arguments,
                    n = e.guid || v.guid++,
                    r = 0,
                    i = function(n) {
                        var i = (v._data(this, "lastToggle" + e.guid) || 0) % r;
                        return v._data(this, "lastToggle" + e.guid, i + 1), n.preventDefault(), t[i].apply(this, arguments) || !1
                    };
                i.guid = n;
                while (r < t.length) t[r++].guid = n;
                return this.click(i)
            },
            hover: function(e, t) {
                return this.mouseenter(e).mouseleave(t || e)
            }
        }), v.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(e, t) {
            v.fn[t] = function(e, n) {
                return n == null && (n = e, e = null), arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
            }, Q.test(t) && (v.event.fixHooks[t] = v.event.keyHooks), G.test(t) && (v.event.fixHooks[t] = v.event.mouseHooks)
        }),
        function(e, t) {
            function nt(e, t, n, r) {
                n = n || [], t = t || g;
                var i, s, a, f, l = t.nodeType;
                if (!e || typeof e != "string") return n;
                if (l !== 1 && l !== 9) return [];
                a = o(t);
                if (!a && !r)
                    if (i = R.exec(e))
                        if (f = i[1]) {
                            if (l === 9) {
                                s = t.getElementById(f);
                                if (!s || !s.parentNode) return n;
                                if (s.id === f) return n.push(s), n
                            } else if (t.ownerDocument && (s = t.ownerDocument.getElementById(f)) && u(t, s) && s.id === f) return n.push(s), n
                        } else {
                            if (i[2]) return S.apply(n, x.call(t.getElementsByTagName(e), 0)), n;
                            if ((f = i[3]) && Z && t.getElementsByClassName) return S.apply(n, x.call(t.getElementsByClassName(f), 0)), n
                        }
                return vt(e.replace(j, "$1"), t, n, r, a)
            }

            function rt(e) {
                return function(t) {
                    var n = t.nodeName.toLowerCase();
                    return n === "input" && t.type === e
                }
            }

            function it(e) {
                return function(t) {
                    var n = t.nodeName.toLowerCase();
                    return (n === "input" || n === "button") && t.type === e
                }
            }

            function st(e) {
                return N(function(t) {
                    return t = +t, N(function(n, r) {
                        var i, s = e([], n.length, t),
                            o = s.length;
                        while (o--) n[i = s[o]] && (n[i] = !(r[i] = n[i]))
                    })
                })
            }

            function ot(e, t, n) {
                if (e === t) return n;
                var r = e.nextSibling;
                while (r) {
                    if (r === t) return -1;
                    r = r.nextSibling
                }
                return 1
            }

            function ut(e, t) {
                var n, r, s, o, u, a, f, l = L[d][e + " "];
                if (l) return t ? 0 : l.slice(0);
                u = e, a = [], f = i.preFilter;
                while (u) {
                    if (!n || (r = F.exec(u))) r && (u = u.slice(r[0].length) || u), a.push(s = []);
                    n = !1;
                    if (r = I.exec(u)) s.push(n = new m(r.shift())), u = u.slice(n.length), n.type = r[0].replace(j, " ");
                    for (o in i.filter)(r = J[o].exec(u)) && (!f[o] || (r = f[o](r))) && (s.push(n = new m(r.shift())), u = u.slice(n.length), n.type = o, n.matches = r);
                    if (!n) break
                }
                return t ? u.length : u ? nt.error(e) : L(e, a).slice(0)
            }

            function at(e, t, r) {
                var i = t.dir,
                    s = r && t.dir === "parentNode",
                    o = w++;
                return t.first ? function(t, n, r) {
                    while (t = t[i])
                        if (s || t.nodeType === 1) return e(t, n, r)
                } : function(t, r, u) {
                    if (!u) {
                        var a, f = b + " " + o + " ",
                            l = f + n;
                        while (t = t[i])
                            if (s || t.nodeType === 1) {
                                if ((a = t[d]) === l) return t.sizset;
                                if (typeof a == "string" && a.indexOf(f) === 0) {
                                    if (t.sizset) return t
                                } else {
                                    t[d] = l;
                                    if (e(t, r, u)) return t.sizset = !0, t;
                                    t.sizset = !1
                                }
                            }
                    } else
                        while (t = t[i])
                            if (s || t.nodeType === 1)
                                if (e(t, r, u)) return t
                }
            }

            function ft(e) {
                return e.length > 1 ? function(t, n, r) {
                    var i = e.length;
                    while (i--)
                        if (!e[i](t, n, r)) return !1;
                    return !0
                } : e[0]
            }

            function lt(e, t, n, r, i) {
                var s, o = [],
                    u = 0,
                    a = e.length,
                    f = t != null;
                for (; u < a; u++)
                    if (s = e[u])
                        if (!n || n(s, r, i)) o.push(s), f && t.push(u);
                return o
            }

            function ct(e, t, n, r, i, s) {
                return r && !r[d] && (r = ct(r)), i && !i[d] && (i = ct(i, s)), N(function(s, o, u, a) {
                    var f, l, c, h = [],
                        p = [],
                        d = o.length,
                        v = s || dt(t || "*", u.nodeType ? [u] : u, []),
                        m = e && (s || !t) ? lt(v, h, e, u, a) : v,
                        g = n ? i || (s ? e : d || r) ? [] : o : m;
                    n && n(m, g, u, a);
                    if (r) {
                        f = lt(g, p), r(f, [], u, a), l = f.length;
                        while (l--)
                            if (c = f[l]) g[p[l]] = !(m[p[l]] = c)
                    }
                    if (s) {
                        if (i || e) {
                            if (i) {
                                f = [], l = g.length;
                                while (l--)(c = g[l]) && f.push(m[l] = c);
                                i(null, g = [], f, a)
                            }
                            l = g.length;
                            while (l--)(c = g[l]) && (f = i ? T.call(s, c) : h[l]) > -1 && (s[f] = !(o[f] = c))
                        }
                    } else g = lt(g === o ? g.splice(d, g.length) : g), i ? i(null, o, g, a) : S.apply(o, g)
                })
            }

            function ht(e) {
                var t, n, r, s = e.length,
                    o = i.relative[e[0].type],
                    u = o || i.relative[" "],
                    a = o ? 1 : 0,
                    f = at(function(e) {
                        return e === t
                    }, u, !0),
                    l = at(function(e) {
                        return T.call(t, e) > -1
                    }, u, !0),
                    h = [function(e, n, r) {
                        return !o && (r || n !== c) || ((t = n).nodeType ? f(e, n, r) : l(e, n, r))
                    }];
                for (; a < s; a++)
                    if (n = i.relative[e[a].type]) h = [at(ft(h), n)];
                    else {
                        n = i.filter[e[a].type].apply(null, e[a].matches);
                        if (n[d]) {
                            r = ++a;
                            for (; r < s; r++)
                                if (i.relative[e[r].type]) break;
                            return ct(a > 1 && ft(h), a > 1 && e.slice(0, a - 1).join("").replace(j, "$1"), n, a < r && ht(e.slice(a, r)), r < s && ht(e = e.slice(r)), r < s && e.join(""))
                        }
                        h.push(n)
                    }
                return ft(h)
            }

            function pt(e, t) {
                var r = t.length > 0,
                    s = e.length > 0,
                    o = function(u, a, f, l, h) {
                        var p, d, v, m = [],
                            y = 0,
                            w = "0",
                            x = u && [],
                            T = h != null,
                            N = c,
                            C = u || s && i.find.TAG("*", h && a.parentNode || a),
                            k = b += N == null ? 1 : Math.E;
                        T && (c = a !== g && a, n = o.el);
                        for (;
                            (p = C[w]) != null; w++) {
                            if (s && p) {
                                for (d = 0; v = e[d]; d++)
                                    if (v(p, a, f)) {
                                        l.push(p);
                                        break
                                    }
                                T && (b = k, n = ++o.el)
                            }
                            r && ((p = !v && p) && y--, u && x.push(p))
                        }
                        y += w;
                        if (r && w !== y) {
                            for (d = 0; v = t[d]; d++) v(x, m, a, f);
                            if (u) {
                                if (y > 0)
                                    while (w--) !x[w] && !m[w] && (m[w] = E.call(l));
                                m = lt(m)
                            }
                            S.apply(l, m), T && !u && m.length > 0 && y + t.length > 1 && nt.uniqueSort(l)
                        }
                        return T && (b = k, c = N), x
                    };
                return o.el = 0, r ? N(o) : o
            }

            function dt(e, t, n) {
                var r = 0,
                    i = t.length;
                for (; r < i; r++) nt(e, t[r], n);
                return n
            }

            function vt(e, t, n, r, s) {
                var o, u, f, l, c, h = ut(e),
                    p = h.length;
                if (!r && h.length === 1) {
                    u = h[0] = h[0].slice(0);
                    if (u.length > 2 && (f = u[0]).type === "ID" && t.nodeType === 9 && !s && i.relative[u[1].type]) {
                        t = i.find.ID(f.matches[0].replace($, ""), t, s)[0];
                        if (!t) return n;
                        e = e.slice(u.shift().length)
                    }
                    for (o = J.POS.test(e) ? -1 : u.length - 1; o >= 0; o--) {
                        f = u[o];
                        if (i.relative[l = f.type]) break;
                        if (c = i.find[l])
                            if (r = c(f.matches[0].replace($, ""), z.test(u[0].type) && t.parentNode || t, s)) {
                                u.splice(o, 1), e = r.length && u.join("");
                                if (!e) return S.apply(n, x.call(r, 0)), n;
                                break
                            }
                    }
                }
                return a(e, h)(r, t, s, n, z.test(e)), n
            }

            function mt() {}
            var n, r, i, s, o, u, a, f, l, c, h = !0,
                p = "undefined",
                d = ("sizcache" + Math.random()).replace(".", ""),
                m = String,
                g = e.document,
                y = g.documentElement,
                b = 0,
                w = 0,
                E = [].pop,
                S = [].push,
                x = [].slice,
                T = [].indexOf || function(e) {
                    var t = 0,
                        n = this.length;
                    for (; t < n; t++)
                        if (this[t] === e) return t;
                    return -1
                },
                N = function(e, t) {
                    return e[d] = t == null || t, e
                },
                C = function() {
                    var e = {},
                        t = [];
                    return N(function(n, r) {
                        return t.push(n) > i.cacheLength && delete e[t.shift()], e[n + " "] = r
                    }, e)
                },
                k = C(),
                L = C(),
                A = C(),
                O = "[\\x20\\t\\r\\n\\f]",
                M = "(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+",
                _ = M.replace("w", "w#"),
                D = "([*^$|!~]?=)",
                P = "\\[" + O + "*(" + M + ")" + O + "*(?:" + D + O + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + _ + ")|)|)" + O + "*\\]",
                H = ":(" + M + ")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:" + P + ")|[^:]|\\\\.)*|.*))\\)|)",
                B = ":(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + O + "*((?:-\\d)?\\d*)" + O + "*\\)|)(?=[^-]|$)",
                j = new RegExp("^" + O + "+|((?:^|[^\\\\])(?:\\\\.)*)" + O + "+$", "g"),
                F = new RegExp("^" + O + "*," + O + "*"),
                I = new RegExp("^" + O + "*([\\x20\\t\\r\\n\\f>+~])" + O + "*"),
                q = new RegExp(H),
                R = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,
                U = /^:not/,
                z = /[\x20\t\r\n\f]*[+~]/,
                W = /:not\($/,
                X = /h\d/i,
                V = /input|select|textarea|button/i,
                $ = /\\(?!\\)/g,
                J = {
                    ID: new RegExp("^#(" + M + ")"),
                    CLASS: new RegExp("^\\.(" + M + ")"),
                    NAME: new RegExp("^\\[name=['\"]?(" + M + ")['\"]?\\]"),
                    TAG: new RegExp("^(" + M.replace("w", "w*") + ")"),
                    ATTR: new RegExp("^" + P),
                    PSEUDO: new RegExp("^" + H),
                    POS: new RegExp(B, "i"),
                    CHILD: new RegExp("^:(only|nth|first|last)-child(?:\\(" + O + "*(even|odd|(([+-]|)(\\d*)n|)" + O + "*(?:([+-]|)" + O + "*(\\d+)|))" + O + "*\\)|)", "i"),
                    needsContext: new RegExp("^" + O + "*[>+~]|" + B, "i")
                },
                K = function(e) {
                    var t = g.createElement("div");
                    try {
                        return e(t)
                    } catch (n) {
                        return !1
                    } finally {
                        t = null
                    }
                },
                Q = K(function(e) {
                    return e.appendChild(g.createComment("")), !e.getElementsByTagName("*").length
                }),
                G = K(function(e) {
                    return e.innerHTML = "<a href='#'></a>", e.firstChild && typeof e.firstChild.getAttribute !== p && e.firstChild.getAttribute("href") === "#"
                }),
                Y = K(function(e) {
                    e.innerHTML = "<select></select>";
                    var t = typeof e.lastChild.getAttribute("multiple");
                    return t !== "boolean" && t !== "string"
                }),
                Z = K(function(e) {
                    return e.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>", !e.getElementsByClassName || !e.getElementsByClassName("e").length ? !1 : (e.lastChild.className = "e", e.getElementsByClassName("e").length === 2)
                }),
                et = K(function(e) {
                    e.id = d + 0, e.innerHTML = "<a name='" + d + "'></a><div name='" + d + "'></div>", y.insertBefore(e, y.firstChild);
                    var t = g.getElementsByName && g.getElementsByName(d).length === 2 + g.getElementsByName(d + 0).length;
                    return r = !g.getElementById(d), y.removeChild(e), t
                });
            try {
                x.call(y.childNodes, 0)[0].nodeType
            } catch (tt) {
                x = function(e) {
                    var t, n = [];
                    for (; t = this[e]; e++) n.push(t);
                    return n
                }
            }
            nt.matches = function(e, t) {
                return nt(e, null, null, t)
            }, nt.matchesSelector = function(e, t) {
                return nt(t, null, null, [e]).length > 0
            }, s = nt.getText = function(e) {
                var t, n = "",
                    r = 0,
                    i = e.nodeType;
                if (i) {
                    if (i === 1 || i === 9 || i === 11) {
                        if (typeof e.textContent == "string") return e.textContent;
                        for (e = e.firstChild; e; e = e.nextSibling) n += s(e)
                    } else if (i === 3 || i === 4) return e.nodeValue
                } else
                    for (; t = e[r]; r++) n += s(t);
                return n
            }, o = nt.isXML = function(e) {
                var t = e && (e.ownerDocument || e).documentElement;
                return t ? t.nodeName !== "HTML" : !1
            }, u = nt.contains = y.contains ? function(e, t) {
                var n = e.nodeType === 9 ? e.documentElement : e,
                    r = t && t.parentNode;
                return e === r || !!(r && r.nodeType === 1 && n.contains && n.contains(r))
            } : y.compareDocumentPosition ? function(e, t) {
                return t && !!(e.compareDocumentPosition(t) & 16)
            } : function(e, t) {
                while (t = t.parentNode)
                    if (t === e) return !0;
                return !1
            }, nt.attr = function(e, t) {
                var n, r = o(e);
                return r || (t = t.toLowerCase()), (n = i.attrHandle[t]) ? n(e) : r || Y ? e.getAttribute(t) : (n = e.getAttributeNode(t), n ? typeof e[t] == "boolean" ? e[t] ? t : null : n.specified ? n.value : null : null)
            }, i = nt.selectors = {
                cacheLength: 50,
                createPseudo: N,
                match: J,
                attrHandle: G ? {} : {
                    href: function(e) {
                        return e.getAttribute("href", 2)
                    },
                    type: function(e) {
                        return e.getAttribute("type")
                    }
                },
                find: {
                    ID: r ? function(e, t, n) {
                        if (typeof t.getElementById !== p && !n) {
                            var r = t.getElementById(e);
                            return r && r.parentNode ? [r] : []
                        }
                    } : function(e, n, r) {
                        if (typeof n.getElementById !== p && !r) {
                            var i = n.getElementById(e);
                            return i ? i.id === e || typeof i.getAttributeNode !== p && i.getAttributeNode("id").value === e ? [i] : t : []
                        }
                    },
                    TAG: Q ? function(e, t) {
                        if (typeof t.getElementsByTagName !== p) return t.getElementsByTagName(e)
                    } : function(e, t) {
                        var n = t.getElementsByTagName(e);
                        if (e === "*") {
                            var r, i = [],
                                s = 0;
                            for (; r = n[s]; s++) r.nodeType === 1 && i.push(r);
                            return i
                        }
                        return n
                    },
                    NAME: et && function(e, t) {
                        if (typeof t.getElementsByName !== p) return t.getElementsByName(name)
                    },
                    CLASS: Z && function(e, t, n) {
                        if (typeof t.getElementsByClassName !== p && !n) return t.getElementsByClassName(e)
                    }
                },
                relative: {
                    ">": {
                        dir: "parentNode",
                        first: !0
                    },
                    " ": {
                        dir: "parentNode"
                    },
                    "+": {
                        dir: "previousSibling",
                        first: !0
                    },
                    "~": {
                        dir: "previousSibling"
                    }
                },
                preFilter: {
                    ATTR: function(e) {
                        return e[1] = e[1].replace($, ""), e[3] = (e[4] || e[5] || "").replace($, ""), e[2] === "~=" && (e[3] = " " + e[3] + " "), e.slice(0, 4)
                    },
                    CHILD: function(e) {
                        return e[1] = e[1].toLowerCase(), e[1] === "nth" ? (e[2] || nt.error(e[0]), e[3] = +(e[3] ? e[4] + (e[5] || 1) : 2 * (e[2] === "even" || e[2] === "odd")), e[4] = +(e[6] + e[7] || e[2] === "odd")) : e[2] && nt.error(e[0]), e
                    },
                    PSEUDO: function(e) {
                        var t, n;
                        if (J.CHILD.test(e[0])) return null;
                        if (e[3]) e[2] = e[3];
                        else if (t = e[4]) q.test(t) && (n = ut(t, !0)) && (n = t.indexOf(")", t.length - n) - t.length) && (t = t.slice(0, n), e[0] = e[0].slice(0, n)), e[2] = t;
                        return e.slice(0, 3)
                    }
                },
                filter: {
                    ID: r ? function(e) {
                        return e = e.replace($, ""),
                            function(t) {
                                return t.getAttribute("id") === e
                            }
                    } : function(e) {
                        return e = e.replace($, ""),
                            function(t) {
                                var n = typeof t.getAttributeNode !== p && t.getAttributeNode("id");
                                return n && n.value === e
                            }
                    },
                    TAG: function(e) {
                        return e === "*" ? function() {
                            return !0
                        } : (e = e.replace($, "").toLowerCase(), function(t) {
                            return t.nodeName && t.nodeName.toLowerCase() === e
                        })
                    },
                    CLASS: function(e) {
                        var t = k[d][e + " "];
                        return t || (t = new RegExp("(^|" + O + ")" + e + "(" + O + "|$)")) && k(e, function(e) {
                            return t.test(e.className || typeof e.getAttribute !== p && e.getAttribute("class") || "")
                        })
                    },
                    ATTR: function(e, t, n) {
                        return function(r, i) {
                            var s = nt.attr(r, e);
                            return s == null ? t === "!=" : t ? (s += "", t === "=" ? s === n : t === "!=" ? s !== n : t === "^=" ? n && s.indexOf(n) === 0 : t === "*=" ? n && s.indexOf(n) > -1 : t === "$=" ? n && s.substr(s.length - n.length) === n : t === "~=" ? (" " + s + " ").indexOf(n) > -1 : t === "|=" ? s === n || s.substr(0, n.length + 1) === n + "-" : !1) : !0
                        }
                    },
                    CHILD: function(e, t, n, r) {
                        return e === "nth" ? function(e) {
                            var t, i, s = e.parentNode;
                            if (n === 1 && r === 0) return !0;
                            if (s) {
                                i = 0;
                                for (t = s.firstChild; t; t = t.nextSibling)
                                    if (t.nodeType === 1) {
                                        i++;
                                        if (e === t) break
                                    }
                            }
                            return i -= r, i === n || i % n === 0 && i / n >= 0
                        } : function(t) {
                            var n = t;
                            switch (e) {
                                case "only":
                                case "first":
                                    while (n = n.previousSibling)
                                        if (n.nodeType === 1) return !1;
                                    if (e === "first") return !0;
                                    n = t;
                                case "last":
                                    while (n = n.nextSibling)
                                        if (n.nodeType === 1) return !1;
                                    return !0
                            }
                        }
                    },
                    PSEUDO: function(e, t) {
                        var n, r = i.pseudos[e] || i.setFilters[e.toLowerCase()] || nt.error("unsupported pseudo: " + e);
                        return r[d] ? r(t) : r.length > 1 ? (n = [e, e, "", t], i.setFilters.hasOwnProperty(e.toLowerCase()) ? N(function(e, n) {
                            var i, s = r(e, t),
                                o = s.length;
                            while (o--) i = T.call(e, s[o]), e[i] = !(n[i] = s[o])
                        }) : function(e) {
                            return r(e, 0, n)
                        }) : r
                    }
                },
                pseudos: {
                    not: N(function(e) {
                        var t = [],
                            n = [],
                            r = a(e.replace(j, "$1"));
                        return r[d] ? N(function(e, t, n, i) {
                            var s, o = r(e, null, i, []),
                                u = e.length;
                            while (u--)
                                if (s = o[u]) e[u] = !(t[u] = s)
                        }) : function(e, i, s) {
                            return t[0] = e, r(t, null, s, n), !n.pop()
                        }
                    }),
                    has: N(function(e) {
                        return function(t) {
                            return nt(e, t).length > 0
                        }
                    }),
                    contains: N(function(e) {
                        return function(t) {
                            return (t.textContent || t.innerText || s(t)).indexOf(e) > -1
                        }
                    }),
                    enabled: function(e) {
                        return e.disabled === !1
                    },
                    disabled: function(e) {
                        return e.disabled === !0
                    },
                    checked: function(e) {
                        var t = e.nodeName.toLowerCase();
                        return t === "input" && !!e.checked || t === "option" && !!e.selected
                    },
                    selected: function(e) {
                        return e.parentNode && e.parentNode.selectedIndex, e.selected === !0
                    },
                    parent: function(e) {
                        return !i.pseudos.empty(e)
                    },
                    empty: function(e) {
                        var t;
                        e = e.firstChild;
                        while (e) {
                            if (e.nodeName > "@" || (t = e.nodeType) === 3 || t === 4) return !1;
                            e = e.nextSibling
                        }
                        return !0
                    },
                    header: function(e) {
                        return X.test(e.nodeName)
                    },
                    text: function(e) {
                        var t, n;
                        return e.nodeName.toLowerCase() === "input" && (t = e.type) === "text" && ((n = e.getAttribute("type")) == null || n.toLowerCase() === t)
                    },
                    radio: rt("radio"),
                    checkbox: rt("checkbox"),
                    file: rt("file"),
                    password: rt("password"),
                    image: rt("image"),
                    submit: it("submit"),
                    reset: it("reset"),
                    button: function(e) {
                        var t = e.nodeName.toLowerCase();
                        return t === "input" && e.type === "button" || t === "button"
                    },
                    input: function(e) {
                        return V.test(e.nodeName)
                    },
                    focus: function(e) {
                        var t = e.ownerDocument;
                        return e === t.activeElement && (!t.hasFocus || t.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                    },
                    active: function(e) {
                        return e === e.ownerDocument.activeElement
                    },
                    first: st(function() {
                        return [0]
                    }),
                    last: st(function(e, t) {
                        return [t - 1]
                    }),
                    eq: st(function(e, t, n) {
                        return [n < 0 ? n + t : n]
                    }),
                    even: st(function(e, t) {
                        for (var n = 0; n < t; n += 2) e.push(n);
                        return e
                    }),
                    odd: st(function(e, t) {
                        for (var n = 1; n < t; n += 2) e.push(n);
                        return e
                    }),
                    lt: st(function(e, t, n) {
                        for (var r = n < 0 ? n + t : n; --r >= 0;) e.push(r);
                        return e
                    }),
                    gt: st(function(e, t, n) {
                        for (var r = n < 0 ? n + t : n; ++r < t;) e.push(r);
                        return e
                    })
                }
            }, f = y.compareDocumentPosition ? function(e, t) {
                return e === t ? (l = !0, 0) : (!e.compareDocumentPosition || !t.compareDocumentPosition ? e.compareDocumentPosition : e.compareDocumentPosition(t) & 4) ? -1 : 1
            } : function(e, t) {
                if (e === t) return l = !0, 0;
                if (e.sourceIndex && t.sourceIndex) return e.sourceIndex - t.sourceIndex;
                var n, r, i = [],
                    s = [],
                    o = e.parentNode,
                    u = t.parentNode,
                    a = o;
                if (o === u) return ot(e, t);
                if (!o) return -1;
                if (!u) return 1;
                while (a) i.unshift(a), a = a.parentNode;
                a = u;
                while (a) s.unshift(a), a = a.parentNode;
                n = i.length, r = s.length;
                for (var f = 0; f < n && f < r; f++)
                    if (i[f] !== s[f]) return ot(i[f], s[f]);
                return f === n ? ot(e, s[f], -1) : ot(i[f], t, 1)
            }, [0, 0].sort(f), h = !l, nt.uniqueSort = function(e) {
                var t, n = [],
                    r = 1,
                    i = 0;
                l = h, e.sort(f);
                if (l) {
                    for (; t = e[r]; r++) t === e[r - 1] && (i = n.push(r));
                    while (i--) e.splice(n[i], 1)
                }
                return e
            }, nt.error = function(e) {
                throw new Error("Syntax error, unrecognized expression: " + e)
            }, a = nt.compile = function(e, t) {
                var n, r = [],
                    i = [],
                    s = A[d][e + " "];
                if (!s) {
                    t || (t = ut(e)), n = t.length;
                    while (n--) s = ht(t[n]), s[d] ? r.push(s) : i.push(s);
                    s = A(e, pt(i, r))
                }
                return s
            }, g.querySelectorAll && function() {
                var e, t = vt,
                    n = /'|\\/g,
                    r = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,
                    i = [":focus"],
                    s = [":active"],
                    u = y.matchesSelector || y.mozMatchesSelector || y.webkitMatchesSelector || y.oMatchesSelector || y.msMatchesSelector;
                K(function(e) {
                    e.innerHTML = "<select><option selected=''></option></select>", e.querySelectorAll("[selected]").length || i.push("\\[" + O + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)"), e.querySelectorAll(":checked").length || i.push(":checked")
                }), K(function(e) {
                    e.innerHTML = "<p test=''></p>", e.querySelectorAll("[test^='']").length && i.push("[*^$]=" + O + "*(?:\"\"|'')"), e.innerHTML = "<input type='hidden'/>", e.querySelectorAll(":enabled").length || i.push(":enabled", ":disabled")
                }), i = new RegExp(i.join("|")), vt = function(e, r, s, o, u) {
                    if (!o && !u && !i.test(e)) {
                        var a, f, l = !0,
                            c = d,
                            h = r,
                            p = r.nodeType === 9 && e;
                        if (r.nodeType === 1 && r.nodeName.toLowerCase() !== "object") {
                            a = ut(e), (l = r.getAttribute("id")) ? c = l.replace(n, "\\$&") : r.setAttribute("id", c), c = "[id='" + c + "'] ", f = a.length;
                            while (f--) a[f] = c + a[f].join("");
                            h = z.test(e) && r.parentNode || r, p = a.join(",")
                        }
                        if (p) try {
                            return S.apply(s, x.call(h.querySelectorAll(p), 0)), s
                        } catch (v) {} finally {
                            l || r.removeAttribute("id")
                        }
                    }
                    return t(e, r, s, o, u)
                }, u && (K(function(t) {
                    e = u.call(t, "div");
                    try {
                        u.call(t, "[test!='']:sizzle"), s.push("!=", H)
                    } catch (n) {}
                }), s = new RegExp(s.join("|")), nt.matchesSelector = function(t, n) {
                    n = n.replace(r, "='$1']");
                    if (!o(t) && !s.test(n) && !i.test(n)) try {
                        var a = u.call(t, n);
                        if (a || e || t.document && t.document.nodeType !== 11) return a
                    } catch (f) {}
                    return nt(n, null, null, [t]).length > 0
                })
            }(), i.pseudos.nth = i.pseudos.eq, i.filters = mt.prototype = i.pseudos, i.setFilters = new mt, nt.attr = v.attr, v.find = nt, v.expr = nt.selectors, v.expr[":"] = v.expr.pseudos, v.unique = nt.uniqueSort, v.text = nt.getText, v.isXMLDoc = nt.isXML, v.contains = nt.contains
        }(e);
    var nt = /Until$/,
        rt = /^(?:parents|prev(?:Until|All))/,
        it = /^.[^:#\[\.,]*$/,
        st = v.expr.match.needsContext,
        ot = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };
    v.fn.extend({
        find: function(e) {
            var t, n, r, i, s, o, u = this;
            if (typeof e != "string") return v(e).filter(function() {
                for (t = 0, n = u.length; t < n; t++)
                    if (v.contains(u[t], this)) return !0
            });
            o = this.pushStack("", "find", e);
            for (t = 0, n = this.length; t < n; t++) {
                r = o.length, v.find(e, this[t], o);
                if (t > 0)
                    for (i = r; i < o.length; i++)
                        for (s = 0; s < r; s++)
                            if (o[s] === o[i]) {
                                o.splice(i--, 1);
                                break
                            }
            }
            return o
        },
        has: function(e) {
            var t, n = v(e, this),
                r = n.length;
            return this.filter(function() {
                for (t = 0; t < r; t++)
                    if (v.contains(this, n[t])) return !0
            })
        },
        not: function(e) {
            return this.pushStack(ft(this, e, !1), "not", e)
        },
        filter: function(e) {
            return this.pushStack(ft(this, e, !0), "filter", e)
        },
        is: function(e) {
            return !!e && (typeof e == "string" ? st.test(e) ? v(e, this.context).index(this[0]) >= 0 : v.filter(e, this).length > 0 : this.filter(e).length > 0)
        },
        closest: function(e, t) {
            var n, r = 0,
                i = this.length,
                s = [],
                o = st.test(e) || typeof e != "string" ? v(e, t || this.context) : 0;
            for (; r < i; r++) {
                n = this[r];
                while (n && n.ownerDocument && n !== t && n.nodeType !== 11) {
                    if (o ? o.index(n) > -1 : v.find.matchesSelector(n, e)) {
                        s.push(n);
                        break
                    }
                    n = n.parentNode
                }
            }
            return s = s.length > 1 ? v.unique(s) : s, this.pushStack(s, "closest", e)
        },
        index: function(e) {
            return e ? typeof e == "string" ? v.inArray(this[0], v(e)) : v.inArray(e.jquery ? e[0] : e, this) : this[0] && this[0].parentNode ? this.prevAll().length : -1
        },
        add: function(e, t) {
            var n = typeof e == "string" ? v(e, t) : v.makeArray(e && e.nodeType ? [e] : e),
                r = v.merge(this.get(), n);
            return this.pushStack(ut(n[0]) || ut(r[0]) ? r : v.unique(r))
        },
        addBack: function(e) {
            return this.add(e == null ? this.prevObject : this.prevObject.filter(e))
        }
    }), v.fn.andSelf = v.fn.addBack, v.each({
        parent: function(e) {
            var t = e.parentNode;
            return t && t.nodeType !== 11 ? t : null
        },
        parents: function(e) {
            return v.dir(e, "parentNode")
        },
        parentsUntil: function(e, t, n) {
            return v.dir(e, "parentNode", n)
        },
        next: function(e) {
            return at(e, "nextSibling")
        },
        prev: function(e) {
            return at(e, "previousSibling")
        },
        nextAll: function(e) {
            return v.dir(e, "nextSibling")
        },
        prevAll: function(e) {
            return v.dir(e, "previousSibling")
        },
        nextUntil: function(e, t, n) {
            return v.dir(e, "nextSibling", n)
        },
        prevUntil: function(e, t, n) {
            return v.dir(e, "previousSibling", n)
        },
        siblings: function(e) {
            return v.sibling((e.parentNode || {}).firstChild, e)
        },
        children: function(e) {
            return v.sibling(e.firstChild)
        },
        contents: function(e) {
            return v.nodeName(e, "iframe") ? e.contentDocument || e.contentWindow.document : v.merge([], e.childNodes)
        }
    }, function(e, t) {
        v.fn[e] = function(n, r) {
            var i = v.map(this, t, n);
            return nt.test(e) || (r = n), r && typeof r == "string" && (i = v.filter(r, i)), i = this.length > 1 && !ot[e] ? v.unique(i) : i, this.length > 1 && rt.test(e) && (i = i.reverse()), this.pushStack(i, e, l.call(arguments).join(","))
        }
    }), v.extend({
        filter: function(e, t, n) {
            return n && (e = ":not(" + e + ")"), t.length === 1 ? v.find.matchesSelector(t[0], e) ? [t[0]] : [] : v.find.matches(e, t)
        },
        dir: function(e, n, r) {
            var i = [],
                s = e[n];
            while (s && s.nodeType !== 9 && (r === t || s.nodeType !== 1 || !v(s).is(r))) s.nodeType === 1 && i.push(s), s = s[n];
            return i
        },
        sibling: function(e, t) {
            var n = [];
            for (; e; e = e.nextSibling) e.nodeType === 1 && e !== t && n.push(e);
            return n
        }
    });
    var ct = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
        ht = / jQuery\d+="(?:null|\d+)"/g,
        pt = /^\s+/,
        dt = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        vt = /<([\w:]+)/,
        mt = /<tbody/i,
        gt = /<|&#?\w+;/,
        yt = /<(?:script|style|link)/i,
        bt = /<(?:script|object|embed|option|style)/i,
        wt = new RegExp("<(?:" + ct + ")[\\s/>]", "i"),
        Et = /^(?:checkbox|radio)$/,
        St = /checked\s*(?:[^=]|=\s*.checked.)/i,
        xt = /\/(java|ecma)script/i,
        Tt = /^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g,
        Nt = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            legend: [1, "<fieldset>", "</fieldset>"],
            thead: [1, "<table>", "</table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            area: [1, "<map>", "</map>"],
            _default: [0, "", ""]
        },
        Ct = lt(i),
        kt = Ct.appendChild(i.createElement("div"));
    Nt.optgroup = Nt.option, Nt.tbody = Nt.tfoot = Nt.colgroup = Nt.caption = Nt.thead, Nt.th = Nt.td, v.support.htmlSerialize || (Nt._default = [1, "X<div>", "</div>"]), v.fn.extend({
            text: function(e) {
                return v.access(this, function(e) {
                    return e === t ? v.text(this) : this.empty().append((this[0] && this[0].ownerDocument || i).createTextNode(e))
                }, null, e, arguments.length)
            },
            wrapAll: function(e) {
                if (v.isFunction(e)) return this.each(function(t) {
                    v(this).wrapAll(e.call(this, t))
                });
                if (this[0]) {
                    var t = v(e, this[0].ownerDocument).eq(0).clone(!0);
                    this[0].parentNode && t.insertBefore(this[0]), t.map(function() {
                        var e = this;
                        while (e.firstChild && e.firstChild.nodeType === 1) e = e.firstChild;
                        return e
                    }).append(this)
                }
                return this
            },
            wrapInner: function(e) {
                return v.isFunction(e) ? this.each(function(t) {
                    v(this).wrapInner(e.call(this, t))
                }) : this.each(function() {
                    var t = v(this),
                        n = t.contents();
                    n.length ? n.wrapAll(e) : t.append(e)
                })
            },
            wrap: function(e) {
                var t = v.isFunction(e);
                return this.each(function(n) {
                    v(this).wrapAll(t ? e.call(this, n) : e)
                })
            },
            unwrap: function() {
                return this.parent().each(function() {
                    v.nodeName(this, "body") || v(this).replaceWith(this.childNodes)
                }).end()
            },
            append: function() {
                return this.domManip(arguments, !0, function(e) {
                    (this.nodeType === 1 || this.nodeType === 11) && this.appendChild(e)
                })
            },
            prepend: function() {
                return this.domManip(arguments, !0, function(e) {
                    (this.nodeType === 1 || this.nodeType === 11) && this.insertBefore(e, this.firstChild)
                })
            },
            before: function() {
                if (!ut(this[0])) return this.domManip(arguments, !1, function(e) {
                    this.parentNode.insertBefore(e, this)
                });
                if (arguments.length) {
                    var e = v.clean(arguments);
                    return this.pushStack(v.merge(e, this), "before", this.selector)
                }
            },
            after: function() {
                if (!ut(this[0])) return this.domManip(arguments, !1, function(e) {
                    this.parentNode.insertBefore(e, this.nextSibling)
                });
                if (arguments.length) {
                    var e = v.clean(arguments);
                    return this.pushStack(v.merge(this, e), "after", this.selector)
                }
            },
            remove: function(e, t) {
                var n, r = 0;
                for (;
                    (n = this[r]) != null; r++)
                    if (!e || v.filter(e, [n]).length) !t && n.nodeType === 1 && (v.cleanData(n.getElementsByTagName("*")), v.cleanData([n])), n.parentNode && n.parentNode.removeChild(n);
                return this
            },
            empty: function() {
                var e, t = 0;
                for (;
                    (e = this[t]) != null; t++) {
                    e.nodeType === 1 && v.cleanData(e.getElementsByTagName("*"));
                    while (e.firstChild) e.removeChild(e.firstChild)
                }
                return this
            },
            clone: function(e, t) {
                return e = e == null ? !1 : e, t = t == null ? e : t, this.map(function() {
                    return v.clone(this, e, t)
                })
            },
            html: function(e) {
                return v.access(this, function(e) {
                    var n = this[0] || {},
                        r = 0,
                        i = this.length;
                    if (e === t) return n.nodeType === 1 ? n.innerHTML.replace(ht, "") : t;
                    if (typeof e == "string" && !yt.test(e) && (v.support.htmlSerialize || !wt.test(e)) && (v.support.leadingWhitespace || !pt.test(e)) && !Nt[(vt.exec(e) || ["", ""])[1].toLowerCase()]) {
                        e = e.replace(dt, "<$1></$2>");
                        try {
                            for (; r < i; r++) n = this[r] || {}, n.nodeType === 1 && (v.cleanData(n.getElementsByTagName("*")), n.innerHTML = e);
                            n = 0
                        } catch (s) {}
                    }
                    n && this.empty().append(e)
                }, null, e, arguments.length)
            },
            replaceWith: function(e) {
                return ut(this[0]) ? this.length ? this.pushStack(v(v.isFunction(e) ? e() : e), "replaceWith", e) : this : v.isFunction(e) ? this.each(function(t) {
                    var n = v(this),
                        r = n.html();
                    n.replaceWith(e.call(this, t, r))
                }) : (typeof e != "string" && (e = v(e).detach()), this.each(function() {
                    var t = this.nextSibling,
                        n = this.parentNode;
                    v(this).remove(), t ? v(t).before(e) : v(n).append(e)
                }))
            },
            detach: function(e) {
                return this.remove(e, !0)
            },
            domManip: function(e, n, r) {
                e = [].concat.apply([], e);
                var i, s, o, u, a = 0,
                    f = e[0],
                    l = [],
                    c = this.length;
                if (!v.support.checkClone && c > 1 && typeof f == "string" && St.test(f)) return this.each(function() {
                    v(this).domManip(e, n, r)
                });
                if (v.isFunction(f)) return this.each(function(i) {
                    var s = v(this);
                    e[0] = f.call(this, i, n ? s.html() : t), s.domManip(e, n, r)
                });
                if (this[0]) {
                    i = v.buildFragment(e, this, l), o = i.fragment, s = o.firstChild, o.childNodes.length === 1 && (o = s);
                    if (s) {
                        n = n && v.nodeName(s, "tr");
                        for (u = i.cacheable || c - 1; a < c; a++) r.call(n && v.nodeName(this[a], "table") ? Lt(this[a], "tbody") : this[a], a === u ? o : v.clone(o, !0, !0))
                    }
                    o = s = null, l.length && v.each(l, function(e, t) {
                        t.src ? v.ajax ? v.ajax({
                            url: t.src,
                            type: "GET",
                            dataType: "script",
                            async: !1,
                            global: !1,
                            "throws": !0
                        }) : v.error("no ajax") : v.globalEval((t.text || t.textContent || t.innerHTML || "").replace(Tt, "")), t.parentNode && t.parentNode.removeChild(t)
                    })
                }
                return this
            }
        }), v.buildFragment = function(e, n, r) {
            var s, o, u, a = e[0];
            return n = n || i, n = !n.nodeType && n[0] || n, n = n.ownerDocument || n, e.length === 1 && typeof a == "string" && a.length < 512 && n === i && a.charAt(0) === "<" && !bt.test(a) && (v.support.checkClone || !St.test(a)) && (v.support.html5Clone || !wt.test(a)) && (o = !0, s = v.fragments[a], u = s !== t), s || (s = n.createDocumentFragment(), v.clean(e, n, s, r), o && (v.fragments[a] = u && s)), {
                fragment: s,
                cacheable: o
            }
        }, v.fragments = {}, v.each({
            appendTo: "append",
            prependTo: "prepend",
            insertBefore: "before",
            insertAfter: "after",
            replaceAll: "replaceWith"
        }, function(e, t) {
            v.fn[e] = function(n) {
                var r, i = 0,
                    s = [],
                    o = v(n),
                    u = o.length,
                    a = this.length === 1 && this[0].parentNode;
                if ((a == null || a && a.nodeType === 11 && a.childNodes.length === 1) && u === 1) return o[t](this[0]), this;
                for (; i < u; i++) r = (i > 0 ? this.clone(!0) : this).get(), v(o[i])[t](r), s = s.concat(r);
                return this.pushStack(s, e, o.selector)
            }
        }), v.extend({
            clone: function(e, t, n) {
                var r, i, s, o;
                v.support.html5Clone || v.isXMLDoc(e) || !wt.test("<" + e.nodeName + ">") ? o = e.cloneNode(!0) : (kt.innerHTML = e.outerHTML, kt.removeChild(o = kt.firstChild));
                if ((!v.support.noCloneEvent || !v.support.noCloneChecked) && (e.nodeType === 1 || e.nodeType === 11) && !v.isXMLDoc(e)) {
                    Ot(e, o), r = Mt(e), i = Mt(o);
                    for (s = 0; r[s]; ++s) i[s] && Ot(r[s], i[s])
                }
                if (t) {
                    At(e, o);
                    if (n) {
                        r = Mt(e), i = Mt(o);
                        for (s = 0; r[s]; ++s) At(r[s], i[s])
                    }
                }
                return r = i = null, o
            },
            clean: function(e, t, n, r) {
                var s, o, u, a, f, l, c, h, p, d, m, g, y = t === i && Ct,
                    b = [];
                if (!t || typeof t.createDocumentFragment == "undefined") t = i;
                for (s = 0;
                    (u = e[s]) != null; s++) {
                    typeof u == "number" && (u += "");
                    if (!u) continue;
                    if (typeof u == "string")
                        if (!gt.test(u)) u = t.createTextNode(u);
                        else {
                            y = y || lt(t), c = t.createElement("div"), y.appendChild(c), u = u.replace(dt, "<$1></$2>"), a = (vt.exec(u) || ["", ""])[1].toLowerCase(), f = Nt[a] || Nt._default, l = f[0], c.innerHTML = f[1] + u + f[2];
                            while (l--) c = c.lastChild;
                            if (!v.support.tbody) {
                                h = mt.test(u), p = a === "table" && !h ? c.firstChild && c.firstChild.childNodes : f[1] === "<table>" && !h ? c.childNodes : [];
                                for (o = p.length - 1; o >= 0; --o) v.nodeName(p[o], "tbody") && !p[o].childNodes.length && p[o].parentNode.removeChild(p[o])
                            }!v.support.leadingWhitespace && pt.test(u) && c.insertBefore(t.createTextNode(pt.exec(u)[0]), c.firstChild), u = c.childNodes, c.parentNode.removeChild(c)
                        }
                    u.nodeType ? b.push(u) : v.merge(b, u)
                }
                c && (u = c = y = null);
                if (!v.support.appendChecked)
                    for (s = 0;
                        (u = b[s]) != null; s++) v.nodeName(u, "input") ? _t(u) : typeof u.getElementsByTagName != "undefined" && v.grep(u.getElementsByTagName("input"), _t);
                if (n) {
                    m = function(e) {
                        if (!e.type || xt.test(e.type)) return r ? r.push(e.parentNode ? e.parentNode.removeChild(e) : e) : n.appendChild(e)
                    };
                    for (s = 0;
                        (u = b[s]) != null; s++)
                        if (!v.nodeName(u, "script") || !m(u)) n.appendChild(u), typeof u.getElementsByTagName != "undefined" && (g = v.grep(v.merge([], u.getElementsByTagName("script")), m), b.splice.apply(b, [s + 1, 0].concat(g)), s += g.length)
                }
                return b
            },
            cleanData: function(e, t) {
                var n, r, i, s, o = 0,
                    u = v.expando,
                    a = v.cache,
                    f = v.support.deleteExpando,
                    l = v.event.special;
                for (;
                    (i = e[o]) != null; o++)
                    if (t || v.acceptData(i)) {
                        r = i[u], n = r && a[r];
                        if (n) {
                            if (n.events)
                                for (s in n.events) l[s] ? v.event.remove(i, s) : v.removeEvent(i, s, n.handle);
                            a[r] && (delete a[r], f ? delete i[u] : i.removeAttribute ? i.removeAttribute(u) : i[u] = null, v.deletedIds.push(r))
                        }
                    }
            }
        }),
        function() {
            var e, t;
            v.uaMatch = function(e) {
                e = e.toLowerCase();
                var t = /(chrome)[ \/]([\w.]+)/.exec(e) || /(webkit)[ \/]([\w.]+)/.exec(e) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e) || /(msie) ([\w.]+)/.exec(e) || e.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e) || [];
                return {
                    browser: t[1] || "",
                    version: t[2] || "0"
                }
            }, e = v.uaMatch(o.userAgent), t = {}, e.browser && (t[e.browser] = !0, t.version = e.version), t.chrome ? t.webkit = !0 : t.webkit && (t.safari = !0), v.browser = t, v.sub = function() {
                function e(t, n) {
                    return new e.fn.init(t, n)
                }
                v.extend(!0, e, this), e.superclass = this, e.fn = e.prototype = this(), e.fn.constructor = e, e.sub = this.sub, e.fn.init = function(r, i) {
                    return i && i instanceof v && !(i instanceof e) && (i = e(i)), v.fn.init.call(this, r, i, t)
                }, e.fn.init.prototype = e.fn;
                var t = e(i);
                return e
            }
        }();
    var Dt, Pt, Ht, Bt = /alpha\([^)]*\)/i,
        jt = /opacity=([^)]*)/,
        Ft = /^(top|right|bottom|left)$/,
        It = /^(none|table(?!-c[ea]).+)/,
        qt = /^margin/,
        Rt = new RegExp("^(" + m + ")(.*)$", "i"),
        Ut = new RegExp("^(" + m + ")(?!px)[a-z%]+$", "i"),
        zt = new RegExp("^([-+])=(" + m + ")", "i"),
        Wt = {
            BODY: "block"
        },
        Xt = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        },
        Vt = {
            letterSpacing: 0,
            fontWeight: 400
        },
        $t = ["Top", "Right", "Bottom", "Left"],
        Jt = ["Webkit", "O", "Moz", "ms"],
        Kt = v.fn.toggle;
    v.fn.extend({
        css: function(e, n) {
            return v.access(this, function(e, n, r) {
                return r !== t ? v.style(e, n, r) : v.css(e, n)
            }, e, n, arguments.length > 1)
        },
        show: function() {
            return Yt(this, !0)
        },
        hide: function() {
            return Yt(this)
        },
        toggle: function(e, t) {
            var n = typeof e == "boolean";
            return v.isFunction(e) && v.isFunction(t) ? Kt.apply(this, arguments) : this.each(function() {
                (n ? e : Gt(this)) ? v(this).show(): v(this).hide()
            })
        }
    }), v.extend({
        cssHooks: {
            opacity: {
                get: function(e, t) {
                    if (t) {
                        var n = Dt(e, "opacity");
                        return n === "" ? "1" : n
                    }
                }
            }
        },
        cssNumber: {
            fillOpacity: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            "float": v.support.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function(e, n, r, i) {
            if (!e || e.nodeType === 3 || e.nodeType === 8 || !e.style) return;
            var s, o, u, a = v.camelCase(n),
                f = e.style;
            n = v.cssProps[a] || (v.cssProps[a] = Qt(f, a)), u = v.cssHooks[n] || v.cssHooks[a];
            if (r === t) return u && "get" in u && (s = u.get(e, !1, i)) !== t ? s : f[n];
            o = typeof r, o === "string" && (s = zt.exec(r)) && (r = (s[1] + 1) * s[2] + parseFloat(v.css(e, n)), o = "number");
            if (r == null || o === "number" && isNaN(r)) return;
            o === "number" && !v.cssNumber[a] && (r += "px");
            if (!u || !("set" in u) || (r = u.set(e, r, i)) !== t) try {
                f[n] = r
            } catch (l) {}
        },
        css: function(e, n, r, i) {
            var s, o, u, a = v.camelCase(n);
            return n = v.cssProps[a] || (v.cssProps[a] = Qt(e.style, a)), u = v.cssHooks[n] || v.cssHooks[a], u && "get" in u && (s = u.get(e, !0, i)), s === t && (s = Dt(e, n)), s === "normal" && n in Vt && (s = Vt[n]), r || i !== t ? (o = parseFloat(s), r || v.isNumeric(o) ? o || 0 : s) : s
        },
        swap: function(e, t, n) {
            var r, i, s = {};
            for (i in t) s[i] = e.style[i], e.style[i] = t[i];
            r = n.call(e);
            for (i in t) e.style[i] = s[i];
            return r
        }
    }), e.getComputedStyle ? Dt = function(t, n) {
        var r, i, s, o, u = e.getComputedStyle(t, null),
            a = t.style;
        return u && (r = u.getPropertyValue(n) || u[n], r === "" && !v.contains(t.ownerDocument, t) && (r = v.style(t, n)), Ut.test(r) && qt.test(n) && (i = a.width, s = a.minWidth, o = a.maxWidth, a.minWidth = a.maxWidth = a.width = r, r = u.width, a.width = i, a.minWidth = s, a.maxWidth = o)), r
    } : i.documentElement.currentStyle && (Dt = function(e, t) {
        var n, r, i = e.currentStyle && e.currentStyle[t],
            s = e.style;
        return i == null && s && s[t] && (i = s[t]), Ut.test(i) && !Ft.test(t) && (n = s.left, r = e.runtimeStyle && e.runtimeStyle.left, r && (e.runtimeStyle.left = e.currentStyle.left), s.left = t === "fontSize" ? "1em" : i, i = s.pixelLeft + "px", s.left = n, r && (e.runtimeStyle.left = r)), i === "" ? "auto" : i
    }), v.each(["height", "width"], function(e, t) {
        v.cssHooks[t] = {
            get: function(e, n, r) {
                if (n) return e.offsetWidth === 0 && It.test(Dt(e, "display")) ? v.swap(e, Xt, function() {
                    return tn(e, t, r)
                }) : tn(e, t, r)
            },
            set: function(e, n, r) {
                return Zt(e, n, r ? en(e, t, r, v.support.boxSizing && v.css(e, "boxSizing") === "border-box") : 0)
            }
        }
    }), v.support.opacity || (v.cssHooks.opacity = {
        get: function(e, t) {
            return jt.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : t ? "1" : ""
        },
        set: function(e, t) {
            var n = e.style,
                r = e.currentStyle,
                i = v.isNumeric(t) ? "alpha(opacity=" + t * 100 + ")" : "",
                s = r && r.filter || n.filter || "";
            n.zoom = 1;
            if (t >= 1 && v.trim(s.replace(Bt, "")) === "" && n.removeAttribute) {
                n.removeAttribute("filter");
                if (r && !r.filter) return
            }
            n.filter = Bt.test(s) ? s.replace(Bt, i) : s + " " + i
        }
    }), v(function() {
        v.support.reliableMarginRight || (v.cssHooks.marginRight = {
            get: function(e, t) {
                return v.swap(e, {
                    display: "inline-block"
                }, function() {
                    if (t) return Dt(e, "marginRight")
                })
            }
        }), !v.support.pixelPosition && v.fn.position && v.each(["top", "left"], function(e, t) {
            v.cssHooks[t] = {
                get: function(e, n) {
                    if (n) {
                        var r = Dt(e, t);
                        return Ut.test(r) ? v(e).position()[t] + "px" : r
                    }
                }
            }
        })
    }), v.expr && v.expr.filters && (v.expr.filters.hidden = function(e) {
        return e.offsetWidth === 0 && e.offsetHeight === 0 || !v.support.reliableHiddenOffsets && (e.style && e.style.display || Dt(e, "display")) === "none"
    }, v.expr.filters.visible = function(e) {
        return !v.expr.filters.hidden(e)
    }), v.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(e, t) {
        v.cssHooks[e + t] = {
            expand: function(n) {
                var r, i = typeof n == "string" ? n.split(" ") : [n],
                    s = {};
                for (r = 0; r < 4; r++) s[e + $t[r] + t] = i[r] || i[r - 2] || i[0];
                return s
            }
        }, qt.test(e) || (v.cssHooks[e + t].set = Zt)
    });
    var rn = /%20/g,
        sn = /\[\]$/,
        on = /\r?\n/g,
        un = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
        an = /^(?:select|textarea)/i;
    v.fn.extend({
        serialize: function() {
            return v.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                return this.elements ? v.makeArray(this.elements) : this
            }).filter(function() {
                return this.name && !this.disabled && (this.checked || an.test(this.nodeName) || un.test(this.type))
            }).map(function(e, t) {
                var n = v(this).val();
                return n == null ? null : v.isArray(n) ? v.map(n, function(e, n) {
                    return {
                        name: t.name,
                        value: e.replace(on, "\r\n")
                    }
                }) : {
                    name: t.name,
                    value: n.replace(on, "\r\n")
                }
            }).get()
        }
    }), v.param = function(e, n) {
        var r, i = [],
            s = function(e, t) {
                t = v.isFunction(t) ? t() : t == null ? "" : t, i[i.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
            };
        n === t && (n = v.ajaxSettings && v.ajaxSettings.traditional);
        if (v.isArray(e) || e.jquery && !v.isPlainObject(e)) v.each(e, function() {
            s(this.name, this.value)
        });
        else
            for (r in e) fn(r, e[r], n, s);
        return i.join("&").replace(rn, "+")
    };
    var ln, cn, hn = /#.*$/,
        pn = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg,
        dn = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
        vn = /^(?:GET|HEAD)$/,
        mn = /^\/\//,
        gn = /\?/,
        yn = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        bn = /([?&])_=[^&]*/,
        wn = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
        En = v.fn.load,
        Sn = {},
        xn = {},
        Tn = ["*/"] + ["*"];
    try {
        cn = s.href
    } catch (Nn) {
        cn = i.createElement("a"), cn.href = "", cn = cn.href
    }
    ln = wn.exec(cn.toLowerCase()) || [], v.fn.load = function(e, n, r) {
        if (typeof e != "string" && En) return En.apply(this, arguments);
        if (!this.length) return this;
        var i, s, o, u = this,
            a = e.indexOf(" ");
        return a >= 0 && (i = e.slice(a, e.length), e = e.slice(0, a)), v.isFunction(n) ? (r = n, n = t) : n && typeof n == "object" && (s = "POST"), v.ajax({
            url: e,
            type: s,
            dataType: "html",
            data: n,
            complete: function(e, t) {
                r && u.each(r, o || [e.responseText, t, e])
            }
        }).done(function(e) {
            o = arguments, u.html(i ? v("<div>").append(e.replace(yn, "")).find(i) : e)
        }), this
    }, v.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function(e, t) {
        v.fn[t] = function(e) {
            return this.on(t, e)
        }
    }), v.each(["get", "post"], function(e, n) {
        v[n] = function(e, r, i, s) {
            return v.isFunction(r) && (s = s || i, i = r, r = t), v.ajax({
                type: n,
                url: e,
                data: r,
                success: i,
                dataType: s
            })
        }
    }), v.extend({
        getScript: function(e, n) {
            return v.get(e, t, n, "script")
        },
        getJSON: function(e, t, n) {
            return v.get(e, t, n, "json")
        },
        ajaxSetup: function(e, t) {
            return t ? Ln(e, v.ajaxSettings) : (t = e, e = v.ajaxSettings), Ln(e, t), e
        },
        ajaxSettings: {
            url: cn,
            isLocal: dn.test(ln[1]),
            global: !0,
            type: "GET",
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            processData: !0,
            async: !0,
            accepts: {
                xml: "application/xml, text/xml",
                html: "text/html",
                text: "text/plain",
                json: "application/json, text/javascript",
                "*": Tn
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText"
            },
            converters: {
                "* text": e.String,
                "text html": !0,
                "text json": v.parseJSON,
                "text xml": v.parseXML
            },
            flatOptions: {
                context: !0,
                url: !0
            }
        },
        ajaxPrefilter: Cn(Sn),
        ajaxTransport: Cn(xn),
        ajax: function(e, n) {
            function T(e, n, s, a) {
                var l, y, b, w, S, T = n;
                if (E === 2) return;
                E = 2, u && clearTimeout(u), o = t, i = a || "", x.readyState = e > 0 ? 4 : 0, s && (w = An(c, x, s));
                if (e >= 200 && e < 300 || e === 304) c.ifModified && (S = x.getResponseHeader("Last-Modified"), S && (v.lastModified[r] = S), S = x.getResponseHeader("Etag"), S && (v.etag[r] = S)), e === 304 ? (T = "notmodified", l = !0) : (l = On(c, w), T = l.state, y = l.data, b = l.error, l = !b);
                else {
                    b = T;
                    if (!T || e) T = "error", e < 0 && (e = 0)
                }
                x.status = e, x.statusText = (n || T) + "", l ? d.resolveWith(h, [y, T, x]) : d.rejectWith(h, [x, T, b]), x.statusCode(g), g = t, f && p.trigger("ajax" + (l ? "Success" : "Error"), [x, c, l ? y : b]), m.fireWith(h, [x, T]), f && (p.trigger("ajaxComplete", [x, c]), --v.active || v.event.trigger("ajaxStop"))
            }
            typeof e == "object" && (n = e, e = t), n = n || {};
            var r, i, s, o, u, a, f, l, c = v.ajaxSetup({}, n),
                h = c.context || c,
                p = h !== c && (h.nodeType || h instanceof v) ? v(h) : v.event,
                d = v.Deferred(),
                m = v.Callbacks("once memory"),
                g = c.statusCode || {},
                b = {},
                w = {},
                E = 0,
                S = "canceled",
                x = {
                    readyState: 0,
                    setRequestHeader: function(e, t) {
                        if (!E) {
                            var n = e.toLowerCase();
                            e = w[n] = w[n] || e, b[e] = t
                        }
                        return this
                    },
                    getAllResponseHeaders: function() {
                        return E === 2 ? i : null
                    },
                    getResponseHeader: function(e) {
                        var n;
                        if (E === 2) {
                            if (!s) {
                                s = {};
                                while (n = pn.exec(i)) s[n[1].toLowerCase()] = n[2]
                            }
                            n = s[e.toLowerCase()]
                        }
                        return n === t ? null : n
                    },
                    overrideMimeType: function(e) {
                        return E || (c.mimeType = e), this
                    },
                    abort: function(e) {
                        return e = e || S, o && o.abort(e), T(0, e), this
                    }
                };
            d.promise(x), x.success = x.done, x.error = x.fail, x.complete = m.add, x.statusCode = function(e) {
                if (e) {
                    var t;
                    if (E < 2)
                        for (t in e) g[t] = [g[t], e[t]];
                    else t = e[x.status], x.always(t)
                }
                return this
            }, c.url = ((e || c.url) + "").replace(hn, "").replace(mn, ln[1] + "//"), c.dataTypes = v.trim(c.dataType || "*").toLowerCase().split(y), c.crossDomain == null && (a = wn.exec(c.url.toLowerCase()), c.crossDomain = !(!a || a[1] === ln[1] && a[2] === ln[2] && (a[3] || (a[1] === "http:" ? 80 : 443)) == (ln[3] || (ln[1] === "http:" ? 80 : 443)))), c.data && c.processData && typeof c.data != "string" && (c.data = v.param(c.data, c.traditional)), kn(Sn, c, n, x);
            if (E === 2) return x;
            f = c.global, c.type = c.type.toUpperCase(), c.hasContent = !vn.test(c.type), f && v.active++ === 0 && v.event.trigger("ajaxStart");
            if (!c.hasContent) {
                c.data && (c.url += (gn.test(c.url) ? "&" : "?") + c.data, delete c.data), r = c.url;
                if (c.cache === !1) {
                    var N = v.now(),
                        C = c.url.replace(bn, "$1_=" + N);
                    c.url = C + (C === c.url ? (gn.test(c.url) ? "&" : "?") + "_=" + N : "")
                }
            }(c.data && c.hasContent && c.contentType !== !1 || n.contentType) && x.setRequestHeader("Content-Type", c.contentType), c.ifModified && (r = r || c.url, v.lastModified[r] && x.setRequestHeader("If-Modified-Since", v.lastModified[r]), v.etag[r] && x.setRequestHeader("If-None-Match", v.etag[r])), x.setRequestHeader("Accept", c.dataTypes[0] && c.accepts[c.dataTypes[0]] ? c.accepts[c.dataTypes[0]] + (c.dataTypes[0] !== "*" ? ", " + Tn + "; q=0.01" : "") : c.accepts["*"]);
            for (l in c.headers) x.setRequestHeader(l, c.headers[l]);
            if (!c.beforeSend || c.beforeSend.call(h, x, c) !== !1 && E !== 2) {
                S = "abort";
                for (l in {
                        success: 1,
                        error: 1,
                        complete: 1
                    }) x[l](c[l]);
                o = kn(xn, c, n, x);
                if (!o) T(-1, "No Transport");
                else {
                    x.readyState = 1, f && p.trigger("ajaxSend", [x, c]), c.async && c.timeout > 0 && (u = setTimeout(function() {
                        x.abort("timeout")
                    }, c.timeout));
                    try {
                        E = 1, o.send(b, T)
                    } catch (k) {
                        if (!(E < 2)) throw k;
                        T(-1, k)
                    }
                }
                return x
            }
            return x.abort()
        },
        active: 0,
        lastModified: {},
        etag: {}
    });
    var Mn = [],
        _n = /\?/,
        Dn = /(=)\?(?=&|$)|\?\?/,
        Pn = v.now();
    v.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var e = Mn.pop() || v.expando + "_" + Pn++;
            return this[e] = !0, e
        }
    }), v.ajaxPrefilter("json jsonp", function(n, r, i) {
        var s, o, u, a = n.data,
            f = n.url,
            l = n.jsonp !== !1,
            c = l && Dn.test(f),
            h = l && !c && typeof a == "string" && !(n.contentType || "").indexOf("application/x-www-form-urlencoded") && Dn.test(a);
        if (n.dataTypes[0] === "jsonp" || c || h) return s = n.jsonpCallback = v.isFunction(n.jsonpCallback) ? n.jsonpCallback() : n.jsonpCallback, o = e[s], c ? n.url = f.replace(Dn, "$1" + s) : h ? n.data = a.replace(Dn, "$1" + s) : l && (n.url += (_n.test(f) ? "&" : "?") + n.jsonp + "=" + s), n.converters["script json"] = function() {
            return u || v.error(s + " was not called"), u[0]
        }, n.dataTypes[0] = "json", e[s] = function() {
            u = arguments
        }, i.always(function() {
            e[s] = o, n[s] && (n.jsonpCallback = r.jsonpCallback, Mn.push(s)), u && v.isFunction(o) && o(u[0]), u = o = t
        }), "script"
    }), v.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /javascript|ecmascript/
        },
        converters: {
            "text script": function(e) {
                return v.globalEval(e), e
            }
        }
    }), v.ajaxPrefilter("script", function(e) {
        e.cache === t && (e.cache = !1), e.crossDomain && (e.type = "GET", e.global = !1)
    }), v.ajaxTransport("script", function(e) {
        if (e.crossDomain) {
            var n, r = i.head || i.getElementsByTagName("head")[0] || i.documentElement;
            return {
                send: function(s, o) {
                    n = i.createElement("script"), n.async = "async", e.scriptCharset && (n.charset = e.scriptCharset), n.src = e.url, n.onload = n.onreadystatechange = function(e, i) {
                        if (i || !n.readyState || /loaded|complete/.test(n.readyState)) n.onload = n.onreadystatechange = null, r && n.parentNode && r.removeChild(n), n = t, i || o(200, "success")
                    }, r.insertBefore(n, r.firstChild)
                },
                abort: function() {
                    n && n.onload(0, 1)
                }
            }
        }
    });
    var Hn, Bn = e.ActiveXObject ? function() {
            for (var e in Hn) Hn[e](0, 1)
        } : !1,
        jn = 0;
    v.ajaxSettings.xhr = e.ActiveXObject ? function() {
            return !this.isLocal && Fn() || In()
        } : Fn,
        function(e) {
            v.extend(v.support, {
                ajax: !!e,
                cors: !!e && "withCredentials" in e
            })
        }(v.ajaxSettings.xhr()), v.support.ajax && v.ajaxTransport(function(n) {
            if (!n.crossDomain || v.support.cors) {
                var r;
                return {
                    send: function(i, s) {
                        var o, u, a = n.xhr();
                        n.username ? a.open(n.type, n.url, n.async, n.username, n.password) : a.open(n.type, n.url, n.async);
                        if (n.xhrFields)
                            for (u in n.xhrFields) a[u] = n.xhrFields[u];
                        n.mimeType && a.overrideMimeType && a.overrideMimeType(n.mimeType), !n.crossDomain && !i["X-Requested-With"] && (i["X-Requested-With"] = "XMLHttpRequest");
                        try {
                            for (u in i) a.setRequestHeader(u, i[u])
                        } catch (f) {}
                        a.send(n.hasContent && n.data || null), r = function(e, i) {
                            var u, f, l, c, h;
                            try {
                                if (r && (i || a.readyState === 4)) {
                                    r = t, o && (a.onreadystatechange = v.noop, Bn && delete Hn[o]);
                                    if (i) a.readyState !== 4 && a.abort();
                                    else {
                                        u = a.status, l = a.getAllResponseHeaders(), c = {}, h = a.responseXML, h && h.documentElement && (c.xml = h);
                                        try {
                                            c.text = a.responseText
                                        } catch (p) {}
                                        try {
                                            f = a.statusText
                                        } catch (p) {
                                            f = ""
                                        }!u && n.isLocal && !n.crossDomain ? u = c.text ? 200 : 404 : u === 1223 && (u = 204)
                                    }
                                }
                            } catch (d) {
                                i || s(-1, d)
                            }
                            c && s(u, f, c, l)
                        }, n.async ? a.readyState === 4 ? setTimeout(r, 0) : (o = ++jn, Bn && (Hn || (Hn = {}, v(e).unload(Bn)), Hn[o] = r), a.onreadystatechange = r) : r()
                    },
                    abort: function() {
                        r && r(0, 1)
                    }
                }
            }
        });
    var qn, Rn, Un = /^(?:toggle|show|hide)$/,
        zn = new RegExp("^(?:([-+])=|)(" + m + ")([a-z%]*)$", "i"),
        Wn = /queueHooks$/,
        Xn = [Gn],
        Vn = {
            "*": [function(e, t) {
                var n, r, i = this.createTween(e, t),
                    s = zn.exec(t),
                    o = i.cur(),
                    u = +o || 0,
                    a = 1,
                    f = 20;
                if (s) {
                    n = +s[2], r = s[3] || (v.cssNumber[e] ? "" : "px");
                    if (r !== "px" && u) {
                        u = v.css(i.elem, e, !0) || n || 1;
                        do a = a || ".5", u /= a, v.style(i.elem, e, u + r); while (a !== (a = i.cur() / o) && a !== 1 && --f)
                    }
                    i.unit = r, i.start = u, i.end = s[1] ? u + (s[1] + 1) * n : n
                }
                return i
            }]
        };
    v.Animation = v.extend(Kn, {
        tweener: function(e, t) {
            v.isFunction(e) ? (t = e, e = ["*"]) : e = e.split(" ");
            var n, r = 0,
                i = e.length;
            for (; r < i; r++) n = e[r], Vn[n] = Vn[n] || [], Vn[n].unshift(t)
        },
        prefilter: function(e, t) {
            t ? Xn.unshift(e) : Xn.push(e)
        }
    }), v.Tween = Yn, Yn.prototype = {
        constructor: Yn,
        init: function(e, t, n, r, i, s) {
            this.elem = e, this.prop = n, this.easing = i || "swing", this.options = t, this.start = this.now = this.cur(), this.end = r, this.unit = s || (v.cssNumber[n] ? "" : "px")
        },
        cur: function() {
            var e = Yn.propHooks[this.prop];
            return e && e.get ? e.get(this) : Yn.propHooks._default.get(this)
        },
        run: function(e) {
            var t, n = Yn.propHooks[this.prop];
            return this.options.duration ? this.pos = t = v.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : Yn.propHooks._default.set(this), this
        }
    }, Yn.prototype.init.prototype = Yn.prototype, Yn.propHooks = {
        _default: {
            get: function(e) {
                var t;
                return e.elem[e.prop] == null || !!e.elem.style && e.elem.style[e.prop] != null ? (t = v.css(e.elem, e.prop, !1, ""), !t || t === "auto" ? 0 : t) : e.elem[e.prop]
            },
            set: function(e) {
                v.fx.step[e.prop] ? v.fx.step[e.prop](e) : e.elem.style && (e.elem.style[v.cssProps[e.prop]] != null || v.cssHooks[e.prop]) ? v.style(e.elem, e.prop, e.now + e.unit) : e.elem[e.prop] = e.now
            }
        }
    }, Yn.propHooks.scrollTop = Yn.propHooks.scrollLeft = {
        set: function(e) {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
        }
    }, v.each(["toggle", "show", "hide"], function(e, t) {
        var n = v.fn[t];
        v.fn[t] = function(r, i, s) {
            return r == null || typeof r == "boolean" || !e && v.isFunction(r) && v.isFunction(i) ? n.apply(this, arguments) : this.animate(Zn(t, !0), r, i, s)
        }
    }), v.fn.extend({
        fadeTo: function(e, t, n, r) {
            return this.filter(Gt).css("opacity", 0).show().end().animate({
                opacity: t
            }, e, n, r)
        },
        animate: function(e, t, n, r) {
            var i = v.isEmptyObject(e),
                s = v.speed(t, n, r),
                o = function() {
                    var t = Kn(this, v.extend({}, e), s);
                    i && t.stop(!0)
                };
            return i || s.queue === !1 ? this.each(o) : this.queue(s.queue, o)
        },
        stop: function(e, n, r) {
            var i = function(e) {
                var t = e.stop;
                delete e.stop, t(r)
            };
            return typeof e != "string" && (r = n, n = e, e = t), n && e !== !1 && this.queue(e || "fx", []), this.each(function() {
                var t = !0,
                    n = e != null && e + "queueHooks",
                    s = v.timers,
                    o = v._data(this);
                if (n) o[n] && o[n].stop && i(o[n]);
                else
                    for (n in o) o[n] && o[n].stop && Wn.test(n) && i(o[n]);
                for (n = s.length; n--;) s[n].elem === this && (e == null || s[n].queue === e) && (s[n].anim.stop(r), t = !1, s.splice(n, 1));
                (t || !r) && v.dequeue(this, e)
            })
        }
    }), v.each({
        slideDown: Zn("show"),
        slideUp: Zn("hide"),
        slideToggle: Zn("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(e, t) {
        v.fn[e] = function(e, n, r) {
            return this.animate(t, e, n, r)
        }
    }), v.speed = function(e, t, n) {
        var r = e && typeof e == "object" ? v.extend({}, e) : {
            complete: n || !n && t || v.isFunction(e) && e,
            duration: e,
            easing: n && t || t && !v.isFunction(t) && t
        };
        r.duration = v.fx.off ? 0 : typeof r.duration == "number" ? r.duration : r.duration in v.fx.speeds ? v.fx.speeds[r.duration] : v.fx.speeds._default;
        if (r.queue == null || r.queue === !0) r.queue = "fx";
        return r.old = r.complete, r.complete = function() {
            v.isFunction(r.old) && r.old.call(this), r.queue && v.dequeue(this, r.queue)
        }, r
    }, v.easing = {
        linear: function(e) {
            return e
        },
        swing: function(e) {
            return .5 - Math.cos(e * Math.PI) / 2
        }
    }, v.timers = [], v.fx = Yn.prototype.init, v.fx.tick = function() {
        var e, n = v.timers,
            r = 0;
        qn = v.now();
        for (; r < n.length; r++) e = n[r], !e() && n[r] === e && n.splice(r--, 1);
        n.length || v.fx.stop(), qn = t
    }, v.fx.timer = function(e) {
        e() && v.timers.push(e) && !Rn && (Rn = setInterval(v.fx.tick, v.fx.interval))
    }, v.fx.interval = 13, v.fx.stop = function() {
        clearInterval(Rn), Rn = null
    }, v.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    }, v.fx.step = {}, v.expr && v.expr.filters && (v.expr.filters.animated = function(e) {
        return v.grep(v.timers, function(t) {
            return e === t.elem
        }).length
    });
    var er = /^(?:body|html)$/i;
    v.fn.offset = function(e) {
        if (arguments.length) return e === t ? this : this.each(function(t) {
            v.offset.setOffset(this, e, t)
        });
        var n, r, i, s, o, u, a, f = {
                top: 0,
                left: 0
            },
            l = this[0],
            c = l && l.ownerDocument;
        if (!c) return;
        return (r = c.body) === l ? v.offset.bodyOffset(l) : (n = c.documentElement, v.contains(n, l) ? (typeof l.getBoundingClientRect != "undefined" && (f = l.getBoundingClientRect()), i = tr(c), s = n.clientTop || r.clientTop || 0, o = n.clientLeft || r.clientLeft || 0, u = i.pageYOffset || n.scrollTop, a = i.pageXOffset || n.scrollLeft, {
            top: f.top + u - s,
            left: f.left + a - o
        }) : f)
    }, v.offset = {
        bodyOffset: function(e) {
            var t = e.offsetTop,
                n = e.offsetLeft;
            return v.support.doesNotIncludeMarginInBodyOffset && (t += parseFloat(v.css(e, "marginTop")) || 0, n += parseFloat(v.css(e, "marginLeft")) || 0), {
                top: t,
                left: n
            }
        },
        setOffset: function(e, t, n) {
            var r = v.css(e, "position");
            r === "static" && (e.style.position = "relative");
            var i = v(e),
                s = i.offset(),
                o = v.css(e, "top"),
                u = v.css(e, "left"),
                a = (r === "absolute" || r === "fixed") && v.inArray("auto", [o, u]) > -1,
                f = {},
                l = {},
                c, h;
            a ? (l = i.position(), c = l.top, h = l.left) : (c = parseFloat(o) || 0, h = parseFloat(u) || 0), v.isFunction(t) && (t = t.call(e, n, s)), t.top != null && (f.top = t.top - s.top + c), t.left != null && (f.left = t.left - s.left + h), "using" in t ? t.using.call(e, f) : i.css(f)
        }
    }, v.fn.extend({
        position: function() {
            if (!this[0]) return;
            var e = this[0],
                t = this.offsetParent(),
                n = this.offset(),
                r = er.test(t[0].nodeName) ? {
                    top: 0,
                    left: 0
                } : t.offset();
            return n.top -= parseFloat(v.css(e, "marginTop")) || 0, n.left -= parseFloat(v.css(e, "marginLeft")) || 0, r.top += parseFloat(v.css(t[0], "borderTopWidth")) || 0, r.left += parseFloat(v.css(t[0], "borderLeftWidth")) || 0, {
                top: n.top - r.top,
                left: n.left - r.left
            }
        },
        offsetParent: function() {
            return this.map(function() {
                var e = this.offsetParent || i.body;
                while (e && !er.test(e.nodeName) && v.css(e, "position") === "static") e = e.offsetParent;
                return e || i.body
            })
        }
    }), v.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(e, n) {
        var r = /Y/.test(n);
        v.fn[e] = function(i) {
            return v.access(this, function(e, i, s) {
                var o = tr(e);
                if (s === t) return o ? n in o ? o[n] : o.document.documentElement[i] : e[i];
                o ? o.scrollTo(r ? v(o).scrollLeft() : s, r ? s : v(o).scrollTop()) : e[i] = s
            }, e, i, arguments.length, null)
        }
    }), v.each({
        Height: "height",
        Width: "width"
    }, function(e, n) {
        v.each({
            padding: "inner" + e,
            content: n,
            "": "outer" + e
        }, function(r, i) {
            v.fn[i] = function(i, s) {
                var o = arguments.length && (r || typeof i != "boolean"),
                    u = r || (i === !0 || s === !0 ? "margin" : "border");
                return v.access(this, function(n, r, i) {
                    var s;
                    return v.isWindow(n) ? n.document.documentElement["client" + e] : n.nodeType === 9 ? (s = n.documentElement, Math.max(n.body["scroll" + e], s["scroll" + e], n.body["offset" + e], s["offset" + e], s["client" + e])) : i === t ? v.css(n, r, i, u) : v.style(n, r, i, u)
                }, n, o ? i : t, o, null)
            }
        })
    }), e.jQuery = e.$ = v, typeof define == "function" && define.amd && define.amd.jQuery && define("jquery", [], function() {
        return v
    })
})(window);
/*!
 * Paper.js v0.9.22 - The Swiss Army Knife of Vector Graphics Scripting.
 * http://paperjs.org/
 *
 * Copyright (c) 2011 - 2014, Juerg Lehni & Jonathan Puckey
 * http://scratchdisk.com/ & http://jonathanpuckey.com/
 *
 * Distributed under the MIT license. See LICENSE file for details.
 *
 * All rights reserved.
 *
 * Date: Sat Feb 28 19:20:48 2015 +0100
 *
 ***
 *
 * Straps.js - Class inheritance library with support for bean-style accessors
 *
 * Copyright (c) 2006 - 2013 Juerg Lehni
 * http://scratchdisk.com/
 *
 * Distributed under the MIT license.
 *
 ***
 *
 * Acorn.js
 * http://marijnhaverbeke.nl/acorn/
 *
 * Acorn is a tiny, fast JavaScript parser written in JavaScript,
 * created by Marijn Haverbeke and released under an MIT license.
 *
 */
var paper = new function(t) {
    var e = new function() {
        function n(t, n, i, r, a) {
            function o(s, o) {
                o = o || (o = u(n, s)) && (o.get ? o : o.value), "string" == typeof o && "#" === o[0] && (o = t[o.substring(1)] || o);
                var l, d = "function" == typeof o,
                    f = o,
                    _ = a || d ? o && o.get ? s in t : t[s] : null;
                a && _ || (d && _ && (o.base = _), d && r !== !1 && (l = s.match(/^([gs]et|is)(([A-Z])(.*))$/)) && (h[l[3].toLowerCase() + l[4]] = l[2]), f && !d && f.get && "function" == typeof f.get && e.isPlainObject(f) || (f = {
                    value: f,
                    writable: !0
                }), (u(t, s) || {
                    configurable: !0
                }).configurable && (f.configurable = !0, f.enumerable = i), c(t, s, f))
            }
            var h = {};
            if (n) {
                for (var l in n) n.hasOwnProperty(l) && !s.test(l) && o(l);
                for (var l in h) {
                    var d = h[l],
                        f = t["set" + d],
                        _ = t["get" + d] || f && t["is" + d];
                    !_ || r !== !0 && 0 !== _.length || o(l, {
                        get: _,
                        set: f
                    })
                }
            }
            return t
        }

        function i(t, e, n) {
            return t && ("length" in t && !t.getLength && "number" == typeof t.length ? a : o).call(t, e, n = n || t), n
        }

        function r(t, e, n) {
            for (var i in e) !e.hasOwnProperty(i) || n && n[i] || (t[i] = e[i]);
            return t
        }
        var s = /^(statics|enumerable|beans|preserve)$/,
            a = [].forEach || function(t, e) {
                for (var n = 0, i = this.length; i > n; n++) t.call(e, this[n], n, this)
            },
            o = function(t, e) {
                for (var n in this) this.hasOwnProperty(n) && t.call(e, this[n], n, this)
            },
            h = Object.create || function(t) {
                return {
                    __proto__: t
                }
            },
            u = Object.getOwnPropertyDescriptor || function(t, e) {
                var n = t.__lookupGetter__ && t.__lookupGetter__(e);
                return n ? {
                    get: n,
                    set: t.__lookupSetter__(e),
                    enumerable: !0,
                    configurable: !0
                } : t.hasOwnProperty(e) ? {
                    value: t[e],
                    enumerable: !0,
                    configurable: !0,
                    writable: !0
                } : null
            },
            l = Object.defineProperty || function(t, e, n) {
                return (n.get || n.set) && t.__defineGetter__ ? (n.get && t.__defineGetter__(e, n.get), n.set && t.__defineSetter__(e, n.set)) : t[e] = n.value, t
            },
            c = function(t, e, n) {
                return delete t[e], l(t, e, n)
            };
        return n(function() {
            for (var t = 0, e = arguments.length; e > t; t++) r(this, arguments[t])
        }, {
            inject: function(t) {
                if (t) {
                    var e = t.statics === !0 ? t : t.statics,
                        i = t.beans,
                        r = t.preserve;
                    e !== t && n(this.prototype, t, t.enumerable, i, r), n(this, e, !0, i, r)
                }
                for (var s = 1, a = arguments.length; a > s; s++) this.inject(arguments[s]);
                return this
            },
            extend: function() {
                for (var t, e = this, i = 0, r = arguments.length; r > i && !(t = arguments[i].initialize); i++);
                return t = t || function() {
                    e.apply(this, arguments)
                }, t.prototype = h(this.prototype), t.base = e, c(t.prototype, "constructor", {
                    value: t,
                    writable: !0,
                    configurable: !0
                }), n(t, this, !0), arguments.length ? this.inject.apply(t, arguments) : t
            }
        }, !0).inject({
            inject: function() {
                for (var t = 0, e = arguments.length; e > t; t++) {
                    var i = arguments[t];
                    i && n(this, i, i.enumerable, i.beans, i.preserve)
                }
                return this
            },
            extend: function() {
                var t = h(this);
                return t.inject.apply(t, arguments)
            },
            each: function(t, e) {
                return i(this, t, e)
            },
            set: function(t) {
                return r(this, t)
            },
            clone: function() {
                return new this.constructor(this)
            },
            statics: {
                each: i,
                create: h,
                define: c,
                describe: u,
                set: r,
                clone: function(t) {
                    return r(new t.constructor, t)
                },
                isPlainObject: function(t) {
                    var n = null != t && t.constructor;
                    return n && (n === Object || n === e || "Object" === n.name)
                },
                pick: function(e, n) {
                    return e !== t ? e : n
                }
            }
        })
    };
    "undefined" != typeof module && (module.exports = e), e.inject({
        toString: function() {
            return null != this._id ? (this._class || "Object") + (this._name ? " '" + this._name + "'" : " @" + this._id) : "{ " + e.each(this, function(t, e) {
                if (!/^_/.test(e)) {
                    var n = typeof t;
                    this.push(e + ": " + ("number" === n ? a.instance.number(t) : "string" === n ? "'" + t + "'" : t))
                }
            }, []).join(", ") + " }"
        },
        getClassName: function() {
            return this._class || ""
        },
        exportJSON: function(t) {
            return e.exportJSON(this, t)
        },
        toJSON: function() {
            return e.serialize(this)
        },
        _set: function(n, i, r) {
            if (n && (r || e.isPlainObject(n))) {
                var s = n._filtering || n;
                for (var a in s)
                    if (s.hasOwnProperty(a) && (!i || !i[a])) {
                        var o = n[a];
                        o !== t && (this[a] = o)
                    }
                return !0
            }
        },
        statics: {
            exports: {
                enumerable: !0
            },
            extend: function re() {
                var t = re.base.apply(this, arguments),
                    n = t.prototype._class;
                return n && !e.exports[n] && (e.exports[n] = t), t
            },
            equals: function(t, n) {
                function i(t, e) {
                    for (var n in t)
                        if (t.hasOwnProperty(n) && !e.hasOwnProperty(n)) return !1;
                    return !0
                }
                if (t === n) return !0;
                if (t && t.equals) return t.equals(n);
                if (n && n.equals) return n.equals(t);
                if (Array.isArray(t) && Array.isArray(n)) {
                    if (t.length !== n.length) return !1;
                    for (var r = 0, s = t.length; s > r; r++)
                        if (!e.equals(t[r], n[r])) return !1;
                    return !0
                }
                if (t && "object" == typeof t && n && "object" == typeof n) {
                    if (!i(t, n) || !i(n, t)) return !1;
                    for (var r in t)
                        if (t.hasOwnProperty(r) && !e.equals(t[r], n[r])) return !1;
                    return !0
                }
                return !1
            },
            read: function(n, i, r, s) {
                if (this === e) {
                    var a = this.peek(n, i);
                    return n.__index++, a
                }
                var o = this.prototype,
                    h = o._readIndex,
                    u = i || h && n.__index || 0;
                s || (s = n.length - u);
                var l = n[u];
                return l instanceof this || r && r.readNull && null == l && 1 >= s ? (h && (n.__index = u + 1), l && r && r.clone ? l.clone() : l) : (l = e.create(this.prototype), h && (l.__read = !0), l = l.initialize.apply(l, u > 0 || s < n.length ? Array.prototype.slice.call(n, u, u + s) : n) || l, h && (n.__index = u + l.__read, l.__read = t), l)
            },
            peek: function(t, e) {
                return t[t.__index = e || t.__index || 0]
            },
            remain: function(t) {
                return t.length - (t.__index || 0)
            },
            readAll: function(t, e, n) {
                for (var i, r = [], s = e || 0, a = t.length; a > s; s++) r.push(Array.isArray(i = t[s]) ? this.read(i, 0, n) : this.read(t, s, n, 1));
                return r
            },
            readNamed: function(n, i, r, s, a) {
                var o = this.getNamed(n, i),
                    h = o !== t;
                if (h) {
                    var u = n._filtered;
                    u || (u = n._filtered = e.create(n[0]), u._filtering = n[0]), u[i] = t
                }
                return this.read(h ? [o] : n, r, s, a)
            },
            getNamed: function(n, i) {
                var r = n[0];
                return n._hasObject === t && (n._hasObject = 1 === n.length && e.isPlainObject(r)), n._hasObject ? i ? r[i] : n._filtered || r : t
            },
            hasNamed: function(t, e) {
                return !!this.getNamed(t, e)
            },
            isPlainValue: function(t, e) {
                return this.isPlainObject(t) || Array.isArray(t) || e && "string" == typeof t
            },
            serialize: function(t, n, i, r) {
                n = n || {};
                var s, o = !r;
                if (o && (n.formatter = new a(n.precision), r = {
                        length: 0,
                        definitions: {},
                        references: {},
                        add: function(t, e) {
                            var n = "#" + t._id,
                                i = this.references[n];
                            if (!i) {
                                this.length++;
                                var r = e.call(t),
                                    s = t._class;
                                s && r[0] !== s && r.unshift(s), this.definitions[n] = r, i = this.references[n] = [n]
                            }
                            return i
                        }
                    }), t && t._serialize) {
                    s = t._serialize(n, r);
                    var h = t._class;
                    !h || i || s._compact || s[0] === h || s.unshift(h)
                } else if (Array.isArray(t)) {
                    s = [];
                    for (var u = 0, l = t.length; l > u; u++) s[u] = e.serialize(t[u], n, i, r);
                    i && (s._compact = !0)
                } else if (e.isPlainObject(t)) {
                    s = {};
                    for (var u in t) t.hasOwnProperty(u) && (s[u] = e.serialize(t[u], n, i, r))
                } else s = "number" == typeof t ? n.formatter.number(t, n.precision) : t;
                return o && r.length > 0 ? [
                    ["dictionary", r.definitions], s
                ] : s
            },
            deserialize: function(t, n, i) {
                var r = t,
                    s = !i;
                if (i = i || {}, Array.isArray(t)) {
                    var a = t[0],
                        o = "dictionary" === a;
                    if (!o) {
                        if (i.dictionary && 1 == t.length && /^#/.test(a)) return i.dictionary[a];
                        a = e.exports[a]
                    }
                    r = [];
                    for (var h = a ? 1 : 0, u = t.length; u > h; h++) r.push(e.deserialize(t[h], n, i));
                    if (o) i.dictionary = r[0];
                    else if (a) {
                        var l = r;
                        n ? r = n(a, l) : (r = e.create(a.prototype), a.apply(r, l))
                    }
                } else if (e.isPlainObject(t)) {
                    r = {};
                    for (var c in t) r[c] = e.deserialize(t[c], n, i)
                }
                return s && t && t.length && "dictionary" === t[0][0] ? r[1] : r
            },
            exportJSON: function(t, n) {
                var i = e.serialize(t, n);
                return n && n.asString === !1 ? i : JSON.stringify(i)
            },
            importJSON: function(t, n) {
                return e.deserialize("string" == typeof t ? JSON.parse(t) : t, function(t, i) {
                    var r = n && n.constructor === t ? n : e.create(t.prototype),
                        s = r === n;
                    if (1 === i.length && r instanceof w && (s || !(r instanceof b))) {
                        var a = i[0];
                        e.isPlainObject(a) && (a.insert = !1)
                    }
                    return t.apply(r, i), s && (n = null), r
                })
            },
            splice: function(e, n, i, r) {
                var s = n && n.length,
                    a = i === t;
                i = a ? e.length : i, i > e.length && (i = e.length);
                for (var o = 0; s > o; o++) n[o]._index = i + o;
                if (a) return e.push.apply(e, n), [];
                var h = [i, r];
                n && h.push.apply(h, n);
                for (var u = e.splice.apply(e, h), o = 0, l = u.length; l > o; o++) u[o]._index = t;
                for (var o = i + s, l = e.length; l > o; o++) e[o]._index = o;
                return u
            },
            capitalize: function(t) {
                return t.replace(/\b[a-z]/g, function(t) {
                    return t.toUpperCase()
                })
            },
            camelize: function(t) {
                return t.replace(/-(.)/g, function(t, e) {
                    return e.toUpperCase()
                })
            },
            hyphenate: function(t) {
                return t.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
            }
        }
    });
    var n = {
            on: function(t, n) {
                if ("string" != typeof t) e.each(t, function(t, e) {
                    this.on(e, t)
                }, this);
                else {
                    var i = this._eventTypes[t];
                    if (i) {
                        var r = this._callbacks = this._callbacks || {};
                        r = r[t] = r[t] || [], -1 === r.indexOf(n) && (r.push(n), i.install && 1 == r.length && i.install.call(this, t))
                    }
                }
                return this
            },
            off: function(n, i) {
                if ("string" != typeof n) return e.each(n, function(t, e) {
                    this.off(e, t)
                }, this), t;
                var r, s = this._eventTypes[n],
                    a = this._callbacks && this._callbacks[n];
                return s && a && (!i || -1 !== (r = a.indexOf(i)) && 1 === a.length ? (s.uninstall && s.uninstall.call(this, n), delete this._callbacks[n]) : -1 !== r && a.splice(r, 1)), this
            },
            once: function(t, e) {
                return this.on(t, function() {
                    e.apply(this, arguments), this.off(t, e)
                })
            },
            emit: function(t, e) {
                var n = this._callbacks && this._callbacks[t];
                if (!n) return !1;
                for (var i = [].slice.call(arguments, 1), r = 0, s = n.length; s > r; r++)
                    if (n[r].apply(this, i) === !1 && e && e.stop) {
                        e.stop();
                        break
                    }
                return !0
            },
            responds: function(t) {
                return !(!this._callbacks || !this._callbacks[t])
            },
            attach: "#on",
            detach: "#off",
            fire: "#emit",
            _installEvents: function(t) {
                var e = this._callbacks,
                    n = t ? "install" : "uninstall";
                for (var i in e)
                    if (e[i].length > 0) {
                        var r = this._eventTypes[i],
                            s = r[n];
                        s && s.call(this, i)
                    }
            },
            statics: {
                inject: function se(t) {
                    var n = t._events;
                    if (n) {
                        var i = {};
                        e.each(n, function(n, r) {
                            var s = "string" == typeof n,
                                a = s ? n : r,
                                o = e.capitalize(a),
                                h = a.substring(2).toLowerCase();
                            i[h] = s ? {} : n, a = "_" + a, t["get" + o] = function() {
                                return this[a]
                            }, t["set" + o] = function(t) {
                                var e = this[a];
                                e && this.off(h, e), t && this.on(h, t), this[a] = t
                            }
                        }), t._eventTypes = i
                    }
                    return se.base.apply(this, arguments)
                }
            }
        },
        r = e.extend({
            _class: "PaperScope",
            initialize: function ae() {
                paper = this, this.settings = new e({
                    applyMatrix: !0,
                    handleSize: 4,
                    hitTolerance: 0
                }), this.project = null, this.projects = [], this.tools = [], this.palettes = [], this._id = ae._id++, ae._scopes[this._id] = this;
                var t = ae.prototype;
                if (!this.support) {
                    var n = te.getContext(1, 1);
                    t.support = {
                        nativeDash: "setLineDash" in n || "mozDash" in n,
                        nativeBlendModes: ee.nativeModes
                    }, te.release(n)
                }
                if (!this.browser) {
                    var i = t.browser = {};
                    navigator.userAgent.toLowerCase().replace(/(opera|chrome|safari|webkit|firefox|msie|trident|atom)\/?\s*([.\d]+)(?:.*version\/([.\d]+))?(?:.*rv\:([.\d]+))?/g, function(t, e, n, r, s) {
                        if (!i.chrome) {
                            var a = "opera" === e ? r : n;
                            "trident" === e && (a = s, e = "msie"), i.version = a, i.versionNumber = parseFloat(a), i.name = e, i[e] = !0
                        }
                    }), i.chrome && delete i.webkit, i.atom && delete i.chrome
                }
            },
            version: "0.9.22",
            getView: function() {
                return this.project && this.project.getView()
            },
            getPaper: function() {
                return this
            },
            execute: function(t, e, n) {
                paper.PaperScript.execute(t, this, e, n), H.updateFocus()
            },
            install: function(t) {
                var n = this;
                e.each(["project", "view", "tool"], function(i) {
                    e.define(t, i, {
                        configurable: !0,
                        get: function() {
                            return n[i]
                        }
                    })
                });
                for (var i in this) !/^_/.test(i) && this[i] && (t[i] = this[i])
            },
            setup: function(t) {
                return paper = this, this.project = new v(t), this
            },
            activate: function() {
                paper = this
            },
            clear: function() {
                for (var t = this.projects.length - 1; t >= 0; t--) this.projects[t].remove();
                for (var t = this.tools.length - 1; t >= 0; t--) this.tools[t].remove();
                for (var t = this.palettes.length - 1; t >= 0; t--) this.palettes[t].remove()
            },
            remove: function() {
                this.clear(), delete r._scopes[this._id]
            },
            statics: new function() {
                function t(t) {
                    return t += "Attribute",
                        function(e, n) {
                            return e[t](n) || e[t]("data-paper-" + n)
                        }
                }
                return {
                    _scopes: {},
                    _id: 0,
                    get: function(t) {
                        return this._scopes[t] || null
                    },
                    getAttribute: t("get"),
                    hasAttribute: t("has")
                }
            }
        }),
        s = e.extend(n, {
            initialize: function(t) {
                this._scope = paper, this._index = this._scope[this._list].push(this) - 1, (t || !this._scope[this._reference]) && this.activate()
            },
            activate: function() {
                if (!this._scope) return !1;
                var t = this._scope[this._reference];
                return t && t !== this && t.emit("deactivate"), this._scope[this._reference] = this, this.emit("activate", t), !0
            },
            isActive: function() {
                return this._scope[this._reference] === this
            },
            remove: function() {
                return null == this._index ? !1 : (e.splice(this._scope[this._list], null, this._index, 1), this._scope[this._reference] == this && (this._scope[this._reference] = null), this._scope = null, !0)
            }
        }),
        a = e.extend({
            initialize: function(t) {
                this.precision = t || 5, this.multiplier = Math.pow(10, this.precision)
            },
            number: function(t) {
                return Math.round(t * this.multiplier) / this.multiplier
            },
            pair: function(t, e, n) {
                return this.number(t) + (n || ",") + this.number(e)
            },
            point: function(t, e) {
                return this.number(t.x) + (e || ",") + this.number(t.y)
            },
            size: function(t, e) {
                return this.number(t.width) + (e || ",") + this.number(t.height)
            },
            rectangle: function(t, e) {
                return this.point(t, e) + (e || ",") + this.size(t, e)
            }
        });
    a.instance = new a;
    var o = new function() {
            var t = [
                    [.5773502691896257],
                    [0, .7745966692414834],
                    [.33998104358485626, .8611363115940526],
                    [0, .5384693101056831, .906179845938664],
                    [.2386191860831969, .6612093864662645, .932469514203152],
                    [0, .4058451513773972, .7415311855993945, .9491079123427585],
                    [.1834346424956498, .525532409916329, .7966664774136267, .9602898564975363],
                    [0, .3242534234038089, .6133714327005904, .8360311073266358, .9681602395076261],
                    [.14887433898163122, .4333953941292472, .6794095682990244, .8650633666889845, .9739065285171717],
                    [0, .26954315595234496, .5190961292068118, .7301520055740494, .8870625997680953, .978228658146057],
                    [.1252334085114689, .3678314989981802, .5873179542866175, .7699026741943047, .9041172563704749, .9815606342467192],
                    [0, .2304583159551348, .44849275103644687, .6423493394403402, .8015780907333099, .9175983992229779, .9841830547185881],
                    [.10805494870734367, .31911236892788974, .5152486363581541, .6872929048116855, .827201315069765, .9284348836635735, .9862838086968123],
                    [0, .20119409399743451, .3941513470775634, .5709721726085388, .7244177313601701, .8482065834104272, .937273392400706, .9879925180204854],
                    [.09501250983763744, .2816035507792589, .45801677765722737, .6178762444026438, .755404408355003, .8656312023878318, .9445750230732326, .9894009349916499]
                ],
                e = [
                    [1],
                    [.8888888888888888, .5555555555555556],
                    [.6521451548625461, .34785484513745385],
                    [.5688888888888889, .47862867049936647, .23692688505618908],
                    [.46791393457269104, .3607615730481386, .17132449237917036],
                    [.4179591836734694, .3818300505051189, .27970539148927664, .1294849661688697],
                    [.362683783378362, .31370664587788727, .22238103445337448, .10122853629037626],
                    [.3302393550012598, .31234707704000286, .26061069640293544, .1806481606948574, .08127438836157441],
                    [.29552422471475287, .26926671930999635, .21908636251598204, .1494513491505806, .06667134430868814],
                    [.2729250867779006, .26280454451024665, .23319376459199048, .18629021092773426, .1255803694649046, .05566856711617366],
                    [.24914704581340277, .2334925365383548, .20316742672306592, .16007832854334622, .10693932599531843, .04717533638651183],
                    [.2325515532308739, .22628318026289723, .2078160475368885, .17814598076194574, .13887351021978725, .09212149983772845, .04048400476531588],
                    [.2152638534631578, .2051984637212956, .18553839747793782, .15720316715819355, .12151857068790319, .08015808715976021, .03511946033175186],
                    [.2025782419255613, .19843148532711158, .1861610000155622, .16626920581699392, .13957067792615432, .10715922046717194, .07036604748810812, .03075324199611727],
                    [.1894506104550685, .18260341504492358, .16915651939500254, .14959598881657674, .12462897125553388, .09515851168249279, .062253523938647894, .027152459411754096]
                ],
                n = Math.abs,
                i = Math.sqrt,
                r = Math.pow,
                s = 1e-6,
                a = 1e-12,
                h = 1.12e-16;
            return {
                TOLERANCE: s,
                EPSILON: a,
                MACHINE_EPSILON: h,
                KAPPA: 4 * (i(2) - 1) / 3,
                isZero: function(t) {
                    return n(t) <= a
                },
                integrate: function(n, i, r, s) {
                    for (var a = t[s - 2], o = e[s - 2], h = .5 * (r - i), u = h + i, l = 0, c = s + 1 >> 1, d = 1 & s ? o[l++] * n(u) : 0; c > l;) {
                        var f = h * a[l];
                        d += o[l++] * (n(u + f) + n(u - f))
                    }
                    return h * d
                },
                findRoot: function(t, e, i, r, s, a, o) {
                    for (var h = 0; a > h; h++) {
                        var u = t(i),
                            l = u / e(i),
                            c = i - l;
                        if (n(l) < o) return c;
                        u > 0 ? (s = i, i = r >= c ? .5 * (r + s) : c) : (r = i, i = c >= s ? .5 * (r + s) : c)
                    }
                    return i
                },
                solveQuadratic: function(t, e, r, s, a, o) {
                    var u, l, c = 0,
                        d = 1 / 0,
                        f = e;
                    if (e /= 2, l = e * e - t * r, n(l) < h) {
                        var _ = Math.pow,
                            g = _(n(t * e * r), 1 / 3);
                        if (1e-8 > g) {
                            var p = _(10, n(Math.floor(Math.log(g) * Math.LOG10E)));
                            isFinite(p) || (p = 0), t *= p, e *= p, r *= p, l = e * e - t * r
                        }
                    }
                    if (n(t) < h) {
                        if (n(f) < h) return n(r) < h ? -1 : 0;
                        u = -r / f
                    } else if (l >= -h) {
                        l = 0 > l ? 0 : l;
                        var v = i(l);
                        if (e >= h && h >= e) u = n(t) >= n(r) ? v / t : -r / v, d = -u;
                        else {
                            var m = -(e + (0 > e ? -1 : 1) * v);
                            u = m / t, d = r / m
                        }
                    }
                    return isFinite(u) && (null == a || u >= a && o >= u) && (s[c++] = u), d !== u && isFinite(d) && (null == a || d >= a && o >= d) && (s[c++] = d), c
                },
                solveCubic: function(t, e, s, a, u, l, c) {
                    var d, f, _, g = 0;
                    if (0 === t) t = e, f = s, _ = a, d = 1 / 0;
                    else if (0 === a) f = e, _ = s, d = 0;
                    else {
                        var p, v, m, y, w, x, b, C = 1 + h;
                        if (d = -(e / t) / 3, b = t * d, f = b + e, _ = f * d + s, m = (b + f) * d + _, v = _ * d + a, y = v / t, w = r(n(y), 1 / 3), x = 0 > y ? -1 : 1, y = -m / t, w = y > 0 ? 1.3247179572 * Math.max(w, i(y)) : w, p = d - x * w, p !== d) {
                            do
                                if (d = p, b = t * d, f = b + e, _ = f * d + s, m = (b + f) * d + _, v = _ * d + a, p = 0 === m ? d : d - v / m / C, p === d) {
                                    d = p;
                                    break
                                }
                            while (x * p > x * d);
                            n(t) * d * d > n(a / d) && (_ = -a / d, f = (_ - s) / d)
                        }
                    }
                    var g = o.solveQuadratic(t, f, _, u, l, c);
                    return isFinite(d) && (0 === g || d !== u[g - 1]) && (null == l || d >= l && c >= d) && (u[g++] = d), g
                }
            }
        },
        h = e.extend({
            _class: "Point",
            _readIndex: !0,
            initialize: function(t, e) {
                var n = typeof t;
                if ("number" === n) {
                    var i = "number" == typeof e;
                    this.x = t, this.y = i ? e : t, this.__read && (this.__read = i ? 2 : 1)
                } else "undefined" === n || null === t ? (this.x = this.y = 0, this.__read && (this.__read = null === t ? 1 : 0)) : (Array.isArray(t) ? (this.x = t[0], this.y = t.length > 1 ? t[1] : t[0]) : null != t.x ? (this.x = t.x, this.y = t.y) : null != t.width ? (this.x = t.width, this.y = t.height) : null != t.angle ? (this.x = t.length, this.y = 0, this.setAngle(t.angle)) : (this.x = this.y = 0, this.__read && (this.__read = 0)), this.__read && (this.__read = 1))
            },
            set: function(t, e) {
                return this.x = t, this.y = e, this
            },
            equals: function(t) {
                return this === t || t && (this.x === t.x && this.y === t.y || Array.isArray(t) && this.x === t[0] && this.y === t[1]) || !1
            },
            clone: function() {
                return new h(this.x, this.y)
            },
            toString: function() {
                var t = a.instance;
                return "{ x: " + t.number(this.x) + ", y: " + t.number(this.y) + " }"
            },
            _serialize: function(t) {
                var e = t.formatter;
                return [e.number(this.x), e.number(this.y)]
            },
            getLength: function() {
                return Math.sqrt(this.x * this.x + this.y * this.y)
            },
            setLength: function(t) {
                if (this.isZero()) {
                    var e = this._angle || 0;
                    this.set(Math.cos(e) * t, Math.sin(e) * t)
                } else {
                    var n = t / this.getLength();
                    o.isZero(n) && this.getAngle(), this.set(this.x * n, this.y * n)
                }
            },
            getAngle: function() {
                return 180 * this.getAngleInRadians.apply(this, arguments) / Math.PI
            },
            setAngle: function(t) {
                this.setAngleInRadians.call(this, t * Math.PI / 180)
            },
            getAngleInDegrees: "#getAngle",
            setAngleInDegrees: "#setAngle",
            getAngleInRadians: function() {
                if (arguments.length) {
                    var t = h.read(arguments),
                        e = this.getLength() * t.getLength();
                    if (o.isZero(e)) return 0 / 0;
                    var n = this.dot(t) / e;
                    return Math.acos(-1 > n ? -1 : n > 1 ? 1 : n)
                }
                return this.isZero() ? this._angle || 0 : this._angle = Math.atan2(this.y, this.x)
            },
            setAngleInRadians: function(t) {
                if (this._angle = t, !this.isZero()) {
                    var e = this.getLength();
                    this.set(Math.cos(t) * e, Math.sin(t) * e)
                }
            },
            getQuadrant: function() {
                return this.x >= 0 ? this.y >= 0 ? 1 : 4 : this.y >= 0 ? 2 : 3
            }
        }, {
            beans: !1,
            getDirectedAngle: function() {
                var t = h.read(arguments);
                return 180 * Math.atan2(this.cross(t), this.dot(t)) / Math.PI
            },
            getDistance: function() {
                var t = h.read(arguments),
                    n = t.x - this.x,
                    i = t.y - this.y,
                    r = n * n + i * i,
                    s = e.read(arguments);
                return s ? r : Math.sqrt(r)
            },
            normalize: function(e) {
                e === t && (e = 1);
                var n = this.getLength(),
                    i = 0 !== n ? e / n : 0,
                    r = new h(this.x * i, this.y * i);
                return i >= 0 && (r._angle = this._angle), r
            },
            rotate: function(t, e) {
                if (0 === t) return this.clone();
                t = t * Math.PI / 180;
                var n = e ? this.subtract(e) : this,
                    i = Math.sin(t),
                    r = Math.cos(t);
                return n = new h(n.x * r - n.y * i, n.x * i + n.y * r), e ? n.add(e) : n
            },
            transform: function(t) {
                return t ? t._transformPoint(this) : this
            },
            add: function() {
                var t = h.read(arguments);
                return new h(this.x + t.x, this.y + t.y)
            },
            subtract: function() {
                var t = h.read(arguments);
                return new h(this.x - t.x, this.y - t.y)
            },
            multiply: function() {
                var t = h.read(arguments);
                return new h(this.x * t.x, this.y * t.y)
            },
            divide: function() {
                var t = h.read(arguments);
                return new h(this.x / t.x, this.y / t.y)
            },
            modulo: function() {
                var t = h.read(arguments);
                return new h(this.x % t.x, this.y % t.y)
            },
            negate: function() {
                return new h(-this.x, -this.y)
            },
            isInside: function() {
                return f.read(arguments).contains(this)
            },
            isClose: function(t, e) {
                return this.getDistance(t) < e
            },
            isColinear: function(t) {
                return Math.abs(this.cross(t)) < 1e-12
            },
            isOrthogonal: function(t) {
                return Math.abs(this.dot(t)) < 1e-12
            },
            isZero: function() {
                return o.isZero(this.x) && o.isZero(this.y)
            },
            isNaN: function() {
                return isNaN(this.x) || isNaN(this.y)
            },
            dot: function() {
                var t = h.read(arguments);
                return this.x * t.x + this.y * t.y
            },
            cross: function() {
                var t = h.read(arguments);
                return this.x * t.y - this.y * t.x
            },
            project: function() {
                var t = h.read(arguments);
                if (t.isZero()) return new h(0, 0);
                var e = this.dot(t) / t.dot(t);
                return new h(t.x * e, t.y * e)
            },
            statics: {
                min: function() {
                    var t = h.read(arguments),
                        e = h.read(arguments);
                    return new h(Math.min(t.x, e.x), Math.min(t.y, e.y))
                },
                max: function() {
                    var t = h.read(arguments),
                        e = h.read(arguments);
                    return new h(Math.max(t.x, e.x), Math.max(t.y, e.y))
                },
                random: function() {
                    return new h(Math.random(), Math.random())
                }
            }
        }, e.each(["round", "ceil", "floor", "abs"], function(t) {
            var e = Math[t];
            this[t] = function() {
                return new h(e(this.x), e(this.y))
            }
        }, {})),
        u = h.extend({
            initialize: function(t, e, n, i) {
                this._x = t, this._y = e, this._owner = n, this._setter = i
            },
            set: function(t, e, n) {
                return this._x = t, this._y = e, n || this._owner[this._setter](this), this
            },
            getX: function() {
                return this._x
            },
            setX: function(t) {
                this._x = t, this._owner[this._setter](this)
            },
            getY: function() {
                return this._y
            },
            setY: function(t) {
                this._y = t, this._owner[this._setter](this)
            }
        }),
        c = e.extend({
            _class: "Size",
            _readIndex: !0,
            initialize: function(t, e) {
                var n = typeof t;
                if ("number" === n) {
                    var i = "number" == typeof e;
                    this.width = t, this.height = i ? e : t, this.__read && (this.__read = i ? 2 : 1)
                } else "undefined" === n || null === t ? (this.width = this.height = 0, this.__read && (this.__read = null === t ? 1 : 0)) : (Array.isArray(t) ? (this.width = t[0], this.height = t.length > 1 ? t[1] : t[0]) : null != t.width ? (this.width = t.width, this.height = t.height) : null != t.x ? (this.width = t.x, this.height = t.y) : (this.width = this.height = 0, this.__read && (this.__read = 0)), this.__read && (this.__read = 1))
            },
            set: function(t, e) {
                return this.width = t, this.height = e, this
            },
            equals: function(t) {
                return t === this || t && (this.width === t.width && this.height === t.height || Array.isArray(t) && this.width === t[0] && this.height === t[1]) || !1
            },
            clone: function() {
                return new c(this.width, this.height)
            },
            toString: function() {
                var t = a.instance;
                return "{ width: " + t.number(this.width) + ", height: " + t.number(this.height) + " }"
            },
            _serialize: function(t) {
                var e = t.formatter;
                return [e.number(this.width), e.number(this.height)]
            },
            add: function() {
                var t = c.read(arguments);
                return new c(this.width + t.width, this.height + t.height)
            },
            subtract: function() {
                var t = c.read(arguments);
                return new c(this.width - t.width, this.height - t.height)
            },
            multiply: function() {
                var t = c.read(arguments);
                return new c(this.width * t.width, this.height * t.height)
            },
            divide: function() {
                var t = c.read(arguments);
                return new c(this.width / t.width, this.height / t.height)
            },
            modulo: function() {
                var t = c.read(arguments);
                return new c(this.width % t.width, this.height % t.height)
            },
            negate: function() {
                return new c(-this.width, -this.height)
            },
            isZero: function() {
                return o.isZero(this.width) && o.isZero(this.height)
            },
            isNaN: function() {
                return isNaN(this.width) || isNaN(this.height)
            },
            statics: {
                min: function(t, e) {
                    return new c(Math.min(t.width, e.width), Math.min(t.height, e.height))
                },
                max: function(t, e) {
                    return new c(Math.max(t.width, e.width), Math.max(t.height, e.height))
                },
                random: function() {
                    return new c(Math.random(), Math.random())
                }
            }
        }, e.each(["round", "ceil", "floor", "abs"], function(t) {
            var e = Math[t];
            this[t] = function() {
                return new c(e(this.width), e(this.height))
            }
        }, {})),
        d = c.extend({
            initialize: function(t, e, n, i) {
                this._width = t, this._height = e, this._owner = n, this._setter = i
            },
            set: function(t, e, n) {
                return this._width = t, this._height = e, n || this._owner[this._setter](this), this
            },
            getWidth: function() {
                return this._width
            },
            setWidth: function(t) {
                this._width = t, this._owner[this._setter](this)
            },
            getHeight: function() {
                return this._height
            },
            setHeight: function(t) {
                this._height = t, this._owner[this._setter](this)
            }
        }),
        f = e.extend({
            _class: "Rectangle",
            _readIndex: !0,
            beans: !0,
            initialize: function(n, i, r, s) {
                var a = typeof n,
                    o = 0;
                if ("number" === a ? (this.x = n, this.y = i, this.width = r, this.height = s, o = 4) : "undefined" === a || null === n ? (this.x = this.y = this.width = this.height = 0, o = null === n ? 1 : 0) : 1 === arguments.length && (Array.isArray(n) ? (this.x = n[0], this.y = n[1], this.width = n[2], this.height = n[3], o = 1) : n.x !== t || n.width !== t ? (this.x = n.x || 0, this.y = n.y || 0, this.width = n.width || 0, this.height = n.height || 0, o = 1) : n.from === t && n.to === t && (this.x = this.y = this.width = this.height = 0, this._set(n), o = 1)), !o) {
                    var u = h.readNamed(arguments, "from"),
                        l = e.peek(arguments);
                    if (this.x = u.x, this.y = u.y, l && l.x !== t || e.hasNamed(arguments, "to")) {
                        var d = h.readNamed(arguments, "to");
                        this.width = d.x - u.x, this.height = d.y - u.y, this.width < 0 && (this.x = d.x, this.width = -this.width), this.height < 0 && (this.y = d.y, this.height = -this.height)
                    } else {
                        var f = c.read(arguments);
                        this.width = f.width, this.height = f.height
                    }
                    o = arguments.__index
                }
                this.__read && (this.__read = o)
            },
            set: function(t, e, n, i) {
                return this.x = t, this.y = e, this.width = n, this.height = i, this
            },
            clone: function() {
                return new f(this.x, this.y, this.width, this.height)
            },
            equals: function(t) {
                var n = e.isPlainValue(t) ? f.read(arguments) : t;
                return n === this || n && this.x === n.x && this.y === n.y && this.width === n.width && this.height === n.height || !1
            },
            toString: function() {
                var t = a.instance;
                return "{ x: " + t.number(this.x) + ", y: " + t.number(this.y) + ", width: " + t.number(this.width) + ", height: " + t.number(this.height) + " }"
            },
            _serialize: function(t) {
                var e = t.formatter;
                return [e.number(this.x), e.number(this.y), e.number(this.width), e.number(this.height)]
            },
            getPoint: function(t) {
                var e = t ? h : u;
                return new e(this.x, this.y, this, "setPoint")
            },
            setPoint: function() {
                var t = h.read(arguments);
                this.x = t.x, this.y = t.y
            },
            getSize: function(t) {
                var e = t ? c : d;
                return new e(this.width, this.height, this, "setSize")
            },
            setSize: function() {
                var t = c.read(arguments);
                this._fixX && (this.x += (this.width - t.width) * this._fixX), this._fixY && (this.y += (this.height - t.height) * this._fixY), this.width = t.width, this.height = t.height, this._fixW = 1, this._fixH = 1
            },
            getLeft: function() {
                return this.x
            },
            setLeft: function(t) {
                this._fixW || (this.width -= t - this.x), this.x = t, this._fixX = 0
            },
            getTop: function() {
                return this.y
            },
            setTop: function(t) {
                this._fixH || (this.height -= t - this.y), this.y = t, this._fixY = 0
            },
            getRight: function() {
                return this.x + this.width
            },
            setRight: function(e) {
                this._fixX !== t && 1 !== this._fixX && (this._fixW = 0), this._fixW ? this.x = e - this.width : this.width = e - this.x, this._fixX = 1
            },
            getBottom: function() {
                return this.y + this.height
            },
            setBottom: function(e) {
                this._fixY !== t && 1 !== this._fixY && (this._fixH = 0), this._fixH ? this.y = e - this.height : this.height = e - this.y, this._fixY = 1
            },
            getCenterX: function() {
                return this.x + .5 * this.width
            },
            setCenterX: function(t) {
                this.x = t - .5 * this.width, this._fixX = .5
            },
            getCenterY: function() {
                return this.y + .5 * this.height
            },
            setCenterY: function(t) {
                this.y = t - .5 * this.height, this._fixY = .5
            },
            getCenter: function(t) {
                var e = t ? h : u;
                return new e(this.getCenterX(), this.getCenterY(), this, "setCenter")
            },
            setCenter: function() {
                var t = h.read(arguments);
                return this.setCenterX(t.x), this.setCenterY(t.y), this
            },
            getArea: function() {
                return this.width * this.height
            },
            isEmpty: function() {
                return 0 === this.width || 0 === this.height
            },
            contains: function(e) {
                return e && e.width !== t || 4 == (Array.isArray(e) ? e : arguments).length ? this._containsRectangle(f.read(arguments)) : this._containsPoint(h.read(arguments))
            },
            _containsPoint: function(t) {
                var e = t.x,
                    n = t.y;
                return e >= this.x && n >= this.y && e <= this.x + this.width && n <= this.y + this.height
            },
            _containsRectangle: function(t) {
                var e = t.x,
                    n = t.y;
                return e >= this.x && n >= this.y && e + t.width <= this.x + this.width && n + t.height <= this.y + this.height
            },
            intersects: function() {
                var t = f.read(arguments);
                return t.x + t.width > this.x && t.y + t.height > this.y && t.x < this.x + this.width && t.y < this.y + this.height
            },
            touches: function() {
                var t = f.read(arguments);
                return t.x + t.width >= this.x && t.y + t.height >= this.y && t.x <= this.x + this.width && t.y <= this.y + this.height
            },
            intersect: function() {
                var t = f.read(arguments),
                    e = Math.max(this.x, t.x),
                    n = Math.max(this.y, t.y),
                    i = Math.min(this.x + this.width, t.x + t.width),
                    r = Math.min(this.y + this.height, t.y + t.height);
                return new f(e, n, i - e, r - n)
            },
            unite: function() {
                var t = f.read(arguments),
                    e = Math.min(this.x, t.x),
                    n = Math.min(this.y, t.y),
                    i = Math.max(this.x + this.width, t.x + t.width),
                    r = Math.max(this.y + this.height, t.y + t.height);
                return new f(e, n, i - e, r - n)
            },
            include: function() {
                var t = h.read(arguments),
                    e = Math.min(this.x, t.x),
                    n = Math.min(this.y, t.y),
                    i = Math.max(this.x + this.width, t.x),
                    r = Math.max(this.y + this.height, t.y);
                return new f(e, n, i - e, r - n)
            },
            expand: function() {
                var t = c.read(arguments),
                    e = t.width,
                    n = t.height;
                return new f(this.x - e / 2, this.y - n / 2, this.width + e, this.height + n)
            },
            scale: function(e, n) {
                return this.expand(this.width * e - this.width, this.height * (n === t ? e : n) - this.height)
            }
        }, e.each([
            ["Top", "Left"],
            ["Top", "Right"],
            ["Bottom", "Left"],
            ["Bottom", "Right"],
            ["Left", "Center"],
            ["Top", "Center"],
            ["Right", "Center"],
            ["Bottom", "Center"]
        ], function(t, e) {
            var n = t.join(""),
                i = /^[RL]/.test(n);
            e >= 4 && (t[1] += i ? "Y" : "X");
            var r = t[i ? 0 : 1],
                s = t[i ? 1 : 0],
                a = "get" + r,
                o = "get" + s,
                l = "set" + r,
                c = "set" + s,
                d = "get" + n,
                f = "set" + n;
            this[d] = function(t) {
                var e = t ? h : u;
                return new e(this[a](), this[o](), this, f)
            }, this[f] = function() {
                var t = h.read(arguments);
                this[l](t.x), this[c](t.y)
            }
        }, {
            beans: !0
        })),
        _ = f.extend({
            initialize: function(t, e, n, i, r, s) {
                this.set(t, e, n, i, !0), this._owner = r, this._setter = s
            },
            set: function(t, e, n, i, r) {
                return this._x = t, this._y = e, this._width = n, this._height = i, r || this._owner[this._setter](this), this
            }
        }, new function() {
            var t = f.prototype;
            return e.each(["x", "y", "width", "height"], function(t) {
                var n = e.capitalize(t),
                    i = "_" + t;
                this["get" + n] = function() {
                    return this[i]
                }, this["set" + n] = function(t) {
                    this[i] = t, this._dontNotify || this._owner[this._setter](this)
                }
            }, e.each(["Point", "Size", "Center", "Left", "Top", "Right", "Bottom", "CenterX", "CenterY", "TopLeft", "TopRight", "BottomLeft", "BottomRight", "LeftCenter", "TopCenter", "RightCenter", "BottomCenter"], function(e) {
                var n = "set" + e;
                this[n] = function() {
                    this._dontNotify = !0, t[n].apply(this, arguments), this._dontNotify = !1, this._owner[this._setter](this)
                }
            }, {
                isSelected: function() {
                    return this._owner._boundsSelected
                },
                setSelected: function(t) {
                    var e = this._owner;
                    e.setSelected && (e._boundsSelected = t, e.setSelected(t || e._selectedSegmentState > 0))
                }
            }))
        }),
        g = e.extend({
            _class: "Matrix",
            initialize: function oe(t) {
                var e = arguments.length,
                    n = !0;
                if (6 === e ? this.set.apply(this, arguments) : 1 === e ? t instanceof oe ? this.set(t._a, t._c, t._b, t._d, t._tx, t._ty) : Array.isArray(t) ? this.set.apply(this, t) : n = !1 : 0 === e ? this.reset() : n = !1, !n) throw Error("Unsupported matrix parameters")
            },
            set: function(t, e, n, i, r, s, a) {
                return this._a = t, this._c = e, this._b = n, this._d = i, this._tx = r, this._ty = s, a || this._changed(), this
            },
            _serialize: function(t) {
                return e.serialize(this.getValues(), t)
            },
            _changed: function() {
                var t = this._owner;
                t && (t._applyMatrix ? t.transform(null, !0) : t._changed(9))
            },
            clone: function() {
                return new g(this._a, this._c, this._b, this._d, this._tx, this._ty)
            },
            equals: function(t) {
                return t === this || t && this._a === t._a && this._b === t._b && this._c === t._c && this._d === t._d && this._tx === t._tx && this._ty === t._ty || !1
            },
            toString: function() {
                var t = a.instance;
                return "[[" + [t.number(this._a), t.number(this._b), t.number(this._tx)].join(", ") + "], [" + [t.number(this._c), t.number(this._d), t.number(this._ty)].join(", ") + "]]"
            },
            reset: function(t) {
                return this._a = this._d = 1, this._c = this._b = this._tx = this._ty = 0, t || this._changed(), this
            },
            apply: function(t, n) {
                var i = this._owner;
                return i ? (i.transform(null, !0, e.pick(t, !0), n), this.isIdentity()) : !1
            },
            translate: function() {
                var t = h.read(arguments),
                    e = t.x,
                    n = t.y;
                return this._tx += e * this._a + n * this._b, this._ty += e * this._c + n * this._d, this._changed(), this
            },
            scale: function() {
                var t = h.read(arguments),
                    e = h.read(arguments, 0, {
                        readNull: !0
                    });
                return e && this.translate(e), this._a *= t.x, this._c *= t.x, this._b *= t.y, this._d *= t.y, e && this.translate(e.negate()), this._changed(), this
            },
            rotate: function(t) {
                t *= Math.PI / 180;
                var e = h.read(arguments, 1),
                    n = e.x,
                    i = e.y,
                    r = Math.cos(t),
                    s = Math.sin(t),
                    a = n - n * r + i * s,
                    o = i - n * s - i * r,
                    u = this._a,
                    l = this._b,
                    c = this._c,
                    d = this._d;
                return this._a = r * u + s * l, this._b = -s * u + r * l, this._c = r * c + s * d, this._d = -s * c + r * d, this._tx += a * u + o * l, this._ty += a * c + o * d, this._changed(), this
            },
            shear: function() {
                var t = h.read(arguments),
                    e = h.read(arguments, 0, {
                        readNull: !0
                    });
                e && this.translate(e);
                var n = this._a,
                    i = this._c;
                return this._a += t.y * this._b, this._c += t.y * this._d, this._b += t.x * n, this._d += t.x * i, e && this.translate(e.negate()), this._changed(), this
            },
            skew: function() {
                var t = h.read(arguments),
                    e = h.read(arguments, 0, {
                        readNull: !0
                    }),
                    n = Math.PI / 180,
                    i = new h(Math.tan(t.x * n), Math.tan(t.y * n));
                return this.shear(i, e)
            },
            concatenate: function(t) {
                var e = this._a,
                    n = this._b,
                    i = this._c,
                    r = this._d,
                    s = t._a,
                    a = t._b,
                    o = t._c,
                    h = t._d,
                    u = t._tx,
                    l = t._ty;
                return this._a = s * e + o * n, this._b = a * e + h * n, this._c = s * i + o * r, this._d = a * i + h * r, this._tx += u * e + l * n, this._ty += u * i + l * r, this._changed(), this
            },
            preConcatenate: function(t) {
                var e = this._a,
                    n = this._b,
                    i = this._c,
                    r = this._d,
                    s = this._tx,
                    a = this._ty,
                    o = t._a,
                    h = t._b,
                    u = t._c,
                    l = t._d,
                    c = t._tx,
                    d = t._ty;
                return this._a = o * e + h * i, this._b = o * n + h * r, this._c = u * e + l * i, this._d = u * n + l * r, this._tx = o * s + h * a + c, this._ty = u * s + l * a + d, this._changed(), this
            },
            chain: function(t) {
                var e = this._a,
                    n = this._b,
                    i = this._c,
                    r = this._d,
                    s = this._tx,
                    a = this._ty,
                    o = t._a,
                    h = t._b,
                    u = t._c,
                    l = t._d,
                    c = t._tx,
                    d = t._ty;
                return new g(o * e + u * n, o * i + u * r, h * e + l * n, h * i + l * r, s + c * e + d * n, a + c * i + d * r)
            },
            isIdentity: function() {
                return 1 === this._a && 0 === this._c && 0 === this._b && 1 === this._d && 0 === this._tx && 0 === this._ty
            },
            orNullIfIdentity: function() {
                return this.isIdentity() ? null : this
            },
            isInvertible: function() {
                return !!this._getDeterminant()
            },
            isSingular: function() {
                return !this._getDeterminant()
            },
            transform: function(t, e, n) {
                return arguments.length < 3 ? this._transformPoint(h.read(arguments)) : this._transformCoordinates(t, e, n)
            },
            _transformPoint: function(t, e, n) {
                var i = t.x,
                    r = t.y;
                return e || (e = new h), e.set(i * this._a + r * this._b + this._tx, i * this._c + r * this._d + this._ty, n)
            },
            _transformCoordinates: function(t, e, n) {
                for (var i = 0, r = 0, s = 2 * n; s > i;) {
                    var a = t[i++],
                        o = t[i++];
                    e[r++] = a * this._a + o * this._b + this._tx, e[r++] = a * this._c + o * this._d + this._ty
                }
                return e
            },
            _transformCorners: function(t) {
                var e = t.x,
                    n = t.y,
                    i = e + t.width,
                    r = n + t.height,
                    s = [e, n, i, n, i, r, e, r];
                return this._transformCoordinates(s, s, 4)
            },
            _transformBounds: function(t, e, n) {
                for (var i = this._transformCorners(t), r = i.slice(0, 2), s = i.slice(), a = 2; 8 > a; a++) {
                    var o = i[a],
                        h = 1 & a;
                    o < r[h] ? r[h] = o : o > s[h] && (s[h] = o)
                }
                return e || (e = new f), e.set(r[0], r[1], s[0] - r[0], s[1] - r[1], n)
            },
            inverseTransform: function() {
                return this._inverseTransform(h.read(arguments))
            },
            _getDeterminant: function() {
                var t = this._a * this._d - this._b * this._c;
                return isFinite(t) && !o.isZero(t) && isFinite(this._tx) && isFinite(this._ty) ? t : null
            },
            _inverseTransform: function(t, e, n) {
                var i = this._getDeterminant();
                if (!i) return null;
                var r = t.x - this._tx,
                    s = t.y - this._ty;
                return e || (e = new h), e.set((r * this._d - s * this._b) / i, (s * this._a - r * this._c) / i, n)
            },
            decompose: function() {
                var t = this._a,
                    e = this._b,
                    n = this._c,
                    i = this._d;
                if (o.isZero(t * i - e * n)) return null;
                var r = Math.sqrt(t * t + e * e);
                t /= r, e /= r;
                var s = t * n + e * i;
                n -= t * s, i -= e * s;
                var a = Math.sqrt(n * n + i * i);
                return n /= a, i /= a, s /= a, e * n > t * i && (t = -t, e = -e, s = -s, r = -r), {
                    scaling: new h(r, a),
                    rotation: 180 * -Math.atan2(e, t) / Math.PI,
                    shearing: s
                }
            },
            getValues: function() {
                return [this._a, this._c, this._b, this._d, this._tx, this._ty]
            },
            getTranslation: function() {
                return new h(this._tx, this._ty)
            },
            getScaling: function() {
                return (this.decompose() || {}).scaling
            },
            getRotation: function() {
                return (this.decompose() || {}).rotation
            },
            inverted: function() {
                var t = this._getDeterminant();
                return t && new g(this._d / t, -this._c / t, -this._b / t, this._a / t, (this._b * this._ty - this._d * this._tx) / t, (this._c * this._tx - this._a * this._ty) / t)
            },
            shiftless: function() {
                return new g(this._a, this._c, this._b, this._d, 0, 0)
            },
            applyToContext: function(t) {
                t.transform(this._a, this._c, this._b, this._d, this._tx, this._ty)
            }
        }, e.each(["a", "c", "b", "d", "tx", "ty"], function(t) {
            var n = e.capitalize(t),
                i = "_" + t;
            this["get" + n] = function() {
                return this[i]
            }, this["set" + n] = function(t) {
                this[i] = t, this._changed()
            }
        }, {})),
        p = e.extend({
            _class: "Line",
            initialize: function(t, e, n, i, r) {
                var s = !1;
                arguments.length >= 4 ? (this._px = t, this._py = e, this._vx = n, this._vy = i, s = r) : (this._px = t.x, this._py = t.y, this._vx = e.x, this._vy = e.y, s = n), s || (this._vx -= this._px, this._vy -= this._py)
            },
            getPoint: function() {
                return new h(this._px, this._py)
            },
            getVector: function() {
                return new h(this._vx, this._vy)
            },
            getLength: function() {
                return this.getVector().getLength()
            },
            intersect: function(t, e) {
                return p.intersect(this._px, this._py, this._vx, this._vy, t._px, t._py, t._vx, t._vy, !0, e)
            },
            getSide: function(t) {
                return p.getSide(this._px, this._py, this._vx, this._vy, t.x, t.y, !0)
            },
            getDistance: function(t) {
                return Math.abs(p.getSignedDistance(this._px, this._py, this._vx, this._vy, t.x, t.y, !0))
            },
            statics: {
                intersect: function(t, e, n, i, r, s, a, u, l, c) {
                    l || (n -= t, i -= e, a -= r, u -= s);
                    var d = n * u - i * a;
                    if (!o.isZero(d)) {
                        var f = t - r,
                            _ = e - s,
                            g = (a * _ - u * f) / d,
                            p = (n * _ - i * f) / d;
                        if (c || g >= 0 && 1 >= g && p >= 0 && 1 >= p) return new h(t + g * n, e + g * i)
                    }
                },
                getSide: function(t, e, n, i, r, s, a) {
                    a || (n -= t, i -= e);
                    var o = r - t,
                        h = s - e,
                        u = o * i - h * n;
                    return 0 === u && (u = o * n + h * i, u > 0 && (o -= n, h -= i, u = o * n + h * i, 0 > u && (u = 0))), 0 > u ? -1 : u > 0 ? 1 : 0
                },
                getSignedDistance: function(t, e, n, i, r, s, a) {
                    return a || (n -= t, i -= e), o.isZero(n) ? i >= 0 ? t - r : r - t : o.isZero(i) ? n >= 0 ? s - e : e - s : (n * (s - e) - i * (r - t)) / Math.sqrt(n * n + i * i)
                }
            }
        }),
        v = s.extend({
            _class: "Project",
            _list: "projects",
            _reference: "project",
            initialize: function(t) {
                s.call(this, !0), this.layers = [], this._activeLayer = null, this.symbols = [], this._currentStyle = new V(null, null, this), this._view = H.create(this, t || te.getCanvas(1, 1)), this._selectedItems = {}, this._selectedItemCount = 0, this._updateVersion = 0
            },
            _serialize: function(t, n) {
                return e.serialize(this.layers, t, !0, n)
            },
            clear: function() {
                for (var t = this.layers.length - 1; t >= 0; t--) this.layers[t].remove();
                this.symbols = []
            },
            isEmpty: function() {
                return 0 === this.layers.length
            },
            remove: function he() {
                return he.base.call(this) ? (this._view && this._view.remove(), !0) : !1
            },
            getView: function() {
                return this._view
            },
            getCurrentStyle: function() {
                return this._currentStyle
            },
            setCurrentStyle: function(t) {
                this._currentStyle.initialize(t)
            },
            getIndex: function() {
                return this._index
            },
            getOptions: function() {
                return this._scope.settings
            },
            getActiveLayer: function() {
                return this._activeLayer || new b({
                    project: this
                })
            },
            getSelectedItems: function() {
                var t = [];
                for (var e in this._selectedItems) {
                    var n = this._selectedItems[e];
                    n.isInserted() && t.push(n)
                }
                return t
            },
            insertChild: function(t, n, i) {
                return n instanceof b ? (n._remove(!1, !0), e.splice(this.layers, [n], t, 0), n._setProject(this, !0), this._changes && n._changed(5), this._activeLayer || (this._activeLayer = n)) : n instanceof w ? (this._activeLayer || this.insertChild(t, new b(w.NO_INSERT))).insertChild(t, n, i) : n = null, n
            },
            addChild: function(e, n) {
                return this.insertChild(t, e, n)
            },
            _updateSelection: function(t) {
                var e = t._id,
                    n = this._selectedItems;
                t._selected ? n[e] !== t && (this._selectedItemCount++, n[e] = t) : n[e] === t && (this._selectedItemCount--, delete n[e])
            },
            selectAll: function() {
                for (var t = this.layers, e = 0, n = t.length; n > e; e++) t[e].setFullySelected(!0)
            },
            deselectAll: function() {
                var t = this._selectedItems;
                for (var e in t) t[e].setFullySelected(!1)
            },
            hitTest: function() {
                for (var t = h.read(arguments), n = M.getOptions(e.read(arguments)), i = this.layers.length - 1; i >= 0; i--) {
                    var r = this.layers[i]._hitTest(t, n);
                    if (r) return r
                }
                return null
            },
            getItems: function(t) {
                return w._getItems(this.layers, t)
            },
            getItem: function(t) {
                return w._getItems(this.layers, t, null, null, !0)[0] || null
            },
            importJSON: function(t) {
                this.activate();
                var n = this._activeLayer;
                return e.importJSON(t, n && n.isEmpty() && n)
            },
            draw: function(t, n, i) {
                this._updateVersion++, t.save(), n.applyToContext(t);
                for (var r = new e({
                        offset: new h(0, 0),
                        pixelRatio: i,
                        viewMatrix: n.isIdentity() ? null : n,
                        matrices: [new g],
                        updateMatrix: !0
                    }), s = 0, a = this.layers, o = a.length; o > s; s++) a[s].draw(t, r);
                if (t.restore(), this._selectedItemCount > 0) {
                    t.save(), t.strokeWidth = 1;
                    var u = this._selectedItems,
                        l = this._scope.settings.handleSize,
                        c = this._updateVersion;
                    for (var d in u) u[d]._drawSelection(t, n, l, u, c);
                    t.restore()
                }
            }
        }),
        y = e.extend({
            _class: "Symbol",
            initialize: function ue(t, e) {
                this._id = ue._id = (ue._id || 0) + 1, this.project = paper.project, this.project.symbols.push(this), t && this.setDefinition(t, e)
            },
            _serialize: function(t, n) {
                return n.add(this, function() {
                    return e.serialize([this._class, this._definition], t, !1, n)
                })
            },
            _changed: function(t) {
                8 & t && w._clearBoundsCache(this), 1 & t && (this.project._needsUpdate = !0)
            },
            getDefinition: function() {
                return this._definition
            },
            setDefinition: function(t, e) {
                t._parentSymbol && (t = t.clone()), this._definition && (this._definition._parentSymbol = null), this._definition = t, t.remove(), t.setSelected(!1), e || t.setPosition(new h), t._parentSymbol = this, this._changed(9)
            },
            place: function(t) {
                return new P(this, t)
            },
            clone: function() {
                return new y(this._definition.clone(!1))
            },
            equals: function(t) {
                return t === this || t && this.definition.equals(t.definition) || !1
            }
        }),
        w = e.extend(n, {
            statics: {
                extend: function le(t) {
                    return t._serializeFields && (t._serializeFields = new e(this.prototype._serializeFields, t._serializeFields)), le.base.apply(this, arguments)
                },
                NO_INSERT: {
                    insert: !1
                }
            },
            _class: "Item",
            _applyMatrix: !0,
            _canApplyMatrix: !0,
            _boundsSelected: !1,
            _selectChildren: !1,
            _serializeFields: {
                name: null,
                applyMatrix: null,
                matrix: new g,
                pivot: null,
                locked: !1,
                visible: !0,
                blendMode: "normal",
                opacity: 1,
                guide: !1,
                selected: !1,
                clipMask: !1,
                data: {}
            },
            initialize: function() {},
            _initialize: function(t, n) {
                var i = t && e.isPlainObject(t),
                    r = i && t.internal === !0,
                    s = this._matrix = new g,
                    a = i && t.project || paper.project;
                return r || (this._id = w._id = (w._id || 0) + 1), this._applyMatrix = this._canApplyMatrix && paper.settings.applyMatrix, n && s.translate(n), s._owner = this, this._style = new V(a._currentStyle, this, a), this._project || (r || i && t.insert === !1 ? this._setProject(a) : i && t.parent ? this.setParent(t.parent) : (a._activeLayer || new b).addChild(this)), i && t !== w.NO_INSERT && this._set(t, {
                    insert: !0,
                    parent: !0
                }, !0), i
            },
            _events: new function() {
                var t = {
                        mousedown: {
                            mousedown: 1,
                            mousedrag: 1,
                            click: 1,
                            doubleclick: 1
                        },
                        mouseup: {
                            mouseup: 1,
                            mousedrag: 1,
                            click: 1,
                            doubleclick: 1
                        },
                        mousemove: {
                            mousedrag: 1,
                            mousemove: 1,
                            mouseenter: 1,
                            mouseleave: 1
                        }
                    },
                    n = {
                        install: function(e) {
                            var n = this.getView()._eventCounters;
                            if (n)
                                for (var i in t) n[i] = (n[i] || 0) + (t[i][e] || 0)
                        },
                        uninstall: function(e) {
                            var n = this.getView()._eventCounters;
                            if (n)
                                for (var i in t) n[i] -= t[i][e] || 0
                        }
                    };
                return e.each(["onMouseDown", "onMouseUp", "onMouseDrag", "onClick", "onDoubleClick", "onMouseMove", "onMouseEnter", "onMouseLeave"], function(t) {
                    this[t] = n
                }, {
                    onFrame: {
                        install: function() {
                            this._animateItem(!0)
                        },
                        uninstall: function() {
                            this._animateItem(!1)
                        }
                    },
                    onLoad: {}
                })
            },
            _animateItem: function(t) {
                this.getView()._animateItem(this, t)
            },
            _serialize: function(t, n) {
                function i(i) {
                    for (var a in i) {
                        var o = s[a];
                        e.equals(o, "leading" === a ? 1.2 * i.fontSize : i[a]) || (r[a] = e.serialize(o, t, "data" !== a, n))
                    }
                }
                var r = {},
                    s = this;
                return i(this._serializeFields), this instanceof x || i(this._style._defaults), [this._class, r]
            },
            _changed: function(e) {
                var n = this._parentSymbol,
                    i = this._parent || n,
                    r = this._project;
                if (8 & e && (this._bounds = this._position = this._decomposed = this._globalMatrix = this._currentPath = t), i && 40 & e && w._clearBoundsCache(i), 2 & e && w._clearBoundsCache(this), r && (1 & e && (r._needsUpdate = !0), r._changes)) {
                    var s = r._changesById[this._id];
                    s ? s.flags |= e : (s = {
                        item: this,
                        flags: e
                    }, r._changesById[this._id] = s, r._changes.push(s))
                }
                n && n._changed(e)
            },
            set: function(t) {
                return t && this._set(t), this
            },
            getId: function() {
                return this._id
            },
            getName: function() {
                return this._name
            },
            setName: function(e, n) {
                if (this._name && this._removeNamed(), e === +e + "") throw Error("Names consisting only of numbers are not supported.");
                var i = this._parent;
                if (e && i) {
                    for (var r = i._children, s = i._namedChildren, a = e, o = 1; n && r[e];) e = a + " " + o++;
                    (s[e] = s[e] || []).push(this), r[e] = this
                }
                this._name = e || t, this._changed(128)
            },
            getStyle: function() {
                return this._style
            },
            setStyle: function(t) {
                this.getStyle().set(t)
            }
        }, e.each(["locked", "visible", "blendMode", "opacity", "guide"], function(t) {
            var n = e.capitalize(t),
                t = "_" + t;
            this["get" + n] = function() {
                return this[t]
            }, this["set" + n] = function(e) {
                e != this[t] && (this[t] = e, this._changed("_locked" === t ? 128 : 129))
            }
        }, {}), {
            beans: !0,
            _locked: !1,
            _visible: !0,
            _blendMode: "normal",
            _opacity: 1,
            _guide: !1,
            isSelected: function() {
                if (this._selectChildren)
                    for (var t = this._children, e = 0, n = t.length; n > e; e++)
                        if (t[e].isSelected()) return !0;
                return this._selected
            },
            setSelected: function(t, e) {
                if (!e && this._selectChildren)
                    for (var n = this._children, i = 0, r = n.length; r > i; i++) n[i].setSelected(t);
                (t = !!t) ^ this._selected && (this._selected = t, this._project._updateSelection(this), this._changed(129))
            },
            _selected: !1,
            isFullySelected: function() {
                var t = this._children;
                if (t && this._selected) {
                    for (var e = 0, n = t.length; n > e; e++)
                        if (!t[e].isFullySelected()) return !1;
                    return !0
                }
                return this._selected
            },
            setFullySelected: function(t) {
                var e = this._children;
                if (e)
                    for (var n = 0, i = e.length; i > n; n++) e[n].setFullySelected(t);
                this.setSelected(t, !0)
            },
            isClipMask: function() {
                return this._clipMask
            },
            setClipMask: function(t) {
                this._clipMask != (t = !!t) && (this._clipMask = t, t && (this.setFillColor(null), this.setStrokeColor(null)), this._changed(129), this._parent && this._parent._changed(1024))
            },
            _clipMask: !1,
            getData: function() {
                return this._data || (this._data = {}), this._data
            },
            setData: function(t) {
                this._data = t
            },
            getPosition: function(t) {
                var e = this._position,
                    n = t ? h : u;
                if (!e) {
                    var i = this._pivot;
                    e = this._position = i ? this._matrix._transformPoint(i) : this.getBounds().getCenter(!0)
                }
                return new n(e.x, e.y, this, "setPosition")
            },
            setPosition: function() {
                this.translate(h.read(arguments).subtract(this.getPosition(!0)))
            },
            getPivot: function(t) {
                var e = this._pivot;
                if (e) {
                    var n = t ? h : u;
                    e = new n(e.x, e.y, this, "setPivot")
                }
                return e
            },
            setPivot: function() {
                this._pivot = h.read(arguments), this._position = t
            },
            _pivot: null,
            getRegistration: "#getPivot",
            setRegistration: "#setPivot"
        }, e.each(["bounds", "strokeBounds", "handleBounds", "roughBounds", "internalBounds", "internalRoughBounds"], function(t) {
            var n = "get" + e.capitalize(t),
                i = t.match(/^internal(.*)$/),
                r = i ? "get" + i[1] : null;
            this[n] = function(e) {
                var i = this._boundsGetter,
                    s = !r && ("string" == typeof i ? i : i && i[n]) || n,
                    a = this._getCachedBounds(s, e, this, r);
                return "bounds" === t ? new _(a.x, a.y, a.width, a.height, this, "setBounds") : a
            }
        }, {
            beans: !0,
            _getBounds: function(t, e, n) {
                var i = this._children;
                if (!i || 0 == i.length) return new f;
                for (var r = 1 / 0, s = -r, a = r, o = s, h = 0, u = i.length; u > h; h++) {
                    var l = i[h];
                    if (l._visible && !l.isEmpty()) {
                        var c = l._getCachedBounds(t, e && e.chain(l._matrix), n);
                        r = Math.min(c.x, r), a = Math.min(c.y, a), s = Math.max(c.x + c.width, s), o = Math.max(c.y + c.height, o)
                    }
                }
                return isFinite(r) ? new f(r, a, s - r, o - a) : new f
            },
            setBounds: function() {
                var t = f.read(arguments),
                    e = this.getBounds(),
                    n = new g,
                    i = t.getCenter();
                n.translate(i), (t.width != e.width || t.height != e.height) && n.scale(0 != e.width ? t.width / e.width : 1, 0 != e.height ? t.height / e.height : 1), i = e.getCenter(), n.translate(-i.x, -i.y), this.transform(n)
            },
            _getCachedBounds: function(t, e, n, i) {
                e = e && e.orNullIfIdentity();
                var r = i ? null : this._matrix.orNullIfIdentity(),
                    s = (!e || e.equals(r)) && t,
                    a = this._parent || this._parentSymbol;
                if (a) {
                    var o = n._id,
                        h = a._boundsCache = a._boundsCache || {
                            ids: {},
                            list: []
                        };
                    h.ids[o] || (h.list.push(n), h.ids[o] = n)
                }
                if (s && this._bounds && this._bounds[s]) return this._bounds[s].clone();
                var u = this._getBounds(i || t, e || r, n);
                if (s) {
                    this._bounds || (this._bounds = {});
                    var l = this._bounds[s] = u.clone();
                    l._internal = !!i
                }
                return u
            },
            statics: {
                _clearBoundsCache: function(e) {
                    var n = e._boundsCache;
                    if (n) {
                        e._bounds = e._position = e._boundsCache = t;
                        for (var i = 0, r = n.list, s = r.length; s > i; i++) {
                            var a = r[i];
                            a !== e && (a._bounds = a._position = t, a._boundsCache && w._clearBoundsCache(a))
                        }
                    }
                }
            }
        }), {
            beans: !0,
            _decompose: function() {
                return this._decomposed = this._matrix.decompose()
            },
            getRotation: function() {
                var t = this._decomposed || this._decompose();
                return t && t.rotation
            },
            setRotation: function(t) {
                var e = this.getRotation();
                if (null != e && null != t) {
                    var n = this._decomposed;
                    this.rotate(t - e), n.rotation = t, this._decomposed = n
                }
            },
            getScaling: function(t) {
                var e = this._decomposed || this._decompose(),
                    n = e && e.scaling,
                    i = t ? h : u;
                return n && new i(n.x, n.y, this, "setScaling")
            },
            setScaling: function() {
                var t = this.getScaling();
                if (t) {
                    var e = h.read(arguments, 0, {
                            clone: !0
                        }),
                        n = this._decomposed;
                    this.scale(e.x / t.x, e.y / t.y), n.scaling = e, this._decomposed = n
                }
            },
            getMatrix: function() {
                return this._matrix
            },
            setMatrix: function(t) {
                this._matrix.initialize(t), this._applyMatrix ? this.transform(null, !0) : this._changed(9)
            },
            getGlobalMatrix: function(t) {
                var e = this._globalMatrix,
                    n = this._project._updateVersion;
                if (e && e._updateVersion !== n && (e = null), !e) {
                    e = this._globalMatrix = this._matrix.clone();
                    var i = this._parent;
                    i && e.preConcatenate(i.getGlobalMatrix(!0)), e._updateVersion = n
                }
                return t ? e : e.clone()
            },
            getApplyMatrix: function() {
                return this._applyMatrix
            },
            setApplyMatrix: function(t) {
                (this._applyMatrix = this._canApplyMatrix && !!t) && this.transform(null, !0)
            },
            getTransformContent: "#getApplyMatrix",
            setTransformContent: "#setApplyMatrix"
        }, {
            getProject: function() {
                return this._project
            },
            _setProject: function(t, e) {
                if (this._project !== t) {
                    this._project && this._installEvents(!1), this._project = t;
                    for (var n = this._children, i = 0, r = n && n.length; r > i; i++) n[i]._setProject(t);
                    e = !0
                }
                e && this._installEvents(!0)
            },
            getView: function() {
                return this._project.getView()
            },
            _installEvents: function ce(t) {
                ce.base.call(this, t);
                for (var e = this._children, n = 0, i = e && e.length; i > n; n++) e[n]._installEvents(t)
            },
            getLayer: function() {
                for (var t = this; t = t._parent;)
                    if (t instanceof b) return t;
                return null
            },
            getParent: function() {
                return this._parent
            },
            setParent: function(t) {
                return t.addChild(this)
            },
            getChildren: function() {
                return this._children
            },
            setChildren: function(t) {
                this.removeChildren(), this.addChildren(t)
            },
            getFirstChild: function() {
                return this._children && this._children[0] || null
            },
            getLastChild: function() {
                return this._children && this._children[this._children.length - 1] || null
            },
            getNextSibling: function() {
                return this._parent && this._parent._children[this._index + 1] || null
            },
            getPreviousSibling: function() {
                return this._parent && this._parent._children[this._index - 1] || null
            },
            getIndex: function() {
                return this._index
            },
            equals: function(t) {
                return t === this || t && this._class === t._class && this._style.equals(t._style) && this._matrix.equals(t._matrix) && this._locked === t._locked && this._visible === t._visible && this._blendMode === t._blendMode && this._opacity === t._opacity && this._clipMask === t._clipMask && this._guide === t._guide && this._equals(t) || !1
            },
            _equals: function(t) {
                return e.equals(this._children, t._children)
            },
            clone: function(t) {
                return this._clone(new this.constructor(w.NO_INSERT), t)
            },
            _clone: function(n, i) {
                if (n.setStyle(this._style), this._children)
                    for (var r = 0, s = this._children.length; s > r; r++) n.addChild(this._children[r].clone(!1), !0);
                (i || i === t) && n.insertAbove(this);
                for (var a = ["_locked", "_visible", "_blendMode", "_opacity", "_clipMask", "_guide", "_applyMatrix"], r = 0, s = a.length; s > r; r++) {
                    var o = a[r];
                    this.hasOwnProperty(o) && (n[o] = this[o])
                }
                return n._matrix.initialize(this._matrix), n._data = this._data ? e.clone(this._data) : null, n.setSelected(this._selected), this._name && n.setName(this._name, !0), n
            },
            copyTo: function(t) {
                return t.addChild(this.clone(!1))
            },
            rasterize: function(t) {
                var n = this.getStrokeBounds(),
                    i = (t || this.getView().getResolution()) / 72,
                    r = n.getTopLeft().floor(),
                    s = n.getBottomRight().ceil(),
                    a = new c(s.subtract(r)),
                    o = te.getCanvas(a.multiply(i)),
                    h = o.getContext("2d"),
                    u = (new g).scale(i).translate(r.negate());
                h.save(), u.applyToContext(h), this.draw(h, new e({
                    matrices: [u]
                })), h.restore();
                var l = new S(w.NO_INSERT);
                return l.setCanvas(o), l.transform((new g).translate(r.add(a.divide(2))).scale(1 / i)), l.insertAbove(this), l
            },
            contains: function() {
                return !!this._contains(this._matrix._inverseTransform(h.read(arguments)))
            },
            _contains: function(t) {
                if (this._children) {
                    for (var e = this._children.length - 1; e >= 0; e--)
                        if (this._children[e].contains(t)) return !0;
                    return !1
                }
                return t.isInside(this.getInternalBounds())
            },
            isInside: function() {
                return f.read(arguments).contains(this.getBounds())
            },
            _asPathItem: function() {
                return new L.Rectangle({
                    rectangle: this.getInternalBounds(),
                    matrix: this._matrix,
                    insert: !1
                })
            },
            intersects: function(t, e) {
                return t instanceof w ? this._asPathItem().getIntersections(t._asPathItem(), e || t._matrix).length > 0 : !1
            },
            hitTest: function() {
                return this._hitTest(h.read(arguments), M.getOptions(e.read(arguments)))
            },
            _hitTest: function(n, i) {
                function r(i, r) {
                    var s = _["get" + r]();
                    return n.subtract(s).divide(u).length <= 1 ? new M(i, f, {
                        name: e.hyphenate(r),
                        point: s
                    }) : t
                }
                if (this._locked || !this._visible || this._guide && !i.guides || this.isEmpty()) return null;
                var s = this._matrix,
                    a = i._totalMatrix,
                    o = this.getView(),
                    h = i._totalMatrix = a ? a.chain(s) : this.getGlobalMatrix().preConcatenate(o._matrix),
                    u = i._tolerancePadding = new c(L._getPenPadding(1, h.inverted())).multiply(Math.max(i.tolerance, 1e-6));
                if (n = s._inverseTransform(n), !this._children && !this.getInternalRoughBounds().expand(u.multiply(2))._containsPoint(n)) return null;
                var l, d = !(i.guides && !this._guide || i.selected && !this._selected || i.type && i.type !== e.hyphenate(this._class) || i.class && !(this instanceof i.class)),
                    f = this;
                if (d && (i.center || i.bounds) && this._parent) {
                    var _ = this.getInternalBounds();
                    if (i.center && (l = r("center", "Center")), !l && i.bounds)
                        for (var g = ["TopLeft", "TopRight", "BottomLeft", "BottomRight", "LeftCenter", "TopCenter", "RightCenter", "BottomCenter"], p = 0; 8 > p && !l; p++) l = r("bounds", g[p])
                }
                var v = !l && this._children;
                if (v)
                    for (var m = this._getChildHitTestOptions(i), p = v.length - 1; p >= 0 && !l; p--) l = v[p]._hitTest(n, m);
                return !l && d && (l = this._hitTestSelf(n, i)), l && l.point && (l.point = s.transform(l.point)), i._totalMatrix = a, l
            },
            _getChildHitTestOptions: function(t) {
                return t
            },
            _hitTestSelf: function(e, n) {
                return n.fill && this.hasFill() && this._contains(e) ? new M("fill", this) : t
            },
            matches: function(t, n) {
                function i(t, n) {
                    for (var r in t)
                        if (t.hasOwnProperty(r)) {
                            var s = t[r],
                                a = n[r];
                            if (e.isPlainObject(s) && e.isPlainObject(a)) {
                                if (!i(s, a)) return !1
                            } else if (!e.equals(s, a)) return !1
                        }
                    return !0
                }
                if ("object" == typeof t) {
                    for (var r in t)
                        if (t.hasOwnProperty(r) && !this.matches(r, t[r])) return !1
                } else {
                    var s = /^(empty|editable)$/.test(t) ? this["is" + e.capitalize(t)]() : "type" === t ? e.hyphenate(this._class) : this[t];
                    if (/^(constructor|class)$/.test(t)) {
                        if (!(this instanceof n)) return !1
                    } else if (n instanceof RegExp) {
                        if (!n.test(s)) return !1
                    } else if ("function" == typeof n) {
                        if (!n(s)) return !1
                    } else if (e.isPlainObject(n)) {
                        if (!i(n, s)) return !1
                    } else if (!e.equals(s, n)) return !1
                }
                return !0
            },
            getItems: function(t) {
                return w._getItems(this._children, t, this._matrix)
            },
            getItem: function(t) {
                return w._getItems(this._children, t, this._matrix, null, !0)[0] || null
            },
            statics: {
                _getItems: function de(t, n, i, r, s) {
                    if (!r) {
                        var a = n.overlapping,
                            o = n.inside,
                            h = a || o,
                            u = h && f.read([h]);
                        r = {
                            items: [],
                            inside: u,
                            overlapping: a && new L.Rectangle({
                                rectangle: u,
                                insert: !1
                            })
                        }, h && (n = e.set({}, n, {
                            inside: !0,
                            overlapping: !0
                        }))
                    }
                    var l = r.items,
                        o = r.inside,
                        a = r.overlapping;
                    i = o && (i || new g);
                    for (var c = 0, d = t && t.length; d > c; c++) {
                        var _ = t[c],
                            p = i && i.chain(_._matrix),
                            v = !0;
                        if (o) {
                            var h = _.getBounds(p);
                            if (!o.intersects(h)) continue;
                            o && o.contains(h) || a && a.intersects(_, p) || (v = !1)
                        }
                        if (v && _.matches(n) && (l.push(_), s)) break;
                        if (de(_._children, n, p, r, s), s && l.length > 0) break
                    }
                    return l
                }
            }
        }, {
            importJSON: function(t) {
                var n = e.importJSON(t, this);
                return n !== this ? this.addChild(n) : n
            },
            addChild: function(e, n) {
                return this.insertChild(t, e, n)
            },
            insertChild: function(t, e, n) {
                var i = e ? this.insertChildren(t, [e], n) : null;
                return i && i[0]
            },
            addChildren: function(t, e) {
                return this.insertChildren(this._children.length, t, e)
            },
            insertChildren: function(t, n, i, r) {
                var s = this._children;
                if (s && n && n.length > 0) {
                    n = Array.prototype.slice.apply(n);
                    for (var a = n.length - 1; a >= 0; a--) {
                        var o = n[a];
                        if (!r || o instanceof r) {
                            var h = o._parent === this && o._index < t;
                            o._remove(!1, !0) && h && t--
                        } else n.splice(a, 1)
                    }
                    e.splice(s, n, t, 0);
                    for (var u = this._project, l = u && u._changes, a = 0, c = n.length; c > a; a++) {
                        var o = n[a];
                        o._parent = this, o._setProject(this._project, !0), o._name && o.setName(o._name), l && this._changed(5)
                    }
                    this._changed(11)
                } else n = null;
                return n
            },
            _insertSibling: function(t, e, n) {
                return this._parent ? this._parent.insertChild(t, e, n) : null
            },
            insertAbove: function(t, e) {
                return t._insertSibling(t._index + 1, this, e)
            },
            insertBelow: function(t, e) {
                return t._insertSibling(t._index, this, e)
            },
            sendToBack: function() {
                return (this._parent || this instanceof b && this._project).insertChild(0, this)
            },
            bringToFront: function() {
                return (this._parent || this instanceof b && this._project).addChild(this)
            },
            appendTop: "#addChild",
            appendBottom: function(t) {
                return this.insertChild(0, t)
            },
            moveAbove: "#insertAbove",
            moveBelow: "#insertBelow",
            reduce: function() {
                if (this._children && 1 === this._children.length) {
                    var t = this._children[0].reduce();
                    return t.insertAbove(this), t.setStyle(this._style), this.remove(), t
                }
                return this
            },
            _removeNamed: function() {
                var t = this._parent;
                if (t) {
                    var e = t._children,
                        n = t._namedChildren,
                        i = this._name,
                        r = n[i],
                        s = r ? r.indexOf(this) : -1; - 1 !== s && (e[i] == this && delete e[i], r.splice(s, 1), r.length ? e[i] = r[r.length - 1] : delete n[i])
                }
            },
            _remove: function(t, n) {
                var i = this._parent;
                if (i) {
                    if (this._name && this._removeNamed(), null != this._index && e.splice(i._children, null, this._index, 1), this._installEvents(!1), t) {
                        var r = this._project;
                        r && r._changes && this._changed(5)
                    }
                    return n && i._changed(11), this._parent = null, !0
                }
                return !1
            },
            remove: function() {
                return this._remove(!0, !0)
            },
            replaceWith: function(t) {
                var e = t && t.insertBelow(this);
                return e && this.remove(), e
            },
            removeChildren: function(t, n) {
                if (!this._children) return null;
                t = t || 0, n = e.pick(n, this._children.length);
                for (var i = e.splice(this._children, null, t, n - t), r = i.length - 1; r >= 0; r--) i[r]._remove(!0, !1);
                return i.length > 0 && this._changed(11), i
            },
            clear: "#removeChildren",
            reverseChildren: function() {
                if (this._children) {
                    this._children.reverse();
                    for (var t = 0, e = this._children.length; e > t; t++) this._children[t]._index = t;
                    this._changed(11)
                }
            },
            isEmpty: function() {
                return !this._children || 0 === this._children.length
            },
            isEditable: function() {
                for (var t = this; t;) {
                    if (!t._visible || t._locked) return !1;
                    t = t._parent
                }
                return !0
            },
            hasFill: function() {
                return this.getStyle().hasFill()
            },
            hasStroke: function() {
                return this.getStyle().hasStroke()
            },
            hasShadow: function() {
                return this.getStyle().hasShadow()
            },
            _getOrder: function(t) {
                function e(t) {
                    var e = [];
                    do e.unshift(t); while (t = t._parent);
                    return e
                }
                for (var n = e(this), i = e(t), r = 0, s = Math.min(n.length, i.length); s > r; r++)
                    if (n[r] != i[r]) return n[r]._index < i[r]._index ? 1 : -1;
                return 0
            },
            hasChildren: function() {
                return this._children && this._children.length > 0
            },
            isInserted: function() {
                return this._parent ? this._parent.isInserted() : !1
            },
            isAbove: function(t) {
                return -1 === this._getOrder(t)
            },
            isBelow: function(t) {
                return 1 === this._getOrder(t)
            },
            isParent: function(t) {
                return this._parent === t
            },
            isChild: function(t) {
                return t && t._parent === this
            },
            isDescendant: function(t) {
                for (var e = this; e = e._parent;)
                    if (e == t) return !0;
                return !1
            },
            isAncestor: function(t) {
                return t ? t.isDescendant(this) : !1
            },
            isGroupedWith: function(t) {
                for (var e = this._parent; e;) {
                    if (e._parent && /^(Group|Layer|CompoundPath)$/.test(e._class) && t.isDescendant(e)) return !0;
                    e = e._parent
                }
                return !1
            },
            translate: function() {
                var t = new g;
                return this.transform(t.translate.apply(t, arguments))
            },
            rotate: function(t) {
                return this.transform((new g).rotate(t, h.read(arguments, 1, {
                    readNull: !0
                }) || this.getPosition(!0)))
            }
        }, e.each(["scale", "shear", "skew"], function(t) {
            this[t] = function() {
                var e = h.read(arguments),
                    n = h.read(arguments, 0, {
                        readNull: !0
                    });
                return this.transform((new g)[t](e, n || this.getPosition(!0)))
            }
        }, {}), {
            transform: function(t, e, n, i) {
                t && t.isIdentity() && (t = null);
                var r = this._matrix,
                    s = (e || this._applyMatrix) && (!r.isIdentity() || t || e && n && this._children);
                if (!t && !s) return this;
                if (t && r.preConcatenate(t), s = s && this._transformContent(r, n, i)) {
                    var a = this._pivot,
                        o = this._style,
                        h = o.getFillColor(!0),
                        u = o.getStrokeColor(!0);
                    a && r._transformPoint(a, a, !0), h && h.transform(r), u && u.transform(r), r.reset(!0), i && this._canApplyMatrix && (this._applyMatrix = !0)
                }
                var l = this._bounds,
                    c = this._position;
                this._changed(9);
                var d = l && t && t.decompose();
                if (d && !d.shearing && 0 === d.rotation % 90) {
                    for (var f in l) {
                        var _ = l[f];
                        (s || !_._internal) && t._transformBounds(_, _)
                    }
                    var g = this._boundsGetter,
                        _ = l[g && g.getBounds || g || "getBounds"];
                    _ && (this._position = _.getCenter(!0)), this._bounds = l
                } else t && c && (this._position = t._transformPoint(c, c));
                return this
            },
            _transformContent: function(t, e, n) {
                var i = this._children;
                if (i) {
                    for (var r = 0, s = i.length; s > r; r++) i[r].transform(t, !0, e, n);
                    return !0
                }
            },
            globalToLocal: function() {
                return this.getGlobalMatrix(!0)._inverseTransform(h.read(arguments))
            },
            localToGlobal: function() {
                return this.getGlobalMatrix(!0)._transformPoint(h.read(arguments))
            },
            parentToLocal: function() {
                return this._matrix._inverseTransform(h.read(arguments))
            },
            localToParent: function() {
                return this._matrix._transformPoint(h.read(arguments))
            },
            fitBounds: function(t, e) {
                t = f.read(arguments);
                var n = this.getBounds(),
                    i = n.height / n.width,
                    r = t.height / t.width,
                    s = (e ? i > r : r > i) ? t.width / n.width : t.height / n.height,
                    a = new f(new h, new c(n.width * s, n.height * s));
                a.setCenter(t.getCenter()), this.setBounds(a)
            },
            _setStyles: function(t) {
                var e = this._style,
                    n = e.getFillColor(),
                    i = e.getStrokeColor(),
                    r = e.getShadowColor();
                if (n && (t.fillStyle = n.toCanvasStyle(t)), i) {
                    var s = e.getStrokeWidth();
                    if (s > 0) {
                        t.strokeStyle = i.toCanvasStyle(t), t.lineWidth = s;
                        var a = e.getStrokeJoin(),
                            o = e.getStrokeCap(),
                            h = e.getMiterLimit();
                        if (a && (t.lineJoin = a), o && (t.lineCap = o), h && (t.miterLimit = h), paper.support.nativeDash) {
                            var u = e.getDashArray(),
                                l = e.getDashOffset();
                            u && u.length && ("setLineDash" in t ? (t.setLineDash(u), t.lineDashOffset = l) : (t.mozDash = u, t.mozDashOffset = l))
                        }
                    }
                }
                if (r) {
                    var c = e.getShadowBlur();
                    if (c > 0) {
                        t.shadowColor = r.toCanvasStyle(t), t.shadowBlur = c;
                        var d = this.getShadowOffset();
                        t.shadowOffsetX = d.x, t.shadowOffsetY = d.y
                    }
                }
            },
            draw: function(t, e, n) {
                function i(t) {
                    return a ? a.chain(t) : t
                }
                var r = this._updateVersion = this._project._updateVersion;
                if (this._visible && 0 !== this._opacity) {
                    var s = e.matrices,
                        a = e.viewMatrix,
                        o = this._matrix,
                        h = s[s.length - 1].chain(o);
                    if (h.isInvertible()) {
                        s.push(h), e.updateMatrix && (h._updateVersion = r, this._globalMatrix = h);
                        var u, l, c, d = this._blendMode,
                            f = this._opacity,
                            _ = "normal" === d,
                            g = ee.nativeModes[d],
                            p = _ && 1 === f || e.dontStart || e.clip || (g || _ && 1 > f) && this._canComposite(),
                            v = e.pixelRatio;
                        if (!p) {
                            var m = this.getStrokeBounds(i(h));
                            if (!m.width || !m.height) return;
                            c = e.offset, l = e.offset = m.getTopLeft().floor(), u = t, t = te.getContext(m.getSize().ceil().add(1).multiply(v)), 1 !== v && t.scale(v, v)
                        }
                        t.save();
                        var y = n ? n.chain(o) : !this.getStrokeScaling(!0) && i(h),
                            w = !p && e.clipItem,
                            x = !y || w;
                        if (p ? (t.globalAlpha = f, g && (t.globalCompositeOperation = d)) : x && t.translate(-l.x, -l.y), x && (p ? o : i(h)).applyToContext(t), w && e.clipItem.draw(t, e.extend({
                                clip: !0
                            })), y) {
                            t.setTransform(v, 0, 0, v, 0, 0);
                            var b = e.offset;
                            b && t.translate(-b.x, -b.y)
                        }
                        this._draw(t, e, y), t.restore(), s.pop(), e.clip && !e.dontFinish && t.clip(), p || (ee.process(d, t, u, f, l.subtract(c).multiply(v)), te.release(t), e.offset = c)
                    }
                }
            },
            _isUpdated: function(t) {
                var e = this._parent;
                if (e instanceof E) return e._isUpdated(t);
                var n = this._updateVersion === t;
                return !n && e && e._visible && e._isUpdated(t) && (this._updateVersion = t, n = !0), n
            },
            _drawSelection: function(t, e, n, i, r) {
                if ((this._drawSelected || this._boundsSelected) && this._isUpdated(r)) {
                    var s = this.getSelectedColor(!0) || this.getLayer().getSelectedColor(!0),
                        a = e.chain(this.getGlobalMatrix(!0));
                    if (t.strokeStyle = t.fillStyle = s ? s.toCanvasStyle(t) : "#009dec", this._drawSelected && this._drawSelected(t, a, i), this._boundsSelected) {
                        var o = n / 2;
                        coords = a._transformCorners(this.getInternalBounds()), t.beginPath();
                        for (var h = 0; 8 > h; h++) t[0 === h ? "moveTo" : "lineTo"](coords[h], coords[++h]);
                        t.closePath(), t.stroke();
                        for (var h = 0; 8 > h; h++) t.fillRect(coords[h] - o, coords[++h] - o, n, n)
                    }
                }
            },
            _canComposite: function() {
                return !1
            }
        }, e.each(["down", "drag", "up", "move"], function(t) {
            this["removeOn" + e.capitalize(t)] = function() {
                var e = {};
                return e[t] = !0, this.removeOn(e)
            }
        }, {
            removeOn: function(t) {
                for (var e in t)
                    if (t[e]) {
                        var n = "mouse" + e,
                            i = this._project,
                            r = i._removeSets = i._removeSets || {};
                        r[n] = r[n] || {}, r[n][this._id] = this
                    }
                return this
            }
        })),
        x = w.extend({
            _class: "Group",
            _selectChildren: !0,
            _serializeFields: {
                children: []
            },
            initialize: function(t) {
                this._children = [], this._namedChildren = {}, this._initialize(t) || this.addChildren(Array.isArray(t) ? t : arguments)
            },
            _changed: function fe(e) {
                fe.base.call(this, e), 1026 & e && (this._clipItem = t)
            },
            _getClipItem: function() {
                var e = this._clipItem;
                if (e === t) {
                    e = null;
                    for (var n = 0, i = this._children.length; i > n; n++) {
                        var r = this._children[n];
                        if (r._clipMask) {
                            e = r;
                            break
                        }
                    }
                    this._clipItem = e
                }
                return e
            },
            isClipped: function() {
                return !!this._getClipItem()
            },
            setClipped: function(t) {
                var e = this.getFirstChild();
                e && e.setClipMask(t)
            },
            _draw: function(t, e) {
                var n = e.clip,
                    i = !n && this._getClipItem(),
                    r = !0;
                if (e = e.extend({
                        clipItem: i,
                        clip: !1
                    }), n ? this._currentPath ? (t.currentPath = this._currentPath, r = !1) : (t.beginPath(), e.dontStart = e.dontFinish = !0) : i && i.draw(t, e.extend({
                        clip: !0
                    })), r)
                    for (var s = 0, a = this._children.length; a > s; s++) {
                        var o = this._children[s];
                        o !== i && o.draw(t, e)
                    }
                n && (this._currentPath = t.currentPath)
            }
        }),
        b = x.extend({
            _class: "Layer",
            initialize: function(n) {
                var i = e.isPlainObject(n) ? new e(n) : {
                        children: Array.isArray(n) ? n : arguments
                    },
                    r = i.insert;
                i.insert = !1, x.call(this, i), (r || r === t) && (this._project.addChild(this), this.activate())
            },
            _remove: function _e(t, n) {
                if (this._parent) return _e.base.call(this, t, n);
                if (null != this._index) {
                    var i = this._project;
                    return i._activeLayer === this && (i._activeLayer = this.getNextSibling() || this.getPreviousSibling()), e.splice(i.layers, null, this._index, 1), this._installEvents(!1), t && i._changes && this._changed(5), n && (i._needsUpdate = !0), !0
                }
                return !1
            },
            getNextSibling: function ge() {
                return this._parent ? ge.base.call(this) : this._project.layers[this._index + 1] || null
            },
            getPreviousSibling: function pe() {
                return this._parent ? pe.base.call(this) : this._project.layers[this._index - 1] || null
            },
            isInserted: function ve() {
                return this._parent ? ve.base.call(this) : null != this._index
            },
            activate: function() {
                this._project._activeLayer = this
            },
            _insertSibling: function me(t, e, n) {
                return this._parent ? me.base.call(this, t, e, n) : this._project.insertChild(t, e, n)
            }
        }),
        C = w.extend({
            _class: "Shape",
            _applyMatrix: !1,
            _canApplyMatrix: !1,
            _boundsSelected: !0,
            _serializeFields: {
                type: null,
                size: null,
                radius: null
            },
            initialize: function(t) {
                this._initialize(t)
            },
            _equals: function(t) {
                return this._type === t._type && this._size.equals(t._size) && e.equals(this._radius, t._radius)
            },
            clone: function(t) {
                var e = new C(w.NO_INSERT);
                return e.setType(this._type), e.setSize(this._size), e.setRadius(this._radius), this._clone(e, t)
            },
            getType: function() {
                return this._type
            },
            setType: function(t) {
                this._type = t
            },
            getShape: "#getType",
            setShape: "#setType",
            getSize: function() {
                var t = this._size;
                return new d(t.width, t.height, this, "setSize")
            },
            setSize: function() {
                var t = c.read(arguments);
                if (this._size) {
                    if (!this._size.equals(t)) {
                        var e = this._type,
                            n = t.width,
                            i = t.height;
                        if ("rectangle" === e) {
                            var r = c.min(this._radius, t.divide(2));
                            this._radius.set(r.width, r.height)
                        } else "circle" === e ? (n = i = (n + i) / 2, this._radius = n / 2) : "ellipse" === e && this._radius.set(n / 2, i / 2);
                        this._size.set(n, i), this._changed(9)
                    }
                } else this._size = t.clone()
            },
            getRadius: function() {
                var t = this._radius;
                return "circle" === this._type ? t : new d(t.width, t.height, this, "setRadius")
            },
            setRadius: function(t) {
                var e = this._type;
                if ("circle" === e) {
                    if (t === this._radius) return;
                    var n = 2 * t;
                    this._radius = t, this._size.set(n, n)
                } else if (t = c.read(arguments), this._radius) {
                    if (this._radius.equals(t)) return;
                    if (this._radius.set(t.width, t.height), "rectangle" === e) {
                        var n = c.max(this._size, t.multiply(2));
                        this._size.set(n.width, n.height)
                    } else "ellipse" === e && this._size.set(2 * t.width, 2 * t.height)
                } else this._radius = t.clone();
                this._changed(9)
            },
            isEmpty: function() {
                return !1
            },
            toPath: function(n) {
                var i = new(L[e.capitalize(this._type)])({
                    center: new h,
                    size: this._size,
                    radius: this._radius,
                    insert: !1
                });
                return i.setStyle(this._style), i.transform(this._matrix), (n || n === t) && i.insertAbove(this), i
            },
            _draw: function(t, e, n) {
                var i = this._style,
                    r = i.hasFill(),
                    s = i.hasStroke(),
                    a = e.dontFinish || e.clip,
                    o = !n;
                if (r || s || a) {
                    var h = this._type,
                        u = this._radius,
                        l = "circle" === h;
                    if (e.dontStart || t.beginPath(), o && l) t.arc(0, 0, u, 0, 2 * Math.PI, !0);
                    else {
                        var c = l ? u : u.width,
                            d = l ? u : u.height,
                            f = this._size,
                            _ = f.width,
                            g = f.height;
                        if (o && "rect" === h && 0 === c && 0 === d) t.rect(-_ / 2, -g / 2, _, g);
                        else {
                            var p = _ / 2,
                                v = g / 2,
                                m = .44771525016920644,
                                y = c * m,
                                w = d * m,
                                x = [-p, -v + d, -p, -v + w, -p + y, -v, -p + c, -v, p - c, -v, p - y, -v, p, -v + w, p, -v + d, p, v - d, p, v - w, p - y, v, p - c, v, -p + c, v, -p + y, v, -p, v - w, -p, v - d];
                            n && n.transform(x, x, 32), t.moveTo(x[0], x[1]), t.bezierCurveTo(x[2], x[3], x[4], x[5], x[6], x[7]), p !== c && t.lineTo(x[8], x[9]), t.bezierCurveTo(x[10], x[11], x[12], x[13], x[14], x[15]), v !== d && t.lineTo(x[16], x[17]), t.bezierCurveTo(x[18], x[19], x[20], x[21], x[22], x[23]), p !== c && t.lineTo(x[24], x[25]), t.bezierCurveTo(x[26], x[27], x[28], x[29], x[30], x[31])
                        }
                    }
                    t.closePath()
                }
                a || !r && !s || (this._setStyles(t), r && (t.fill(i.getWindingRule()), t.shadowColor = "rgba(0,0,0,0)"), s && t.stroke())
            },
            _canComposite: function() {
                return !(this.hasFill() && this.hasStroke())
            },
            _getBounds: function(t, e) {
                var n = new f(this._size).setCenter(0, 0);
                return "getBounds" !== t && this.hasStroke() && (n = n.expand(this.getStrokeWidth())), e ? e._transformBounds(n) : n
            }
        }, new function() {
            function t(t, e, n) {
                var i = t._radius;
                if (!i.isZero())
                    for (var r = t._size.divide(2), s = 0; 4 > s; s++) {
                        var a = new h(1 & s ? 1 : -1, s > 1 ? 1 : -1),
                            o = a.multiply(r),
                            u = o.subtract(a.multiply(i)),
                            l = new f(o, u);
                        if ((n ? l.expand(n) : l).contains(e)) return u
                    }
            }

            function e(t, e) {
                var n = t.getAngleInRadians(),
                    i = 2 * e.width,
                    r = 2 * e.height,
                    s = i * Math.sin(n),
                    a = r * Math.cos(n);
                return i * r / (2 * Math.sqrt(s * s + a * a))
            }
            return {
                _contains: function n(e) {
                    if ("rectangle" === this._type) {
                        var i = t(this, e);
                        return i ? e.subtract(i).divide(this._radius).getLength() <= 1 : n.base.call(this, e)
                    }
                    return e.divide(this.size).getLength() <= .5
                },
                _hitTestSelf: function i(n, r) {
                    var s = !1;
                    if (this.hasStroke()) {
                        var a = this._type,
                            o = this._radius,
                            h = this.getStrokeWidth() + 2 * r.tolerance;
                        if ("rectangle" === a) {
                            var u = t(this, n, h);
                            if (u) {
                                var l = n.subtract(u);
                                s = 2 * Math.abs(l.getLength() - e(l, o)) <= h
                            } else {
                                var c = new f(this._size).setCenter(0, 0),
                                    d = c.expand(h),
                                    _ = c.expand(-h);
                                s = d._containsPoint(n) && !_._containsPoint(n)
                            }
                        } else "ellipse" === a && (o = e(n, o)), s = 2 * Math.abs(n.getLength() - o) <= h
                    }
                    return s ? new M("stroke", this) : i.base.apply(this, arguments)
                }
            }
        }, {
            statics: new function() {
                function t(t, n, i, r, s) {
                    var a = new C(e.getNamed(s));
                    return a._type = t, a._size = i, a._radius = r, a.translate(n)
                }
                return {
                    Circle: function() {
                        var n = h.readNamed(arguments, "center"),
                            i = e.readNamed(arguments, "radius");
                        return t("circle", n, new c(2 * i), i, arguments)
                    },
                    Rectangle: function() {
                        var e = f.readNamed(arguments, "rectangle"),
                            n = c.min(c.readNamed(arguments, "radius"), e.getSize(!0).divide(2));
                        return t("rectangle", e.getCenter(!0), e.getSize(!0), n, arguments)
                    },
                    Ellipse: function() {
                        var e = C._readEllipse(arguments),
                            n = e.radius;
                        return t("ellipse", e.center, n.multiply(2), n, arguments)
                    },
                    _readEllipse: function(t) {
                        var n, i;
                        if (e.hasNamed(t, "radius")) n = h.readNamed(t, "center"), i = c.readNamed(t, "radius");
                        else {
                            var r = f.readNamed(t, "rectangle");
                            n = r.getCenter(!0), i = r.getSize(!0).divide(2)
                        }
                        return {
                            center: n,
                            radius: i
                        }
                    }
                }
            }
        }),
        S = w.extend({
            _class: "Raster",
            _applyMatrix: !1,
            _canApplyMatrix: !1,
            _boundsGetter: "getBounds",
            _boundsSelected: !0,
            _serializeFields: {
                source: null
            },
            initialize: function(e, n) {
                this._initialize(e, n !== t && h.read(arguments, 1)) || ("string" == typeof e ? this.setSource(e) : this.setImage(e)), this._size || (this._size = new c, this._loaded = !1)
            },
            _equals: function(t) {
                return this.getSource() === t.getSource()
            },
            clone: function(t) {
                var e = new S(w.NO_INSERT),
                    n = this._image,
                    i = this._canvas;
                if (n) e.setImage(n);
                else if (i) {
                    var r = te.getCanvas(this._size);
                    r.getContext("2d").drawImage(i, 0, 0), e.setImage(r)
                }
                return this._clone(e, t)
            },
            getSize: function() {
                var t = this._size;
                return new d(t ? t.width : 0, t ? t.height : 0, this, "setSize")
            },
            setSize: function() {
                var t = c.read(arguments);
                if (!t.equals(this._size))
                    if (t.width > 0 && t.height > 0) {
                        var e = this.getElement();
                        this.setImage(te.getCanvas(t)), e && this.getContext(!0).drawImage(e, 0, 0, t.width, t.height)
                    } else this._canvas && te.release(this._canvas), this._size = t.clone()
            },
            getWidth: function() {
                return this._size ? this._size.width : 0
            },
            setWidth: function(t) {
                this.setSize(t, this.getHeight())
            },
            getHeight: function() {
                return this._size ? this._size.height : 0
            },
            setHeight: function(t) {
                this.setSize(this.getWidth(), t)
            },
            isEmpty: function() {
                var t = this._size;
                return !t || 0 === t.width && 0 === t.height
            },
            getResolution: function() {
                var t = this._matrix,
                    e = new h(0, 0).transform(t),
                    n = new h(1, 0).transform(t).subtract(e),
                    i = new h(0, 1).transform(t).subtract(e);
                return new c(72 / n.getLength(), 72 / i.getLength())
            },
            getPpi: "#getResolution",
            getImage: function() {
                return this._image
            },
            setImage: function(t) {
                this._canvas && te.release(this._canvas), t && t.getContext ? (this._image = null, this._canvas = t, this._loaded = !0) : (this._image = t, this._canvas = null, this._loaded = t && t.complete), this._size = new c(t ? t.naturalWidth || t.width : 0, t ? t.naturalHeight || t.height : 0), this._context = null, this._changed(521)
            },
            getCanvas: function() {
                if (!this._canvas) {
                    var t = te.getContext(this._size);
                    try {
                        this._image && t.drawImage(this._image, 0, 0), this._canvas = t.canvas
                    } catch (e) {
                        te.release(t)
                    }
                }
                return this._canvas
            },
            setCanvas: "#setImage",
            getContext: function(t) {
                return this._context || (this._context = this.getCanvas().getContext("2d")), t && (this._image = null, this._changed(513)), this._context
            },
            setContext: function(t) {
                this._context = t
            },
            getSource: function() {
                return this._image && this._image.src || this.toDataURL()
            },
            setSource: function(t) {
                function e() {
                    var t = i.getView();
                    t && (paper = t._scope, i.setImage(n), i.emit("load"), t.update())
                }
                var n, i = this;
                n = document.getElementById(t) || new Image, n.naturalWidth && n.naturalHeight ? setTimeout(e, 0) : (U.add(n, {
                    load: e
                }), n.src || (n.src = t)), this.setImage(n)
            },
            getElement: function() {
                return this._canvas || this._loaded && this._image
            }
        }, {
            beans: !1,
            getSubCanvas: function() {
                var t = f.read(arguments),
                    e = te.getContext(t.getSize());
                return e.drawImage(this.getCanvas(), t.x, t.y, t.width, t.height, 0, 0, t.width, t.height), e.canvas
            },
            getSubRaster: function() {
                var t = f.read(arguments),
                    e = new S(w.NO_INSERT);
                return e.setImage(this.getSubCanvas(t)), e.translate(t.getCenter().subtract(this.getSize().divide(2))), e._matrix.preConcatenate(this._matrix), e.insertAbove(this), e
            },
            toDataURL: function() {
                var t = this._image && this._image.src;
                if (/^data:/.test(t)) return t;
                var e = this.getCanvas();
                return e ? e.toDataURL() : null
            },
            drawImage: function(t) {
                var e = h.read(arguments, 1);
                this.getContext(!0).drawImage(t, e.x, e.y)
            },
            getAverageColor: function(t) {
                var n, i;
                t ? t instanceof T ? (i = t, n = t.getBounds()) : t.width ? n = new f(t) : t.x && (n = new f(t.x - .5, t.y - .5, 1, 1)) : n = this.getBounds();
                var r = 32,
                    s = Math.min(n.width, r),
                    a = Math.min(n.height, r),
                    o = S._sampleContext;
                o ? o.clearRect(0, 0, r + 1, r + 1) : o = S._sampleContext = te.getContext(new c(r)), o.save();
                var h = (new g).scale(s / n.width, a / n.height).translate(-n.x, -n.y);
                h.applyToContext(o), i && i.draw(o, new e({
                    clip: !0,
                    matrices: [h]
                })), this._matrix.applyToContext(o);
                var u = this.getElement(),
                    l = this._size;
                u && o.drawImage(u, -l.width / 2, -l.height / 2), o.restore();
                for (var d = o.getImageData(.5, .5, Math.ceil(s), Math.ceil(a)).data, _ = [0, 0, 0], p = 0, v = 0, m = d.length; m > v; v += 4) {
                    var y = d[v + 3];
                    p += y, y /= 255, _[0] += d[v] * y, _[1] += d[v + 1] * y, _[2] += d[v + 2] * y
                }
                for (var v = 0; 3 > v; v++) _[v] /= p;
                return p ? R.read(_) : null
            },
            getPixel: function() {
                var t = h.read(arguments),
                    e = this.getContext().getImageData(t.x, t.y, 1, 1).data;
                return new R("rgb", [e[0] / 255, e[1] / 255, e[2] / 255], e[3] / 255)
            },
            setPixel: function() {
                var t = h.read(arguments),
                    e = R.read(arguments),
                    n = e._convert("rgb"),
                    i = e._alpha,
                    r = this.getContext(!0),
                    s = r.createImageData(1, 1),
                    a = s.data;
                a[0] = 255 * n[0], a[1] = 255 * n[1], a[2] = 255 * n[2], a[3] = null != i ? 255 * i : 255, r.putImageData(s, t.x, t.y)
            },
            createImageData: function() {
                var t = c.read(arguments);
                return this.getContext().createImageData(t.width, t.height)
            },
            getImageData: function() {
                var t = f.read(arguments);
                return t.isEmpty() && (t = new f(this._size)), this.getContext().getImageData(t.x, t.y, t.width, t.height)
            },
            setImageData: function(t) {
                var e = h.read(arguments, 1);
                this.getContext(!0).putImageData(t, e.x, e.y)
            },
            _getBounds: function(t, e) {
                var n = new f(this._size).setCenter(0, 0);
                return e ? e._transformBounds(n) : n
            },
            _hitTestSelf: function(t) {
                if (this._contains(t)) {
                    var e = this;
                    return new M("pixel", e, {
                        offset: t.add(e._size.divide(2)).round(),
                        color: {
                            get: function() {
                                return e.getPixel(this.offset)
                            }
                        }
                    })
                }
            },
            _draw: function(t) {
                var e = this.getElement();
                e && (t.globalAlpha = this._opacity, t.drawImage(e, -this._size.width / 2, -this._size.height / 2))
            },
            _canComposite: function() {
                return !0
            }
        }),
        P = w.extend({
            _class: "PlacedSymbol",
            _applyMatrix: !1,
            _canApplyMatrix: !1,
            _boundsGetter: {
                getBounds: "getStrokeBounds"
            },
            _boundsSelected: !0,
            _serializeFields: {
                symbol: null
            },
            initialize: function(e, n) {
                this._initialize(e, n !== t && h.read(arguments, 1)) || this.setSymbol(e instanceof y ? e : new y(e))
            },
            _equals: function(t) {
                return this._symbol === t._symbol
            },
            getSymbol: function() {
                return this._symbol
            },
            setSymbol: function(t) {
                this._symbol = t, this._changed(9)
            },
            clone: function(t) {
                var e = new P(w.NO_INSERT);
                return e.setSymbol(this._symbol), this._clone(e, t)
            },
            isEmpty: function() {
                return this._symbol._definition.isEmpty()
            },
            _getBounds: function(t, e, n) {
                var i = this.symbol._definition;
                return i._getCachedBounds(t, e && e.chain(i._matrix), n)
            },
            _hitTestSelf: function(t, e) {
                var n = this._symbol._definition._hitTest(t, e);
                return n && (n.item = this), n
            },
            _draw: function(t, e) {
                this.symbol._definition.draw(t, e)
            }
        }),
        M = e.extend({
            _class: "HitResult",
            initialize: function(t, e, n) {
                this.type = t, this.item = e, n && (n.enumerable = !0, this.inject(n))
            },
            statics: {
                getOptions: function(t) {
                    return new e({
                        type: null,
                        tolerance: paper.settings.hitTolerance,
                        fill: !t,
                        stroke: !t,
                        segments: !t,
                        handles: !1,
                        ends: !1,
                        center: !1,
                        bounds: !1,
                        guides: !1,
                        selected: !1
                    }, t)
                }
            }
        }),
        I = e.extend({
            _class: "Segment",
            beans: !0,
            initialize: function(e, n, i, r, s, a) {
                var o, h, u, l = arguments.length;
                0 === l || (1 === l ? e.point ? (o = e.point, h = e.handleIn, u = e.handleOut) : o = e : 2 === l && "number" == typeof e ? o = arguments : 3 >= l ? (o = e, h = n, u = i) : (o = e !== t ? [e, n] : null, h = i !== t ? [i, r] : null, u = s !== t ? [s, a] : null)), new z(o, this, "_point"), new z(h, this, "_handleIn"), new z(u, this, "_handleOut")
            },
            _serialize: function(t) {
                return e.serialize(this.isLinear() ? this._point : [this._point, this._handleIn, this._handleOut], t, !0)
            },
            _changed: function(t) {
                var e = this._path;
                if (e) {
                    var n, i = e._curves,
                        r = this._index;
                    i && (t && t !== this._point && t !== this._handleIn || !(n = r > 0 ? i[r - 1] : e._closed ? i[i.length - 1] : null) || n._changed(), t && t !== this._point && t !== this._handleOut || !(n = i[r]) || n._changed()), e._changed(25)
                }
            },
            getPoint: function() {
                return this._point
            },
            setPoint: function() {
                var t = h.read(arguments);
                this._point.set(t.x, t.y)
            },
            getHandleIn: function() {
                return this._handleIn
            },
            setHandleIn: function() {
                var t = h.read(arguments);
                this._handleIn.set(t.x, t.y)
            },
            getHandleOut: function() {
                return this._handleOut
            },
            setHandleOut: function() {
                var t = h.read(arguments);
                this._handleOut.set(t.x, t.y)
            },
            isLinear: function() {
                return this._handleIn.isZero() && this._handleOut.isZero()
            },
            setLinear: function(t) {
                t && (this._handleIn.set(0, 0), this._handleOut.set(0, 0))
            },
            isColinear: function(t) {
                var e = this.getNext(),
                    n = t.getNext();
                return this._handleOut.isZero() && e._handleIn.isZero() && t._handleOut.isZero() && n._handleIn.isZero() && e._point.subtract(this._point).isColinear(n._point.subtract(t._point))
            },
            isOrthogonal: function() {
                var t = this.getPrevious(),
                    e = this.getNext();
                return t._handleOut.isZero() && this._handleIn.isZero() && this._handleOut.isZero() && e._handleIn.isZero() && this._point.subtract(t._point).isOrthogonal(e._point.subtract(this._point))
            },
            isArc: function() {
                var t = this.getNext(),
                    e = this._handleOut,
                    n = t._handleIn,
                    i = .5522847498307936;
                if (e.isOrthogonal(n)) {
                    var r = this._point,
                        s = t._point,
                        a = new p(r, e, !0).intersect(new p(s, n, !0), !0);
                    return a && o.isZero(e.getLength() / a.subtract(r).getLength() - i) && o.isZero(n.getLength() / a.subtract(s).getLength() - i)
                }
                return !1
            },
            _selectionState: 0,
            isSelected: function(t) {
                var e = this._selectionState;
                return t ? t === this._point ? !!(4 & e) : t === this._handleIn ? !!(1 & e) : t === this._handleOut ? !!(2 & e) : !1 : !!(7 & e)
            },
            setSelected: function(t, e) {
                var n = this._path,
                    t = !!t,
                    i = this._selectionState,
                    r = i,
                    s = e ? e === this._point ? 4 : e === this._handleIn ? 1 : e === this._handleOut ? 2 : 0 : 7;
                t ? i |= s : i &= ~s, this._selectionState = i, n && i !== r && (n._updateSelection(this, r, i), n._changed(129))
            },
            getIndex: function() {
                return this._index !== t ? this._index : null
            },
            getPath: function() {
                return this._path || null
            },
            getCurve: function() {
                var t = this._path,
                    e = this._index;
                return t ? (e > 0 && !t._closed && e === t._segments.length - 1 && e--, t.getCurves()[e] || null) : null
            },
            getLocation: function() {
                var t = this.getCurve();
                return t ? new O(t, this === t._segment1 ? 0 : 1) : null
            },
            getNext: function() {
                var t = this._path && this._path._segments;
                return t && (t[this._index + 1] || this._path._closed && t[0]) || null
            },
            getPrevious: function() {
                var t = this._path && this._path._segments;
                return t && (t[this._index - 1] || this._path._closed && t[t.length - 1]) || null
            },
            reverse: function() {
                return new I(this._point, this._handleOut, this._handleIn)
            },
            remove: function() {
                return this._path ? !!this._path.removeSegment(this._index) : !1
            },
            clone: function() {
                return new I(this._point, this._handleIn, this._handleOut)
            },
            equals: function(t) {
                return t === this || t && this._class === t._class && this._point.equals(t._point) && this._handleIn.equals(t._handleIn) && this._handleOut.equals(t._handleOut) || !1
            },
            toString: function() {
                var t = ["point: " + this._point];
                return this._handleIn.isZero() || t.push("handleIn: " + this._handleIn), this._handleOut.isZero() || t.push("handleOut: " + this._handleOut), "{ " + t.join(", ") + " }"
            },
            transform: function(t) {
                this._transformCoordinates(t, Array(6), !0), this._changed()
            },
            _transformCoordinates: function(t, e, n) {
                var i = this._point,
                    r = n && this._handleIn.isZero() ? null : this._handleIn,
                    s = n && this._handleOut.isZero() ? null : this._handleOut,
                    a = i._x,
                    o = i._y,
                    h = 2;
                return e[0] = a, e[1] = o, r && (e[h++] = r._x + a, e[h++] = r._y + o), s && (e[h++] = s._x + a, e[h++] = s._y + o), t && (t._transformCoordinates(e, e, h / 2), a = e[0], o = e[1], n ? (i._x = a, i._y = o, h = 2, r && (r._x = e[h++] - a, r._y = e[h++] - o), s && (s._x = e[h++] - a, s._y = e[h++] - o)) : (r || (e[h++] = a, e[h++] = o), s || (e[h++] = a, e[h++] = o))), e
            }
        }),
        z = h.extend({
            initialize: function(e, n, i) {
                var r, s, a;
                if (e)
                    if ((r = e[0]) !== t) s = e[1];
                    else {
                        var o = e;
                        (r = o.x) === t && (o = h.read(arguments), r = o.x), s = o.y, a = o.selected
                    } else r = s = 0;
                this._x = r, this._y = s, this._owner = n, n[i] = this, a && this.setSelected(!0)
            },
            set: function(t, e) {
                return this._x = t, this._y = e, this._owner._changed(this), this
            },
            _serialize: function(t) {
                var e = t.formatter,
                    n = e.number(this._x),
                    i = e.number(this._y);
                return this.isSelected() ? {
                    x: n,
                    y: i,
                    selected: !0
                } : [n, i]
            },
            getX: function() {
                return this._x
            },
            setX: function(t) {
                this._x = t, this._owner._changed(this)
            },
            getY: function() {
                return this._y
            },
            setY: function(t) {
                this._y = t, this._owner._changed(this)
            },
            isZero: function() {
                return o.isZero(this._x) && o.isZero(this._y)
            },
            setSelected: function(t) {
                this._owner.setSelected(t, this)
            },
            isSelected: function() {
                return this._owner.isSelected(this)
            }
        }),
        A = e.extend({
            _class: "Curve",
            initialize: function(t, e, n, i, r, s, a, o) {
                var h = arguments.length;
                if (3 === h) this._path = t, this._segment1 = e, this._segment2 = n;
                else if (0 === h) this._segment1 = new I, this._segment2 = new I;
                else if (1 === h) this._segment1 = new I(t.segment1), this._segment2 = new I(t.segment2);
                else if (2 === h) this._segment1 = new I(t), this._segment2 = new I(e);
                else {
                    var u, l, c, d;
                    4 === h ? (u = t, l = e, c = n, d = i) : 8 === h && (u = [t, e], d = [a, o], l = [n - t, i - e], c = [r - a, s - o]), this._segment1 = new I(u, null, l), this._segment2 = new I(d, c, null)
                }
            },
            _changed: function() {
                this._length = this._bounds = t
            },
            getPoint1: function() {
                return this._segment1._point
            },
            setPoint1: function() {
                var t = h.read(arguments);
                this._segment1._point.set(t.x, t.y)
            },
            getPoint2: function() {
                return this._segment2._point
            },
            setPoint2: function() {
                var t = h.read(arguments);
                this._segment2._point.set(t.x, t.y)
            },
            getHandle1: function() {
                return this._segment1._handleOut
            },
            setHandle1: function() {
                var t = h.read(arguments);
                this._segment1._handleOut.set(t.x, t.y)
            },
            getHandle2: function() {
                return this._segment2._handleIn
            },
            setHandle2: function() {
                var t = h.read(arguments);
                this._segment2._handleIn.set(t.x, t.y)
            },
            getSegment1: function() {
                return this._segment1
            },
            getSegment2: function() {
                return this._segment2
            },
            getPath: function() {
                return this._path
            },
            getIndex: function() {
                return this._segment1._index
            },
            getNext: function() {
                var t = this._path && this._path._curves;
                return t && (t[this._segment1._index + 1] || this._path._closed && t[0]) || null
            },
            getPrevious: function() {
                var t = this._path && this._path._curves;
                return t && (t[this._segment1._index - 1] || this._path._closed && t[t.length - 1]) || null
            },
            isSelected: function() {
                return this.getPoint1().isSelected() && this.getHandle2().isSelected() && this.getHandle2().isSelected() && this.getPoint2().isSelected()
            },
            setSelected: function(t) {
                this.getPoint1().setSelected(t), this.getHandle1().setSelected(t), this.getHandle2().setSelected(t), this.getPoint2().setSelected(t)
            },
            getValues: function(t) {
                return A.getValues(this._segment1, this._segment2, t)
            },
            getPoints: function() {
                for (var t = this.getValues(), e = [], n = 0; 8 > n; n += 2) e.push(new h(t[n], t[n + 1]));
                return e
            },
            getLength: function() {
                return null == this._length && (this._length = this.isLinear() ? this._segment2._point.getDistance(this._segment1._point) : A.getLength(this.getValues(), 0, 1)), this._length
            },
            getArea: function() {
                return A.getArea(this.getValues())
            },
            getPart: function(t, e) {
                return new A(A.getPart(this.getValues(), t, e))
            },
            getPartLength: function(t, e) {
                return A.getLength(this.getValues(), t, e)
            },
            isLinear: function() {
                return this._segment1._handleOut.isZero() && this._segment2._handleIn.isZero()
            },
            getIntersections: function(t) {
                return A.filterIntersections(A.getIntersections(this.getValues(), t.getValues(), this, t, []))
            },
            _getParameter: function(e, n) {
                return n ? e : e && e.curve === this ? e.parameter : e === t && n === t ? .5 : this.getParameterAt(e, 0)
            },
            divide: function(t, e, n) {
                var i = this._getParameter(t, e),
                    r = 1e-6,
                    s = null;
                if (i > r && 1 - r > i) {
                    var a = A.subdivide(this.getValues(), i),
                        o = n ? !1 : this.isLinear(),
                        u = a[0],
                        l = a[1];
                    o || (this._segment1._handleOut.set(u[2] - u[0], u[3] - u[1]), this._segment2._handleIn.set(l[4] - l[6], l[5] - l[7]));
                    var c = u[6],
                        d = u[7],
                        f = new I(new h(c, d), !o && new h(u[4] - c, u[5] - d), !o && new h(l[2] - c, l[3] - d));
                    if (this._path) this._segment1._index > 0 && 0 === this._segment2._index ? this._path.add(f) : this._path.insert(this._segment2._index, f), s = this;
                    else {
                        var _ = this._segment2;
                        this._segment2 = f, s = new A(f, _)
                    }
                }
                return s
            },
            split: function(t, e) {
                return this._path ? this._path.split(this._segment1._index, this._getParameter(t, e)) : null
            },
            reverse: function() {
                return new A(this._segment2.reverse(), this._segment1.reverse())
            },
            remove: function() {
                var t = !1;
                if (this._path) {
                    var e = this._segment2,
                        n = e._handleOut;
                    t = e.remove(), t && this._segment1._handleOut.set(n.x, n.y)
                }
                return t
            },
            clone: function() {
                return new A(this._segment1, this._segment2)
            },
            toString: function() {
                var t = ["point1: " + this._segment1._point];
                return this._segment1._handleOut.isZero() || t.push("handle1: " + this._segment1._handleOut), this._segment2._handleIn.isZero() || t.push("handle2: " + this._segment2._handleIn), t.push("point2: " + this._segment2._point), "{ " + t.join(", ") + " }"
            },
            statics: {
                getValues: function(t, e, n) {
                    var i = t._point,
                        r = t._handleOut,
                        s = e._handleIn,
                        a = e._point,
                        o = [i._x, i._y, i._x + r._x, i._y + r._y, a._x + s._x, a._y + s._y, a._x, a._y];
                    return n && n._transformCoordinates(o, o, 4), o
                },
                evaluate: function(t, e, n) {
                    var i, r, s = t[0],
                        a = t[1],
                        o = t[2],
                        u = t[3],
                        l = t[4],
                        c = t[5],
                        d = t[6],
                        f = t[7],
                        _ = 1e-6;
                    if (0 === n && (_ > e || e > 1 - _)) {
                        var g = _ > e;
                        i = g ? s : d, r = g ? a : f
                    } else {
                        var p = 3 * (o - s),
                            v = 3 * (l - o) - p,
                            m = d - s - p - v,
                            y = 3 * (u - a),
                            w = 3 * (c - u) - y,
                            x = f - a - y - w;
                        if (0 === n) i = ((m * e + v) * e + p) * e + s, r = ((x * e + w) * e + y) * e + a;
                        else if (_ > e && o === s && u === a || e > 1 - _ && l === d && c === f ? (i = l - o, r = c - u) : _ > e ? (i = p, r = y) : e > 1 - _ ? (i = 3 * (d - l), r = 3 * (f - c)) : (i = (3 * m * e + 2 * v) * e + p, r = (3 * x * e + 2 * w) * e + y), 3 === n) {
                            var b = 6 * m * e + 2 * v,
                                C = 6 * x * e + 2 * w;
                            return (i * C - r * b) / Math.pow(i * i + r * r, 1.5)
                        }
                    }
                    return 2 === n ? new h(r, -i) : new h(i, r)
                },
                subdivide: function(e, n) {
                    var i = e[0],
                        r = e[1],
                        s = e[2],
                        a = e[3],
                        o = e[4],
                        h = e[5],
                        u = e[6],
                        l = e[7];
                    n === t && (n = .5);
                    var c = 1 - n,
                        d = c * i + n * s,
                        f = c * r + n * a,
                        _ = c * s + n * o,
                        g = c * a + n * h,
                        p = c * o + n * u,
                        v = c * h + n * l,
                        m = c * d + n * _,
                        y = c * f + n * g,
                        w = c * _ + n * p,
                        x = c * g + n * v,
                        b = c * m + n * w,
                        C = c * y + n * x;
                    return [
                        [i, r, d, f, m, y, b, C],
                        [b, C, w, x, p, v, u, l]
                    ]
                },
                solveCubic: function(t, e, n, i, r, s) {
                    var a = t[e],
                        h = t[e + 2],
                        u = t[e + 4],
                        l = t[e + 6],
                        c = 3 * (h - a),
                        d = 3 * (u - h) - c,
                        f = l - a - c - d,
                        _ = o.isZero;
                    return _(f) && _(d) && (f = d = 0), o.solveCubic(f, d, c, a - n, i, r, s)
                },
                getParameterOf: function(t, e, n) {
                    var i = 1e-6;
                    if (Math.abs(t[0] - e) < i && Math.abs(t[1] - n) < i) return 0;
                    if (Math.abs(t[6] - e) < i && Math.abs(t[7] - n) < i) return 1;
                    for (var r, s, a = [], o = [], h = A.solveCubic(t, 0, e, a, 0, 1), u = A.solveCubic(t, 1, n, o, 0, 1), l = 0; - 1 == h || h > l;)
                        if (-1 == h || (r = a[l++]) >= 0 && 1 >= r) {
                            for (var c = 0; - 1 == u || u > c;)
                                if ((-1 == u || (s = o[c++]) >= 0 && 1 >= s) && (-1 == h ? r = s : -1 == u && (s = r), Math.abs(r - s) < i)) return .5 * (r + s);
                            if (-1 == h) break
                        }
                    return null
                },
                getPart: function(t, e, n) {
                    return e > 0 && (t = A.subdivide(t, e)[1]), 1 > n && (t = A.subdivide(t, (n - e) / (1 - e))[0]), t
                },
                isLinear: function(t) {
                    var e = o.isZero;
                    return e(t[0] - t[2]) && e(t[1] - t[3]) && e(t[4] - t[6]) && e(t[5] - t[7])
                },
                isFlatEnough: function(t, e) {
                    var n = t[0],
                        i = t[1],
                        r = t[2],
                        s = t[3],
                        a = t[4],
                        o = t[5],
                        h = t[6],
                        u = t[7],
                        l = 3 * r - 2 * n - h,
                        c = 3 * s - 2 * i - u,
                        d = 3 * a - 2 * h - n,
                        f = 3 * o - 2 * u - i;
                    return Math.max(l * l, d * d) + Math.max(c * c, f * f) < 10 * e * e
                },
                getArea: function(t) {
                    var e = t[0],
                        n = t[1],
                        i = t[2],
                        r = t[3],
                        s = t[4],
                        a = t[5],
                        o = t[6],
                        h = t[7];
                    return (3 * r * e - 1.5 * r * s - 1.5 * r * o - 3 * n * i - 1.5 * n * s - .5 * n * o + 1.5 * a * e + 1.5 * a * i - 3 * a * o + .5 * h * e + 1.5 * h * i + 3 * h * s) / 10
                },
                getEdgeSum: function(t) {
                    return (t[0] - t[2]) * (t[3] + t[1]) + (t[2] - t[4]) * (t[5] + t[3]) + (t[4] - t[6]) * (t[7] + t[5])
                },
                getBounds: function(t) {
                    for (var e = t.slice(0, 2), n = e.slice(), i = [0, 0], r = 0; 2 > r; r++) A._addBounds(t[r], t[r + 2], t[r + 4], t[r + 6], r, 0, e, n, i);
                    return new f(e[0], e[1], n[0] - e[0], n[1] - e[1])
                },
                _addBounds: function(t, e, n, i, r, s, a, h, u) {
                    function l(t, e) {
                        var n = t - e,
                            i = t + e;
                        n < a[r] && (a[r] = n), i > h[r] && (h[r] = i)
                    }
                    var c = 3 * (e - n) - t + i,
                        d = 2 * (t + n) - 4 * e,
                        f = e - t,
                        _ = o.solveQuadratic(c, d, f, u),
                        g = 1e-6,
                        p = 1 - g;
                    l(i, 0);
                    for (var v = 0; _ > v; v++) {
                        var m = u[v],
                            y = 1 - m;
                        m > g && p > m && l(y * y * y * t + 3 * y * y * m * e + 3 * y * m * m * n + m * m * m * i, s)
                    }
                }
            }
        }, e.each(["getBounds", "getStrokeBounds", "getHandleBounds", "getRoughBounds"], function(t) {
            this[t] = function() {
                this._bounds || (this._bounds = {});
                var e = this._bounds[t];
                return e || (e = this._bounds[t] = L[t]([this._segment1, this._segment2], !1, this._path.getStyle())), e.clone()
            }
        }, {}), e.each(["getPoint", "getTangent", "getNormal", "getCurvature"], function(t, e) {
            this[t + "At"] = function(t, n) {
                var i = this.getValues();
                return A.evaluate(i, n ? t : A.getParameterAt(i, t, 0), e)
            }, this[t] = function(t) {
                return A.evaluate(this.getValues(), t, e)
            }
        }, {
            beans: !1,
            getParameterAt: function(t, e) {
                return A.getParameterAt(this.getValues(), t, e)
            },
            getParameterOf: function() {
                var t = h.read(arguments);
                return A.getParameterOf(this.getValues(), t.x, t.y)
            },
            getLocationAt: function(t, e) {
                return e || (t = this.getParameterAt(t)), t >= 0 && 1 >= t && new O(this, t)
            },
            getLocationOf: function() {
                return this.getLocationAt(this.getParameterOf(h.read(arguments)), !0)
            },
            getOffsetOf: function() {
                var t = this.getLocationOf.apply(this, arguments);
                return t ? t.getOffset() : null
            },
            getNearestLocation: function() {
                function t(t) {
                    if (t >= 0 && 1 >= t) {
                        var i = e.getDistance(A.evaluate(n, t, 0), !0);
                        if (r > i) return r = i, s = t, !0
                    }
                }
                for (var e = h.read(arguments), n = this.getValues(), i = 100, r = 1 / 0, s = 0, a = 0; i >= a; a++) t(a / i);
                for (var o = 1 / (2 * i); o > 1e-6;) t(s - o) || t(s + o) || (o /= 2);
                var u = A.evaluate(n, s, 0);
                return new O(this, s, u, null, null, null, e.getDistance(u))
            },
            getNearestPoint: function() {
                return this.getNearestLocation.apply(this, arguments).getPoint()
            }
        }), new function() {
            function e(t) {
                var e = t[0],
                    n = t[1],
                    i = t[2],
                    r = t[3],
                    s = t[4],
                    a = t[5],
                    o = t[6],
                    h = t[7],
                    u = 9 * (i - s) + 3 * (o - e),
                    l = 6 * (e + s) - 12 * i,
                    c = 3 * (i - e),
                    d = 9 * (r - a) + 3 * (h - n),
                    f = 6 * (n + a) - 12 * r,
                    _ = 3 * (r - n);
                return function(t) {
                    var e = (u * t + l) * t + c,
                        n = (d * t + f) * t + _;
                    return Math.sqrt(e * e + n * n)
                }
            }

            function n(t, e) {
                return Math.max(2, Math.min(16, Math.ceil(32 * Math.abs(e - t))))
            }
            return {
                statics: !0,
                getLength: function(i, r, s) {
                    r === t && (r = 0), s === t && (s = 1);
                    var a = o.isZero;
                    if (0 === r && 1 === s && a(i[0] - i[2]) && a(i[1] - i[3]) && a(i[6] - i[4]) && a(i[7] - i[5])) {
                        var h = i[6] - i[0],
                            u = i[7] - i[1];
                        return Math.sqrt(h * h + u * u)
                    }
                    var l = e(i);
                    return o.integrate(l, r, s, n(r, s))
                },
                getParameterAt: function(i, r, s) {
                    function a(t) {
                        return _ += o.integrate(c, s, t, n(s, t)), s = t, _ - r
                    }
                    if (s === t && (s = 0 > r ? 1 : 0), 0 === r) return s;
                    var h = r > 0,
                        u = h ? s : 0,
                        l = h ? 1 : s,
                        c = e(i),
                        d = o.integrate(c, u, l, n(u, l));
                    if (Math.abs(r) >= d) return h ? l : u;
                    var f = r / d,
                        _ = 0;
                    return o.findRoot(a, c, s + f, u, l, 16, 1e-6)
                }
            }
        }, new function() {
            function t(t, e, n, i, r, s, a, o) {
                var h = new O(n, i, r, s, a, o);
                (!e || e(h)) && t.push(h)
            }

            function e(r, s, a, o, h, u, l, c, d, f, _, g, v) {
                if (!(v > 32)) {
                    var m, y, w, x = s[0],
                        b = s[1],
                        C = s[6],
                        S = s[7],
                        P = 1e-6,
                        k = p.getSignedDistance,
                        M = k(x, b, C, S, s[2], s[3]) || 0,
                        I = k(x, b, C, S, s[4], s[5]) || 0,
                        z = M * I > 0 ? .75 : 4 / 9,
                        O = z * Math.min(0, M, I),
                        T = z * Math.max(0, M, I),
                        L = k(x, b, C, S, r[0], r[1]),
                        E = k(x, b, C, S, r[2], r[3]),
                        N = k(x, b, C, S, r[4], r[5]),
                        j = k(x, b, C, S, r[6], r[7]);
                    if (x === C && P >= f - d && v > 3) y = m = (c + l) / 2, w = 0;
                    else {
                        var B, D, R = n(L, E, N, j),
                            F = R[0],
                            q = R[1];
                        if (B = i(F, q, O, T), F.reverse(), q.reverse(), D = i(F, q, O, T), null == B || null == D) return;
                        r = A.getPart(r, B, D), w = D - B, m = c * B + l * (1 - B), y = c * D + l * (1 - D)
                    }
                    if (_ > .5 && w > .5)
                        if (y - m > f - d) {
                            var V = A.subdivide(r, .5),
                                Z = m + (y - m) / 2;
                            e(s, V[0], o, a, h, u, d, f, m, Z, w, !g, ++v), e(s, V[1], o, a, h, u, d, f, Z, y, w, !g, v)
                        } else {
                            var V = A.subdivide(s, .5),
                                Z = d + (f - d) / 2;
                            e(V[0], r, o, a, h, u, d, Z, m, y, w, !g, ++v), e(V[1], r, o, a, h, u, Z, f, m, y, w, !g, v)
                        } else if (Math.max(f - d, y - m) < P) {
                        var U = m + (y - m) / 2,
                            H = d + (f - d) / 2;
                        g ? t(h, u, o, H, A.evaluate(s, H, 0), a, U, A.evaluate(r, U, 0)) : t(h, u, a, U, A.evaluate(r, U, 0), o, H, A.evaluate(s, H, 0))
                    } else w > 0 && e(s, r, o, a, h, u, d, f, m, y, w, !g, ++v)
                }
            }

            function n(t, e, n, i) {
                var r, s = [0, t],
                    a = [1 / 3, e],
                    o = [2 / 3, n],
                    h = [1, i],
                    u = p.getSignedDistance,
                    l = u(0, t, 1, i, 1 / 3, e),
                    c = u(0, t, 1, i, 2 / 3, n),
                    d = !1;
                if (0 > l * c) r = [
                    [s, a, h],
                    [s, o, h]
                ], d = 0 > l;
                else {
                    var f, _ = 0,
                        g = 0 === l || 0 === c;
                    Math.abs(l) > Math.abs(c) ? (f = a, _ = (i - n - (i - t) / 3) * (2 * (i - n) - i + e) / 3) : (f = o, _ = (e - t + (t - i) / 3) * (-2 * (t - e) + t - n) / 3), r = 0 > _ || g ? [
                        [s, f, h],
                        [s, h]
                    ] : [
                        [s, a, o, h],
                        [s, h]
                    ], d = l ? 0 > l : 0 > c
                }
                return d ? r.reverse() : r
            }

            function i(t, e, n, i) {
                return t[0][1] < n ? r(t, !0, n) : e[0][1] > i ? r(e, !1, i) : t[0][0]
            }

            function r(t, e, n) {
                for (var i = t[0][0], r = t[0][1], s = 1, a = t.length; a > s; s++) {
                    var o = t[s][0],
                        h = t[s][1];
                    if (e ? h >= n : n >= h) return i + (n - r) * (o - i) / (h - r);
                    i = o, r = h
                }
                return null
            }

            function s(e, n, i, r, s, a) {
                for (var o = A.isLinear(e), h = o ? n : e, u = o ? e : n, l = u[0], c = u[1], d = u[6], f = u[7], _ = d - l, g = f - c, p = Math.atan2(-g, _), v = Math.sin(p), m = Math.cos(p), y = _ * m - g * v, w = [0, 0, 0, 0, y, 0, y, 0], x = [], b = 0; 8 > b; b += 2) {
                    var C = h[b] - l,
                        S = h[b + 1] - c;
                    x.push(C * m - S * v, S * m + C * v)
                }
                for (var P = [], k = A.solveCubic(x, 1, 0, P, 0, 1), b = 0; k > b; b++) {
                    var M = P[b],
                        C = A.evaluate(x, M, 0).x;
                    if (C >= 0 && y >= C) {
                        var I = A.getParameterOf(w, C, 0),
                            z = o ? I : M,
                            O = o ? M : I;
                        t(s, a, i, z, A.evaluate(e, z, 0), r, O, A.evaluate(n, O, 0))
                    }
                }
            }

            function a(e, n, i, r, s, a) {
                var o = p.intersect(e[0], e[1], e[6], e[7], n[0], n[1], n[6], n[7]);
                if (o) {
                    var h = o.x,
                        u = o.y;
                    t(s, a, i, A.getParameterOf(e, h, u), o, r, A.getParameterOf(n, h, u), o)
                }
            }
            return {
                statics: {
                    getIntersections: function(n, i, r, o, h, u) {
                        var l = A.isLinear(n),
                            c = A.isLinear(i),
                            d = r.getPoint1(),
                            f = r.getPoint2(),
                            _ = o.getPoint1(),
                            g = o.getPoint2(),
                            p = 1e-6;
                        return d.isClose(_, p) && t(h, u, r, 0, d, o, 0, d), d.isClose(g, p) && t(h, u, r, 0, d, o, 1, d), (l && c ? a : l || c ? s : e)(n, i, r, o, h, u, 0, 1, 0, 1, 0, !1, 0), f.isClose(_, p) && t(h, u, r, 1, f, o, 0, f), f.isClose(g, p) && t(h, u, r, 1, f, o, 1, f), h
                    },
                    filterIntersections: function(t, e) {
                        function n(t, e) {
                            var n = t.getPath(),
                                i = e.getPath();
                            return n === i ? t.getIndex() + t.getParameter() - (e.getIndex() + e.getParameter()) : n._id - i._id
                        }
                        for (var i = t.length - 1, r = 1 - 1e-6, s = i; s >= 0; s--) {
                            var a = t[s],
                                o = a._curve.getNext(),
                                h = a._curve2.getNext();
                            o && a._parameter >= r && (a._parameter = 0, a._curve = o), h && a._parameter2 >= r && (a._parameter2 = 0, a._curve2 = h)
                        }
                        if (i > 0) {
                            t.sort(n);
                            for (var s = i; s > 0; s--) t[s].equals(t[s - 1]) && (t.splice(s, 1), i--)
                        }
                        if (e) {
                            for (var s = i; s >= 0; s--) t.push(t[s].getIntersection());
                            t.sort(n)
                        }
                        return t
                    }
                }
            }
        }),
        O = e.extend({
            _class: "CurveLocation",
            beans: !0,
            initialize: function ye(t, e, n, i, r, s, a) {
                this._id = ye._id = (ye._id || 0) + 1, this._curve = t, this._segment1 = t._segment1, this._segment2 = t._segment2, this._parameter = e, this._point = n, this._curve2 = i, this._parameter2 = r, this._point2 = s, this._distance = a
            },
            getSegment: function(t) {
                if (!this._segment) {
                    var e = this.getCurve(),
                        n = this.getParameter();
                    if (1 === n) this._segment = e._segment2;
                    else if (0 === n || t) this._segment = e._segment1;
                    else {
                        if (null == n) return null;
                        this._segment = e.getPartLength(0, n) < e.getPartLength(n, 1) ? e._segment1 : e._segment2
                    }
                }
                return this._segment
            },
            getCurve: function(t) {
                return (!this._curve || t) && (this._curve = this._segment1.getCurve(), null == this._curve.getParameterOf(this._point) && (this._curve = this._segment2.getPrevious().getCurve())), this._curve
            },
            getIntersection: function() {
                var t = this._intersection;
                if (!t && this._curve2) {
                    var e = this._parameter2;
                    this._intersection = t = new O(this._curve2, e, this._point2 || this._point, this), t._intersection = this
                }
                return t
            },
            getPath: function() {
                var t = this.getCurve();
                return t && t._path
            },
            getIndex: function() {
                var t = this.getCurve();
                return t && t.getIndex()
            },
            getOffset: function() {
                var t = this.getPath();
                return t ? t._getOffset(this) : this.getCurveOffset()
            },
            getCurveOffset: function() {
                var t = this.getCurve(),
                    e = this.getParameter();
                return null != e && t && t.getPartLength(0, e)
            },
            getParameter: function(t) {
                if ((null == this._parameter || t) && this._point) {
                    var e = this.getCurve(t);
                    this._parameter = e && e.getParameterOf(this._point)
                }
                return this._parameter
            },
            getPoint: function(t) {
                if ((!this._point || t) && null != this._parameter) {
                    var e = this.getCurve(t);
                    this._point = e && e.getPointAt(this._parameter, !0)
                }
                return this._point
            },
            getDistance: function() {
                return this._distance
            },
            divide: function() {
                var t = this.getCurve(!0);
                return t && t.divide(this.getParameter(!0), !0)
            },
            split: function() {
                var t = this.getCurve(!0);
                return t && t.split(this.getParameter(!0), !0)
            },
            equals: function(t) {
                var e = Math.abs,
                    n = 1e-6;
                return this === t || t && this._curve === t._curve && this._curve2 === t._curve2 && e(this._parameter - t._parameter) <= n && e(this._parameter2 - t._parameter2) <= n || !1
            },
            toString: function() {
                var t = [],
                    e = this.getPoint(),
                    n = a.instance;
                e && t.push("point: " + e);
                var i = this.getIndex();
                null != i && t.push("index: " + i);
                var r = this.getParameter();
                return null != r && t.push("parameter: " + n.number(r)), null != this._distance && t.push("distance: " + n.number(this._distance)), "{ " + t.join(", ") + " }"
            }
        }, e.each(["getTangent", "getNormal", "getCurvature"], function(t) {
            var e = t + "At";
            this[t] = function() {
                var t = this.getParameter(),
                    n = this.getCurve();
                return null != t && n && n[e](t, !0)
            }
        }, {})),
        T = w.extend({
            _class: "PathItem",
            initialize: function() {},
            getIntersections: function(e, n, i) {
                this === e && (e = null);
                var r = [],
                    s = this.getCurves(),
                    a = e ? e.getCurves() : s,
                    o = this._matrix.orNullIfIdentity(),
                    h = e ? (n || e._matrix).orNullIfIdentity() : o,
                    u = s.length,
                    l = e ? a.length : u,
                    c = [],
                    d = 1e-6,
                    f = 1 - d;
                if (e && !this.getBounds(o).touches(e.getBounds(h))) return [];
                for (var _ = 0; l > _; _++) c[_] = a[_].getValues(h);
                for (var _ = 0; u > _; _++) {
                    var g = s[_],
                        v = e ? g.getValues(o) : c[_];
                    if (!e) {
                        var m = g.getSegment1(),
                            y = g.getSegment2(),
                            w = m._handleOut,
                            x = y._handleIn;
                        if (new p(m._point.subtract(w), w.multiply(2), !0).intersect(new p(y._point.subtract(x), x.multiply(2), !0), !1)) {
                            var b = A.subdivide(v);
                            A.getIntersections(b[0], b[1], g, g, r, function(e) {
                                return e._parameter <= f ? (e._parameter /= 2, e._parameter2 = .5 + e._parameter2 / 2, !0) : t
                            })
                        }
                    }
                    for (var C = e ? 0 : _ + 1; l > C; C++) A.getIntersections(v, c[C], g, a[C], r, !e && (C === _ + 1 || C === l - 1 && 0 === _) && function(t) {
                        var e = t._parameter;
                        return e >= d && f >= e
                    })
                }
                return A.filterIntersections(r, i)
            },
            _asPathItem: function() {
                return this
            },
            setPathData: function(t) {
                function e(t, e) {
                    var n = +i[t];
                    return o && (n += u[e]), n
                }

                function n(t) {
                    return new h(e(t, "x"), e(t + 1, "y"))
                }
                var i, r, s, a = t.match(/[mlhvcsqtaz][^mlhvcsqtaz]*/gi),
                    o = !1,
                    u = new h,
                    l = new h;
                this.clear();
                for (var d = 0, f = a && a.length; f > d; d++) {
                    var _ = a[d],
                        g = _[0],
                        p = g.toLowerCase();
                    i = _.match(/[+-]?(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?/g);
                    var v = i && i.length;
                    switch (o = g === p, "z" !== r || /[mz]/.test(p) || this.moveTo(u = l), p) {
                        case "m":
                        case "l":
                            var m = "m" === p;
                            m && r && "z" !== r && this.closePath(!0);
                            for (var y = 0; v > y; y += 2) this[0 === y && m ? "moveTo" : "lineTo"](u = n(y));
                            s = u, m && (l = u);
                            break;
                        case "h":
                        case "v":
                            for (var w = "h" === p ? "x" : "y", y = 0; v > y; y++) u[w] = e(y, w), this.lineTo(u);
                            s = u;
                            break;
                        case "c":
                            for (var y = 0; v > y; y += 6) this.cubicCurveTo(n(y), s = n(y + 2), u = n(y + 4));
                            break;
                        case "s":
                            for (var y = 0; v > y; y += 4) this.cubicCurveTo(/[cs]/.test(r) ? u.multiply(2).subtract(s) : u, s = n(y), u = n(y + 2)), r = p;
                            break;
                        case "q":
                            for (var y = 0; v > y; y += 4) this.quadraticCurveTo(s = n(y), u = n(y + 2));
                            break;
                        case "t":
                            for (var y = 0; v > y; y += 2) this.quadraticCurveTo(s = /[qt]/.test(r) ? u.multiply(2).subtract(s) : u, u = n(y)), r = p;
                            break;
                        case "a":
                            for (var y = 0; v > y; y += 7) this.arcTo(u = n(y + 5), new c(+i[y], +i[y + 1]), +i[y + 2], +i[y + 4], +i[y + 3]);
                            break;
                        case "z":
                            this.closePath(!0)
                    }
                    r = p
                }
            },
            _canComposite: function() {
                return !(this.hasFill() && this.hasStroke())
            },
            _contains: function(t) {
                var e = this._getWinding(t, !1, !0);
                return !!("evenodd" === this.getWindingRule() ? 1 & e : e)
            }
        }),
        L = T.extend({
            _class: "Path",
            _serializeFields: {
                segments: [],
                closed: !1
            },
            initialize: function(e) {
                this._closed = !1, this._segments = [];
                var n = Array.isArray(e) ? "object" == typeof e[0] ? e : arguments : !e || e.size !== t || e.x === t && e.point === t ? null : arguments;
                n && n.length > 0 ? this.setSegments(n) : (this._curves = t, this._selectedSegmentState = 0, n || "string" != typeof e || (this.setPathData(e), e = null)), this._initialize(!n && e)
            },
            _equals: function(t) {
                return this._closed === t._closed && e.equals(this._segments, t._segments)
            },
            clone: function(e) {
                var n = new L(w.NO_INSERT);
                return n.setSegments(this._segments), n._closed = this._closed, this._clockwise !== t && (n._clockwise = this._clockwise), this._clone(n, e)
            },
            _changed: function we(e) {
                if (we.base.call(this, e), 8 & e) {
                    var n = this._parent;
                    if (n && (n._currentPath = t), this._length = this._clockwise = t, this._curves && !(16 & e))
                        for (var i = 0, r = this._curves.length; r > i; i++) this._curves[i]._changed();
                    this._monoCurves = t
                } else 32 & e && (this._bounds = t)
            },
            getStyle: function() {
                var t = this._parent;
                return (t instanceof E ? t : this)._style
            },
            getSegments: function() {
                return this._segments
            },
            setSegments: function(e) {
                var n = this.isFullySelected();
                this._segments.length = 0, this._selectedSegmentState = 0, this._curves = t, e && e.length > 0 && this._add(I.readAll(e)), n && this.setFullySelected(!0)
            },
            getFirstSegment: function() {
                return this._segments[0]
            },
            getLastSegment: function() {
                return this._segments[this._segments.length - 1]
            },
            getCurves: function() {
                var t = this._curves,
                    e = this._segments;
                if (!t) {
                    var n = this._countCurves();
                    t = this._curves = Array(n);
                    for (var i = 0; n > i; i++) t[i] = new A(this, e[i], e[i + 1] || e[0])
                }
                return t
            },
            getFirstCurve: function() {
                return this.getCurves()[0]
            },
            getLastCurve: function() {
                var t = this.getCurves();
                return t[t.length - 1]
            },
            isClosed: function() {
                return this._closed
            },
            setClosed: function(t) {
                if (this._closed != (t = !!t)) {
                    if (this._closed = t, this._curves) {
                        var e = this._curves.length = this._countCurves();
                        t && (this._curves[e - 1] = new A(this, this._segments[e - 1], this._segments[0]))
                    }
                    this._changed(25)
                }
            }
        }, {
            beans: !0,
            getPathData: function(t, e) {
                function n(e, n) {
                    e._transformCoordinates(t, g, !1), i = g[0], r = g[1], p ? (v.push("M" + _.pair(i, r)), p = !1) : (h = g[2], u = g[3], h === i && u === r && l === s && c === o ? n || v.push("l" + _.pair(i - s, r - o)) : v.push("c" + _.pair(l - s, c - o) + " " + _.pair(h - s, u - o) + " " + _.pair(i - s, r - o))), s = i, o = r, l = g[4], c = g[5]
                }
                var i, r, s, o, h, u, l, c, d = this._segments,
                    f = d.length,
                    _ = new a(e),
                    g = Array(6),
                    p = !0,
                    v = [];
                if (0 === f) return "";
                for (var m = 0; f > m; m++) n(d[m]);
                return this._closed && f > 0 && (n(d[0], !0), v.push("z")), v.join("")
            }
        }, {
            isEmpty: function() {
                return 0 === this._segments.length
            },
            isPolygon: function() {
                for (var t = 0, e = this._segments.length; e > t; t++)
                    if (!this._segments[t].isLinear()) return !1;
                return !0
            },
            _transformContent: function(t) {
                for (var e = Array(6), n = 0, i = this._segments.length; i > n; n++) this._segments[n]._transformCoordinates(t, e, !0);
                return !0
            },
            _add: function(t, e) {
                for (var n = this._segments, i = this._curves, r = t.length, s = null == e, e = s ? n.length : e, a = 0; r > a; a++) {
                    var o = t[a];
                    o._path && (o = t[a] = o.clone()), o._path = this, o._index = e + a, o._selectionState && this._updateSelection(o, 0, o._selectionState)
                }
                if (s) n.push.apply(n, t);
                else {
                    n.splice.apply(n, [e, 0].concat(t));
                    for (var a = e + r, h = n.length; h > a; a++) n[a]._index = a
                }
                if (i || t._curves) {
                    i || (i = this._curves = []);
                    var u = e > 0 ? e - 1 : e,
                        l = u,
                        c = Math.min(u + r, this._countCurves());
                    t._curves && (i.splice.apply(i, [u, 0].concat(t._curves)), l += t._curves.length);
                    for (var a = l; c > a; a++) i.splice(a, 0, new A(this, null, null));
                    this._adjustCurves(u, c)
                }
                return this._changed(25), t
            },
            _adjustCurves: function(t, e) {
                for (var n, i = this._segments, r = this._curves, s = t; e > s; s++) n = r[s], n._path = this, n._segment1 = i[s], n._segment2 = i[s + 1] || i[0], n._changed();
                (n = r[this._closed && 0 === t ? i.length - 1 : t - 1]) && (n._segment2 = i[t] || i[0], n._changed()), (n = r[e]) && (n._segment1 = i[e], n._changed())
            },
            _countCurves: function() {
                var t = this._segments.length;
                return !this._closed && t > 0 ? t - 1 : t
            },
            add: function(t) {
                return arguments.length > 1 && "number" != typeof t ? this._add(I.readAll(arguments)) : this._add([I.read(arguments)])[0]
            },
            insert: function(t, e) {
                return arguments.length > 2 && "number" != typeof e ? this._add(I.readAll(arguments, 1), t) : this._add([I.read(arguments, 1)], t)[0]
            },
            addSegment: function() {
                return this._add([I.read(arguments)])[0]
            },
            insertSegment: function(t) {
                return this._add([I.read(arguments, 1)], t)[0]
            },
            addSegments: function(t) {
                return this._add(I.readAll(t))
            },
            insertSegments: function(t, e) {
                return this._add(I.readAll(e), t)
            },
            removeSegment: function(t) {
                return this.removeSegments(t, t + 1)[0] || null
            },
            removeSegments: function(t, n, i) {
                t = t || 0, n = e.pick(n, this._segments.length);
                var r = this._segments,
                    s = this._curves,
                    a = r.length,
                    o = r.splice(t, n - t),
                    h = o.length;
                if (!h) return o;
                for (var u = 0; h > u; u++) {
                    var l = o[u];
                    l._selectionState && this._updateSelection(l, l._selectionState, 0), l._index = l._path = null
                }
                for (var u = t, c = r.length; c > u; u++) r[u]._index = u;
                if (s) {
                    var d = t > 0 && n === a + (this._closed ? 1 : 0) ? t - 1 : t,
                        s = s.splice(d, h);
                    i && (o._curves = s.slice(1)), this._adjustCurves(d, d)
                }
                return this._changed(25), o
            },
            clear: "#removeSegments",
            getLength: function() {
                if (null == this._length) {
                    var t = this.getCurves();
                    this._length = 0;
                    for (var e = 0, n = t.length; n > e; e++) this._length += t[e].getLength()
                }
                return this._length
            },
            getArea: function() {
                for (var t = this.getCurves(), e = 0, n = 0, i = t.length; i > n; n++) e += t[n].getArea();
                return e
            },
            isFullySelected: function() {
                var t = this._segments.length;
                return this._selected && t > 0 && this._selectedSegmentState === 7 * t
            },
            setFullySelected: function(t) {
                t && this._selectSegments(!0), this.setSelected(t)
            },
            setSelected: function xe(t) {
                t || this._selectSegments(!1), xe.base.call(this, t)
            },
            _selectSegments: function(t) {
                var e = this._segments.length;
                this._selectedSegmentState = t ? 7 * e : 0;
                for (var n = 0; e > n; n++) this._segments[n]._selectionState = t ? 7 : 0
            },
            _updateSelection: function(t, e, n) {
                t._selectionState = n;
                var i = this._selectedSegmentState += n - e;
                i > 0 && this.setSelected(!0)
            },
            flatten: function(t) {
                for (var e = new N(this, 64, .1), n = 0, i = e.length / Math.ceil(e.length / t), r = e.length + (this._closed ? -i : i) / 2, s = []; r >= n;) s.push(new I(e.evaluate(n, 0))), n += i;
                this.setSegments(s)
            },
            reduce: function() {
                for (var t = this.getCurves(), e = t.length - 1; e >= 0; e--) {
                    var n = t[e];
                    n.isLinear() && 0 === n.getLength() && n.remove()
                }
                return this
            },
            simplify: function(t) {
                if (this._segments.length > 2) {
                    var e = new j(this, t || 2.5);
                    this.setSegments(e.fit())
                }
            },
            split: function(t, e) {
                if (null === e) return null;
                if (1 === arguments.length) {
                    var n = t;
                    if ("number" == typeof n && (n = this.getLocationAt(n)), !n) return null;
                    t = n.index, e = n.parameter
                }
                var i = 1e-6;
                e >= 1 - i && (t++, e--);
                var r = this.getCurves();
                if (t >= 0 && t < r.length) {
                    e > i && r[t++].divide(e, !0);
                    var s, a = this.removeSegments(t, this._segments.length, !0);
                    return this._closed ? (this.setClosed(!1), s = this) : s = this._clone((new L).insertAbove(this, !0)), s._add(a, 0), this.addSegment(a[0]), s
                }
                return null
            },
            isClockwise: function() {
                return this._clockwise !== t ? this._clockwise : L.isClockwise(this._segments)
            },
            setClockwise: function(t) {
                this.isClockwise() != (t = !!t) && this.reverse(), this._clockwise = t
            },
            reverse: function() {
                this._segments.reverse();
                for (var e = 0, n = this._segments.length; n > e; e++) {
                    var i = this._segments[e],
                        r = i._handleIn;
                    i._handleIn = i._handleOut, i._handleOut = r, i._index = e
                }
                this._curves = null, this._clockwise !== t && (this._clockwise = !this._clockwise), this._changed(9)
            },
            join: function(t) {
                if (t) {
                    var e = t._segments,
                        n = this.getLastSegment(),
                        i = t.getLastSegment();
                    if (!i) return this;
                    n && n._point.equals(i._point) && t.reverse();
                    var r = t.getFirstSegment();
                    if (n && n._point.equals(r._point)) n.setHandleOut(r._handleOut), this._add(e.slice(1));
                    else {
                        var s = this.getFirstSegment();
                        s && s._point.equals(r._point) && t.reverse(), i = t.getLastSegment(), s && s._point.equals(i._point) ? (s.setHandleIn(i._handleIn), this._add(e.slice(0, e.length - 1), 0)) : this._add(e.slice())
                    }
                    t.closed && this._add([e[0]]), t.remove()
                }
                var a = this.getFirstSegment(),
                    o = this.getLastSegment();
                return a !== o && a._point.equals(o._point) && (a.setHandleIn(o._handleIn), o.remove(), this.setClosed(!0)), this
            },
            toShape: function(e) {
                function n(t, e) {
                    return d[t].isColinear(d[e])
                }

                function i(t) {
                    return d[t].isOrthogonal()
                }

                function r(t) {
                    return d[t].isArc()
                }

                function s(t, e) {
                    return d[t]._point.getDistance(d[e]._point)
                }
                if (!this._closed) return null;
                var a, h, u, l, d = this._segments;
                if (this.isPolygon() && 4 === d.length && n(0, 2) && n(1, 3) && i(1) ? (a = C.Rectangle, h = new c(s(0, 3), s(0, 1)), l = d[1]._point.add(d[2]._point).divide(2)) : 8 === d.length && r(0) && r(2) && r(4) && r(6) && n(1, 5) && n(3, 7) ? (a = C.Rectangle, h = new c(s(1, 6), s(0, 3)), u = h.subtract(new c(s(0, 7), s(1, 2))).divide(2), l = d[3]._point.add(d[4]._point).divide(2)) : 4 === d.length && r(0) && r(1) && r(2) && r(3) && (o.isZero(s(0, 2) - s(1, 3)) ? (a = C.Circle, u = s(0, 2) / 2) : (a = C.Ellipse, u = new c(s(2, 0) / 2, s(3, 1) / 2)), l = d[1]._point), a) {
                    var f = this.getPosition(!0),
                        _ = new a({
                            center: f,
                            size: h,
                            radius: u,
                            insert: !1
                        });
                    return _.rotate(l.subtract(f).getAngle() + 90), _.setStyle(this._style), (e || e === t) && _.insertAbove(this), _
                }
                return null
            },
            _hitTestSelf: function(t, e) {
                function n(e, n) {
                    return t.subtract(e).divide(n).length <= 1
                }

                function i(t, i, r) {
                    if (!e.selected || i.isSelected()) {
                        var s = t._point;
                        if (i !== s && (i = i.add(s)), n(i, w)) return new M(r, _, {
                            segment: t,
                            point: i
                        })
                    }
                }

                function r(t, n) {
                    return (n || e.segments) && i(t, t._point, "segment") || !n && e.handles && (i(t, t._handleIn, "handle-in") || i(t, t._handleOut, "handle-out"))
                }

                function s(t) {
                    c.add(t)
                }

                function a(e) {
                    if (("round" !== o || "round" !== u) && (c = new L({
                            internal: !0,
                            closed: !0
                        }), m || e._index > 0 && e._index < v - 1 ? "round" !== o && (e._handleIn.isZero() || e._handleOut.isZero()) && L._addBevelJoin(e, o, S, l, s, !0) : "round" !== u && L._addSquareCap(e, u, S, s, !0), !c.isEmpty())) {
                        var i;
                        return c.contains(t) || (i = c.getNearestLocation(t)) && n(i.getPoint(), y)
                    }
                    return n(e._point, w)
                }
                var o, u, l, c, d, f, _ = this,
                    g = this.getStyle(),
                    p = this._segments,
                    v = p.length,
                    m = this._closed,
                    y = e._tolerancePadding,
                    w = y,
                    x = e.stroke && g.hasStroke(),
                    b = e.fill && g.hasFill(),
                    C = e.curves,
                    S = x ? g.getStrokeWidth() / 2 : b && e.tolerance > 0 || C ? 0 : null;
                if (null !== S && (S > 0 ? (o = g.getStrokeJoin(), u = g.getStrokeCap(), l = S * g.getMiterLimit(), w = y.add(new h(S, S))) : o = u = "round"), !e.ends || e.segments || m) {
                    if (e.segments || e.handles)
                        for (var P = 0; v > P; P++)
                            if (f = r(p[P])) return f
                } else if (f = r(p[0], !0) || r(p[v - 1], !0)) return f;
                if (null !== S) {
                    if (d = this.getNearestLocation(t)) {
                        var k = d.getParameter();
                        0 === k || 1 === k && v > 1 ? a(d.getSegment()) || (d = null) : n(d.getPoint(), w) || (d = null)
                    }
                    if (!d && "miter" === o && v > 1)
                        for (var P = 0; v > P; P++) {
                            var I = p[P];
                            if (t.getDistance(I._point) <= l && a(I)) {
                                d = I.getLocation();
                                break
                            }
                        }
                }
                return !d && b && this._contains(t) || d && !x && !C ? new M("fill", this) : d ? new M(x ? "stroke" : "curve", this, {
                    location: d,
                    point: d.getPoint()
                }) : null
            }
        }, e.each(["getPoint", "getTangent", "getNormal", "getCurvature"], function(t) {
            this[t + "At"] = function(e, n) {
                var i = this.getLocationAt(e, n);
                return i && i[t]()
            }
        }, {
            beans: !1,
            _getOffset: function(t) {
                var e = t && t.getIndex();
                if (null != e) {
                    for (var n = this.getCurves(), i = 0, r = 0; e > r; r++) i += n[r].getLength();
                    var s = n[e],
                        a = t.getParameter();
                    return a > 0 && (i += s.getPartLength(0, a)), i
                }
                return null
            },
            getLocationOf: function() {
                for (var t = h.read(arguments), e = this.getCurves(), n = 0, i = e.length; i > n; n++) {
                    var r = e[n].getLocationOf(t);
                    if (r) return r
                }
                return null
            },
            getOffsetOf: function() {
                var t = this.getLocationOf.apply(this, arguments);
                return t ? t.getOffset() : null
            },
            getLocationAt: function(t, e) {
                var n = this.getCurves(),
                    i = 0;
                if (e) {
                    var r = ~~t;
                    return n[r].getLocationAt(t - r, !0)
                }
                for (var s = 0, a = n.length; a > s; s++) {
                    var o = i,
                        h = n[s];
                    if (i += h.getLength(), i > t) return h.getLocationAt(t - o)
                }
                return t <= this.getLength() ? new O(n[n.length - 1], 1) : null
            },
            getNearestLocation: function() {
                for (var t = h.read(arguments), e = this.getCurves(), n = 1 / 0, i = null, r = 0, s = e.length; s > r; r++) {
                    var a = e[r].getNearestLocation(t);
                    a._distance < n && (n = a._distance, i = a)
                }
                return i
            },
            getNearestPoint: function() {
                return this.getNearestLocation.apply(this, arguments).getPoint()
            }
        }), new function() {
            function t(t, e, n, i) {
                function r(e) {
                    var n = a[e],
                        i = a[e + 1];
                    (c != n || d != i) && (t.beginPath(), t.moveTo(c, d), t.lineTo(n, i), t.stroke(), t.beginPath(), t.arc(n, i, s, 0, 2 * Math.PI, !0), t.fill())
                }
                for (var s = i / 2, a = Array(6), o = 0, h = e.length; h > o; o++) {
                    var u = e[o];
                    u._transformCoordinates(n, a, !1);
                    var l = u._selectionState,
                        c = a[0],
                        d = a[1];
                    if (1 & l && r(2), 2 & l && r(4), t.fillRect(c - s, d - s, i, i), !(4 & l)) {
                        var f = t.fillStyle;
                        t.fillStyle = "#ffffff", t.fillRect(c - s + 1, d - s + 1, i - 2, i - 2), t.fillStyle = f
                    }
                }
            }

            function e(t, e, n) {
                function i(e) {
                    if (n) e._transformCoordinates(n, _, !1), r = _[0], s = _[1];
                    else {
                        var i = e._point;
                        r = i._x, s = i._y
                    }
                    if (g) t.moveTo(r, s), g = !1;
                    else {
                        if (n) h = _[2], u = _[3];
                        else {
                            var d = e._handleIn;
                            h = r + d._x, u = s + d._y
                        }
                        h === r && u === s && l === a && c === o ? t.lineTo(r, s) : t.bezierCurveTo(l, c, h, u, r, s)
                    }
                    if (a = r, o = s, n) l = _[4], c = _[5];
                    else {
                        var d = e._handleOut;
                        l = a + d._x, c = o + d._y
                    }
                }
                for (var r, s, a, o, h, u, l, c, d = e._segments, f = d.length, _ = Array(6), g = !0, p = 0; f > p; p++) i(d[p]);
                e._closed && f > 0 && i(d[0])
            }
            return {
                _draw: function(t, n, i) {
                    function r(t) {
                        return l[(t % c + c) % c]
                    }
                    var s = n.dontStart,
                        a = n.dontFinish || n.clip,
                        o = this.getStyle(),
                        h = o.hasFill(),
                        u = o.hasStroke(),
                        l = o.getDashArray(),
                        c = !paper.support.nativeDash && u && l && l.length;
                    if (s || t.beginPath(), !s && this._currentPath ? t.currentPath = this._currentPath : (h || u && !c || a) && (e(t, this, i), this._closed && t.closePath(), s || (this._currentPath = t.currentPath)), !a && (h || u) && (this._setStyles(t), h && (t.fill(o.getWindingRule()), t.shadowColor = "rgba(0,0,0,0)"), u)) {
                        if (c) {
                            s || t.beginPath();
                            var d, f = new N(this, 32, .25, i),
                                _ = f.length,
                                g = -o.getDashOffset(),
                                p = 0;
                            for (g %= _; g > 0;) g -= r(p--) + r(p--);
                            for (; _ > g;) d = g + r(p++), (g > 0 || d > 0) && f.drawPart(t, Math.max(g, 0), Math.max(d, 0)), g = d + r(p++)
                        }
                        t.stroke()
                    }
                },
                _drawSelected: function(n, i) {
                    n.beginPath(), e(n, this, i), n.stroke(), t(n, this._segments, i, paper.settings.handleSize)
                }
            }
        }, new function() {
            function t(t) {
                var e = t.length,
                    n = [],
                    i = [],
                    r = 2;
                n[0] = t[0] / r;
                for (var s = 1; e > s; s++) i[s] = 1 / r, r = (e - 1 > s ? 4 : 2) - i[s], n[s] = (t[s] - n[s - 1]) / r;
                for (var s = 1; e > s; s++) n[e - s - 1] -= i[e - s] * n[e - s];
                return n
            }
            return {
                smooth: function() {
                    var e = this._segments,
                        n = e.length,
                        i = this._closed,
                        r = n,
                        s = 0;
                    if (!(2 >= n)) {
                        i && (s = Math.min(n, 4), r += 2 * Math.min(n, s));
                        for (var a = [], o = 0; n > o; o++) a[o + s] = e[o]._point;
                        if (i)
                            for (var o = 0; s > o; o++) a[o] = e[o + n - s]._point, a[o + n + s] = e[o]._point;
                        else r--;
                        for (var u = [], o = 1; r - 1 > o; o++) u[o] = 4 * a[o]._x + 2 * a[o + 1]._x;
                        u[0] = a[0]._x + 2 * a[1]._x, u[r - 1] = 3 * a[r - 1]._x;
                        for (var l = t(u), o = 1; r - 1 > o; o++) u[o] = 4 * a[o]._y + 2 * a[o + 1]._y;
                        u[0] = a[0]._y + 2 * a[1]._y, u[r - 1] = 3 * a[r - 1]._y;
                        var c = t(u);
                        if (i) {
                            for (var o = 0, d = n; s > o; o++, d++) {
                                var f = o / s,
                                    _ = 1 - f,
                                    g = o + s,
                                    p = d + s;
                                l[d] = l[o] * f + l[d] * _, c[d] = c[o] * f + c[d] * _, l[p] = l[g] * _ + l[p] * f, c[p] = c[g] * _ + c[p] * f
                            }
                            r--
                        }
                        for (var v = null, o = s; r - s >= o; o++) {
                            var m = e[o - s];
                            v && m.setHandleIn(v.subtract(m._point)), r > o && (m.setHandleOut(new h(l[o], c[o]).subtract(m._point)), v = r - 1 > o ? new h(2 * a[o + 1]._x - l[o + 1], 2 * a[o + 1]._y - c[o + 1]) : new h((a[r]._x + l[r - 1]) / 2, (a[r]._y + c[r - 1]) / 2))
                        }
                        if (i && v) {
                            var m = this._segments[0];
                            m.setHandleIn(v.subtract(m._point))
                        }
                    }
                }
            }
        }, new function() {
            function t(t) {
                var e = t._segments;
                if (0 === e.length) throw Error("Use a moveTo() command first");
                return e[e.length - 1]
            }
            return {
                moveTo: function() {
                    var t = this._segments;
                    1 === t.length && this.removeSegment(0), t.length || this._add([new I(h.read(arguments))])
                },
                moveBy: function() {
                    throw Error("moveBy() is unsupported on Path items.")
                },
                lineTo: function() {
                    this._add([new I(h.read(arguments))])
                },
                cubicCurveTo: function() {
                    var e = h.read(arguments),
                        n = h.read(arguments),
                        i = h.read(arguments),
                        r = t(this);
                    r.setHandleOut(e.subtract(r._point)), this._add([new I(i, n.subtract(i))])
                },
                quadraticCurveTo: function() {
                    var e = h.read(arguments),
                        n = h.read(arguments),
                        i = t(this)._point;
                    this.cubicCurveTo(e.add(i.subtract(e).multiply(1 / 3)), e.add(n.subtract(e).multiply(1 / 3)), n)
                },
                curveTo: function() {
                    var n = h.read(arguments),
                        i = h.read(arguments),
                        r = e.pick(e.read(arguments), .5),
                        s = 1 - r,
                        a = t(this)._point,
                        o = n.subtract(a.multiply(s * s)).subtract(i.multiply(r * r)).divide(2 * r * s);
                    if (o.isNaN()) throw Error("Cannot put a curve through points with parameter = " + r);
                    this.quadraticCurveTo(o, i)
                },
                arcTo: function() {
                    var n, i, r, s, a, o = t(this),
                        u = o._point,
                        l = h.read(arguments),
                        d = e.peek(arguments),
                        f = e.pick(d, !0);
                    if ("boolean" == typeof f) var _ = u.add(l).divide(2),
                        n = _.add(_.subtract(u).rotate(f ? -90 : 90));
                    else if (e.remain(arguments) <= 2) n = l, l = h.read(arguments);
                    else {
                        var v = c.read(arguments);
                        if (v.isZero()) return this.lineTo(l);
                        var m = e.read(arguments),
                            f = !!e.read(arguments),
                            y = !!e.read(arguments),
                            _ = u.add(l).divide(2),
                            w = u.subtract(_).rotate(-m),
                            x = w.x,
                            b = w.y,
                            C = Math.abs,
                            S = 1e-12,
                            P = C(v.width),
                            k = C(v.height),
                            M = P * P,
                            z = k * k,
                            A = x * x,
                            O = b * b,
                            T = Math.sqrt(A / M + O / z);
                        if (T > 1 && (P *= T, k *= T, M = P * P, z = k * k), T = (M * z - M * O - z * A) / (M * O + z * A), C(T) < S && (T = 0), 0 > T) throw Error("Cannot create an arc with the given arguments");
                        i = new h(P * b / k, -k * x / P).multiply((y === f ? -1 : 1) * Math.sqrt(T)).rotate(m).add(_), a = (new g).translate(i).rotate(m).scale(P, k), s = a._inverseTransform(u), r = s.getDirectedAngle(a._inverseTransform(l)), !f && r > 0 ? r -= 360 : f && 0 > r && (r += 360)
                    }
                    if (n) {
                        var L = new p(u.add(n).divide(2), n.subtract(u).rotate(90), !0),
                            E = new p(n.add(l).divide(2), l.subtract(n).rotate(90), !0),
                            N = new p(u, l),
                            j = N.getSide(n);
                        if (i = L.intersect(E, !0), !i) {
                            if (!j) return this.lineTo(l);
                            throw Error("Cannot create an arc with the given arguments")
                        }
                        s = u.subtract(i), r = s.getDirectedAngle(l.subtract(i));
                        var B = N.getSide(i);
                        0 === B ? r = j * Math.abs(r) : j === B && (r += 0 > r ? 360 : -360)
                    }
                    for (var D = Math.abs(r), R = D >= 360 ? 4 : Math.ceil(D / 90), F = r / R, q = F * Math.PI / 360, V = 4 / 3 * Math.sin(q) / (1 + Math.cos(q)), Z = [], U = 0; R >= U; U++) {
                        var w = l,
                            H = null;
                        if (R > U && (H = s.rotate(90).multiply(V), a ? (w = a._transformPoint(s), H = a._transformPoint(s.add(H)).subtract(w)) : w = i.add(s)), 0 === U) o.setHandleOut(H);
                        else {
                            var W = s.rotate(-90).multiply(V);
                            a && (W = a._transformPoint(s.add(W)).subtract(w)), Z.push(new I(w, W, H))
                        }
                        s = s.rotate(F)
                    }
                    this._add(Z)
                },
                lineBy: function() {
                    var e = h.read(arguments),
                        n = t(this)._point;
                    this.lineTo(n.add(e))
                },
                curveBy: function() {
                    var n = h.read(arguments),
                        i = h.read(arguments),
                        r = e.read(arguments),
                        s = t(this)._point;
                    this.curveTo(s.add(n), s.add(i), r)
                },
                cubicCurveBy: function() {
                    var e = h.read(arguments),
                        n = h.read(arguments),
                        i = h.read(arguments),
                        r = t(this)._point;
                    this.cubicCurveTo(r.add(e), r.add(n), r.add(i))
                },
                quadraticCurveBy: function() {
                    var e = h.read(arguments),
                        n = h.read(arguments),
                        i = t(this)._point;
                    this.quadraticCurveTo(i.add(e), i.add(n))
                },
                arcBy: function() {
                    var n = t(this)._point,
                        i = n.add(h.read(arguments)),
                        r = e.pick(e.peek(arguments), !0);
                    "boolean" == typeof r ? this.arcTo(i, r) : this.arcTo(i, n.add(h.read(arguments)))
                },
                closePath: function(t) {
                    this.setClosed(!0), t && this.join()
                }
            }
        }, {
            _getBounds: function(t, e) {
                return L[t](this._segments, this._closed, this.getStyle(), e)
            },
            statics: {
                isClockwise: function(t) {
                    for (var e = 0, n = 0, i = t.length; i > n; n++) e += A.getEdgeSum(A.getValues(t[n], t[i > n + 1 ? n + 1 : 0]));
                    return e > 0
                },
                getBounds: function(t, e, n, i, r) {
                    function s(t) {
                        t._transformCoordinates(i, o, !1);
                        for (var e = 0; 2 > e; e++) A._addBounds(h[e], h[e + 4], o[e + 2], o[e], e, r ? r[e] : 0, u, l, c);
                        var n = h;
                        h = o, o = n
                    }
                    var a = t[0];
                    if (!a) return new f;
                    for (var o = Array(6), h = a._transformCoordinates(i, Array(6), !1), u = h.slice(0, 2), l = u.slice(), c = Array(2), d = 1, _ = t.length; _ > d; d++) s(t[d]);
                    return e && s(a), new f(u[0], u[1], l[0] - u[0], l[1] - u[1])
                },
                getStrokeBounds: function(t, e, n, i) {
                    function r(t) {
                        d = d.include(i ? i._transformPoint(t, t) : t)
                    }

                    function s(t) {
                        d = d.unite(v.setCenter(i ? i._transformPoint(t._point) : t._point))
                    }

                    function a(t, e) {
                        var n = t._handleIn,
                            i = t._handleOut;
                        "round" === e || !n.isZero() && !i.isZero() && n.isColinear(i) ? s(t) : L._addBevelJoin(t, e, u, p, r)
                    }

                    function o(t, e) {
                        "round" === e ? s(t) : L._addSquareCap(t, e, u, r)
                    }
                    if (!n.hasStroke()) return L.getBounds(t, e, n, i);
                    for (var h = t.length - (e ? 0 : 1), u = n.getStrokeWidth() / 2, l = L._getPenPadding(u, i), d = L.getBounds(t, e, n, i, l), _ = n.getStrokeJoin(), g = n.getStrokeCap(), p = u * n.getMiterLimit(), v = new f(new c(l).multiply(2)), m = 1; h > m; m++) a(t[m], _);
                    return e ? a(t[0], _) : h > 0 && (o(t[0], g), o(t[t.length - 1], g)), d
                },
                _getPenPadding: function(t, e) {
                    if (!e) return [t, t];
                    var n = e.shiftless(),
                        i = n.transform(new h(t, 0)),
                        r = n.transform(new h(0, t)),
                        s = i.getAngleInRadians(),
                        a = i.getLength(),
                        o = r.getLength(),
                        u = Math.sin(s),
                        l = Math.cos(s),
                        c = Math.tan(s),
                        d = -Math.atan(o * c / a),
                        f = Math.atan(o / (c * a));
                    return [Math.abs(a * Math.cos(d) * l - o * Math.sin(d) * u), Math.abs(o * Math.sin(f) * l + a * Math.cos(f) * u)]
                },
                _addBevelJoin: function(t, e, n, i, r, s) {
                    var a = t.getCurve(),
                        o = a.getPrevious(),
                        u = a.getPointAt(0, !0),
                        l = o.getNormalAt(1, !0),
                        c = a.getNormalAt(0, !0),
                        d = l.getDirectedAngle(c) < 0 ? -n : n;
                    if (l.setLength(d), c.setLength(d), s && (r(u), r(u.add(l))), "miter" === e) {
                        var f = new p(u.add(l), new h(-l.y, l.x), !0).intersect(new p(u.add(c), new h(-c.y, c.x), !0), !0);
                        if (f && u.getDistance(f) <= i && (r(f), !s)) return
                    }
                    s || r(u.add(l)), r(u.add(c))
                },
                _addSquareCap: function(t, e, n, i, r) {
                    var s = t._point,
                        a = t.getLocation(),
                        o = a.getNormal().normalize(n);
                    r && (i(s.subtract(o)), i(s.add(o))), "square" === e && (s = s.add(o.rotate(0 === a.getParameter() ? -90 : 90))), i(s.add(o)), i(s.subtract(o))
                },
                getHandleBounds: function(t, e, n, i, r, s) {
                    for (var a = Array(6), o = 1 / 0, h = -o, u = o, l = h, c = 0, d = t.length; d > c; c++) {
                        var _ = t[c];
                        _._transformCoordinates(i, a, !1);
                        for (var g = 0; 6 > g; g += 2) {
                            var p = 0 === g ? s : r,
                                v = p ? p[0] : 0,
                                m = p ? p[1] : 0,
                                y = a[g],
                                w = a[g + 1],
                                x = y - v,
                                b = y + v,
                                C = w - m,
                                S = w + m;
                            o > x && (o = x), b > h && (h = b), u > C && (u = C), S > l && (l = S)
                        }
                    }
                    return new f(o, u, h - o, l - u)
                },
                getRoughBounds: function(t, e, n, i) {
                    var r = n.hasStroke() ? n.getStrokeWidth() / 2 : 0,
                        s = r;
                    return r > 0 && ("miter" === n.getStrokeJoin() && (s = r * n.getMiterLimit()), "square" === n.getStrokeCap() && (s = Math.max(s, r * Math.sqrt(2)))), L.getHandleBounds(t, e, n, i, L._getPenPadding(r, i), L._getPenPadding(s, i))
                }
            }
        });
    L.inject({
        statics: new function() {
            function t(t, n, i) {
                var r = e.getNamed(i),
                    s = new L(r && r.insert === !1 && w.NO_INSERT);
                return s._add(t), s._closed = n, s.set(r)
            }

            function n(e, n, i) {
                for (var s = Array(4), a = 0; 4 > a; a++) {
                    var o = r[a];
                    s[a] = new I(o._point.multiply(n).add(e), o._handleIn.multiply(n), o._handleOut.multiply(n))
                }
                return t(s, !0, i)
            }
            var i = .5522847498307936,
                r = [new I([-1, 0], [0, i], [0, -i]), new I([0, -1], [-i, 0], [i, 0]), new I([1, 0], [0, -i], [0, i]), new I([0, 1], [i, 0], [-i, 0])];
            return {
                Line: function() {
                    return t([new I(h.readNamed(arguments, "from")), new I(h.readNamed(arguments, "to"))], !1, arguments)
                },
                Circle: function() {
                    var t = h.readNamed(arguments, "center"),
                        i = e.readNamed(arguments, "radius");
                    return n(t, new c(i), arguments)
                },
                Rectangle: function() {
                    var e, n = f.readNamed(arguments, "rectangle"),
                        r = c.readNamed(arguments, "radius", 0, {
                            readNull: !0
                        }),
                        s = n.getBottomLeft(!0),
                        a = n.getTopLeft(!0),
                        o = n.getTopRight(!0),
                        h = n.getBottomRight(!0);
                    if (!r || r.isZero()) e = [new I(s), new I(a), new I(o), new I(h)];
                    else {
                        r = c.min(r, n.getSize(!0).divide(2));
                        var u = r.width,
                            l = r.height,
                            d = u * i,
                            _ = l * i;
                        e = [new I(s.add(u, 0), null, [-d, 0]), new I(s.subtract(0, l), [0, _]), new I(a.add(0, l), null, [0, -_]), new I(a.add(u, 0), [-d, 0], null), new I(o.subtract(u, 0), null, [d, 0]), new I(o.add(0, l), [0, -_], null), new I(h.subtract(0, l), null, [0, _]), new I(h.subtract(u, 0), [d, 0])]
                    }
                    return t(e, !0, arguments)
                },
                RoundRectangle: "#Rectangle",
                Ellipse: function() {
                    var t = C._readEllipse(arguments);
                    return n(t.center, t.radius, arguments)
                },
                Oval: "#Ellipse",
                Arc: function() {
                    var t = h.readNamed(arguments, "from"),
                        n = h.readNamed(arguments, "through"),
                        i = h.readNamed(arguments, "to"),
                        r = e.getNamed(arguments),
                        s = new L(r && r.insert === !1 && w.NO_INSERT);
                    return s.moveTo(t), s.arcTo(n, i), s.set(r)
                },
                RegularPolygon: function() {
                    for (var n = h.readNamed(arguments, "center"), i = e.readNamed(arguments, "sides"), r = e.readNamed(arguments, "radius"), s = 360 / i, a = !(i % 3), o = new h(0, a ? -r : r), u = a ? -1 : .5, l = Array(i), c = 0; i > c; c++) l[c] = new I(n.add(o.rotate((c + u) * s)));
                    return t(l, !0, arguments)
                },
                Star: function() {
                    for (var n = h.readNamed(arguments, "center"), i = 2 * e.readNamed(arguments, "points"), r = e.readNamed(arguments, "radius1"), s = e.readNamed(arguments, "radius2"), a = 360 / i, o = new h(0, -1), u = Array(i), l = 0; i > l; l++) u[l] = new I(n.add(o.rotate(a * l).multiply(l % 2 ? s : r)));
                    return t(u, !0, arguments)
                }
            }
        }
    });
    var E = T.extend({
        _class: "CompoundPath",
        _serializeFields: {
            children: []
        },
        initialize: function(t) {
            this._children = [], this._namedChildren = {}, this._initialize(t) || ("string" == typeof t ? this.setPathData(t) : this.addChildren(Array.isArray(t) ? t : arguments))
        },
        insertChildren: function be(e, n, i) {
            n = be.base.call(this, e, n, i, L);
            for (var r = 0, s = !i && n && n.length; s > r; r++) {
                var a = n[r];
                a._clockwise === t && a.setClockwise(0 === a._index)
            }
            return n
        },
        reverse: function() {
            for (var t = this._children, e = 0, n = t.length; n > e; e++) t[e].reverse()
        },
        smooth: function() {
            for (var t = 0, e = this._children.length; e > t; t++) this._children[t].smooth()
        },
        reduce: function Ce() {
            if (0 === this._children.length) {
                var t = new L(w.NO_INSERT);
                return t.insertAbove(this), t.setStyle(this._style), this.remove(), t
            }
            return Ce.base.call(this)
        },
        isClockwise: function() {
            var t = this.getFirstChild();
            return t && t.isClockwise()
        },
        setClockwise: function(t) {
            this.isClockwise() !== !!t && this.reverse()
        },
        getFirstSegment: function() {
            var t = this.getFirstChild();
            return t && t.getFirstSegment()
        },
        getLastSegment: function() {
            var t = this.getLastChild();
            return t && t.getLastSegment()
        },
        getCurves: function() {
            for (var t = this._children, e = [], n = 0, i = t.length; i > n; n++) e.push.apply(e, t[n].getCurves());
            return e
        },
        getFirstCurve: function() {
            var t = this.getFirstChild();
            return t && t.getFirstCurve()
        },
        getLastCurve: function() {
            var t = this.getLastChild();
            return t && t.getFirstCurve()
        },
        getArea: function() {
            for (var t = this._children, e = 0, n = 0, i = t.length; i > n; n++) e += t[n].getArea();
            return e
        }
    }, {
        beans: !0,
        getPathData: function(t, e) {
            for (var n = this._children, i = [], r = 0, s = n.length; s > r; r++) {
                var a = n[r],
                    o = a._matrix;
                i.push(a.getPathData(t && !o.isIdentity() ? t.chain(o) : o, e))
            }
            return i.join(" ")
        }
    }, {
        _getChildHitTestOptions: function(t) {
            return t.class === L || "path" === t.type ? t : new e(t, {
                fill: !1
            })
        },
        _draw: function(t, e, n) {
            var i = this._children;
            if (0 !== i.length) {
                if (this._currentPath) t.currentPath = this._currentPath;
                else {
                    e = e.extend({
                        dontStart: !0,
                        dontFinish: !0
                    }), t.beginPath();
                    for (var r = 0, s = i.length; s > r; r++) i[r].draw(t, e, n);
                    this._currentPath = t.currentPath
                }
                if (!e.clip) {
                    this._setStyles(t);
                    var a = this._style;
                    a.hasFill() && (t.fill(a.getWindingRule()), t.shadowColor = "rgba(0,0,0,0)"), a.hasStroke() && t.stroke()
                }
            }
        },
        _drawSelected: function(t, e, n) {
            for (var i = this._children, r = 0, s = i.length; s > r; r++) {
                var a = i[r],
                    o = a._matrix;
                n[a._id] || a._drawSelected(t, o.isIdentity() ? e : e.chain(o))
            }
        }
    }, new function() {
        function t(t, e) {
            var n = t._children;
            if (e && 0 === n.length) throw Error("Use a moveTo() command first");
            return n[n.length - 1]
        }
        var n = {
            moveTo: function() {
                var e = t(this),
                    n = e && e.isEmpty() ? e : new L;
                n !== e && this.addChild(n), n.moveTo.apply(n, arguments)
            },
            moveBy: function() {
                var e = t(this, !0),
                    n = e && e.getLastSegment(),
                    i = h.read(arguments);
                this.moveTo(n ? i.add(n._point) : i)
            },
            closePath: function(e) {
                t(this, !0).closePath(e)
            }
        };
        return e.each(["lineTo", "cubicCurveTo", "quadraticCurveTo", "curveTo", "arcTo", "lineBy", "cubicCurveBy", "quadraticCurveBy", "curveBy", "arcBy"], function(e) {
            n[e] = function() {
                var n = t(this, !0);
                n[e].apply(n, arguments)
            }
        }), n
    });
    T.inject(new function() {
        function t(t, s, a) {
            function o(t) {
                return t.clone(!1).reduce().reorient().transform(null, !0, !0)
            }

            function h(t) {
                for (var e = 0, n = t.length; n > e; e++) {
                    var i = t[e];
                    f.push.apply(f, i._segments), _.push.apply(_, i._getMonoCurves())
                }
            }
            var u = r[a],
                l = o(t),
                c = s && t !== s && o(s);
            c && /^(subtract|exclude)$/.test(a) ^ c.isClockwise() !== l.isClockwise() && c.reverse(), e(l.getIntersections(c, null, !0));
            var d = [],
                f = [],
                _ = [],
                g = 1e-6;
            h(l._children || [l]), c && h(c._children || [c]), f.sort(function(t, e) {
                var n = t._intersection,
                    i = e._intersection;
                return !n && !i || n && i ? 0 : n ? -1 : 1
            });
            for (var p = 0, v = f.length; v > p; p++) {
                var y = f[p];
                if (null == y._winding) {
                    d.length = 0;
                    var x = y,
                        b = 0,
                        C = 0;
                    do {
                        var S = y.getCurve().getLength();
                        d.push({
                            segment: y,
                            length: S
                        }), b += S, y = y.getNext()
                    } while (y && !y._intersection && y !== x);
                    for (var P = 0; 3 > P; P++) {
                        var S = b * (P + 1) / 4;
                        for (k = 0, m = d.length; m > k; k++) {
                            var M = d[k],
                                I = M.length;
                            if (I >= S) {
                                (g >= S || g >= I - S) && (S = I / 2);
                                var z = M.segment.getCurve(),
                                    A = z.getPointAt(S),
                                    O = z.isLinear() && Math.abs(z.getTangentAt(.5, !0).y) <= g,
                                    T = z._path;
                                T._parent instanceof E && (T = T._parent), C += "subtract" === a && c && (T === l && c._getWinding(A, O) || T === c && !l._getWinding(A, O)) ? 0 : n(A, _, O);
                                break
                            }
                            S -= I
                        }
                    }
                    for (var L = Math.round(C / 3), P = d.length - 1; P >= 0; P--) d[P].segment._winding = L
                }
            }
            var N = new E(w.NO_INSERT);
            return N.insertAbove(t), N.addChildren(i(f, u), !0), N = N.reduce(), N.setStyle(t._style), N
        }

        function e(t) {
            function e() {
                for (var t = 0, e = n.length; e > t; t++) n[t].set(0, 0)
            }
            for (var n, i, r, s = 1e-6, a = 1 - s, o = t.length - 1; o >= 0; o--) {
                var h = t[o],
                    u = h._parameter;
                r && r._curve === h._curve && r._parameter > 0 ? u /= r._parameter : (i = h._curve, n && e(), n = i.isLinear() ? [i._segment1._handleOut, i._segment2._handleIn] : null);
                var l, c;
                (l = i.divide(u, !0, !0)) ? (c = l._segment1, i = l.getPrevious(), n && n.push(c._handleOut, c._handleIn)) : c = s > u ? i._segment1 : u > a ? i._segment2 : i.getPartLength(0, u) < i.getPartLength(u, 1) ? i._segment1 : i._segment2, c._intersection = h.getIntersection(), h._segment = c, r = h
            }
            n && e()
        }

        function n(t, e, i, r) {
            var s = 1e-6,
                a = s,
                u = 1 - a,
                l = t.x,
                c = t.y,
                d = 0,
                f = 0,
                _ = [],
                g = Math.abs;
            if (i) {
                for (var p = -1 / 0, v = 1 / 0, m = c - s, y = c + s, w = 0, x = e.length; x > w; w++) {
                    var b = e[w].values;
                    if (A.solveCubic(b, 0, l, _, 0, 1) > 0)
                        for (var C = _.length - 1; C >= 0; C--) {
                            var S = A.evaluate(b, _[C], 0).y;
                            m > S && S > p ? p = S : S > y && v > S && (v = S)
                        }
                }
                p = (p + c) / 2, v = (v + c) / 2, p > -1 / 0 && (d = n(new h(l, p), e)), 1 / 0 > v && (f = n(new h(l, v), e))
            } else
                for (var P = l - s, k = l + s, w = 0, x = e.length; x > w; w++) {
                    var M, I, z = e[w],
                        b = z.values,
                        O = z.winding;
                    if (O && (1 === O && c >= b[1] && c <= b[7] || c >= b[7] && c <= b[1]) && 1 === A.solveCubic(b, 1, c, _, 0, 1)) {
                        var T = _[0],
                            L = A.evaluate(b, T, 0).x,
                            E = A.evaluate(b, T, 1).y;
                        T > u && (w === x - 1 || z.next !== e[w + 1]) && g(A.evaluate(z.next.values, 0, 0).x - L) <= s || w > 0 && z.previous === e[w - 1] && g(I - L) < s && M > u && a > T || (o.isZero(E) && !A.isLinear(b) || a > T && E * A.evaluate(z.previous.values, 1, 1).y < 0 || T > u && E * A.evaluate(z.next.values, 0, 1).y < 0 ? r && L >= P && k >= L && (++d, ++f) : P >= L ? d += O : L >= k && (f += O)), M = T, I = L
                    }
                }
            return Math.max(g(d), g(f))
        }

        function i(t, e, n) {
            for (var i, r, s = [], a = 1e-6, o = 1 - a, h = 0, u = t.length; u > h; h++)
                if (i = r = t[h], !i._visited && e(i._winding)) {
                    var l = new L(w.NO_INSERT),
                        c = i._intersection,
                        d = c && c._segment,
                        f = !1,
                        _ = 1;
                    do {
                        var g, p = _ > 0 ? i._handleIn : i._handleOut,
                            v = _ > 0 ? i._handleOut : i._handleIn;
                        if (f && (!e(i._winding) || n) && (c = i._intersection) && (g = c._segment) && g !== r) {
                            if (n) i._visited = g._visited, i = g, _ = 1;
                            else {
                                var m = i.getCurve();
                                _ > 0 && (m = m.getPrevious());
                                var y = m.getTangentAt(1 > _ ? a : o, !0),
                                    x = g.getCurve(),
                                    b = x.getPrevious(),
                                    C = b.getTangentAt(o, !0),
                                    S = x.getTangentAt(a, !0),
                                    P = y.cross(C),
                                    k = y.cross(S);
                                if (0 !== P * k) {
                                    var M = k > P ? b : x,
                                        z = e(M._segment1._winding) ? M : k > P ? x : b,
                                        A = z._segment1;
                                    _ = z === b ? -1 : 1, A._visited && i._path !== A._path || !e(A._winding) ? _ = 1 : (i._visited = g._visited, i = g, A._visited && (_ = 1))
                                } else _ = 1
                            }
                            v = _ > 0 ? i._handleOut : i._handleIn
                        }
                        l.add(new I(i._point, f && p, v)), f = !0, i._visited = !0, i = _ > 0 ? i.getNext() : i.getPrevious()
                    } while (i && !i._visited && i !== r && i !== d && (i._intersection || e(i._winding)));
                    !i || i !== r && i !== d ? l.lastSegment._handleOut.set(0, 0) : (l.firstSegment.setHandleIn((i === d ? d : i)._handleIn), l.setClosed(!0)), l._segments.length > (l._closed ? l.isPolygon() ? 2 : 0 : 1) && s.push(l)
                }
            return s
        }
        var r = {
            unite: function(t) {
                return 1 === t || 0 === t
            },
            intersect: function(t) {
                return 2 === t
            },
            subtract: function(t) {
                return 1 === t
            },
            exclude: function(t) {
                return 1 === t
            }
        };
        return {
            _getWinding: function(t, e, i) {
                return n(t, this._getMonoCurves(), e, i)
            },
            unite: function(e) {
                return t(this, e, "unite")
            },
            intersect: function(e) {
                return t(this, e, "intersect")
            },
            subtract: function(e) {
                return t(this, e, "subtract")
            },
            exclude: function(e) {
                return t(this, e, "exclude")
            },
            divide: function(t) {
                return new x([this.subtract(t), this.intersect(t)])
            }
        }
    }), L.inject({
        _getMonoCurves: function() {
            function t(t) {
                var e = t[1],
                    r = t[7],
                    s = {
                        values: t,
                        winding: e === r ? 0 : e > r ? -1 : 1,
                        previous: n,
                        next: null
                    };
                n && (n.next = s), i.push(s), n = s
            }

            function e(e) {
                if (0 !== A.getLength(e)) {
                    var n = e[1],
                        i = e[3],
                        r = e[5],
                        s = e[7];
                    if (A.isLinear(e)) t(e);
                    else {
                        var a = 3 * (i - r) - n + s,
                            h = 2 * (n + r) - 4 * i,
                            u = i - n,
                            l = 1e-6,
                            c = [],
                            d = o.solveQuadratic(a, h, u, c, l, 1 - l);
                        if (0 === d) t(e);
                        else {
                            c.sort();
                            var f = c[0],
                                _ = A.subdivide(e, f);
                            t(_[0]), d > 1 && (f = (c[1] - f) / (1 - f), _ = A.subdivide(_[1], f), t(_[0])), t(_[1])
                        }
                    }
                }
            }
            var n, i = this._monoCurves;
            if (!i) {
                i = this._monoCurves = [];
                for (var r = this.getCurves(), s = this._segments, a = 0, h = r.length; h > a; a++) e(r[a].getValues());
                if (!this._closed && s.length > 1) {
                    var u = s[s.length - 1]._point,
                        l = s[0]._point,
                        c = u._x,
                        d = u._y,
                        f = l._x,
                        _ = l._y;
                    e([c, d, c, d, f, _, f, _])
                }
                if (i.length > 0) {
                    var g = i[0],
                        p = i[i.length - 1];
                    g.previous = p, p.next = g
                }
            }
            return i
        },
        getInteriorPoint: function() {
            var t = this.getBounds(),
                e = t.getCenter(!0);
            if (!this.contains(e)) {
                for (var n = this._getMonoCurves(), i = [], r = e.y, s = [], a = 0, o = n.length; o > a; a++) {
                    var h = n[a].values;
                    if ((1 === n[a].winding && r >= h[1] && r <= h[7] || r >= h[7] && r <= h[1]) && A.solveCubic(h, 1, r, i, 0, 1) > 0)
                        for (var u = i.length - 1; u >= 0; u--) s.push(A.evaluate(h, i[u], 0).x);
                    if (s.length > 1) break
                }
                e.x = (s[0] + s[1]) / 2
            }
            return e
        },
        reorient: function() {
            return this.setClockwise(!0), this
        }
    }), E.inject({
        _getMonoCurves: function() {
            for (var t = this._children, e = [], n = 0, i = t.length; i > n; n++) e.push.apply(e, t[n]._getMonoCurves());
            return e
        },
        reorient: function() {
            var t = this.removeChildren().sort(function(t, e) {
                return e.getBounds().getArea() - t.getBounds().getArea()
            });
            if (t.length > 0) {
                this.addChildren(t);
                for (var e = t[0].isClockwise(), n = 1, i = t.length; i > n; n++) {
                    for (var r = t[n].getInteriorPoint(), s = 0, a = n - 1; a >= 0; a--) t[a].contains(r) && s++;
                    t[n].setClockwise(0 === s % 2 && e)
                }
            }
            return this
        }
    });
    var N = e.extend({
            _class: "PathIterator",
            initialize: function(t, e, n, i) {
                function r(t, e) {
                    var n = A.getValues(t, e, i);
                    o.push(n), s(n, t._index, 0, 1)
                }

                function s(t, e, i, r) {
                    if (r - i > l && !A.isFlatEnough(t, n || .25)) {
                        var a = A.subdivide(t),
                            o = (i + r) / 2;
                        s(a[0], e, i, o), s(a[1], e, o, r)
                    } else {
                        var c = t[6] - t[0],
                            d = t[7] - t[1],
                            f = Math.sqrt(c * c + d * d);
                        f > 1e-6 && (u += f, h.push({
                            offset: u,
                            value: r,
                            index: e
                        }))
                    }
                }
                for (var a, o = [], h = [], u = 0, l = 1 / (e || 32), c = t._segments, d = c[0], f = 1, _ = c.length; _ > f; f++) a = c[f], r(d, a), d = a;
                t._closed && r(a, c[0]), this.curves = o, this.parts = h, this.length = u, this.index = 0
            },
            getParameterAt: function(t) {
                for (var e, n = this.index; e = n, !(0 == n || this.parts[--n].offset < t););
                for (var i = this.parts.length; i > e; e++) {
                    var r = this.parts[e];
                    if (r.offset >= t) {
                        this.index = e;
                        var s = this.parts[e - 1],
                            a = s && s.index == r.index ? s.value : 0,
                            o = s ? s.offset : 0;
                        return {
                            value: a + (r.value - a) * (t - o) / (r.offset - o),
                            index: r.index
                        }
                    }
                }
                var r = this.parts[this.parts.length - 1];
                return {
                    value: 1,
                    index: r.index
                }
            },
            evaluate: function(t, e) {
                var n = this.getParameterAt(t);
                return A.evaluate(this.curves[n.index], n.value, e)
            },
            drawPart: function(t, e, n) {
                e = this.getParameterAt(e), n = this.getParameterAt(n);
                for (var i = e.index; i <= n.index; i++) {
                    var r = A.getPart(this.curves[i], i == e.index ? e.value : 0, i == n.index ? n.value : 1);
                    i == e.index && t.moveTo(r[0], r[1]), t.bezierCurveTo.apply(t, r.slice(2))
                }
            }
        }, e.each(["getPoint", "getTangent", "getNormal", "getCurvature"], function(t, e) {
            this[t + "At"] = function(t) {
                return this.evaluate(t, e)
            }
        }, {})),
        j = e.extend({
            initialize: function(t, e) {
                for (var n, i = this.points = [], r = t._segments, s = 0, a = r.length; a > s; s++) {
                    var o = r[s].point.clone();
                    n && n.equals(o) || (i.push(o), n = o)
                }
                t._closed && (this.closed = !0, i.unshift(i[i.length - 1]), i.push(i[1])), this.error = e
            },
            fit: function() {
                var t = this.points,
                    e = t.length,
                    n = this.segments = e > 0 ? [new I(t[0])] : [];
                return e > 1 && this.fitCubic(0, e - 1, t[1].subtract(t[0]).normalize(), t[e - 2].subtract(t[e - 1]).normalize()), this.closed && (n.shift(), n.pop()), n
            },
            fitCubic: function(e, n, i, r) {
                if (1 == n - e) {
                    var s = this.points[e],
                        a = this.points[n],
                        o = s.getDistance(a) / 3;
                    return this.addCurve([s, s.add(i.normalize(o)), a.add(r.normalize(o)), a]), t
                }
                for (var h, u = this.chordLengthParameterize(e, n), l = Math.max(this.error, this.error * this.error), c = 0; 4 >= c; c++) {
                    var d = this.generateBezier(e, n, u, i, r),
                        f = this.findMaxError(e, n, d, u);
                    if (f.error < this.error) return this.addCurve(d), t;
                    if (h = f.index, f.error >= l) break;
                    this.reparameterize(e, n, u, d), l = f.error
                }
                var _ = this.points[h - 1].subtract(this.points[h]),
                    g = this.points[h].subtract(this.points[h + 1]),
                    p = _.add(g).divide(2).normalize();
                this.fitCubic(e, h, i, p), this.fitCubic(h, n, p.negate(), r)
            },
            addCurve: function(t) {
                var e = this.segments[this.segments.length - 1];
                e.setHandleOut(t[1].subtract(t[0])), this.segments.push(new I(t[3], t[2].subtract(t[3])))
            },
            generateBezier: function(t, e, n, i, r) {
                for (var s = 1e-12, a = this.points[t], o = this.points[e], h = [
                        [0, 0],
                        [0, 0]
                    ], u = [0, 0], l = 0, c = e - t + 1; c > l; l++) {
                    var d = n[l],
                        f = 1 - d,
                        _ = 3 * d * f,
                        g = f * f * f,
                        p = _ * f,
                        v = _ * d,
                        m = d * d * d,
                        y = i.normalize(p),
                        w = r.normalize(v),
                        x = this.points[t + l].subtract(a.multiply(g + p)).subtract(o.multiply(v + m));
                    h[0][0] += y.dot(y), h[0][1] += y.dot(w), h[1][0] = h[0][1], h[1][1] += w.dot(w), u[0] += y.dot(x), u[1] += w.dot(x)
                }
                var b, C, S = h[0][0] * h[1][1] - h[1][0] * h[0][1];
                if (Math.abs(S) > s) {
                    var P = h[0][0] * u[1] - h[1][0] * u[0],
                        k = u[0] * h[1][1] - u[1] * h[0][1];
                    b = k / S, C = P / S
                } else {
                    var M = h[0][0] + h[0][1],
                        I = h[1][0] + h[1][1];
                    b = C = Math.abs(M) > s ? u[0] / M : Math.abs(I) > s ? u[1] / I : 0
                }
                var z = o.getDistance(a);
                return s *= z, (s > b || s > C) && (b = C = z / 3), [a, a.add(i.normalize(b)), o.add(r.normalize(C)), o]
            },
            reparameterize: function(t, e, n, i) {
                for (var r = t; e >= r; r++) n[r - t] = this.findRoot(i, this.points[r], n[r - t])
            },
            findRoot: function(t, e, n) {
                for (var i = [], r = [], s = 0; 2 >= s; s++) i[s] = t[s + 1].subtract(t[s]).multiply(3);
                for (var s = 0; 1 >= s; s++) r[s] = i[s + 1].subtract(i[s]).multiply(2);
                var a = this.evaluate(3, t, n),
                    o = this.evaluate(2, i, n),
                    h = this.evaluate(1, r, n),
                    u = a.subtract(e),
                    l = o.dot(o) + u.dot(h);
                return Math.abs(l) < 1e-6 ? n : n - u.dot(o) / l
            },
            evaluate: function(t, e, n) {
                for (var i = e.slice(), r = 1; t >= r; r++)
                    for (var s = 0; t - r >= s; s++) i[s] = i[s].multiply(1 - n).add(i[s + 1].multiply(n));
                return i[0]
            },
            chordLengthParameterize: function(t, e) {
                for (var n = [0], i = t + 1; e >= i; i++) n[i - t] = n[i - t - 1] + this.points[i].getDistance(this.points[i - 1]);
                for (var i = 1, r = e - t; r >= i; i++) n[i] /= n[r];
                return n
            },
            findMaxError: function(t, e, n, i) {
                for (var r = Math.floor((e - t + 1) / 2), s = 0, a = t + 1; e > a; a++) {
                    var o = this.evaluate(3, n, i[a - t]),
                        h = o.subtract(this.points[a]),
                        u = h.x * h.x + h.y * h.y;
                    u >= s && (s = u, r = a)
                }
                return {
                    error: s,
                    index: r
                }
            }
        }),
        B = w.extend({
            _class: "TextItem",
            _boundsSelected: !0,
            _applyMatrix: !1,
            _canApplyMatrix: !1,
            _serializeFields: {
                content: null
            },
            _boundsGetter: "getBounds",
            initialize: function(n) {
                this._content = "", this._lines = [];
                var i = n && e.isPlainObject(n) && n.x === t && n.y === t;
                this._initialize(i && n, !i && h.read(arguments))
            },
            _equals: function(t) {
                return this._content === t._content
            },
            _clone: function Se(t, e) {
                return t.setContent(this._content), Se.base.call(this, t, e)
            },
            getContent: function() {
                return this._content
            },
            setContent: function(t) {
                this._content = "" + t, this._lines = this._content.split(/\r\n|\n|\r/gm), this._changed(265)
            },
            isEmpty: function() {
                return !this._content
            },
            getCharacterStyle: "#getStyle",
            setCharacterStyle: "#setStyle",
            getParagraphStyle: "#getStyle",
            setParagraphStyle: "#setStyle"
        }),
        D = B.extend({
            _class: "PointText",
            initialize: function() {
                B.apply(this, arguments)
            },
            clone: function(t) {
                return this._clone(new D(w.NO_INSERT), t)
            },
            getPoint: function() {
                var t = this._matrix.getTranslation();
                return new u(t.x, t.y, this, "setPoint")
            },
            setPoint: function() {
                var t = h.read(arguments);
                this.translate(t.subtract(this._matrix.getTranslation()))
            },
            _draw: function(t) {
                if (this._content) {
                    this._setStyles(t);
                    var e = this._style,
                        n = this._lines,
                        i = e.getLeading(),
                        r = t.shadowColor;
                    t.font = e.getFontStyle(), t.textAlign = e.getJustification();
                    for (var s = 0, a = n.length; a > s; s++) {
                        t.shadowColor = r;
                        var o = n[s];
                        e.hasFill() && (t.fillText(o, 0, 0), t.shadowColor = "rgba(0,0,0,0)"), e.hasStroke() && t.strokeText(o, 0, 0), t.translate(0, i)
                    }
                }
            },
            _getBounds: function(t, e) {
                var n = this._style,
                    i = this._lines,
                    r = i.length,
                    s = n.getJustification(),
                    a = n.getLeading(),
                    o = this.getView().getTextWidth(n.getFontStyle(), i),
                    h = 0;
                "left" !== s && (h -= o / ("center" === s ? 2 : 1));
                var u = new f(h, r ? -.75 * a : 0, o, r * a);
                return e ? e._transformBounds(u, u) : u
            }
        }),
        R = e.extend(new function() {
            function t(t) {
                var e, i = t.match(/^#(\w{1,2})(\w{1,2})(\w{1,2})$/);
                if (i) {
                    e = [0, 0, 0];
                    for (var r = 0; 3 > r; r++) {
                        var a = i[r + 1];
                        e[r] = parseInt(1 == a.length ? a + a : a, 16) / 255
                    }
                } else if (i = t.match(/^rgba?\((.*)\)$/)) {
                    e = i[1].split(",");
                    for (var r = 0, o = e.length; o > r; r++) {
                        var a = +e[r];
                        e[r] = 3 > r ? a / 255 : a
                    }
                } else {
                    var h = s[t];
                    if (!h) {
                        n || (n = te.getContext(1, 1), n.globalCompositeOperation = "copy"), n.fillStyle = "rgba(0,0,0,0)", n.fillStyle = t, n.fillRect(0, 0, 1, 1);
                        var u = n.getImageData(0, 0, 1, 1).data;
                        h = s[t] = [u[0] / 255, u[1] / 255, u[2] / 255]
                    }
                    e = h.slice()
                }
                return e
            }
            var n, i = {
                    gray: ["gray"],
                    rgb: ["red", "green", "blue"],
                    hsb: ["hue", "saturation", "brightness"],
                    hsl: ["hue", "saturation", "lightness"],
                    gradient: ["gradient", "origin", "destination", "highlight"]
                },
                r = {},
                s = {},
                o = [
                    [0, 3, 1],
                    [2, 0, 1],
                    [1, 0, 3],
                    [1, 2, 0],
                    [3, 1, 0],
                    [0, 1, 2]
                ],
                u = {
                    "rgb-hsb": function(t, e, n) {
                        var i = Math.max(t, e, n),
                            r = Math.min(t, e, n),
                            s = i - r,
                            a = 0 === s ? 0 : 60 * (i == t ? (e - n) / s + (n > e ? 6 : 0) : i == e ? (n - t) / s + 2 : (t - e) / s + 4);
                        return [a, 0 === i ? 0 : s / i, i]
                    },
                    "hsb-rgb": function(t, e, n) {
                        t = (t / 60 % 6 + 6) % 6;
                        var i = Math.floor(t),
                            r = t - i,
                            i = o[i],
                            s = [n, n * (1 - e), n * (1 - e * r), n * (1 - e * (1 - r))];
                        return [s[i[0]], s[i[1]], s[i[2]]]
                    },
                    "rgb-hsl": function(t, e, n) {
                        var i = Math.max(t, e, n),
                            r = Math.min(t, e, n),
                            s = i - r,
                            a = 0 === s,
                            o = a ? 0 : 60 * (i == t ? (e - n) / s + (n > e ? 6 : 0) : i == e ? (n - t) / s + 2 : (t - e) / s + 4),
                            h = (i + r) / 2,
                            u = a ? 0 : .5 > h ? s / (i + r) : s / (2 - i - r);
                        return [o, u, h]
                    },
                    "hsl-rgb": function(t, e, n) {
                        if (t = (t / 360 % 1 + 1) % 1, 0 === e) return [n, n, n];
                        for (var i = [t + 1 / 3, t, t - 1 / 3], r = .5 > n ? n * (1 + e) : n + e - n * e, s = 2 * n - r, a = [], o = 0; 3 > o; o++) {
                            var h = i[o];
                            0 > h && (h += 1), h > 1 && (h -= 1), a[o] = 1 > 6 * h ? s + 6 * (r - s) * h : 1 > 2 * h ? r : 2 > 3 * h ? s + 6 * (r - s) * (2 / 3 - h) : s
                        }
                        return a
                    },
                    "rgb-gray": function(t, e, n) {
                        return [.2989 * t + .587 * e + .114 * n]
                    },
                    "gray-rgb": function(t) {
                        return [t, t, t]
                    },
                    "gray-hsb": function(t) {
                        return [0, 0, t]
                    },
                    "gray-hsl": function(t) {
                        return [0, 0, t]
                    },
                    "gradient-rgb": function() {
                        return []
                    },
                    "rgb-gradient": function() {
                        return []
                    }
                };
            return e.each(i, function(t, n) {
                r[n] = [], e.each(t, function(t, s) {
                    var a = e.capitalize(t),
                        o = /^(hue|saturation)$/.test(t),
                        u = r[n][s] = "gradient" === t ? function(t) {
                            var e = this._components[0];
                            return t = F.read(Array.isArray(t) ? t : arguments, 0, {
                                readNull: !0
                            }), e !== t && (e && e._removeOwner(this), t && t._addOwner(this)), t
                        } : "gradient" === n ? function() {
                            return h.read(arguments, 0, {
                                readNull: "highlight" === t,
                                clone: !0
                            })
                        } : function(t) {
                            return null == t || isNaN(t) ? 0 : t
                        };
                    this["get" + a] = function() {
                        return this._type === n || o && /^hs[bl]$/.test(this._type) ? this._components[s] : this._convert(n)[s]
                    }, this["set" + a] = function(t) {
                        this._type === n || o && /^hs[bl]$/.test(this._type) || (this._components = this._convert(n), this._properties = i[n], this._type = n), t = u.call(this, t), null != t && (this._components[s] = t, this._changed())
                    }
                }, this)
            }, {
                _class: "Color",
                _readIndex: !0,
                initialize: function l(e) {
                    var n, s, a, o, h = Array.prototype.slice,
                        u = arguments,
                        c = 0;
                    Array.isArray(e) && (u = e, e = u[0]);
                    var d = null != e && typeof e;
                    if ("string" === d && e in i && (n = e, e = u[1], Array.isArray(e) ? (s = e, a = u[2]) : (this.__read && (c = 1), u = h.call(u, 1), d = typeof e)), !s) {
                        if (o = "number" === d ? u : "object" === d && null != e.length ? e : null) {
                            n || (n = o.length >= 3 ? "rgb" : "gray");
                            var f = i[n].length;
                            a = o[f], this.__read && (c += o === arguments ? f + (null != a ? 1 : 0) : 1), o.length > f && (o = h.call(o, 0, f))
                        } else if ("string" === d) n = "rgb", s = t(e), 4 === s.length && (a = s[3], s.length--);
                        else if ("object" === d)
                            if (e.constructor === l) {
                                if (n = e._type, s = e._components.slice(), a = e._alpha, "gradient" === n)
                                    for (var _ = 1, g = s.length; g > _; _++) {
                                        var p = s[_];
                                        p && (s[_] = p.clone())
                                    }
                            } else if (e.constructor === F) n = "gradient", o = u;
                        else {
                            n = "hue" in e ? "lightness" in e ? "hsl" : "hsb" : "gradient" in e || "stops" in e || "radial" in e ? "gradient" : "gray" in e ? "gray" : "rgb";
                            var v = i[n];
                            y = r[n], this._components = s = [];
                            for (var _ = 0, g = v.length; g > _; _++) {
                                var m = e[v[_]];
                                null == m && 0 === _ && "gradient" === n && "stops" in e && (m = {
                                    stops: e.stops,
                                    radial: e.radial
                                }), m = y[_].call(this, m), null != m && (s[_] = m)
                            }
                            a = e.alpha
                        }
                        this.__read && n && (c = 1)
                    }
                    if (this._type = n || "rgb", "gradient" === n && (this._id = l._id = (l._id || 0) + 1), !s) {
                        this._components = s = [];
                        for (var y = r[this._type], _ = 0, g = y.length; g > _; _++) {
                            var m = y[_].call(this, o && o[_]);
                            null != m && (s[_] = m)
                        }
                    }
                    this._components = s, this._properties = i[this._type], this._alpha = a, this.__read && (this.__read = c)
                },
                _serialize: function(t, n) {
                    var i = this.getComponents();
                    return e.serialize(/^(gray|rgb)$/.test(this._type) ? i : [this._type].concat(i), t, !0, n)
                },
                _changed: function() {
                    this._canvasStyle = null, this._owner && this._owner._changed(65)
                },
                _convert: function(t) {
                    var e;
                    return this._type === t ? this._components.slice() : (e = u[this._type + "-" + t]) ? e.apply(this, this._components) : u["rgb-" + t].apply(this, u[this._type + "-rgb"].apply(this, this._components))
                },
                convert: function(t) {
                    return new R(t, this._convert(t), this._alpha)
                },
                getType: function() {
                    return this._type
                },
                setType: function(t) {
                    this._components = this._convert(t), this._properties = i[t], this._type = t
                },
                getComponents: function() {
                    var t = this._components.slice();
                    return null != this._alpha && t.push(this._alpha), t
                },
                getAlpha: function() {
                    return null != this._alpha ? this._alpha : 1
                },
                setAlpha: function(t) {
                    this._alpha = null == t ? null : Math.min(Math.max(t, 0), 1), this._changed()
                },
                hasAlpha: function() {
                    return null != this._alpha
                },
                equals: function(t) {
                    var n = e.isPlainValue(t, !0) ? R.read(arguments) : t;
                    return n === this || n && this._class === n._class && this._type === n._type && this._alpha === n._alpha && e.equals(this._components, n._components) || !1
                },
                toString: function() {
                    for (var t = this._properties, e = [], n = "gradient" === this._type, i = a.instance, r = 0, s = t.length; s > r; r++) {
                        var o = this._components[r];
                        null != o && e.push(t[r] + ": " + (n ? o : i.number(o)))
                    }
                    return null != this._alpha && e.push("alpha: " + i.number(this._alpha)), "{ " + e.join(", ") + " }"
                },
                toCSS: function(t) {
                    function e(t) {
                        return Math.round(255 * (0 > t ? 0 : t > 1 ? 1 : t))
                    }
                    var n = this._convert("rgb"),
                        i = t || null == this._alpha ? 1 : this._alpha;
                    return n = [e(n[0]), e(n[1]), e(n[2])], 1 > i && n.push(0 > i ? 0 : i), t ? "#" + ((1 << 24) + (n[0] << 16) + (n[1] << 8) + n[2]).toString(16).slice(1) : (4 == n.length ? "rgba(" : "rgb(") + n.join(",") + ")"
                },
                toCanvasStyle: function(t) {
                    if (this._canvasStyle) return this._canvasStyle;
                    if ("gradient" !== this._type) return this._canvasStyle = this.toCSS();
                    var e, n = this._components,
                        i = n[0],
                        r = i._stops,
                        s = n[1],
                        a = n[2];
                    if (i._radial) {
                        var o = a.getDistance(s),
                            h = n[3];
                        if (h) {
                            var u = h.subtract(s);
                            u.getLength() > o && (h = s.add(u.normalize(o - .1)))
                        }
                        var l = h || s;
                        e = t.createRadialGradient(l.x, l.y, 0, s.x, s.y, o)
                    } else e = t.createLinearGradient(s.x, s.y, a.x, a.y);
                    for (var c = 0, d = r.length; d > c; c++) {
                        var f = r[c];
                        e.addColorStop(f._rampPoint, f._color.toCanvasStyle())
                    }
                    return this._canvasStyle = e
                },
                transform: function(t) {
                    if ("gradient" === this._type) {
                        for (var e = this._components, n = 1, i = e.length; i > n; n++) {
                            var r = e[n];
                            t._transformPoint(r, r, !0)
                        }
                        this._changed()
                    }
                },
                statics: {
                    _types: i,
                    random: function() {
                        var t = Math.random;
                        return new R(t(), t(), t())
                    }
                }
            })
        }, new function() {
            var t = {
                add: function(t, e) {
                    return t + e
                },
                subtract: function(t, e) {
                    return t - e
                },
                multiply: function(t, e) {
                    return t * e
                },
                divide: function(t, e) {
                    return t / e
                }
            };
            return e.each(t, function(t, e) {
                this[e] = function(e) {
                    e = R.read(arguments);
                    for (var n = this._type, i = this._components, r = e._convert(n), s = 0, a = i.length; a > s; s++) r[s] = t(i[s], r[s]);
                    return new R(n, r, null != this._alpha ? t(this._alpha, e.getAlpha()) : null)
                }
            }, {})
        });
    e.each(R._types, function(t, n) {
        var i = this[e.capitalize(n) + "Color"] = function(t) {
            var e = null != t && typeof t,
                i = "object" === e && null != t.length ? t : "string" === e ? null : arguments;
            return i ? new R(n, i) : new R(t)
        };
        if (3 == n.length) {
            var r = n.toUpperCase();
            R[r] = this[r + "Color"] = i
        }
    }, e.exports);
    var F = e.extend({
            _class: "Gradient",
            initialize: function Pe(t, e) {
                this._id = Pe._id = (Pe._id || 0) + 1, t && this._set(t) && (t = e = null), this._stops || this.setStops(t || ["white", "black"]), null == this._radial && this.setRadial("string" == typeof e && "radial" === e || e || !1)
            },
            _serialize: function(t, n) {
                return n.add(this, function() {
                    return e.serialize([this._stops, this._radial], t, !0, n)
                })
            },
            _changed: function() {
                for (var t = 0, e = this._owners && this._owners.length; e > t; t++) this._owners[t]._changed()
            },
            _addOwner: function(t) {
                this._owners || (this._owners = []), this._owners.push(t)
            },
            _removeOwner: function(e) {
                var n = this._owners ? this._owners.indexOf(e) : -1; - 1 != n && (this._owners.splice(n, 1), 0 === this._owners.length && (this._owners = t))
            },
            clone: function() {
                for (var t = [], e = 0, n = this._stops.length; n > e; e++) t[e] = this._stops[e].clone();
                return new F(t)
            },
            getStops: function() {
                return this._stops
            },
            setStops: function(e) {
                if (this.stops)
                    for (var n = 0, i = this._stops.length; i > n; n++) this._stops[n]._owner = t;
                if (e.length < 2) throw Error("Gradient stop list needs to contain at least two stops.");
                this._stops = q.readAll(e, 0, {
                    clone: !0
                });
                for (var n = 0, i = this._stops.length; i > n; n++) {
                    var r = this._stops[n];
                    r._owner = this, r._defaultRamp && r.setRampPoint(n / (i - 1))
                }
                this._changed()
            },
            getRadial: function() {
                return this._radial
            },
            setRadial: function(t) {
                this._radial = t, this._changed()
            },
            equals: function(t) {
                if (t === this) return !0;
                if (t && this._class === t._class && this._stops.length === t._stops.length) {
                    for (var e = 0, n = this._stops.length; n > e; e++)
                        if (!this._stops[e].equals(t._stops[e])) return !1;
                    return !0
                }
                return !1
            }
        }),
        q = e.extend({
            _class: "GradientStop",
            initialize: function(e, n) {
                if (e) {
                    var i, r;
                    n === t && Array.isArray(e) ? (i = e[0], r = e[1]) : e.color ? (i = e.color, r = e.rampPoint) : (i = e, r = n), this.setColor(i), this.setRampPoint(r)
                }
            },
            clone: function() {
                return new q(this._color.clone(), this._rampPoint)
            },
            _serialize: function(t, n) {
                return e.serialize([this._color, this._rampPoint], t, !0, n)
            },
            _changed: function() {
                this._owner && this._owner._changed(65)
            },
            getRampPoint: function() {
                return this._rampPoint
            },
            setRampPoint: function(t) {
                this._defaultRamp = null == t, this._rampPoint = t || 0, this._changed()
            },
            getColor: function() {
                return this._color
            },
            setColor: function(t) {
                this._color = R.read(arguments), this._color === t && (this._color = t.clone()), this._color._owner = this, this._changed()
            },
            equals: function(t) {
                return t === this || t && this._class === t._class && this._color.equals(t._color) && this._rampPoint == t._rampPoint || !1
            }
        }),
        V = e.extend(new function() {
            var n = {
                    fillColor: t,
                    strokeColor: t,
                    strokeWidth: 1,
                    strokeCap: "butt",
                    strokeJoin: "miter",
                    strokeScaling: !0,
                    miterLimit: 10,
                    dashOffset: 0,
                    dashArray: [],
                    windingRule: "nonzero",
                    shadowColor: t,
                    shadowBlur: 0,
                    shadowOffset: new h,
                    selectedColor: t,
                    fontFamily: "sans-serif",
                    fontWeight: "normal",
                    fontSize: 12,
                    font: "sans-serif",
                    leading: null,
                    justification: "left"
                },
                i = {
                    strokeWidth: 97,
                    strokeCap: 97,
                    strokeJoin: 97,
                    strokeScaling: 105,
                    miterLimit: 97,
                    fontFamily: 9,
                    fontWeight: 9,
                    fontSize: 9,
                    font: 9,
                    leading: 9,
                    justification: 9
                },
                r = {
                    beans: !0
                },
                s = {
                    _defaults: n,
                    _textDefaults: new e(n, {
                        fillColor: new R
                    }),
                    beans: !0
                };
            return e.each(n, function(n, a) {
                var o = /Color$/.test(a),
                    u = "shadowOffset" === a,
                    l = e.capitalize(a),
                    c = i[a],
                    d = "set" + l,
                    f = "get" + l;
                s[d] = function(e) {
                    var n = this._owner,
                        i = n && n._children;
                    if (i && i.length > 0 && !(n instanceof E))
                        for (var r = 0, s = i.length; s > r; r++) i[r]._style[d](e);
                    else {
                        var h = this._values[a];
                        h !== e && (o && (h && (h._owner = t), e && e.constructor === R && (e._owner && (e = e.clone()), e._owner = n)), this._values[a] = e, n && n._changed(c || 65))
                    }
                }, s[f] = function(n) {
                    var i, r = this._owner,
                        s = r && r._children;
                    if (!s || 0 === s.length || n || r instanceof E) {
                        var i = this._values[a];
                        if (i === t) i = this._defaults[a], i && i.clone && (i = i.clone());
                        else {
                            var l = o ? R : u ? h : null;
                            !l || i && i.constructor === l || (this._values[a] = i = l.read([i], 0, {
                                readNull: !0,
                                clone: !0
                            }), i && o && (i._owner = r))
                        }
                        return i
                    }
                    for (var c = 0, d = s.length; d > c; c++) {
                        var _ = s[c]._style[f]();
                        if (0 === c) i = _;
                        else if (!e.equals(i, _)) return t
                    }
                    return i
                }, r[f] = function(t) {
                    return this._style[f](t)
                }, r[d] = function(t) {
                    this._style[d](t)
                }
            }), w.inject(r), s
        }, {
            _class: "Style",
            initialize: function(t, e, n) {
                this._values = {}, this._owner = e, this._project = e && e._project || n || paper.project, e instanceof B && (this._defaults = this._textDefaults), t && this.set(t)
            },
            set: function(t) {
                var e = t instanceof V,
                    n = e ? t._values : t;
                if (n)
                    for (var i in n)
                        if (i in this._defaults) {
                            var r = n[i];
                            this[i] = r && e && r.clone ? r.clone() : r
                        }
            },
            equals: function(t) {
                return t === this || t && this._class === t._class && e.equals(this._values, t._values) || !1
            },
            hasFill: function() {
                return !!this.getFillColor()
            },
            hasStroke: function() {
                return !!this.getStrokeColor() && this.getStrokeWidth() > 0
            },
            hasShadow: function() {
                return !!this.getShadowColor() && this.getShadowBlur() > 0
            },
            getView: function() {
                return this._project.getView()
            },
            getFontStyle: function() {
                var t = this.getFontSize();
                return this.getFontWeight() + " " + t + (/[a-z]/i.test(t + "") ? " " : "px ") + this.getFontFamily()
            },
            getFont: "#getFontFamily",
            setFont: "#setFontFamily",
            getLeading: function ke() {
                var t = ke.base.call(this),
                    e = this.getFontSize();
                return /pt|em|%|px/.test(e) && (e = this.getView().getPixelSize(e)), null != t ? t : 1.2 * e
            }
        }),
        Z = new function() {
            function t(t, e, n, i) {
                for (var r = ["", "webkit", "moz", "Moz", "ms", "o"], s = e[0].toUpperCase() + e.substring(1), a = 0; 6 > a; a++) {
                    var o = r[a],
                        h = o ? o + s : e;
                    if (h in t) {
                        if (!n) return t[h];
                        t[h] = i;
                        break
                    }
                }
            }
            return {
                getStyles: function(t) {
                    var e = t && 9 !== t.nodeType ? t.ownerDocument : t,
                        n = e && e.defaultView;
                    return n && n.getComputedStyle(t, "")
                },
                getBounds: function(t, e) {
                    var n, i = t.ownerDocument,
                        r = i.body,
                        s = i.documentElement;
                    try {
                        n = t.getBoundingClientRect()
                    } catch (a) {
                        n = {
                            left: 0,
                            top: 0,
                            width: 0,
                            height: 0
                        }
                    }
                    var o = n.left - (s.clientLeft || r.clientLeft || 0),
                        h = n.top - (s.clientTop || r.clientTop || 0);
                    if (!e) {
                        var u = i.defaultView;
                        o += u.pageXOffset || s.scrollLeft || r.scrollLeft, h += u.pageYOffset || s.scrollTop || r.scrollTop
                    }
                    return new f(o, h, n.width, n.height)
                },
                getViewportBounds: function(t) {
                    var e = t.ownerDocument,
                        n = e.defaultView,
                        i = e.documentElement;
                    return new f(0, 0, n.innerWidth || i.clientWidth, n.innerHeight || i.clientHeight)
                },
                getOffset: function(t, e) {
                    return Z.getBounds(t, e).getPoint()
                },
                getSize: function(t) {
                    return Z.getBounds(t, !0).getSize()
                },
                isInvisible: function(t) {
                    return Z.getSize(t).equals(new c(0, 0))
                },
                isInView: function(t) {
                    return !Z.isInvisible(t) && Z.getViewportBounds(t).intersects(Z.getBounds(t, !0))
                },
                getPrefixed: function(e, n) {
                    return t(e, n)
                },
                setPrefixed: function(e, n, i) {
                    if ("object" == typeof n)
                        for (var r in n) t(e, r, !0, n[r]);
                    else t(e, n, !0, i)
                }
            }
        },
        U = {
            add: function(t, e) {
                for (var n in e)
                    for (var i = e[n], r = n.split(/[\s,]+/g), s = 0, a = r.length; a > s; s++) t.addEventListener(r[s], i, !1)
            },
            remove: function(t, e) {
                for (var n in e)
                    for (var i = e[n], r = n.split(/[\s,]+/g), s = 0, a = r.length; a > s; s++) t.removeEventListener(r[s], i, !1)
            },
            getPoint: function(t) {
                var e = t.targetTouches ? t.targetTouches.length ? t.targetTouches[0] : t.changedTouches[0] : t;
                return new h(e.pageX || e.clientX + document.documentElement.scrollLeft, e.pageY || e.clientY + document.documentElement.scrollTop)
            },
            getTarget: function(t) {
                return t.target || t.srcElement
            },
            getRelatedTarget: function(t) {
                return t.relatedTarget || t.toElement
            },
            getOffset: function(t, e) {
                return U.getPoint(t).subtract(Z.getOffset(e || U.getTarget(t)))
            },
            stop: function(t) {
                t.stopPropagation(), t.preventDefault()
            }
        };
    U.requestAnimationFrame = new function() {
        function t() {
            for (var e = s.length - 1; e >= 0; e--) {
                var o = s[e],
                    h = o[0],
                    u = o[1];
                (!u || ("true" == r.getAttribute(u, "keepalive") || a) && Z.isInView(u)) && (s.splice(e, 1), h())
            }
            n && (s.length ? n(t) : i = !1)
        }
        var e, n = Z.getPrefixed(window, "requestAnimationFrame"),
            i = !1,
            s = [],
            a = !0;
        return U.add(window, {
                focus: function() {
                    a = !0
                },
                blur: function() {
                    a = !1
                }
            }),
            function(r, a) {
                s.push([r, a]), n ? i || (n(t), i = !0) : e || (e = setInterval(t, 1e3 / 60))
            }
    };
    var H = e.extend(n, {
            _class: "View",
            initialize: function Me(t, e) {
                function n(t) {
                    return e[t] || parseInt(e.getAttribute(t), 10)
                }

                function i() {
                    var t = Z.getSize(e);
                    return t.isNaN() || t.isZero() ? new c(n("width"), n("height")) : t
                }
                this._project = t, this._scope = t._scope, this._element = e;
                var s;
                this._pixelRatio || (this._pixelRatio = window.devicePixelRatio || 1), this._id = e.getAttribute("id"), null == this._id && e.setAttribute("id", this._id = "view-" + Me._id++), U.add(e, this._viewEvents);
                var a = "none";
                if (Z.setPrefixed(e.style, {
                        userSelect: a,
                        touchAction: a,
                        touchCallout: a,
                        contentZooming: a,
                        userDrag: a,
                        tapHighlightColor: "rgba(0,0,0,0)"
                    }), r.hasAttribute(e, "resize")) {
                    var o = this;
                    U.add(window, this._windowEvents = {
                        resize: function() {
                            o.setViewSize(i())
                        }
                    })
                }
                if (this._setViewSize(s = i()), r.hasAttribute(e, "stats") && "undefined" != typeof Stats) {
                    this._stats = new Stats;
                    var h = this._stats.domElement,
                        u = h.style,
                        l = Z.getOffset(e);
                    u.position = "absolute", u.left = l.x + "px", u.top = l.y + "px", document.body.appendChild(h)
                }
                Me._views.push(this), Me._viewsById[this._id] = this, this._viewSize = s, (this._matrix = new g)._owner = this, this._zoom = 1, Me._focused || (Me._focused = this), this._frameItems = {}, this._frameItemCount = 0
            },
            remove: function() {
                return this._project ? (H._focused === this && (H._focused = null), H._views.splice(H._views.indexOf(this), 1), delete H._viewsById[this._id], this._project._view === this && (this._project._view = null), U.remove(this._element, this._viewEvents), U.remove(window, this._windowEvents), this._element = this._project = null, this.off("frame"), this._animate = !1, this._frameItems = {}, !0) : !1
            },
            _events: {
                onFrame: {
                    install: function() {
                        this.play()
                    },
                    uninstall: function() {
                        this.pause()
                    }
                },
                onResize: {}
            },
            _animate: !1,
            _time: 0,
            _count: 0,
            _requestFrame: function() {
                var t = this;
                U.requestAnimationFrame(function() {
                    t._requested = !1, t._animate && (t._requestFrame(), t._handleFrame())
                }, this._element), this._requested = !0
            },
            _handleFrame: function() {
                paper = this._scope;
                var t = Date.now() / 1e3,
                    n = this._before ? t - this._before : 0;
                this._before = t, this._handlingFrame = !0, this.emit("frame", new e({
                    delta: n,
                    time: this._time += n,
                    count: this._count++
                })), this._stats && this._stats.update(), this._handlingFrame = !1, this.update()
            },
            _animateItem: function(t, e) {
                var n = this._frameItems;
                e ? (n[t._id] = {
                    item: t,
                    time: 0,
                    count: 0
                }, 1 === ++this._frameItemCount && this.on("frame", this._handleFrameItems)) : (delete n[t._id], 0 === --this._frameItemCount && this.off("frame", this._handleFrameItems))
            },
            _handleFrameItems: function(t) {
                for (var n in this._frameItems) {
                    var i = this._frameItems[n];
                    i.item.emit("frame", new e(t, {
                        time: i.time += t.delta,
                        count: i.count++
                    }))
                }
            },
            _update: function() {
                this._project._needsUpdate = !0, this._handlingFrame || (this._animate ? this._handleFrame() : this.update())
            },
            _changed: function(t) {
                1 & t && (this._project._needsUpdate = !0)
            },
            _transform: function(t) {
                this._matrix.concatenate(t), this._bounds = null, this._update()
            },
            getElement: function() {
                return this._element
            },
            getPixelRatio: function() {
                return this._pixelRatio
            },
            getResolution: function() {
                return 72 * this._pixelRatio
            },
            getViewSize: function() {
                var t = this._viewSize;
                return new d(t.width, t.height, this, "setViewSize")
            },
            setViewSize: function() {
                var t = c.read(arguments),
                    e = t.subtract(this._viewSize);
                e.isZero() || (this._viewSize.set(t.width, t.height), this._setViewSize(t), this._bounds = null, this.emit("resize", {
                    size: t,
                    delta: e
                }), this._update())
            },
            _setViewSize: function(t) {
                var e = this._element;
                e.width = t.width, e.height = t.height
            },
            getBounds: function() {
                return this._bounds || (this._bounds = this._matrix.inverted()._transformBounds(new f(new h, this._viewSize))), this._bounds
            },
            getSize: function() {
                return this.getBounds().getSize()
            },
            getCenter: function() {
                return this.getBounds().getCenter()
            },
            setCenter: function() {
                var t = h.read(arguments);
                this.scrollBy(t.subtract(this.getCenter()))
            },
            getZoom: function() {
                return this._zoom
            },
            setZoom: function(t) {
                this._transform((new g).scale(t / this._zoom, this.getCenter())), this._zoom = t
            },
            isVisible: function() {
                return Z.isInView(this._element)
            },
            scrollBy: function() {
                this._transform((new g).translate(h.read(arguments).negate()))
            },
            play: function() {
                this._animate = !0, this._requested || this._requestFrame()
            },
            pause: function() {
                this._animate = !1
            },
            draw: function() {
                this.update()
            },
            projectToView: function() {
                return this._matrix._transformPoint(h.read(arguments))
            },
            viewToProject: function() {
                return this._matrix._inverseTransform(h.read(arguments))
            }
        }, {
            statics: {
                _views: [],
                _viewsById: {},
                _id: 0,
                create: function(t, e) {
                    return "string" == typeof e && (e = document.getElementById(e)), new W(t, e)
                }
            }
        }, new function() {
            function t(t) {
                var e = U.getTarget(t);
                return e.getAttribute && H._viewsById[e.getAttribute("id")]
            }

            function e(t, e) {
                return t.viewToProject(U.getOffset(e, t._element))
            }

            function n() {
                if (!H._focused || !H._focused.isVisible())
                    for (var t = 0, e = H._views.length; e > t; t++) {
                        var n = H._views[t];
                        if (n && n.isVisible()) {
                            H._focused = a = n;
                            break
                        }
                    }
            }

            function i(t, e, n) {
                t._handleEvent("mousemove", e, n);
                var i = t._scope.tool;
                return i && i._handleEvent(l && i.responds("mousedrag") ? "mousedrag" : "mousemove", e, n), t.update(), i
            }
            var r, s, a, o, h, u, l = !1,
                c = window.navigator;
            c.pointerEnabled || c.msPointerEnabled ? (o = "pointerdown MSPointerDown", h = "pointermove MSPointerMove", u = "pointerup pointercancel MSPointerUp MSPointerCancel") : (o = "touchstart", h = "touchmove", u = "touchend touchcancel", "ontouchstart" in window && c.userAgent.match(/mobile|tablet|ip(ad|hone|od)|android|silk/i) || (o += " mousedown", h += " mousemove", u += " mouseup"));
            var d = {
                    "selectstart dragstart": function(t) {
                        l && t.preventDefault()
                    }
                },
                f = {
                    mouseout: function(t) {
                        var n = H._focused,
                            r = U.getRelatedTarget(t);
                        !n || r && "HTML" !== r.nodeName || i(n, e(n, t), t)
                    },
                    scroll: n
                };
            return d[o] = function(n) {
                var i = H._focused = t(n),
                    s = e(i, n);
                l = !0, i._handleEvent("mousedown", s, n), (r = i._scope.tool) && r._handleEvent("mousedown", s, n), i.update()
            }, f[h] = function(o) {
                var h = H._focused;
                if (!l) {
                    var u = t(o);
                    u ? (h !== u && i(h, e(h, o), o), s = h, h = H._focused = a = u) : a && a === h && (h = H._focused = s, n())
                }
                if (h) {
                    var c = e(h, o);
                    (l || h.getBounds().contains(c)) && (r = i(h, c, o))
                }
            }, f[u] = function(t) {
                var n = H._focused;
                if (n && l) {
                    var i = e(n, t);
                    l = !1, n._handleEvent("mouseup", i, t), r && r._handleEvent("mouseup", i, t), n.update()
                }
            }, U.add(document, f), U.add(window, {
                load: n
            }), {
                _viewEvents: d,
                _handleEvent: function() {},
                statics: {
                    updateFocus: n
                }
            }
        }),
        W = H.extend({
            _class: "CanvasView",
            initialize: function(t, e) {
                if (!(e instanceof HTMLCanvasElement)) {
                    var n = c.read(arguments, 1);
                    if (n.isZero()) throw Error("Cannot create CanvasView with the provided argument: " + [].slice.call(arguments, 1));
                    e = te.getCanvas(n)
                }
                if (this._context = e.getContext("2d"), this._eventCounters = {}, this._pixelRatio = 1, !/^off|false$/.test(r.getAttribute(e, "hidpi"))) {
                    var i = window.devicePixelRatio || 1,
                        s = Z.getPrefixed(this._context, "backingStorePixelRatio") || 1;
                    this._pixelRatio = i / s
                }
                H.call(this, t, e)
            },
            _setViewSize: function(t) {
                var e = this._element,
                    n = this._pixelRatio,
                    i = t.width,
                    s = t.height;
                if (e.width = i * n, e.height = s * n, 1 !== n) {
                    if (!r.hasAttribute(e, "resize")) {
                        var a = e.style;
                        a.width = i + "px", a.height = s + "px"
                    }
                    this._context.scale(n, n)
                }
            },
            getPixelSize: function(t) {
                var e = this._context,
                    n = e.font;
                return e.font = t + " serif", t = parseFloat(e.font), e.font = n, t
            },
            getTextWidth: function(t, e) {
                var n = this._context,
                    i = n.font,
                    r = 0;
                n.font = t;
                for (var s = 0, a = e.length; a > s; s++) r = Math.max(r, n.measureText(e[s]).width);
                return n.font = i, r
            },
            update: function() {
                var t = this._project;
                if (!t || !t._needsUpdate) return !1;
                var e = this._context,
                    n = this._viewSize;
                return e.clearRect(0, 0, n.width + 1, n.height + 1), t.draw(e, this._matrix, this._pixelRatio), t._needsUpdate = !1, !0
            }
        }, new function() {
            function e(e, n, i, r, s, a) {
                function o(e) {
                    return e.responds(n) && (h || (h = new J(n, i, r, s, a ? r.subtract(a) : null)), e.emit(n, h) && h.isStopped) ? (i.preventDefault(), !0) : t
                }
                for (var h, u = s; u;) {
                    if (o(u)) return !0;
                    u = u.getParent()
                }
                return o(e) ? !0 : !1
            }
            var n, i, r, s, a, o, h, u, l;
            return {
                _handleEvent: function(t, c, d) {
                    if (this._eventCounters[t]) {
                        var f = this._project,
                            _ = f.hitTest(c, {
                                tolerance: 0,
                                fill: !0,
                                stroke: !0
                            }),
                            g = _ && _.item,
                            p = !1;
                        switch (t) {
                            case "mousedown":
                                for (p = e(this, t, d, c, g), u = a == g && Date.now() - l < 300, s = a = g, n = i = r = c, h = !p && g; h && !h.responds("mousedrag");) h = h._parent;
                                break;
                            case "mouseup":
                                p = e(this, t, d, c, g, n), h && (i && !i.equals(c) && e(this, "mousedrag", d, c, h, i), g !== h && (r = c, e(this, "mousemove", d, c, g, r))), !p && g && g === s && (l = Date.now(), e(this, u && s.responds("doubleclick") ? "doubleclick" : "click", d, n, g), u = !1), s = h = null;
                                break;
                            case "mousemove":
                                h && (p = e(this, "mousedrag", d, c, h, i)), p || (g !== o && (r = c), p = e(this, t, d, c, g, r)), i = r = c, g !== o && (e(this, "mouseleave", d, c, o), o = g, e(this, "mouseenter", d, c, g))
                        }
                        return p
                    }
                }
            }
        }),
        G = e.extend({
            _class: "Event",
            initialize: function(t) {
                this.event = t
            },
            isPrevented: !1,
            isStopped: !1,
            preventDefault: function() {
                this.isPrevented = !0, this.event.preventDefault()
            },
            stopPropagation: function() {
                this.isStopped = !0, this.event.stopPropagation()
            },
            stop: function() {
                this.stopPropagation(), this.preventDefault()
            },
            getModifiers: function() {
                return X.modifiers
            }
        }),
        $ = G.extend({
            _class: "KeyEvent",
            initialize: function(t, e, n, i) {
                G.call(this, i), this.type = t ? "keydown" : "keyup", this.key = e, this.character = n
            },
            toString: function() {
                return "{ type: '" + this.type + "', key: '" + this.key + "', character: '" + this.character + "', modifiers: " + this.getModifiers() + " }"
            }
        }),
        X = new function() {
            function t(t, n, r, h) {
                var u, l = r ? String.fromCharCode(r) : "",
                    c = i[n],
                    d = c || l.toLowerCase(),
                    f = t ? "keydown" : "keyup",
                    _ = H._focused,
                    g = _ && _.isVisible() && _._scope,
                    p = g && g.tool;
                o[d] = t, c && (u = e.camelize(c)) in s && (s[u] = t), t ? a[n] = r : delete a[n], p && p.responds(f) && (paper = g, p.emit(f, new $(t, d, l, h)), _ && _.update())
            }
            var n, i = {
                    8: "backspace",
                    9: "tab",
                    13: "enter",
                    16: "shift",
                    17: "control",
                    18: "option",
                    19: "pause",
                    20: "caps-lock",
                    27: "escape",
                    32: "space",
                    35: "end",
                    36: "home",
                    37: "left",
                    38: "up",
                    39: "right",
                    40: "down",
                    46: "delete",
                    91: "command",
                    93: "command",
                    224: "command"
                },
                r = {
                    9: !0,
                    13: !0,
                    32: !0
                },
                s = new e({
                    shift: !1,
                    control: !1,
                    option: !1,
                    command: !1,
                    capsLock: !1,
                    space: !1
                }),
                a = {},
                o = {};
            return U.add(document, {
                keydown: function(e) {
                    var a = e.which || e.keyCode;
                    a in i || s.command ? t(!0, a, a in r || s.command ? a : 0, e) : n = a
                },
                keypress: function(e) {
                    null != n && (t(!0, n, e.which || e.keyCode, e), n = null)
                },
                keyup: function(e) {
                    var n = e.which || e.keyCode;
                    n in a && t(!1, n, a[n], e)
                }
            }), U.add(window, {
                blur: function(e) {
                    for (var n in a) t(!1, n, a[n], e)
                }
            }), {
                modifiers: s,
                isDown: function(t) {
                    return !!o[t]
                }
            }
        },
        J = G.extend({
            _class: "MouseEvent",
            initialize: function(t, e, n, i, r) {
                G.call(this, e), this.type = t, this.point = n, this.target = i, this.delta = r
            },
            toString: function() {
                return "{ type: '" + this.type + "', point: " + this.point + ", target: " + this.target + (this.delta ? ", delta: " + this.delta : "") + ", modifiers: " + this.getModifiers() + " }"
            }
        }),
        Y = G.extend({
            _class: "ToolEvent",
            _item: null,
            initialize: function(t, e, n) {
                this.tool = t, this.type = e, this.event = n
            },
            _choosePoint: function(t, e) {
                return t ? t : e ? e.clone() : null
            },
            getPoint: function() {
                return this._choosePoint(this._point, this.tool._point)
            },
            setPoint: function(t) {
                this._point = t
            },
            getLastPoint: function() {
                return this._choosePoint(this._lastPoint, this.tool._lastPoint)
            },
            setLastPoint: function(t) {
                this._lastPoint = t
            },
            getDownPoint: function() {
                return this._choosePoint(this._downPoint, this.tool._downPoint)
            },
            setDownPoint: function(t) {
                this._downPoint = t
            },
            getMiddlePoint: function() {
                return !this._middlePoint && this.tool._lastPoint ? this.tool._point.add(this.tool._lastPoint).divide(2) : this._middlePoint
            },
            setMiddlePoint: function(t) {
                this._middlePoint = t
            },
            getDelta: function() {
                return !this._delta && this.tool._lastPoint ? this.tool._point.subtract(this.tool._lastPoint) : this._delta
            },
            setDelta: function(t) {
                this._delta = t
            },
            getCount: function() {
                return /^mouse(down|up)$/.test(this.type) ? this.tool._downCount : this.tool._count
            },
            setCount: function(t) {
                this.tool[/^mouse(down|up)$/.test(this.type) ? "downCount" : "count"] = t
            },
            getItem: function() {
                if (!this._item) {
                    var t = this.tool._scope.project.hitTest(this.getPoint());
                    if (t) {
                        for (var e = t.item, n = e._parent;
                            /^(Group|CompoundPath)$/.test(n._class);) e = n, n = n._parent;
                        this._item = e
                    }
                }
                return this._item
            },
            setItem: function(t) {
                this._item = t
            },
            toString: function() {
                return "{ type: " + this.type + ", point: " + this.getPoint() + ", count: " + this.getCount() + ", modifiers: " + this.getModifiers() + " }"
            }
        }),
        K = s.extend({
            _class: "Tool",
            _list: "tools",
            _reference: "tool",
            _events: ["onActivate", "onDeactivate", "onEditOptions", "onMouseDown", "onMouseUp", "onMouseDrag", "onMouseMove", "onKeyDown", "onKeyUp"],
            initialize: function(t) {
                s.call(this), this._firstMove = !0, this._count = 0, this._downCount = 0, this._set(t)
            },
            getMinDistance: function() {
                return this._minDistance
            },
            setMinDistance: function(t) {
                this._minDistance = t, null != this._minDistance && null != this._maxDistance && this._minDistance > this._maxDistance && (this._maxDistance = this._minDistance)
            },
            getMaxDistance: function() {
                return this._maxDistance
            },
            setMaxDistance: function(t) {
                this._maxDistance = t, null != this._minDistance && null != this._maxDistance && this._maxDistance < this._minDistance && (this._minDistance = t)
            },
            getFixedDistance: function() {
                return this._minDistance == this._maxDistance ? this._minDistance : null
            },
            setFixedDistance: function(t) {
                this._minDistance = t, this._maxDistance = t
            },
            _updateEvent: function(t, e, n, i, r, s, a) {
                if (!r) {
                    if (null != n || null != i) {
                        var o = null != n ? n : 0,
                            h = e.subtract(this._point),
                            u = h.getLength();
                        if (o > u) return !1;
                        var l = null != i ? i : 0;
                        if (0 != l)
                            if (u > l) e = this._point.add(h.normalize(l));
                            else if (a) return !1
                    }
                    if (s && e.equals(this._point)) return !1
                }
                switch (this._lastPoint = r && "mousemove" == t ? e : this._point, this._point = e, t) {
                    case "mousedown":
                        this._lastPoint = this._downPoint, this._downPoint = this._point, this._downCount++;
                        break;
                    case "mouseup":
                        this._lastPoint = this._downPoint
                }
                return this._count = r ? 0 : this._count + 1, !0
            },
            _fireEvent: function(t, e) {
                var n = paper.project._removeSets;
                if (n) {
                    "mouseup" === t && (n.mousedrag = null);
                    var i = n[t];
                    if (i) {
                        for (var r in i) {
                            var s = i[r];
                            for (var a in n) {
                                var o = n[a];
                                o && o != i && delete o[s._id]
                            }
                            s.remove()
                        }
                        n[t] = null
                    }
                }
                return this.responds(t) && this.emit(t, new Y(this, t, e))
            },
            _handleEvent: function(t, e, n) {
                paper = this._scope;
                var i = !1;
                switch (t) {
                    case "mousedown":
                        this._updateEvent(t, e, null, null, !0, !1, !1), i = this._fireEvent(t, n);
                        break;
                    case "mousedrag":
                        for (var r = !1, s = !1; this._updateEvent(t, e, this.minDistance, this.maxDistance, !1, r, s);) i = this._fireEvent(t, n) || i, r = !0, s = !0;
                        break;
                    case "mouseup":
                        !e.equals(this._point) && this._updateEvent("mousedrag", e, this.minDistance, this.maxDistance, !1, !1, !1) && (i = this._fireEvent("mousedrag", n)), this._updateEvent(t, e, null, this.maxDistance, !1, !1, !1), i = this._fireEvent(t, n) || i, this._updateEvent(t, e, null, null, !0, !1, !1), this._firstMove = !0;
                        break;
                    case "mousemove":
                        for (; this._updateEvent(t, e, this.minDistance, this.maxDistance, this._firstMove, !0, !1);) i = this._fireEvent(t, n) || i, this._firstMove = !1
                }
                return i && n.preventDefault(), i
            }
        }),
        Q = {
            request: function(t, e, n) {
                var i = new(window.ActiveXObject || XMLHttpRequest)("Microsoft.XMLHTTP");
                return i.open(t.toUpperCase(), e, !0), "overrideMimeType" in i && i.overrideMimeType("text/plain"), i.onreadystatechange = function() {
                    if (4 === i.readyState) {
                        var t = i.status;
                        if (0 !== t && 200 !== t) throw Error("Could not load " + e + " (Error " + t + ")");
                        n.call(i, i.responseText)
                    }
                }, i.send(null)
            }
        },
        te = {
            canvases: [],
            getCanvas: function(t, e) {
                var n, i = !0;
                "object" == typeof t && (e = t.height, t = t.width), n = this.canvases.length ? this.canvases.pop() : document.createElement("canvas");
                var r = n.getContext("2d");
                return n.width === t && n.height === e ? i && r.clearRect(0, 0, t + 1, e + 1) : (n.width = t, n.height = e), r.save(), n
            },
            getContext: function(t, e) {
                return this.getCanvas(t, e).getContext("2d")
            },
            release: function(t) {
                var e = t.canvas ? t.canvas : t;
                e.getContext("2d").restore(), this.canvases.push(e)
            }
        },
        ee = new function() {
            function t(t, e, n) {
                return .2989 * t + .587 * e + .114 * n
            }

            function n(e, n, i, r) {
                var s = r - t(e, n, i);
                f = e + s, _ = n + s, g = i + s;
                var r = t(f, _, g),
                    a = p(f, _, g),
                    o = v(f, _, g);
                if (0 > a) {
                    var h = r - a;
                    f = r + (f - r) * r / h, _ = r + (_ - r) * r / h, g = r + (g - r) * r / h
                }
                if (o > 255) {
                    var u = 255 - r,
                        l = o - r;
                    f = r + (f - r) * u / l, _ = r + (_ - r) * u / l, g = r + (g - r) * u / l
                }
            }

            function i(t, e, n) {
                return v(t, e, n) - p(t, e, n)
            }

            function r(t, e, n, i) {
                var r, s = [t, e, n],
                    a = v(t, e, n),
                    o = p(t, e, n);
                o = o === t ? 0 : o === e ? 1 : 2, a = a === t ? 0 : a === e ? 1 : 2, r = 0 === p(o, a) ? 1 === v(o, a) ? 2 : 1 : 0, s[a] > s[o] ? (s[r] = (s[r] - s[o]) * i / (s[a] - s[o]), s[a] = i) : s[r] = s[a] = 0, s[o] = 0, f = s[0], _ = s[1], g = s[2]
            }
            var s, a, o, h, u, l, c, d, f, _, g, p = Math.min,
                v = Math.max,
                m = Math.abs,
                y = {
                    multiply: function() {
                        f = u * s / 255, _ = l * a / 255, g = c * o / 255
                    },
                    screen: function() {
                        f = u + s - u * s / 255, _ = l + a - l * a / 255, g = c + o - c * o / 255
                    },
                    overlay: function() {
                        f = 128 > u ? 2 * u * s / 255 : 255 - 2 * (255 - u) * (255 - s) / 255, _ = 128 > l ? 2 * l * a / 255 : 255 - 2 * (255 - l) * (255 - a) / 255, g = 128 > c ? 2 * c * o / 255 : 255 - 2 * (255 - c) * (255 - o) / 255
                    },
                    "soft-light": function() {
                        var t = s * u / 255;
                        f = t + u * (255 - (255 - u) * (255 - s) / 255 - t) / 255, t = a * l / 255, _ = t + l * (255 - (255 - l) * (255 - a) / 255 - t) / 255, t = o * c / 255, g = t + c * (255 - (255 - c) * (255 - o) / 255 - t) / 255
                    },
                    "hard-light": function() {
                        f = 128 > s ? 2 * s * u / 255 : 255 - 2 * (255 - s) * (255 - u) / 255, _ = 128 > a ? 2 * a * l / 255 : 255 - 2 * (255 - a) * (255 - l) / 255, g = 128 > o ? 2 * o * c / 255 : 255 - 2 * (255 - o) * (255 - c) / 255
                    },
                    "color-dodge": function() {
                        f = 0 === u ? 0 : 255 === s ? 255 : p(255, 255 * u / (255 - s)), _ = 0 === l ? 0 : 255 === a ? 255 : p(255, 255 * l / (255 - a)), g = 0 === c ? 0 : 255 === o ? 255 : p(255, 255 * c / (255 - o))
                    },
                    "color-burn": function() {
                        f = 255 === u ? 255 : 0 === s ? 0 : v(0, 255 - 255 * (255 - u) / s), _ = 255 === l ? 255 : 0 === a ? 0 : v(0, 255 - 255 * (255 - l) / a), g = 255 === c ? 255 : 0 === o ? 0 : v(0, 255 - 255 * (255 - c) / o)
                    },
                    darken: function() {
                        f = s > u ? u : s, _ = a > l ? l : a, g = o > c ? c : o
                    },
                    lighten: function() {
                        f = u > s ? u : s, _ = l > a ? l : a, g = c > o ? c : o
                    },
                    difference: function() {
                        f = u - s, 0 > f && (f = -f), _ = l - a, 0 > _ && (_ = -_), g = c - o, 0 > g && (g = -g)
                    },
                    exclusion: function() {
                        f = u + s * (255 - u - u) / 255, _ = l + a * (255 - l - l) / 255, g = c + o * (255 - c - c) / 255
                    },
                    hue: function() {
                        r(s, a, o, i(u, l, c)), n(f, _, g, t(u, l, c))
                    },
                    saturation: function() {
                        r(u, l, c, i(s, a, o)), n(f, _, g, t(u, l, c))
                    },
                    luminosity: function() {
                        n(u, l, c, t(s, a, o))
                    },
                    color: function() {
                        n(s, a, o, t(u, l, c))
                    },
                    add: function() {
                        f = p(u + s, 255), _ = p(l + a, 255), g = p(c + o, 255)
                    },
                    subtract: function() {
                        f = v(u - s, 0), _ = v(l - a, 0), g = v(c - o, 0)
                    },
                    average: function() {
                        f = (u + s) / 2, _ = (l + a) / 2, g = (c + o) / 2
                    },
                    negation: function() {
                        f = 255 - m(255 - s - u), _ = 255 - m(255 - a - l), g = 255 - m(255 - o - c)
                    }
                },
                w = this.nativeModes = e.each(["source-over", "source-in", "source-out", "source-atop", "destination-over", "destination-in", "destination-out", "destination-atop", "lighter", "darker", "copy", "xor"], function(t) {
                    this[t] = !0
                }, {}),
                x = te.getContext(1, 1);
            e.each(y, function(t, e) {
                var n = "darken" === e,
                    i = !1;
                x.save();
                try {
                    x.fillStyle = n ? "#300" : "#a00", x.fillRect(0, 0, 1, 1), x.globalCompositeOperation = e, x.globalCompositeOperation === e && (x.fillStyle = n ? "#a00" : "#300", x.fillRect(0, 0, 1, 1), i = x.getImageData(0, 0, 1, 1).data[0] !== n ? 170 : 51)
                } catch (r) {}
                x.restore(), w[e] = i
            }), te.release(x), this.process = function(t, e, n, i, r) {
                var p = e.canvas,
                    v = "normal" === t;
                if (v || w[t]) n.save(), n.setTransform(1, 0, 0, 1, 0, 0), n.globalAlpha = i, v || (n.globalCompositeOperation = t), n.drawImage(p, r.x, r.y), n.restore();
                else {
                    var m = y[t];
                    if (!m) return;
                    for (var x = n.getImageData(r.x, r.y, p.width, p.height), b = x.data, C = e.getImageData(0, 0, p.width, p.height).data, S = 0, P = b.length; P > S; S += 4) {
                        s = C[S], u = b[S], a = C[S + 1], l = b[S + 1], o = C[S + 2], c = b[S + 2], h = C[S + 3], d = b[S + 3], m();
                        var k = h * i / 255,
                            M = 1 - k;
                        b[S] = k * f + M * u, b[S + 1] = k * _ + M * l, b[S + 2] = k * g + M * c, b[S + 3] = h * i + M * d
                    }
                    n.putImageData(x, r.x, r.y)
                }
            }
        },
        ne = e.each({
            fillColor: ["fill", "color"],
            strokeColor: ["stroke", "color"],
            strokeWidth: ["stroke-width", "number"],
            strokeCap: ["stroke-linecap", "string"],
            strokeJoin: ["stroke-linejoin", "string"],
            strokeScaling: ["vector-effect", "lookup", {
                "true": "none",
                "false": "non-scaling-stroke"
            }, function(t, e) {
                return !e && (t instanceof T || t instanceof C || t instanceof B)
            }],
            miterLimit: ["stroke-miterlimit", "number"],
            dashArray: ["stroke-dasharray", "array"],
            dashOffset: ["stroke-dashoffset", "number"],
            fontFamily: ["font-family", "string"],
            fontWeight: ["font-weight", "string"],
            fontSize: ["font-size", "number"],
            justification: ["text-anchor", "lookup", {
                left: "start",
                center: "middle",
                right: "end"
            }],
            opacity: ["opacity", "number"],
            blendMode: ["mix-blend-mode", "string"]
        }, function(t, n) {
            var i = e.capitalize(n),
                r = t[2];
            this[n] = {
                type: t[1],
                property: n,
                attribute: t[0],
                toSVG: r,
                fromSVG: r && e.each(r, function(t, e) {
                    this[t] = e
                }, {}),
                exportFilter: t[3],
                get: "get" + i,
                set: "set" + i
            }
        }, {}),
        ie = {
            href: "http://www.w3.org/1999/xlink",
            xlink: "http://www.w3.org/2000/xmlns"
        };
    return new function() {
        function t(t, e) {
            for (var n in e) {
                var i = e[n],
                    r = ie[n];
                "number" == typeof i && (i = S.number(i)), r ? t.setAttributeNS(r, n, i) : t.setAttribute(n, i)
            }
            return t
        }

        function n(e, n) {
            return t(document.createElementNS("http://www.w3.org/2000/svg", e), n)
        }

        function r(t, n, i) {
            var r = new e,
                s = t.getTranslation();
            if (n) {
                t = t.shiftless();
                var a = t._inverseTransform(s);
                r[i ? "cx" : "x"] = a.x, r[i ? "cy" : "y"] = a.y, s = null
            }
            if (!t.isIdentity()) {
                var h = t.decompose();
                if (h && !h.shearing) {
                    var u = [],
                        l = h.rotation,
                        c = h.scaling;
                    s && !s.isZero() && u.push("translate(" + S.point(s) + ")"), o.isZero(c.x - 1) && o.isZero(c.y - 1) || u.push("scale(" + S.point(c) + ")"), l && u.push("rotate(" + S.number(l) + ")"), r.transform = u.join(" ")
                } else r.transform = "matrix(" + t.getValues().join(",") + ")"
            }
            return r
        }

        function s(e, i) {
            for (var s = r(e._matrix), a = e._children, o = n("g", s), h = 0, u = a.length; u > h; h++) {
                var l = a[h],
                    c = b(l, i);
                if (c)
                    if (l.isClipMask()) {
                        var d = n("clipPath");
                        d.appendChild(c), y(l, d, "clip"), t(o, {
                            "clip-path": "url(#" + d.id + ")"
                        })
                    } else o.appendChild(c)
            }
            return o
        }

        function h(t) {
            var e = r(t._matrix, !0),
                i = t.getSize();
            return e.x -= i.width / 2, e.y -= i.height / 2, e.width = i.width, e.height = i.height, e.href = t.toDataURL(), n("image", e)
        }

        function u(t, e) {
            if (e.matchShapes) {
                var s = t.toShape(!1);
                if (s) return c(s, e)
            }
            var a, o = t._segments,
                h = r(t._matrix);
            if (0 === o.length) return null;
            if (t.isPolygon())
                if (o.length >= 3) {
                    a = t._closed ? "polygon" : "polyline";
                    var u = [];
                    for (i = 0, l = o.length; l > i; i++) u.push(S.point(o[i]._point));
                    h.points = u.join(" ")
                } else {
                    a = "line";
                    var d = o[0]._point,
                        f = o[o.length - 1]._point;
                    h.set({
                        x1: d.x,
                        y1: d.y,
                        x2: f.x,
                        y2: f.y
                    })
                } else a = "path", h.d = t.getPathData(null, e.precision);
            return n(a, h)
        }

        function c(t) {
            var e = t._type,
                i = t._radius,
                s = r(t._matrix, !0, "rectangle" !== e);
            if ("rectangle" === e) {
                e = "rect";
                var a = t._size,
                    o = a.width,
                    h = a.height;
                s.x -= o / 2, s.y -= h / 2, s.width = o, s.height = h, i.isZero() && (i = null)
            }
            return i && ("circle" === e ? s.r = i : (s.rx = i.width, s.ry = i.height)), n(e, s)
        }

        function d(t, e) {
            var i = r(t._matrix),
                s = t.getPathData(null, e.precision);
            return s && (i.d = s), n("path", i)
        }

        function f(t, e) {
            var i = r(t._matrix, !0),
                s = t.getSymbol(),
                a = m(s, "symbol"),
                o = s.getDefinition(),
                h = o.getBounds();
            return a || (a = n("symbol", {
                viewBox: S.rectangle(h)
            }), a.appendChild(b(o, e)), y(s, a, "symbol")), i.href = "#" + a.id, i.x += h.x, i.y += h.y, i.width = S.number(h.width), i.height = S.number(h.height), i.overflow = "visible", n("use", i)
        }

        function _(t) {
            var e = m(t, "color");
            if (!e) {
                var i, r = t.getGradient(),
                    s = r._radial,
                    a = t.getOrigin().transform(),
                    o = t.getDestination().transform();
                if (s) {
                    i = {
                        cx: a.x,
                        cy: a.y,
                        r: a.getDistance(o)
                    };
                    var h = t.getHighlight();
                    h && (h = h.transform(), i.fx = h.x, i.fy = h.y)
                } else i = {
                    x1: a.x,
                    y1: a.y,
                    x2: o.x,
                    y2: o.y
                };
                i.gradientUnits = "userSpaceOnUse", e = n((s ? "radial" : "linear") + "Gradient", i);
                for (var u = r._stops, l = 0, c = u.length; c > l; l++) {
                    var d = u[l],
                        f = d._color,
                        _ = f.getAlpha();
                    i = {
                        offset: d._rampPoint,
                        "stop-color": f.toCSS(!0)
                    }, 1 > _ && (i["stop-opacity"] = _), e.appendChild(n("stop", i))
                }
                y(t, e, "color")
            }
            return "url(#" + e.id + ")"
        }

        function g(t) {
            var e = n("text", r(t._matrix, !0));
            return e.textContent = t._content, e
        }

        function p(n, i, r) {
            var s = {},
                a = !r && n.getParent();
            return null != n._name && (s.id = n._name), e.each(ne, function(t) {
                var i = t.get,
                    r = t.type,
                    o = n[i]();
                if (t.exportFilter ? t.exportFilter(n, o) : !a || !e.equals(a[i](), o)) {
                    if ("color" === r && null != o) {
                        var h = o.getAlpha();
                        1 > h && (s[t.attribute + "-opacity"] = h)
                    }
                    s[t.attribute] = null == o ? "none" : "number" === r ? S.number(o) : "color" === r ? o.gradient ? _(o, n) : o.toCSS(!0) : "array" === r ? o.join(",") : "lookup" === r ? t.toSVG[o] : o
                }
            }), 1 === s.opacity && delete s.opacity, n._visible || (s.visibility = "hidden"), t(i, s)
        }

        function m(t, e) {
            return P || (P = {
                ids: {},
                svgs: {}
            }), t && P.svgs[e + "-" + t._id]
        }

        function y(t, e, n) {
            P || m();
            var i = P.ids[n] = (P.ids[n] || 0) + 1;
            e.id = n + "-" + i, P.svgs[n + "-" + t._id] = e
        }

        function x(t, e) {
            var i = t,
                r = null;
            if (P) {
                i = "svg" === t.nodeName.toLowerCase() && t;
                for (var s in P.svgs) r || (i || (i = n("svg"), i.appendChild(t)), r = i.insertBefore(n("defs"), i.firstChild)), r.appendChild(P.svgs[s]);
                P = null
            }
            return e.asString ? (new XMLSerializer).serializeToString(i) : i
        }

        function b(t, e, n) {
            var i = k[t._class],
                r = i && i(t, e);
            if (r) {
                var s = e.onExport;
                s && (r = s(t, r, e) || r);
                var a = JSON.stringify(t._data);
                a && "{}" !== a && "null" !== a && r.setAttribute("data-paper-data", a)
            }
            return r && p(t, r, n)
        }

        function C(t) {
            return t || (t = {}), S = new a(t.precision), t
        }
        var S, P, k = {
            Group: s,
            Layer: s,
            Raster: h,
            Path: u,
            Shape: c,
            CompoundPath: d,
            PlacedSymbol: f,
            PointText: g
        };
        w.inject({
            exportSVG: function(t) {
                return t = C(t), x(b(this, t, !0), t)
            }
        }), v.inject({
            exportSVG: function(t) {
                t = C(t);
                var e = this.layers,
                    i = this.getView(),
                    s = i.getViewSize(),
                    a = n("svg", {
                        x: 0,
                        y: 0,
                        width: s.width,
                        height: s.height,
                        version: "1.1",
                        xmlns: "http://www.w3.org/2000/svg",
                        "xmlns:xlink": "http://www.w3.org/1999/xlink"
                    }),
                    o = a,
                    h = i._matrix;
                h.isIdentity() || (o = a.appendChild(n("g", r(h))));
                for (var u = 0, l = e.length; l > u; u++) o.appendChild(b(e[u], t, !0));
                return x(a, t)
            }
        })
    }, new function() {
        function n(t, e, n, i) {
            var r = ie[e],
                s = r ? t.getAttributeNS(r, e) : t.getAttribute(e);
            return "null" === s && (s = null), null == s ? i ? null : n ? "" : 0 : n ? s : parseFloat(s)
        }

        function i(t, e, i, r) {
            return e = n(t, e, !1, r), i = n(t, i, !1, r), !r || null != e && null != i ? new h(e, i) : null
        }

        function r(t, e, i, r) {
            return e = n(t, e, !1, r), i = n(t, i, !1, r), !r || null != e && null != i ? new c(e, i) : null
        }

        function s(t, e, n) {
            return "none" === t ? null : "number" === e ? parseFloat(t) : "array" === e ? t ? t.split(/[\s,]+/g).map(parseFloat) : [] : "color" === e ? b(t) || t : "lookup" === e ? n[t] : t
        }

        function a(t, e, n, i) {
            var r = t.childNodes,
                s = "clippath" === e,
                a = new x,
                o = a._project,
                h = o._currentStyle,
                u = [];
            s || (a = m(a, t, i), o._currentStyle = a._style.clone());
            for (var l = 0, c = r.length; c > l; l++) {
                var d, f = r[l];
                1 !== f.nodeType || !(d = P(f, n, !1)) || d instanceof y || u.push(d)
            }
            return a.addChildren(u), s && (a = m(a.reduce(), t, i)), o._currentStyle = h, (s || "defs" === e) && (a.remove(), a = null), a
        }

        function o(t, e) {
            for (var n = t.getAttribute("points").match(/[+-]?(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?/g), i = [], r = 0, s = n.length; s > r; r += 2) i.push(new h(parseFloat(n[r]), parseFloat(n[r + 1])));
            var a = new L(i);
            return "polygon" === e && a.closePath(), a
        }

        function u(t) {
            var e = t.getAttribute("d"),
                n = {
                    pathData: e
                };
            return (e.match(/m/gi) || []).length > 1 || /z\S+/i.test(e) ? new E(n) : new L(n)
        }

        function l(t, e) {
            var r, s = (n(t, "href", !0) || "").substring(1),
                a = "radialgradient" === e;
            if (s) r = I[s].getGradient();
            else {
                for (var o = t.childNodes, h = [], u = 0, l = o.length; l > u; u++) {
                    var c = o[u];
                    1 === c.nodeType && h.push(m(new q, c))
                }
                r = new F(h, a)
            }
            var d, f, _;
            return a ? (d = i(t, "cx", "cy"), f = d.add(n(t, "r"), 0), _ = i(t, "fx", "fy", !0)) : (d = i(t, "x1", "y1"), f = i(t, "x2", "y2")), m(new R(r, d, f, _), t), null
        }

        function d(t, e, n, i) {
            for (var r = (i.getAttribute(n) || "").split(/\)\s*/g), s = new g, a = 0, o = r.length; o > a; a++) {
                var h = r[a];
                if (!h) break;
                for (var u = h.split(/\(\s*/), l = u[0], c = u[1].split(/[\s,]+/g), d = 0, f = c.length; f > d; d++) c[d] = parseFloat(c[d]);
                switch (l) {
                    case "matrix":
                        s.concatenate(new g(c[0], c[1], c[2], c[3], c[4], c[5]));
                        break;
                    case "rotate":
                        s.rotate(c[0], c[1], c[2]);
                        break;
                    case "translate":
                        s.translate(c[0], c[1]);
                        break;
                    case "scale":
                        s.scale(c);
                        break;
                    case "skewX":
                        s.skew(c[0], 0);
                        break;
                    case "skewY":
                        s.skew(0, c[0])
                }
            }
            t.transform(s)
        }

        function _(t, e, n) {
            var i = t["fill-opacity" === n ? "getFillColor" : "getStrokeColor"]();
            i && i.setAlpha(parseFloat(e))
        }

        function p(n, i, r) {
            var s = n.attributes[i],
                a = s && s.value;
            if (!a) {
                var o = e.camelize(i);
                a = n.style[o], a || r.node[o] === r.parent[o] || (a = r.node[o])
            }
            return a ? "none" === a ? null : a : t
        }

        function m(n, i, r) {
            var s = {
                node: Z.getStyles(i) || {},
                parent: !r && Z.getStyles(i.parentNode) || {}
            };
            return e.each(M, function(r, a) {
                var o = p(i, a, s);
                o !== t && (n = e.pick(r(n, o, a, i, s), n))
            }), n
        }

        function b(t) {
            var e = t && t.match(/\((?:#|)([^)']+)/);
            return e && I[e[1]]
        }

        function P(t, e, n) {
            function i(t) {
                paper = s;
                var i = P(t, e, n),
                    r = e.onLoad,
                    a = s.project && s.getView();
                r && r.call(this, i), a.update()
            }
            if (!t) return null;
            e ? "function" == typeof e && (e = {
                onLoad: e
            }) : e = {};
            var r = t,
                s = paper;
            if (n)
                if ("string" != typeof t || /^.*</.test(t)) {
                    if ("undefined" != typeof File && t instanceof File) {
                        var a = new FileReader;
                        return a.onload = function() {
                            i(a.result)
                        }, a.readAsText(t)
                    }
                } else {
                    if (r = document.getElementById(t), !r) return Q.request("get", t, i);
                    t = null
                }
            if ("string" == typeof t && (r = (new DOMParser).parseFromString(t, "image/svg+xml")), !r.nodeName) throw Error("Unsupported SVG source: " + t);
            var o, h = r.nodeName.toLowerCase(),
                u = k[h],
                l = r.getAttribute && r.getAttribute("data-paper-data"),
                c = s.settings,
                d = c.applyMatrix;
            if (c.applyMatrix = !1, o = u && u(r, h, e, n) || null, c.applyMatrix = d, o) {
                "#document" === h || o instanceof x || (o = m(o, r, n));
                var f = e.onImport;
                f && (o = f(r, o, e) || o), e.expandShapes && o instanceof C && (o.remove(), o = o.toPath()), l && (o._data = JSON.parse(l))
            }
            return n && (I = {}, d && o && o.matrix.apply(!0, !0)), o
        }
        var k = {
                "#document": function(t, e, n, i) {
                    for (var r = t.childNodes, s = 0, a = r.length; a > s; s++) {
                        var o = r[s];
                        if (1 === o.nodeType) {
                            var h = o.nextSibling;
                            document.body.appendChild(o);
                            var u = P(o, n, i);
                            return h ? t.insertBefore(o, h) : t.appendChild(o), u
                        }
                    }
                },
                g: a,
                svg: a,
                clippath: a,
                polygon: o,
                polyline: o,
                path: u,
                lineargradient: l,
                radialgradient: l,
                image: function(t) {
                    var e = new S(n(t, "href", !0));
                    return e.on("load", function() {
                        var e = r(t, "width", "height");
                        this.setSize(e);
                        var n = this._matrix._transformPoint(i(t, "x", "y").add(e.divide(2)));
                        this.translate(n)
                    }), e
                },
                symbol: function(t, e, n, i) {
                    return new y(a(t, e, n, i), !0)
                },
                defs: a,
                use: function(t) {
                    var e = (n(t, "href", !0) || "").substring(1),
                        r = I[e],
                        s = i(t, "x", "y");
                    return r ? r instanceof y ? r.place(s) : r.clone().translate(s) : null
                },
                circle: function(t) {
                    return new C.Circle(i(t, "cx", "cy"), n(t, "r"))
                },
                ellipse: function(t) {
                    return new C.Ellipse({
                        center: i(t, "cx", "cy"),
                        radius: r(t, "rx", "ry")
                    })
                },
                rect: function(t) {
                    var e = i(t, "x", "y"),
                        n = r(t, "width", "height"),
                        s = r(t, "rx", "ry");
                    return new C.Rectangle(new f(e, n), s)
                },
                line: function(t) {
                    return new L.Line(i(t, "x1", "y1"), i(t, "x2", "y2"))
                },
                text: function(t) {
                    var e = new D(i(t, "x", "y").add(i(t, "dx", "dy")));
                    return e.setContent(t.textContent.trim() || ""), e
                }
            },
            M = e.each(ne, function(t) {
                this[t.attribute] = function(e, n) {
                    if (e[t.set](s(n, t.type, t.fromSVG)), "color" === t.type && e instanceof C) {
                        var i = e[t.get]();
                        i && i.transform((new g).translate(e.getPosition(!0).negate()))
                    }
                }
            }, {
                id: function(t, e) {
                    I[e] = t, t.setName && t.setName(e)
                },
                "clip-path": function(t, e) {
                    var n = b(e);
                    if (n) {
                        if (n = n.clone(), n.setClipMask(!0), !(t instanceof x)) return new x(n, t);
                        t.insertChild(0, n)
                    }
                },
                gradientTransform: d,
                transform: d,
                "fill-opacity": _,
                "stroke-opacity": _,
                visibility: function(t, e) {
                    t.setVisible("visible" === e)
                },
                display: function(t, e) {
                    t.setVisible(null !== e)
                },
                "stop-color": function(t, e) {
                    t.setColor && t.setColor(e)
                },
                "stop-opacity": function(t, e) {
                    t._color && t._color.setAlpha(parseFloat(e))
                },
                offset: function(t, e) {
                    var n = e.match(/(.*)%$/);
                    t.setRampPoint(n ? n[1] / 100 : parseFloat(e))
                },
                viewBox: function(t, e, n, i, a) {
                    var o = new f(s(e, "array")),
                        h = r(i, "width", "height", !0);
                    if (t instanceof x) {
                        var u = h ? o.getSize().divide(h) : 1,
                            l = (new g).translate(o.getPoint()).scale(u);
                        t.transform(l.inverted())
                    } else if (t instanceof y) {
                        h && o.setSize(h);
                        var c = "visible" != p(i, "overflow", a),
                            d = t._definition;
                        c && !o.contains(d.getBounds()) && (c = new C.Rectangle(o).transform(d._matrix), c.setClipMask(!0), d.addChild(c))
                    }
                }
            }),
            I = {};
        w.inject({
            importSVG: function(t, e) {
                return this.addChild(P(t, e, !0))
            }
        }), v.inject({
            importSVG: function(t, e) {
                return this.activate(), P(t, e, !0)
            }
        })
    }, e.exports.PaperScript = function() {
        function t(t, e, n) {
            var i = g[e];
            if (t && t[i]) {
                var r = t[i](n);
                return "!=" === e ? !r : r
            }
            switch (e) {
                case "+":
                    return t + n;
                case "-":
                    return t - n;
                case "*":
                    return t * n;
                case "/":
                    return t / n;
                case "%":
                    return t % n;
                case "==":
                    return t == n;
                case "!=":
                    return t != n
            }
        }

        function n(t, e) {
            var n = p[t];
            if (n && e && e[n]) return e[n]();
            switch (t) {
                case "+":
                    return +e;
                case "-":
                    return -e
            }
        }

        function i(t, e) {
            return _.acorn.parse(t, e)
        }

        function s(t, e, n) {
            function r(t) {
                for (var e = 0, n = u.length; n > e; e++) {
                    var i = u[e];
                    if (i[0] >= t) break;
                    t += i[1]
                }
                return t
            }

            function s(e) {
                return t.substring(r(e.range[0]), r(e.range[1]))
            }

            function a(e, n) {
                return t.substring(r(e.range[1]), r(n.range[0]))
            }

            function o(e, n) {
                for (var i = r(e.range[0]), s = r(e.range[1]), a = 0, o = u.length - 1; o >= 0; o--)
                    if (i > u[o][0]) {
                        a = o + 1;
                        break
                    }
                u.splice(a, 0, [i, n.length - s + i]), t = t.substring(0, i) + n + t.substring(s)
            }

            function h(t, e) {
                if (t) {
                    for (var n in t)
                        if ("range" !== n && "loc" !== n) {
                            var i = t[n];
                            if (Array.isArray(i))
                                for (var r = 0, u = i.length; u > r; r++) h(i[r], t);
                            else i && "object" == typeof i && h(i, t)
                        }
                    switch (t.type) {
                        case "UnaryExpression":
                            if (t.operator in p && "Literal" !== t.argument.type) {
                                var l = s(t.argument);
                                o(t, '$__("' + t.operator + '", ' + l + ")")
                            }
                            break;
                        case "BinaryExpression":
                            if (t.operator in g && "Literal" !== t.left.type) {
                                var c = s(t.left),
                                    d = s(t.right),
                                    f = a(t.left, t.right),
                                    _ = t.operator;
                                o(t, "__$__(" + c + "," + f.replace(RegExp("\\" + _), '"' + _ + '"') + ", " + d + ")")
                            }
                            break;
                        case "UpdateExpression":
                        case "AssignmentExpression":
                            var v = e && e.type;
                            if (!("ForStatement" === v || "BinaryExpression" === v && /^[=!<>]/.test(e.operator) || "MemberExpression" === v && e.computed))
                                if ("UpdateExpression" === t.type) {
                                    var l = s(t.argument),
                                        m = l + " = __$__(" + l + ', "' + t.operator[0] + '", 1)';
                                    t.prefix || "AssignmentExpression" !== v && "VariableDeclarator" !== v || (m = l + "; " + m), o(t, m)
                                } else if (/^.=$/.test(t.operator) && "Literal" !== t.left.type) {
                                var c = s(t.left),
                                    d = s(t.right);
                                o(t, c + " = __$__(" + c + ', "' + t.operator[0] + '", ' + d + ")")
                            }
                    }
                }
            }
            if (!t) return "";
            n = n || {}, e = e || "";
            var u = [],
                l = null,
                c = paper.browser,
                d = c.versionNumber,
                f = /\r\n|\n|\r/gm;
            if (c.chrome && d >= 30 || c.webkit && d >= 537.76 || c.firefox && d >= 23) {
                var _ = 0;
                if (0 === window.location.href.indexOf(e)) {
                    var v = document.getElementsByTagName("html")[0].innerHTML;
                    _ = v.substr(0, v.indexOf(t) + 1).match(f).length + 1
                }
                var m = ["AAAA"];
                m.length = (t.match(f) || []).length + 1 + _, l = {
                    version: 3,
                    file: e,
                    names: [],
                    mappings: m.join(";AACA"),
                    sourceRoot: "",
                    sources: [e]
                };
                var y = n.source || !e && t;
                y && (l.sourcesContent = [y])
            }
            return h(i(t, {
                ranges: !0
            })), l && (t = Array(_ + 1).join("\n") + t + "\n//# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(l)))) + "\n//# sourceURL=" + (e || "paperscript")), t
        }

        function a(i, r, a, o) {
            function u(t, e) {
                for (var n in t) !e && /^_/.test(n) || !RegExp("([\\b\\s\\W]|^)" + n.replace(/\$/g, "\\$") + "\\b").test(i) || (g.push(n), p.push(t[n]))
            }
            paper = r;
            var l, c = r.getView(),
                d = /\s+on(?:Key|Mouse)(?:Up|Down|Move|Drag)\b/.test(i) ? new K : null,
                f = d ? d._events : [],
                _ = ["onFrame", "onResize"].concat(f),
                g = [],
                p = [];
            i = s(i, a, o), u({
                __$__: t,
                $__: n,
                paper: r,
                view: c,
                tool: d
            }, !0), u(r), _ = e.each(_, function(t) {
                RegExp("\\s+" + t + "\\b").test(i) && (g.push(t), this.push(t + ": " + t))
            }, []).join(", "), _ && (i += "\nreturn { " + _ + " };");
            var v = paper.browser;
            if (v.chrome || v.firefox) {
                var m = document.createElement("script"),
                    y = document.head || document.getElementsByTagName("head")[0];
                v.firefox && (i = "\n" + i), m.appendChild(document.createTextNode("paper._execute = function(" + g + ") {" + i + "\n}")), y.appendChild(m), l = paper._execute, delete paper._execute, y.removeChild(m)
            } else l = Function(g, i);
            var w = l.apply(r, p) || {};
            e.each(f, function(t) {
                var e = w[t];
                e && (d[t] = e)
            }), c && (w.onResize && c.setOnResize(w.onResize), c.emit("resize", {
                size: c.size,
                delta: new h
            }), w.onFrame && c.setOnFrame(w.onFrame), c.update())
        }

        function o(t) {
            if (/^text\/(?:x-|)paperscript$/.test(t.type) && "true" !== r.getAttribute(t, "ignore")) {
                var e = r.getAttribute(t, "canvas"),
                    n = document.getElementById(e),
                    i = t.src,
                    s = "data-paper-scope";
                if (!n) throw Error('Unable to find canvas with id "' + e + '"');
                var o = r.get(n.getAttribute(s)) || (new r).setup(n);
                return n.setAttribute(s, o._id), i ? Q.request("get", i, function(t) {
                    a(t, o, i)
                }) : a(t.innerHTML, o, t.baseURI), t.setAttribute("data-paper-ignore", "true"), o
            }
        }

        function u() {
            e.each(document.getElementsByTagName("script"), o)
        }

        function l(t) {
            return t ? o(t) : u()
        }
        var d, f, _ = this;
        ! function(t, e) {
            return "object" == typeof d && "object" == typeof module ? e(d) : "function" == typeof f && f.amd ? f(["exports"], e) : (e(t.acorn || (t.acorn = {})), void 0)
        }(this, function(t) {
            "use strict";

            function e(t) {
                ce = t || {};
                for (var e in ge) Object.prototype.hasOwnProperty.call(ce, e) || (ce[e] = ge[e]);
                _e = ce.sourceFile || null
            }

            function n(t, e) {
                var n = pe(de, t);
                e += " (" + n.line + ":" + n.column + ")";
                var i = new SyntaxError(e);
                throw i.pos = t, i.loc = n, i.raisedAt = ve, i
            }

            function i(t) {
                function e(t) {
                    if (1 == t.length) return n += "return str === " + JSON.stringify(t[0]) + ";";
                    n += "switch(str){";
                    for (var e = 0; e < t.length; ++e) n += "case " + JSON.stringify(t[e]) + ":";
                    n += "return true}return false;"
                }
                t = t.split(" ");
                var n = "",
                    i = [];
                t: for (var r = 0; r < t.length; ++r) {
                    for (var s = 0; s < i.length; ++s)
                        if (i[s][0].length == t[r].length) {
                            i[s].push(t[r]);
                            continue t
                        }
                    i.push([t[r]])
                }
                if (i.length > 3) {
                    i.sort(function(t, e) {
                        return e.length - t.length
                    }), n += "switch(str.length){";
                    for (var r = 0; r < i.length; ++r) {
                        var a = i[r];
                        n += "case " + a[0].length + ":", e(a)
                    }
                    n += "}"
                } else e(t);
                return Function("str", n)
            }

            function r() {
                this.line = Pe, this.column = ve - ke
            }

            function s() {
                Pe = 1, ve = ke = 0, Se = !0, u()
            }

            function a(t, e) {
                ye = ve, ce.locations && (xe = new r), be = t, u(), Ce = e, Se = t.beforeExpr
            }

            function o() {
                var t = ce.onComment && ce.locations && new r,
                    e = ve,
                    i = de.indexOf("*/", ve += 2);
                if (-1 === i && n(ve - 2, "Unterminated comment"), ve = i + 2, ce.locations) {
                    Yn.lastIndex = e;
                    for (var s;
                        (s = Yn.exec(de)) && s.index < ve;) ++Pe, ke = s.index + s[0].length
                }
                ce.onComment && ce.onComment(!0, de.slice(e + 2, i), e, ve, t, ce.locations && new r)
            }

            function h() {
                for (var t = ve, e = ce.onComment && ce.locations && new r, n = de.charCodeAt(ve += 2); fe > ve && 10 !== n && 13 !== n && 8232 !== n && 8233 !== n;) ++ve, n = de.charCodeAt(ve);
                ce.onComment && ce.onComment(!1, de.slice(t + 2, ve), t, ve, e, ce.locations && new r)
            }

            function u() {
                for (; fe > ve;) {
                    var t = de.charCodeAt(ve);
                    if (32 === t) ++ve;
                    else if (13 === t) {
                        ++ve;
                        var e = de.charCodeAt(ve);
                        10 === e && ++ve, ce.locations && (++Pe, ke = ve)
                    } else if (10 === t || 8232 === t || 8233 === t) ++ve, ce.locations && (++Pe, ke = ve);
                    else if (t > 8 && 14 > t) ++ve;
                    else if (47 === t) {
                        var e = de.charCodeAt(ve + 1);
                        if (42 === e) o();
                        else {
                            if (47 !== e) break;
                            h()
                        }
                    } else if (160 === t) ++ve;
                    else {
                        if (!(t >= 5760 && Hn.test(String.fromCharCode(t)))) break;
                        ++ve
                    }
                }
            }

            function l() {
                var t = de.charCodeAt(ve + 1);
                return t >= 48 && 57 >= t ? S(!0) : (++ve, a(xn))
            }

            function c() {
                var t = de.charCodeAt(ve + 1);
                return Se ? (++ve, x()) : 61 === t ? w(Pn, 2) : w(Cn, 1)
            }

            function d() {
                var t = de.charCodeAt(ve + 1);
                return 61 === t ? w(Pn, 2) : w(Bn, 1)
            }

            function f(t) {
                var e = de.charCodeAt(ve + 1);
                return e === t ? w(124 === t ? zn : An, 2) : 61 === e ? w(Pn, 2) : w(124 === t ? On : Ln, 1)
            }

            function _() {
                var t = de.charCodeAt(ve + 1);
                return 61 === t ? w(Pn, 2) : w(Tn, 1)
            }

            function g(t) {
                var e = de.charCodeAt(ve + 1);
                return e === t ? 45 == e && 62 == de.charCodeAt(ve + 2) && Jn.test(de.slice(Ie, ve)) ? (ve += 3, h(), u(), y()) : w(Mn, 2) : 61 === e ? w(Pn, 2) : w(kn, 1)
            }

            function p(t) {
                var e = de.charCodeAt(ve + 1),
                    n = 1;
                return e === t ? (n = 62 === t && 62 === de.charCodeAt(ve + 2) ? 3 : 2, 61 === de.charCodeAt(ve + n) ? w(Pn, n + 1) : w(jn, n)) : 33 == e && 60 == t && 45 == de.charCodeAt(ve + 2) && 45 == de.charCodeAt(ve + 3) ? (ve += 4, h(), u(), y()) : (61 === e && (n = 61 === de.charCodeAt(ve + 2) ? 3 : 2), w(Nn, n))
            }

            function v(t) {
                var e = de.charCodeAt(ve + 1);
                return 61 === e ? w(En, 61 === de.charCodeAt(ve + 2) ? 3 : 2) : w(61 === t ? Sn : In, 1)
            }

            function m(t) {
                switch (t) {
                    case 46:
                        return l();
                    case 40:
                        return ++ve, a(pn);
                    case 41:
                        return ++ve, a(vn);
                    case 59:
                        return ++ve, a(yn);
                    case 44:
                        return ++ve, a(mn);
                    case 91:
                        return ++ve, a(dn);
                    case 93:
                        return ++ve, a(fn);
                    case 123:
                        return ++ve, a(_n);
                    case 125:
                        return ++ve, a(gn);
                    case 58:
                        return ++ve, a(wn);
                    case 63:
                        return ++ve, a(bn);
                    case 48:
                        var e = de.charCodeAt(ve + 1);
                        if (120 === e || 88 === e) return C();
                    case 49:
                    case 50:
                    case 51:
                    case 52:
                    case 53:
                    case 54:
                    case 55:
                    case 56:
                    case 57:
                        return S(!1);
                    case 34:
                    case 39:
                        return P(t);
                    case 47:
                        return c(t);
                    case 37:
                    case 42:
                        return d();
                    case 124:
                    case 38:
                        return f(t);
                    case 94:
                        return _();
                    case 43:
                    case 45:
                        return g(t);
                    case 60:
                    case 62:
                        return p(t);
                    case 61:
                    case 33:
                        return v(t);
                    case 126:
                        return w(In, 1)
                }
                return !1
            }

            function y(t) {
                if (t ? ve = me + 1 : me = ve, ce.locations && (we = new r), t) return x();
                if (ve >= fe) return a(De);
                var e = de.charCodeAt(ve);
                if (Kn(e) || 92 === e) return I();
                var i = m(e);
                if (i === !1) {
                    var s = String.fromCharCode(e);
                    if ("\\" === s || $n.test(s)) return I();
                    n(ve, "Unexpected character '" + s + "'")
                }
                return i
            }

            function w(t, e) {
                var n = de.slice(ve, ve + e);
                ve += e, a(t, n)
            }

            function x() {
                for (var t, e, i = "", r = ve;;) {
                    ve >= fe && n(r, "Unterminated regular expression");
                    var s = de.charAt(ve);
                    if (Jn.test(s) && n(r, "Unterminated regular expression"), t) t = !1;
                    else {
                        if ("[" === s) e = !0;
                        else if ("]" === s && e) e = !1;
                        else if ("/" === s && !e) break;
                        t = "\\" === s
                    }++ve
                }
                var i = de.slice(r, ve);
                ++ve;
                var o = M();
                return o && !/^[gmsiy]*$/.test(o) && n(r, "Invalid regexp flag"), a(Ne, RegExp(i, o))
            }

            function b(t, e) {
                for (var n = ve, i = 0, r = 0, s = null == e ? 1 / 0 : e; s > r; ++r) {
                    var a, o = de.charCodeAt(ve);
                    if (a = o >= 97 ? o - 97 + 10 : o >= 65 ? o - 65 + 10 : o >= 48 && 57 >= o ? o - 48 : 1 / 0, a >= t) break;
                    ++ve, i = i * t + a
                }
                return ve === n || null != e && ve - n !== e ? null : i
            }

            function C() {
                ve += 2;
                var t = b(16);
                return null == t && n(me + 2, "Expected hexadecimal number"), Kn(de.charCodeAt(ve)) && n(ve, "Identifier directly after number"), a(Ee, t)
            }

            function S(t) {
                var e = ve,
                    i = !1,
                    r = 48 === de.charCodeAt(ve);
                t || null !== b(10) || n(e, "Invalid number"), 46 === de.charCodeAt(ve) && (++ve, b(10), i = !0);
                var s = de.charCodeAt(ve);
                (69 === s || 101 === s) && (s = de.charCodeAt(++ve), (43 === s || 45 === s) && ++ve, null === b(10) && n(e, "Invalid number"), i = !0), Kn(de.charCodeAt(ve)) && n(ve, "Identifier directly after number");
                var o, h = de.slice(e, ve);
                return i ? o = parseFloat(h) : r && 1 !== h.length ? /[89]/.test(h) || Te ? n(e, "Invalid number") : o = parseInt(h, 8) : o = parseInt(h, 10), a(Ee, o)
            }

            function P(t) {
                ve++;
                for (var e = "";;) {
                    ve >= fe && n(me, "Unterminated string constant");
                    var i = de.charCodeAt(ve);
                    if (i === t) return ++ve, a(je, e);
                    if (92 === i) {
                        i = de.charCodeAt(++ve);
                        var r = /^[0-7]+/.exec(de.slice(ve, ve + 3));
                        for (r && (r = r[0]); r && parseInt(r, 8) > 255;) r = r.slice(0, r.length - 1);
                        if ("0" === r && (r = null), ++ve, r) Te && n(ve - 2, "Octal literal in strict mode"), e += String.fromCharCode(parseInt(r, 8)), ve += r.length - 1;
                        else switch (i) {
                            case 110:
                                e += "\n";
                                break;
                            case 114:
                                e += "\r";
                                break;
                            case 120:
                                e += String.fromCharCode(k(2));
                                break;
                            case 117:
                                e += String.fromCharCode(k(4));
                                break;
                            case 85:
                                e += String.fromCharCode(k(8));
                                break;
                            case 116:
                                e += " ";
                                break;
                            case 98:
                                e += "\b";
                                break;
                            case 118:
                                e += " ";
                                break;
                            case 102:
                                e += "\f";
                                break;
                            case 48:
                                e += "\0";
                                break;
                            case 13:
                                10 === de.charCodeAt(ve) && ++ve;
                            case 10:
                                ce.locations && (ke = ve, ++Pe);
                                break;
                            default:
                                e += String.fromCharCode(i)
                        }
                    } else(13 === i || 10 === i || 8232 === i || 8233 === i) && n(me, "Unterminated string constant"), e += String.fromCharCode(i), ++ve
                }
            }

            function k(t) {
                var e = b(16, t);
                return null === e && n(me, "Bad character escape sequence"), e
            }

            function M() {
                Rn = !1;
                for (var t, e = !0, i = ve;;) {
                    var r = de.charCodeAt(ve);
                    if (Qn(r)) Rn && (t += de.charAt(ve)), ++ve;
                    else {
                        if (92 !== r) break;
                        Rn || (t = de.slice(i, ve)), Rn = !0, 117 != de.charCodeAt(++ve) && n(ve, "Expecting Unicode escape sequence \\uXXXX"), ++ve;
                        var s = k(4),
                            a = String.fromCharCode(s);
                        a || n(ve - 1, "Invalid Unicode escape"), (e ? Kn(s) : Qn(s)) || n(ve - 4, "Invalid Unicode escape"), t += a
                    }
                    e = !1
                }
                return Rn ? t : de.slice(i, ve)
            }

            function I() {
                var t = M(),
                    e = Be;
                return Rn || (Un(t) ? e = cn[t] : (ce.forbidReserved && (3 === ce.ecmaVersion ? Fn : qn)(t) || Te && Vn(t)) && n(me, "The keyword '" + t + "' is reserved")), a(e, t)
            }

            function z() {
                Me = me, Ie = ye, ze = xe, y()
            }

            function A(t) {
                if (Te = t, ve = Ie, ce.locations)
                    for (; ke > ve;) ke = de.lastIndexOf("\n", ke - 2) + 1, --Pe;
                u(), y()
            }

            function O() {
                this.type = null, this.start = me, this.end = null
            }

            function T() {
                this.start = we, this.end = null, null !== _e && (this.source = _e)
            }

            function L() {
                var t = new O;
                return ce.locations && (t.loc = new T), ce.ranges && (t.range = [me, 0]), t
            }

            function E(t) {
                var e = new O;
                return e.start = t.start, ce.locations && (e.loc = new T, e.loc.start = t.loc.start), ce.ranges && (e.range = [t.range[0], 0]), e
            }

            function N(t, e) {
                return t.type = e, t.end = Ie, ce.locations && (t.loc.end = ze), ce.ranges && (t.range[1] = Ie), t
            }

            function j(t) {
                return ce.ecmaVersion >= 5 && "ExpressionStatement" === t.type && "Literal" === t.expression.type && "use strict" === t.expression.value
            }

            function B(t) {
                return be === t ? (z(), !0) : void 0
            }

            function D() {
                return !ce.strictSemicolons && (be === De || be === gn || Jn.test(de.slice(Ie, me)))
            }

            function R() {
                B(yn) || D() || q()
            }

            function F(t) {
                be === t ? z() : q()
            }

            function q() {
                n(me, "Unexpected token")
            }

            function V(t) {
                "Identifier" !== t.type && "MemberExpression" !== t.type && n(t.start, "Assigning to rvalue"), Te && "Identifier" === t.type && Zn(t.name) && n(t.start, "Assigning to " + t.name + " in strict mode")
            }

            function Z(t) {
                Me = Ie = ve, ce.locations && (ze = new r), Ae = Te = null, Oe = [], y();
                var e = t || L(),
                    n = !0;
                for (t || (e.body = []); be !== De;) {
                    var i = U();
                    e.body.push(i), n && j(i) && A(!0), n = !1
                }
                return N(e, "Program")
            }

            function U() {
                (be === Cn || be === Pn && "/=" == Ce) && y(!0);
                var t = be,
                    e = L();
                switch (t) {
                    case Re:
                    case Ve:
                        z();
                        var i = t === Re;
                        B(yn) || D() ? e.label = null : be !== Be ? q() : (e.label = le(), R());
                        for (var r = 0; r < Oe.length; ++r) {
                            var s = Oe[r];
                            if (null == e.label || s.name === e.label.name) {
                                if (null != s.kind && (i || "loop" === s.kind)) break;
                                if (e.label && i) break
                            }
                        }
                        return r === Oe.length && n(e.start, "Unsyntactic " + t.keyword), N(e, i ? "BreakStatement" : "ContinueStatement");
                    case Ze:
                        return z(), R(), N(e, "DebuggerStatement");
                    case He:
                        return z(), Oe.push(ti), e.body = U(), Oe.pop(), F(nn), e.test = H(), R(), N(e, "DoWhileStatement");
                    case $e:
                        if (z(), Oe.push(ti), F(pn), be === yn) return G(e, null);
                        if (be === en) {
                            var a = L();
                            return z(), X(a, !0), N(a, "VariableDeclaration"), 1 === a.declarations.length && B(ln) ? $(e, a) : G(e, a)
                        }
                        var a = J(!1, !0);
                        return B(ln) ? (V(a), $(e, a)) : G(e, a);
                    case Xe:
                        return z(), he(e, !0);
                    case Je:
                        return z(), e.test = H(), e.consequent = U(), e.alternate = B(We) ? U() : null, N(e, "IfStatement");
                    case Ye:
                        return Ae || n(me, "'return' outside of function"), z(), B(yn) || D() ? e.argument = null : (e.argument = J(), R()), N(e, "ReturnStatement");
                    case Ke:
                        z(), e.discriminant = H(), e.cases = [], F(_n), Oe.push(ei);
                        for (var o, h; be != gn;)
                            if (be === Fe || be === Ue) {
                                var u = be === Fe;
                                o && N(o, "SwitchCase"), e.cases.push(o = L()), o.consequent = [], z(), u ? o.test = J() : (h && n(Me, "Multiple default clauses"), h = !0, o.test = null), F(wn)
                            } else o || q(), o.consequent.push(U());
                        return o && N(o, "SwitchCase"), z(), Oe.pop(), N(e, "SwitchStatement");
                    case Qe:
                        return z(), Jn.test(de.slice(Ie, me)) && n(Ie, "Illegal newline after throw"), e.argument = J(), R(), N(e, "ThrowStatement");
                    case tn:
                        if (z(), e.block = W(), e.handler = null, be === qe) {
                            var l = L();
                            z(), F(pn), l.param = le(), Te && Zn(l.param.name) && n(l.param.start, "Binding " + l.param.name + " in strict mode"), F(vn), l.guard = null, l.body = W(), e.handler = N(l, "CatchClause")
                        }
                        return e.guardedHandlers = Le, e.finalizer = B(Ge) ? W() : null, e.handler || e.finalizer || n(e.start, "Missing catch or finally clause"), N(e, "TryStatement");
                    case en:
                        return z(), X(e), R(), N(e, "VariableDeclaration");
                    case nn:
                        return z(), e.test = H(), Oe.push(ti), e.body = U(), Oe.pop(), N(e, "WhileStatement");
                    case rn:
                        return Te && n(me, "'with' in strict mode"), z(), e.object = H(), e.body = U(), N(e, "WithStatement");
                    case _n:
                        return W();
                    case yn:
                        return z(), N(e, "EmptyStatement");
                    default:
                        var c = Ce,
                            d = J();
                        if (t === Be && "Identifier" === d.type && B(wn)) {
                            for (var r = 0; r < Oe.length; ++r) Oe[r].name === c && n(d.start, "Label '" + c + "' is already declared");
                            var f = be.isLoop ? "loop" : be === Ke ? "switch" : null;
                            return Oe.push({
                                name: c,
                                kind: f
                            }), e.body = U(), Oe.pop(), e.label = d, N(e, "LabeledStatement")
                        }
                        return e.expression = d, R(), N(e, "ExpressionStatement")
                }
            }

            function H() {
                F(pn);
                var t = J();
                return F(vn), t
            }

            function W(t) {
                var e, n = L(),
                    i = !0,
                    r = !1;
                for (n.body = [], F(_n); !B(gn);) {
                    var s = U();
                    n.body.push(s), i && t && j(s) && (e = r, A(r = !0)), i = !1
                }
                return r && !e && A(!1), N(n, "BlockStatement")
            }

            function G(t, e) {
                return t.init = e, F(yn), t.test = be === yn ? null : J(), F(yn), t.update = be === vn ? null : J(), F(vn), t.body = U(), Oe.pop(), N(t, "ForStatement")
            }

            function $(t, e) {
                return t.left = e, t.right = J(), F(vn), t.body = U(), Oe.pop(), N(t, "ForInStatement")
            }

            function X(t, e) {
                for (t.declarations = [], t.kind = "var";;) {
                    var i = L();
                    if (i.id = le(), Te && Zn(i.id.name) && n(i.id.start, "Binding " + i.id.name + " in strict mode"), i.init = B(Sn) ? J(!0, e) : null, t.declarations.push(N(i, "VariableDeclarator")), !B(mn)) break
                }
                return t
            }

            function J(t, e) {
                var n = Y(e);
                if (!t && be === mn) {
                    var i = E(n);
                    for (i.expressions = [n]; B(mn);) i.expressions.push(Y(e));
                    return N(i, "SequenceExpression")
                }
                return n
            }

            function Y(t) {
                var e = K(t);
                if (be.isAssign) {
                    var n = E(e);
                    return n.operator = Ce, n.left = e, z(), n.right = Y(t), V(e), N(n, "AssignmentExpression")
                }
                return e
            }

            function K(t) {
                var e = Q(t);
                if (B(bn)) {
                    var n = E(e);
                    return n.test = e, n.consequent = J(!0), F(wn), n.alternate = J(!0, t), N(n, "ConditionalExpression")
                }
                return e
            }

            function Q(t) {
                return te(ee(), -1, t)
            }

            function te(t, e, n) {
                var i = be.binop;
                if (null != i && (!n || be !== ln) && i > e) {
                    var r = E(t);
                    r.left = t, r.operator = Ce, z(), r.right = te(ee(), i, n);
                    var s = N(r, /&&|\|\|/.test(r.operator) ? "LogicalExpression" : "BinaryExpression");
                    return te(s, e, n)
                }
                return t
            }

            function ee() {
                if (be.prefix) {
                    var t = L(),
                        e = be.isUpdate;
                    return t.operator = Ce, t.prefix = !0, Se = !0, z(), t.argument = ee(), e ? V(t.argument) : Te && "delete" === t.operator && "Identifier" === t.argument.type && n(t.start, "Deleting local variable in strict mode"), N(t, e ? "UpdateExpression" : "UnaryExpression")
                }
                for (var i = ne(); be.postfix && !D();) {
                    var t = E(i);
                    t.operator = Ce, t.prefix = !1, t.argument = i, V(i), z(), i = N(t, "UpdateExpression")
                }
                return i
            }

            function ne() {
                return ie(re())
            }

            function ie(t, e) {
                if (B(xn)) {
                    var n = E(t);
                    return n.object = t, n.property = le(!0), n.computed = !1, ie(N(n, "MemberExpression"), e)
                }
                if (B(dn)) {
                    var n = E(t);
                    return n.object = t, n.property = J(), n.computed = !0, F(fn), ie(N(n, "MemberExpression"), e)
                }
                if (!e && B(pn)) {
                    var n = E(t);
                    return n.callee = t, n.arguments = ue(vn, !1), ie(N(n, "CallExpression"), e)
                }
                return t
            }

            function re() {
                switch (be) {
                    case an:
                        var t = L();
                        return z(), N(t, "ThisExpression");
                    case Be:
                        return le();
                    case Ee:
                    case je:
                    case Ne:
                        var t = L();
                        return t.value = Ce, t.raw = de.slice(me, ye), z(), N(t, "Literal");
                    case on:
                    case hn:
                    case un:
                        var t = L();
                        return t.value = be.atomValue, t.raw = be.keyword, z(), N(t, "Literal");
                    case pn:
                        var e = we,
                            n = me;
                        z();
                        var i = J();
                        return i.start = n, i.end = ye, ce.locations && (i.loc.start = e, i.loc.end = xe), ce.ranges && (i.range = [n, ye]), F(vn), i;
                    case dn:
                        var t = L();
                        return z(), t.elements = ue(fn, !0, !0), N(t, "ArrayExpression");
                    case _n:
                        return ae();
                    case Xe:
                        var t = L();
                        return z(), he(t, !1);
                    case sn:
                        return se();
                    default:
                        q()
                }
            }

            function se() {
                var t = L();
                return z(), t.callee = ie(re(), !0), t.arguments = B(pn) ? ue(vn, !1) : Le, N(t, "NewExpression")
            }

            function ae() {
                var t = L(),
                    e = !0,
                    i = !1;
                for (t.properties = [], z(); !B(gn);) {
                    if (e) e = !1;
                    else if (F(mn), ce.allowTrailingCommas && B(gn)) break;
                    var r, s = {
                            key: oe()
                        },
                        a = !1;
                    if (B(wn) ? (s.value = J(!0), r = s.kind = "init") : ce.ecmaVersion >= 5 && "Identifier" === s.key.type && ("get" === s.key.name || "set" === s.key.name) ? (a = i = !0, r = s.kind = s.key.name, s.key = oe(), be !== pn && q(), s.value = he(L(), !1)) : q(), "Identifier" === s.key.type && (Te || i))
                        for (var o = 0; o < t.properties.length; ++o) {
                            var h = t.properties[o];
                            if (h.key.name === s.key.name) {
                                var u = r == h.kind || a && "init" === h.kind || "init" === r && ("get" === h.kind || "set" === h.kind);
                                u && !Te && "init" === r && "init" === h.kind && (u = !1), u && n(s.key.start, "Redefinition of property")
                            }
                        }
                    t.properties.push(s)
                }
                return N(t, "ObjectExpression")
            }

            function oe() {
                return be === Ee || be === je ? re() : le(!0)
            }

            function he(t, e) {
                be === Be ? t.id = le() : e ? q() : t.id = null, t.params = [];
                var i = !0;
                for (F(pn); !B(vn);) i ? i = !1 : F(mn), t.params.push(le());
                var r = Ae,
                    s = Oe;
                if (Ae = !0, Oe = [], t.body = W(!0), Ae = r, Oe = s, Te || t.body.body.length && j(t.body.body[0]))
                    for (var a = t.id ? -1 : 0; a < t.params.length; ++a) {
                        var o = 0 > a ? t.id : t.params[a];
                        if ((Vn(o.name) || Zn(o.name)) && n(o.start, "Defining '" + o.name + "' in strict mode"), a >= 0)
                            for (var h = 0; a > h; ++h) o.name === t.params[h].name && n(o.start, "Argument name clash in strict mode")
                    }
                return N(t, e ? "FunctionDeclaration" : "FunctionExpression")
            }

            function ue(t, e, n) {
                for (var i = [], r = !0; !B(t);) {
                    if (r) r = !1;
                    else if (F(mn), e && ce.allowTrailingCommas && B(t)) break;
                    n && be === mn ? i.push(null) : i.push(J(!0))
                }
                return i
            }

            function le(t) {
                var e = L();
                return e.name = be === Be ? Ce : t && !ce.forbidReserved && be.keyword || q(), Se = !1, z(), N(e, "Identifier")
            }
            t.version = "0.4.0";
            var ce, de, fe, _e;
            t.parse = function(t, n) {
                return de = t + "", fe = de.length, e(n), s(), Z(ce.program)
            };
            var ge = t.defaultOptions = {
                    ecmaVersion: 5,
                    strictSemicolons: !1,
                    allowTrailingCommas: !0,
                    forbidReserved: !1,
                    locations: !1,
                    onComment: null,
                    ranges: !1,
                    program: null,
                    sourceFile: null
                },
                pe = t.getLineInfo = function(t, e) {
                    for (var n = 1, i = 0;;) {
                        Yn.lastIndex = i;
                        var r = Yn.exec(t);
                        if (!(r && r.index < e)) break;
                        ++n, i = r.index + r[0].length
                    }
                    return {
                        line: n,
                        column: e - i
                    }
                };
            t.tokenize = function(t, n) {
                function i(t) {
                    return y(t), r.start = me, r.end = ye, r.startLoc = we, r.endLoc = xe, r.type = be, r.value = Ce, r
                }
                de = t + "", fe = de.length, e(n), s();
                var r = {};
                return i.jumpTo = function(t, e) {
                    if (ve = t, ce.locations) {
                        Pe = 1, ke = Yn.lastIndex = 0;
                        for (var n;
                            (n = Yn.exec(de)) && n.index < t;) ++Pe, ke = n.index + n[0].length
                    }
                    Se = e, u()
                }, i
            };
            var ve, me, ye, we, xe, be, Ce, Se, Pe, ke, Me, Ie, ze, Ae, Oe, Te, Le = [],
                Ee = {
                    type: "num"
                },
                Ne = {
                    type: "regexp"
                },
                je = {
                    type: "string"
                },
                Be = {
                    type: "name"
                },
                De = {
                    type: "eof"
                },
                Re = {
                    keyword: "break"
                },
                Fe = {
                    keyword: "case",
                    beforeExpr: !0
                },
                qe = {
                    keyword: "catch"
                },
                Ve = {
                    keyword: "continue"
                },
                Ze = {
                    keyword: "debugger"
                },
                Ue = {
                    keyword: "default"
                },
                He = {
                    keyword: "do",
                    isLoop: !0
                },
                We = {
                    keyword: "else",
                    beforeExpr: !0
                },
                Ge = {
                    keyword: "finally"
                },
                $e = {
                    keyword: "for",
                    isLoop: !0
                },
                Xe = {
                    keyword: "function"
                },
                Je = {
                    keyword: "if"
                },
                Ye = {
                    keyword: "return",
                    beforeExpr: !0
                },
                Ke = {
                    keyword: "switch"
                },
                Qe = {
                    keyword: "throw",
                    beforeExpr: !0
                },
                tn = {
                    keyword: "try"
                },
                en = {
                    keyword: "var"
                },
                nn = {
                    keyword: "while",
                    isLoop: !0
                },
                rn = {
                    keyword: "with"
                },
                sn = {
                    keyword: "new",
                    beforeExpr: !0
                },
                an = {
                    keyword: "this"
                },
                on = {
                    keyword: "null",
                    atomValue: null
                },
                hn = {
                    keyword: "true",
                    atomValue: !0
                },
                un = {
                    keyword: "false",
                    atomValue: !1
                },
                ln = {
                    keyword: "in",
                    binop: 7,
                    beforeExpr: !0
                },
                cn = {
                    "break": Re,
                    "case": Fe,
                    "catch": qe,
                    "continue": Ve,
                    "debugger": Ze,
                    "default": Ue,
                    "do": He,
                    "else": We,
                    "finally": Ge,
                    "for": $e,
                    "function": Xe,
                    "if": Je,
                    "return": Ye,
                    "switch": Ke,
                    "throw": Qe,
                    "try": tn,
                    "var": en,
                    "while": nn,
                    "with": rn,
                    "null": on,
                    "true": hn,
                    "false": un,
                    "new": sn,
                    "in": ln,
                    "instanceof": {
                        keyword: "instanceof",
                        binop: 7,
                        beforeExpr: !0
                    },
                    "this": an,
                    "typeof": {
                        keyword: "typeof",
                        prefix: !0,
                        beforeExpr: !0
                    },
                    "void": {
                        keyword: "void",
                        prefix: !0,
                        beforeExpr: !0
                    },
                    "delete": {
                        keyword: "delete",
                        prefix: !0,
                        beforeExpr: !0
                    }
                },
                dn = {
                    type: "[",
                    beforeExpr: !0
                },
                fn = {
                    type: "]"
                },
                _n = {
                    type: "{",
                    beforeExpr: !0
                },
                gn = {
                    type: "}"
                },
                pn = {
                    type: "(",
                    beforeExpr: !0
                },
                vn = {
                    type: ")"
                },
                mn = {
                    type: ",",
                    beforeExpr: !0
                },
                yn = {
                    type: ";",
                    beforeExpr: !0
                },
                wn = {
                    type: ":",
                    beforeExpr: !0
                },
                xn = {
                    type: "."
                },
                bn = {
                    type: "?",
                    beforeExpr: !0
                },
                Cn = {
                    binop: 10,
                    beforeExpr: !0
                },
                Sn = {
                    isAssign: !0,
                    beforeExpr: !0
                },
                Pn = {
                    isAssign: !0,
                    beforeExpr: !0
                },
                kn = {
                    binop: 9,
                    prefix: !0,
                    beforeExpr: !0
                },
                Mn = {
                    postfix: !0,
                    prefix: !0,
                    isUpdate: !0
                },
                In = {
                    prefix: !0,
                    beforeExpr: !0
                },
                zn = {
                    binop: 1,
                    beforeExpr: !0
                },
                An = {
                    binop: 2,
                    beforeExpr: !0
                },
                On = {
                    binop: 3,
                    beforeExpr: !0
                },
                Tn = {
                    binop: 4,
                    beforeExpr: !0
                },
                Ln = {
                    binop: 5,
                    beforeExpr: !0
                },
                En = {
                    binop: 6,
                    beforeExpr: !0
                },
                Nn = {
                    binop: 7,
                    beforeExpr: !0
                },
                jn = {
                    binop: 8,
                    beforeExpr: !0
                },
                Bn = {
                    binop: 10,
                    beforeExpr: !0
                };
            t.tokTypes = {
                bracketL: dn,
                bracketR: fn,
                braceL: _n,
                braceR: gn,
                parenL: pn,
                parenR: vn,
                comma: mn,
                semi: yn,
                colon: wn,
                dot: xn,
                question: bn,
                slash: Cn,
                eq: Sn,
                name: Be,
                eof: De,
                num: Ee,
                regexp: Ne,
                string: je
            };
            for (var Dn in cn) t.tokTypes["_" + Dn] = cn[Dn];
            var Rn, Fn = i("abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile"),
                qn = i("class enum extends super const export import"),
                Vn = i("implements interface let package private protected public static yield"),
                Zn = i("eval arguments"),
                Un = i("break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this"),
                Hn = /[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/,
                Wn = "\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0\u08a2-\u08ac\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191c\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua697\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa80-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc",
                Gn = "\u0300-\u036f\u0483-\u0487\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u0620-\u0649\u0672-\u06d3\u06e7-\u06e8\u06fb-\u06fc\u0730-\u074a\u0800-\u0814\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0840-\u0857\u08e4-\u08fe\u0900-\u0903\u093a-\u093c\u093e-\u094f\u0951-\u0957\u0962-\u0963\u0966-\u096f\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09d7\u09df-\u09e0\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a66-\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2-\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b5f-\u0b60\u0b66-\u0b6f\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0be6-\u0bef\u0c01-\u0c03\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62-\u0c63\u0c66-\u0c6f\u0c82\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2-\u0ce3\u0ce6-\u0cef\u0d02\u0d03\u0d46-\u0d48\u0d57\u0d62-\u0d63\u0d66-\u0d6f\u0d82\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e34-\u0e3a\u0e40-\u0e45\u0e50-\u0e59\u0eb4-\u0eb9\u0ec8-\u0ecd\u0ed0-\u0ed9\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f41-\u0f47\u0f71-\u0f84\u0f86-\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u1029\u1040-\u1049\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f-\u109d\u135d-\u135f\u170e-\u1710\u1720-\u1730\u1740-\u1750\u1772\u1773\u1780-\u17b2\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u1920-\u192b\u1930-\u193b\u1951-\u196d\u19b0-\u19c0\u19c8-\u19c9\u19d0-\u19d9\u1a00-\u1a15\u1a20-\u1a53\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1b46-\u1b4b\u1b50-\u1b59\u1b6b-\u1b73\u1bb0-\u1bb9\u1be6-\u1bf3\u1c00-\u1c22\u1c40-\u1c49\u1c5b-\u1c7d\u1cd0-\u1cd2\u1d00-\u1dbe\u1e01-\u1f15\u200c\u200d\u203f\u2040\u2054\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2d81-\u2d96\u2de0-\u2dff\u3021-\u3028\u3099\u309a\ua640-\ua66d\ua674-\ua67d\ua69f\ua6f0-\ua6f1\ua7f8-\ua800\ua806\ua80b\ua823-\ua827\ua880-\ua881\ua8b4-\ua8c4\ua8d0-\ua8d9\ua8f3-\ua8f7\ua900-\ua909\ua926-\ua92d\ua930-\ua945\ua980-\ua983\ua9b3-\ua9c0\uaa00-\uaa27\uaa40-\uaa41\uaa4c-\uaa4d\uaa50-\uaa59\uaa7b\uaae0-\uaae9\uaaf2-\uaaf3\uabc0-\uabe1\uabec\uabed\uabf0-\uabf9\ufb20-\ufb28\ufe00-\ufe0f\ufe20-\ufe26\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff3f",
                $n = RegExp("[" + Wn + "]"),
                Xn = RegExp("[" + Wn + Gn + "]"),
                Jn = /[\n\r\u2028\u2029]/,
                Yn = /\r\n|[\n\r\u2028\u2029]/g,
                Kn = t.isIdentifierStart = function(t) {
                    return 65 > t ? 36 === t : 91 > t ? !0 : 97 > t ? 95 === t : 123 > t ? !0 : t >= 170 && $n.test(String.fromCharCode(t))
                },
                Qn = t.isIdentifierChar = function(t) {
                    return 48 > t ? 36 === t : 58 > t ? !0 : 65 > t ? !1 : 91 > t ? !0 : 97 > t ? 95 === t : 123 > t ? !0 : t >= 170 && Xn.test(String.fromCharCode(t))
                },
                ti = {
                    kind: "loop"
                },
                ei = {
                    kind: "switch"
                }
        });
        var g = {
                "+": "__add",
                "-": "__subtract",
                "*": "__multiply",
                "/": "__divide",
                "%": "__modulo",
                "==": "equals",
                "!=": "equals"
            },
            p = {
                "-": "__negate",
                "+": null
            },
            v = e.each(["add", "subtract", "multiply", "divide", "modulo", "negate"], function(t) {
                this["__" + t] = "#" + t
            }, {});
        return h.inject(v), c.inject(v), R.inject(v), "complete" === document.readyState ? setTimeout(u) : U.add(window, {
            load: u
        }), {
            compile: s,
            execute: a,
            load: l,
            parse: i
        }
    }.call(this), paper = new(r.inject(e.exports, {
        enumerable: !0,
        Base: e,
        Numerical: o,
        Key: X
    })), "function" == typeof define && define.amd ? define("paper", paper) : "object" == typeof module && module && (module.exports = paper), paper
};
(function($) {
    function injector(t, splitter, klass, after) {
        var a = t.text().split(splitter),
            inject = '';
        if (a.length) {
            $(a).each(function(i, item) {
                inject += '<span class="' + klass + (i + 1) + '">' + item + '</span>' + after
            });
            t.empty().append(inject)
        }
    }
    var methods = {
        init: function() {
            return this.each(function() {
                injector($(this), '', 'char', '')
            })
        },
        words: function() {
            return this.each(function() {
                injector($(this), ' ', 'word', ' ')
            })
        },
        lines: function() {
            return this.each(function() {
                var r = "eefec303079ad17405c889e092e105b0";
                injector($(this).children("br").replaceWith(r).end(), r, 'line', '')
            })
        }
    };
    $.fn.lettering = function(method) {
        if (method && methods[method]) {
            return methods[method].apply(this, [].slice.call(arguments, 1))
        } else if (method === 'letters' || !method) {
            return methods.init.apply(this, [].slice.call(arguments, 0))
        }
        $.error('Method ' + method + ' does not exist on jQuery.lettering');
        return this
    }
})(jQuery);
/*!
 * VERSION: 1.16.1
 * DATE: 2015-03-13
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2015, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
var _gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window;
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function() {
        "use strict";
        _gsScope._gsDefine("plugins.CSSPlugin", ["plugins.TweenPlugin", "TweenLite"], function(t, e) {
            var i, r, s, n, a = function() {
                    t.call(this, "css"), this._overwriteProps.length = 0, this.setRatio = a.prototype.setRatio
                },
                o = _gsScope._gsDefine.globals,
                l = {},
                h = a.prototype = new t("css");
            h.constructor = a, a.version = "1.16.1", a.API = 2, a.defaultTransformPerspective = 0, a.defaultSkewType = "compensated", h = "px", a.suffixMap = {
                top: h,
                right: h,
                bottom: h,
                left: h,
                width: h,
                height: h,
                fontSize: h,
                padding: h,
                margin: h,
                perspective: h,
                lineHeight: ""
            };
            var u, f, p, c, _, d, m = /(?:\d|\-\d|\.\d|\-\.\d)+/g,
                g = /(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g,
                v = /(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi,
                y = /(?![+-]?\d*\.?\d+|[+-]|e[+-]\d+)[^0-9]/g,
                x = /(?:\d|\-|\+|=|#|\.)*/g,
                T = /opacity *= *([^)]*)/i,
                w = /opacity:([^;]*)/i,
                b = /alpha\(opacity *=.+?\)/i,
                P = /^(rgb|hsl)/,
                S = /([A-Z])/g,
                C = /-([a-z])/gi,
                O = /(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi,
                R = function(t, e) {
                    return e.toUpperCase()
                },
                k = /(?:Left|Right|Width)/i,
                A = /(M11|M12|M21|M22)=[\d\-\.e]+/gi,
                M = /progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i,
                D = /,(?=[^\)]*(?:\(|$))/gi,
                N = Math.PI / 180,
                L = 180 / Math.PI,
                X = {},
                z = document,
                E = function(t) {
                    return z.createElementNS ? z.createElementNS("http://www.w3.org/1999/xhtml", t) : z.createElement(t)
                },
                F = E("div"),
                I = E("img"),
                B = a._internals = {
                    _specialProps: l
                },
                Y = navigator.userAgent,
                U = function() {
                    var t = Y.indexOf("Android"),
                        e = E("a");
                    return p = -1 !== Y.indexOf("Safari") && -1 === Y.indexOf("Chrome") && (-1 === t || Number(Y.substr(t + 8, 1)) > 3), _ = p && 6 > Number(Y.substr(Y.indexOf("Version/") + 8, 1)), c = -1 !== Y.indexOf("Firefox"), (/MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(Y) || /Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(Y)) && (d = parseFloat(RegExp.$1)), e ? (e.style.cssText = "top:1px;opacity:.55;", /^0.55/.test(e.style.opacity)) : !1
                }(),
                j = function(t) {
                    return T.test("string" == typeof t ? t : (t.currentStyle ? t.currentStyle.filter : t.style.filter) || "") ? parseFloat(RegExp.$1) / 100 : 1
                },
                V = function(t) {
                    window.console && console.log(t)
                },
                W = "",
                q = "",
                G = function(t, e) {
                    e = e || F;
                    var i, r, s = e.style;
                    if (void 0 !== s[t]) return t;
                    for (t = t.charAt(0).toUpperCase() + t.substr(1), i = ["O", "Moz", "ms", "Ms", "Webkit"], r = 5; --r > -1 && void 0 === s[i[r] + t];);
                    return r >= 0 ? (q = 3 === r ? "ms" : i[r], W = "-" + q.toLowerCase() + "-", q + t) : null
                },
                H = z.defaultView ? z.defaultView.getComputedStyle : function() {},
                Q = a.getStyle = function(t, e, i, r, s) {
                    var n;
                    return U || "opacity" !== e ? (!r && t.style[e] ? n = t.style[e] : (i = i || H(t)) ? n = i[e] || i.getPropertyValue(e) || i.getPropertyValue(e.replace(S, "-$1").toLowerCase()) : t.currentStyle && (n = t.currentStyle[e]), null == s || n && "none" !== n && "auto" !== n && "auto auto" !== n ? n : s) : j(t)
                },
                Z = B.convertToPixels = function(t, i, r, s, n) {
                    if ("px" === s || !s) return r;
                    if ("auto" === s || !r) return 0;
                    var o, l, h, u = k.test(i),
                        f = t,
                        p = F.style,
                        c = 0 > r;
                    if (c && (r = -r), "%" === s && -1 !== i.indexOf("border")) o = r / 100 * (u ? t.clientWidth : t.clientHeight);
                    else {
                        if (p.cssText = "border:0 solid red;position:" + Q(t, "position") + ";line-height:0;", "%" !== s && f.appendChild) p[u ? "borderLeftWidth" : "borderTopWidth"] = r + s;
                        else {
                            if (f = t.parentNode || z.body, l = f._gsCache, h = e.ticker.frame, l && u && l.time === h) return l.width * r / 100;
                            p[u ? "width" : "height"] = r + s
                        }
                        f.appendChild(F), o = parseFloat(F[u ? "offsetWidth" : "offsetHeight"]), f.removeChild(F), u && "%" === s && a.cacheWidths !== !1 && (l = f._gsCache = f._gsCache || {}, l.time = h, l.width = 100 * (o / r)), 0 !== o || n || (o = Z(t, i, r, s, !0))
                    }
                    return c ? -o : o
                },
                $ = B.calculateOffset = function(t, e, i) {
                    if ("absolute" !== Q(t, "position", i)) return 0;
                    var r = "left" === e ? "Left" : "Top",
                        s = Q(t, "margin" + r, i);
                    return t["offset" + r] - (Z(t, e, parseFloat(s), s.replace(x, "")) || 0)
                },
                K = function(t, e) {
                    var i, r, s, n = {};
                    if (e = e || H(t, null))
                        if (i = e.length)
                            for (; --i > -1;) s = e[i], (-1 === s.indexOf("-transform") || be === s) && (n[s.replace(C, R)] = e.getPropertyValue(s));
                        else
                            for (i in e)(-1 === i.indexOf("Transform") || we === i) && (n[i] = e[i]);
                    else if (e = t.currentStyle || t.style)
                        for (i in e) "string" == typeof i && void 0 === n[i] && (n[i.replace(C, R)] = e[i]);
                    return U || (n.opacity = j(t)), r = De(t, e, !1), n.rotation = r.rotation, n.skewX = r.skewX, n.scaleX = r.scaleX, n.scaleY = r.scaleY, n.x = r.x, n.y = r.y, Se && (n.z = r.z, n.rotationX = r.rotationX, n.rotationY = r.rotationY, n.scaleZ = r.scaleZ), n.filters && delete n.filters, n
                },
                J = function(t, e, i, r, s) {
                    var n, a, o, l = {},
                        h = t.style;
                    for (a in i) "cssText" !== a && "length" !== a && isNaN(a) && (e[a] !== (n = i[a]) || s && s[a]) && -1 === a.indexOf("Origin") && ("number" == typeof n || "string" == typeof n) && (l[a] = "auto" !== n || "left" !== a && "top" !== a ? "" !== n && "auto" !== n && "none" !== n || "string" != typeof e[a] || "" === e[a].replace(y, "") ? n : 0 : $(t, a), void 0 !== h[a] && (o = new ce(h, a, h[a], o)));
                    if (r)
                        for (a in r) "className" !== a && (l[a] = r[a]);
                    return {
                        difs: l,
                        firstMPT: o
                    }
                },
                te = {
                    width: ["Left", "Right"],
                    height: ["Top", "Bottom"]
                },
                ee = ["marginLeft", "marginRight", "marginTop", "marginBottom"],
                ie = function(t, e, i) {
                    var r = parseFloat("width" === e ? t.offsetWidth : t.offsetHeight),
                        s = te[e],
                        n = s.length;
                    for (i = i || H(t, null); --n > -1;) r -= parseFloat(Q(t, "padding" + s[n], i, !0)) || 0, r -= parseFloat(Q(t, "border" + s[n] + "Width", i, !0)) || 0;
                    return r
                },
                re = function(t, e) {
                    (null == t || "" === t || "auto" === t || "auto auto" === t) && (t = "0 0");
                    var i = t.split(" "),
                        r = -1 !== t.indexOf("left") ? "0%" : -1 !== t.indexOf("right") ? "100%" : i[0],
                        s = -1 !== t.indexOf("top") ? "0%" : -1 !== t.indexOf("bottom") ? "100%" : i[1];
                    return null == s ? s = "center" === r ? "50%" : "0" : "center" === s && (s = "50%"), ("center" === r || isNaN(parseFloat(r)) && -1 === (r + "").indexOf("=")) && (r = "50%"), t = r + " " + s + (i.length > 2 ? " " + i[2] : ""), e && (e.oxp = -1 !== r.indexOf("%"), e.oyp = -1 !== s.indexOf("%"), e.oxr = "=" === r.charAt(1), e.oyr = "=" === s.charAt(1), e.ox = parseFloat(r.replace(y, "")), e.oy = parseFloat(s.replace(y, "")), e.v = t), e || t
                },
                se = function(t, e) {
                    return "string" == typeof t && "=" === t.charAt(1) ? parseInt(t.charAt(0) + "1", 10) * parseFloat(t.substr(2)) : parseFloat(t) - parseFloat(e)
                },
                ne = function(t, e) {
                    return null == t ? e : "string" == typeof t && "=" === t.charAt(1) ? parseInt(t.charAt(0) + "1", 10) * parseFloat(t.substr(2)) + e : parseFloat(t)
                },
                ae = function(t, e, i, r) {
                    var s, n, a, o, l, h = 1e-6;
                    return null == t ? o = e : "number" == typeof t ? o = t : (s = 360, n = t.split("_"), l = "=" === t.charAt(1), a = (l ? parseInt(t.charAt(0) + "1", 10) * parseFloat(n[0].substr(2)) : parseFloat(n[0])) * (-1 === t.indexOf("rad") ? 1 : L) - (l ? 0 : e), n.length && (r && (r[i] = e + a), -1 !== t.indexOf("short") && (a %= s, a !== a % (s / 2) && (a = 0 > a ? a + s : a - s)), -1 !== t.indexOf("_cw") && 0 > a ? a = (a + 9999999999 * s) % s - (0 | a / s) * s : -1 !== t.indexOf("ccw") && a > 0 && (a = (a - 9999999999 * s) % s - (0 | a / s) * s)), o = e + a), h > o && o > -h && (o = 0), o
                },
                oe = {
                    aqua: [0, 255, 255],
                    lime: [0, 255, 0],
                    silver: [192, 192, 192],
                    black: [0, 0, 0],
                    maroon: [128, 0, 0],
                    teal: [0, 128, 128],
                    blue: [0, 0, 255],
                    navy: [0, 0, 128],
                    white: [255, 255, 255],
                    fuchsia: [255, 0, 255],
                    olive: [128, 128, 0],
                    yellow: [255, 255, 0],
                    orange: [255, 165, 0],
                    gray: [128, 128, 128],
                    purple: [128, 0, 128],
                    green: [0, 128, 0],
                    red: [255, 0, 0],
                    pink: [255, 192, 203],
                    cyan: [0, 255, 255],
                    transparent: [255, 255, 255, 0]
                },
                le = function(t, e, i) {
                    return t = 0 > t ? t + 1 : t > 1 ? t - 1 : t, 0 | 255 * (1 > 6 * t ? e + 6 * (i - e) * t : .5 > t ? i : 2 > 3 * t ? e + 6 * (i - e) * (2 / 3 - t) : e) + .5
                },
                he = a.parseColor = function(t) {
                    var e, i, r, s, n, a;
                    return t && "" !== t ? "number" == typeof t ? [t >> 16, 255 & t >> 8, 255 & t] : ("," === t.charAt(t.length - 1) && (t = t.substr(0, t.length - 1)), oe[t] ? oe[t] : "#" === t.charAt(0) ? (4 === t.length && (e = t.charAt(1), i = t.charAt(2), r = t.charAt(3), t = "#" + e + e + i + i + r + r), t = parseInt(t.substr(1), 16), [t >> 16, 255 & t >> 8, 255 & t]) : "hsl" === t.substr(0, 3) ? (t = t.match(m), s = Number(t[0]) % 360 / 360, n = Number(t[1]) / 100, a = Number(t[2]) / 100, i = .5 >= a ? a * (n + 1) : a + n - a * n, e = 2 * a - i, t.length > 3 && (t[3] = Number(t[3])), t[0] = le(s + 1 / 3, e, i), t[1] = le(s, e, i), t[2] = le(s - 1 / 3, e, i), t) : (t = t.match(m) || oe.transparent, t[0] = Number(t[0]), t[1] = Number(t[1]), t[2] = Number(t[2]), t.length > 3 && (t[3] = Number(t[3])), t)) : oe.black
                },
                ue = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#.+?\\b";
            for (h in oe) ue += "|" + h + "\\b";
            ue = RegExp(ue + ")", "gi");
            var fe = function(t, e, i, r) {
                    if (null == t) return function(t) {
                        return t
                    };
                    var s, n = e ? (t.match(ue) || [""])[0] : "",
                        a = t.split(n).join("").match(v) || [],
                        o = t.substr(0, t.indexOf(a[0])),
                        l = ")" === t.charAt(t.length - 1) ? ")" : "",
                        h = -1 !== t.indexOf(" ") ? " " : ",",
                        u = a.length,
                        f = u > 0 ? a[0].replace(m, "") : "";
                    return u ? s = e ? function(t) {
                        var e, p, c, _;
                        if ("number" == typeof t) t += f;
                        else if (r && D.test(t)) {
                            for (_ = t.replace(D, "|").split("|"), c = 0; _.length > c; c++) _[c] = s(_[c]);
                            return _.join(",")
                        }
                        if (e = (t.match(ue) || [n])[0], p = t.split(e).join("").match(v) || [], c = p.length, u > c--)
                            for (; u > ++c;) p[c] = i ? p[0 | (c - 1) / 2] : a[c];
                        return o + p.join(h) + h + e + l + (-1 !== t.indexOf("inset") ? " inset" : "")
                    } : function(t) {
                        var e, n, p;
                        if ("number" == typeof t) t += f;
                        else if (r && D.test(t)) {
                            for (n = t.replace(D, "|").split("|"), p = 0; n.length > p; p++) n[p] = s(n[p]);
                            return n.join(",")
                        }
                        if (e = t.match(v) || [], p = e.length, u > p--)
                            for (; u > ++p;) e[p] = i ? e[0 | (p - 1) / 2] : a[p];
                        return o + e.join(h) + l
                    } : function(t) {
                        return t
                    }
                },
                pe = function(t) {
                    return t = t.split(","),
                        function(e, i, r, s, n, a, o) {
                            var l, h = (i + "").split(" ");
                            for (o = {}, l = 0; 4 > l; l++) o[t[l]] = h[l] = h[l] || h[(l - 1) / 2 >> 0];
                            return s.parse(e, o, n, a)
                        }
                },
                ce = (B._setPluginRatio = function(t) {
                    this.plugin.setRatio(t);
                    for (var e, i, r, s, n = this.data, a = n.proxy, o = n.firstMPT, l = 1e-6; o;) e = a[o.v], o.r ? e = Math.round(e) : l > e && e > -l && (e = 0), o.t[o.p] = e, o = o._next;
                    if (n.autoRotate && (n.autoRotate.rotation = a.rotation), 1 === t)
                        for (o = n.firstMPT; o;) {
                            if (i = o.t, i.type) {
                                if (1 === i.type) {
                                    for (s = i.xs0 + i.s + i.xs1, r = 1; i.l > r; r++) s += i["xn" + r] + i["xs" + (r + 1)];
                                    i.e = s
                                }
                            } else i.e = i.s + i.xs0;
                            o = o._next
                        }
                }, function(t, e, i, r, s) {
                    this.t = t, this.p = e, this.v = i, this.r = s, r && (r._prev = this, this._next = r)
                }),
                _e = (B._parseToProxy = function(t, e, i, r, s, n) {
                    var a, o, l, h, u, f = r,
                        p = {},
                        c = {},
                        _ = i._transform,
                        d = X;
                    for (i._transform = null, X = e, r = u = i.parse(t, e, r, s), X = d, n && (i._transform = _, f && (f._prev = null, f._prev && (f._prev._next = null))); r && r !== f;) {
                        if (1 >= r.type && (o = r.p, c[o] = r.s + r.c, p[o] = r.s, n || (h = new ce(r, "s", o, h, r.r), r.c = 0), 1 === r.type))
                            for (a = r.l; --a > 0;) l = "xn" + a, o = r.p + "_" + l, c[o] = r.data[l], p[o] = r[l], n || (h = new ce(r, l, o, h, r.rxp[l]));
                        r = r._next
                    }
                    return {
                        proxy: p,
                        end: c,
                        firstMPT: h,
                        pt: u
                    }
                }, B.CSSPropTween = function(t, e, r, s, a, o, l, h, u, f, p) {
                    this.t = t, this.p = e, this.s = r, this.c = s, this.n = l || e, t instanceof _e || n.push(this.n), this.r = h, this.type = o || 0, u && (this.pr = u, i = !0), this.b = void 0 === f ? r : f, this.e = void 0 === p ? r + s : p, a && (this._next = a, a._prev = this)
                }),
                de = a.parseComplex = function(t, e, i, r, s, n, a, o, l, h) {
                    i = i || n || "", a = new _e(t, e, 0, 0, a, h ? 2 : 1, null, !1, o, i, r), r += "";
                    var f, p, c, _, d, v, y, x, T, w, b, S, C = i.split(", ").join(",").split(" "),
                        O = r.split(", ").join(",").split(" "),
                        R = C.length,
                        k = u !== !1;
                    for ((-1 !== r.indexOf(",") || -1 !== i.indexOf(",")) && (C = C.join(" ").replace(D, ", ").split(" "), O = O.join(" ").replace(D, ", ").split(" "), R = C.length), R !== O.length && (C = (n || "").split(" "), R = C.length), a.plugin = l, a.setRatio = h, f = 0; R > f; f++)
                        if (_ = C[f], d = O[f], x = parseFloat(_), x || 0 === x) a.appendXtra("", x, se(d, x), d.replace(g, ""), k && -1 !== d.indexOf("px"), !0);
                        else if (s && ("#" === _.charAt(0) || oe[_] || P.test(_))) S = "," === d.charAt(d.length - 1) ? ")," : ")", _ = he(_), d = he(d), T = _.length + d.length > 6, T && !U && 0 === d[3] ? (a["xs" + a.l] += a.l ? " transparent" : "transparent", a.e = a.e.split(O[f]).join("transparent")) : (U || (T = !1), a.appendXtra(T ? "rgba(" : "rgb(", _[0], d[0] - _[0], ",", !0, !0).appendXtra("", _[1], d[1] - _[1], ",", !0).appendXtra("", _[2], d[2] - _[2], T ? "," : S, !0), T && (_ = 4 > _.length ? 1 : _[3], a.appendXtra("", _, (4 > d.length ? 1 : d[3]) - _, S, !1)));
                    else if (v = _.match(m)) {
                        if (y = d.match(g), !y || y.length !== v.length) return a;
                        for (c = 0, p = 0; v.length > p; p++) b = v[p], w = _.indexOf(b, c), a.appendXtra(_.substr(c, w - c), Number(b), se(y[p], b), "", k && "px" === _.substr(w + b.length, 2), 0 === p), c = w + b.length;
                        a["xs" + a.l] += _.substr(c)
                    } else a["xs" + a.l] += a.l ? " " + _ : _;
                    if (-1 !== r.indexOf("=") && a.data) {
                        for (S = a.xs0 + a.data.s, f = 1; a.l > f; f++) S += a["xs" + f] + a.data["xn" + f];
                        a.e = S + a["xs" + f]
                    }
                    return a.l || (a.type = -1, a.xs0 = a.e), a.xfirst || a
                },
                me = 9;
            for (h = _e.prototype, h.l = h.pr = 0; --me > 0;) h["xn" + me] = 0, h["xs" + me] = "";
            h.xs0 = "", h._next = h._prev = h.xfirst = h.data = h.plugin = h.setRatio = h.rxp = null, h.appendXtra = function(t, e, i, r, s, n) {
                var a = this,
                    o = a.l;
                return a["xs" + o] += n && o ? " " + t : t || "", i || 0 === o || a.plugin ? (a.l++, a.type = a.setRatio ? 2 : 1, a["xs" + a.l] = r || "", o > 0 ? (a.data["xn" + o] = e + i, a.rxp["xn" + o] = s, a["xn" + o] = e, a.plugin || (a.xfirst = new _e(a, "xn" + o, e, i, a.xfirst || a, 0, a.n, s, a.pr), a.xfirst.xs0 = 0), a) : (a.data = {
                    s: e + i
                }, a.rxp = {}, a.s = e, a.c = i, a.r = s, a)) : (a["xs" + o] += e + (r || ""), a)
            };
            var ge = function(t, e) {
                    e = e || {}, this.p = e.prefix ? G(t) || t : t, l[t] = l[this.p] = this, this.format = e.formatter || fe(e.defaultValue, e.color, e.collapsible, e.multi), e.parser && (this.parse = e.parser), this.clrs = e.color, this.multi = e.multi, this.keyword = e.keyword, this.dflt = e.defaultValue, this.pr = e.priority || 0
                },
                ve = B._registerComplexSpecialProp = function(t, e, i) {
                    "object" != typeof e && (e = {
                        parser: i
                    });
                    var r, s, n = t.split(","),
                        a = e.defaultValue;
                    for (i = i || [a], r = 0; n.length > r; r++) e.prefix = 0 === r && e.prefix, e.defaultValue = i[r] || a, s = new ge(n[r], e)
                },
                ye = function(t) {
                    if (!l[t]) {
                        var e = t.charAt(0).toUpperCase() + t.substr(1) + "Plugin";
                        ve(t, {
                            parser: function(t, i, r, s, n, a, h) {
                                var u = o.com.greensock.plugins[e];
                                return u ? (u._cssRegister(), l[r].parse(t, i, r, s, n, a, h)) : (V("Error: " + e + " js file not loaded."), n)
                            }
                        })
                    }
                };
            h = ge.prototype, h.parseComplex = function(t, e, i, r, s, n) {
                var a, o, l, h, u, f, p = this.keyword;
                if (this.multi && (D.test(i) || D.test(e) ? (o = e.replace(D, "|").split("|"), l = i.replace(D, "|").split("|")) : p && (o = [e], l = [i])), l) {
                    for (h = l.length > o.length ? l.length : o.length, a = 0; h > a; a++) e = o[a] = o[a] || this.dflt, i = l[a] = l[a] || this.dflt, p && (u = e.indexOf(p), f = i.indexOf(p), u !== f && (-1 === f ? o[a] = o[a].split(p).join("") : -1 === u && (o[a] += " " + p)));
                    e = o.join(", "), i = l.join(", ")
                }
                return de(t, this.p, e, i, this.clrs, this.dflt, r, this.pr, s, n)
            }, h.parse = function(t, e, i, r, n, a) {
                return this.parseComplex(t.style, this.format(Q(t, this.p, s, !1, this.dflt)), this.format(e), n, a)
            }, a.registerSpecialProp = function(t, e, i) {
                ve(t, {
                    parser: function(t, r, s, n, a, o) {
                        var l = new _e(t, s, 0, 0, a, 2, s, !1, i);
                        return l.plugin = o, l.setRatio = e(t, r, n._tween, s), l
                    },
                    priority: i
                })
            }, a.useSVGTransformAttr = p;
            var xe, Te = "scaleX,scaleY,scaleZ,x,y,z,skewX,skewY,rotation,rotationX,rotationY,perspective,xPercent,yPercent".split(","),
                we = G("transform"),
                be = W + "transform",
                Pe = G("transformOrigin"),
                Se = null !== G("perspective"),
                Ce = B.Transform = function() {
                    this.perspective = parseFloat(a.defaultTransformPerspective) || 0, this.force3D = a.defaultForce3D !== !1 && Se ? a.defaultForce3D || "auto" : !1
                },
                Oe = window.SVGElement,
                Re = function(t, e, i) {
                    var r, s = z.createElementNS("http://www.w3.org/2000/svg", t),
                        n = /([a-z])([A-Z])/g;
                    for (r in i) s.setAttributeNS(null, r.replace(n, "$1-$2").toLowerCase(), i[r]);
                    return e.appendChild(s), s
                },
                ke = z.documentElement,
                Ae = function() {
                    var t, e, i, r = d || /Android/i.test(Y) && !window.chrome;
                    return z.createElementNS && !r && (t = Re("svg", ke), e = Re("rect", t, {
                        width: 100,
                        height: 50,
                        x: 100
                    }), i = e.getBoundingClientRect().width, e.style[Pe] = "50% 50%", e.style[we] = "scaleX(0.5)", r = i === e.getBoundingClientRect().width && !(c && Se), ke.removeChild(t)), r
                }(),
                Me = function(t, e, i, r) {
                    var s, n;
                    r && (n = r.split(" ")).length || (s = t.getBBox(), e = re(e).split(" "), n = [(-1 !== e[0].indexOf("%") ? parseFloat(e[0]) / 100 * s.width : parseFloat(e[0])) + s.x, (-1 !== e[1].indexOf("%") ? parseFloat(e[1]) / 100 * s.height : parseFloat(e[1])) + s.y]), i.xOrigin = parseFloat(n[0]), i.yOrigin = parseFloat(n[1]), t.setAttribute("data-svg-origin", n.join(" "))
                },
                De = B.getTransform = function(t, e, i, r) {
                    if (t._gsTransform && i && !r) return t._gsTransform;
                    var n, o, l, h, u, f, p, c, _, d, m = i ? t._gsTransform || new Ce : new Ce,
                        g = 0 > m.scaleX,
                        v = 2e-5,
                        y = 1e5,
                        x = Se ? parseFloat(Q(t, Pe, e, !1, "0 0 0").split(" ")[2]) || m.zOrigin || 0 : 0,
                        T = parseFloat(a.defaultTransformPerspective) || 0;
                    if (we ? o = Q(t, be, e, !0) : t.currentStyle && (o = t.currentStyle.filter.match(A), o = o && 4 === o.length ? [o[0].substr(4), Number(o[2].substr(4)), Number(o[1].substr(4)), o[3].substr(4), m.x || 0, m.y || 0].join(",") : ""), n = !o || "none" === o || "matrix(1, 0, 0, 1, 0, 0)" === o, m.svg = !!(Oe && "function" == typeof t.getBBox && t.getCTM && (!t.parentNode || t.parentNode.getBBox && t.parentNode.getCTM)), m.svg && (n && -1 !== (t.style[we] + "").indexOf("matrix") && (o = t.style[we], n = !1), Me(t, Q(t, Pe, s, !1, "50% 50%") + "", m, t.getAttribute("data-svg-origin")), xe = a.useSVGTransformAttr || Ae, l = t.getAttribute("transform"), n && l && -1 !== l.indexOf("matrix") && (o = l, n = 0)), !n) {
                        for (l = (o || "").match(/(?:\-|\b)[\d\-\.e]+\b/gi) || [], h = l.length; --h > -1;) u = Number(l[h]), l[h] = (f = u - (u |= 0)) ? (0 | f * y + (0 > f ? -.5 : .5)) / y + u : u;
                        if (16 === l.length) {
                            var w, b, P, S, C, O = l[0],
                                R = l[1],
                                k = l[2],
                                M = l[3],
                                D = l[4],
                                N = l[5],
                                X = l[6],
                                z = l[7],
                                E = l[8],
                                F = l[9],
                                I = l[10],
                                B = l[12],
                                Y = l[13],
                                U = l[14],
                                j = l[11],
                                V = Math.atan2(X, I);
                            m.zOrigin && (U = -m.zOrigin, B = E * U - l[12], Y = F * U - l[13], U = I * U + m.zOrigin - l[14]), m.rotationX = V * L, V && (S = Math.cos(-V), C = Math.sin(-V), w = D * S + E * C, b = N * S + F * C, P = X * S + I * C, E = D * -C + E * S, F = N * -C + F * S, I = X * -C + I * S, j = z * -C + j * S, D = w, N = b, X = P), V = Math.atan2(E, I), m.rotationY = V * L, V && (S = Math.cos(-V), C = Math.sin(-V), w = O * S - E * C, b = R * S - F * C, P = k * S - I * C, F = R * C + F * S, I = k * C + I * S, j = M * C + j * S, O = w, R = b, k = P), V = Math.atan2(R, O), m.rotation = V * L, V && (S = Math.cos(-V), C = Math.sin(-V), O = O * S + D * C, b = R * S + N * C, N = R * -C + N * S, X = k * -C + X * S, R = b), m.rotationX && Math.abs(m.rotationX) + Math.abs(m.rotation) > 359.9 && (m.rotationX = m.rotation = 0, m.rotationY += 180), m.scaleX = (0 | Math.sqrt(O * O + R * R) * y + .5) / y, m.scaleY = (0 | Math.sqrt(N * N + F * F) * y + .5) / y, m.scaleZ = (0 | Math.sqrt(X * X + I * I) * y + .5) / y, m.skewX = 0, m.perspective = j ? 1 / (0 > j ? -j : j) : 0, m.x = B, m.y = Y, m.z = U, m.svg && (m.x -= m.xOrigin - (m.xOrigin * O - m.yOrigin * D), m.y -= m.yOrigin - (m.yOrigin * R - m.xOrigin * N))
                        } else if (!(Se && !r && l.length && m.x === l[4] && m.y === l[5] && (m.rotationX || m.rotationY) || void 0 !== m.x && "none" === Q(t, "display", e))) {
                            var W = l.length >= 6,
                                q = W ? l[0] : 1,
                                G = l[1] || 0,
                                H = l[2] || 0,
                                Z = W ? l[3] : 1;
                            m.x = l[4] || 0, m.y = l[5] || 0, p = Math.sqrt(q * q + G * G), c = Math.sqrt(Z * Z + H * H), _ = q || G ? Math.atan2(G, q) * L : m.rotation || 0, d = H || Z ? Math.atan2(H, Z) * L + _ : m.skewX || 0, Math.abs(d) > 90 && 270 > Math.abs(d) && (g ? (p *= -1, d += 0 >= _ ? 180 : -180, _ += 0 >= _ ? 180 : -180) : (c *= -1, d += 0 >= d ? 180 : -180)), m.scaleX = p, m.scaleY = c, m.rotation = _, m.skewX = d, Se && (m.rotationX = m.rotationY = m.z = 0, m.perspective = T, m.scaleZ = 1), m.svg && (m.x -= m.xOrigin - (m.xOrigin * q - m.yOrigin * G), m.y -= m.yOrigin - (m.yOrigin * Z - m.xOrigin * H))
                        }
                        m.zOrigin = x;
                        for (h in m) v > m[h] && m[h] > -v && (m[h] = 0)
                    }
                    return i && (t._gsTransform = m, m.svg && (xe && t.style[we] ? ze(t.style, we) : !xe && t.getAttribute("transform") && t.removeAttribute("transform"))), m
                },
                Ne = function(t) {
                    var e, i, r = this.data,
                        s = -r.rotation * N,
                        n = s + r.skewX * N,
                        a = 1e5,
                        o = (0 | Math.cos(s) * r.scaleX * a) / a,
                        l = (0 | Math.sin(s) * r.scaleX * a) / a,
                        h = (0 | Math.sin(n) * -r.scaleY * a) / a,
                        u = (0 | Math.cos(n) * r.scaleY * a) / a,
                        f = this.t.style,
                        p = this.t.currentStyle;
                    if (p) {
                        i = l, l = -h, h = -i, e = p.filter, f.filter = "";
                        var c, _, m = this.t.offsetWidth,
                            g = this.t.offsetHeight,
                            v = "absolute" !== p.position,
                            y = "progid:DXImageTransform.Microsoft.Matrix(M11=" + o + ", M12=" + l + ", M21=" + h + ", M22=" + u,
                            w = r.x + m * r.xPercent / 100,
                            b = r.y + g * r.yPercent / 100;
                        if (null != r.ox && (c = (r.oxp ? .01 * m * r.ox : r.ox) - m / 2, _ = (r.oyp ? .01 * g * r.oy : r.oy) - g / 2, w += c - (c * o + _ * l), b += _ - (c * h + _ * u)), v ? (c = m / 2, _ = g / 2, y += ", Dx=" + (c - (c * o + _ * l) + w) + ", Dy=" + (_ - (c * h + _ * u) + b) + ")") : y += ", sizingMethod='auto expand')", f.filter = -1 !== e.indexOf("DXImageTransform.Microsoft.Matrix(") ? e.replace(M, y) : y + " " + e, (0 === t || 1 === t) && 1 === o && 0 === l && 0 === h && 1 === u && (v && -1 === y.indexOf("Dx=0, Dy=0") || T.test(e) && 100 !== parseFloat(RegExp.$1) || -1 === e.indexOf("gradient(" && e.indexOf("Alpha")) && f.removeAttribute("filter")), !v) {
                            var P, S, C, O = 8 > d ? 1 : -1;
                            for (c = r.ieOffsetX || 0, _ = r.ieOffsetY || 0, r.ieOffsetX = Math.round((m - ((0 > o ? -o : o) * m + (0 > l ? -l : l) * g)) / 2 + w), r.ieOffsetY = Math.round((g - ((0 > u ? -u : u) * g + (0 > h ? -h : h) * m)) / 2 + b), me = 0; 4 > me; me++) S = ee[me], P = p[S], i = -1 !== P.indexOf("px") ? parseFloat(P) : Z(this.t, S, parseFloat(P), P.replace(x, "")) || 0, C = i !== r[S] ? 2 > me ? -r.ieOffsetX : -r.ieOffsetY : 2 > me ? c - r.ieOffsetX : _ - r.ieOffsetY, f[S] = (r[S] = Math.round(i - C * (0 === me || 2 === me ? 1 : O))) + "px"
                        }
                    }
                },
                Le = B.set3DTransformRatio = B.setTransformRatio = function(t) {
                    var e, i, r, s, n, a, o, l, h, u, f, p, _, d, m, g, v, y, x, T, w, b, P, S = this.data,
                        C = this.t.style,
                        O = S.rotation,
                        R = S.rotationX,
                        k = S.rotationY,
                        A = S.scaleX,
                        M = S.scaleY,
                        D = S.scaleZ,
                        L = S.x,
                        X = S.y,
                        z = S.z,
                        E = S.svg,
                        F = S.perspective,
                        I = S.force3D;
                    if (!(((1 !== t && 0 !== t || "auto" !== I || this.tween._totalTime !== this.tween._totalDuration && this.tween._totalTime) && I || z || F || k || R) && (!xe || !E) && Se)) return O || S.skewX || E ? (O *= N, b = S.skewX * N, P = 1e5, e = Math.cos(O) * A, s = Math.sin(O) * A, i = Math.sin(O - b) * -M, n = Math.cos(O - b) * M, b && "simple" === S.skewType && (v = Math.tan(b), v = Math.sqrt(1 + v * v), i *= v, n *= v), E && (L += S.xOrigin - (S.xOrigin * e + S.yOrigin * i), X += S.yOrigin - (S.xOrigin * s + S.yOrigin * n), d = 1e-6, d > L && L > -d && (L = 0), d > X && X > -d && (X = 0)), x = (0 | e * P) / P + "," + (0 | s * P) / P + "," + (0 | i * P) / P + "," + (0 | n * P) / P + "," + L + "," + X + ")", E && xe ? this.t.setAttribute("transform", "matrix(" + x) : C[we] = (S.xPercent || S.yPercent ? "translate(" + S.xPercent + "%," + S.yPercent + "%) matrix(" : "matrix(") + x) : C[we] = (S.xPercent || S.yPercent ? "translate(" + S.xPercent + "%," + S.yPercent + "%) matrix(" : "matrix(") + A + ",0,0," + M + "," + L + "," + X + ")", void 0;
                    if (c && (d = 1e-4, d > A && A > -d && (A = D = 2e-5), d > M && M > -d && (M = D = 2e-5), !F || S.z || S.rotationX || S.rotationY || (F = 0)), O || S.skewX) O *= N, m = e = Math.cos(O), g = s = Math.sin(O), S.skewX && (O -= S.skewX * N, m = Math.cos(O), g = Math.sin(O), "simple" === S.skewType && (v = Math.tan(S.skewX * N), v = Math.sqrt(1 + v * v), m *= v, g *= v)), i = -g, n = m;
                    else {
                        if (!(k || R || 1 !== D || F || E)) return C[we] = (S.xPercent || S.yPercent ? "translate(" + S.xPercent + "%," + S.yPercent + "%) translate3d(" : "translate3d(") + L + "px," + X + "px," + z + "px)" + (1 !== A || 1 !== M ? " scale(" + A + "," + M + ")" : ""), void 0;
                        e = n = 1, i = s = 0
                    }
                    h = 1, r = a = o = l = u = f = 0, p = F ? -1 / F : 0, _ = S.zOrigin, d = 1e-6, T = ",", w = "0", O = k * N, O && (m = Math.cos(O), g = Math.sin(O), o = -g, u = p * -g, r = e * g, a = s * g, h = m, p *= m, e *= m, s *= m), O = R * N, O && (m = Math.cos(O), g = Math.sin(O), v = i * m + r * g, y = n * m + a * g, l = h * g, f = p * g, r = i * -g + r * m, a = n * -g + a * m, h *= m, p *= m, i = v, n = y), 1 !== D && (r *= D, a *= D, h *= D, p *= D), 1 !== M && (i *= M, n *= M, l *= M, f *= M), 1 !== A && (e *= A, s *= A, o *= A, u *= A), (_ || E) && (_ && (L += r * -_, X += a * -_, z += h * -_ + _), E && (L += S.xOrigin - (S.xOrigin * e + S.yOrigin * i), X += S.yOrigin - (S.xOrigin * s + S.yOrigin * n)), d > L && L > -d && (L = w), d > X && X > -d && (X = w), d > z && z > -d && (z = 0)), x = S.xPercent || S.yPercent ? "translate(" + S.xPercent + "%," + S.yPercent + "%) matrix3d(" : "matrix3d(", x += (d > e && e > -d ? w : e) + T + (d > s && s > -d ? w : s) + T + (d > o && o > -d ? w : o), x += T + (d > u && u > -d ? w : u) + T + (d > i && i > -d ? w : i) + T + (d > n && n > -d ? w : n), R || k ? (x += T + (d > l && l > -d ? w : l) + T + (d > f && f > -d ? w : f) + T + (d > r && r > -d ? w : r), x += T + (d > a && a > -d ? w : a) + T + (d > h && h > -d ? w : h) + T + (d > p && p > -d ? w : p) + T) : x += ",0,0,0,0,1,0,", x += L + T + X + T + z + T + (F ? 1 + -z / F : 1) + ")", C[we] = x
                };
            h = Ce.prototype, h.x = h.y = h.z = h.skewX = h.skewY = h.rotation = h.rotationX = h.rotationY = h.zOrigin = h.xPercent = h.yPercent = 0, h.scaleX = h.scaleY = h.scaleZ = 1, ve("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,svgOrigin,transformPerspective,directionalRotation,parseTransform,force3D,skewType,xPercent,yPercent", {
                parser: function(t, e, i, r, n, o, l) {
                    if (r._lastParsedTransform === l) return n;
                    r._lastParsedTransform = l;
                    var h, u, f, p, c, _, d, m = r._transform = De(t, s, !0, l.parseTransform),
                        g = t.style,
                        v = 1e-6,
                        y = Te.length,
                        x = l,
                        T = {};
                    if ("string" == typeof x.transform && we) f = F.style, f[we] = x.transform, f.display = "block", f.position = "absolute", z.body.appendChild(F), h = De(F, null, !1), z.body.removeChild(F);
                    else if ("object" == typeof x) {
                        if (h = {
                                scaleX: ne(null != x.scaleX ? x.scaleX : x.scale, m.scaleX),
                                scaleY: ne(null != x.scaleY ? x.scaleY : x.scale, m.scaleY),
                                scaleZ: ne(x.scaleZ, m.scaleZ),
                                x: ne(x.x, m.x),
                                y: ne(x.y, m.y),
                                z: ne(x.z, m.z),
                                xPercent: ne(x.xPercent, m.xPercent),
                                yPercent: ne(x.yPercent, m.yPercent),
                                perspective: ne(x.transformPerspective, m.perspective)
                            }, d = x.directionalRotation, null != d)
                            if ("object" == typeof d)
                                for (f in d) x[f] = d[f];
                            else x.rotation = d;
                            "string" == typeof x.x && -1 !== x.x.indexOf("%") && (h.x = 0, h.xPercent = ne(x.x, m.xPercent)), "string" == typeof x.y && -1 !== x.y.indexOf("%") && (h.y = 0, h.yPercent = ne(x.y, m.yPercent)), h.rotation = ae("rotation" in x ? x.rotation : "shortRotation" in x ? x.shortRotation + "_short" : "rotationZ" in x ? x.rotationZ : m.rotation, m.rotation, "rotation", T), Se && (h.rotationX = ae("rotationX" in x ? x.rotationX : "shortRotationX" in x ? x.shortRotationX + "_short" : m.rotationX || 0, m.rotationX, "rotationX", T), h.rotationY = ae("rotationY" in x ? x.rotationY : "shortRotationY" in x ? x.shortRotationY + "_short" : m.rotationY || 0, m.rotationY, "rotationY", T)), h.skewX = null == x.skewX ? m.skewX : ae(x.skewX, m.skewX), h.skewY = null == x.skewY ? m.skewY : ae(x.skewY, m.skewY), (u = h.skewY - m.skewY) && (h.skewX += u, h.rotation += u)
                    }
                    for (Se && null != x.force3D && (m.force3D = x.force3D, _ = !0), m.skewType = x.skewType || m.skewType || a.defaultSkewType, c = m.force3D || m.z || m.rotationX || m.rotationY || h.z || h.rotationX || h.rotationY || h.perspective, c || null == x.scale || (h.scaleZ = 1); --y > -1;) i = Te[y], p = h[i] - m[i], (p > v || -v > p || null != x[i] || null != X[i]) && (_ = !0, n = new _e(m, i, m[i], p, n), i in T && (n.e = T[i]), n.xs0 = 0, n.plugin = o, r._overwriteProps.push(n.n));
                    return p = x.transformOrigin, m.svg && (p || x.svgOrigin) && (Me(t, re(p), h, x.svgOrigin), n = new _e(m, "xOrigin", m.xOrigin, h.xOrigin - m.xOrigin, n, -1, "transformOrigin"), n.b = m.xOrigin, n.e = n.xs0 = h.xOrigin, n = new _e(m, "yOrigin", m.yOrigin, h.yOrigin - m.yOrigin, n, -1, "transformOrigin"), n.b = m.yOrigin, n.e = n.xs0 = h.yOrigin, p = xe ? null : "0px 0px"), (p || Se && c && m.zOrigin) && (we ? (_ = !0, i = Pe, p = (p || Q(t, i, s, !1, "50% 50%")) + "", n = new _e(g, i, 0, 0, n, -1, "transformOrigin"), n.b = g[i], n.plugin = o, Se ? (f = m.zOrigin, p = p.split(" "), m.zOrigin = (p.length > 2 && (0 === f || "0px" !== p[2]) ? parseFloat(p[2]) : f) || 0, n.xs0 = n.e = p[0] + " " + (p[1] || "50%") + " 0px", n = new _e(m, "zOrigin", 0, 0, n, -1, n.n), n.b = f, n.xs0 = n.e = m.zOrigin) : n.xs0 = n.e = p) : re(p + "", m)), _ && (r._transformType = m.svg && xe || !c && 3 !== this._transformType ? 2 : 3), n
                },
                prefix: !0
            }), ve("boxShadow", {
                defaultValue: "0px 0px 0px 0px #999",
                prefix: !0,
                color: !0,
                multi: !0,
                keyword: "inset"
            }), ve("borderRadius", {
                defaultValue: "0px",
                parser: function(t, e, i, n, a) {
                    e = this.format(e);
                    var o, l, h, u, f, p, c, _, d, m, g, v, y, x, T, w, b = ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"],
                        P = t.style;
                    for (d = parseFloat(t.offsetWidth), m = parseFloat(t.offsetHeight), o = e.split(" "), l = 0; b.length > l; l++) this.p.indexOf("border") && (b[l] = G(b[l])), f = u = Q(t, b[l], s, !1, "0px"), -1 !== f.indexOf(" ") && (u = f.split(" "), f = u[0], u = u[1]), p = h = o[l], c = parseFloat(f), v = f.substr((c + "").length), y = "=" === p.charAt(1), y ? (_ = parseInt(p.charAt(0) + "1", 10), p = p.substr(2), _ *= parseFloat(p), g = p.substr((_ + "").length - (0 > _ ? 1 : 0)) || "") : (_ = parseFloat(p), g = p.substr((_ + "").length)), "" === g && (g = r[i] || v), g !== v && (x = Z(t, "borderLeft", c, v), T = Z(t, "borderTop", c, v), "%" === g ? (f = 100 * (x / d) + "%", u = 100 * (T / m) + "%") : "em" === g ? (w = Z(t, "borderLeft", 1, "em"), f = x / w + "em", u = T / w + "em") : (f = x + "px", u = T + "px"), y && (p = parseFloat(f) + _ + g, h = parseFloat(u) + _ + g)), a = de(P, b[l], f + " " + u, p + " " + h, !1, "0px", a);
                    return a
                },
                prefix: !0,
                formatter: fe("0px 0px 0px 0px", !1, !0)
            }), ve("backgroundPosition", {
                defaultValue: "0 0",
                parser: function(t, e, i, r, n, a) {
                    var o, l, h, u, f, p, c = "background-position",
                        _ = s || H(t, null),
                        m = this.format((_ ? d ? _.getPropertyValue(c + "-x") + " " + _.getPropertyValue(c + "-y") : _.getPropertyValue(c) : t.currentStyle.backgroundPositionX + " " + t.currentStyle.backgroundPositionY) || "0 0"),
                        g = this.format(e);
                    if (-1 !== m.indexOf("%") != (-1 !== g.indexOf("%")) && (p = Q(t, "backgroundImage").replace(O, ""), p && "none" !== p)) {
                        for (o = m.split(" "), l = g.split(" "), I.setAttribute("src", p), h = 2; --h > -1;) m = o[h], u = -1 !== m.indexOf("%"), u !== (-1 !== l[h].indexOf("%")) && (f = 0 === h ? t.offsetWidth - I.width : t.offsetHeight - I.height, o[h] = u ? parseFloat(m) / 100 * f + "px" : 100 * (parseFloat(m) / f) + "%");
                        m = o.join(" ")
                    }
                    return this.parseComplex(t.style, m, g, n, a)
                },
                formatter: re
            }), ve("backgroundSize", {
                defaultValue: "0 0",
                formatter: re
            }), ve("perspective", {
                defaultValue: "0px",
                prefix: !0
            }), ve("perspectiveOrigin", {
                defaultValue: "50% 50%",
                prefix: !0
            }), ve("transformStyle", {
                prefix: !0
            }), ve("backfaceVisibility", {
                prefix: !0
            }), ve("userSelect", {
                prefix: !0
            }), ve("margin", {
                parser: pe("marginTop,marginRight,marginBottom,marginLeft")
            }), ve("padding", {
                parser: pe("paddingTop,paddingRight,paddingBottom,paddingLeft")
            }), ve("clip", {
                defaultValue: "rect(0px,0px,0px,0px)",
                parser: function(t, e, i, r, n, a) {
                    var o, l, h;
                    return 9 > d ? (l = t.currentStyle, h = 8 > d ? " " : ",", o = "rect(" + l.clipTop + h + l.clipRight + h + l.clipBottom + h + l.clipLeft + ")", e = this.format(e).split(",").join(h)) : (o = this.format(Q(t, this.p, s, !1, this.dflt)), e = this.format(e)), this.parseComplex(t.style, o, e, n, a)
                }
            }), ve("textShadow", {
                defaultValue: "0px 0px 0px #999",
                color: !0,
                multi: !0
            }), ve("autoRound,strictUnits", {
                parser: function(t, e, i, r, s) {
                    return s
                }
            }), ve("border", {
                defaultValue: "0px solid #000",
                parser: function(t, e, i, r, n, a) {
                    return this.parseComplex(t.style, this.format(Q(t, "borderTopWidth", s, !1, "0px") + " " + Q(t, "borderTopStyle", s, !1, "solid") + " " + Q(t, "borderTopColor", s, !1, "#000")), this.format(e), n, a)
                },
                color: !0,
                formatter: function(t) {
                    var e = t.split(" ");
                    return e[0] + " " + (e[1] || "solid") + " " + (t.match(ue) || ["#000"])[0]
                }
            }), ve("borderWidth", {
                parser: pe("borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth")
            }), ve("float,cssFloat,styleFloat", {
                parser: function(t, e, i, r, s) {
                    var n = t.style,
                        a = "cssFloat" in n ? "cssFloat" : "styleFloat";
                    return new _e(n, a, 0, 0, s, -1, i, !1, 0, n[a], e)
                }
            });
            var Xe = function(t) {
                var e, i = this.t,
                    r = i.filter || Q(this.data, "filter") || "",
                    s = 0 | this.s + this.c * t;
                100 === s && (-1 === r.indexOf("atrix(") && -1 === r.indexOf("radient(") && -1 === r.indexOf("oader(") ? (i.removeAttribute("filter"), e = !Q(this.data, "filter")) : (i.filter = r.replace(b, ""), e = !0)), e || (this.xn1 && (i.filter = r = r || "alpha(opacity=" + s + ")"), -1 === r.indexOf("pacity") ? 0 === s && this.xn1 || (i.filter = r + " alpha(opacity=" + s + ")") : i.filter = r.replace(T, "opacity=" + s))
            };
            ve("opacity,alpha,autoAlpha", {
                defaultValue: "1",
                parser: function(t, e, i, r, n, a) {
                    var o = parseFloat(Q(t, "opacity", s, !1, "1")),
                        l = t.style,
                        h = "autoAlpha" === i;
                    return "string" == typeof e && "=" === e.charAt(1) && (e = ("-" === e.charAt(0) ? -1 : 1) * parseFloat(e.substr(2)) + o), h && 1 === o && "hidden" === Q(t, "visibility", s) && 0 !== e && (o = 0), U ? n = new _e(l, "opacity", o, e - o, n) : (n = new _e(l, "opacity", 100 * o, 100 * (e - o), n), n.xn1 = h ? 1 : 0, l.zoom = 1, n.type = 2, n.b = "alpha(opacity=" + n.s + ")", n.e = "alpha(opacity=" + (n.s + n.c) + ")", n.data = t, n.plugin = a, n.setRatio = Xe), h && (n = new _e(l, "visibility", 0, 0, n, -1, null, !1, 0, 0 !== o ? "inherit" : "hidden", 0 === e ? "hidden" : "inherit"), n.xs0 = "inherit", r._overwriteProps.push(n.n), r._overwriteProps.push(i)), n
                }
            });
            var ze = function(t, e) {
                    e && (t.removeProperty ? (("ms" === e.substr(0, 2) || "webkit" === e.substr(0, 6)) && (e = "-" + e), t.removeProperty(e.replace(S, "-$1").toLowerCase())) : t.removeAttribute(e))
                },
                Ee = function(t) {
                    if (this.t._gsClassPT = this, 1 === t || 0 === t) {
                        this.t.setAttribute("class", 0 === t ? this.b : this.e);
                        for (var e = this.data, i = this.t.style; e;) e.v ? i[e.p] = e.v : ze(i, e.p), e = e._next;
                        1 === t && this.t._gsClassPT === this && (this.t._gsClassPT = null)
                    } else this.t.getAttribute("class") !== this.e && this.t.setAttribute("class", this.e)
                };
            ve("className", {
                parser: function(t, e, r, n, a, o, l) {
                    var h, u, f, p, c, _ = t.getAttribute("class") || "",
                        d = t.style.cssText;
                    if (a = n._classNamePT = new _e(t, r, 0, 0, a, 2), a.setRatio = Ee, a.pr = -11, i = !0, a.b = _, u = K(t, s), f = t._gsClassPT) {
                        for (p = {}, c = f.data; c;) p[c.p] = 1, c = c._next;
                        f.setRatio(1)
                    }
                    return t._gsClassPT = a, a.e = "=" !== e.charAt(1) ? e : _.replace(RegExp("\\s*\\b" + e.substr(2) + "\\b"), "") + ("+" === e.charAt(0) ? " " + e.substr(2) : ""), t.setAttribute("class", a.e), h = J(t, u, K(t), l, p), t.setAttribute("class", _), a.data = h.firstMPT, t.style.cssText = d, a = a.xfirst = n.parse(t, h.difs, a, o)
                }
            });
            var Fe = function(t) {
                if ((1 === t || 0 === t) && this.data._totalTime === this.data._totalDuration && "isFromStart" !== this.data.data) {
                    var e, i, r, s, n, a = this.t.style,
                        o = l.transform.parse;
                    if ("all" === this.e) a.cssText = "", s = !0;
                    else
                        for (e = this.e.split(" ").join("").split(","), r = e.length; --r > -1;) i = e[r], l[i] && (l[i].parse === o ? s = !0 : i = "transformOrigin" === i ? Pe : l[i].p), ze(a, i);
                    s && (ze(a, we), n = this.t._gsTransform, n && (n.svg && this.t.removeAttribute("data-svg-origin"), delete this.t._gsTransform))
                }
            };
            for (ve("clearProps", {
                    parser: function(t, e, r, s, n) {
                        return n = new _e(t, r, 0, 0, n, 2), n.setRatio = Fe, n.e = e, n.pr = -10, n.data = s._tween, i = !0, n
                    }
                }), h = "bezier,throwProps,physicsProps,physics2D".split(","), me = h.length; me--;) ye(h[me]);
            h = a.prototype, h._firstPT = h._lastParsedTransform = h._transform = null, h._onInitTween = function(t, e, o) {
                if (!t.nodeType) return !1;
                this._target = t, this._tween = o, this._vars = e, u = e.autoRound, i = !1, r = e.suffixMap || a.suffixMap, s = H(t, ""), n = this._overwriteProps;
                var h, c, d, m, g, v, y, x, T, b = t.style;
                if (f && "" === b.zIndex && (h = Q(t, "zIndex", s), ("auto" === h || "" === h) && this._addLazySet(b, "zIndex", 0)), "string" == typeof e && (m = b.cssText, h = K(t, s), b.cssText = m + ";" + e, h = J(t, h, K(t)).difs, !U && w.test(e) && (h.opacity = parseFloat(RegExp.$1)), e = h, b.cssText = m), this._firstPT = c = e.className ? l.className.parse(t, e.className, "className", this, null, null, e) : this.parse(t, e, null), this._transformType) {
                    for (T = 3 === this._transformType, we ? p && (f = !0, "" === b.zIndex && (y = Q(t, "zIndex", s), ("auto" === y || "" === y) && this._addLazySet(b, "zIndex", 0)), _ && this._addLazySet(b, "WebkitBackfaceVisibility", this._vars.WebkitBackfaceVisibility || (T ? "visible" : "hidden"))) : b.zoom = 1, d = c; d && d._next;) d = d._next;
                    x = new _e(t, "transform", 0, 0, null, 2), this._linkCSSP(x, null, d), x.setRatio = we ? Le : Ne, x.data = this._transform || De(t, s, !0), x.tween = o, x.pr = -1, n.pop()
                }
                if (i) {
                    for (; c;) {
                        for (v = c._next, d = m; d && d.pr > c.pr;) d = d._next;
                        (c._prev = d ? d._prev : g) ? c._prev._next = c: m = c, (c._next = d) ? d._prev = c : g = c, c = v
                    }
                    this._firstPT = m
                }
                return !0
            }, h.parse = function(t, e, i, n) {
                var a, o, h, f, p, c, _, d, m, g, v = t.style;
                for (a in e) c = e[a], o = l[a], o ? i = o.parse(t, c, a, this, i, n, e) : (p = Q(t, a, s) + "", m = "string" == typeof c, "color" === a || "fill" === a || "stroke" === a || -1 !== a.indexOf("Color") || m && P.test(c) ? (m || (c = he(c), c = (c.length > 3 ? "rgba(" : "rgb(") + c.join(",") + ")"), i = de(v, a, p, c, !0, "transparent", i, 0, n)) : !m || -1 === c.indexOf(" ") && -1 === c.indexOf(",") ? (h = parseFloat(p), _ = h || 0 === h ? p.substr((h + "").length) : "", ("" === p || "auto" === p) && ("width" === a || "height" === a ? (h = ie(t, a, s), _ = "px") : "left" === a || "top" === a ? (h = $(t, a, s), _ = "px") : (h = "opacity" !== a ? 0 : 1, _ = "")), g = m && "=" === c.charAt(1), g ? (f = parseInt(c.charAt(0) + "1", 10), c = c.substr(2), f *= parseFloat(c), d = c.replace(x, "")) : (f = parseFloat(c), d = m ? c.replace(x, "") : ""), "" === d && (d = a in r ? r[a] : _), c = f || 0 === f ? (g ? f + h : f) + d : e[a], _ !== d && "" !== d && (f || 0 === f) && h && (h = Z(t, a, h, _), "%" === d ? (h /= Z(t, a, 100, "%") / 100, e.strictUnits !== !0 && (p = h + "%")) : "em" === d ? h /= Z(t, a, 1, "em") : "px" !== d && (f = Z(t, a, f, d), d = "px"), g && (f || 0 === f) && (c = f + h + d)), g && (f += h), !h && 0 !== h || !f && 0 !== f ? void 0 !== v[a] && (c || "NaN" != c + "" && null != c) ? (i = new _e(v, a, f || h || 0, 0, i, -1, a, !1, 0, p, c), i.xs0 = "none" !== c || "display" !== a && -1 === a.indexOf("Style") ? c : p) : V("invalid " + a + " tween value: " + e[a]) : (i = new _e(v, a, h, f - h, i, 0, a, u !== !1 && ("px" === d || "zIndex" === a), 0, p, c), i.xs0 = d)) : i = de(v, a, p, c, !0, null, i, 0, n)), n && i && !i.plugin && (i.plugin = n);
                return i
            }, h.setRatio = function(t) {
                var e, i, r, s = this._firstPT,
                    n = 1e-6;
                if (1 !== t || this._tween._time !== this._tween._duration && 0 !== this._tween._time)
                    if (t || this._tween._time !== this._tween._duration && 0 !== this._tween._time || this._tween._rawPrevTime === -1e-6)
                        for (; s;) {
                            if (e = s.c * t + s.s, s.r ? e = Math.round(e) : n > e && e > -n && (e = 0), s.type)
                                if (1 === s.type)
                                    if (r = s.l, 2 === r) s.t[s.p] = s.xs0 + e + s.xs1 + s.xn1 + s.xs2;
                                    else if (3 === r) s.t[s.p] = s.xs0 + e + s.xs1 + s.xn1 + s.xs2 + s.xn2 + s.xs3;
                            else if (4 === r) s.t[s.p] = s.xs0 + e + s.xs1 + s.xn1 + s.xs2 + s.xn2 + s.xs3 + s.xn3 + s.xs4;
                            else if (5 === r) s.t[s.p] = s.xs0 + e + s.xs1 + s.xn1 + s.xs2 + s.xn2 + s.xs3 + s.xn3 + s.xs4 + s.xn4 + s.xs5;
                            else {
                                for (i = s.xs0 + e + s.xs1, r = 1; s.l > r; r++) i += s["xn" + r] + s["xs" + (r + 1)];
                                s.t[s.p] = i
                            } else -1 === s.type ? s.t[s.p] = s.xs0 : s.setRatio && s.setRatio(t);
                            else s.t[s.p] = e + s.xs0;
                            s = s._next
                        } else
                            for (; s;) 2 !== s.type ? s.t[s.p] = s.b : s.setRatio(t), s = s._next;
                    else
                        for (; s;) 2 !== s.type ? s.t[s.p] = s.e : s.setRatio(t), s = s._next
            }, h._enableTransforms = function(t) {
                this._transform = this._transform || De(this._target, s, !0), this._transformType = this._transform.svg && xe || !t && 3 !== this._transformType ? 2 : 3
            };
            var Ie = function() {
                this.t[this.p] = this.e, this.data._linkCSSP(this, this._next, null, !0)
            };
            h._addLazySet = function(t, e, i) {
                var r = this._firstPT = new _e(t, e, 0, 0, this._firstPT, 2);
                r.e = i, r.setRatio = Ie, r.data = this
            }, h._linkCSSP = function(t, e, i, r) {
                return t && (e && (e._prev = t), t._next && (t._next._prev = t._prev), t._prev ? t._prev._next = t._next : this._firstPT === t && (this._firstPT = t._next, r = !0), i ? i._next = t : r || null !== this._firstPT || (this._firstPT = t), t._next = e, t._prev = i), t
            }, h._kill = function(e) {
                var i, r, s, n = e;
                if (e.autoAlpha || e.alpha) {
                    n = {};
                    for (r in e) n[r] = e[r];
                    n.opacity = 1, n.autoAlpha && (n.visibility = 1)
                }
                return e.className && (i = this._classNamePT) && (s = i.xfirst, s && s._prev ? this._linkCSSP(s._prev, i._next, s._prev._prev) : s === this._firstPT && (this._firstPT = i._next), i._next && this._linkCSSP(i._next, i._next._next, s._prev), this._classNamePT = null), t.prototype._kill.call(this, n)
            };
            var Be = function(t, e, i) {
                var r, s, n, a;
                if (t.slice)
                    for (s = t.length; --s > -1;) Be(t[s], e, i);
                else
                    for (r = t.childNodes, s = r.length; --s > -1;) n = r[s], a = n.type, n.style && (e.push(K(n)), i && i.push(n)), 1 !== a && 9 !== a && 11 !== a || !n.childNodes.length || Be(n, e, i)
            };
            return a.cascadeTo = function(t, i, r) {
                var s, n, a, o, l = e.to(t, i, r),
                    h = [l],
                    u = [],
                    f = [],
                    p = [],
                    c = e._internals.reservedProps;
                for (t = l._targets || l.target, Be(t, u, p), l.render(i, !0, !0), Be(t, f), l.render(0, !0, !0), l._enabled(!0), s = p.length; --s > -1;)
                    if (n = J(p[s], u[s], f[s]), n.firstMPT) {
                        n = n.difs;
                        for (a in r) c[a] && (n[a] = r[a]);
                        o = {};
                        for (a in n) o[a] = u[s][a];
                        h.push(e.fromTo(p[s], i, o, n))
                    }
                return h
            }, t.activate([a]), a
        }, !0)
    }), _gsScope._gsDefine && _gsScope._gsQueue.pop()(),
    function(t) {
        "use strict";
        var e = function() {
            return (_gsScope.GreenSockGlobals || _gsScope)[t]
        };
        "function" == typeof define && define.amd ? define(["TweenLite"], e) : "undefined" != typeof module && module.exports && (require("../TweenLite.js"), module.exports = e())
    }("CSSPlugin");
/*!
 * VERSION: beta 1.15.2
 * DATE: 2015-01-27
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2015, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
var _gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window;
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function() {
    "use strict";
    _gsScope._gsDefine("easing.Back", ["easing.Ease"], function(t) {
        var e, i, s, r = _gsScope.GreenSockGlobals || _gsScope,
            n = r.com.greensock,
            a = 2 * Math.PI,
            o = Math.PI / 2,
            h = n._class,
            l = function(e, i) {
                var s = h("easing." + e, function() {}, !0),
                    r = s.prototype = new t;
                return r.constructor = s, r.getRatio = i, s
            },
            _ = t.register || function() {},
            u = function(t, e, i, s) {
                var r = h("easing." + t, {
                    easeOut: new e,
                    easeIn: new i,
                    easeInOut: new s
                }, !0);
                return _(r, t), r
            },
            c = function(t, e, i) {
                this.t = t, this.v = e, i && (this.next = i, i.prev = this, this.c = i.v - e, this.gap = i.t - t)
            },
            p = function(e, i) {
                var s = h("easing." + e, function(t) {
                        this._p1 = t || 0 === t ? t : 1.70158, this._p2 = 1.525 * this._p1
                    }, !0),
                    r = s.prototype = new t;
                return r.constructor = s, r.getRatio = i, r.config = function(t) {
                    return new s(t)
                }, s
            },
            f = u("Back", p("BackOut", function(t) {
                return (t -= 1) * t * ((this._p1 + 1) * t + this._p1) + 1
            }), p("BackIn", function(t) {
                return t * t * ((this._p1 + 1) * t - this._p1)
            }), p("BackInOut", function(t) {
                return 1 > (t *= 2) ? .5 * t * t * ((this._p2 + 1) * t - this._p2) : .5 * ((t -= 2) * t * ((this._p2 + 1) * t + this._p2) + 2)
            })),
            m = h("easing.SlowMo", function(t, e, i) {
                e = e || 0 === e ? e : .7, null == t ? t = .7 : t > 1 && (t = 1), this._p = 1 !== t ? e : 0, this._p1 = (1 - t) / 2, this._p2 = t, this._p3 = this._p1 + this._p2, this._calcEnd = i === !0
            }, !0),
            d = m.prototype = new t;
        return d.constructor = m, d.getRatio = function(t) {
            var e = t + (.5 - t) * this._p;
            return this._p1 > t ? this._calcEnd ? 1 - (t = 1 - t / this._p1) * t : e - (t = 1 - t / this._p1) * t * t * t * e : t > this._p3 ? this._calcEnd ? 1 - (t = (t - this._p3) / this._p1) * t : e + (t - e) * (t = (t - this._p3) / this._p1) * t * t * t : this._calcEnd ? 1 : e
        }, m.ease = new m(.7, .7), d.config = m.config = function(t, e, i) {
            return new m(t, e, i)
        }, e = h("easing.SteppedEase", function(t) {
            t = t || 1, this._p1 = 1 / t, this._p2 = t + 1
        }, !0), d = e.prototype = new t, d.constructor = e, d.getRatio = function(t) {
            return 0 > t ? t = 0 : t >= 1 && (t = .999999999), (this._p2 * t >> 0) * this._p1
        }, d.config = e.config = function(t) {
            return new e(t)
        }, i = h("easing.RoughEase", function(e) {
            e = e || {};
            for (var i, s, r, n, a, o, h = e.taper || "none", l = [], _ = 0, u = 0 | (e.points || 20), p = u, f = e.randomize !== !1, m = e.clamp === !0, d = e.template instanceof t ? e.template : null, g = "number" == typeof e.strength ? .4 * e.strength : .4; --p > -1;) i = f ? Math.random() : 1 / u * p, s = d ? d.getRatio(i) : i, "none" === h ? r = g : "out" === h ? (n = 1 - i, r = n * n * g) : "in" === h ? r = i * i * g : .5 > i ? (n = 2 * i, r = .5 * n * n * g) : (n = 2 * (1 - i), r = .5 * n * n * g), f ? s += Math.random() * r - .5 * r : p % 2 ? s += .5 * r : s -= .5 * r, m && (s > 1 ? s = 1 : 0 > s && (s = 0)), l[_++] = {
                x: i,
                y: s
            };
            for (l.sort(function(t, e) {
                    return t.x - e.x
                }), o = new c(1, 1, null), p = u; --p > -1;) a = l[p], o = new c(a.x, a.y, o);
            this._prev = new c(0, 0, 0 !== o.t ? o : o.next)
        }, !0), d = i.prototype = new t, d.constructor = i, d.getRatio = function(t) {
            var e = this._prev;
            if (t > e.t) {
                for (; e.next && t >= e.t;) e = e.next;
                e = e.prev
            } else
                for (; e.prev && e.t >= t;) e = e.prev;
            return this._prev = e, e.v + (t - e.t) / e.gap * e.c
        }, d.config = function(t) {
            return new i(t)
        }, i.ease = new i, u("Bounce", l("BounceOut", function(t) {
            return 1 / 2.75 > t ? 7.5625 * t * t : 2 / 2.75 > t ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : 2.5 / 2.75 > t ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375
        }), l("BounceIn", function(t) {
            return 1 / 2.75 > (t = 1 - t) ? 1 - 7.5625 * t * t : 2 / 2.75 > t ? 1 - (7.5625 * (t -= 1.5 / 2.75) * t + .75) : 2.5 / 2.75 > t ? 1 - (7.5625 * (t -= 2.25 / 2.75) * t + .9375) : 1 - (7.5625 * (t -= 2.625 / 2.75) * t + .984375)
        }), l("BounceInOut", function(t) {
            var e = .5 > t;
            return t = e ? 1 - 2 * t : 2 * t - 1, t = 1 / 2.75 > t ? 7.5625 * t * t : 2 / 2.75 > t ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : 2.5 / 2.75 > t ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375, e ? .5 * (1 - t) : .5 * t + .5
        })), u("Circ", l("CircOut", function(t) {
            return Math.sqrt(1 - (t -= 1) * t)
        }), l("CircIn", function(t) {
            return -(Math.sqrt(1 - t * t) - 1)
        }), l("CircInOut", function(t) {
            return 1 > (t *= 2) ? -.5 * (Math.sqrt(1 - t * t) - 1) : .5 * (Math.sqrt(1 - (t -= 2) * t) + 1)
        })), s = function(e, i, s) {
            var r = h("easing." + e, function(t, e) {
                    this._p1 = t >= 1 ? t : 1, this._p2 = (e || s) / (1 > t ? t : 1), this._p3 = this._p2 / a * (Math.asin(1 / this._p1) || 0), this._p2 = a / this._p2
                }, !0),
                n = r.prototype = new t;
            return n.constructor = r, n.getRatio = i, n.config = function(t, e) {
                return new r(t, e)
            }, r
        }, u("Elastic", s("ElasticOut", function(t) {
            return this._p1 * Math.pow(2, -10 * t) * Math.sin((t - this._p3) * this._p2) + 1
        }, .3), s("ElasticIn", function(t) {
            return -(this._p1 * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - this._p3) * this._p2))
        }, .3), s("ElasticInOut", function(t) {
            return 1 > (t *= 2) ? -.5 * this._p1 * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - this._p3) * this._p2) : .5 * this._p1 * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - this._p3) * this._p2) + 1
        }, .45)), u("Expo", l("ExpoOut", function(t) {
            return 1 - Math.pow(2, -10 * t)
        }), l("ExpoIn", function(t) {
            return Math.pow(2, 10 * (t - 1)) - .001
        }), l("ExpoInOut", function(t) {
            return 1 > (t *= 2) ? .5 * Math.pow(2, 10 * (t - 1)) : .5 * (2 - Math.pow(2, -10 * (t - 1)))
        })), u("Sine", l("SineOut", function(t) {
            return Math.sin(t * o)
        }), l("SineIn", function(t) {
            return -Math.cos(t * o) + 1
        }), l("SineInOut", function(t) {
            return -.5 * (Math.cos(Math.PI * t) - 1)
        })), h("easing.EaseLookup", {
            find: function(e) {
                return t.map[e]
            }
        }, !0), _(r.SlowMo, "SlowMo", "ease,"), _(i, "RoughEase", "ease,"), _(e, "SteppedEase", "ease,"), f
    }, !0)
}), _gsScope._gsDefine && _gsScope._gsQueue.pop()();
/*!
 * VERSION: beta 1.3.0
 * DATE: 2015-02-06
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2015, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
var _gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window;
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function() {
    "use strict";
    var t = /(\d|\.)+/g,
        e = {
            aqua: [0, 255, 255],
            lime: [0, 255, 0],
            silver: [192, 192, 192],
            black: [0, 0, 0],
            maroon: [128, 0, 0],
            teal: [0, 128, 128],
            blue: [0, 0, 255],
            navy: [0, 0, 128],
            white: [255, 255, 255],
            fuchsia: [255, 0, 255],
            olive: [128, 128, 0],
            yellow: [255, 255, 0],
            orange: [255, 165, 0],
            gray: [128, 128, 128],
            purple: [128, 0, 128],
            green: [0, 128, 0],
            red: [255, 0, 0],
            pink: [255, 192, 203],
            cyan: [0, 255, 255],
            transparent: [255, 255, 255, 0]
        },
        i = function(t, e, i) {
            return t = 0 > t ? t + 1 : t > 1 ? t - 1 : t, 0 | 255 * (1 > 6 * t ? e + 6 * (i - e) * t : .5 > t ? i : 2 > 3 * t ? e + 6 * (i - e) * (2 / 3 - t) : e) + .5
        },
        r = function(r) {
            if ("" === r || null == r || "none" === r) return e.transparent;
            if (e[r]) return e[r];
            if ("number" == typeof r) return [r >> 16, 255 & r >> 8, 255 & r];
            if ("#" === r.charAt(0)) return 4 === r.length && (r = "#" + r.charAt(1) + r.charAt(1) + r.charAt(2) + r.charAt(2) + r.charAt(3) + r.charAt(3)), r = parseInt(r.substr(1), 16), [r >> 16, 255 & r >> 8, 255 & r];
            if ("hsl" === r.substr(0, 3)) {
                r = r.match(t);
                var s = Number(r[0]) % 360 / 360,
                    n = Number(r[1]) / 100,
                    a = Number(r[2]) / 100,
                    o = .5 >= a ? a * (n + 1) : a + n - a * n,
                    l = 2 * a - o;
                return r.length > 3 && (r[3] = Number(r[3])), r[0] = i(s + 1 / 3, l, o), r[1] = i(s, l, o), r[2] = i(s - 1 / 3, l, o), r
            }
            return r.match(t) || e.transparent
        };
    _gsScope._gsDefine.plugin({
        propName: "colorProps",
        version: "1.3.0",
        priority: -1,
        API: 2,
        init: function(t, e) {
            this._target = t;
            var i, s, n, a;
            this.numFormat = "number" === e.format;
            for (i in e) "format" !== i && (n = r(e[i]), this._firstPT = a = {
                _next: this._firstPT,
                p: i,
                f: "function" == typeof t[i],
                n: i,
                r: !1
            }, s = r(a.f ? t[i.indexOf("set") || "function" != typeof t["get" + i.substr(3)] ? i : "get" + i.substr(3)]() : t[i]), a.s = Number(s[0]), a.c = Number(n[0]) - a.s, a.gs = Number(s[1]), a.gc = Number(n[1]) - a.gs, a.bs = Number(s[2]), a.bc = Number(n[2]) - a.bs, (a.rgba = s.length > 3 || n.length > 3) && (a.as = 4 > s.length ? 1 : Number(s[3]), a.ac = (4 > n.length ? 1 : Number(n[3])) - a.as), a._next && (a._next._prev = a));
            return !0
        },
        set: function(t) {
            for (var e, i = this._firstPT; i;) e = this.numFormat ? i.s + t * i.c << 16 | i.gs + t * i.gc << 8 | i.bs + t * i.bc : (i.rgba ? "rgba(" : "rgb(") + (i.s + t * i.c >> 0) + ", " + (i.gs + t * i.gc >> 0) + ", " + (i.bs + t * i.bc >> 0) + (i.rgba ? ", " + (i.as + t * i.ac) : "") + ")", i.f ? this._target[i.p](e) : this._target[i.p] = e, i = i._next
        }
    })
}), _gsScope._gsDefine && _gsScope._gsQueue.pop()();
/*!
 * VERSION: 1.16.1
 * DATE: 2015-03-13
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2015, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
(function(t, e) {
    "use strict";
    var i = t.GreenSockGlobals = t.GreenSockGlobals || t;
    if (!i.TweenLite) {
        var s, r, n, a, o, l = function(t) {
                var e, s = t.split("."),
                    r = i;
                for (e = 0; s.length > e; e++) r[s[e]] = r = r[s[e]] || {};
                return r
            },
            h = l("com.greensock"),
            _ = 1e-10,
            u = function(t) {
                var e, i = [],
                    s = t.length;
                for (e = 0; e !== s; i.push(t[e++]));
                return i
            },
            m = function() {},
            f = function() {
                var t = Object.prototype.toString,
                    e = t.call([]);
                return function(i) {
                    return null != i && (i instanceof Array || "object" == typeof i && !!i.push && t.call(i) === e)
                }
            }(),
            c = {},
            p = function(s, r, n, a) {
                this.sc = c[s] ? c[s].sc : [], c[s] = this, this.gsClass = null, this.func = n;
                var o = [];
                this.check = function(h) {
                    for (var _, u, m, f, d = r.length, v = d; --d > -1;)(_ = c[r[d]] || new p(r[d], [])).gsClass ? (o[d] = _.gsClass, v--) : h && _.sc.push(this);
                    if (0 === v && n)
                        for (u = ("com.greensock." + s).split("."), m = u.pop(), f = l(u.join("."))[m] = this.gsClass = n.apply(n, o), a && (i[m] = f, "function" == typeof define && define.amd ? define((t.GreenSockAMDPath ? t.GreenSockAMDPath + "/" : "") + s.split(".").pop(), [], function() {
                                return f
                            }) : s === e && "undefined" != typeof module && module.exports && (module.exports = f)), d = 0; this.sc.length > d; d++) this.sc[d].check()
                }, this.check(!0)
            },
            d = t._gsDefine = function(t, e, i, s) {
                return new p(t, e, i, s)
            },
            v = h._class = function(t, e, i) {
                return e = e || function() {}, d(t, [], function() {
                    return e
                }, i), e
            };
        d.globals = i;
        var g = [0, 0, 1, 1],
            T = [],
            y = v("easing.Ease", function(t, e, i, s) {
                this._func = t, this._type = i || 0, this._power = s || 0, this._params = e ? g.concat(e) : g
            }, !0),
            w = y.map = {},
            P = y.register = function(t, e, i, s) {
                for (var r, n, a, o, l = e.split(","), _ = l.length, u = (i || "easeIn,easeOut,easeInOut").split(","); --_ > -1;)
                    for (n = l[_], r = s ? v("easing." + n, null, !0) : h.easing[n] || {}, a = u.length; --a > -1;) o = u[a], w[n + "." + o] = w[o + n] = r[o] = t.getRatio ? t : t[o] || new t
            };
        for (n = y.prototype, n._calcEnd = !1, n.getRatio = function(t) {
                if (this._func) return this._params[0] = t, this._func.apply(null, this._params);
                var e = this._type,
                    i = this._power,
                    s = 1 === e ? 1 - t : 2 === e ? t : .5 > t ? 2 * t : 2 * (1 - t);
                return 1 === i ? s *= s : 2 === i ? s *= s * s : 3 === i ? s *= s * s * s : 4 === i && (s *= s * s * s * s), 1 === e ? 1 - s : 2 === e ? s : .5 > t ? s / 2 : 1 - s / 2
            }, s = ["Linear", "Quad", "Cubic", "Quart", "Quint,Strong"], r = s.length; --r > -1;) n = s[r] + ",Power" + r, P(new y(null, null, 1, r), n, "easeOut", !0), P(new y(null, null, 2, r), n, "easeIn" + (0 === r ? ",easeNone" : "")), P(new y(null, null, 3, r), n, "easeInOut");
        w.linear = h.easing.Linear.easeIn, w.swing = h.easing.Quad.easeInOut;
        var b = v("events.EventDispatcher", function(t) {
            this._listeners = {}, this._eventTarget = t || this
        });
        n = b.prototype, n.addEventListener = function(t, e, i, s, r) {
            r = r || 0;
            var n, l, h = this._listeners[t],
                _ = 0;
            for (null == h && (this._listeners[t] = h = []), l = h.length; --l > -1;) n = h[l], n.c === e && n.s === i ? h.splice(l, 1) : 0 === _ && r > n.pr && (_ = l + 1);
            h.splice(_, 0, {
                c: e,
                s: i,
                up: s,
                pr: r
            }), this !== a || o || a.wake()
        }, n.removeEventListener = function(t, e) {
            var i, s = this._listeners[t];
            if (s)
                for (i = s.length; --i > -1;)
                    if (s[i].c === e) return s.splice(i, 1), void 0
        }, n.dispatchEvent = function(t) {
            var e, i, s, r = this._listeners[t];
            if (r)
                for (e = r.length, i = this._eventTarget; --e > -1;) s = r[e], s && (s.up ? s.c.call(s.s || i, {
                    type: t,
                    target: i
                }) : s.c.call(s.s || i))
        };
        var k = t.requestAnimationFrame,
            S = t.cancelAnimationFrame,
            A = Date.now || function() {
                return (new Date).getTime()
            },
            x = A();
        for (s = ["ms", "moz", "webkit", "o"], r = s.length; --r > -1 && !k;) k = t[s[r] + "RequestAnimationFrame"], S = t[s[r] + "CancelAnimationFrame"] || t[s[r] + "CancelRequestAnimationFrame"];
        v("Ticker", function(t, e) {
            var i, s, r, n, l, h = this,
                u = A(),
                f = e !== !1 && k,
                c = 500,
                p = 33,
                d = "tick",
                v = function(t) {
                    var e, a, o = A() - x;
                    o > c && (u += o - p), x += o, h.time = (x - u) / 1e3, e = h.time - l, (!i || e > 0 || t === !0) && (h.frame++, l += e + (e >= n ? .004 : n - e), a = !0), t !== !0 && (r = s(v)), a && h.dispatchEvent(d)
                };
            b.call(h), h.time = h.frame = 0, h.tick = function() {
                v(!0)
            }, h.lagSmoothing = function(t, e) {
                c = t || 1 / _, p = Math.min(e, c, 0)
            }, h.sleep = function() {
                null != r && (f && S ? S(r) : clearTimeout(r), s = m, r = null, h === a && (o = !1))
            }, h.wake = function() {
                null !== r ? h.sleep() : h.frame > 10 && (x = A() - c + 5), s = 0 === i ? m : f && k ? k : function(t) {
                    return setTimeout(t, 0 | 1e3 * (l - h.time) + 1)
                }, h === a && (o = !0), v(2)
            }, h.fps = function(t) {
                return arguments.length ? (i = t, n = 1 / (i || 60), l = this.time + n, h.wake(), void 0) : i
            }, h.useRAF = function(t) {
                return arguments.length ? (h.sleep(), f = t, h.fps(i), void 0) : f
            }, h.fps(t), setTimeout(function() {
                f && 5 > h.frame && h.useRAF(!1)
            }, 1500)
        }), n = h.Ticker.prototype = new h.events.EventDispatcher, n.constructor = h.Ticker;
        var R = v("core.Animation", function(t, e) {
            if (this.vars = e = e || {}, this._duration = this._totalDuration = t || 0, this._delay = Number(e.delay) || 0, this._timeScale = 1, this._active = e.immediateRender === !0, this.data = e.data, this._reversed = e.reversed === !0, B) {
                o || a.wake();
                var i = this.vars.useFrames ? q : B;
                i.add(this, i._time), this.vars.paused && this.paused(!0)
            }
        });
        a = R.ticker = new h.Ticker, n = R.prototype, n._dirty = n._gc = n._initted = n._paused = !1, n._totalTime = n._time = 0, n._rawPrevTime = -1, n._next = n._last = n._onUpdate = n._timeline = n.timeline = null, n._paused = !1;
        var C = function() {
            o && A() - x > 2e3 && a.wake(), setTimeout(C, 2e3)
        };
        C(), n.play = function(t, e) {
            return null != t && this.seek(t, e), this.reversed(!1).paused(!1)
        }, n.pause = function(t, e) {
            return null != t && this.seek(t, e), this.paused(!0)
        }, n.resume = function(t, e) {
            return null != t && this.seek(t, e), this.paused(!1)
        }, n.seek = function(t, e) {
            return this.totalTime(Number(t), e !== !1)
        }, n.restart = function(t, e) {
            return this.reversed(!1).paused(!1).totalTime(t ? -this._delay : 0, e !== !1, !0)
        }, n.reverse = function(t, e) {
            return null != t && this.seek(t || this.totalDuration(), e), this.reversed(!0).paused(!1)
        }, n.render = function() {}, n.invalidate = function() {
            return this._time = this._totalTime = 0, this._initted = this._gc = !1, this._rawPrevTime = -1, (this._gc || !this.timeline) && this._enabled(!0), this
        }, n.isActive = function() {
            var t, e = this._timeline,
                i = this._startTime;
            return !e || !this._gc && !this._paused && e.isActive() && (t = e.rawTime()) >= i && i + this.totalDuration() / this._timeScale > t
        }, n._enabled = function(t, e) {
            return o || a.wake(), this._gc = !t, this._active = this.isActive(), e !== !0 && (t && !this.timeline ? this._timeline.add(this, this._startTime - this._delay) : !t && this.timeline && this._timeline._remove(this, !0)), !1
        }, n._kill = function() {
            return this._enabled(!1, !1)
        }, n.kill = function(t, e) {
            return this._kill(t, e), this
        }, n._uncache = function(t) {
            for (var e = t ? this : this.timeline; e;) e._dirty = !0, e = e.timeline;
            return this
        }, n._swapSelfInParams = function(t) {
            for (var e = t.length, i = t.concat(); --e > -1;) "{self}" === t[e] && (i[e] = this);
            return i
        }, n.eventCallback = function(t, e, i, s) {
            if ("on" === (t || "").substr(0, 2)) {
                var r = this.vars;
                if (1 === arguments.length) return r[t];
                null == e ? delete r[t] : (r[t] = e, r[t + "Params"] = f(i) && -1 !== i.join("").indexOf("{self}") ? this._swapSelfInParams(i) : i, r[t + "Scope"] = s), "onUpdate" === t && (this._onUpdate = e)
            }
            return this
        }, n.delay = function(t) {
            return arguments.length ? (this._timeline.smoothChildTiming && this.startTime(this._startTime + t - this._delay), this._delay = t, this) : this._delay
        }, n.duration = function(t) {
            return arguments.length ? (this._duration = this._totalDuration = t, this._uncache(!0), this._timeline.smoothChildTiming && this._time > 0 && this._time < this._duration && 0 !== t && this.totalTime(this._totalTime * (t / this._duration), !0), this) : (this._dirty = !1, this._duration)
        }, n.totalDuration = function(t) {
            return this._dirty = !1, arguments.length ? this.duration(t) : this._totalDuration
        }, n.time = function(t, e) {
            return arguments.length ? (this._dirty && this.totalDuration(), this.totalTime(t > this._duration ? this._duration : t, e)) : this._time
        }, n.totalTime = function(t, e, i) {
            if (o || a.wake(), !arguments.length) return this._totalTime;
            if (this._timeline) {
                if (0 > t && !i && (t += this.totalDuration()), this._timeline.smoothChildTiming) {
                    this._dirty && this.totalDuration();
                    var s = this._totalDuration,
                        r = this._timeline;
                    if (t > s && !i && (t = s), this._startTime = (this._paused ? this._pauseTime : r._time) - (this._reversed ? s - t : t) / this._timeScale, r._dirty || this._uncache(!1), r._timeline)
                        for (; r._timeline;) r._timeline._time !== (r._startTime + r._totalTime) / r._timeScale && r.totalTime(r._totalTime, !0), r = r._timeline
                }
                this._gc && this._enabled(!0, !1), (this._totalTime !== t || 0 === this._duration) && (this.render(t, e, !1), z.length && $())
            }
            return this
        }, n.progress = n.totalProgress = function(t, e) {
            return arguments.length ? this.totalTime(this.duration() * t, e) : this._time / this.duration()
        }, n.startTime = function(t) {
            return arguments.length ? (t !== this._startTime && (this._startTime = t, this.timeline && this.timeline._sortChildren && this.timeline.add(this, t - this._delay)), this) : this._startTime
        }, n.endTime = function(t) {
            return this._startTime + (0 != t ? this.totalDuration() : this.duration()) / this._timeScale
        }, n.timeScale = function(t) {
            if (!arguments.length) return this._timeScale;
            if (t = t || _, this._timeline && this._timeline.smoothChildTiming) {
                var e = this._pauseTime,
                    i = e || 0 === e ? e : this._timeline.totalTime();
                this._startTime = i - (i - this._startTime) * this._timeScale / t
            }
            return this._timeScale = t, this._uncache(!1)
        }, n.reversed = function(t) {
            return arguments.length ? (t != this._reversed && (this._reversed = t, this.totalTime(this._timeline && !this._timeline.smoothChildTiming ? this.totalDuration() - this._totalTime : this._totalTime, !0)), this) : this._reversed
        }, n.paused = function(t) {
            if (!arguments.length) return this._paused;
            var e, i, s = this._timeline;
            return t != this._paused && s && (o || t || a.wake(), e = s.rawTime(), i = e - this._pauseTime, !t && s.smoothChildTiming && (this._startTime += i, this._uncache(!1)), this._pauseTime = t ? e : null, this._paused = t, this._active = this.isActive(), !t && 0 !== i && this._initted && this.duration() && this.render(s.smoothChildTiming ? this._totalTime : (e - this._startTime) / this._timeScale, !0, !0)), this._gc && !t && this._enabled(!0, !1), this
        };
        var D = v("core.SimpleTimeline", function(t) {
            R.call(this, 0, t), this.autoRemoveChildren = this.smoothChildTiming = !0
        });
        n = D.prototype = new R, n.constructor = D, n.kill()._gc = !1, n._first = n._last = n._recent = null, n._sortChildren = !1, n.add = n.insert = function(t, e) {
            var i, s;
            if (t._startTime = Number(e || 0) + t._delay, t._paused && this !== t._timeline && (t._pauseTime = t._startTime + (this.rawTime() - t._startTime) / t._timeScale), t.timeline && t.timeline._remove(t, !0), t.timeline = t._timeline = this, t._gc && t._enabled(!0, !0), i = this._last, this._sortChildren)
                for (s = t._startTime; i && i._startTime > s;) i = i._prev;
            return i ? (t._next = i._next, i._next = t) : (t._next = this._first, this._first = t), t._next ? t._next._prev = t : this._last = t, t._prev = i, this._recent = t, this._timeline && this._uncache(!0), this
        }, n._remove = function(t, e) {
            return t.timeline === this && (e || t._enabled(!1, !0), t._prev ? t._prev._next = t._next : this._first === t && (this._first = t._next), t._next ? t._next._prev = t._prev : this._last === t && (this._last = t._prev), t._next = t._prev = t.timeline = null, t === this._recent && (this._recent = this._last), this._timeline && this._uncache(!0)), this
        }, n.render = function(t, e, i) {
            var s, r = this._first;
            for (this._totalTime = this._time = this._rawPrevTime = t; r;) s = r._next, (r._active || t >= r._startTime && !r._paused) && (r._reversed ? r.render((r._dirty ? r.totalDuration() : r._totalDuration) - (t - r._startTime) * r._timeScale, e, i) : r.render((t - r._startTime) * r._timeScale, e, i)), r = s
        }, n.rawTime = function() {
            return o || a.wake(), this._totalTime
        };
        var I = v("TweenLite", function(e, i, s) {
                if (R.call(this, i, s), this.render = I.prototype.render, null == e) throw "Cannot tween a null target.";
                this.target = e = "string" != typeof e ? e : I.selector(e) || e;
                var r, n, a, o = e.jquery || e.length && e !== t && e[0] && (e[0] === t || e[0].nodeType && e[0].style && !e.nodeType),
                    l = this.vars.overwrite;
                if (this._overwrite = l = null == l ? Q[I.defaultOverwrite] : "number" == typeof l ? l >> 0 : Q[l], (o || e instanceof Array || e.push && f(e)) && "number" != typeof e[0])
                    for (this._targets = a = u(e), this._propLookup = [], this._siblings = [], r = 0; a.length > r; r++) n = a[r], n ? "string" != typeof n ? n.length && n !== t && n[0] && (n[0] === t || n[0].nodeType && n[0].style && !n.nodeType) ? (a.splice(r--, 1), this._targets = a = a.concat(u(n))) : (this._siblings[r] = K(n, this, !1), 1 === l && this._siblings[r].length > 1 && J(n, this, null, 1, this._siblings[r])) : (n = a[r--] = I.selector(n), "string" == typeof n && a.splice(r + 1, 1)) : a.splice(r--, 1);
                else this._propLookup = {}, this._siblings = K(e, this, !1), 1 === l && this._siblings.length > 1 && J(e, this, null, 1, this._siblings);
                (this.vars.immediateRender || 0 === i && 0 === this._delay && this.vars.immediateRender !== !1) && (this._time = -_, this.render(-this._delay))
            }, !0),
            E = function(e) {
                return e && e.length && e !== t && e[0] && (e[0] === t || e[0].nodeType && e[0].style && !e.nodeType)
            },
            O = function(t, e) {
                var i, s = {};
                for (i in t) G[i] || i in e && "transform" !== i && "x" !== i && "y" !== i && "width" !== i && "height" !== i && "className" !== i && "border" !== i || !(!U[i] || U[i] && U[i]._autoCSS) || (s[i] = t[i], delete t[i]);
                t.css = s
            };
        n = I.prototype = new R, n.constructor = I, n.kill()._gc = !1, n.ratio = 0, n._firstPT = n._targets = n._overwrittenProps = n._startAt = null, n._notifyPluginsOfEnabled = n._lazy = !1, I.version = "1.16.1", I.defaultEase = n._ease = new y(null, null, 1, 1), I.defaultOverwrite = "auto", I.ticker = a, I.autoSleep = 120, I.lagSmoothing = function(t, e) {
            a.lagSmoothing(t, e)
        }, I.selector = t.$ || t.jQuery || function(e) {
            var i = t.$ || t.jQuery;
            return i ? (I.selector = i, i(e)) : "undefined" == typeof document ? e : document.querySelectorAll ? document.querySelectorAll(e) : document.getElementById("#" === e.charAt(0) ? e.substr(1) : e)
        };
        var z = [],
            L = {},
            N = I._internals = {
                isArray: f,
                isSelector: E,
                lazyTweens: z
            },
            U = I._plugins = {},
            F = N.tweenLookup = {},
            j = 0,
            G = N.reservedProps = {
                ease: 1,
                delay: 1,
                overwrite: 1,
                onComplete: 1,
                onCompleteParams: 1,
                onCompleteScope: 1,
                useFrames: 1,
                runBackwards: 1,
                startAt: 1,
                onUpdate: 1,
                onUpdateParams: 1,
                onUpdateScope: 1,
                onStart: 1,
                onStartParams: 1,
                onStartScope: 1,
                onReverseComplete: 1,
                onReverseCompleteParams: 1,
                onReverseCompleteScope: 1,
                onRepeat: 1,
                onRepeatParams: 1,
                onRepeatScope: 1,
                easeParams: 1,
                yoyo: 1,
                immediateRender: 1,
                repeat: 1,
                repeatDelay: 1,
                data: 1,
                paused: 1,
                reversed: 1,
                autoCSS: 1,
                lazy: 1,
                onOverwrite: 1
            },
            Q = {
                none: 0,
                all: 1,
                auto: 2,
                concurrent: 3,
                allOnStart: 4,
                preexisting: 5,
                "true": 1,
                "false": 0
            },
            q = R._rootFramesTimeline = new D,
            B = R._rootTimeline = new D,
            M = 30,
            $ = N.lazyRender = function() {
                var t, e = z.length;
                for (L = {}; --e > -1;) t = z[e], t && t._lazy !== !1 && (t.render(t._lazy[0], t._lazy[1], !0), t._lazy = !1);
                z.length = 0
            };
        B._startTime = a.time, q._startTime = a.frame, B._active = q._active = !0, setTimeout($, 1), R._updateRoot = I.render = function() {
            var t, e, i;
            if (z.length && $(), B.render((a.time - B._startTime) * B._timeScale, !1, !1), q.render((a.frame - q._startTime) * q._timeScale, !1, !1), z.length && $(), a.frame >= M) {
                M = a.frame + (parseInt(I.autoSleep, 10) || 120);
                for (i in F) {
                    for (e = F[i].tweens, t = e.length; --t > -1;) e[t]._gc && e.splice(t, 1);
                    0 === e.length && delete F[i]
                }
                if (i = B._first, (!i || i._paused) && I.autoSleep && !q._first && 1 === a._listeners.tick.length) {
                    for (; i && i._paused;) i = i._next;
                    i || a.sleep()
                }
            }
        }, a.addEventListener("tick", R._updateRoot);
        var K = function(t, e, i) {
                var s, r, n = t._gsTweenID;
                if (F[n || (t._gsTweenID = n = "t" + j++)] || (F[n] = {
                        target: t,
                        tweens: []
                    }), e && (s = F[n].tweens, s[r = s.length] = e, i))
                    for (; --r > -1;) s[r] === e && s.splice(r, 1);
                return F[n].tweens
            },
            H = function(t, e, i, s) {
                var r, n, a = t.vars.onOverwrite;
                return a && (r = a(t, e, i, s)), a = I.onOverwrite, a && (n = a(t, e, i, s)), r !== !1 && n !== !1
            },
            J = function(t, e, i, s, r) {
                var n, a, o, l;
                if (1 === s || s >= 4) {
                    for (l = r.length, n = 0; l > n; n++)
                        if ((o = r[n]) !== e) o._gc || H(o, e) && o._enabled(!1, !1) && (a = !0);
                        else if (5 === s) break;
                    return a
                }
                var h, u = e._startTime + _,
                    m = [],
                    f = 0,
                    c = 0 === e._duration;
                for (n = r.length; --n > -1;)(o = r[n]) === e || o._gc || o._paused || (o._timeline !== e._timeline ? (h = h || V(e, 0, c), 0 === V(o, h, c) && (m[f++] = o)) : u >= o._startTime && o._startTime + o.totalDuration() / o._timeScale > u && ((c || !o._initted) && 2e-10 >= u - o._startTime || (m[f++] = o)));
                for (n = f; --n > -1;)
                    if (o = m[n], 2 === s && o._kill(i, t, e) && (a = !0), 2 !== s || !o._firstPT && o._initted) {
                        if (2 !== s && !H(o, e)) continue;
                        o._enabled(!1, !1) && (a = !0)
                    }
                return a
            },
            V = function(t, e, i) {
                for (var s = t._timeline, r = s._timeScale, n = t._startTime; s._timeline;) {
                    if (n += s._startTime, r *= s._timeScale, s._paused) return -100;
                    s = s._timeline
                }
                return n /= r, n > e ? n - e : i && n === e || !t._initted && 2 * _ > n - e ? _ : (n += t.totalDuration() / t._timeScale / r) > e + _ ? 0 : n - e - _
            };
        n._init = function() {
            var t, e, i, s, r, n = this.vars,
                a = this._overwrittenProps,
                o = this._duration,
                l = !!n.immediateRender,
                h = n.ease;
            if (n.startAt) {
                this._startAt && (this._startAt.render(-1, !0), this._startAt.kill()), r = {};
                for (s in n.startAt) r[s] = n.startAt[s];
                if (r.overwrite = !1, r.immediateRender = !0, r.lazy = l && n.lazy !== !1, r.startAt = r.delay = null, this._startAt = I.to(this.target, 0, r), l)
                    if (this._time > 0) this._startAt = null;
                    else if (0 !== o) return
            } else if (n.runBackwards && 0 !== o)
                if (this._startAt) this._startAt.render(-1, !0), this._startAt.kill(), this._startAt = null;
                else {
                    0 !== this._time && (l = !1), i = {};
                    for (s in n) G[s] && "autoCSS" !== s || (i[s] = n[s]);
                    if (i.overwrite = 0, i.data = "isFromStart", i.lazy = l && n.lazy !== !1, i.immediateRender = l, this._startAt = I.to(this.target, 0, i), l) {
                        if (0 === this._time) return
                    } else this._startAt._init(), this._startAt._enabled(!1), this.vars.immediateRender && (this._startAt = null)
                }
            if (this._ease = h = h ? h instanceof y ? h : "function" == typeof h ? new y(h, n.easeParams) : w[h] || I.defaultEase : I.defaultEase, n.easeParams instanceof Array && h.config && (this._ease = h.config.apply(h, n.easeParams)), this._easeType = this._ease._type, this._easePower = this._ease._power, this._firstPT = null, this._targets)
                for (t = this._targets.length; --t > -1;) this._initProps(this._targets[t], this._propLookup[t] = {}, this._siblings[t], a ? a[t] : null) && (e = !0);
            else e = this._initProps(this.target, this._propLookup, this._siblings, a);
            if (e && I._onPluginEvent("_onInitAllProps", this), a && (this._firstPT || "function" != typeof this.target && this._enabled(!1, !1)), n.runBackwards)
                for (i = this._firstPT; i;) i.s += i.c, i.c = -i.c, i = i._next;
            this._onUpdate = n.onUpdate, this._initted = !0
        }, n._initProps = function(e, i, s, r) {
            var n, a, o, l, h, _;
            if (null == e) return !1;
            L[e._gsTweenID] && $(), this.vars.css || e.style && e !== t && e.nodeType && U.css && this.vars.autoCSS !== !1 && O(this.vars, e);
            for (n in this.vars) {
                if (_ = this.vars[n], G[n]) _ && (_ instanceof Array || _.push && f(_)) && -1 !== _.join("").indexOf("{self}") && (this.vars[n] = _ = this._swapSelfInParams(_, this));
                else if (U[n] && (l = new U[n])._onInitTween(e, this.vars[n], this)) {
                    for (this._firstPT = h = {
                            _next: this._firstPT,
                            t: l,
                            p: "setRatio",
                            s: 0,
                            c: 1,
                            f: !0,
                            n: n,
                            pg: !0,
                            pr: l._priority
                        }, a = l._overwriteProps.length; --a > -1;) i[l._overwriteProps[a]] = this._firstPT;
                    (l._priority || l._onInitAllProps) && (o = !0), (l._onDisable || l._onEnable) && (this._notifyPluginsOfEnabled = !0)
                } else this._firstPT = i[n] = h = {
                    _next: this._firstPT,
                    t: e,
                    p: n,
                    f: "function" == typeof e[n],
                    n: n,
                    pg: !1,
                    pr: 0
                }, h.s = h.f ? e[n.indexOf("set") || "function" != typeof e["get" + n.substr(3)] ? n : "get" + n.substr(3)]() : parseFloat(e[n]), h.c = "string" == typeof _ && "=" === _.charAt(1) ? parseInt(_.charAt(0) + "1", 10) * Number(_.substr(2)) : Number(_) - h.s || 0;
                h && h._next && (h._next._prev = h)
            }
            return r && this._kill(r, e) ? this._initProps(e, i, s, r) : this._overwrite > 1 && this._firstPT && s.length > 1 && J(e, this, i, this._overwrite, s) ? (this._kill(i, e), this._initProps(e, i, s, r)) : (this._firstPT && (this.vars.lazy !== !1 && this._duration || this.vars.lazy && !this._duration) && (L[e._gsTweenID] = !0), o)
        }, n.render = function(t, e, i) {
            var s, r, n, a, o = this._time,
                l = this._duration,
                h = this._rawPrevTime;
            if (t >= l) this._totalTime = this._time = l, this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1, this._reversed || (s = !0, r = "onComplete", i = i || this._timeline.autoRemoveChildren), 0 === l && (this._initted || !this.vars.lazy || i) && (this._startTime === this._timeline._duration && (t = 0), (0 === t || 0 > h || h === _ && "isPause" !== this.data) && h !== t && (i = !0, h > _ && (r = "onReverseComplete")), this._rawPrevTime = a = !e || t || h === t ? t : _);
            else if (1e-7 > t) this._totalTime = this._time = 0, this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0, (0 !== o || 0 === l && h > 0) && (r = "onReverseComplete", s = this._reversed), 0 > t && (this._active = !1, 0 === l && (this._initted || !this.vars.lazy || i) && (h >= 0 && (h !== _ || "isPause" !== this.data) && (i = !0), this._rawPrevTime = a = !e || t || h === t ? t : _)), this._initted || (i = !0);
            else if (this._totalTime = this._time = t, this._easeType) {
                var u = t / l,
                    m = this._easeType,
                    f = this._easePower;
                (1 === m || 3 === m && u >= .5) && (u = 1 - u), 3 === m && (u *= 2), 1 === f ? u *= u : 2 === f ? u *= u * u : 3 === f ? u *= u * u * u : 4 === f && (u *= u * u * u * u), this.ratio = 1 === m ? 1 - u : 2 === m ? u : .5 > t / l ? u / 2 : 1 - u / 2
            } else this.ratio = this._ease.getRatio(t / l);
            if (this._time !== o || i) {
                if (!this._initted) {
                    if (this._init(), !this._initted || this._gc) return;
                    if (!i && this._firstPT && (this.vars.lazy !== !1 && this._duration || this.vars.lazy && !this._duration)) return this._time = this._totalTime = o, this._rawPrevTime = h, z.push(this), this._lazy = [t, e], void 0;
                    this._time && !s ? this.ratio = this._ease.getRatio(this._time / l) : s && this._ease._calcEnd && (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1))
                }
                for (this._lazy !== !1 && (this._lazy = !1), this._active || !this._paused && this._time !== o && t >= 0 && (this._active = !0), 0 === o && (this._startAt && (t >= 0 ? this._startAt.render(t, e, i) : r || (r = "_dummyGS")), this.vars.onStart && (0 !== this._time || 0 === l) && (e || this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || T))), n = this._firstPT; n;) n.f ? n.t[n.p](n.c * this.ratio + n.s) : n.t[n.p] = n.c * this.ratio + n.s, n = n._next;
                this._onUpdate && (0 > t && this._startAt && t !== -1e-4 && this._startAt.render(t, e, i), e || (this._time !== o || s) && this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || T)), r && (!this._gc || i) && (0 > t && this._startAt && !this._onUpdate && t !== -1e-4 && this._startAt.render(t, e, i), s && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !e && this.vars[r] && this.vars[r].apply(this.vars[r + "Scope"] || this, this.vars[r + "Params"] || T), 0 === l && this._rawPrevTime === _ && a !== _ && (this._rawPrevTime = 0))
            }
        }, n._kill = function(t, e, i) {
            if ("all" === t && (t = null), null == t && (null == e || e === this.target)) return this._lazy = !1, this._enabled(!1, !1);
            e = "string" != typeof e ? e || this._targets || this.target : I.selector(e) || e;
            var s, r, n, a, o, l, h, _, u;
            if ((f(e) || E(e)) && "number" != typeof e[0])
                for (s = e.length; --s > -1;) this._kill(t, e[s]) && (l = !0);
            else {
                if (this._targets) {
                    for (s = this._targets.length; --s > -1;)
                        if (e === this._targets[s]) {
                            o = this._propLookup[s] || {}, this._overwrittenProps = this._overwrittenProps || [], r = this._overwrittenProps[s] = t ? this._overwrittenProps[s] || {} : "all";
                            break
                        }
                } else {
                    if (e !== this.target) return !1;
                    o = this._propLookup, r = this._overwrittenProps = t ? this._overwrittenProps || {} : "all"
                }
                if (o) {
                    if (h = t || o, _ = t !== r && "all" !== r && t !== o && ("object" != typeof t || !t._tempKill), i && (I.onOverwrite || this.vars.onOverwrite)) {
                        for (n in h) o[n] && (u || (u = []), u.push(n));
                        if (!H(this, i, e, u)) return !1
                    }
                    for (n in h)(a = o[n]) && (a.pg && a.t._kill(h) && (l = !0), a.pg && 0 !== a.t._overwriteProps.length || (a._prev ? a._prev._next = a._next : a === this._firstPT && (this._firstPT = a._next), a._next && (a._next._prev = a._prev), a._next = a._prev = null), delete o[n]), _ && (r[n] = 1);
                    !this._firstPT && this._initted && this._enabled(!1, !1)
                }
            }
            return l
        }, n.invalidate = function() {
            return this._notifyPluginsOfEnabled && I._onPluginEvent("_onDisable", this), this._firstPT = this._overwrittenProps = this._startAt = this._onUpdate = null, this._notifyPluginsOfEnabled = this._active = this._lazy = !1, this._propLookup = this._targets ? {} : [], R.prototype.invalidate.call(this), this.vars.immediateRender && (this._time = -_, this.render(-this._delay)), this
        }, n._enabled = function(t, e) {
            if (o || a.wake(), t && this._gc) {
                var i, s = this._targets;
                if (s)
                    for (i = s.length; --i > -1;) this._siblings[i] = K(s[i], this, !0);
                else this._siblings = K(this.target, this, !0)
            }
            return R.prototype._enabled.call(this, t, e), this._notifyPluginsOfEnabled && this._firstPT ? I._onPluginEvent(t ? "_onEnable" : "_onDisable", this) : !1
        }, I.to = function(t, e, i) {
            return new I(t, e, i)
        }, I.from = function(t, e, i) {
            return i.runBackwards = !0, i.immediateRender = 0 != i.immediateRender, new I(t, e, i)
        }, I.fromTo = function(t, e, i, s) {
            return s.startAt = i, s.immediateRender = 0 != s.immediateRender && 0 != i.immediateRender, new I(t, e, s)
        }, I.delayedCall = function(t, e, i, s, r) {
            return new I(e, 0, {
                delay: t,
                onComplete: e,
                onCompleteParams: i,
                onCompleteScope: s,
                onReverseComplete: e,
                onReverseCompleteParams: i,
                onReverseCompleteScope: s,
                immediateRender: !1,
                lazy: !1,
                useFrames: r,
                overwrite: 0
            })
        }, I.set = function(t, e) {
            return new I(t, 0, e)
        }, I.getTweensOf = function(t, e) {
            if (null == t) return [];
            t = "string" != typeof t ? t : I.selector(t) || t;
            var i, s, r, n;
            if ((f(t) || E(t)) && "number" != typeof t[0]) {
                for (i = t.length, s = []; --i > -1;) s = s.concat(I.getTweensOf(t[i], e));
                for (i = s.length; --i > -1;)
                    for (n = s[i], r = i; --r > -1;) n === s[r] && s.splice(i, 1)
            } else
                for (s = K(t).concat(), i = s.length; --i > -1;)(s[i]._gc || e && !s[i].isActive()) && s.splice(i, 1);
            return s
        }, I.killTweensOf = I.killDelayedCallsTo = function(t, e, i) {
            "object" == typeof e && (i = e, e = !1);
            for (var s = I.getTweensOf(t, e), r = s.length; --r > -1;) s[r]._kill(i, t)
        };
        var W = v("plugins.TweenPlugin", function(t, e) {
            this._overwriteProps = (t || "").split(","), this._propName = this._overwriteProps[0], this._priority = e || 0, this._super = W.prototype
        }, !0);
        if (n = W.prototype, W.version = "1.10.1", W.API = 2, n._firstPT = null, n._addTween = function(t, e, i, s, r, n) {
                var a, o;
                return null != s && (a = "number" == typeof s || "=" !== s.charAt(1) ? Number(s) - i : parseInt(s.charAt(0) + "1", 10) * Number(s.substr(2))) ? (this._firstPT = o = {
                    _next: this._firstPT,
                    t: t,
                    p: e,
                    s: i,
                    c: a,
                    f: "function" == typeof t[e],
                    n: r || e,
                    r: n
                }, o._next && (o._next._prev = o), o) : void 0
            }, n.setRatio = function(t) {
                for (var e, i = this._firstPT, s = 1e-6; i;) e = i.c * t + i.s, i.r ? e = Math.round(e) : s > e && e > -s && (e = 0), i.f ? i.t[i.p](e) : i.t[i.p] = e, i = i._next
            }, n._kill = function(t) {
                var e, i = this._overwriteProps,
                    s = this._firstPT;
                if (null != t[this._propName]) this._overwriteProps = [];
                else
                    for (e = i.length; --e > -1;) null != t[i[e]] && i.splice(e, 1);
                for (; s;) null != t[s.n] && (s._next && (s._next._prev = s._prev), s._prev ? (s._prev._next = s._next, s._prev = null) : this._firstPT === s && (this._firstPT = s._next)), s = s._next;
                return !1
            }, n._roundProps = function(t, e) {
                for (var i = this._firstPT; i;)(t[this._propName] || null != i.n && t[i.n.split(this._propName + "_").join("")]) && (i.r = e), i = i._next
            }, I._onPluginEvent = function(t, e) {
                var i, s, r, n, a, o = e._firstPT;
                if ("_onInitAllProps" === t) {
                    for (; o;) {
                        for (a = o._next, s = r; s && s.pr > o.pr;) s = s._next;
                        (o._prev = s ? s._prev : n) ? o._prev._next = o: r = o, (o._next = s) ? s._prev = o : n = o, o = a
                    }
                    o = e._firstPT = r
                }
                for (; o;) o.pg && "function" == typeof o.t[t] && o.t[t]() && (i = !0), o = o._next;
                return i
            }, W.activate = function(t) {
                for (var e = t.length; --e > -1;) t[e].API === W.API && (U[(new t[e])._propName] = t[e]);
                return !0
            }, d.plugin = function(t) {
                if (!(t && t.propName && t.init && t.API)) throw "illegal plugin definition.";
                var e, i = t.propName,
                    s = t.priority || 0,
                    r = t.overwriteProps,
                    n = {
                        init: "_onInitTween",
                        set: "setRatio",
                        kill: "_kill",
                        round: "_roundProps",
                        initAll: "_onInitAllProps"
                    },
                    a = v("plugins." + i.charAt(0).toUpperCase() + i.substr(1) + "Plugin", function() {
                        W.call(this, i, s), this._overwriteProps = r || []
                    }, t.global === !0),
                    o = a.prototype = new W(i);
                o.constructor = a, a.API = t.API;
                for (e in n) "function" == typeof t[e] && (o[n[e]] = t[e]);
                return a.version = t.version, W.activate([a]), a
            }, s = t._gsQueue) {
            for (r = 0; s.length > r; r++) s[r]();
            for (n in c) c[n].func || t.console.log("GSAP encountered missing dependency: com.greensock." + n)
        }
        o = !1
    }
})("undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window, "TweenLite");
typeof JSON != "object" && (JSON = {}),
    function() {
        "use strict";

        function f(e) {
            return e < 10 ? "0" + e : e
        }

        function quote(e) {
            return escapable.lastIndex = 0, escapable.test(e) ? '"' + e.replace(escapable, function(e) {
                var t = meta[e];
                return typeof t == "string" ? t : "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
            }) + '"' : '"' + e + '"'
        }

        function str(e, t) {
            var n, r, i, s, o = gap,
                u, a = t[e];
            a && typeof a == "object" && typeof a.toJSON == "function" && (a = a.toJSON(e)), typeof rep == "function" && (a = rep.call(t, e, a));
            switch (typeof a) {
                case "string":
                    return quote(a);
                case "number":
                    return isFinite(a) ? String(a) : "null";
                case "boolean":
                case "null":
                    return String(a);
                case "object":
                    if (!a) return "null";
                    gap += indent, u = [];
                    if (Object.prototype.toString.apply(a) === "[object Array]") {
                        s = a.length;
                        for (n = 0; n < s; n += 1) u[n] = str(n, a) || "null";
                        return i = u.length === 0 ? "[]" : gap ? "[\n" + gap + u.join(",\n" + gap) + "\n" + o + "]" : "[" + u.join(",") + "]", gap = o, i
                    }
                    if (rep && typeof rep == "object") {
                        s = rep.length;
                        for (n = 0; n < s; n += 1) typeof rep[n] == "string" && (r = rep[n], i = str(r, a), i && u.push(quote(r) + (gap ? ": " : ":") + i))
                    } else
                        for (r in a) Object.prototype.hasOwnProperty.call(a, r) && (i = str(r, a), i && u.push(quote(r) + (gap ? ": " : ":") + i));
                    return i = u.length === 0 ? "{}" : gap ? "{\n" + gap + u.join(",\n" + gap) + "\n" + o + "}" : "{" + u.join(",") + "}", gap = o, i
            }
        }
        typeof Date.prototype.toJSON != "function" && (Date.prototype.toJSON = function(e) {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
        }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(e) {
            return this.valueOf()
        });
        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            gap, indent, meta = {
                "\b": "\\b",
                "	": "\\t",
                "\n": "\\n",
                "\f": "\\f",
                "\r": "\\r",
                '"': '\\"',
                "\\": "\\\\"
            },
            rep;
        typeof JSON.stringify != "function" && (JSON.stringify = function(e, t, n) {
            var r;
            gap = "", indent = "";
            if (typeof n == "number")
                for (r = 0; r < n; r += 1) indent += " ";
            else typeof n == "string" && (indent = n);
            rep = t;
            if (!t || typeof t == "function" || typeof t == "object" && typeof t.length == "number") return str("", {
                "": e
            });
            throw new Error("JSON.stringify")
        }), typeof JSON.parse != "function" && (JSON.parse = function(text, reviver) {
            function walk(e, t) {
                var n, r, i = e[t];
                if (i && typeof i == "object")
                    for (n in i) Object.prototype.hasOwnProperty.call(i, n) && (r = walk(i, n), r !== undefined ? i[n] = r : delete i[n]);
                return reviver.call(e, t, i)
            }
            var j;
            text = String(text), cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function(e) {
                return "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
            }));
            if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"), typeof reviver == "function" ? walk({
                "": j
            }, "") : j;
            throw new SyntaxError("JSON.parse")
        })
    }(),
    function(e, t) {
        "use strict";
        var n = e.History = e.History || {};
        if (typeof n.Adapter != "undefined") throw new Error("History.js Adapter has already been loaded...");
        n.Adapter = {
            handlers: {},
            _uid: 1,
            uid: function(e) {
                return e._uid || (e._uid = n.Adapter._uid++)
            },
            bind: function(e, t, r) {
                var i = n.Adapter.uid(e);
                n.Adapter.handlers[i] = n.Adapter.handlers[i] || {}, n.Adapter.handlers[i][t] = n.Adapter.handlers[i][t] || [], n.Adapter.handlers[i][t].push(r), e["on" + t] = function(e, t) {
                    return function(r) {
                        n.Adapter.trigger(e, t, r)
                    }
                }(e, t)
            },
            trigger: function(e, t, r) {
                r = r || {};
                var i = n.Adapter.uid(e),
                    s, o;
                n.Adapter.handlers[i] = n.Adapter.handlers[i] || {}, n.Adapter.handlers[i][t] = n.Adapter.handlers[i][t] || [];
                for (s = 0, o = n.Adapter.handlers[i][t].length; s < o; ++s) n.Adapter.handlers[i][t][s].apply(this, [r])
            },
            extractEventData: function(e, n) {
                var r = n && n[e] || t;
                return r
            },
            onDomLoad: function(t) {
                var n = e.setTimeout(function() {
                    t()
                }, 2e3);
                e.onload = function() {
                    clearTimeout(n), t()
                }
            }
        }, typeof n.init != "undefined" && n.init()
    }(window),
    function(e, t) {
        "use strict";
        var n = e.document,
            r = e.setTimeout || r,
            i = e.clearTimeout || i,
            s = e.setInterval || s,
            o = e.History = e.History || {};
        if (typeof o.initHtml4 != "undefined") throw new Error("History.js HTML4 Support has already been loaded...");
        o.initHtml4 = function() {
            if (typeof o.initHtml4.initialized != "undefined") return !1;
            o.initHtml4.initialized = !0, o.enabled = !0, o.savedHashes = [], o.isLastHash = function(e) {
                var t = o.getHashByIndex(),
                    n;
                return n = e === t, n
            }, o.isHashEqual = function(e, t) {
                return e = encodeURIComponent(e).replace(/%25/g, "%"), t = encodeURIComponent(t).replace(/%25/g, "%"), e === t
            }, o.saveHash = function(e) {
                return o.isLastHash(e) ? !1 : (o.savedHashes.push(e), !0)
            }, o.getHashByIndex = function(e) {
                var t = null;
                return typeof e == "undefined" ? t = o.savedHashes[o.savedHashes.length - 1] : e < 0 ? t = o.savedHashes[o.savedHashes.length + e] : t = o.savedHashes[e], t
            }, o.discardedHashes = {}, o.discardedStates = {}, o.discardState = function(e, t, n) {
                var r = o.getHashByState(e),
                    i;
                return i = {
                    discardedState: e,
                    backState: n,
                    forwardState: t
                }, o.discardedStates[r] = i, !0
            }, o.discardHash = function(e, t, n) {
                var r = {
                    discardedHash: e,
                    backState: n,
                    forwardState: t
                };
                return o.discardedHashes[e] = r, !0
            }, o.discardedState = function(e) {
                var t = o.getHashByState(e),
                    n;
                return n = o.discardedStates[t] || !1, n
            }, o.discardedHash = function(e) {
                var t = o.discardedHashes[e] || !1;
                return t
            }, o.recycleState = function(e) {
                var t = o.getHashByState(e);
                return o.discardedState(e) && delete o.discardedStates[t], !0
            }, o.emulated.hashChange && (o.hashChangeInit = function() {
                o.checkerFunction = null;
                var t = "",
                    r, i, u, a, f = Boolean(o.getHash());
                return o.isInternetExplorer() ? (r = "historyjs-iframe", i = n.createElement("iframe"), i.setAttribute("id", r), i.setAttribute("src", "#"), i.style.display = "none", n.body.appendChild(i), i.contentWindow.document.open(), i.contentWindow.document.close(), u = "", a = !1, o.checkerFunction = function() {
                    if (a) return !1;
                    a = !0;
                    var n = o.getHash(),
                        r = o.getHash(i.contentWindow.document);
                    return n !== t ? (t = n, r !== n && (u = r = n, i.contentWindow.document.open(), i.contentWindow.document.close(), i.contentWindow.document.location.hash = o.escapeHash(n)), o.Adapter.trigger(e, "hashchange")) : r !== u && (u = r, f && r === "" ? o.back() : o.setHash(r, !1)), a = !1, !0
                }) : o.checkerFunction = function() {
                    var n = o.getHash() || "";
                    return n !== t && (t = n, o.Adapter.trigger(e, "hashchange")), !0
                }, o.intervalList.push(s(o.checkerFunction, o.options.hashChangeInterval)), !0
            }, o.Adapter.onDomLoad(o.hashChangeInit)), o.emulated.pushState && (o.onHashChange = function(t) {
                var n = t && t.newURL || o.getLocationHref(),
                    r = o.getHashByUrl(n),
                    i = null,
                    s = null,
                    u = null,
                    a;
                return o.isLastHash(r) ? (o.busy(!1), !1) : (o.doubleCheckComplete(), o.saveHash(r), r && o.isTraditionalAnchor(r) ? (o.Adapter.trigger(e, "anchorchange"), o.busy(!1), !1) : (i = o.extractState(o.getFullUrl(r || o.getLocationHref()), !0), o.isLastSavedState(i) ? (o.busy(!1), !1) : (s = o.getHashByState(i), a = o.discardedState(i), a ? (o.getHashByIndex(-2) === o.getHashByState(a.forwardState) ? o.back(!1) : o.forward(!1), !1) : (o.pushState(i.data, i.title, encodeURI(i.url), !1), !0))))
            }, o.Adapter.bind(e, "hashchange", o.onHashChange), o.pushState = function(t, n, r, i) {
                r = encodeURI(r).replace(/%25/g, "%");
                if (o.getHashByUrl(r)) throw new Error("History.js does not support states with fragment-identifiers (hashes/anchors).");
                if (i !== !1 && o.busy()) return o.pushQueue({
                    scope: o,
                    callback: o.pushState,
                    args: arguments,
                    queue: i
                }), !1;
                o.busy(!0);
                var s = o.createStateObject(t, n, r),
                    u = o.getHashByState(s),
                    a = o.getState(!1),
                    f = o.getHashByState(a),
                    l = o.getHash(),
                    c = o.expectedStateId == s.id;
                return o.storeState(s), o.expectedStateId = s.id, o.recycleState(s), o.setTitle(s), u === f ? (o.busy(!1), !1) : (o.saveState(s), c || o.Adapter.trigger(e, "statechange"), !o.isHashEqual(u, l) && !o.isHashEqual(u, o.getShortUrl(o.getLocationHref())) && o.setHash(u, !1), o.busy(!1), !0)
            }, o.replaceState = function(t, n, r, i) {
                r = encodeURI(r).replace(/%25/g, "%");
                if (o.getHashByUrl(r)) throw new Error("History.js does not support states with fragment-identifiers (hashes/anchors).");
                if (i !== !1 && o.busy()) return o.pushQueue({
                    scope: o,
                    callback: o.replaceState,
                    args: arguments,
                    queue: i
                }), !1;
                o.busy(!0);
                var s = o.createStateObject(t, n, r),
                    u = o.getHashByState(s),
                    a = o.getState(!1),
                    f = o.getHashByState(a),
                    l = o.getStateByIndex(-2);
                return o.discardState(a, s, l), u === f ? (o.storeState(s), o.expectedStateId = s.id, o.recycleState(s), o.setTitle(s), o.saveState(s), o.Adapter.trigger(e, "statechange"), o.busy(!1)) : o.pushState(s.data, s.title, s.url, !1), !0
            }), o.emulated.pushState && o.getHash() && !o.emulated.hashChange && o.Adapter.onDomLoad(function() {
                o.Adapter.trigger(e, "hashchange")
            })
        }, typeof o.init != "undefined" && o.init()
    }(window),
    function(e, t) {
        "use strict";
        var n = e.console || t,
            r = e.document,
            i = e.navigator,
            s = e.sessionStorage || !1,
            o = e.setTimeout,
            u = e.clearTimeout,
            a = e.setInterval,
            f = e.clearInterval,
            l = e.JSON,
            c = e.alert,
            h = e.History = e.History || {},
            p = e.history;
        try {
            s.setItem("TEST", "1"), s.removeItem("TEST")
        } catch (d) {
            s = !1
        }
        l.stringify = l.stringify || l.encode, l.parse = l.parse || l.decode;
        if (typeof h.init != "undefined") throw new Error("History.js Core has already been loaded...");
        h.init = function(e) {
            return typeof h.Adapter == "undefined" ? !1 : (typeof h.initCore != "undefined" && h.initCore(), typeof h.initHtml4 != "undefined" && h.initHtml4(), !0)
        }, h.initCore = function(d) {
            if (typeof h.initCore.initialized != "undefined") return !1;
            h.initCore.initialized = !0, h.options = h.options || {}, h.options.hashChangeInterval = h.options.hashChangeInterval || 100, h.options.safariPollInterval = h.options.safariPollInterval || 500, h.options.doubleCheckInterval = h.options.doubleCheckInterval || 500, h.options.disableSuid = h.options.disableSuid || !1, h.options.storeInterval = h.options.storeInterval || 1e3, h.options.busyDelay = h.options.busyDelay || 250, h.options.debug = h.options.debug || !1, h.options.initialTitle = h.options.initialTitle || r.title, h.options.html4Mode = h.options.html4Mode || !1, h.options.delayInit = h.options.delayInit || !1, h.intervalList = [], h.clearAllIntervals = function() {
                var e, t = h.intervalList;
                if (typeof t != "undefined" && t !== null) {
                    for (e = 0; e < t.length; e++) f(t[e]);
                    h.intervalList = null
                }
            }, h.debug = function() {
                (h.options.debug || !1) && h.log.apply(h, arguments)
            }, h.log = function() {
                var e = typeof n != "undefined" && typeof n.log != "undefined" && typeof n.log.apply != "undefined",
                    t = r.getElementById("log"),
                    i, s, o, u, a;
                e ? (u = Array.prototype.slice.call(arguments), i = u.shift(), typeof n.debug != "undefined" ? n.debug.apply(n, [i, u]) : n.log.apply(n, [i, u])) : i = "\n" + arguments[0] + "\n";
                for (s = 1, o = arguments.length; s < o; ++s) {
                    a = arguments[s];
                    if (typeof a == "object" && typeof l != "undefined") try {
                        a = l.stringify(a)
                    } catch (f) {}
                    i += "\n" + a + "\n"
                }
                return t ? (t.value += i + "\n-----\n", t.scrollTop = t.scrollHeight - t.clientHeight) : e || c(i), !0
            }, h.getInternetExplorerMajorVersion = function() {
                var e = h.getInternetExplorerMajorVersion.cached = typeof h.getInternetExplorerMajorVersion.cached != "undefined" ? h.getInternetExplorerMajorVersion.cached : function() {
                    var e = 3,
                        t = r.createElement("div"),
                        n = t.getElementsByTagName("i");
                    while ((t.innerHTML = "<!--[if gt IE " + ++e + "]><i></i><![endif]-->") && n[0]);
                    return e > 4 ? e : !1
                }();
                return e
            }, h.isInternetExplorer = function() {
                var e = h.isInternetExplorer.cached = typeof h.isInternetExplorer.cached != "undefined" ? h.isInternetExplorer.cached : Boolean(h.getInternetExplorerMajorVersion());
                return e
            }, h.options.html4Mode ? h.emulated = {
                pushState: !0,
                hashChange: !0
            } : h.emulated = {
                pushState: !Boolean(e.history && e.history.pushState && e.history.replaceState && !/ Mobile\/([1-7][a-z]|(8([abcde]|f(1[0-8]))))/i.test(i.userAgent) && !/AppleWebKit\/5([0-2]|3[0-2])/i.test(i.userAgent)),
                hashChange: Boolean(!("onhashchange" in e || "onhashchange" in r) || h.isInternetExplorer() && h.getInternetExplorerMajorVersion() < 8)
            }, h.enabled = !h.emulated.pushState, h.bugs = {
                setHash: Boolean(!h.emulated.pushState && i.vendor === "Apple Computer, Inc." && /AppleWebKit\/5([0-2]|3[0-3])/.test(i.userAgent)),
                safariPoll: Boolean(!h.emulated.pushState && i.vendor === "Apple Computer, Inc." && /AppleWebKit\/5([0-2]|3[0-3])/.test(i.userAgent)),
                ieDoubleCheck: Boolean(h.isInternetExplorer() && h.getInternetExplorerMajorVersion() < 8),
                hashEscape: Boolean(h.isInternetExplorer() && h.getInternetExplorerMajorVersion() < 7)
            }, h.isEmptyObject = function(e) {
                for (var t in e)
                    if (e.hasOwnProperty(t)) return !1;
                return !0
            }, h.cloneObject = function(e) {
                var t, n;
                return e ? (t = l.stringify(e), n = l.parse(t)) : n = {}, n
            }, h.getRootUrl = function() {
                var e = r.location.protocol + "//" + (r.location.hostname || r.location.host);
                if (r.location.port || !1) e += ":" + r.location.port;
                return e += "/", e
            }, h.getBaseHref = function() {
                var e = r.getElementsByTagName("base"),
                    t = null,
                    n = "";
                return e.length === 1 && (t = e[0], n = t.href.replace(/[^\/]+$/, "")), n = n.replace(/\/+$/, ""), n && (n += "/"), n
            }, h.getBaseUrl = function() {
                var e = h.getBaseHref() || h.getBasePageUrl() || h.getRootUrl();
                return e
            }, h.getPageUrl = function() {
                var e = h.getState(!1, !1),
                    t = (e || {}).url || h.getLocationHref(),
                    n;
                return n = t.replace(/\/+$/, "").replace(/[^\/]+$/, function(e, t, n) {
                    return /\./.test(e) ? e : e + "/"
                }), n
            }, h.getBasePageUrl = function() {
                var e = h.getLocationHref().replace(/[#\?].*/, "").replace(/[^\/]+$/, function(e, t, n) {
                    return /[^\/]$/.test(e) ? "" : e
                }).replace(/\/+$/, "") + "/";
                return e
            }, h.getFullUrl = function(e, t) {
                var n = e,
                    r = e.substring(0, 1);
                return t = typeof t == "undefined" ? !0 : t, /[a-z]+\:\/\//.test(e) || (r === "/" ? n = h.getRootUrl() + e.replace(/^\/+/, "") : r === "#" ? n = h.getPageUrl().replace(/#.*/, "") + e : r === "?" ? n = h.getPageUrl().replace(/[\?#].*/, "") + e : t ? n = h.getBaseUrl() + e.replace(/^(\.\/)+/, "") : n = h.getBasePageUrl() + e.replace(/^(\.\/)+/, "")), n.replace(/\#$/, "")
            }, h.getShortUrl = function(e) {
                var t = e,
                    n = h.getBaseUrl(),
                    r = h.getRootUrl();
                return h.emulated.pushState && (t = t.replace(n, "")), t = t.replace(r, "/"), h.isTraditionalAnchor(t) && (t = "./" + t), t = t.replace(/^(\.\/)+/g, "./").replace(/\#$/, ""), t
            }, h.getLocationHref = function(e) {
                return e = e || r, e.URL === e.location.href ? e.location.href : e.location.href === decodeURIComponent(e.URL) ? e.URL : e.location.hash && decodeURIComponent(e.location.href.replace(/^[^#]+/, "")) === e.location.hash ? e.location.href : e.URL.indexOf("#") == -1 && e.location.href.indexOf("#") != -1 ? e.location.href : e.URL || e.location.href
            }, h.store = {}, h.idToState = h.idToState || {}, h.stateToId = h.stateToId || {}, h.urlToId = h.urlToId || {}, h.storedStates = h.storedStates || [], h.savedStates = h.savedStates || [], h.normalizeStore = function() {
                h.store.idToState = h.store.idToState || {}, h.store.urlToId = h.store.urlToId || {}, h.store.stateToId = h.store.stateToId || {}
            }, h.getState = function(e, t) {
                typeof e == "undefined" && (e = !0), typeof t == "undefined" && (t = !0);
                var n = h.getLastSavedState();
                return !n && t && (n = h.createStateObject()), e && (n = h.cloneObject(n), n.url = n.cleanUrl || n.url), n
            }, h.getIdByState = function(e) {
                var t = h.extractId(e.url),
                    n;
                if (!t) {
                    n = h.getStateString(e);
                    if (typeof h.stateToId[n] != "undefined") t = h.stateToId[n];
                    else if (typeof h.store.stateToId[n] != "undefined") t = h.store.stateToId[n];
                    else {
                        for (;;) {
                            t = (new Date).getTime() + String(Math.random()).replace(/\D/g, "");
                            if (typeof h.idToState[t] == "undefined" && typeof h.store.idToState[t] == "undefined") break
                        }
                        h.stateToId[n] = t, h.idToState[t] = e
                    }
                }
                return t
            }, h.normalizeState = function(e) {
                var t, n;
                if (!e || typeof e != "object") e = {};
                if (typeof e.normalized != "undefined") return e;
                if (!e.data || typeof e.data != "object") e.data = {};
                return t = {}, t.normalized = !0, t.title = e.title || "", t.url = h.getFullUrl(e.url ? e.url : h.getLocationHref()), t.hash = h.getShortUrl(t.url), t.data = h.cloneObject(e.data), t.id = h.getIdByState(t), t.cleanUrl = t.url.replace(/\??\&_suid.*/, ""), t.url = t.cleanUrl, n = !h.isEmptyObject(t.data), (t.title || n) && h.options.disableSuid !== !0 && (t.hash = h.getShortUrl(t.url).replace(/\??\&_suid.*/, ""), /\?/.test(t.hash) || (t.hash += "?"), t.hash += "&_suid=" + t.id), t.hashedUrl = h.getFullUrl(t.hash), (h.emulated.pushState || h.bugs.safariPoll) && h.hasUrlDuplicate(t) && (t.url = t.hashedUrl), t
            }, h.createStateObject = function(e, t, n) {
                var r = {
                    data: e,
                    title: t,
                    url: n
                };
                return r = h.normalizeState(r), r
            }, h.getStateById = function(e) {
                e = String(e);
                var n = h.idToState[e] || h.store.idToState[e] || t;
                return n
            }, h.getStateString = function(e) {
                var t, n, r;
                return t = h.normalizeState(e), n = {
                    data: t.data,
                    title: e.title,
                    url: e.url
                }, r = l.stringify(n), r
            }, h.getStateId = function(e) {
                var t, n;
                return t = h.normalizeState(e), n = t.id, n
            }, h.getHashByState = function(e) {
                var t, n;
                return t = h.normalizeState(e), n = t.hash, n
            }, h.extractId = function(e) {
                var t, n, r, i;
                return e.indexOf("#") != -1 ? i = e.split("#")[0] : i = e, n = /(.*)\&_suid=([0-9]+)$/.exec(i), r = n ? n[1] || e : e, t = n ? String(n[2] || "") : "", t || !1
            }, h.isTraditionalAnchor = function(e) {
                var t = !/[\/\?\.]/.test(e);
                return t
            }, h.extractState = function(e, t) {
                var n = null,
                    r, i;
                return t = t || !1, r = h.extractId(e), r && (n = h.getStateById(r)), n || (i = h.getFullUrl(e), r = h.getIdByUrl(i) || !1, r && (n = h.getStateById(r)), !n && t && !h.isTraditionalAnchor(e) && (n = h.createStateObject(null, null, i))), n
            }, h.getIdByUrl = function(e) {
                var n = h.urlToId[e] || h.store.urlToId[e] || t;
                return n
            }, h.getLastSavedState = function() {
                return h.savedStates[h.savedStates.length - 1] || t
            }, h.getLastStoredState = function() {
                return h.storedStates[h.storedStates.length - 1] || t
            }, h.hasUrlDuplicate = function(e) {
                var t = !1,
                    n;
                return n = h.extractState(e.url), t = n && n.id !== e.id, t
            }, h.storeState = function(e) {
                return h.urlToId[e.url] = e.id, h.storedStates.push(h.cloneObject(e)), e
            }, h.isLastSavedState = function(e) {
                var t = !1,
                    n, r, i;
                return h.savedStates.length && (n = e.id, r = h.getLastSavedState(), i = r.id, t = n === i), t
            }, h.saveState = function(e) {
                return h.isLastSavedState(e) ? !1 : (h.savedStates.push(h.cloneObject(e)), !0)
            }, h.getStateByIndex = function(e) {
                var t = null;
                return typeof e == "undefined" ? t = h.savedStates[h.savedStates.length - 1] : e < 0 ? t = h.savedStates[h.savedStates.length + e] : t = h.savedStates[e], t
            }, h.getCurrentIndex = function() {
                var e = null;
                return h.savedStates.length < 1 ? e = 0 : e = h.savedStates.length - 1, e
            }, h.getHash = function(e) {
                var t = h.getLocationHref(e),
                    n;
                return n = h.getHashByUrl(t), n
            }, h.unescapeHash = function(e) {
                var t = h.normalizeHash(e);
                return t = decodeURIComponent(t), t
            }, h.normalizeHash = function(e) {
                var t = e.replace(/[^#]*#/, "").replace(/#.*/, "");
                return t
            }, h.setHash = function(e, t) {
                var n, i;
                return t !== !1 && h.busy() ? (h.pushQueue({
                    scope: h,
                    callback: h.setHash,
                    args: arguments,
                    queue: t
                }), !1) : (h.busy(!0), n = h.extractState(e, !0), n && !h.emulated.pushState ? h.pushState(n.data, n.title, n.url, !1) : h.getHash() !== e && (h.bugs.setHash ? (i = h.getPageUrl(), h.pushState(null, null, i + "#" + e, !1)) : r.location.hash = e), h)
            }, h.escapeHash = function(t) {
                var n = h.normalizeHash(t);
                return n = e.encodeURIComponent(n), h.bugs.hashEscape || (n = n.replace(/\%21/g, "!").replace(/\%26/g, "&").replace(/\%3D/g, "=").replace(/\%3F/g, "?")), n
            }, h.getHashByUrl = function(e) {
                var t = String(e).replace(/([^#]*)#?([^#]*)#?(.*)/, "$2");
                return t = h.unescapeHash(t), t
            }, h.setTitle = function(e) {
                var t = e.title,
                    n;
                t || (n = h.getStateByIndex(0), n && n.url === e.url && (t = n.title || h.options.initialTitle));
                try {
                    r.getElementsByTagName("title")[0].innerHTML = t.replace("<", "&lt;").replace(">", "&gt;").replace(" & ", " &amp; ")
                } catch (i) {}
                return r.title = t, h
            }, h.queues = [], h.busy = function(e) {
                typeof e != "undefined" ? h.busy.flag = e : typeof h.busy.flag == "undefined" && (h.busy.flag = !1);
                if (!h.busy.flag) {
                    u(h.busy.timeout);
                    var t = function() {
                        var e, n, r;
                        if (h.busy.flag) return;
                        for (e = h.queues.length - 1; e >= 0; --e) {
                            n = h.queues[e];
                            if (n.length === 0) continue;
                            r = n.shift(), h.fireQueueItem(r), h.busy.timeout = o(t, h.options.busyDelay)
                        }
                    };
                    h.busy.timeout = o(t, h.options.busyDelay)
                }
                return h.busy.flag
            }, h.busy.flag = !1, h.fireQueueItem = function(e) {
                return e.callback.apply(e.scope || h, e.args || [])
            }, h.pushQueue = function(e) {
                return h.queues[e.queue || 0] = h.queues[e.queue || 0] || [], h.queues[e.queue || 0].push(e), h
            }, h.queue = function(e, t) {
                return typeof e == "function" && (e = {
                    callback: e
                }), typeof t != "undefined" && (e.queue = t), h.busy() ? h.pushQueue(e) : h.fireQueueItem(e), h
            }, h.clearQueue = function() {
                return h.busy.flag = !1, h.queues = [], h
            }, h.stateChanged = !1, h.doubleChecker = !1, h.doubleCheckComplete = function() {
                return h.stateChanged = !0, h.doubleCheckClear(), h
            }, h.doubleCheckClear = function() {
                return h.doubleChecker && (u(h.doubleChecker), h.doubleChecker = !1), h
            }, h.doubleCheck = function(e) {
                return h.stateChanged = !1, h.doubleCheckClear(), h.bugs.ieDoubleCheck && (h.doubleChecker = o(function() {
                    return h.doubleCheckClear(), h.stateChanged || e(), !0
                }, h.options.doubleCheckInterval)), h
            }, h.safariStatePoll = function() {
                var t = h.extractState(h.getLocationHref()),
                    n;
                if (!h.isLastSavedState(t)) return n = t, n || (n = h.createStateObject()), h.Adapter.trigger(e, "popstate"), h;
                return
            }, h.back = function(e) {
                return e !== !1 && h.busy() ? (h.pushQueue({
                    scope: h,
                    callback: h.back,
                    args: arguments,
                    queue: e
                }), !1) : (h.busy(!0), h.doubleCheck(function() {
                    h.back(!1)
                }), p.go(-1), !0)
            }, h.forward = function(e) {
                return e !== !1 && h.busy() ? (h.pushQueue({
                    scope: h,
                    callback: h.forward,
                    args: arguments,
                    queue: e
                }), !1) : (h.busy(!0), h.doubleCheck(function() {
                    h.forward(!1)
                }), p.go(1), !0)
            }, h.go = function(e, t) {
                var n;
                if (e > 0)
                    for (n = 1; n <= e; ++n) h.forward(t);
                else {
                    if (!(e < 0)) throw new Error("History.go: History.go requires a positive or negative integer passed.");
                    for (n = -1; n >= e; --n) h.back(t)
                }
                return h
            };
            if (h.emulated.pushState) {
                var v = function() {};
                h.pushState = h.pushState || v, h.replaceState = h.replaceState || v
            } else h.onPopState = function(t, n) {
                var r = !1,
                    i = !1,
                    s, o;
                return h.doubleCheckComplete(), s = h.getHash(), s ? (o = h.extractState(s || h.getLocationHref(), !0), o ? h.replaceState(o.data, o.title, o.url, !1) : (h.Adapter.trigger(e, "anchorchange"), h.busy(!1)), h.expectedStateId = !1, !1) : (r = h.Adapter.extractEventData("state", t, n) || !1, r ? i = h.getStateById(r) : h.expectedStateId ? i = h.getStateById(h.expectedStateId) : i = h.extractState(h.getLocationHref()), i || (i = h.createStateObject(null, null, h.getLocationHref())), h.expectedStateId = !1, h.isLastSavedState(i) ? (h.busy(!1), !1) : (h.storeState(i), h.saveState(i), h.setTitle(i), h.Adapter.trigger(e, "statechange"), h.busy(!1), !0))
            }, h.Adapter.bind(e, "popstate", h.onPopState), h.pushState = function(t, n, r, i) {
                if (h.getHashByUrl(r) && h.emulated.pushState) throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");
                if (i !== !1 && h.busy()) return h.pushQueue({
                    scope: h,
                    callback: h.pushState,
                    args: arguments,
                    queue: i
                }), !1;
                h.busy(!0);
                var s = h.createStateObject(t, n, r);
                return h.isLastSavedState(s) ? h.busy(!1) : (h.storeState(s), h.expectedStateId = s.id, p.pushState(s.id, s.title, s.url), h.Adapter.trigger(e, "popstate")), !0
            }, h.replaceState = function(t, n, r, i) {
                if (h.getHashByUrl(r) && h.emulated.pushState) throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");
                if (i !== !1 && h.busy()) return h.pushQueue({
                    scope: h,
                    callback: h.replaceState,
                    args: arguments,
                    queue: i
                }), !1;
                h.busy(!0);
                var s = h.createStateObject(t, n, r);
                return h.isLastSavedState(s) ? h.busy(!1) : (h.storeState(s), h.expectedStateId = s.id, p.replaceState(s.id, s.title, s.url), h.Adapter.trigger(e, "popstate")), !0
            };
            if (s) {
                try {
                    h.store = l.parse(s.getItem("History.store")) || {}
                } catch (m) {
                    h.store = {}
                }
                h.normalizeStore()
            } else h.store = {}, h.normalizeStore();
            h.Adapter.bind(e, "unload", h.clearAllIntervals), h.saveState(h.storeState(h.extractState(h.getLocationHref(), !0))), s && (h.onUnload = function() {
                var e, t, n;
                try {
                    e = l.parse(s.getItem("History.store")) || {}
                } catch (r) {
                    e = {}
                }
                e.idToState = e.idToState || {}, e.urlToId = e.urlToId || {}, e.stateToId = e.stateToId || {};
                for (t in h.idToState) {
                    if (!h.idToState.hasOwnProperty(t)) continue;
                    e.idToState[t] = h.idToState[t]
                }
                for (t in h.urlToId) {
                    if (!h.urlToId.hasOwnProperty(t)) continue;
                    e.urlToId[t] = h.urlToId[t]
                }
                for (t in h.stateToId) {
                    if (!h.stateToId.hasOwnProperty(t)) continue;
                    e.stateToId[t] = h.stateToId[t]
                }
                h.store = e, h.normalizeStore(), n = l.stringify(e);
                try {
                    s.setItem("History.store", n)
                } catch (i) {
                    if (i.code !== DOMException.QUOTA_EXCEEDED_ERR) throw i;
                    s.length && (s.removeItem("History.store"), s.setItem("History.store", n))
                }
            }, h.intervalList.push(a(h.onUnload, h.options.storeInterval)), h.Adapter.bind(e, "beforeunload", h.onUnload), h.Adapter.bind(e, "unload", h.onUnload));
            if (!h.emulated.pushState) {
                h.bugs.safariPoll && h.intervalList.push(a(h.safariStatePoll, h.options.safariPollInterval));
                if (i.vendor === "Apple Computer, Inc." || (i.appCodeName || "") === "Mozilla") h.Adapter.bind(e, "hashchange", function() {
                    h.Adapter.trigger(e, "popstate")
                }), h.getHash() && h.Adapter.onDomLoad(function() {
                    h.Adapter.trigger(e, "hashchange")
                })
            }
        }, (!h.options || !h.options.delayInit) && h.init()
    }(window);;
(function(bLazyJS) {
    if (typeof define === 'function' && define.amd) {
        define(bLazyJS);
    } else {
        window.Blazy = bLazyJS();
    }
})(function() {
    'use strict';
    var source, options, winWidth, winHeight, images, count, isRetina, destroyed;
    var validateT, saveWinOffsetT;

    function Blazy(settings) {
        if (!document.querySelectorAll) {
            var s = document.createStyleSheet();
            document.querySelectorAll = function(r, c, i, j, a) {
                a = document.all, c = [], r = r.replace(/\[for\b/gi, '[htmlFor').split(',');
                for (i = r.length; i--;) {
                    s.addRule(r[i], 'k:v');
                    for (j = a.length; j--;) a[j].currentStyle.k && c.push(a[j]);
                    s.removeRule(0);
                }
                return c;
            };
        }
        destroyed = true;
        images = [];
        options = settings || {};
        options.error = options.error || false;
        options.offset = options.offset || 100;
        options.success = options.success || false;
        options.selector = options.selector || '.b-lazy';
        options.separator = options.separator || ' | ';
        options.container = options.container ? document.querySelectorAll(options.container) : false;
        options.errorClass = options.errorClass || 'b-error';
        options.breakpoints = options.breakpoints || false;
        options.successClass = options.successClass || 'b-loaded';
        options.src = source = options.src || 'data-src';
        isRetina = window.devicePixelRatio > 1;
        validateT = throttle(validate, 250);
        saveWinOffsetT = throttle(saveWinOffset, 500);
        saveWinOffset();
        each(options.breakpoints, function(object) {
            if (object.width <= window.innerWidth) {
                source = object.src;
                return false;
            }
        });
        initialize();
    }
    Blazy.prototype.revalidate = function() {
        initialize();
    };
    Blazy.prototype.load = function(element) {
        if (!isElementLoaded(element)) loadImage(element);
    };
    Blazy.prototype.destroy = function() {
        if (options.container) {
            each(options.container, function(object) {
                unbindEvent(object, 'scroll', validateT);
            });
        }
        unbindEvent(window, 'scroll', validateT);
        unbindEvent(window, 'resize', validateT);
        unbindEvent(window, 'resize', saveWinOffsetT);
        count = 0;
        images.length = 0;
        destroyed = true;
    };

    function initialize() {
        createImageArray(options.selector);
        if (destroyed) {
            destroyed = false;
            if (options.container) {
                each(options.container, function(object) {
                    bindEvent(object, 'scroll', validateT);
                });
            }
            bindEvent(window, 'resize', saveWinOffsetT);
            bindEvent(window, 'resize', validateT);
            bindEvent(window, 'scroll', validateT);
        }
        validate();
    }

    function validate() {
        for (var i = 0; i < count; i++) {
            var image = images[i];
            if (elementInView(image) || isElementLoaded(image)) {
                Blazy.prototype.load(image);
                images.splice(i, 1);
                count--;
                i--;
            }
        }
        if (count === 0) {
            Blazy.prototype.destroy();
        }
    }

    function loadImage(ele) {
        if (ele.offsetWidth > 0 && ele.offsetHeight > 0) {
            var dataSrc = ele.getAttribute(source) || ele.getAttribute(options.src);
            if (dataSrc) {
                var dataSrcSplitted = dataSrc.split(options.separator);
                var src = dataSrcSplitted[isRetina && dataSrcSplitted.length > 1 ? 1 : 0];
                var img = new Image();
                each(options.breakpoints, function(object) {
                    ele.removeAttribute(object.src);
                });
                ele.removeAttribute(options.src);
                img.onerror = function() {
                    if (options.error) options.error(ele, "invalid");
                    ele.className = ele.className + ' ' + options.errorClass;
                };
                img.onload = function() {
                    ele.nodeName.toLowerCase() === 'img' ? ele.src = src : ele.style.backgroundImage = 'url("' + src + '")';
                    ele.className = ele.className.length > 0 ? ele.className + ' ' + options.successClass : options.successClass;
                    if (options.success) options.success(ele);
                };
                img.src = src;
            } else {
                if (options.error) options.error(ele, "missing");
                ele.className = ele.className + ' ' + options.errorClass;
            }
        }
    }

    function elementInView(ele) {
        var rect = ele.getBoundingClientRect();
        var bottomline = winHeight + options.offset;
        return (rect.top >= 0 && rect.top <= bottomline || rect.bottom <= bottomline && rect.bottom >= 0 - options.offset);
    }

    function isElementLoaded(ele) {
        return (' ' + ele.className + ' ').indexOf(' ' + options.successClass + ' ') !== -1;
    }

    function createImageArray(selector) {
        var nodelist = document.querySelectorAll(selector);
        count = nodelist.length;
        for (var i = count; i--; images.unshift(nodelist[i])) {}
    }

    function saveWinOffset() {
        winHeight = window.innerHeight || document.documentElement.clientHeight;
        winWidth = window.innerWidth || document.documentElement.clientWidth;
    }

    function bindEvent(ele, type, fn) {
        if (ele.attachEvent) {
            ele.attachEvent && ele.attachEvent('on' + type, fn);
        } else {
            ele.addEventListener(type, fn, false);
        }
    }

    function unbindEvent(ele, type, fn) {
        if (ele.detachEvent) {
            ele.detachEvent && ele.detachEvent('on' + type, fn);
        } else {
            ele.removeEventListener(type, fn, false);
        }
    }

    function each(object, fn) {
        if (object && fn) {
            var l = object.length;
            for (var i = 0; i < l && fn(object[i], i) !== false; i++) {}
        }
    }

    function throttle(fn, minDelay) {
        var lastCall = 0;
        return function() {
            var now = +new Date();
            if (now - lastCall < minDelay) {
                return;
            }
            lastCall = now;
            fn.apply(images, arguments);
        };
    }
    return Blazy;
});
var app = app || {};
var slider = slider || {};
if (!window.console) window.console = {};
if (!window.console.log) window.console.log = function() {};
var $document = $(document),
    $window = $(window),
    $htmlBody = $('html, body'),
    $html = $('html'),
    $body = $('body'),
    transitionEnd = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';
desktop = Detectizr.device.type == 'desktop';
var $main = $('#main'),
    $contact = $('#contact'),
    $contactBg = $('#contact-bg'),
    $logo = $('#logo'),
    $loaderBg = $('#loader-bg'),
    $nav = $('#nav'),
    $navItems = $('.nav-item'),
    $dots = $('.dot'),
    $dotClone = $('#dot'),
    $title = $('#title'),
    $btnContact = $('#btn-contact-open'),
    $closeContact = $('#btn-contact-close'),
    $btns = $('.btn'),
    $btnsBGs = $('.btn-bg-mask'),
    $btnNext = $('#btn-next'),
    $navLinks = $('.nav-link'),
    $projects = $('.project'),
    $overlays = $('.project-overlay'),
    $pTitles = $('.project-title'),
    $masks = $('.project-mask'),
    $contents = $('.project-content'),
    _direction = null,
    _dotPos = null,
    _current = null,
    _prev = null,
    _next = null,
    _total = null,
    _lastAnim = 0,
    _delay = 500,
    _duration = 1000,
    _colors = null,
    _prevColors = null;
TweenLite.defaultEase = Expo.easeInOut;
paper.install(window);
var _tool = null,
    _view = null,
    _circle1 = null,
    _circle2 = null,
    _rect1 = null,
    _rect2 = null,
    _symbol = _symbol || {};
$document.ready(function() {
    app.init();
});
app.init = function(parent, children) {
    $('a[href="#"]').on('click', function(e) {
        e.preventDefault();
    });
    if (Detectizr.device.model === 'mac') {
        $html.addClass('is-mac');
    }
    var bLazyOptions = {
        selector: '.lazy',
        offset: 100,
        successClass: 'is-loaded',
        breakpoints: [{
            width: 1400,
            src: 'data-src-larger'
        }, {
            width: 1200,
            src: 'data-src-large'
        }, {
            width: 992,
            src: 'data-src-normal'
        }, {
            width: 768,
            src: 'data-src-medium'
        }, {
            width: 480,
            src: 'data-src-small'
        }]
    };
    var bLazy = new Blazy(bLazyOptions);
    app.contact.init();
    $btnContact.on('click', function(e) {
        app.contact.open();
    });
    $closeContact.on('click', function(e) {
        app.contact.close();
    });
    $window.on('load', function() {
        app.loader();
        bLazy.revalidate();
    });
    if (desktop) {
        slider.init();
        app.paper.init();
        $pTitles.lettering();
        $navLinks.each(function(i, e) {
            var $this = $(this);
            $this.on('click', function(e) {
                e.preventDefault();
                var dir = i > _current ? 'next' : 'prev';
                slider.slide(i, dir);
            });
        });
        $btnNext.on('click', function() {
            var index = _current + 1 <= _total ? _current + 1 : 0;
            slider.slide(index, 'next');
        });
        $document.bind('keyup', app.keyNav);
        if ($window.outerWidth() < 1025) {
            $document.unbind('mousewheel DOMMouseScroll', app.scrollNav);
        } else {
            $document.bind('mousewheel DOMMouseScroll', app.scrollNav);
        }
        $window.on('resize', function() {
            app.paper.resize();
            app.contact.init();
            if ($window.outerWidth() < 1025) {
                $document.unbind('mousewheel DOMMouseScroll', app.scrollNav);
            } else {
                $document.bind('mousewheel DOMMouseScroll', app.scrollNav);
            }
        });
    }
};
app.loader = function() {
    if (desktop) {
        TweenLite.set($loaderBg, {
            scaleX: (viewWidth * 2 / $loaderBg.width()) + 1,
            scaleY: (viewHeight / $loaderBg.height()) + 1
        });
    }
    if (!Modernizr.csstransitions) {
        TweenLite.to($loaderBg, 1, {
            scaleX: 1,
            scaleY: 1,
            onComplete: function() {
                setTimeout(function() {
                    $html.addClass('is-loaded');
                    $logo.hide();
                }, 1000);
            }
        });
    } else {
        setTimeout(function() {
            $html.addClass('is-loaded');
        }, 1000);
    }
};
app.keyNav = function(event) {
    if (event.which === 40 || event.which === 39) {
        index = _current + 1 <= _total ? _current + 1 : 0;
        slider.slide(index, 'next');
    }
    if (event.which === 38 || event.which === 37) {
        index = _current - 1 >= 0 ? _current - 1 : _total;
        slider.slide(index, 'prev');
    }
};
app.scrollNav = function(event) {
    event.preventDefault();
    var t = event.originalEvent.wheelDelta || -event.originalEvent.detail;
    var n = (new Date()).getTime();
    if (n - _lastAnim < _delay + _duration) {
        event.preventDefault();
        return;
    }
    if (t < -2) {
        i = _current + 1 <= _total ? _current + 1 : 0;
        slider.slide(i, 'next');
    } else if (t > 2) {
        i = _current - 1 >= 0 ? _current - 1 : _total;
        slider.slide(i, 'prev');
    }
    _lastAnim = n;
};
slider.init = function() {
    var pathname = window.location.pathname.replace(/\//g, '');
    _current = pathname !== '' && pathname !== 'contact' ? $('#' + pathname).index() : 0;
    _current = _current === -1 ? 0 : _current;
    _prev = -1;
    _next = 1;
    _total = $navLinks.length - 1;
    var $link = $navLinks.eq(_current),
        $dot = $dots.eq(_current),
        $project = $projects.eq(_current),
        $overlay = $overlays.eq(_current),
        $mask = $masks.eq(_current),
        $content = $contents.eq(_current);
    $link.data('active', true).addClass('is-active');
    $project.data('active', true).addClass('is-active');
    TweenLite.set($overlay, {
        y: '0%'
    });
    TweenLite.set($mask, {
        y: '0%'
    });
    TweenLite.set($content, {
        y: '0%'
    });
    _dotPos = {};
    _dotPos.top = $dot.offset().top;
    _dotPos.left = $dot.offset().left;
    _dotPos.bottom = $window.outerHeight() - _dotPos.top - $dot.outerHeight();
    TweenLite.set($dotClone, {
        scaleX: 0.65,
        scaleY: 0.65,
        top: _dotPos.top + 'px',
        bottom: _dotPos.bottom
    });
    TweenLite.set($dots, {
        scaleX: 0.65,
        scaleY: 0.65
    });
    TweenLite.set($dot, {
        scaleX: 1,
        scaleY: 1
    });
    _prevColors = {
        bg: $project.data('bg') === undefined ? null : $project.data('bg'),
        pattern: $project.data('pattern') === undefined ? null : app.hexToRgb($project.data('pattern')),
        main: $project.data('main') === undefined ? null : app.hexToRgb($project.data('main')),
        secondary: $project.data('secondary') === undefined ? null : app.hexToRgb($project.data('secondary')),
        siteTitle: $project.data('sitetitle') === undefined ? null : $project.data('sitetitle'),
        btnContact: $project.data('btncontact') === undefined ? null : $project.data('btncontact'),
        logo: $project.data('logo') === undefined ? null : $project.data('logo')
    };
    slider.updateColors(_prevColors, null);
};
slider.slide = function(index, direction) {
    $document.unbind('keyup', app.keyNav);
    $document.unbind('mousewheel DOMMouseScroll', app.keyNav);
    _current = index;
    _prev = $main.find('.is-active').index();
    _direction = direction;
    var $link = $navLinks.eq(_current),
        $dot = $dots.eq(_current),
        $project = $projects.eq(_current),
        $overlay = $overlays.eq(_current),
        $mask = $masks.eq(_current),
        $content = $contents.eq(_current);
    _colors = {
        bg: $project.data('bg') === undefined ? null : $project.data('bg'),
        pattern: $project.data('pattern') === undefined ? null : app.hexToRgb($project.data('pattern')),
        main: $project.data('main') === undefined ? null : app.hexToRgb($project.data('main')),
        secondary: $project.data('secondary') === undefined ? null : app.hexToRgb($project.data('secondary')),
        siteTitle: $project.data('sitetitle') === undefined ? '#fff' : $project.data('sitetitle'),
        btnContact: $project.data('btncontact') === undefined ? '#fff' : $project.data('btncontact'),
        logo: $project.data('logo') === undefined ? null : $project.data('logo')
    };
    slider.updateColors(_colors, _direction);
    app.paper.updateColors(_colors);
    var $prevLink = $navLinks.eq(_prev),
        $prevDot = $dots.eq(_prev),
        $prevProject = $projects.eq(_prev),
        $prevOverlay = $overlays.eq(_prev),
        $prevMask = $masks.eq(_prev),
        $prevContent = $contents.eq(_prev);
    if (!$link.data('active')) {
        History.replaceState('', 'Studio Meta, agence web à Strasbourg — Projet — ' + $link.data('title'), '/' + $link.attr('href'));
        $navLinks.removeClass('is-active').data('active', false);
        $link.addClass('is-active').data('active', true);
        $projects.removeClass('is-active');
        $project.addClass('is-active');
        _dotPos.top = $dot.offset().top;
        _dotPos.left = $dot.offset().left;
        _dotPos.bottom = $window.outerHeight() - _dotPos.top - $dot.outerHeight();
        var dotTween;
        if (_dotPos.top > $dotClone.offset().top) {
            dotTween = {
                bottom: _dotPos.bottom + 'px',
                ease: Expo.easeIn,
                onComplete: function() {
                    TweenLite.to($dotClone, 0.2, {
                        top: _dotPos.top + 'px',
                        ease: Expo.easeOut
                    });
                }
            };
        } else {
            dotTween = {
                top: _dotPos.top + 'px',
                ease: Expo.easeIn,
                onComplete: function() {
                    TweenLite.to($dotClone, 0.2, {
                        bottom: _dotPos.bottom + 'px',
                        ease: Expo.easeOut
                    });
                }
            };
        }
        TweenLite.to($dotClone, 0.4, dotTween);
        TweenLite.to($prevDot, 0.4, {
            delay: 0.4,
            scaleX: 0.65,
            scaleY: 0.65,
            ease: Expo.easeOut
        });
        TweenLite.to($dot, 0.2, {
            delay: 0.4,
            scaleX: 1,
            scaleY: 1,
            ease: Expo.easeOut,
            onComplete: function() {
                $document.bind('keyup', app.keyNav);
                $document.bind('mousewheel DOMMouseScroll', app.keyNav);
            }
        });
        TweenLite.set($overlay, {
            y: _direction === 'next' ? '-100%' : '100%'
        });
        TweenLite.set($mask, {
            y: _direction === 'next' ? '-100%' : '100%'
        });
        TweenLite.set($overlay.find('.left'), {
            y: _direction === 'next' ? '100%' : '-100%'
        });
        TweenLite.set($mask.find('.left'), {
            y: _direction === 'next' ? '100%' : '-100%'
        });
        TweenLite.set($content, {
            y: _direction === 'next' ? '100%' : '-100%'
        });
        TweenLite.to($prevOverlay, 1, {
            y: _direction === 'next' ? '100%' : '-100%'
        });
        TweenLite.to($prevMask, 1, {
            y: _direction === 'next' ? '100%' : '-100%'
        });
        TweenLite.to($prevOverlay.find('.left'), 1, {
            y: _direction === 'next' ? '-100%' : '100%'
        });
        TweenLite.to($prevMask.find('.left'), 1, {
            y: _direction === 'next' ? '-100%' : '100%'
        });
        TweenLite.to($prevContent, 1, {
            y: _direction === 'next' ? '-100%' : '100%'
        });
        TweenLite.to($overlay, 1, {
            y: '0%'
        });
        TweenLite.to($mask, 1.5, {
            y: '0%'
        });
        TweenLite.to($overlay.find('.left'), 1, {
            y: '0%'
        });
        TweenLite.to($mask.find('.left'), 1.5, {
            y: '0%'
        });
        TweenLite.to($content, 0.75, {
            y: '0%',
            onComplete: function() {
                _prevColors = _colors;
            }
        });
    }
};
slider.updateColors = function(colors, direction) {
    if (direction === null) {
        $body.css('background', colors.bg);
        $title.css('color', colors.siteTitle);
        $btnContact.css('color', colors.btnContact);
        $btnsBGs.css('background', colors.bg);
        $btnNext.css('background', colors.bg);
        $btnNext.find('svg').css('fill', colors.btnContact);
        TweenLite.to([$('#logo-fill-1'), $('#logo-fill-2')], 1, {
            delay: 1,
            fill: colors.logo
        });
    } else {
        if (!Modernizr.csstransitions) {
            TweenLite.to($title, 1, {
                color: colors.siteTitle
            });
            TweenLite.to($btnContact, 1, {
                color: colors.btnContact
            });
        } else {
            $title.css('color', colors.siteTitle);
            $btnContact.css('color', colors.btnContact);
        }
        TweenLite.to($body, 1, {
            backgroundColor: colors.bg
        });
        TweenLite.to($btnsBGs, 1, {
            backgroundColor: colors.bg
        });
        TweenLite.to($btnNext, 1, {
            backgroundColor: colors.bg
        });
        TweenLite.to($btnNext.find('svg'), 1, {
            fill: colors.btnContact
        });
        TweenLite.fromTo($('#logo-fill-2'), 0.5, {
            fill: colors.logo,
            scaleY: 0,
            transformOrigin: direction === 'next' ? 'center top' : 'center bottom'
        }, {
            delay: 0.35,
            scaleY: 1,
            onComplete: function() {
                $('#logo-fill-1').css('fill', colors.logo);
            }
        });
    }
};
var viewWidth = window.innerWidth / 2,
    viewHeight = window.innerHeight,
    xMax = Math.ceil(viewWidth / 140) + 1,
    yMax = Math.ceil(viewHeight / 140) + 1,
    group, symbol, groupInView = [],
    pattern = [];
app.paper = {
    init: function() {
        paper.setup('canvas');
        _tool = new Tool();
        _view = view;
        var options = {
            circle: {
                radius: 7
            },
            rectangle: {
                size: [8, 20]
            }
        };
        _circle1 = new Path.Circle(options.circle);
        _circle2 = new Path.Circle(options.circle);
        _rect1 = new Path.Rectangle(options.rectangle);
        _rect2 = new Path.Rectangle(options.rectangle);
        _circle1.position = new Point(100, 40);
        _circle2.position = new Point(40, 120);
        _rect1.position = new Point(28, 32);
        _rect2.position = new Point(108, 108);
        _rect1.rotate(-40);
        _rect2.rotate(60);
        _circle1.className = 'circle1';
        _circle2.className = 'circle2';
        _rect1.className = 'rect1';
        _rect2.className = 'rect2';
        group = new Group([_circle1, _circle2, _rect1, _rect2]);
        group.position = [-200, -200];
        app.paper.layout();
        view.onFrame = function(event) {
            for (var i = 0; i < pattern.length; i++) {
                pattern[i].children[2].rotate(0.5);
                pattern[i].children[3].rotate(0.5);
            }
        };
    },
    layout: function() {
        viewWidth = window.innerWidth / 2;
        viewHeight = window.innerHeight;
        xMax = Math.ceil(viewWidth / 140) + 1;
        yMax = Math.ceil(viewHeight / 140) + 1;
        var y = 0;
        for (var i = 0; i < xMax * yMax; i++) {
            var x = (i % xMax) * 140;
            y = i % xMax === xMax - 1 ? y + 140 : y;
            if (x >= 70 && x <= viewWidth - 70 && y >= 150 && y <= viewHeight - 70) {
                groupInView.push(i);
            }
            pattern[i] = group.clone();
            pattern[i].position = new Point([x, y]);
            pattern[i].fillColor = 'rgb(' + _prevColors.pattern.r + ',' + _prevColors.pattern.g + ',' + _prevColors.pattern.b + ')';
        }
        var main1 = app.randomElement(groupInView),
            main2 = app.randomElement(groupInView),
            second1 = app.randomElement(groupInView),
            second2 = app.randomElement(groupInView);
        main2 = main1 ? app.randomElement(groupInView) : main2;
        second2 = second1 ? app.randomElement(groupInView) : second2;
        pattern[main1].children[0].fillColor = pattern[main2].children[1].fillColor = 'rgb(' + _prevColors.main.r + ',' + _prevColors.main.g + ',' + _prevColors.main.b + ')';
        pattern[second1].children[2].fillColor = pattern[second2].children[3].fillColor = 'rgb(' + _prevColors.secondary.r + ',' + _prevColors.secondary.g + ',' + _prevColors.secondary.b + ')';
    },
    resize: function() {
        for (var i = 0; i < pattern.length; i++) {
            pattern[i].remove();
        }
        pattern = [];
        groupInView = [];
        app.paper.layout();
    },
    updateColors: function(currentColors) {
        for (var i = 0; i < pattern.length; i++) {
            var el = pattern[i];
            for (var c = 0; c < el.children.length; c++) {
                TweenLite.to(el.children[c].fillColor, 1, {
                    red: currentColors.pattern.r / 255,
                    green: currentColors.pattern.g / 255,
                    blue: currentColors.pattern.b / 255
                });
            }
            TweenLite.to(el, 1, {
                rotation: i % 2 === 0 ? pattern[i].rotation + 10 : pattern[i].rotation - 10
            });
        }
        var main1 = app.randomElement(groupInView),
            main2 = app.randomElement(groupInView),
            second1 = app.randomElement(groupInView),
            second2 = app.randomElement(groupInView);
        main2 = main1 ? app.randomElement(groupInView) : main2;
        second2 = second1 ? app.randomElement(groupInView) : second2;
        TweenLite.to([pattern[main1].children[0].fillColor, pattern[main2].children[1].fillColor], 1, {
            red: currentColors.main.r / 255,
            green: currentColors.main.g / 255,
            blue: currentColors.main.b / 255
        });
        TweenLite.to([pattern[second1].children[2].fillColor, pattern[second2].children[3].fillColor], 1, {
            red: currentColors.secondary.r / 255,
            green: currentColors.secondary.g / 255,
            blue: currentColors.secondary.b / 255
        });
    }
};
app.hexToRgb = function(hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};
app.randomElement = function(array) {
    return array[Math.floor(Math.random() * array.length)];
};
app.contact = {
    init: function() {
        var btnContact = $btnContact[0].getBoundingClientRect(),
            pathname = window.location.pathname.replace(/\//g, '');
        TweenLite.set($contactBg, {
            top: btnContact.top,
            right: viewWidth * 2 - btnContact.left - btnContact.width,
            bottom: viewHeight - btnContact.top - btnContact.height,
            left: btnContact.left
        });
        if (pathname === 'contact') {
            app.contact.open();
        }
    },
    open: function() {
        if (desktop) {
            $document.unbind('keyup', app.keyNav);
            $document.bind('keyup', app.contact.keyNav);
            $document.unbind('mousewheel DOMMouseScroll', app.scrollNav);
        }
        History.replaceState('', 'ACFBLA - Contact', '/contact/');
        $html.addClass('is-locked');
        $contact.data('open', true).addClass('is-open');
        $btnContact.addClass('is-open');
    },
    close: function() {
        if (desktop) {
            $document.bind('keyup', app.keyNav);
            $document.unbind('keyup', app.contact.keyNav);
            if ($window.outerWidth() >= 1025) {
                $document.bind('mousewheel DOMMouseScroll', app.scrollNav);
            }
            var $currentProject = $nav.find('.is-active');
            History.replaceState('', 'ACFBLA — ' + $currentProject.data('title'), '/' + $currentProject.attr('href'));
        } else {
            History.replaceState('', 'ACFBLA', '/');
        }
        $html.removeClass('is-locked');
        $contact.data('open', false).removeClass('is-open');
        $btnContact.removeClass('is-open');
    },
    keyNav: function(event) {
        if (event.which === 27) {
            app.contact.close();
        }
    }
};