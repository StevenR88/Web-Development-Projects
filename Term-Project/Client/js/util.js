let hostname = "https://game.stirlinganderson.dev/"

async function asyncRequestWrapper(method, url, parameters, apikey) {
  return await new Promise((resolve, reject) => {
      const xhttp = new XMLHttpRequest();
      xhttp.open(method, url, true);
      xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      if (apikey != null) {
        xhttp.withCredentials = true;
        xhttp.setRequestHeader("Authorization", apikey);
      }
      xhttp.send(parameters);
      xhttp.onreadystatechange = function () {
          if (this.readyState === 4) {
            let returnData = {
              status: this.status,
              data: JSON.parse(this.responseText)
            }
            resolve(returnData);
          }
      }
  })
}

async function postRequest(function_name, param_vars) {
  let user_api_key = localStorage.getItem("apiKey");
  let jsonObject = await asyncRequestWrapper("POST", hostname + function_name, param_vars, user_api_key);
  return jsonObject;
}

async function putRequest(function_name, param_vars) {
  let user_api_key = localStorage.getItem("apiKey");
  let jsonObject = await asyncRequestWrapper("PUT", hostname + function_name, param_vars, user_api_key);
  return jsonObject;
}

async function getRequestUnAuth(function_name, param_vars) {
  let jsonObject = await asyncRequestWrapper("GET", hostname + function_name, param_vars, null);
  return jsonObject;
}

async function getRequest(function_name, param_vars) {
  let user_api_key = localStorage.getItem("apiKey");
  let jsonObject = await asyncRequestWrapper("GET", hostname + function_name, param_vars, user_api_key);
  return jsonObject;
}

async function deleteRequest(function_name, param_vars) {
  let user_api_key = localStorage.getItem("apiKey");
  let jsonObject = await asyncRequestWrapper("DELETE", hostname + function_name, param_vars, user_api_key);
  return jsonObject;
}