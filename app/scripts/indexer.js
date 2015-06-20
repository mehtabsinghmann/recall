var tags = Immutable.Seq.of('h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'strong', 'b','title');

var $tags = tags
  .flatMap(function (tag) {
    return Array.prototype.slice.call(document.querySelectorAll(tag));
  }).flatMap(function ($el) {
    var re = /[\u23CE]/g;
    return $el.innerText.split(' ');
  }).map(function (word) {
    return word.replace(/\W/g, '');
  }).filter (function (word) {
    return (word.length > 3);
  }).toArray();

var linkWords = Immutable.Seq.of('a')
  .flatMap(function (tag) {
    return Array.prototype.slice.call(document.querySelectorAll(tag));
  }).flatMap(function ($el) {
    return $el.href
      .replace(/\//g, '+')
      .replace('.', '+')
      .split('+');
  }).filter(function (word) {
    return word.length > 2;
  })
  .toArray();

var meta_tags = Immutable.Seq.of('meta')
  .flatMap(function (tag) {
    return Array.prototype.slice.call(document.querySelectorAll(tag));
  }).flatMap(function ($el) {
    var re = /[\u23CE]/g;
    var content_attr = $el.getAttribute('content');
    console.log(content_attr);
    if(content_attr){
      return content_attr.split(' ');
    }
    return ' ';
  }).map(function (word) {
    return word.replace(/\W/g, '');
  }).filter (function (word) {
    return (word.length > 3);
  }).toArray();


chrome.runtime.sendMessage({type: "newLoad", data: ($tags.concat(linkWords).concat(meta_tags)).join(' ')}, function(response) {
  console.log(response);
});