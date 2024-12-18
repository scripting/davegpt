#### 12/18/24; 10:02:46 AM by DW

I have the package working for Node. 

When we want it to work for the browser too, the starting point will be to include commoncode.js in the header portion of their html file, and then start debugging from there. 

Since the code was derived from code that worked in the browser, the problems should probably just be the difference between code that's in utils.js, but we won't know until we're doing the work, of course. ;-)

#### 12/17/24; 5:41:10 PM by DW

Turning it into a node package, and will also provide a browser-based client that uses the same code to communicate. 

#### 12/17/24; 11:52:09 AM by DW

Added a new option to chatWithChatGpt, the caller can now provide a callback that makes an HTTP request. That way code running on Node can use request and code running on the desktop can use jQuery. Since I developed this on the desktop, the default is jQuery, so you can  leave xxx undefined if you're running on the desktop.

#### 12/16/24; 9:32:59 AM by DW

I have the outliner set up. When I click the Go button it sends the text of the line I was editing to ChatGPT, and inserts the response as a subhead.

It's really sending back lines of text, delimited by \n\n between lines. I have to parse this and generate a list of subs.

But ChatGPT is too slow now to get any work done. Will try this at night when things are running faster?

But it looks promising. 

