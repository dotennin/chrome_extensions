/**
 * Created by root on 16/09/14.
 */
var product_dict = [];

/*
* check this page's asin can be pass
* while the page url equal amazon.co.jp
* */
function validateAsin() {
    chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
    }, function(tab) {
        var current_tab = tab[0];
        if(!!current_tab.url){
            var url = new URL(current_tab.url);
            var domain = url.hostname;
            if(domain === AMAZON_URL){
                chrome.tabs.sendRequest(current_tab.id, {action: "getAsin"}, function(asin) {
                    if(product_dict.indexOf(asin) >= 0){
                        setIcon(asin, true);
                    }else{
                        setIcon(null, false);
                    }
                });
            }else{
                setIcon(null, false);
            }
        }
    });
}

//is_user logged get pageAsin to server
function getCurrentPageAsin(tabId) {

    chrome.tabs.sendRequest(tabId, {action: "getAsin"}, function(asin) {
        if(asin){
            chrome.storage.local.get(null, function (value) {
                if(value['login_email'] && value['login_pass']){
                    var data = {
                        'ASIN': asin
                    };
                    var url = PROTOCOL + CHOBITOKU_URL +'/api/validateItem';
                    send(url, data).success(function (res, dataType) {
                        console.log(res);
                        if (res['response_code'] === 100) {
                            //save prodcut id
                            setIcon(asin, true);
                        }else{
                            setIcon(null, false);
                        }
                    });
                }else{
                    //login();
                }
            });
        }
    });
}

chrome.tabs.getAllInWindow( null, function( tabs ){

    chrome.storage.local.get(null, function (value) {

        if(value['login_email'] && value['login_pass']) {
            var login_data = {
                'login_email': value['login_email'],
                'login_pass': value['login_pass']
            };
            saveOptions(login_data);
        }
    });
});
// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        window.open('chrome-extension://'+ chrome.runtime.id +'/options.html');
    }else if(details.reason == "update"){
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
});
chrome.tabs.onCreated.addListener( function( tab ){
    //COUNTER++;
    //chrome.browserAction.setBadgeText({ text: String(COUNTER) });

});
chrome.tabs.onRemoved.addListener( function( tab ){
    //COUNTER--;
    //chrome.browserAction.setBadgeText({ text: String(COUNTER) });
});
chrome.tabs.onUpdated.addListener(function(tabId , info) {

    switch (info.status){
        case "complete":
            getCurrentPageAsin(tabId);
            break;
        case "loading":
            validateAsin();
    }

});
chrome.tabs.onHighlighted.addListener(function() {
    validateAsin();
});
chrome.windows.onFocusChanged.addListener(function() {
    //validateAsin();
});
chrome.windows.getCurrent(function() {
    validateAsin()
});

//get listenner from popup
chrome.extension.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
        console.log(msg);
        if(msg === "getProductDict"){
            port.postMessage(product_dict);
        }

    });
});

/*chrome.webRequest.onBeforeRequest.addListener(
    function delay_onBeforeSendHeaders(details) {
        var type = details.type,
            url = details.url,
            now = new Date,
            n = 0;
        console.log("detect:", type, url, now.toISOString());
        while ((n = Date.now() - now) < 1000) {
            n++;
        }
        console.log("send:", type, url, (new Date).toISOString());
        return {};
    },
    { urls: [ "*://!*!/!*" ] },
    [ "blocking" ]
);*/

/*chrome.webRequest.onCompleted.addListener(
    function delay_onCompleted (details) {
        if(!!details){

            var type = details.type,
                url = details.url,
                now = details.timeStamp;
            console.log("type:"+type+",url:"+url);

            /!*if(type === "xmlhttprequest"){
                getCurrentPageAsin(details.tabId);
            }*!/
        }
    },
    { urls: [ "*://www.amazon.co.jp/!*" ] },
    [ "responseHeaders" ]
);*/
