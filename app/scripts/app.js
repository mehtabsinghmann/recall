'use strict';
var index = localStorage["index"];
if(!index) {
  var index = lunr(function () {
    this.field('body');
    this.ref('id');
  });
  localStorage["index"] = JSON.stringify(index.toJSON());
} else {
  index = lunr.Index.load(JSON.parse(index));
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type == "newLoad") {
      sendResponse({message: sender.tab.url, index: index});
      index.add({
        id: sender.tab.url,
        body: request.data
      });
      localStorage["index"] = JSON.stringify(index.toJSON());
    }
  });

chrome.omnibox.onInputChanged.addListener(function (text, suggest) {
  var suggestions = index.search(text);
  suggest(suggestions.map(function (el) {
      return {
        content: el.ref,
        description: el.ref
      };
    }));
});

chrome.omnibox.onInputEntered.addListener(
  function(text) {
    chrome.tabs.getSelected(null, function(tab) {
      chrome.tabs.update(tab.id, {url: text});
    });
  }
);
