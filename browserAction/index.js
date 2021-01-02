/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */

document.addEventListener("click", (e) => {
  // register where user has clicked
  switch (e.target.id) {
    case "login":
      login();
      break;
  }
});


function login() {

  // grab the connection data from input fields
  // username, password, server address
  let conData = {
    "address": document.querySelector("#address").value,
    "username": document.querySelector("#username").value,
    "password": document.querySelector("#password").value
  };

  // should we store user credentials persistently?
  let shouldStoreConData = document.querySelector("#storage").value;
  if (shouldStoreConData) {
    // TODO: find out how to do this securely (local storage is not secure)
    // storeConData(conData);
  }

  // connect to the server
  let reqUrl = buildRequestUrl(conData);
  fetch(reqUrl)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(reportError);

  // return promise, which resolves when test connection to server was successfull
  // return new Promise()
}

function storeConData(conData) {
  // store the connection info (insecure!!)
  //browser.storage.local.set().catch(reportError);

  // test connection
  // createAuth()
}


/**
 * Build the request URL
 * expects object with connection data properties:
 * username, password, serveraddress
 */
function buildRequestUrl(conData) {

  // For each REST call, generate a random string of min length 6 chars called the salt. Send this as parameter s.
  let salt = generateSalt(length = 12);

  // Calculate the authentication token. Send the result as parameter t.
  // The md5() function takes a string and returns the 32-byte ASCII hexadecimal representation of the MD5 hash, using lower
  // case characters for the hex values. Treat the strings as UTF-8 encoded when calculating the hash.
  let token = CryptoJS.MD5(conData.password + salt);

  // build the request string

  // http://[address]/rest/ping.view?u=[username]&t=[token]&s=[salt]&v=[APIversion]&c=[appname]


  // NOTE: for testing we can use
  // demo.funkwhale.audio
  // user: demo
  // pass: demo

  let requestURL = "http://" + conData.address;
  requestURL += "/rest/ping.view?f=json&";
  requestURL += "&u=" + conData.username;
  requestURL += "&t=" + token;
  requestURL += "&s=" + salt;
  // requestURL += "&v=" + ""; // API version
  requestURL += "&c=" + "Sonic%20Player"; // Application name

  return requestURL;
}

/**
 * Generate salt
 * For each REST call, we generate a random string called the salt.
 * We send this as parameter s.
 */
function generateSalt(length) {
  salt = Math.random().toString(36).substring(length);
  return salt;
}


/**
 * Just log the error to the console.
 */
function reportError(error) {
  console.error(`Could not login: ${error}`);
}
