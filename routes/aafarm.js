var express = require('express');
var router = express.Router();
var app = express();
var url = require('url');
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  //ssl: true,
});

client.connect();

router.get('/', (req,res,next) => {
  res.render('aafarm', {
    title:'AAF 장비',
  });
});

router.get('/addarm', (req,res,next) => {
  res.render ('addarm', {
    title:'AAF 방어구 등록'
  });

});

router.post('/', (req, res, next) => {
  var Armgrade = req.body.armgrade;
    if (Armgrade !== '') {
      Armgrade = Armgrade.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }

  var Armname = req.body.armname;
  var Armlimit = req.body.armlimit;
    if (Armlimit == '') {
        Armlimit = null
    }
  var Armsocket = req.body.armsocket;
  var Armether = req.body.armether;
  var Armstats = req.body.armstats;
    if (Armstats !== '') {
      Armstats = Armstats.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Armproperty = req.body.armproperty;
    if (Armproperty !== '') {
      Armproperty = Armproperty.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Armfeat = req.body.armfeat;
    if (Armfeat !== '') {
      Armfeat = Armfeat.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Armcustom = req.body.armcustom;
    if (Armcustom !== ''){
      Armcustom = Armcustom.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Armup = req.body.armup;
    if (Armup !== '') {
      Armup = Armup.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var QueryString = "INSERT INTO aquafeq.aquafarm(armgrade, Armname, Armlimit, Armsocket, Armether, Armstats, Armproperty, Armfeat, Armcustom, Armup) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);"
  client.query(QueryString, [Armgrade, Armname, Armlimit, Armsocket, Armether, Armstats, Armproperty, Armfeat, Armcustom, Armup], (err, response) => {
    var QueryString = "select armid, Armname from aquafeq.aquafarm where armname = armname ORDER BY armlimit,armid asc ;"
    client.query(QueryString, (err, response) => {
      res.render('aafarm', {
        title:'AAF 장비',
        data:response.rows
      });
    });
  });
});
router.get('/fixarm', (req,res,next) => {
  var QueryString = "select armname from aquafeq.aquafarm"
  client.query(QueryString, (err, response) => {
    var Select_name = req.query.Seachname;
    var QueryString = "select * from aquafeq.aquafarm where armname = $1"
    client.query(QueryString, [Select_name], (err, response) => {
      if(typeof(response.rows[0]) !== "object") {
        res.render ('addarm', {
          title: '신규 장비 ' + Select_name + ' 등록',
        });
      } else {
        res.render ('fixarm', {
          title:Select_name + '정보',
          data:response.rows[0]
        });
      }
    });
  });
});


//무기 변경하기
router.post('/fixarm', (req,res,next) => {
  var Eqid = req.body.eqid;
  console.log(Eqid)

  var Armgrade = req.body.armgrade;
    if (Armgrade == '') {
      Armgrade = null
    } else if (Armgrade !== '') {
      Armgrade = Armgrade.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Armname = req.body.armname;
  var Armlimit = req.body.armlimit;
    if ( Armlimit == '') {
      Armlimit = null
    }
  var Armsocket = req.body.armsocket;
    if (Armsocket == '') {
      Armsocket = null
    }
  var Armether = req.body.armether;
    if (Armether == '') {
      Armether = null
    }
  var Armstats = req.body.armstats;
    if (Armstats == '') {
      Armstats = null
    } else if (Armstats !== '') {
      Armstats = Armstats.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }

  var Armproperty = req.body.armproperty;
    if (Armproperty == '') {
      Armproperty = null
    } else if (Armproperty !== '') {
      Armproperty = Armproperty.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Armfeat = req.body.armfeat;
    if (Armfeat == '') {
      Armfeat = null
    } else if (Armfeat !== '') {
      Armfeat = Armfeat.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Armcustom = req.body.armcustom;
    if (Armcustom == '') {
      Armcustom = null
    } else if (Armcustom !== ''){
      Armcustom = Armcustom.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Armup = req.body.armup;
    if (Armup == '') {
      Armup = null
    } else if (Armup !== '') {
      Armup = Armup.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }


  var QueryString = "UPDATE aquafeq.aquafarm SET (armgrade, Armlimit, Armsocket, Armether, Armstats, Armproperty, Armfeat, Armcustom, Armup, Armname) = ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)  WHERE armid = $11 returning *"
  client.query(QueryString, [Armgrade, Armlimit, Armsocket, Armether, Armstats, Armproperty, Armfeat, Armcustom, Armup, Armname, Eqid], (err, response) => {

    var QueryString = "select * from aquafeq.aquafarm where armname = $1"
    client.query ( QueryString, [Armname],  (err, response) => {
      console.log(response.rows[0])
      res.render('aafarm', {
        title : Armname + ' 변경 완료',
        data: response.rows
      })
    });
  });
});

router.get('/:id', (req,res,next) => {


  console.log(req.url)

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
    var QueryString = "SELECT *, count(*) over() as totalcount FROM aquafeq.aquafarm WHERE " + SearchType +" Ilike $1 " + SearchPlus + " ORDER BY armlimit,armid asc limit 10 offset (($2- 1)*10);"
  } else {
    var QueryString = "SELECT *, count(*) over() as totalcount FROM aquafeq.aquafarm WHERE " + SearchType +" Ilike $1 ORDER BY armlimit,armid asc limit 10 offset (($2- 1)*10);"

  }
  client.query(QueryString, ['%' + Search + '%', CurrentPage], (err, response) => {
    console.log(QueryString)
    console.log(Search)
    console.log(SearchType)
    console.log(CurrentPage)
    console.log(SearchPlus)
    console.log(Search2)
    console.log(Search22)

    if (err) {
      res.redirect('/aafarm');
      console.log(err)
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
    res.render('aafarm', {
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
