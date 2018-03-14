$(document).ready(function() {
    $(":checkbox").labelauty();
});
document.addEventListener('DOMContentLoaded', function() {

    chrome.runtime.sendMessage({ getsettings: "" }, function(response) {

        var spl = JSON.parse(response.farewell);
        for (r in spl) {
            var key = r;
            var val = spl[r];
            document.getElementById(key).checked = val;

        }
    })

    var btn = document.getElementById('savesettings');
    btn.addEventListener('click', function() {

        chrome.runtime.sendMessage({ savesettings: serializeForm() }, function(response) {
            document.getElementById("savedMsg").style.display = "block";
            document.getElementById("savedMsg").style.opacity = "1";

            
            setTimeout(function() { if (!fadingOut) fadeOut('savedMsg') }, 1500);    
        })
    });
    
    document.getElementById('EnableGoogle').addEventListener('click', function() { $('#savesettings').click() });
    document.getElementById('EnableBing').addEventListener('click', function() { $('#savesettings').click() });
    document.getElementById('EnableAdditional').addEventListener('click', function() { $('#savesettings').click() });

});

$('#enableDisable').click(function(e) {
    e.preventDefault();

    var SettingsToCheck = ['EnableGoogle', 'EnableBing', 'EnableAdditional'];
    for (var i = 0; i < SettingsToCheck.length; i++) {
        document.getElementById(SettingsToCheck[i]).checked = !DisabledDisplayed;
    }

    $('#savesettings').click();

    chrome.runtime.sendMessage({ disableAll: !DisabledDisplayed }, function(response) {})
});

$('#restoreAll').click(function(e) {
    e.preventDefault();

    var SettingsToCheck = ['EnableGoogle', 'EnableBing', 'EnableAdditional'];
    for (var i = 0; i < SettingsToCheck.length; i++) {
        document.getElementById(SettingsToCheck[i]).checked = true;
    }
    $('#savesettings').click();
    chrome.runtime.sendMessage({ disableAll: true }, function(response) {})
    chrome.storage.sync.set({
        tooltipDismissed: false
    });

    $.get("https://www.searchencrypt.com/update/reset", function( data ) {});
});

function serializeForm(form) {

    form = document.getElementById(form) || document.forms[0];
    var elems = form.elements;

    var serialized = {},
        i, len = elems.length,
        str = '';

    for (i = 0; i < len; i += 1) {

        var element = elems[i];
        var type = element.type;
        var name = element.name;
        var value = element.checked;

        switch (type) {
            case 'checkbox':
                //str = name + '=' + value;
                serialized[name] = value;
                break;
            default:
                break;
        }
    }
    return serialized;
}

var DisabledDisplayed = true;

function disableEnableWatcher() {
    var SettingsToCheck = ['EnableGoogle', 'EnableBing', 'EnableAdditional'];
    var AllEnabled = true;
    for (var i = 0; i < SettingsToCheck.length; i++) {
        if (!document.getElementById(SettingsToCheck[i]).checked) {
            AllEnabled = false;
            break;
        }
    }

    if (AllEnabled) {
        document.getElementById('enableDisable').innerHTML = 'Stop Redirecting Searches';
        DisabledDisplayed = true;
        $('#enableDisable').attr('class', "enableDisable disabled")
    } else {
        document.getElementById('enableDisable').innerHTML = 'Start Search Redirection';
        DisabledDisplayed = false;
        $('#enableDisable').attr('class', "enableDisable enabled")
    }
}

setInterval(disableEnableWatcher, 100);


if (window.location.href.indexOf('?p=1') > 0) {
    document.getElementById('topLogo').src = 'https://www.searchencrypt.com/static/images/small-logo-2';
}

var fadingOut = false;

function fadeOut(id, val) {
    try {
        if (isNaN(val)) { 
            val = 9; 
            fadingOut = true;
        }
        document.getElementById(id).style.opacity = '0.' + val;
        //For IE
        document.getElementById(id).style.filter = 'alpha(opacity=' + val + '0)';
        if (val > 0) {
            val -= 2;
            setTimeout(function() { fadeOut(id, val) }, 90);
        } else {
            document.getElementById(id).style.opacity = '0';
            fadingOut = false;
            return;
        }
    }
    catch (e) {}
}