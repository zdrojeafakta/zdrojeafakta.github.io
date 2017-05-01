define(["require", "exports", "utils/string"], function (require, exports, str) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // [Name|url]; 
    function getTitleFromUrlLine(text) {
        let index = text.indexOf("|");
        let first;
        if (index == -1) {
            first = text.substring(1, text.length - 1);
        }
        else {
            first = text.substring(1, index);
        }
        return first;
    }
    exports.getTitleFromUrlLine = getTitleFromUrlLine;
    // [Name|url]; 
    function getUrlFromUrlLine(text) {
        let index = text.indexOf("|");
        let second;
        if (index == -1) {
            second = "";
        }
        else {
            second = text.substring(index + 1, text.length - 1);
        }
        return second;
    }
    exports.getUrlFromUrlLine = getUrlFromUrlLine;
    /* $ref pre:"Zdroj tabulky" url:"https://dluhopisy.cz/clanek-korunove-dluhopisy" title:"Dluhopisy.cz" */
    function toObject(paragraph) {
        let obj = {};
        // Make it first split
        let newline = paragraph.indexOf("\n");
        let firstLine = paragraph;
        if (newline != -1) {
            firstLine = paragraph.substr(0, newline);
        }
        let array = firstLine.match(/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g);
        //let array = firstLine.split(" ");
        for (let i = 0; i < array.length; i++) {
            let sec = array[i];
            if (i == 0) {
                obj["type"] = sec;
            }
            else {
                // now it is something like: pre:"Zdroj tabulky"
                let index = sec.indexOf(':');
                let key = sec.substr(0, index);
                let value = sec.substr(index + 1, sec.length);
                value = str.replaceAll(value, "\"", "");
                obj[key] = value;
            }
        }
        let body = paragraph.substr(newline + 1, paragraph.length);
        if (body) {
            obj["body"] = body;
        }
        return obj;
    }
    exports.toObject = toObject;
});
//# sourceMappingURL=lineparser.js.map