define(["require", "exports", "parsers/parser", "html/html", "boot/navigation", "boot/master"], function (require, exports, model, html, bsnav, bsmaster) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Loader {
        init() {
            let pathname = window.location.pathname;
            let name = pathname.replace(".html", ".txt");
            if (name = "/")
                name = "index.txt";
            console.log(name);
            // Process text file
            var stringData = $.ajax({
                url: name,
                async: false
            }).responseText;
            let parser = new model.Parser();
            parser.parseText(stringData);
            let body = document.getElementById('myPage');
            let topbar = parser.topbar;
            if (topbar)
                body.appendChild(bsnav.Navigation.topBar(topbar));
            if (parser.header) {
                let title = parser.header["title"];
                let subtitle = parser.header["subtitle"];
                body.appendChild(bsmaster.Master.titleAndSubtitle(title, subtitle));
            }
            // Append grid 
            //  -------------------
            //  leftcol  | maincol 
            //  -------------------
            let divfluid = html.Html.createElement("div", "container-fluid", "");
            body.appendChild(divfluid);
            let divrow = html.Html.createElement("div", "row", "");
            divfluid.appendChild(divrow);
            let divleftcol = html.Html.createElement("div", "col-md-2", "leftCol");
            let divrightcol = html.Html.createElement("div", "col-md-9", "mainCol");
            divrow.appendChild(divleftcol);
            divrow.appendChild(divrightcol);
            // Append sidebar
            let sideele = bsnav.Navigation.createSidebarFromSections(parser.sections);
            divleftcol.appendChild(sideele);
            //divleftcol.appendChild(nav.sideBar("Section1|#sec1:SubSection|#sec1a;Section2|#sec2"));
            // Now everything is added
            parser.appendToElement(divrightcol);
            parser.processCharts();
            //divrightcol.appendChild(parser.base);
            if (parser.footer) {
                let title = parser.footer["title"];
                let subtitle = parser.footer["subtitle"];
                body.appendChild(bsmaster.Master.titleAndSubtitle(title, subtitle));
            }
            let topOffset = 0;
            if (parser.header) {
                topOffset = 154;
            }
            // JQuery
            var $body = $(document.body);
            var navHeight = $('.navbar').outerHeight(true) + 10;
            $('#sidebar').affix({
                offset: {
                    top: topOffset,
                    bottom: 160
                }
            });
            $body.scrollspy({
                target: '#leftCol',
                offset: navHeight
            });
            $(window).scroll(function () {
                console.log($(this).scrollTop());
                // Vertical scroll bar
                if ($(this).scrollLeft() > 50) {
                    $("#sidebar").fadeOut(200);
                }
                else {
                    $("#sidebar").fadeIn(200);
                }
                // Horizontal scroll bar
                /*
                if ($(this).scrollTop() > 200) {
                  $('#topbar').fadeOut(500);
                } else {
                  $('#topbar').fadeIn(500);
                }*/
            });
            $(document).on('click', 'a', function (event) {
                let hash = $(this).attr('href');
                if (hash.length && hash[0] == "#") {
                    event.preventDefault();
                    $('html, body').animate({
                        scrollTop: $(hash).offset().top
                    }, 500);
                }
            });
            // Will scroll to section ....url/index.html#section
            let hash = window.location.hash;
            if (hash) {
                $('html, body').animate({
                    scrollTop: $(hash).offset().top
                }, 2000);
            }
            /* smooth scrolling sections */
            /*$('a[href*=#]:not([href=#])').click(function() {
                if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
                  var target = $(this.hash);
                  target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
                  if (target.length) {
                    $('html,body').animate({
                      scrollTop: target.offset().top - 50
                    }, 1000);
                    return false;
                  }
                }
            });*/
        }
    }
    exports.Loader = Loader;
});
//# sourceMappingURL=loader.js.map