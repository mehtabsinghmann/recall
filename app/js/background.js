'use strict';
var index = elasticlunr(function() {
    this.setRef('id');
    this.addField('data');
});

// chrome.storage.sync.get("com.mehtabsinghmann.recall", function(items) {
//     index = elasticlunr.Index.load(JSON.parse(items));
// });

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.type == 'freshLoad') {
            sendResponse({ url: sender.tab.url, data: request.data });
            index.addDoc({ id: sender.tab.url, data: request.data });
            chrome.storage.sync.set("com.mehtabsinghmann.recall", JSON.stringify(index.toJSON()));
        }
    }
);

chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
    var suggestions = index.search(text, {
        fields: {
            id: { boost: 2 },
            data: { boost: 1 }
        }
    });
    suggest(suggestions.map(function(el) {
        return {
            content: el.ref,
            description: el.ref
        };
    }));
});

chrome.omnibox.onInputEntered.addListener(
    function(text) {
        chrome.tabs.getSelected(null, function(tab) {
            chrome.tabs.update(tab.id, { url: text });
        });
    }
);
