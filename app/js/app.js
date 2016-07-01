'use strict';
var recall_index = localStorage["recall_index"];
if(!recall_index) {
  var recall_index = lunr(function () {
    this.field('body');
    this.ref('id');
  });
  localStorage["recall_index"] = JSON.stringify(recall_index.toJSON());
} else {
  recall_index = lunr.Index.load(JSON.parse(recall_index));
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type == "newLoad") {
      sendResponse({message: sender.tab.url, recall_index: recall_index});
      recall_index.add({
        id: sender.tab.url,
        body: request.data
      });
      localStorage["recall_index"] = JSON.stringify(recall_index.toJSON());
    }
  });

chrome.omnibox.onInputChanged.addListener(function (text, suggest) {
  var suggestions = recall_index.search(text);
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
