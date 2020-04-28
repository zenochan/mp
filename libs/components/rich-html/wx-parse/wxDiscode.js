"use strict";
// HTML 支持的数学符号
function strNumDiscode(str) {
    str = str.replace(/&forall;/g, '∀')
        .replace(/&part;/g, '∂')
        .replace(/&exists;/g, '∃')
        .replace(/&empty;/g, '∅')
        .replace(/&nabla;/g, '∇')
        .replace(/&isin;/g, '∈')
        .replace(/&notin;/g, '∉')
        .replace(/&ni;/g, '∋')
        .replace(/&prod;/g, '∏')
        .replace(/&sum;/g, '∑')
        .replace(/&minus;/g, '−')
        .replace(/&lowast;/g, '∗')
        .replace(/&radic;/g, '√')
        .replace(/&prop;/g, '∝')
        .replace(/&infin;/g, '∞')
        .replace(/&ang;/g, '∠')
        .replace(/&and;/g, '∧')
        .replace(/&or;/g, '∨')
        .replace(/&cap;/g, '∩')
        .replace(/&cap;/g, '∪')
        .replace(/&int;/g, '∫')
        .replace(/&there4;/g, '∴')
        .replace(/&sim;/g, '∼')
        .replace(/&cong;/g, '≅')
        .replace(/&asymp;/g, '≈')
        .replace(/&ne;/g, '≠')
        .replace(/&le;/g, '≤')
        .replace(/&ge;/g, '≥')
        .replace(/&sub;/g, '⊂')
        .replace(/&sup;/g, '⊃')
        .replace(/&nsub;/g, '⊄')
        .replace(/&sube;/g, '⊆')
        .replace(/&supe;/g, '⊇')
        .replace(/&oplus;/g, '⊕')
        .replace(/&otimes;/g, '⊗')
        .replace(/&perp;/g, '⊥')
        .replace(/&sdot;/g, '⋅');
    return str;
}
//HTML 支持的希腊字母
function strGreeceDiscode(str) {
    return str.replace(/&Alpha;/g, 'Α')
        .replace(/&Beta;/g, 'Β')
        .replace(/&Gamma;/g, 'Γ')
        .replace(/&Delta;/g, 'Δ')
        .replace(/&Epsilon;/g, 'Ε')
        .replace(/&Zeta;/g, 'Ζ')
        .replace(/&Eta;/g, 'Η')
        .replace(/&Theta;/g, 'Θ')
        .replace(/&Iota;/g, 'Ι')
        .replace(/&Kappa;/g, 'Κ')
        .replace(/&Lambda;/g, 'Λ')
        .replace(/&Mu;/g, 'Μ')
        .replace(/&Nu;/g, 'Ν')
        .replace(/&Xi;/g, 'Ν')
        .replace(/&Omicron;/g, 'Ο')
        .replace(/&Pi;/g, 'Π')
        .replace(/&Rho;/g, 'Ρ')
        .replace(/&Sigma;/g, 'Σ')
        .replace(/&Tau;/g, 'Τ')
        .replace(/&Upsilon;/g, 'Υ')
        .replace(/&Phi;/g, 'Φ')
        .replace(/&Chi;/g, 'Χ')
        .replace(/&Psi;/g, 'Ψ')
        .replace(/&Omega;/g, 'Ω')
        .replace(/&alpha;/g, 'α')
        .replace(/&beta;/g, 'β')
        .replace(/&gamma;/g, 'γ')
        .replace(/&delta;/g, 'δ')
        .replace(/&epsilon;/g, 'ε')
        .replace(/&zeta;/g, 'ζ')
        .replace(/&eta;/g, 'η')
        .replace(/&theta;/g, 'θ')
        .replace(/&iota;/g, 'ι')
        .replace(/&kappa;/g, 'κ')
        .replace(/&lambda;/g, 'λ')
        .replace(/&mu;/g, 'μ')
        .replace(/&nu;/g, 'ν')
        .replace(/&xi;/g, 'ξ')
        .replace(/&omicron;/g, 'ο')
        .replace(/&pi;/g, 'π')
        .replace(/&rho;/g, 'ρ')
        .replace(/&sigmaf;/g, 'ς')
        .replace(/&sigma;/g, 'σ')
        .replace(/&tau;/g, 'τ')
        .replace(/&upsilon;/g, 'υ')
        .replace(/&phi;/g, 'φ')
        .replace(/&chi;/g, 'χ')
        .replace(/&psi;/g, 'ψ')
        .replace(/&omega;/g, 'ω')
        .replace(/&thetasym;/g, 'ϑ')
        .replace(/&upsih;/g, 'ϒ')
        .replace(/&piv;/g, 'ϖ')
        .replace(/&middot;/g, '·');
}
//
function strcharacterDiscode(str) {
    // 加入常用解析
    str = str.replace(/&nbsp;/g, ' ');
    str = str.replace(/&quot;/g, "'");
    str = str.replace(/&amp;/g, '&');
    // str = str.replace(/&lt;/g, '‹');
    // str = str.replace(/&gt;/g, '›');
    str = str.replace(/&lt;/g, '<');
    str = str.replace(/&gt;/g, '>');
    str = str.replace(/&#8226;/g, '•');
    return str;
}
// HTML 支持的其他实体
function strOtherDiscode(str) {
    return str.replace(/&OElig;/g, 'Œ')
        .replace(/&oelig;/g, 'œ')
        .replace(/&Scaron;/g, 'Š')
        .replace(/&scaron;/g, 'š')
        .replace(/&Yuml;/g, 'Ÿ')
        .replace(/&fnof;/g, 'ƒ')
        .replace(/&circ;/g, 'ˆ')
        .replace(/&tilde;/g, '˜')
        .replace(/&ensp;/g, '')
        .replace(/&emsp;/g, '')
        .replace(/&thinsp;/g, '')
        .replace(/&zwnj;/g, '')
        .replace(/&zwj;/g, '')
        .replace(/&lrm;/g, '')
        .replace(/&rlm;/g, '')
        .replace(/&ndash;/g, '–')
        .replace(/&mdash;/g, '—')
        .replace(/&lsquo;/g, '‘')
        .replace(/&rsquo;/g, '’')
        .replace(/&sbquo;/g, '‚')
        .replace(/&ldquo;/g, '“')
        .replace(/&rdquo;/g, '”')
        .replace(/&bdquo;/g, '„')
        .replace(/&dagger;/g, '†')
        .replace(/&Dagger;/g, '‡')
        .replace(/&bull;/g, '•')
        .replace(/&hellip;/g, '…')
        .replace(/&permil;/g, '‰')
        .replace(/&prime;/g, '′')
        .replace(/&Prime;/g, '″')
        .replace(/&lsaquo;/g, '‹')
        .replace(/&rsaquo;/g, '›')
        .replace(/&oline;/g, '‾')
        .replace(/&euro;/g, '€')
        .replace(/&trade;/g, '™')
        .replace(/&larr;/g, '←')
        .replace(/&uarr;/g, '↑')
        .replace(/&rarr;/g, '→')
        .replace(/&darr;/g, '↓')
        .replace(/&harr;/g, '↔')
        .replace(/&crarr;/g, '↵')
        .replace(/&lceil;/g, '⌈')
        .replace(/&rceil;/g, '⌉')
        .replace(/&lfloor;/g, '⌊')
        .replace(/&rfloor;/g, '⌋')
        .replace(/&loz;/g, '◊')
        .replace(/&spades;/g, '♠')
        .replace(/&clubs;/g, '♣')
        .replace(/&hearts;/g, '♥')
        .replace(/&diams;/g, '♦')
        .replace(/&#39;/g, '\'');
}
function strMoreDiscode(str) {
    str = str.replace(/\r\n/g, "");
    str = str.replace(/\n/g, "");
    str = str.replace(/code/g, "wxxxcode-style");
    return str;
}
function strDiscode(str) {
    str = strNumDiscode(str);
    str = strGreeceDiscode(str);
    str = strcharacterDiscode(str);
    str = strOtherDiscode(str);
    str = strMoreDiscode(str);
    return str;
}
function urlToHttpUrl(url, rep) {
    var patt1 = new RegExp("^//");
    var result = patt1.test(url);
    if (result) {
        url = rep + ":" + url;
    }
    return url;
}
module.exports = {
    strDiscode: strDiscode,
    urlToHttpUrl: urlToHttpUrl
};
//# sourceMappingURL=wxDiscode.js.map