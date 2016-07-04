'use strict';
var corpusTags = Immutable.Seq.of('h1', 'h2', 'strong', 'b', 'title');

var commonTagsData = corpusTags
    .flatMap(function(tag) {
        return Array.prototype.slice.call(document.querySelectorAll(tag));
    }).flatMap(function($el) {
        var re = /[\u23CE]/g;
        return $el.innerText.split(' ');
    }).map(function(word) {
        return word.replace(/\W/g, '');
    }).filter(function(word) {
        return (word.length > 3);
    }).toArray();

var metaTagsData = Immutable.Seq.of('meta')
    .flatMap(function(tag) {
        return Array.prototype.slice.call(document.querySelectorAll(tag));
    }).flatMap(function($el) {
        var re = /[\u23CE]/g;
        var content_attr = $el.getAttribute('content');
        if (content_attr) {
            return content_attr.split(' ');
        }
        return ' ';
    }).map(function(word) {
        return word.replace(/\W/g, '');
    }).filter(function(word) {
        return (word.length > 3);
    }).toArray();

var data = (commonTagsData.concat(metaTagsData)).join(' ');

chrome.runtime.sendMessage({ type: 'freshLoad', data: data }, function(response) {
    console.log(response.url);
});
