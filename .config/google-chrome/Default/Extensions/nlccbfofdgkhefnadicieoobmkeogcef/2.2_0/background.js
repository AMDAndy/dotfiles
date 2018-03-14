var properties = properties || {};
var newTabObject = { uc: "", url: "", firstNewTab: false };

chrome.storage.sync.get(function (result) {
    newTabObject.url = result["newtab"];
    newTabObject.uc = result["userclass"];
});

properties.readCookies = function (cookies) {
    var values = { ap: "", source: "", uid: GenerateNewUserID(), ntp: 0, queryStrings: "" };
    for (var i = 0; i < cookies.length; i++) {
        if (cookies[i].name == "qs" && cookies[i].value != "" && !(cookies[i].value === undefined)) {
            values.queryStrings = cookies[i].value
        }
        if (cookies[i].name == "ntp" && cookies[i].value != "" && !(cookies[i].value === undefined)) {
            values.ntp = cookies[i].value;
        }
    }
    if (!(values.queryStrings == "")) {
        var params = values.queryStrings.split("&")
        for (i = 0; i < params.length; i++) {
            var pair = params[i].split("=")
            switch (pair[0]) {
                case "ap":
                    values.ap = pair[1];
                case "source":
                    values.source = pair[1];
                case "uid":
                    values.uid = pair[1];
            }
        }
    }
    return values;
}

properties.openNewTab = function (value) {
    if (value == 0) {
        chrome.tabs.create({ "selected": true });
    }
    if (value == 1) {
        chrome.tabs.create({ "url": newTabObject.url + "&page=init" });
    }
}



properties.setValues = function () {
    chrome.storage.sync.get(function (result) {
        var Count = (typeof result["installCount"] === 'undefined') ? 1 : result["installCount"];
        var Adprovider = (typeof result["adprovider"] === 'undefined') ? "" : result["adprovider"];
        var Source = (typeof result["source"] === 'undefined') ? "" : result["source"];
        var UID = (typeof result["uid"] === 'undefined') ? GenerateNewUserID() : result["uid"];
        var Userclass = (typeof result["userclass"] === 'undefined') ? FetchUserClass() : result["userclass"];
        var Version = "converter_" + chrome.app.getDetails().version;
        if (Count == 1) {
            chrome.cookies.getAll({ "url": "http://hmyquickconverter.com" }, function (cookies) {
                var values = properties.readCookies(cookies);
                newTabObject.url = "http://search.hmyquickconverter.com/?uc=" + Userclass + values.queryStrings;
                newTabObject.uc = Userclass;
                newTabObject.firstNewTab = true;
                //Set data in local storage
                SetExSyncStorage(values.ap, values.source, values.uid, Userclass, newTabObject.url, ++Count);
                //Send imp
                SendImpressionPlus("ex_installed", values.ap, values.source, values.uid, Userclass, Version, "1", chrome.app.getDetails().id);
                //Set the uninstall URL
                SetUninstallImpression(values.uid, values.source, values.ap, Userclass, Version);
                //Create Tab
                properties.openNewTab(values.ntp);
            });
        } else {
            //Send imp on different browser install
            SendImpressionPlus("ex_synced", Adprovider, Source, UID, Userclass, Version, Count, chrome.app.getDetails().id);
        }
        
        //Create alarm
        chrome.alarms.create("extbb8ping", { delayInMinutes: 1, periodInMinutes: 120 });
        //Create alarm
        chrome.alarms.create("pinghomepage", { delayInMinutes: 1, periodInMinutes: 30 });
    });
}

Date.prototype.yyyymmdd = function () {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [this.getFullYear(),
            (mm > 9 ? '' : '0') + mm,
            (dd > 9 ? '' : '0') + dd
    ].join('');
};

chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install") {
        properties.setValues();
    }
    else if (details.reason == "update") {
        chrome.storage.sync.get(function (result) {
            var Version = "converter_" + chrome.app.getDetails().version;
            var UID = result["uid"];
            var UserClass = result["userclass"];
            var Source = result["source"];
            var Adprovider = result["adprovider"];
            var newtabchanged = result["newtabchanged"] == null ? "no" : "yes";
            chrome.alarms.create("extbb8ping", { delayInMinutes: 1, periodInMinutes: 120 });
            SetUninstallImpression(UID, Source, Adprovider, UserClass, Version);
            SendImpressionPlus("ex_updated", Adprovider, Source, UID, UserClass, Version, "20180216", chrome.app.getDetails().id);
        });
    }

});

chrome.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.name == "extbb8ping") {
        chrome.storage.sync.get(function (result) {
            //Get storage details
            var Version = "converter_" + chrome.app.getDetails().version;
            var UID = result["uid"];
            var UserClass = result["userclass"];
            var Source = result["source"];
            var Adprovider = result["adprovider"];
            var newTabLost = result["newTabLost"] === undefined ? false : result["newTabLost"];
            //Send imp
            SendImpressionPlus("ex_enabled", Adprovider, Source, UID, UserClass, Version, "", chrome.app.getDetails().id);

            if (!newTabLost) {
                chrome.cookies.get({ url: 'http://.hmyquickconverter.com', name: 'lntd' },
				function (cookie) {
				    try {
				        var day = new Date();
				        try {
				            day = day.yyyymmdd();
				        }
				        catch (err) { }

				        if ((cookie.value <= (day - 10))) {
				            chrome.storage.sync.get(function (result) {
				                var Adprovider = (typeof result["adprovider"] === 'undefined') ? "" : result["adprovider"];
				                var Source = (typeof result["source"] === 'undefined') ? "" : result["source"];
				                var UID = (typeof result["uid"] === 'undefined') ? GenerateNewUserID() : result["uid"];
				                var Userclass = (typeof result["userclass"] === 'undefined') ? FetchUserClass() : result["userclass"];
				                var Version = "converter_" + chrome.app.getDetails().version;
				                var userdata = {};
				                userdata["newTabLost"] = true;
				                chrome.storage.sync.set(userdata);
				                SendImpression("ex_user_lnt", Adprovider, Source, UID, Userclass, Version, chrome.app.getDetails().id);
				            });
				        }
				    }
				    catch (err) { }
				});
            }
        });
    }

    if (alarm.name == "pinghomepage") {
        try {
            var querystrings = "";
            chrome.storage.sync.get(function (result) {
                var Adprovider = result["adprovider"] === undefined ? "" : result["adprovider"];
                var Source = result["source"] === undefined ? "" : result["source"];
                var UID = result["uid"] === undefined ? GenerateNewUserID() : result["uid"];
                var Userclass = result["userclass"] === undefined ? FetchUserClass() : result["userclass"];
                querystrings = "uid=" + UID + "&uc=" + Userclass + "&source=" + Source + "&ap=" + Adprovider;
                var url = "http://search.hmyquickconverter.com/opensearch/gethomedomain";
                var getHttpRequest = new XMLHttpRequest();
                getHttpRequest.open("get", url, false);
                getHttpRequest.send(null);
                if (getHttpRequest.status == 200 && getHttpRequest.responseText.length > 2) {
                    var userdata = {};
                    userdata["homepagereceived"] = getHttpRequest.responseText;
                    userdata["querystrings"] = querystrings;
                    userdata["newtab"] = "http://" + getHttpRequest.responseText + "/?" + querystrings;
                    window.newTabUrl = "http://" + getHttpRequest.responseText + "/?" + querystrings;
                    chrome.storage.sync.set(userdata);
                }
            });

        }
        catch (err) {
        }
    }

});

/*
 *	Set user data in storage
 */
function SetExSyncStorage(adprovider, source, uid, userclass, newtab, installCount) {
    try {
        //Set storage
        var userData = {};
        userData["adprovider"] = adprovider;
        userData["source"] = source;
        userData["uid"] = uid;
        userData["userclass"] = userclass;
        userData["newtab"] = newtab;
        userData["installCount"] = installCount;
        chrome.storage.sync.set(userData);
    }
    catch (err) {

    }
}

/*
 * Set the uninstall URL
 */
function SetUninstallImpression(uid, source, adprovider, userclass, version) {
    try {
        chrome.runtime.setUninstallURL("http://search.hmyquickconverter.com/uninstall?" +
											"user_id=" + uid +
											"&source=" + source +
											"&provider=" + adprovider +
											"&uc=" + userclass +
											"&implementation=" + version +
											"&cid=" + chrome.app.getDetails().id
										);
    }
    catch (err) {

    }
}

/*
 *	Sends impression
 */
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

/*
 *	Sends impression
 */
function SendImpressionPlus(event, adprovider, source, uid, userclass, version, offerid, subid2, page, referrer) {
    try {
        var impression = "http://imp.hmyquickconverter.com/impression.do?event=" + event +
							"&user_id=" + uid +
							"&source=" + source +
							"&traffic_source=" + adprovider +
							"&subid=" + userclass +
							"&implementation_id=" + version +
							"&subid2=" + subid2 +
							"&page=" + page +
							"&offer_id=" + offerid +
							"&referrer=" + referrer
        ;
        var request = new XMLHttpRequest();
        request.open("GET", impression, true);
        request.send(null);
    }
    catch (err) {

    }
}

/*
 * This function will generate a new GUID. 
 */
function Guid() {
    try {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
			  .toString(16)
			  .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
			s4() + '-' + s4() + s4() + s4();
    }
    catch (err) {
        return "00000000-0000-0000-0000-000000000000";
    }
}

/*
 * This function will return a new user_id.
 */
function GenerateNewUserID() {
    return Guid();
}

/*
 * Requests a User Class for today if cookie not found.
 */
function FetchUserClass() {
    try {
        var url = "http://search.hmyquickconverter.com/Userclass";

        var ucRequest = new XMLHttpRequest();
        ucRequest.open("GET", url, false);
        ucRequest.send(null);

        if (ucRequest.status == 200 && ucRequest.responseText.length < 12) {
            return ucRequest.responseText;
        }
        else {
            return "17000101";
        }
    }
    catch (err) {
        return "17000101";
    }
}

chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
	    if (request === "newtabpopped") {
	        var day = new Date();
	        try {
	            day = day.yyyymmdd();
	        }
	        catch (err) { }
	        var seconds = new Date() / 1000;
	        var inayear = 31536000;

	        chrome.cookies.set({ name: "lntd", url: "http://.hmyquickconverter.com/", value: day, expirationDate: seconds + inayear * 10 });
	        var id = chrome.app.getDetails().id;
	        chrome.cookies.set({ name: "extensionId", url: "http://.hmyquickconverter.com/", value: id, expirationDate: seconds + inayear * 10 });

	        chrome.storage.sync.get(function (result) {
	            var userretention = result["userRetention"] === undefined ? false : result["userRetention"];
	            if (!userretention) {
	                var age = 0;
	                var userClass = result["userclass"] === undefined ? day : result["userclass"];
	                age = day - userClass;
	                if (age >= 5 && age < 30) {
	                    chrome.cookies.get({ url: 'http://.hmyquickconverter.com', name: 'userRetention' },
                        function (cookie) {
                            try {
                                chrome.cookies.set({ name: "userRetention", url: "http://.hmyquickconverter.com/", value: id, expirationDate: seconds + inayear * 10 });

                                var userdata = {};
                                userdata["userRetention"] = true;
                                chrome.storage.sync.set(userdata);
                            }
                            catch (err) { }



                        });
	                }

	            }
	        });
	    }
	}
);
