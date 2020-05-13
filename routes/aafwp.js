var express = require('express');
var router = express.Router();
var app = express();


const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  //ssl: true,
});

client.connect();
router.get('/', (req,res,next) => {
  var QueryString = "select wpid, wpname from aquafeq.aquafwp;"
  client.query(QueryString, (err, response) => {
    console.log(response.rows[0])

    if (err) {
      console.log('변경하기 목록 오류!')
      res.redirect('/aafwp');
    } else {
      res.render('aafwp', {
        title:'AAF 장비',
        data:response.rows
      });
    };
  });
});

router.get('/wpadd', (req,res,next) => {
  res.render ('wpadd', {
    title:'AAF 장비'
  });
});

router.get('/fixwp', (req,res,next) => {
  var Select_name = req.query.Seachname;
  var QueryString = "select * from aquafeq.aquafwp where wpname = $1"
  client.query(QueryString, [Select_name], (err, response) => {
    console.log(response.rows[0]);
    console.log(typeof(response.rows[0]));

    if (response.rows[0] !== "object") {
      res.redirect('/aafwp')
    } else {
      console.log(Select_name)
      client.query(QueryString, [Select_name], (err, response) => {
        res.render ('fixwp', {
          title:'AAF 장비',
          data:response.rows[0]
        });
      })
    }
  })
});

router.post('/fixwp', (req,res,next) => {
  var Select_name = req.query.Seachname
  var Wpgrade = req.body.wpgrade;
    if (Wpgrade !== '') {
      Wpgrade = Wpgrade.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Wplimit = req.body.wplimit;
    if (Wplimit == '') {
        Wplimit = null
    }
  var Wpsocket = req.body.wpsocket;
  var Wpether = req.body.wpether;
  var Wpstats = req.body.wpstats;
    if (Wpstats !== '') {
      Wpstats = Wpstats.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Wpproperty = req.body.wpproperty;
    if (Wpproperty !== '') {
      Wpproperty = Wpproperty.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Wpfeat = req.body.wpfeat;
    if (Wpfeat !== '') {
      Wpfeat = Wpfeat.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Wpcustom = req.body.wpcustom;
    if (Wpcustom !== ''){
      Wpcustom = Wpcustom.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Wpup = req.body.wpup;
    if (Wpup !== '') {
      Wpup = Wpup.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var QueryString = "UPDATE aquafeq.aquafwp SET wpgrade = $1, wpsocket = $2, wpether = $3, wpstats = $4, wpproperty = $5, wpfeat = $6, wpcustom = $7, wpup = $8  WHERE aquafeq.aquafwp.wpname = $9 "
  client.query(QueryString, [Wpgrade, Wplimit, Wpsocket, Wpether, Wpstats, Wpproperty, Wpfeat, Wpcustom, Wpup, Select_name], (err, response) => {

    res.redirect ('/');
  });

});


router.post('/', (req, res, next) => {
  var Wpgrade = req.body.wpgrade;
    if (Wpgrade !== '') {
      Wpgrade = Wpgrade.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }

  var Wpname = req.body.wpname;
  var Wplimit = req.body.wplimit;
    if (Wplimit == '') {
        Wplimit = null
    }
  var Wpsocket = req.body.wpsocket;
  var Wpether = req.body.wpether;
  var Wpstats = req.body.wpstats;
    if (Wpstats !== '') {
      Wpstats = Wpstats.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Wpproperty = req.body.wpproperty;
    if (Wpproperty !== '') {
      Wpproperty = Wpproperty.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Wpfeat = req.body.wpfeat;
    if (Wpfeat !== '') {
      Wpfeat = Wpfeat.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Wpcustom = req.body.wpcustom;
    if (Wpcustom !== ''){
      Wpcustom = Wpcustom.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Wpup = req.body.wpup;
    if (Wpup !== '') {
      Wpup = Wpup.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var QueryString = "INSERT INTO aquafeq.aquafwp(wpgrade, wpname, wplimit, wpsocket, wpether, wpstats, wpproperty, wpfeat, wpcustom, wpup) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);"
  client.query(QueryString, [Wpgrade, Wpname, Wplimit, Wpsocket, Wpether, Wpstats, Wpproperty, Wpfeat, Wpcustom, Wpup], (err, response) => {
    console.log(Wpgrade);
    console.log(Wpname);
    if (err) {
      console.log('인서트 오류!')
      res.redirect('/aafwp');
    } else {
      res.render('aafwp', {
        title:'AAF 장비'
      });
    };
  });
});




router.get('/:id', (req,res,next) => {
  var SearchType = req.query.searchType;
  if (SearchType === 'name') {
    var Search = req.query.searchText;
    var CurrentPage = req.params.id;
    var SearchLimit = req.query.limit;
    if (SearchLimit === undefined) {
      SearchLimit = 0;
    };
    console.log(SearchLimit)
    var QueryString = "SELECT *, count(*) over() as totalcount FROM aquafeq.aquafwp where wpname LIKE $1 and cast(wplimit as INTEGER) >= $2 or wplimit is null  ORDER BY wplimit,wpid asc limit 10 offset (($3- 1)*10);"
    client.query(QueryString, ['%' + Search + '%', SearchLimit, CurrentPage], (err, response) => {
      console.log('서치리밋' + SearchLimit);
      if(typeof(response.rows[0]) !== "object") {
        var TotalCount = 1;
      } else {
        var TotalCount = response.rows[0].totalcount;
      }
      console.log('토탈 카운트 ' + TotalCount)
      console.log(CurrentPage)
      console.log(typeof(CurrentPage))
      var DataCountInPage = 10;
      var PageSize = 10;
      var TotalPage = parseInt(TotalCount / DataCountInPage,10);
      if (TotalCount % DataCountInPage > 0) {
        TotalPage++;
      };

      console.log('토탈 페이지' + TotalPage);
      if (TotalPage < CurrentPage) {
        CurrentPage = TotalPage;
      };
      var StartPage = parseInt(((CurrentPage - 1)/10),10) *10 +1;
      console.log('스타트페이지' + StartPage);

      var EndPage = StartPage + DataCountInPage -1;
      if (EndPage > TotalPage) {
        EndPage = TotalPage;
      };
      console.log('엔드페이지'+ EndPage);
      console.log(response.rows[0])
      res.render('aafwp', {
        title: 'AAF 장비',
        data: response.rows,
        CurrentPage: CurrentPage,
        PageSize: PageSize,
        StartPage: StartPage,
        EndPage: EndPage,
        TotalPage: TotalPage,
        SearchType: SearchType,
        Search: Search,
        SearchLimit: SearchLimit
      });
    });
  } else if (SearchType === 'property') {
    var Search = req.query.searchText;
    var CurrentPage = req.params.id
    var SearchLimit = req.query.limit;
    if (SearchLimit === undefined) {
      SearchLimit = 0;
    };
    var QueryString = "SELECT *, count(*) over() as totalcount FROM aquafeq.aquafwp where wpproperty LIKE $1 and cast(wplimit as INTEGER) >= $2 or wplimit is null  ORDER BY wplimit asc limit 10 offset (($3- 1)*10);"
    client.query(QueryString, ['%' + Search + '%', SearchLimit, CurrentPage], (err, response) => {
      if(typeof(response.rows[0]) !== "object") {
        var TotalCount = 1;
      } else {
        var TotalCount = response.rows[0].totalcount;
      }
      console.log(TotalCount)
      var DataCountInPage = 10;
      var PageSize = 10;
      var TotalPage = parseInt(TotalCount / DataCountInPage,10);
      if (TotalCount % DataCountInPage > 0) {
        TotalPage++;
      };
      if (TotalPage < CurrentPage) {
        CurrentPage = TotalPage;
      };
      var StartPage = parseInt(((CurrentPage - 1)/10),10) *10 +1;
      var EndPage = StartPage + DataCountInPage -1;
      if (EndPage > TotalPage) {
        EndPage = TotalPage;
      };
      res.render('aafwp', {
        title: 'AAF 장비',
        data: response.rows,
        CurrentPage: CurrentPage,
        PageSize: PageSize,
        StartPage: StartPage,
        EndPage: EndPage,
        TotalPage:TotalPage,
        SearchType: SearchType,
        Search: Search,
        SearchLimit: SearchLimit
      });
    });
  } else if (SearchType === 'feat') {
    var Search = req.query.searchText;
    var CurrentPage = req.params.id
    var SearchLimit = req.query.limit;
    if (SearchLimit === undefined) {
      SearchLimit = 0;
    };
    var QueryString = "SELECT *, count(*) over() as totalcount FROM aquafeq.aquafwp where wpfeat LIKE $1 and cast(wplimit as INTEGER) >= $2 or wplimit is null  ORDER BY wplimit asc limit 10 offset (($3- 1)*10);"
    client.query(QueryString, ['%' + Search + '%', SearchLimit, CurrentPage], (err, response) => {
      if(typeof(response.rows[0]) !== "object") {
        var TotalCount = 1;
      } else {
        var TotalCount = response.rows[0].totalcount;
      }
      console.log(TotalCount)
      var DataCountInPage = 10;
      var PageSize = 10;
      var TotalPage = parseInt(TotalCount / DataCountInPage,10);
      if (TotalCount % DataCountInPage > 0) {
        TotalPage++;
      };
      if (TotalPage < CurrentPage) {
        CurrentPage = TotalPage;
      };
      var StartPage = parseInt(((CurrentPage - 1)/10),10) *10 +1;
      var EndPage = StartPage + DataCountInPage -1;
      if (EndPage > TotalPage) {
        EndPage = TotalPage;
      };
      res.render('aafwp', {
        title: 'AAF 장비',
        data: response.rows,
        CurrentPage: CurrentPage,
        PageSize: PageSize,
        StartPage: StartPage,
        EndPage: EndPage,
        TotalPage:TotalPage,
        SearchType: SearchType,
        Search: Search,
        SearchLimit: SearchLimit
      });
    });
  } else if (SearchType === 'custom') {
    var Search = req.query.searchText;
    var CurrentPage = req.params.id
    var SearchLimit = req.query.limit;
    if (SearchLimit === undefined) {
      SearchLimit = 0;
    };
    var QueryString = "SELECT *, count(*) over() as totalcount FROM aquafeq.aquafwp where wpcustom LIKE $1 and cast(wplimit as INTEGER) >= $2 or wplimit is null  ORDER BY wplimit asc limit 10 offset (($3- 1)*10);"
    client.query(QueryString, ['%' + Search + '%', SearchLimit, CurrentPage], (err, response) => {
      if(typeof(response.rows[0]) !== "object") {
        var TotalCount = 1;
      } else {
        var TotalCount = response.rows[0].totalcount;
      }
      console.log(TotalCount)
      var DataCountInPage = 10;
      var PageSize = 10;
      var TotalPage = parseInt(TotalCount / DataCountInPage,10);
      if (TotalCount % DataCountInPage > 0) {
        TotalPage++;
      };
      if (TotalPage < CurrentPage) {
        CurrentPage = TotalPage;
      };
      var StartPage = parseInt(((CurrentPage - 1)/10),10) *10 +1;
      var EndPage = StartPage + DataCountInPage -1;
      if (EndPage > TotalPage) {
        EndPage = TotalPage;
      };
      res.render('aafwp', {
        title: 'AAF 장비',
        data: response.rows,
        CurrentPage: CurrentPage,
        PageSize: PageSize,
        StartPage: StartPage,
        EndPage: EndPage,
        TotalPage:TotalPage,
        SearchType: SearchType,
        Search: Search,
        SearchLimit: SearchLimit
      });
    });
  } else {
    res.redirect('/aafwp');
  };
})



/* sql 테이블 랜더링 */
router.get('/', (req, res, next) => {
  if(req.query.searchType === 'name') {
    var searchingtext = req.query.searchText
    var sql = 'SELECT * FROM aquafwp WHERE wpname LIKE ?' ;
    connection.query(sql, "%" + searchingtext + "%",function(err, results, field) {
      res.render('aafwp', {
        title: '무기',
        varaquafwp: results
      });
    });
  } else if(req.query.searchType === 'property') {
    var searchingtext =req.query.searchText
    var sql = 'SELECT * FROM aquafwp WHERE wpproperty LIKE ?';
    connection.query(sql, "%" + searchingtext + "%", function(err, results, field) {
      console.log('aquafwp 속성 검색');
      res.render('aafwp', {
        title: '무기',
        varaquafwp: results
      });
    });
  } else if (req.query.searchType === 'feat'){
    var searchingtext =req.query.searchText
    var sql = 'SELECT * FROM aquafwp WHERE wpfeat LIKE ?';
    connection.query(sql, "%" + searchingtext + "%", function(err, results, field) {
      console.log('aquafwp 피트 검색');
      res.render('aafwp', {
        title: '무기',
        varaquafwp: results
      });
    });
  } else if (req.query.searchType === 'custom'){
    var searchingtext =req.query.searchText
    var sql = 'SELECT * FROM aquafwp WHERE wpcustom LIKE ?';
    connection.query(sql, "%" + searchingtext + "%", function(err, results, field) {
      console.log('aquafwp 커스텀 검색');
      res.render('aafwp', {
        title: '무기',
        varaquafwp: results
      });
    });
  } else {
    res.render('aafwp', {
      title: '무기',
    })
  }

});




module.exports = router;
