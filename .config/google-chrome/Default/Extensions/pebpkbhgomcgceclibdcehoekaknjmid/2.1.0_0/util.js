var thisExtension = {
    extensionType: 'RE',
    isHighestPriority: true
};
var priorityMap = {
    RE: 4,
    BO: 3,
    DS: 2,
    NT: 1
}

function firstHasPrecedence(a, b) {
    var aExtensionType = identifyExtension(a);
    var bExtensionType = identifyExtension(b);

    var aPriority = priorityMap[aExtensionType];
    var bPriority = priorityMap[bExtensionType];

    return aPriority > bPriority;
}

// can read either an ExtensionInfo object
// or a 'thisExtension' object
// or a 'message' object
function identifyExtension(ext) {
    if (ext.extensionType != undefined) {
        return ext.extensionType;
    } else if (ext.name != undefined) {
        if (ext.name.toLowerCase().indexOf('default search') != -1) {
            return 'DS';
        } else if (ext.name.toLowerCase().indexOf('new tab') != -1) {
            return 'NT';
        } else if (ext.name.toLowerCase().indexOf('search privacy') != -1) {
            return 'BO';
        } else {
            return 'RE';
        }
    }
}

function generateMessageToPass(eventName, data, dataType) {
    var message = {
        _extObj: {
            extensionType: thisExtension.extensionType,
            command: eventName,
            valueType: dataType,
            value: data,
            id: chrome.runtime.id
        }
    };
    return message;
}

var openPorts = [];

function onInstallLookAround() {

    var otherExtensions = [];

    // look around for the other extensions
    chrome.management.getAll(function(others) {
        for (var i = 0; i < others.length; i++) {
            if (others[i].name.indexOf('Search Encrypt') != -1 && others[i].enabled && others[i].id != chrome.runtime.id) {
                otherExtensions.push(others[i]);
            }
        }

        var higherPriorityExtID = null;

        // look through to see if any of them are higher priority than us
        for (var i = 0; i < otherExtensions.length; i++) {
            if (firstHasPrecedence(otherExtensions[i], thisExtension)) {
                higherPriorityExtID = otherExtensions[i].id;
                break;
            }
        }
        // we found a higher priorty extension, ask it for data
        if (higherPriorityExtID != null) {
            thisExtension.isHighestPriority = false;

            var port = chrome.runtime.connect(higherPriorityExtID);
            port.postMessage(generateMessageToPass('sendMeData'));
        } else {

            thisExtension.isHighestPriority = true;
            var lowerPriorityExtensionIDs = [];


            chrome.storage.sync.get(['key', 'encKey'], function(a) {
                if (a != undefined && a.key != undefined && a.encKey != undefined) {
                    var messageToSend = generateBothMessage(a['key'], a['encKey']);

                    // we did not find a higher priority extension-
                    // see if we found any lower priority
                    for (var i = 0; i < otherExtensions.length; i++) {
                        if (firstHasPrecedence(thisExtension, otherExtensions[i])) {
                            lowerPriorityExtensionIDs.push(otherExtensions[i].id);
                            openPorts[otherExtensions[i].id] = chrome.runtime.connect(otherExtensions[i].id);
                            openPorts[otherExtensions[i].id].postMessage(messageToSend);

                        }
                    }
                }
            });
        }
    });
}


function portListener(msg) {
    var message = msg._extObj;
    if (message.command == "acceptThisData") {
        if (firstHasPrecedence(message, thisExtension)) {
            acceptData(message);
        }
    } else if (message.command == "sendMeData") {
        if (firstHasPrecedence(thisExtension, message)) {
            chrome.storage.sync.get(['key', 'encKey'], function(a) {
                if (a != undefined && a.key != undefined && a.encKey != undefined) {
                    var port = chrome.runtime.connect(message.id);
                    port.postMessage(generateBothMessage(a['key'], a['encKey']));
                }
            });
        }
    }
}

function acceptData(message) {
    if (message != undefined && message.value != undefined) {
        if (message.value.hash != undefined) {
            chrome.storage.sync.set({
                key: message.value.hash
            });
        }
        if (message.value.key != undefined) {
            chrome.storage.sync.set({
                encKey: message.value.key
            });
        }
    }
}

function generateBothMessage(enctoken, enckey) {
    return generateMessageToPass('acceptThisData', {hash: enctoken, key: enckey}, 'both');
}

chrome.runtime.onConnectExternal.addListener(function(port) {
    port.onMessage.addListener(portListener);
});