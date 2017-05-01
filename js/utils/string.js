define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /* Get first word */
    function getFirstWord(str) {
        if (str.indexOf(' ') === -1)
            return str;
        else
            return str.substr(0, str.indexOf(' '));
    }
    exports.getFirstWord = getFirstWord;
    ;
    function replaceAll(text, what, rep) {
        return text.replace(new RegExp(what, 'g'), rep);
    }
    exports.replaceAll = replaceAll;
    function countCharacters(text, what, first) {
        let charCount = 0;
        for (let ch of text) {
            if (ch == what) {
                charCount++;
            }
            else {
                if (first)
                    break;
            }
        }
        return charCount;
    }
    exports.countCharacters = countCharacters;
    function toAscii(text) {
        return text.replace(/[^a-zA-Z0-9]/g, '_');
    }
    exports.toAscii = toAscii;
});
//# sourceMappingURL=string.js.map