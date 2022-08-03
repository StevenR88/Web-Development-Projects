async function setColor(color) {
    let parameters = "apiKey=" + localStorage.getItem("apiKey") + "&color=" + color;
    let returnJson = await postRequest("pickColor", parameters);
    if (returnJson.status === 200) {
        localStorage.setItem("color", color);
        window.location.href = "https://stevenr.ca/COMP4537/COMP-4537-group-assignment/Client/mainpage.html";
      } else if (returnJson.status === 400) {
        document.getElementById('serverResponse').innerHTML = `Request Failed. error: ${returnJson.data.msg}`;
      } else if (returnJson.status === 404) {
        document.getElementById('serverResponse').innerHTML = `error: server down`;
      } else {
        document.getElementById('serverResponse').innerHTML = `error: ${returnJson.status}`;
      }
}
