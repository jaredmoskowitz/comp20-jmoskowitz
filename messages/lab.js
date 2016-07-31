var request = new XMLHttpRequest();

function parse() {
  request.open("GET", "data.json", true);

  request.onreadystatechange = function() {
    console.log("readyState: " + request.readyState);
    if (request.readyState == 4 && request.status == 200) {
      console.log("Got the data back");
      jsondata = request.responseText;
      console.log(jsondata);
      messages = JSON.parse(jsondata);
      var messagesDiv = document.getElementById('messages');

      for (var i = 0; i < messages.length; i++) {
        object = messages[i];
        id = object['id'];
        content = object['content'];
        username = object['username'];
        var para = document.createElement("p");
        para.id = "p" + id.toString();
        var node = document.createTextNode(content + " " + username);
        para.appendChild(node);
        messagesDiv.appendChild(para);
      }
    }
    else if (request.readyState == 4 && request.status != 200) {
      document.getElementById('messages').innerHTML = "<p> Whoops, something went wrong </p>";
    }
    else
    {
      console.log("In progress...");
    }
  };

  request.send(null);
}
