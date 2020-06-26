var express = require('express');
var router = express.Router();
var app = express();

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  // ssl: true,
});

client.connect();

router.get('/', (req,res,next) => {
  res.render('recipe', {
    title:'AAF 레시피'
  });
});

router.get('/:id', (req,res,next) => {
  var SearchType = req.query.searchType;
  if (SearchType === 'name') {
    var Search = req.query.searchText;
    var CurrentPage = req.params.id;
    var QueryString = "SELECT *, count(*) over() FROM aquafeq.aquafrecipe WHERE collectname Ilike $1 OR collect1name Ilike $1 OR collect2name Ilike $1 OR collect3name Ilike $1 OR collect4name Ilike $1 OR collect5name Ilike $1 OR collect6name Ilike $1 limit 20 offset (($2- 1)*20);"
    client.query(QueryString, ['%' + Search + '%',  CurrentPage], (err, response) => {
      if (err) {
        res.redirect('/')
      } else {
        console.log(typeof(response.rows[0]))
        console.log(typeof(response.rows))

        if(typeof(response.rows[0]) !== "object") {
          var TotalCount = 1;
        } else {
          var TotalCount = response.rows[0].totalcount;
        }

        console.log(TotalCount)
        console.log(typeof(TotalCount))
        var DataCountInPage = 20;
        var PageSize = 10;
        var TotalPage = parseInt(TotalCount / DataCountInPage,10);
        console.log(TotalPage)
        if (TotalCount % DataCountInPage > 0) {
          TotalPage++;
        };
        console.log(TotalPage)

        if (TotalPage < CurrentPage) {
          CurrentPage = TotalPage;
        };
        console.log(CurrentPage)
        var StartPage = parseInt(((CurrentPage - 1)/10),10) *10 +1;
        var EndPage = StartPage + PageSize -1;
        console.log(EndPage)
        if (EndPage > TotalPage) {
          EndPage = TotalPage;
        };
        console.log(EndPage)
        res.render('recipe', {
          title: 'AAF 레시피',
          data: response.rows,
          CurrentPage: CurrentPage,
          PageSize: PageSize,
          StartPage: StartPage,
          EndPage: EndPage,
          TotalPage: TotalPage,
          SearchType: SearchType,
          Search: Search,
        });
      }

    });
  } else if (SearchType === 'number') {
    var Search = req.query.searchText;
    var CurrentPage = req.params.id;
    var QueryString = "SELECT *, count(*) over() as totalcount FROM aquafeq.aquafrecipe WHERE collectnum Ilike $1 OR collect1num Ilike $1 OR collect2num Ilike $1 OR collect3num Ilike $1 OR collect4num Ilike $1 OR collect5num Ilike $1 OR collect6num Ilike $1 limit 20 offset (($2- 1)*20);"
    console.log(QueryString)
    client.query(QueryString, ['%' + Search + '%',  CurrentPage], (err, response) => {
      if(typeof(response.rows[0]) !== "object") {
        var TotalCount = 1;
      } else {
        var TotalCount = response.rows[0].totalcount;
      }
      console.log(typeof(TotalCount))
      var DataCountInPage = 20;
      var PageSize = 10;
      var TotalPage = parseInt(TotalCount / DataCountInPage,10);
      console.log(TotalPage)
      if (TotalCount % DataCountInPage > 0) {
        TotalPage++;
      };
      console.log(TotalPage)

      if (TotalPage < CurrentPage) {
        CurrentPage = TotalPage;
      };
      var StartPage = parseInt(((CurrentPage - 1)/10),10) *10 +1;
      console.log(StartPage)

      var EndPage = StartPage + PageSize -1;
      console.log(EndPage)

      if (EndPage > TotalPage) {
        EndPage = TotalPage;
      };
      console.log(EndPage)
      res.render('recipe', {
        title: 'AAF 레시피',
        data: response.rows,
        CurrentPage: CurrentPage,
        PageSize: PageSize,
        StartPage: StartPage,
        EndPage: EndPage,
        TotalPage: TotalPage,
        SearchType: SearchType,
        Search: Search,
      });
    });
  } else {
    res.redirect('/recipe');
  };
});




module.exports = router;
