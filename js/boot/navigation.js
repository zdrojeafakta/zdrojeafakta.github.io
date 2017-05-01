define(["require", "exports", "html/html", "parsers/lineparser"], function (require, exports, html, lineparser) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Navigation {
        static topBar(text) {
            // Testing 
            let regexp = /\[(.*?)\]/g;
            var array = text.match(regexp);
            var count = array.length;
            if (count == 0)
                return null;
            var header = this.createHeader("topbar");
            var divc = document.createElement("div");
            divc.classList.add("container");
            var divnheader = document.createElement("div");
            divnheader.classList.add("navbar-header");
            var button = document.createElement("button");
            button.classList.add("navbar-toggle");
            button.setAttribute("type", "button");
            button.setAttribute("data-toggle", "collapse");
            button.setAttribute("data-target", ".navbar-collapse");
            button.innerHTML = "<span class=\"sr-only\">Toggle navigation</span><span class=\"icon-bar\"></span><span class=\"icon-bar\"></span><span class=\"icon-bar\"></span>";
            // Put nav header together
            header.appendChild(divc);
            divc.appendChild(divnheader);
            divnheader.appendChild(button);
            // ["Name"|url]; 
            let title = lineparser.getTitleFromUrlLine(array[0]);
            let url = lineparser.getUrlFromUrlLine(array[0]);
            divnheader.appendChild(html.Html.ahref(title, url, "navbar-brand"));
            // Create navigation
            array.shift();
            var nav = this.createNavigation(array);
            divc.appendChild(nav);
            return header;
        }
        static createHeader(id) {
            var header = document.createElement("header");
            header.classList.add("navbar");
            header.classList.add("navbar-bright");
            header.classList.add("navbar-fixed-top");
            header.setAttribute("role", "banner");
            header.setAttribute("id", id);
            return header;
        }
        static createNavigation(array) {
            var nav = document.createElement("nav");
            nav.classList.add("collapse");
            nav.classList.add("navbar-collapse");
            nav.setAttribute("role", "navigation");
            var ul = document.createElement("ul");
            ul.classList.add("nav");
            ul.classList.add("navbar-nav");
            for (var item of array) {
                var li = document.createElement("li");
                let title = lineparser.getTitleFromUrlLine(item);
                let url = lineparser.getUrlFromUrlLine(item);
                var a = html.Html.ahref(title, url, "");
                li.appendChild(a);
                ul.appendChild(li);
            }
            nav.appendChild(ul);
            return nav;
        }
        static createSidebarFromSections(array) {
            // Base elements
            let ul = html.Html.createElement("ul", "nav nav-stacked", "sidebar");
            for (let section of array) {
                // subsections
                let li = document.createElement("li");
                let a = html.Html.ahref(section.title, "#" + section.id, "");
                li.appendChild(a);
                ul.appendChild(li);
                if (section.children && section.children.length) {
                    var subul = html.Html.createElement("ul", "nav nav-stacked", "");
                    li.appendChild(subul);
                    // If subsecions // append it
                    for (let i = 0; i < section.children.length; i++) {
                        // Subsections
                        let subsection = section.children[i];
                        let subli = document.createElement("li");
                        let suba = html.Html.ahref(subsection.title, "#" + subsection.id, "");
                        subli.appendChild(suba);
                        subul.appendChild(subli);
                    }
                }
            }
            return ul;
        }
        /* "Section1|#sec1:SubSection|#sec1a;Section2|#sec2" */
        static sideBar(text) {
            if (!text) {
                alert("Not text in sideBar funct");
                return;
            }
            // Base elements
            let ul = html.Html.createElement("ul", "nav nav-stacked", "sidebar");
            let array = text.split(";");
            for (let item of array) {
                // subsections
                var sub = item.split(":"); // 
                // url and name
                var url = "";
                var name = "";
                var li = this.createLiFromArray(sub[0].split("|"));
                ul.appendChild(li);
                if (sub.length > 1) {
                    var subul = html.Html.createElement("ul", "nav nav-stacked", "");
                    li.appendChild(subul);
                    // If subsecions // append it
                    for (let i = 0; i < sub.length; i++) {
                        // Skip first item
                        if (i == 0)
                            continue;
                        // Subsections
                        var subli = this.createLiFromArray(sub[i].split("|"));
                        subul.appendChild(subli);
                    }
                }
            }
            return ul;
        }
        static createLiFromArray(arr) {
            let name = arr[0];
            let url = "#";
            if (arr.length == 2) {
                url = arr[1];
            }
            var li = document.createElement("li");
            var a = html.Html.ahref(name, url, "");
            li.appendChild(a);
            return li;
        }
    }
    exports.Navigation = Navigation;
});
//# sourceMappingURL=navigation.js.map