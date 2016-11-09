/**
 * Created by root on 16/11/08.
 */
const CHOBITOKU_URL = "nochi0105.mydns.jp";
const AMAZON_URL = "www.amazon.co.jp";
const MANIFEST_DATA = chrome.app.getDetails();
//cart item quantity
var COUNTER = 0;
/**
* @param url http url
 * @param data data
 * @param async default true
* */
function send(url, data, async) {

    data = undefined ? {} : data;
    async = undefined ? true : async;
    $.ajax({
        type: "POST",
        dataType: "json",
        url: url,
        data: JSON.stringify(data),
        async: async,
        success: function(res, dataType)
        {console.log(res);
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
        }
    });

}


function saveOptions(login_data) {
    if(login_data === undefined){
        login_data = {
            "login_email":encrypt(document.getElementById('accountId').value),
            "login_pass":encrypt(document.getElementById('accountPassword').value)
        };
    }

    var url = "http://"+ CHOBITOKU_URL +"/api/login";

    $.ajax({
        type: "POST",
        dataType: "json",
        url: url,
        data: JSON.stringify(login_data),
        async: false,
        success: function(res, dataType)
        {console.log(res);
            if (res['response_code'] === 100) {
                COUNTER = res['result']['counter'];
                chrome.browserAction.setBadgeText({ text: String(COUNTER) });
                chrome.storage.local.set(login_data, showStatus('保存しました。'));
            }else{
                // サーバが失敗を返した場合
                chrome.storage.local.clear();
                alert("Transaction error. " + res["error_message"]);
            }
        },

        error: function(XMLHttpRequest, textStatus, errorThrown)
        {
            alert('Error : ' + errorThrown);
        }
    });

    /*  $.ajax({
     type: "POST",
     dataType: "json",
     url: url,
     data: JSON.stringify(login_data),
     async: false,
     success: function(json_data, dataType)
     {
     if (json_data['response_code'] === 0) {
     // サーバが失敗を返した場合
     chrome.storage.local.clear();
     alert("Transaction error. " + json_data["error_message"]);

     }else{
     chrome.storage.local.set(login_data, showStatus('保存しました。'));
     }
     },

     error: function(XMLHttpRequest, textStatus, errorThrown)
     {
     alert('Error : ' + errorThrown);
     return;
     }
     });*/
}

function getLoginInfo() {
    var result = chrome.storage.local.get(null, function (value) {
        if(value['login_email'] && value['login_pass']){
            result = {
                'login_email': value['login_email'],
                'login_pass': value['login_pass'],
            };
        }else{
            return null;
        }
    });

    return result;
}

var isset = function(data){
    if(data === "" || data === null || data === undefined){
        return false;
    }else{
        return true;
    }
};
