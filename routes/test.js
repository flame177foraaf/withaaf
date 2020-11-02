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
  var QueryString = "select armid, armname from aquafeq.aquafarm ORDER BY armlimit,armid asc ;"
  client.query(QueryString, (err, response) => {
    console.log(response.rows[0])
    if (err) {
      res.redirect('/test');
    } else {
      res.render('test', {
        title:'AAF 장비',
        data:response.rows
      });
    };
  });});

router.get('/addarm', (req,res,next) => {
  res.render ('addarm', {
    title:'AAF 악세사리 등록'
  });

});

router.post('/', (req, res, next) => {
  var armgrade = req.body.armgrade;
    if (armgrade !== '') {
      armgrade = armgrade.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }

  var armname = req.body.armname;
  var armlimit = req.body.armlimit;
    if (armlimit == '') {
        armlimit = null
    }
  var armsocket = req.body.armsocket;
  var armether = req.body.armether;
  var armstats = req.body.armstats;
    if (armstats !== '') {
      armstats = armstats.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var armproperty = req.body.armproperty;
    if (armproperty !== '') {
      armproperty = armproperty.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var armfeat = req.body.armfeat;
    if (armfeat !== '') {
      armfeat = armfeat.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var armcustom = req.body.armcustom;
    if (armcustom !== ''){
      armcustom = armcustom.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var armup = req.body.armup;
    if (armup !== '') {
      armup = armup.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var QueryString = "INSERT INTO aquafeq.aquafarm(armgrade, armname, armlimit, armsocket, armether, armstats, armproperty, armfeat, armcustom, armup) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);"
  client.query(QueryString, [armgrade, armname, armlimit, armsocket, armether, armstats, armproperty, armfeat, armcustom, armup], (err, response) => {
    var QueryString = "select armid, armname from aquafeq.aquafarm where armname = armname ORDER BY armlimit,armid asc ;"
    client.query(QueryString, (err, response) => {
      res.render('test', {
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

  var armgrade = req.body.armgrade;
    if (armgrade == '') {
      armgrade = null
    } else if (armgrade !== '') {
      armgrade = armgrade.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var armname = req.body.armname;
  var armlimit = req.body.armlimit;
    if (armlimit == '') {
      armlimit = null
    }
  var armsocket = req.body.armsocket;
    if (armsocket == '') {
      armsocket = null
    }
  var armether = req.body.armether;
    if (armether == '') {
      armether = null
    }
  var armstats = req.body.armstats;
    if (armstats == '') {
      armstats = null
    } else if (armstats !== '') {
      armstats = armstats.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }

  var armproperty = req.body.armproperty;
    if (armproperty == '') {
      armproperty = null
    } else if (armproperty !== '') {
      armproperty = armproperty.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var armfeat = req.body.armfeat;
    if (armfeat == '') {
      armfeat = null
    } else if (armfeat !== '') {
      armfeat = armfeat.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var armcustom = req.body.armcustom;
    if (armcustom == '') {
      armcustom = null
    } else if (armcustom !== ''){
      armcustom = armcustom.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var armup = req.body.armup;
    if (armup == '') {
      armup = null
    } else if (armup !== '') {
      armup = armup.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }


  var QueryString = "UPDATE aquafeq.aquafarm SET (armgrade, armlimit, armsocket, armether, armstats, armproperty, armfeat, armcustom, armup, armname) = ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)  WHERE armid = $11 returning *"
  client.query(QueryString, [armgrade, armlimit, armsocket, armether, armstats, armproperty, armfeat, armcustom, armup, armname, Eqid], (err, response) => {

    var QueryString = "select * from aquafeq.aquafarm where armname = $1"
    client.query ( QueryString, [armname],  (err, response) => {
      console.log(response.rows[0])
      res.render('test', {
        title : armname + ' 변경 완료',
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
    var QueryString = "SELECT *, count(*) over() as totalcount FROM aquafeq.aquafarm WHERE " + SearchType +" Ilike $1 " + SearchPlus + " ORDER BY armlimit,armid asc limit 10 offset (($2- 1)*10);"
  } else {
    var QueryString = "SELECT *, count(*) over() as totalcount FROM aquafeq.aquafarm WHERE "+ SearchType +" Ilike $1 ORDER BY armlimit,armid asc limit 10 offset (($2- 1)*10);"

  }
  client.query(QueryString, ['%' + Search + '%', CurrentPage], (err, response) => {
    console.log(Search)
    console.log(SearchType)
    console.log(CurrentPage)
    console.log(SearchPlus)
    console.log(Search2)
    console.log(Search22)

    if (err) {
      res.redirect('/test');
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
    res.render('test', {
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
