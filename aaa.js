var Allcustom = "절대 명중 기능 ( 3 % ~ 12 % ) [100% 확률] <br />무기 레벨업 필요 경험치 변화 ( 5 % ~ 15 % ) [100% 확률]<br />장착 가능 숙련도 변화 ( -2 ~ 0 ) [100% 확률]<br />받는 물리 데미지 변화 ( 5 % ~ 14 % ) [100% 확률]<br />2 회 공격 기능 ( 3 % ~ 5 % ) [90% 확률]<br />2 회 공격 기능 ( 3 % ~ 5 % ) [35% 확률]<br />2 회 공격 기능 ( 3 % ~ 5 % ) [12% 확률]<br />2 회 공격 기능 ( 3 % ~ 10 % ) [5% 확률]<br />크리티컬 데미지 변화 ( 5 % ~ 30 % ) [70% 확률]";
//console.log(Allcustom);
var eqcustom = Allcustom.split('<br />');
var result_custom = 'null';

var Allsocket = "0~2";

function Dice_roll(min, max){   //주사위 굴리기
  var diceroll = max - min + 1;
  return Math.floor(Math.random() * diceroll + min);
}

//var Special = "checked"
var Special = "checkesd"

var Reinforce = "checked"
var Reinforce = "checkessd"
// 커스텀 재조립
if (Allcustom === "") {
  var result_custom = "재조립할 커스텀이 없네요~_~";
} else {
  for (var i = 0; i < eqcustom.length; i++) {

    if (eqcustom[i].indexOf('[') === -1) {
      var result_custom = "커스텀이 적용될 확률이 얼마인지 모르겠어요." +"<br />"+"그래서 주사위를 못굴립니다. 호호."
    } else {
      if (eqcustom[i].indexOf("웨이블렘") == -1) {
        var find_cus_val1 = eqcustom[i].indexOf("(");
        var find_cus_val2 = eqcustom[i].indexOf(")");
        var find_cus_per1 = eqcustom[i].indexOf("[");
        var find_cus_per2 = eqcustom[i].indexOf("]");
        var cut_cus_name = eqcustom[i].substring(0,find_cus_val1);
        var cut_cus_value = eqcustom[i].substring(find_cus_val1+1,find_cus_val2); //커스텀 수치
        //var random_num = Math.floor(Math.random() * 10 + 1);
        var leng = eqcustom[i].length;
        var cus_per = eqcustom[i].substring(find_cus_per1+1,find_cus_per2); // 대괄호
        var cus_per_0 = cus_per.indexOf("%");
        var cus_per_1 = cus_per.substring(0,cus_per_0);  // 커스텀 뜰 확률
        var cus_per_1 = parseInt(cus_per_1)
        if (Special == "checked") {
          cus_per_1 = cus_per_1 + 30;
          if (cus_per_1 >= 100) {
            cus_per_1 = 100;
          }
        }
        console.log(cus_per_1)
        var cus_per_2 = Math.floor(Math.random() * 100) + 1
        if (cus_per_2 <= cus_per_1) {
          var cut_in_custom = cut_cus_value.indexOf("~");
          var find_per_custom = cut_cus_value.indexOf("%");
          var find_minus_custom = cut_cus_value.indexOf("-");
          var custommin = cut_cus_value.substring(0,cut_in_custom); //커스텀 수치 최소  3 %
          var custommax = cut_cus_value.substring(cut_in_custom+1); //커스텀 수치 최대    20 %
          if (find_per_custom !== -1) {
            var find_per_cusmin = custommin.indexOf("%");
            var find_per_cusmax = custommax.indexOf("%");
            var custommin = custommin.substring(0,find_per_cusmin);
            var custommax = custommax.substring(0, find_per_cusmax);

            var rancustom = Dice_roll(parseInt(custommin), parseInt(custommax));
            if (rancustom !== 0) {
              var rancustom = rancustom + ' %';
            }
          } else {

            var rancustom = Dice_roll(parseInt(custommin), parseInt(custommax));
          }
          if (rancustom !== 0) {
            if (find_minus_custom !== -1) {
              if (result_custom === 'null') {
                var result_custom = cut_cus_name + rancustom;
              } else {
                var result_custom = result_custom +"<br />" + cut_cus_name + rancustom;
              }
            } else {
              if (result_custom === 'null') {
                var result_custom = cut_cus_name +"+ "+ rancustom;
              } else {
                var result_custom = result_custom +"<br />" + cut_cus_name +"+ "+ rancustom;
              }
            }
          }
        }
      } else {
        var find_cus_val1 = eqcustom[i].indexOf("("); //웨이블렘 괄호
        var find_cus_val2 = eqcustom[i].indexOf(")"); //웨이블렘 괄호
        var find_cus_val1 = eqcustom[i].indexOf("(",find_cus_val1 +1);
        var find_cus_val2 = eqcustom[i].indexOf(")",find_cus_val2 +1);
        var find_cus_per1 = eqcustom[i].indexOf("[");
        var find_cus_per2 = eqcustom[i].indexOf("]");
        var cut_cus_name = eqcustom[i].substring(0,find_cus_val1);
        var cut_cus_value = eqcustom[i].substring(find_cus_val1+1,find_cus_val2); //커스텀 수치


        //var random_num = Math.floor(Math.random() * 10 + 1);
        var leng = eqcustom[i].length;


        var cus_per = eqcustom[i].substring(find_cus_per1+1,find_cus_per2); // 대괄호
        var cus_per_0 = cus_per.indexOf("%");
        var cus_per_1 = cus_per.substring(0,cus_per_0);  // 커스텀 뜰 확률
        var cus_per_2 = Math.floor(Math.random() * 100) + 1

        if (cus_per_2 <= cus_per_1) {
          var cut_in_custom = cut_cus_value.indexOf("~");
          var find_per_custom = cut_cus_value.indexOf("%");
          var find_minus_custom = cut_cus_value.indexOf("-");
          var custommin = cut_cus_value.substring(0,cut_in_custom); //커스텀 수치 최소  3 %
          var custommax = cut_cus_value.substring(cut_in_custom+1); //커스텀 수치 최대    20 %
          if (find_per_custom !== -1) {
            var find_per_cusmin = custommin.indexOf("%");
            var find_per_cusmax = custommax.indexOf("%");
            var custommin = custommin.substring(0,find_per_cusmin);
            var custommax = custommax.substring(0, find_per_cusmax);

            var rancustom = Dice_roll(parseInt(custommin), parseInt(custommax));

            if (rancustom !== 0) {
              var rancustom = rancustom + ' %';
            }
          } else {

            var rancustom = Dice_roll(parseInt(custommin), parseInt(custommax));
          }
          if (rancustom !== 0) {
            if (find_minus_custom !== -1) {
              if (result_custom === 'null') {
                var result_custom = cut_cus_name + rancustom;
              } else {
                var result_custom = result_custom +"<br />" + cut_cus_name + rancustom;
              }
            } else {
              if (result_custom === 'null') {
                var result_custom = cut_cus_name +"+ "+ rancustom;
              } else {
                var result_custom = result_custom +"<br />" + cut_cus_name +"+ "+ rancustom;
              }
            }
          }

        }
      }
    }
  }
}

//소켓 재조
var Allsocket = "1~5"
//console.log("소켓" + testsocket.length)
//console.log("소켓 구분" + testsocket.indexOf("~"))
if (Allsocket.indexOf("~") == -1) {
  var socket = "";

  for (var i = 0; i < Allsocket; i++) {
    socket = socket + "○"
  }
  var result_socket = socket ;

} else {
  var minsocket = Allsocket.substring(0,Allsocket.indexOf("~"));
  var maxsocket = Allsocket.substring(Allsocket.indexOf("~")+1,Allsocket.length)
  var socket = "";
  var socketx = "";
  var socket_roll = Dice_roll(parseInt(minsocket),parseInt(maxsocket)) //소켓 범위 내에서 굴리기

  for (var i = 0; i < socket_roll; i++) {
    socket = socket + "○"
  }
  for (var j = parseInt(maxsocket)-socket_roll ; j > 0; j--) {
    socketx = socketx + "●"
  }
  var result_socket = socket + socketx;
  //console.log("소켓 주사위 굴리기" +socket_roll)
  //console.log(socket + socketx)
}





// 스텟 재조립
var ALlstats = "+ 4404 / + 2845"
// console.log(ALlstats.indexOf("/"))
var cut1_stats = ALlstats.substring(0,ALlstats.indexOf("/"))
var cut2_stats = ALlstats.substring(ALlstats.indexOf("/")+1)
//console.log(cut1_stats)
//console.log(cut2_stats)
var first_stat = cut1_stats.substring(cut1_stats.indexOf("+") +1)
var second_stat = cut2_stats.substring(cut2_stats.indexOf("+") +1)
//console.log(first_stat)
//console.log(second_stat)
//console.log(parseInt(first_stat))

var Dice_roll_first_stat = parseInt(Dice_roll(-10,10))
if (Special == "checked") {
  Dice_roll_first_stat = parseInt(Dice_roll(-5,15))
}
//console.log(Dice_roll_first_stat)
var Dice_roll_first_stat_per =  (100 + Dice_roll_first_stat  )/100
//console.log(Dice_roll_first_stat_per)
var first_stat = parseInt(first_stat)*Dice_roll_first_stat_per
console.log(first_stat)
if (Reinforce == "checked") {
  var first_stat = first_stat*1.61
}
console.log(first_stat)
//var first_stat = Math.floor(first_stat)  //소수점 버리기
var first_stat = Math.round(first_stat)  //소수점 반올림

if (Dice_roll_first_stat > 0) {
  var result_first_stats = first_stat + "(" +" + "+ Dice_roll_first_stat + " % " + ")";
}else {
  var result_first_stats =first_stat + " ( " + Dice_roll_first_stat + " % " + ") ";

}console.log(first_stat)


var Dice_roll_second_stat = parseInt(Dice_roll(-10,10))
//console.log(Dice_roll_second_stat)
if (Special == "checked") {
  Dice_roll_second_stat = parseInt(Dice_roll(-5,15))
}
var Dice_roll_second_stat_per =  (100 + Dice_roll_second_stat  )/100
//console.log(Dice_roll_second_stat_per)
if (Reinforce == "checked") {
  var second_stat = parseInt(second_stat)*1.61
}
var second_stat = parseInt(second_stat)*Dice_roll_second_stat_per

//var second_stat = Math.floor(second_stat) //소수점 버리기

var second_stat = Math.round(second_stat) //소수점 반올림

if (Dice_roll_second_stat > 0) {
  var result_second_stats = second_stat + "(" +" + "+ Dice_roll_second_stat + " % " + ")";
} else {
  var result_second_stats =second_stat + " ( " + Dice_roll_second_stat + " % " + ") ";
}
var result_stats = result_first_stats +" / " +result_second_stats;


console.log(result_stats)
