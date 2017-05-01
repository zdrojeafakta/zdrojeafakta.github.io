define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Html {
        static ahref(text, url, classname) {
            var a = document.createElement('a');
            var linkText = document.createTextNode(text);
            a.appendChild(linkText);
            a.href = url;
            if (!url)
                a.href = "";
            if (classname)
                a.classList.add(classname);
            return a;
        }
        static createElement(type, classes, id) {
            var element = document.createElement(type);
            if (classes) {
                var array = classes.split(" ");
                for (var classname of array) {
                    if (classname)
                        element.classList.add(classname);
                }
            }
            if (id)
                element.setAttribute("id", id);
            return element;
        }
    }
    exports.Html = Html;
});
//# sourceMappingURL=html.js.map