README.txt
Lab: Messages, Part 2
COMP 20
Jared Moskowitz

1. To my knowledge everything has been correctly implemented.
2. N/A
3. 1 hour

Part 2: Loading the Data From Local Machine:
Opening the file in a browser worked for Firefox, but not Chrome or Safari. Chrome
and Safari threw the error "Cross origin requests are only supported for HTTP."
See later answer for why it shouldn't work.

Part 3: Loading the Data Given a URI
Requesting the json from the given URI does not work. Firefox and Chrome returned the
error: "No 'Access-Control-Allow-Origin' header is present on the requested resource.
Origin 'http://localhost:8000' is therefore not allowed access."

Is it possible to request the data from a different origin
(e.g., http://messagehub.herokuapp.com/) or from your local machine (from file:///)
from using XMLHttpRequest? Why or why not?
It is not possible unless a CORS is used. The reason the URI example doesn't work is
because of the same-origin policy. A request is being made to a different host
than the local host the request is being executed on. The local machine doesn't
work because part of the same-origin policy is that the requests must be executed
on a server. One reason why a browser would not allow accessing local files, even
if they are in the same directory, is because a web page could access a user's
hard drive this way.
