/**
 * Created by root on 16/09/14.
 */



function getSettings() {
    chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
    }, function(tab) {
        var url = new URL(tab[0].url);
        var domain = url.hostname;
        if(domain === AMAZON_URL){
            chrome.browserAction.setIcon({ path:"icon/cart.png"});
        }else{
            chrome.browserAction.setIcon({ path:"icon/cart.png"});
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
chrome.tabs.onCreated.addListener( function( tab ){
    //COUNTER++;
    //chrome.browserAction.setBadgeText({ text: String(COUNTER) });
});
chrome.tabs.onRemoved.addListener( function( tab ){
    //COUNTER--;
    //chrome.browserAction.setBadgeText({ text: String(COUNTER) });
});
chrome.tabs.onUpdated.addListener(function(tabId , info) {
    //getSettings();
});
chrome.tabs.onHighlighted.addListener(function() {
    //getSettings()
});
chrome.windows.onFocusChanged.addListener(function() {
    //getSettings()
});
chrome.windows.getCurrent(function() {
    //getSettings()
});



