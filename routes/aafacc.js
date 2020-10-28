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
  var QueryString = "select accid, accname from aquafeq.aquafacc ORDER BY acclimit,accid asc ;"
  client.query(QueryString, (err, response) => {
    console.log(response.rows[0])
    if (err) {
      res.redirect('/aafacc');
    } else {
      res.render('aafacc', {
        title:'AAF 장비',
        data:response.rows
      });
    };
  });});

router.get('/addacc', (req,res,next) => {
  res.render ('addacc', {
    title:'AAF 악세사리 등록'
  });

});

router.post('/', (req, res, next) => {
  var Accgrade = req.body.accgrade;
    if (Accgrade !== '') {
      Accgrade = Accgrade.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }

  var Accname = req.body.accname;
  var Acclimit = req.body.acclimit;
    if (Acclimit == '') {
        Acclimit = null
    }
  var Accsocket = req.body.accsocket;
  var Accether = req.body.accether;
  var Accstats = req.body.accstats;
    if (Accstats !== '') {
      Accstats = Accstats.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Accproperty = req.body.accproperty;
    if (Accproperty !== '') {
      Accproperty = Accproperty.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Accfeat = req.body.accfeat;
    if (Accfeat !== '') {
      Accfeat = Accfeat.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Acccustom = req.body.acccustom;
    if (Acccustom !== ''){
      Acccustom = Acccustom.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Accup = req.body.accup;
    if (Accup !== '') {
      Accup = Accup.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var QueryString = "INSERT INTO aquafeq.aquafacc(accgrade, accname, acclimit, accsocket, accether, accstats, accproperty, accfeat, acccustom, accup) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);"
  client.query(QueryString, [Accgrade, Accname, Acclimit, Accsocket, Accether, Accstats, Accproperty, Accfeat, Acccustom, Accup], (err, response) => {
    var QueryString = "select accid, accname from aquafeq.aquafacc where accname = Accname ORDER BY acclimit,accid asc ;"
    client.query(QueryString, (err, response) => {
      res.render('aafacc', {
        title:'AAF 장비',
        data:response.rows
      });
    });
  });
});
router.get('/fixacc', (req,res,next) => {
  var QueryString = "select accname from aquafeq.aquafacc"
  client.query(QueryString, (err, response) => {
    var Select_name = req.query.Seachname;
    var QueryString = "select * from aquafeq.aquafacc where accname = $1"
    client.query(QueryString, [Select_name], (err, response) => {
      if(typeof(response.rows[0]) !== "object") {
        res.render ('addacc', {
          title: '신규 장비 ' + Select_name + ' 등록',
        });
      } else {
        res.render ('fixacc', {
          title:Select_name + '정보',
          data:response.rows[0]
        });
      }
    });
  });
});


//무기 변경하기
router.post('/fixacc', (req,res,next) => {
  var Eqid = req.body.eqid;
  console.log(Eqid)

  var Accgrade = req.body.accgrade;
    if (Accgrade == '') {
      Accgrade = null
    } else if (Accgrade !== '') {
      Accgrade = Accgrade.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Accname = req.body.accname;
  var Acclimit = req.body.acclimit;
    if (Acclimit == '') {
      Acclimit = null
    }
  var Accsocket = req.body.accsocket;
    if (Accsocket == '') {
      Accsocket = null
    }
  var Accether = req.body.accether;
    if (Accether == '') {
      Accether = null
    }
  var Accstats = req.body.accstats;
    if (Accstats == '') {
      Accstats = null
    } else if (Accstats !== '') {
      Accstats = Accstats.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }

  var Accproperty = req.body.accproperty;
    if (Accproperty == '') {
      Accproperty = null
    } else if (Accproperty !== '') {
      Accproperty = Accproperty.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Accfeat = req.body.accfeat;
    if (Accfeat == '') {
      Accfeat = null
    } else if (Accfeat !== '') {
      Accfeat = Accfeat.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Acccustom = req.body.acccustom;
    if (Acccustom == '') {
      Acccustom = null
    } else if (Acccustom !== ''){
      Acccustom = Acccustom.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Accup = req.body.accup;
    if (Accup == '') {
      Accup = null
    } else if (Accup !== '') {
      Accup = Accup.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }


  var QueryString = "UPDATE aquafeq.aquafacc SET (accgrade, acclimit, accsocket, accether, accstats, accproperty, accfeat, acccustom, accup, accname) = ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)  WHERE accid = $11 returning *"
  client.query(QueryString, [Accgrade, Acclimit, Accsocket, Accether, Accstats, Accproperty, Accfeat, Acccustom, Accup, Accname, Eqid], (err, response) => {

    var QueryString = "select * from aquafeq.aquafacc where accname = $1"
    client.query ( QueryString, [Accname],  (err, response) => {
      console.log(response.rows[0])
      res.render('aafacc', {
        title : Accname + ' 변경 완료',
        data: response.rows
      })
    });
  });
});

router.get('/:id', (req,res,next) => {
  var SearchType = req.query.searchType;

  var Search = req.query.searchText;
  var CurrentPage = req.params.id;
  var SearchPlus = "";

  if (req.query.searchText2 != 'undefined') {
    var Search2 = req.query.searchText2;
    var Search22 = [];

    if (typeof(Search2) == 'object') {
      for (var i = 0; i < Search2.length; i++) {
        Search22.push(Search2[i]) ;
      }
    } else if(typeof(Search2) == 'string' ){
        Search22.push(Search2) ;
    }
    // 포 문 에서 search2 배열의 각각의 값중에서 빈 값이 있는 경우 빈 배열에 넣지않고 그냥 넘어가는 작업을 해야함, 이에 따라 아래의 타입 배열에 넣는 경우에서도 동일함

    var SearchType2 = req.query.searchType2;
    var SearchType22 = [];
    if (typeof(SearchType2) == 'object') {
      for (var i = 0; i < Search2.length; i++) {
        SearchType22.push(SearchType2[i]) ;
      }
    } else if(typeof(SearchType2) == 'string' ){
      SearchType22.push(SearchType2) ;
    }
    var Searchcount = Search22.length;
    if (typeof(SearchType2) == 'string') {
      var SearchPlus = SearchPlus+ ' AND ' + SearchType22+ ' Ilike ' +" '%"+ Search2 +"%' "
    } else if (typeof(SearchType2) == 'object') {
      for (var i = 0; i < Searchcount; i++) {
        var SearchPlus = SearchPlus+ ' AND ' + SearchType22[i] + ' Ilike ' +" '%"+ Search2[i] +"%' "
      }
    }
    var QueryString = "SELECT *, count(*) over() as totalcount FROM aquafeq.aquafacc WHERE " + SearchType +" Ilike $1 " + SearchPlus + " ORDER BY acclimit,accid asc limit 10 offset (($2- 1)*10);"
  } else {
    var QueryString = "SELECT *, count(*) over() as totalcount FROM aquafeq.aquafacc WHERE "+ SearchType +" Ilike $1 ORDER BY acclimit,accid asc limit 10 offset (($2- 1)*10);"

  }
  client.query(QueryString, ['%' + Search + '%', CurrentPage], (err, response) => {
    console.log(Search)
    console.log(SearchType)
    console.log(CurrentPage)
    console.log(SearchPlus)
    console.log(Search2)
    console.log(Search22)

    if (err) {
      res.redirect('/aafacc');
    } else if (typeof(response.rows[0]) !== "object") {
      var TotalCount = 1;
    } else {
      var TotalCount = response.rows[0].totalcount;
    }
    //console.log('토탈 카운트 ' + TotalCount)
    //console.log(CurrentPage)
    //console.log(typeof(CurrentPage))
    var DataCountInPage = 10;
    var PageSize = 10;
    var TotalPage = parseInt(TotalCount / DataCountInPage,10);
    if (TotalCount % DataCountInPage > 0) {
      TotalPage++;
    };

    //console.log('토탈 페이지' + TotalPage);
    if (TotalPage < CurrentPage) {
      CurrentPage = TotalPage;
    };
    var StartPage = parseInt(((CurrentPage - 1)/10),10) *10 +1;
    //console.log('스타트페이지' + StartPage);

    var EndPage = StartPage + DataCountInPage -1;
    if (EndPage > TotalPage) {
      EndPage = TotalPage;
    };
    //console.log('엔드페이지'+ EndPage);
    //console.log(response.rows[0])
    res.render('aafacc', {
      title: 'AAF 장비',
      data: response.rows,
      CurrentPage: CurrentPage,
      PageSize: PageSize,
      StartPage: StartPage,
      EndPage: EndPage,
      TotalPage: TotalPage,
      SearchType: SearchType,
      Search: Search,
      SearchPlus: SearchPlus,
      Search2: Search2,
      Search22: Search22,
      SearchType2: SearchType2,
      SearchType22: SearchType22,
      Searchcount:Searchcount


    });
  });

})







module.exports = router;
