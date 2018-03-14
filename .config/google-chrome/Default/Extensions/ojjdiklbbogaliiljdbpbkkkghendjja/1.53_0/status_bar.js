var ggStatusBar = {};

ggStatusBar.heightMultiplier = 0;

ggStatusBar.getBar = function(css) {
	var bar = $('<div id="chrome_extension_statusbar"></div>')
	.click(function() {
		clearTimeout($(document).data('timeoutID'));
		bar.delay(500).queue(function() {
			bar.css('display', 'none');
			$(this).dequeue();
		});
	})
	.dblclick(function() {
		clearTimeout($(document).data('timeoutID'));
		$('a').die();
		bar.css('display', 'none');
	});

	for(var key in css) {
		var val = css[key];
		if(val != '') {
			bar.css(key, val);
		}
	}

	ggStatusBar.heightMultiplier = parseInt(bar.css('height'));

	return bar;
}

/*
 Why does the correct width not get returned, either in bar.width() or in some iframes (top banner statcounter)??
*/
ggStatusBar.setHeight = function(bar) {
	var x = 17; // I don't know why this is required, but it seems to be
	//var x = 0;
	var viewportWidth = $(window).width();
	var viewportHeight = $(window).height();
	//var viewportWidth = window.innerWidth;
	//var viewportHeight = window.innerHeight;
	//console.log(viewportWidth);
	//console.log(viewportHeight);
	var rows = 1;
	//console.log(bar.width());
	//console.log(viewportWidth);
	if((bar.width() + x) > viewportWidth) {
		rows = Math.ceil((bar.width() + x) / viewportWidth);
		//console.log(rows);
	}
	//bar.css('height', (rows * 16) + 'px');
	bar.css('height', (rows * ggStatusBar.heightMultiplier) + 'px');
}

ggStatusBar.showTitle = function(bar) {
	bar.html(document.title);
	ggStatusBar.setHeight(bar);
	bar.css('display', 'block');
}

ggStatusBar.addMouseEvents = function(bar, titleDelay) {
	var p = parent;
	//bar = p.bar;
	$('a').live('mouseover mouseout', function(event) {
		//console.log($(document));
		// compare document urls with ... what? how do I know which page is the parent?  window.location?

		if (event.type == 'mouseover') {
			// do something on mouseover
			clearTimeout($(document).data('timeoutID'));
			bar.html($(this).attr('href'));
			ggStatusBar.setHeight(bar);
			bar.css('display', 'block');
		} else {
			// do something on mouseout
			clearTimeout($(document).data('timeoutID'));
			$(document).data('timeoutID', setTimeout(function() {
				ggStatusBar.showTitle(bar);
			}, titleDelay));
		}
	});
}

// Called First
$(document).ready(function() {
	chrome.extension.sendRequest({options: "all"}, function(response) {
		var options = JSON.parse(response.options);
		if(	(parseInt(options['disable-frames']) == 1 && window == window.top)
			|| parseInt(options['disable-frames']) == 0 ) {
			var css = JSON.parse(response.css);
			var bar = ggStatusBar.getBar(css);
			ggStatusBar.addMouseEvents(bar, parseInt(options['title-delay']));
			$('body').append(bar);
			ggStatusBar.showTitle(bar);
		}
	});
});


// Fix iframe support (mouse over link in iframe, bar should only appear in main frame)
// http://my.statcounter.com/project/standard/pageload.php?project_id=2540476 (top ad)

// Need to monitor browser resize event and recalculate
// Is it possible to modify what "bottom" on active page properties refers to?
//   without parsing through every single element on the page, looking for a "bottom" property and adding 20 to it?
//   set window.height = window.height-20 ?
