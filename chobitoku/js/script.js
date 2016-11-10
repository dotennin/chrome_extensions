/**
 * Created by root on 16/11/08.
 */
//const CHOBITOKU_URL = "nochi0105.mydns.jp";
//const CHOBITOKU_URL = "192.168.1.56/chobitoku/ec-cube/html";
const CHOBITOKU_URL = "localhost";
const AMAZON_URL = "www.amazon.co.jp";
const PROTOCOL = "http://";
const MANIFEST_DATA = chrome.app.getDetails();
//cart item quantity
var counter = 0;
/**
* @param url http url
 * @param data data
 * @param async default true
* */
function send(url, data, async) {

    data = undefined ? {} : data;
    async = undefined ? true : async;
    return $.ajax({
        type: "POST",
        dataType: "json",
        url: url,
        data: JSON.stringify(data),
        async: async
        /*success: function(res, dataType)
        {
            if (res['response_code'] === 100) {
                return res['result'];
            }else{
                // サーバが失敗を返した場合
                alert("Transaction error. " + res["error_message"]);
            }
        },

        error: function(XMLHttpRequest, textStatus, errorThrown)
        {
            alert('Error : ' + errorThrown);
        }*/
    });

}


function saveOptions(login_data) {
    if(login_data === undefined){
        login_data = {
            "login_email":encrypt(document.getElementById('accountId').value),
            "login_pass":encrypt(document.getElementById('accountPassword').value)
        };
    }

    var url = PROTOCOL+ CHOBITOKU_URL +"/api/login";

    $.ajax({
        type: "POST",
        dataType: "json",
        url: url,
        data: JSON.stringify(login_data),
        async: false,
        success: function(res, dataType)
        {
            if (res['response_code'] === 100) {
                counter = res['result']['counter'];
                showStatus('ログインに成功しました。');
                chrome.browserAction.setBadgeText({ text: String(counter) });
                chrome.storage.local.set(login_data, function () {
                    sleep(1.5);
                    window.close();
                });
            }else{
                // サーバが失敗を返した場合
                chrome.storage.local.clear();
                showStatus(res["error_message"]);
                //alert("Transaction error. " + res["error_message"]);
            }
        },

        error: function(XMLHttpRequest, textStatus, errorThrown)
        {
            alert('Error : ' + errorThrown);
        }
    });
}

var getLoginInfo = {
    is_logged: function () {

        return chrome.storage.local.get(null, function (value) {
            var result = 222;
            if(value['login_email'] && value['login_pass']){
                result = {
                    'login_email': value['login_email'],
                    'login_pass': value['login_pass']
                };
            }
        });
    }
};

function setIcon(asin, is_active) {
    if(is_active){
        if(product_dict.indexOf(asin) === -1){
            product_dict.push(asin);
        }
        chrome.browserAction.setPopup({popup: MANIFEST_DATA.browser_action.default_popup});
        chrome.browserAction.setIcon({ path:"icon/active.png"});
    }else{
        chrome.browserAction.setPopup({popup: "popup_disable.html"});
        chrome.browserAction.setIcon({ path:"icon/stop.png"});
    }
}

var isset = function(data){
    if(data === "" || data === null || data === undefined){
        return false;
    }else{
        return true;
    }
};

function showStatus(msg) {
    var elem = document.getElementById('status');
    if(!!elem){
        elem.textContent = msg;
    }
}

function login() {
    var ret = confirm("該当する商品を購入するにはログインが必要となります。\nログインに進みますか?");
    if(ret === true){
        window.open('chrome-extension://'+ chrome.runtime.id +'/options.html');
    }
}

function sleep( T ){
    var d1 = new Date().getTime();
    var d2 = new Date().getTime();
    while( d2 < d1+1000*T ){    //T秒待つ
        d2=new Date().getTime();
    }
    return;
}
