var Search2 = [ '정신', '바람' ];
var SearchType2 = [ 'wpproperty', 'wpproperty' ];
var Searchcount = Search2.length;


for (var i = 0; i < Searchcount -1; i++) {
  var SearchPlus = ' AND ' + SearchType2[i] + ' Ilike ' + Search2[i]

  SearchPlus = SearchPlus + SearchPlus
  console.log(SearchPlus)
}
