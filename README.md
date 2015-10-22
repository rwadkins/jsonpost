# jsonpost

Cross Origin http post.   Similar to jsonp.

# Summary

jsonpost allows for the sending of data to cross origin host urls via POST.   Where jsonp utilizes script tag injection and a predefined callback method to receive a response from the partner server, jsonpost utilizes a form and iframe, and the postMessage api instead of a callback.   

The post contains a JSON document as the payload, a UUID and origin used to properly transmit the data via postMessage. 

The return should be an html stream containing a script tag and a call to window.parent.postMessage, passing a JSON document containing the passed in UUID and a payload of the server's choosing as the first argument and the passed in origin as the second.   

# Documentation

## jsonpost(url, payload, options);

url: the fully qualified, cross origin url to which to POST the data.

payload: A serializable JavaScript Object with data to be posted.

options: A JavaScript object containing configuration options for the POST operation, allowed values are:

&nbsp;&nbsp;&nbsp;&nbsp;callback: A method to run when the POST either succeeds or fails.   The callback should expect to receive either an error object as the first argument or the returned data object as the second argument.   

&nbsp;&nbsp;&nbsp;&nbsp;timeout: An integer value, in milliseconds, to wait for a respose from the partner server.  Default if 5000.   If the time expires with no response, the callback will be called with an error object identified with a type property of "timeout".

# Server Examples

[jsonpost-examples](https://github.com/rwadkins/jsonpost-examples)
