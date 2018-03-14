var ggStatusBar = {};

ggStatusBar.css = {
	'line-height'		:'14px',
	'bottom'			:'0px',
	'right'				:'0px',
	'top'				:'',
	'left'				:'',
	'text-align'		:'right',
	'z-index'			:'2147483647',
	'position'			:'fixed',
	'display'			:'none',
	'height'			:'16px',
	'margin'			:'0px',
	'padding'			:'1px 10px 1px 4px',
	'font-size'			:'11px',
	'font-family'		:'"Segoe UI", "Lucida Grande", sans-serif',
	'color'				:'#000',
	'background-color'	:'#eee',
	'border-top'		:'1px solid #aaa',
	'border-left'		:'1px solid #aaa',
	'border-right'		:'1px solid #aaa',
	'border-bottom'		:'none',
	'border-radius'		:'3px 0 0 3px',
	'word-wrap'			:'break-word'
};

ggStatusBar.options = {
	'title-delay'		:5000,
	'disable-frames'	:0
};

ggStatusBar.getCss = function() {
	var css = {};
	for(var key in this.css) {
		console.log(key);
		css[key] = localStorage.getItem(key);
		console.log(localStorage.getItem(key));
		if(css[key] == null) {
			css[key] = this.css[key];
		}
	}
	return css;
};

ggStatusBar.getOptions = function() {
	var opt = {};
	for(var key in this.options) {
		opt[key] = localStorage.getItem(key);
		if(opt[key] == null) {
			opt[key] = this.options[key];
		}
	}
	return opt;
}

ggStatusBar.saveOptions = function(pairs) {
	for(var key in pairs) {
		var val = pairs[key];
		localStorage.setItem(key, val);
	}
	return true;
};

ggStatusBar.getDefaults = function() {
	var defaults = {
		'css'		:this.css,
		'options'	:this.options
	};
	return defaults;
}
