define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Section {
        constructor(title, id) {
            this.id = id;
            this.title = title;
            this.children = new Array();
        }
        addChild(child) {
            this.children.push(child);
        }
    }
    exports.Section = Section;
});
//# sourceMappingURL=sections.js.map