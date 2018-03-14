// we want to be more transparent to users so they know
// prior to searching when their search will be redirected

//(function() {
    // Get message on adding tooltips
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.tooltipSelector != null) {
            showTooltip(request.tooltipSelector, request.additionalCss, 0);
        }
    });

    // add an icon to the search bar
    function showTooltip(tooltipSelector, additionalCss, retries) {
        try {
            //chrome.storage.sync.get('tooltipDismissed', function(result) {
                var selector = document.querySelector(tooltipSelector);
                if (selector == null) {
                    if (retries < 5)
                        setTimeout(function() { showTooltip(tooltipSelector, additionalCss, retries+1) }, 50);
                        
                    return;
                }
                // selector.style.backgroundPosition = 'center left';
                // selector.style.backgroundImage = 'url("https://www.searchencrypt.com/content/img/branding/searchencrypt/favicon.ico")';
                // selector.style.backgroundRepeat = 'no-repeat';
                // selector.style.backgroundPosition = '3px';
                // selector.style.backgroundSize = '18px';
                // selector.style.opacity = '1';

                // selector.style.paddingLeft = '28px';
                // selector.style.setProperty("padding-left", "28px", "important");
                // selector.setAttribute('autofocus', true);
                // selector.setAttribute('onfocus', 'this.value=this.value;');

                var hideTooltip = false;
                // var hideTooltip = result.tooltipDismissed != undefined && result.tooltipDismissed === true;
                
                //var mouseOver = addMouseOver(selector);
                var toolTip = tooltip(selector, !hideTooltip);

                // mouseOver.onclick = function() {
                //     toolTip.style.display = 'block';
                // }

                // toolTip.onclick = function() {
                //     toolTip.style.display = 'none';
                // }

                //document.body.appendChild(mouseOver);
                document.body.appendChild(toolTip);
                
                var setPosition = setInterval(function() {
                    try
                    {
                        selector = document.querySelector(tooltipSelector);
                        var parentOffset = getOffset(selector);
                        toolTip.style.top = (parentOffset.top + 40) + 'px';
                        toolTip.style.left = (parentOffset.left - 14) + 'px';
                        toolTip.style.position = parentOffset.position;
                        
                        // mouseOver.style.top = parentOffset.top + 'px';
                        // mouseOver.style.left = parentOffset.left + 'px';
                    }
                    catch (e) {}
                }, 500);

               if(additionalCss != null) {
                    var style = "<style>" + additionalCss + "</style>";
                    document.head.innerHTML += style;
               } 

            //});
        }
        catch (e) {}
    }

    // this is the mouseover element we use as a
    // transparent place for the user to onhover the icon
    // function addMouseOver(selector) {
    //     try {
    //         var parentOffset = getOffset(selector);

    //         //add the mouseover element
    //         var mouseOverElement = document.createElement('div');
    //         mouseOverElement.style.height = (selector.offsetHeight + 5) + 'px';
    //         mouseOverElement.style.width = '25px';
    //         mouseOverElement.style.position = 'fixed';
    //         mouseOverElement.style.top = parentOffset.top + 'px';
    //         mouseOverElement.style.left = parentOffset.left + 'px';
    //         mouseOverElement.style.cursor = 'pointer';
    //         mouseOverElement.style.zIndex = '1000000';

    //         return mouseOverElement;
    //     }
    //     catch (e) {}
    // }

    // this is the tooltip we display to users
    function tooltip(selector, display) {
        try {
            var parentOffset = getOffset(selector);

            var toolTip = document.createElement('div');
            toolTip.className = 'rd-ext-bubble';
            toolTip.style.top = (parentOffset.top + 40) + 'px';
            toolTip.style.left = (parentOffset.left - 14) + 'px';
            toolTip.innerText = "Your privacy will be protected by redirecting your search to Search Encrypt.";

            var learnMore = document.createElement('a');
            learnMore.href = 'https://www.searchencrypt.com/about';
            learnMore.innerText = 'Learn More';
            learnMore.target = '_blank';
            learnMore.className = 'rd-learnmore';
            learnMore.style['padding-left'] = '25px';
            learnMore.style.display = 'inline-block';
            learnMore.style.color = '#666';


            // var okGotIt = document.createElement('span');
            // okGotIt.onclick = dismissTooltip;
            // okGotIt.innerText = 'OK, got it';
            // okGotIt.style['margin-left'] = '25px';
            // okGotIt.style.display = 'inline-block';
            // okGotIt.style['font-weight'] = '700';


            var closeX = document.createElement('div');
            closeX.innerText = 'X';
            closeX.style['padding-left'] = '25px';
            closeX.style['float'] = 'right';
            closeX.style.display = 'inline-block';
            closeX.onclick = function() {
                toolTip.style.display = 'none';
            }

            if (!display) {
                toolTip.style.display = 'none';
            }

            toolTip.appendChild(learnMore);
            // toolTip.appendChild(okGotIt);
            toolTip.appendChild(closeX);


            return toolTip;
        }
        catch (e) {}
    }

    // function dismissTooltip() {
    //     try {
    //         chrome.storage.sync.set({
    //             tooltipDismissed: true
    //         });
    //     }
    //     catch (e) {}
    // }

    // simple function for calculating offset on page
    function getOffset(el) {
        try {
            var _pos = 'absolute';
            var _x = 0;
            var _y = 0;
            while (el) {
                if (!isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
                    _x += el.offsetLeft - el.scrollLeft;
                    _y += el.offsetTop - el.scrollTop;
                }
                if (getComputedStyle(el).position == 'fixed') {
                    _pos = 'fixed';
                }
                el = el.offsetParent;
            }
            return { top: _y, left: _x, position: _pos };
        }
        catch (e) {}
    }