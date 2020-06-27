var Search2 = [ '정신', '바람' ];
var SearchType2 = [ 'wpproperty', 'wpproperty' ];
var Searchcount = Search2.length;

var SearchPlus = "";

for (var i = 0; i < Searchcount; i++) {
  var SearchPlus = SearchPlus+ ' AND ' + SearchType2[i] + ' Ilike ' +' %'+ Search2[i] +'% '

}
console.log(SearchPlus)
