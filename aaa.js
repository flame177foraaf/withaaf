var Search2 = [];
var search3 = ['정신'];
for (var i = 0; i < search3.length; i++) {
  Search2.push(search3[i]) ;
}
var SearchType2 = [];
var SearchType23 = [ 'wpproperty' ];
for (var i = 0; i < search3.length; i++) {
  SearchType2.push(SearchType23[i]) ;
}

var SearchPlus = "";
for (var i = 0; i < SearchType23.length; i++) {
  if (typeof(Search2) !== '') {
    var SearchPlus = SearchPlus+ ' AND ' + SearchType23[i] + ' Ilike ' +" '%"+ Search2[i] +"%' "

  } else if (typeof(Search2) === 'object') {
    var SearchPlus = SearchPlus+ ' AND ' + SearchType23[i] + ' Ilike ' +" '%"+ Search2[i] +"%' "
  }
}
console.log(SearchPlus)
