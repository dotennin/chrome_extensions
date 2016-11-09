

function encrypt(value) {
  return value;
  //return CryptoJS.AES.encrypt(value, restorePasswordElem.value).toString();
}

function showStatus(msg) {
  var elem = document.getElementById('status');
  elem.textContent = msg;
}

document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.local.get(null, function (value) {
    if(value['login_email'] && value['login_pass']){
      document.getElementById('accountId').value = value['login_email'];
      document.getElementById('accountPassword').value = value['login_pass'];
    }
  });

});

document.getElementById('form').addEventListener('submit', function(e) {
  e.preventDefault();
  saveOptions();
});
