function Header(calendar, options) {
    var t = this;

    // exports
    t.render = render;
    t.destroy = destroy;
    t.updateTitle = updateTitle;
    t.activateButton = activateButton;
    t.deactivateButton = deactivateButton;
    t.disableButton = disableButton;
    t.enableButton = enableButton;

    // locals
    var element = $([]);
    var tm;

    function render() {
        tm = options.theme ? 'ui' : 'fc';
        var sections = options.header;
        if (sections) {
            element = $("<table class='fc-header' style='width:100%'/>")
                .append(
                    $("<tr/>")
                    .append(renderSection('left'))
                    .append(renderSection('center'))
                    .append(renderSection('right'))
            );
            return element;
        }
    }

    function destroy() {
        element.remove();
    }

    function renderSection(position) {
        var e = $("<td class='fc-header-" + position + "'/>");
        var buttonStr = options.header[position];
        if (buttonStr) {
            $.each(buttonStr.split(' '), function (i, bns) {
                if (i > 0) {
                    e.append("<span class='fc-header-space'/>");
                }
                if (bns.split('.')[0] == 'custom_button') { //add by nick-ma on 2013-12-31
                    var btn = bns.split('.')[1];
                    var btn_option = smartProperty(options.custom_button, btn) || null;
                    if (btn_option) {
                        var icon = btn_option['icon'],
                            text = btn_option['text'],
                            classes = btn_option['classes'];
                        var button = '<button class="' + classes + '">';
                        if (icon) {
                            button += '<i class="' + icon + '" />';
                        }
                        button += text;
                        // button += '';
                        button += '</button>';
                        e.append(button);
                    }
                    return;
                }
                var prevButton;
                $.each(this.split(','), function (j, buttonName) {
                    if (buttonName == 'title') {
                        e.append("<span class='fc-header-title'><h4>&nbsp;</h4></span>");
                        if (prevButton) {
                            prevButton.addClass(tm + '-corner-right');
                        }
                        prevButton = null;
                    } else {
                        var buttonClick;
                        if (calendar[buttonName]) {
                            buttonClick = calendar[buttonName]; // calendar method
                        } else if (fcViews[buttonName]) {
                            buttonClick = function () {
                                button.removeClass(tm + '-state-hover'); // forget why
                                calendar.changeView(buttonName);
                            };
                        }
                        if (buttonClick) {
                            var icon = options.theme ? smartProperty(options.buttonIcons, buttonName) : null; // why are we using smartProperty here?
                            var text = smartProperty(options.buttonText, buttonName); // why are we using smartProperty here?
                            var button = $(
                                "<span class='fc-button fc-button-" + buttonName + " " + tm + "-state-default'>" +
                                (icon ?
                                    "<span class='fc-icon-wrap'>" +
                                    "<span class='ui-icon ui-icon-" + icon + "'/>" +
                                    "</span>" :
                                    text
                                ) +
                                "</span>"
                            )
                                .click(function () {
                                    if (!button.hasClass(tm + '-state-disabled')) {
                                        buttonClick();
                                    }
                                })
                                .mousedown(function () {
                                    button
                                        .not('.' + tm + '-state-active')
                                        .not('.' + tm + '-state-disabled')
                                        .addClass(tm + '-state-down');
                                })
                                .mouseup(function () {
                                    button.removeClass(tm + '-state-down');
                                })
                                .hover(
                                    function () {
                                        button
                                            .not('.' + tm + '-state-active')
                                            .not('.' + tm + '-state-disabled')
                                            .addClass(tm + '-state-hover');
                                    },
                                    function () {
                                        button
                                            .removeClass(tm + '-state-hover')
                                            .removeClass(tm + '-state-down');
                                    }
                            )
                                .appendTo(e);
                            disableTextSelection(button);
                            if (!prevButton) {
                                button.addClass(tm + '-corner-left');
                            }
                            prevButton = button;
                        }
                    }
                });
                if (prevButton) {
                    prevButton.addClass(tm + '-corner-right');
                }
            });
        }
        return e;
    }

    function updateTitle(html) {
        element.find('h4')
            .html(html);
    }

    function activateButton(buttonName) {
        element.find('span.fc-button-' + buttonName)
            .addClass(tm + '-state-active');
    }

    function deactivateButton(buttonName) {
        element.find('span.fc-button-' + buttonName)
            .removeClass(tm + '-state-active');
    }

    function disableButton(buttonName) {
        element.find('span.fc-button-' + buttonName)
            .addClass(tm + '-state-disabled');
    }

    function enableButton(buttonName) {
        element.find('span.fc-button-' + buttonName)
            .removeClass(tm + '-state-disabled');
    }

}
