/// <reference path="../../lib/papaparse.d.ts" />
define(["require", "exports", "boot/boot", "html/html", "parsers/sections", "parsers/lineparser", "utils/string", "boot/table", "utils/chart"], function (require, exports, boot, html, sec, linepar, str, table, chartjs) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //import chartjs = require('../../lib/Chart.js');
    class Parser {
        // Have to construct section array
        constructor() {
            this.sections = new Array();
            this.elArray = new Array();
            this.charts = new Array();
            this.tables = new Object();
        }
        processCharts() {
            let array = this.charts;
            for (let index = 0; index < array.length; index++) {
                let obj = array[index];
                // Get context and create chart
                let id = obj["id"];
                let canvas = document.getElementById(id);
                if (!canvas)
                    return;
                let srcid = obj["source"];
                if (srcid) {
                    let tabarray = this.tables[srcid];
                    if (tabarray) {
                        if (obj["transpone"]) {
                            tabarray = tabarray[0].map(function (col, i) {
                                return tabarray.map(function (row) {
                                    return row[i];
                                });
                            });
                        }
                        let chartData = chartjs.chartData(tabarray, obj);
                        let options = new Object();
                        options["type"] = obj["type"];
                        options["data"] = chartData;
                        options["options"] = chartjs.defaultOptions();
                        var ch = new Chart(canvas, options);
                    }
                }
                else {
                    let jsonstring = obj["body"];
                    let json = JSON.parse(jsonstring);
                    if (json)
                        var ch = new Chart(canvas, json);
                }
            }
        }
        getControlWord(text) {
            let firstword = str.getFirstWord(text);
            return firstword.substring(1);
        }
        popId() {
            let id = this.lastId;
            this.lastId = "";
            return id;
        }
        parseText(text) {
            // Not perfect split;
            var regex = /\s*\n{2,}/g;
            let paragraphs = text.split(regex); //split('\n\n);
            for (let i = 0; i < paragraphs.length; i++) {
                let paragraph = paragraphs[i];
                // Remove all comments - bad with links
                let commentRegexp = /(\/\*[\wа-я\'\s\r\n\*]*\*\/)/ig;
                paragraph = paragraph.replace(commentRegexp, "");
                paragraph = paragraph.trim();
                if (paragraph == "")
                    continue;
                if (paragraph[0] == "#") {
                    this.processHeader(paragraph);
                }
                else if (paragraph[0] == "$") {
                    this.processControll(paragraph);
                }
                else if (paragraph[0] == "<") {
                    let element = html.Html.createElement("div", "", this.popId());
                    ;
                    element.innerHTML = paragraph;
                    this.elArray.push(element);
                }
                else {
                    // Text
                    let p = html.Html.createElement("p", "", this.popId());
                    p.innerHTML = paragraph;
                    this.elArray.push(p); //this.base.appendChild(p);
                }
            }
            if (this.config == undefined) {
                this.config = new Object();
            }
        }
        processHeader(paragraph) {
            // Get config
            if (this.config["automaticSections"] == false) {
                let hCount = str.countCharacters(paragraph, "#", true);
                let tag = "h" + hCount;
                let text = str.replaceAll(paragraph, "#", "");
                text = text.trim();
                let h = html.Html.createElement(tag, "", this.popId());
                h.innerHTML = text;
                this.elArray.push(h);
            }
            else {
                // Have to create headers and sections;
                let subsection = false;
                let hCount = str.countCharacters(paragraph, "#", true);
                if (hCount === 2)
                    subsection = true;
                // Will create H tag with id 
                let text = str.replaceAll(paragraph, "#", "");
                text = text.trim();
                let id = str.toAscii(text);
                let tag = "h" + hCount;
                // Creating tag
                let h = html.Html.createElement(tag, "", id);
                h.innerHTML = text;
                this.elArray.push(h);
                // Now have to craete section if h1 or h2
                if (hCount === 1 || hCount === 2)
                    this.createSection(text, id, subsection);
            }
        }
        processControll(paragraph) {
            let controlword = this.getControlWord(paragraph);
            switch (controlword) {
                case 'config':
                    this.processConfig(paragraph);
                    break;
                case 'ref':
                    this.processRef(paragraph);
                    break;
                case 'section':
                    this.processSection(paragraph, false);
                    break;
                case 'subsection':
                    this.processSection(paragraph, true);
                    break;
                case 'topbar':
                    this.processTopbar(paragraph);
                    break;
                case 'header':
                    this.processControllHeader(paragraph);
                    break;
                case 'footer':
                    this.processControllFooter(paragraph);
                    break;
                case 'inline':
                    this.processInline(paragraph);
                    break;
                case 'cite':
                    this.processCite(paragraph);
                    break;
                case 'table':
                    this.processTable(paragraph);
                    break;
                case 'csv':
                    this.processCSV(paragraph);
                    break;
                case 'div':
                    this.processDiv(paragraph);
                    break;
                case 'chart':
                    this.processChart(paragraph);
                    break;
            }
            return document.createElement("div");
        }
        /** Convert ref to nice span
         * @input
         * @output <span class="sourceleft">Zdroj počtu zaměstnanců:</span><span class="source"><a href="http://www.kurzy.cz/cnb/ekonomika/osob-ctvrtletni-data/cr-celkem/#historicke-hodnoty">www.kurzy.cz</a></span>
         * @param paragraph Text to process / can be multilne
         */
        processRef(paragraph) {
            let obj = linepar.toObject(paragraph);
            let date = obj["date"];
            if (date) {
                let spanleft = html.Html.createElement("span", "source left yellow", this.popId());
                spanleft.innerHTML = date;
                this.elArray.push(spanleft);
                let spanmiddle = html.Html.createElement("span", "source gray");
                spanmiddle.innerHTML = obj["pre"];
                this.elArray.push(spanmiddle);
            }
            else {
                let spanleft = html.Html.createElement("span", "source left gray", this.popId());
                spanleft.innerHTML = obj["pre"];
                this.elArray.push(spanleft);
            }
            let spanright = html.Html.createElement("span", "source blue right");
            let a = html.Html.ahref(obj["title"], obj["url"], "");
            a.setAttribute("target", "_blank");
            spanright.appendChild(a);
            this.elArray.push(spanright);
        }
        processSection(paragraph, subsection) {
            if (this.config["automaticSections"] == "false") {
                let obj = linepar.toObject(paragraph);
                let title = obj["title"];
                let id = obj["id"];
                if (!id) {
                    id = this.getSectionId(subsection);
                }
                this.createSection(title, id, subsection);
            }
            // Do nothing
        }
        createSection(title, id, subsection) {
            let section = new sec.Section(title, id);
            if (section) {
                if (!subsection) {
                    this.sections.push(section);
                }
                else {
                    let lastindex = this.sections.length - 1;
                    this.sections[lastindex].addChild(section);
                }
            }
        }
        // Get latest ID for headers or sections
        getSectionId(subsection) {
            let lastCount = this.sections.length;
            if (lastCount == undefined)
                lastCount = 0;
            let id = "sec" + lastCount;
            // Now have last count of sections ( if not )
            if (subsection) {
                id += "_";
                // Get subsection count;
                let lastsubcount = 0;
                let lastsection = this.sections[this.sections.length - 1];
                if (lastsection) {
                    if (lastsection.children)
                        lastsubcount = lastsection.children.length;
                }
                // append subsection count
                id += lastsubcount;
            }
        }
        processConfig(paragraph) {
            // Have to remove $config from text
            let text = paragraph.substring(8, paragraph.length);
            let obj = JSON.parse(text);
            this.config = obj;
        }
        // Define topbar
        processTopbar(paragraph) {
            let index = paragraph.indexOf(" ");
            this.topbar = paragraph.substring(index + 1, paragraph.length);
        }
        /* $inline "pages/dluhopisy.html" toggle:true init:"hidden" */
        processInline(paragraph) {
            let obj = linepar.toObject(paragraph);
            let url = String(obj["url"]);
            // get type ( html or txt );
            let lastIndex = url.lastIndexOf(".");
            let ext = url.substring(lastIndex + 1, url.length);
            var stringData = $.ajax({
                url: url,
                async: false
            }).responseText;
            if (ext == "txt") {
                this.parseText(stringData);
            }
            else {
                let div = html.Html.createElement("div", "", "");
                div.innerHTML = stringData;
                this.elArray.push(div);
            }
        }
        processControllHeader(paragraph) {
            let obj = linepar.toObject(paragraph);
            this.header = obj;
        }
        processControllFooter(paragraph) {
            let obj = linepar.toObject(paragraph);
            this.footer = obj;
        }
        processCite(paragraph) {
            let obj = linepar.toObject(paragraph);
            console.log(obj["body"]);
        }
        processTable(paragraph) {
            let obj = linepar.toObject(paragraph);
            let classes = obj["classes"];
            let title = obj["title"];
            if (title) {
                let span = html.Html.createElement("span", "table-title");
                span.innerHTML = title;
                this.elArray.push(span);
            }
            let array = table.createArrayFromText(obj["body"]);
            let id = obj["id"];
            if (id)
                this.tables[id] = array;
            let tabl = boot.createTableFromArray(array, obj);
            this.elArray.push(tabl);
        }
        processCSV(paragraph) {
            let obj = linepar.toObject(paragraph);
            let title = obj["title"];
            if (title) {
                let span = html.Html.createElement("span", "table-title");
                span.innerHTML = title;
                this.elArray.push(span);
            }
            let url = obj["url"];
            let stringData;
            if (url) {
                stringData = $.ajax({
                    url: url,
                    async: false
                }).responseText;
            }
            let data = Papa.parse(stringData);
            let table = boot.createTableFromArray(data.data, obj);
            this.elArray.push(table);
            // Create table with id
            let id = obj["id"];
            if (id)
                this.tables[id] = data.data;
        }
        processDiv(paragraph) {
            let obj = linepar.toObject(paragraph);
            let span = html.Html.createElement("div", obj["classes"]);
            span.innerHTML = obj["body"];
            this.elArray.push(span);
        }
        processChart(paragraph) {
            let obj = linepar.toObject(paragraph);
            if (obj) {
                let canvasele = html.Html.createElement("canvas", obj["classes"], obj["id"]);
                this.elArray.push(canvasele);
                this.charts.push(obj);
            }
        }
        // Final part -> append all elments from array to one elemen -> usually body
        appendToElement(ele) {
            for (let el of this.elArray) {
                ele.appendChild(el);
            }
        }
    }
    exports.Parser = Parser;
});
//# sourceMappingURL=parser.js.map