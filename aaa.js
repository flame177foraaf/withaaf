var Search2 = [];
console.log(Search2.length)
var search3 = ['정신'];
if (typeof(search3) == 'object') {
  for (var i = 0; i < search3.length; i++) {
    Search2.push(search3[i]) ;
  }

} else if(typeof(search3) == 'string' ){
    Search2.push(search3) ;
}
var SearchType2 = [];
var SearchType23 = [ 'wpproperty'];
if (typeof(search3) == 'object') {
  for (var i = 0; i < search3.length; i++) {
    SearchType2.push(SearchType23[i]) ;
  }

} else if(typeof(search3) == 'string' ){
    SearchType2.push(SearchType23) ;
}

var SearchPlus = "";
for (var i = 0; i < SearchType23.length; i++) {
  var SearchPlus = SearchPlus+ ' AND ' + SearchType23[i] + ' Ilike ' +" '%"+ Search2[i] +"%' "

}
console.log(typeof(Search2))
console.log(Search2.length)
console.log(SearchPlus)
