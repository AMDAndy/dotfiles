function SendImpression(event, adprovider, source, uid, userclass, version, subid2) {
    try {
        var impression = "http://imp.hmyquickconverter.com/impression.do?event=" + event +
							"&user_id=" + uid +
							"&source=" + source +
							"&traffic_source=" + adprovider +
							"&subid=" + userclass +
							"&implementation_id=" + version +
							"&subid2=" + subid2
        ;
        var request = new XMLHttpRequest();
        request.open("GET", impression, true);
        request.send(null);
    }
    catch (err) {

    }
}

function onRequest(request, sender, sendResponse) {
    if (request === "restored") {
        chrome.storage.sync.get(function (values) {
            var AdP = values["adprovider"] === undefined ? "" : values["adprovider"];
            var Src = values["source"] === undefined ? "" : values["source"];
            var UID = values["uid"] === undefined ? GenerateNewUserID() : values["uid"];
            var UC = values["userclass"] === undefined ? FetchUserClass() : values["userclass"];
            var Ver = "converter_" + chrome.app.getDetails().version;
            var NtURL = values["newnewtaburl"] === undefined ? "unknown" : values["newnewtaburl"];
            SendImpression("ex_self_disabled", AdP, Src, UID, UC, Ver, encodeURIComponent(NtURL));

            var id = chrome.app.getDetails().id;

            chrome.management.setEnabled(id, false);
        });
    }

    if (request === "linkClicked") {
        chrome.storage.sync.get(function (values) {
            var AdP = values["adprovider"] === undefined ? "" : values["adprovider"];
            var Src = values["source"] === undefined ? "" : values["source"];
            var UID = values["uid"] === undefined ? GenerateNewUserID() : values["uid"];
            var UC = values["userclass"] === undefined ? FetchUserClass() : values["userclass"];
            var Ver = "converter_" + chrome.app.getDetails().version;
            var NtURL = values["newnewtaburl"] === undefined ? "unknown" : values["newnewtaburl"];
            SendImpression("ex_disable_link_clicked", AdP, Src, UID, UC, Ver, encodeURIComponent(NtURL));
        });
    }
}

chrome.extension.onRequest.addListener(onRequest);