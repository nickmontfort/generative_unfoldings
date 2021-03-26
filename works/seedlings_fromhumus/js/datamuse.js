// Three destinations to get datamuse data:
// 1. pythonAnywhere
// 2. localServer
// 3. localStorage
const destination = "localStorage";

// Where pre-fetched apis are located
const localStorageLocation = "localStorage/";

// Urls for each destinations
const urlOptions = {
  "pythonAnywhere": "https://cqx931.pythonanywhere.com",
  "localServer": "http://127.0.0.1:5000"
}

function datamuse(params, plant, callback) {
  let query = "";
  for (const item in params) {
    query += item + "=" + params[item] + "&"
  }
  $.ajax({
    url: "https://api.datamuse.com/words?" + query,
    type: 'GET',
    tryCount: 0,
    retryLimit: 3,
    success: function(data) {
      callback({
        result: data,
        plant: plant
      });
    },
    error: function(xhr, textStatus, errorThrown) {
      if (textStatus == 'timeout' || xhr.status == 500) {
        this.tryCount++;
        if (this.tryCount <= this.retryLimit) {
          //try again
          $.ajax(this);
          return;
        }
        return;
      } else {
        //handle error
      }
    }
  });
}

function plantServer(params, callback) {
  let query = "";
  for (const item in params) {
    query += destination == "localStorage" ? params[item] + "_" : item + "=" + params[item] + "&"
  }

  const url = destination == "localStorage" ? localStorageLocation + query.slice(0, -1) + '.json' : urlOptions[destination] + "/datamuse?" + query;

  $.ajax({
    url: url,
    type: 'GET',
    tryCount: 0,
    retryLimit: 3,
    success: function(data) {
      callback(data);
    },
    error: function(xhr, textStatus, errorThrown) {
      // no further attempt for local storage
      if (destination == "localStorage") {
        console.log("no file");
        return;
      }
      if (textStatus == 'timeout' || xhr.status == 500) {
        this.tryCount++;
        if (this.tryCount <= this.retryLimit) {
          //try again
          $.ajax(this);
          return;
        }
        return;
      } else {
        //handle error
      }
    }
  });

}
