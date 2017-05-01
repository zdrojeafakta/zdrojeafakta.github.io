/// <reference path="../../lib/chart.d.ts" />
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let chartColors = [];
    chartColors.push("#2f538c");
    chartColors.push("#516789");
    chartColors.push("#508966");
    chartColors.push("#897b50");
    chartColors.push("#896350");
    chartColors.push("#695089");
    chartColors.push("#895079");
    chartColors.push("#895053");
    chartColors.push("#508389");
    chartColors.push("#5b8950");
    chartColors.push("#dbd981");
    chartColors.push("#81dbc7");
    chartColors.push("#81afdb");
    chartColors.push("#7a7979");
    chartColors.push("#565656");
    chartColors.push("#efaaff");
    let colorsTheme01 = [];
    colorsTheme01.push("#FF6200");
    colorsTheme01.push("#BF6730");
    colorsTheme01.push("#A63F00");
    colorsTheme01.push("#FF8940");
    colorsTheme01.push("#FFA873");
    colorsTheme01.push("#0F4FA8");
    colorsTheme01.push("#284C7E");
    colorsTheme01.push("#05316D");
    colorsTheme01.push("#4380D3");
    colorsTheme01.push("#6996D3");
    colorsTheme01.push("#3BDA00");
    colorsTheme01.push("#4AA329");
    colorsTheme01.push("#268E00");
    colorsTheme01.push("#6BEC3B");
    colorsTheme01.push("#8EEC6A");
    function getChartColor(i) {
        let theme = colorsTheme01;
        let count = theme.length;
        let currentIndex = (i + count) % count;
        return theme[currentIndex];
    }
    function getRandomColor() {
        let array;
        let letters = '0123456789ABCDEF'.split('');
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    function chartData(array, obj) {
        let data = {};
        let labels = [];
        let datasets = [];
        let txtcolor = obj["colors"];
        let arcolors = [];
        if (txtcolor) {
            arcolors = txtcolor.split(" ");
        }
        else {
            arcolors = chartColors;
        }
        // Creat column set
        let colobjset = obj["col"];
        var colset = new Set;
        if (colobjset) {
            let ar = colobjset.split(" ");
            for (var index = 0; index < ar.length; index++) {
                let num = Number(ar[index]);
                colset.add(num);
            }
        }
        // Creat column set
        let rowobjset = obj["row"];
        var rowset = new Set;
        if (rowobjset) {
            let ar = rowobjset.split(" ");
            for (var index = 0; index < ar.length; index++) {
                let num = Number(ar[index]);
                rowset.add(num);
            }
        }
        for (let row = 0; row < array.length; row++) {
            if (rowobjset && !rowset.has(row))
                continue;
            let rowitem = array[row];
            let dataset = {};
            dataset["label"] = "";
            dataset["data"] = [];
            dataset["strokeColor"];
            let hasHeader = false;
            for (var column = 0; column < rowitem.length; column++) {
                if (colobjset && !colset.has(column))
                    continue;
                var col = rowitem[column];
                if (row == 0) {
                    if (column != 0) {
                        labels.push(col);
                    }
                }
                else {
                    if (!hasHeader) {
                        // First column
                        dataset["label"] = col;
                        dataset["fill"] = false;
                        dataset["CapStyle"] = "butt";
                        // get colors
                        let count = arcolors.length;
                        let currentIndex = (row - 1 + count) % count;
                        let color = arcolors[currentIndex];
                        // dataset.strokeColor = getChartColor(i);
                        dataset["backgroundColor"] = color;
                        dataset["borderColor"] = color;
                        hasHeader = true;
                    }
                    else {
                        // 
                        //if (objset && !set.has(column))
                        //    continue;
                        if (col) {
                            let clean = col.replace(/\s+/, "");
                            var num = Number(clean);
                            if (isNaN(num))
                                num = 0;
                            dataset["data"].push(num);
                        }
                        else {
                            dataset["data"].push(0);
                        }
                    }
                }
            }
            if (row)
                datasets.push(dataset);
        }
        data["labels"] = labels;
        data["datasets"] = datasets;
        return data;
    }
    exports.chartData = chartData;
    function defaultOptions() {
        let options = {
            scales: {
                yAxes: [{
                        ticks: {
                            min: 0 // minimum value
                        }
                    }]
            }
        };
        return options;
    }
    exports.defaultOptions = defaultOptions;
    function hideAllDatasetsExcept(array, set) {
        for (var row = 0; row < array.length; row++) {
            var element = array[row];
            if (!set.has(element["label"]))
                element["hidden"] = true;
        }
    }
    exports.hideAllDatasetsExcept = hideAllDatasetsExcept;
});
//# sourceMappingURL=chart.js.map