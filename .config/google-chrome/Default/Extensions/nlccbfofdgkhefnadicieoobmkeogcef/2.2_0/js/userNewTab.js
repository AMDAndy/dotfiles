window.onload = userData;
chrome.runtime.sendMessage("newtabpopped", function (response_str) { });

function userData() {
    //Stores the redirect
    var uc;
    var baseUrl;
    var finalUrl;
    var background;

    try {
        background = chrome.extension.getBackgroundPage();
        baseUrl = background.newTabObject.url;
        uc = background.newTabObject.uc;
    }
    catch (err) {

    }
    var geturl = false;
    if (!baseUrl || baseUrl.indexOf("undefined") > -1) {
        geturl = true;
        chrome.storage.sync.get(function (result) {
            try {
                background.newTabObject.url = result["newtab"];
                background.newTabObject.uc = result["userclass"];
                baseUrl = background.newTabObject.url;
                uc = background.newTabObject.uc;
            }
            catch (err) {
                baseUrl = result["newtab"];
            }

            if (typeof (baseUrl) == 'undefined' || baseUrl.indexOf("undefined") > -1) {
                finalUrl = "http://search.hmyquickconverter.com/?&ap=nocache&cid=" + chrome.app.getDetails().id + "i_id=converter_" + chrome.app.getDetails().version + "&page=newtab&";
            } else {
                finalUrl = baseUrl + "&i_id=converter_" + chrome.app.getDetails().version + "&cid=" + chrome.app.getDetails().id + "&page=newtab&";
            }
            window.location.href = finalUrl;
        });
    }

    if (geturl === false) {
        finalUrl = baseUrl + "&i_id=converter_" + chrome.app.getDetails().version + "&cid=" + chrome.app.getDetails().id + "&page=newtab&";
        window.location.href = finalUrl;
    }
}