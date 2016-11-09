
document.addEventListener('DOMContentLoaded', function() {
  //define home page url
  $('#shop_url').attr('href', "http://"+CHOBITOKU_URL).html(MANIFEST_DATA.name);
  //define version description
  $('#version').find('small')[0].innerHTML = MANIFEST_DATA.description + ' ' + MANIFEST_DATA.version;

  $('#add_cart, #add_favorite').on('click', function () {
    var mode = this.id;
    onButtonClick(mode);
  });


  function onButtonClick(mode) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
            color: '#' + ""
          },
          function(response) {

            if(response){

              chrome.storage.local.get(null, function (value) {

                if(value['login_email'] && value['login_pass']){

                  var url = "http://"+ CHOBITOKU_URL +"/api/addItem";
                  var postData = {
                    "ASIN": response.ASIN,
                    "quantity": response.quantity,
                    "login_email": value['login_email'],
                    "login_pass":value['login_pass'],
                    "mode": mode
                  };

                  $.ajax({
                    type: "POST",
                    dataType: 'json', // json or jsonp
                    url: url,
                    data: JSON.stringify(postData),
                    success: function(json_data, dataType)
                    {console.log(json_data);
                      if(json_data['response_code'] === 100){

                        var result = json_data['result'];
                        if(result.hasOwnProperty('counter')){
                          //cart item counter calculate
                          COUNTER = result['counter'];
                          chrome.browserAction.setBadgeText({ text: String(COUNTER) });

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
                  alert("商品を購入するにはログインが必要となります。");
                  window.open('chrome-extension://'+ chrome.runtime.id +'/options.html');
                }
              });
            }
          });
    });
  }
});

