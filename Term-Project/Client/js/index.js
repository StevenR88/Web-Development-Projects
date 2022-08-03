document.addEventListener('DOMContentLoaded', function (event) {
    document.getElementById('play').addEventListener('click', async function (e) {
      let returnJson = await asyncRequestWrapper("POST", hostname + "generateApiKeyAnon", null, null);
      if (returnJson.status === 200) {
        localStorage.setItem("apiKey", returnJson.data.apiKey);
        window.location.href = "https://stevenr.ca/COMP4537/COMP-4537-group-assignment/Client/colorpicker.html";
      } else if (returnJson.status === 400 || returnJson.status === 404) {
        document.getElementById('serverResponse').innerHTML = `Request Failed. error: ${returnJson.data.msg}`;
      } else {
        document.getElementById('serverResponse').innerHTML = `error: ${returnJson.status}`;
      }
    });
})