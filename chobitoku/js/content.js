/**
 * Created by root on 16/09/13.
 */

$(function(){
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        var unselectedDims = $('.unselectedDims');
        if(unselectedDims.length > 0){
            alert("購入するには、"+unselectedDims[0].innerHTML+"を選択してください");
            return;
        }
        var asin = $('#ASIN').val();
        var quantity = $('#quantity').val();

        if(!asin){
            alert("このページでは該当する商品コードは見つかりません。");
            return;
        }
        if(!quantity){
            quantity = 1;
        }

        var postData = {
            "ASIN": asin,
            "quantity": quantity
        };

        sendResponse(postData);
    });

//     var str = (function(){/*
//      <div id="kotak-dialog">
//      <h3 class="title">Dialog<a href="#" class="close">&times;</a></h3>
//      <div class="isi-dialog">
//
//      <div id="iframeContainer">
//      <a id="login">login</a>
//      </div>
//
//      <div class="button-wrapper">
//      <button class="close">Close</button>
//      </div>
//      </div>
//      </div>
//      <div id="dialog-overlay"></div>
//      */}).toString().replace(/(n)/g, '').split('*')[1];
//
//     $('#nav-subnav').after().append(str);
//
// //クリックでイベント発火
//     $('#add-to-cart-button').click(function() {
//
//         //ナビ要素のz-indexを隠す
//         $('#nav-subnav').attr('id', 'nav-subnav-add');
//         //ダイアログを表示させてからid="iframeContainer"を探してDOM要素追加
//         $('#kotak-dialog').show().find('#iframeContainer').html('<iframe src="' + this.href + '"></iframe>');
//         //オーバーレイ
//         $('#dialog-overlay').fadeTo(00, 0.8);
//
//         return false;
//     });
//
//
// //閉じるイベント
//     $('#dialog-overlay').click(function() {
//         //追加したiframeのDOMを削除
//         $('#kotak-dialog').fadeOut('normal', function() {
//             $('iframe', this).remove();
//         });
//         //オーバーレイを削除
//         $('#dialog-overlay').hide();
//         $('#nav-subnav-add').attr('id', 'nav-subnav');
//         return false;
//     });
//
//
//     function modalResize(){
//         // ウィンドウの横幅、高さを取得
//         var w = $(window).width();
//         var h = $(window).height();
//         if(w < 1400){
//
//             // モーダルコンテンツの表示位置を取得
//             /*var x = (w - $('#kotak-dialog').outerWidth(true)) / 8;
//              var y = (h - $('#kotak-dialog').outerHeight(true)) / 9;*/
//
//
//             // モーダルコンテンツの表示位置を設定
//             $('#kotak-dialog').css({'width': 450 + 'px','height': 280 + 'px'});
//             $('#iframeContainer').css({'width': 430 + 'px','height': 260 + 'px'});
//             $('#iframe').css({'width': 430 + 'px','height': 260 + 'px'});
//         }
//     }
//
//
//     $('#login').click(function () {
//         alert(123);
//
//     });
});
