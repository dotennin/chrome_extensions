

function encrypt(value) {
  return value;
  //return CryptoJS.AES.encrypt(value, restorePasswordElem.value).toString();
}

document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.local.get(null, function (value) {
    if(value['login_email'] && value['login_pass']){
      document.getElementById('accountId').value = value['login_email'];
      document.getElementById('accountPassword').value = value['login_pass'];
    }
  });

  var modal = document.getElementById('myModal');

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];


  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

});

document.getElementById('form').addEventListener('submit', function(e) {
  e.preventDefault();
  // When the user clicks the button, open the modal
  // Get the modal
  var modal = document.getElementById('myModal');
  // Get the button that opens the modal
  modal.style.display = "block";
  saveOptions();
});
