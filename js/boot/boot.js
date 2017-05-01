define(["require", "exports", "boot/table"], function (require, exports, table) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function createTableFromText(text, obj) {
        return table.createTableFromText(text, obj);
    }
    exports.createTableFromText = createTableFromText;
    function createTableFromArray(array, obj) {
        return table.createTableFromArray(array, obj);
    }
    exports.createTableFromArray = createTableFromArray;
});
//# sourceMappingURL=boot.js.map