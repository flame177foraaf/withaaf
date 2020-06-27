var Search2 = '정신';
var Search2 = ['정신', '바람'];

console.log(typeof(Search2))
var SearchType2 = [ 'wpproperty', 'wpproperty' ];
var Searchcount = Search2.length;

var SearchPlus = "";
console.log(Search2)
console.log(SearchType2[0] )
if (typeof(Search2) !== 'object') {
  var SearchPlus = SearchPlus+ ' AND ' + SearchType2[0] + ' Ilike ' +" '%"+ Search2 +"%' "
} else if (typeof(Search2) === 'object') {
  for (var i = 0; i < Searchcount; i++) {
    var SearchPlus = SearchPlus+ ' AND ' + SearchType2[i] + ' Ilike ' +  ' %'+ Search2[i] +'% '
  }
}
console.log(SearchPlus)
