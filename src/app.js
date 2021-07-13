var
  requestFullScreen = (element) => {
      var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
      if (requestMethod) {
          requestMethod.call(element);
      } else if (typeof window.ActiveXObject !== "undefined") {
          var wscript = new ActiveXObject("WScript.Shell");
          if (wscript !== null) {
              wscript.SendKeys("{F11}");
          }
      }
  },

  initBarcode = async(authToken) => {
    var
      card = document.getElementsByClassName('js-card')[0],
      balance = document.getElementsByClassName('js-balance')[0],
      params = {},
      cardNumber,
      response;
    params.headers = {'Authorization': authToken};
    response = await fetch('https://api.elisey-mag.ru/v2/client/accounts', params);
    const accountResponse = await response.json();
    response = await fetch('https://api.elisey-mag.ru/v2/client/card/card-info', params);
    const cardResponse = await response.json();
    if (!accountResponse.success || !cardResponse.success) { alert('Неизвестная ошибка загрузки приложения'); return; }
    cardResponse.data.cards.forEach(card => { if (card.status == 3) { cardNumber = card.number; }; });
    if (cardNumber) {
      balance.innerText = accountResponse.data.accounts[0].avialable;
      card.innerText = cardNumber;
      JsBarcode('.js-barcode', cardNumber, {displayValue: false, height: 180, width: 2.4, margin: 0});
      //updateBarcode(parseInt(accountResponse.data.accounts[0].avialable));
    } else alert('Платёжных карт не найдено!');
  },

  /*updateBarcode = async(balance) => {
    cardData.balance = balance;
    response = await fetch('/api/key/Ai2llCQNQXF22wKluUkIVVtskWAoV2Wj/action/update/', {method: 'GET', body: JSON.stringify(cardData)});
    const cardResponse = await response.json();
  },*/
  bindEvents = () => {
    var
      wrapper = document.getElementsByClassName('js-fullscreen')[0],
      balance = document.getElementsByClassName('js-balance')[0];

    wrapper.addEventListener('click', () => { requestFullScreen(document.body) });
    balance.addEventListener('click', () => { balance.classList.toggle('hidden') });

  },
  initApp = async() => {
    bindEvents();
    JsBarcode('.js-barcode', cardData, {displayValue: false, height: 180, width: 2.4, margin: 0});
    document.getElementsByClassName('js-card')[0].innerText = cardData;
    //initBarcode(query);
  },
  makeid = (length) => {
     var result           = '';
     var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
     var charactersLength = characters.length;
     for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
     }
     return result;
  },
  id = makeid(32);

function CryptoJSAesDecrypt(passphrase, encrypted_json_string){
  var
    obj_json = JSON.parse(encrypted_json_string),
    encrypted = obj_json.ciphertext,
    salt = CryptoJS.enc.Hex.parse(obj_json.salt),
    iv = CryptoJS.enc.Hex.parse(obj_json.iv),   
    key = CryptoJS.PBKDF2(passphrase, salt, { hasher: CryptoJS.algo.SHA512, keySize: 64/8, iterations: 999}),
    decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv: iv});
  return decrypted.toString(CryptoJS.enc.Utf8);
}
//query = (CryptoJSAesDecrypt('Ab44DMCxU6PMDmQGH0hOCgYRBaidgniQ', cardData));
if (cardData) {
  document.addEventListener('DOMContentLoaded', initApp);
}
