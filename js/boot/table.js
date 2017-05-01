define(["require", "exports", "html/html"], function (require, exports, html) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function createTableFromText(text, obj) {
        let ar = createArrayFromText(text);
        return createTableFromArray(ar, obj);
    }
    exports.createTableFromText = createTableFromText;
    function createArrayFromText(text) {
        let data = Array();
        // split by "\n";
        let array = text.split("\n");
        for (var index = 0; index < array.length; index++) {
            let ar = Array();
            let line = array[index];
            let tr = html.Html.createElement("tr");
            // Now have to get columns
            let columns = line.split("|");
            for (var columnindex = 0; columnindex < columns.length; columnindex++) {
                var column = columns[columnindex];
                ar.push(column);
            }
            data.push(ar);
        }
        return data;
    }
    exports.createArrayFromText = createArrayFromText;
    function createTableFromArray(array, obj) {
        let classes = "table table-sm table-hover";
        if (obj) {
            let cls = obj["classes"];
            if (cls)
                classes = cls;
        }
        let table = html.Html.createElement("table", classes, "");
        //let table = $('<table class="table table-hover"></table>');
        let thead = html.Html.createElement("thead", "", "");
        let tbody = html.Html.createElement("tbody");
        for (var index = 0; index < array.length; index++) {
            let line = array[index];
            let trcls = "row" + index;
            let trclass = obj[trcls];
            let tr = html.Html.createElement("tr", trclass);
            // Now have to get columns
            //let columns = line.split("|");
            for (var columnindex = 0; columnindex < line.length; columnindex++) {
                let tdclass;
                if (index != 0) {
                    let ctrl = "col" + columnindex;
                    tdclass = obj[ctrl];
                }
                var column = line[columnindex];
                let td = html.Html.createElement("td", tdclass);
                td.innerHTML = column;
                tr.appendChild(td);
            }
            if (index == 0) {
                thead.appendChild(tr);
            }
            else {
                tbody.appendChild(tr);
            }
        }
        table.appendChild(thead);
        table.appendChild(tbody);
        return table;
    }
    exports.createTableFromArray = createTableFromArray;
});
//# sourceMappingURL=table.js.map