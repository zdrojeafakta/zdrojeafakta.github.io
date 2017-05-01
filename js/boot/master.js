define(["require", "exports", "html/html"], function (require, exports, html) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Master {
        static titleAndSubtitle(title, subtitle) {
            var element = html.Html.createElement("div", "", "masthead");
            var cont = html.Html.createElement("div", "container", "");
            element.appendChild(cont);
            var row = html.Html.createElement("div", "row", "");
            cont.appendChild(row);
            var col = html.Html.createElement("div", "col-md-7", "");
            row.appendChild(col);
            var h1 = document.createElement("h1");
            col.appendChild(h1);
            h1.innerHTML = title;
            var p = html.Html.createElement("p", "lead", "");
            h1.appendChild(p);
            return element;
        }
    }
    exports.Master = Master;
});
//# sourceMappingURL=master.js.map