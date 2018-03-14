var extension = "";
chrome.management.onInstalled.addListener(function (details) {
    extension = details;
    chrome.storage.sync.get(function (result) {
        //Get the vars
        var Adprovider = result["adprovider"] === undefined ? "" : result["adprovider"];
        var Source = result["source"] === undefined ? "" : result["source"];
        var UID = result["uid"] === undefined ? GenerateNewUserID() : result["uid"];
        var Userclass = result["userclass"] === undefined ? FetchUserClass() : result["userclass"];
        var Version = "converter_" + chrome.app.getDetails().version;

        //Send imp
        SendImpressionPlus("ex_comp_after", Adprovider, Source, UID, Userclass, Version, extension.id, extension.name, extension.version, extension.enabled);
    });
});
