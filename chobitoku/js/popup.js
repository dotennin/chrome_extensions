/*var product_dict = {};

var port = chrome.extension.connect({
  name: "Sample Communication"
});
port.postMessage("getProductDict");
port.onMessage.addListener(function(msg) {
  console.log(msg);
  product_dict = msg;
});*/

document.addEventListener('DOMContentLoaded', function() {

  chrome.storage.local.get(null, function (value) {

    //while user is not login
    if (!value['login_email'] || !value['login_pass']) {
      $('#login').removeClass('hidden');
      $('#add_cart, #add_favorite, #add_cart_url, #add_favorite_url').attr('disabled', 'disabled');
      $('#add_cart_url, #add_favorite_url').removeAttr('href');
    }else{
      chrome.browserAction.getTitle({},function(title){
        if(title !== 'active'){
          $('#add_cart, #add_favorite').attr('disabled', 'disabled');
        }
      });
      $('#logout').removeClass('hidden');
    }
  });

  //define home page url
  //$('#shop_url').attr('href', PROTOCOL+CHOBITOKU_URL).html(MANIFEST_DATA.name);

  //define add_cart url and add_favorite_url
  $('#add_cart_url').attr('href', PROTOCOL+CHOBITOKU_URL+'/cart');
  $('#add_favorite_url').attr('href', PROTOCOL+CHOBITOKU_URL+'/mypage/favorite');

  //define version description
  $('#version').find('small')[0].innerHTML = MANIFEST_DATA.description + ' ' + MANIFEST_DATA.version;

  //logout button
  $('#logout').click(function () {
    chrome.storage.local.clear();
    location.reload();
  });

  //login button
  $('#login').click(function () {
    window.open('chrome-extension://'+ chrome.runtime.id +'/options.html');
  });

  $('#add_cart, #add_favorite').on('click', function () {
    onButtonClick(this);
  });

  //send message to contents
  function onButtonClick(mode) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
            action: "cart"
          },
          function(response) {

            if(response){
              $(mode).attr('disabled','disabled');
              chrome.storage.local.get(null, function (value) {

                if(value['login_email'] && value['login_pass']){

                  var url = PROTOCOL+ CHOBITOKU_URL +"/api/addItem";
                  var postData = {
                    "ASIN": response.ASIN,
                    "quantity": response.quantity,
                    "login_email": value['login_email'],
                    "login_pass":value['login_pass'],
                    "mode": mode.id
                  };

                  $.ajax({
                    type: "POST",
                    dataType: 'json', // json or jsonp
                    url: url,
                    data: JSON.stringify(postData),
                    success: function(json_data, dataType)
                    {console.log(json_data);
                      if(json_data['response_code'] === 100){
                        $(mode).attr('disabled',null);
                        var result = json_data['result'];
                        if(result.hasOwnProperty('counter')){
                          //cart item counter calculate
                          counter = result['counter'];
                          chrome.browserAction.setBadgeText({ text: String(counter) });

                          var ret = confirm("商品を追加されました。\nちょび得レジに進みますか?");
                          if(ret === true){
                            window.open('http://'+ CHOBITOKU_URL +'/cart');
                          }
                        }else{
                          alert("お気に入りに追加しました");
                        }

                      }else{
                        alert(json_data['error_message']);
                        console.log("Transaction error. " + json_data['error_message']);
                      }

                    },

                    error: function(XMLHttpRequest, textStatus, errorThrown)
                    {
                      console.log('Error : ' + errorThrown);
                    }
                  });

                }else{
                  login();
                }
              });
            }
          });
    });
  }

});

