var text = "받는 아스트랄 속성 추가 데미지 변화 ( 5 % ~ 15 % ) [100% 확률]<br />수집품 취득 확률 변화(웨이블렘) ( 5 ~ 15 ) [70% 확률]<br />중간 재생 기능 ( 3 % ~ 9 % ) [80% 확률]<br />아스트랄의 결정 추출 기능(웨이블렘) ( 5 ~ 15 ) [50% 확률]";
// split()은 지정한 문자를 기준으로 문자열을 잘라 배열로 반환한다.
var text = "스태미너 피해 변화 ( -3 ~ 0 ) [100% 확률]<br />강한 흡혈 기능 ( 5 % ~ 12 % ) [100% 확률]<br />추가타 발동 확률 변화 ( 2 % ~ 7 % ) [100% 확률]<br />페이즈 변화 ( -2 ~ 0 ) [70% 확률]<br />스타라이 터 : 제이거 ( 2 ~ 40 ) [45% 확률]"
var eqcustom = text.split('<br />');
var result_custom = 'null';

for (var i = 0; i < eqcustom.length; i++) {
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
    var cus_per_2 = Math.floor(Math.random() * (100 - 0 +1)) + 1
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
        function selectFrom(min, max) {
          var choices = max - min + 1;
          return Math.floor(Math.random() * choices + min);
        }
        var rancustom = selectFrom(parseInt(custommin), parseInt(custommax));
        if (rancustom !== 0) {
          var rancustom = rancustom + ' %';
        }
      } else {
        function selectFrom(min, max) {
          var choices = max - min + 1;
          return Math.floor(Math.random() * choices + min);
        }
        var rancustom = selectFrom(parseInt(custommin), parseInt(custommax));
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
    var cus_per_2 = Math.floor(Math.random() * (100 - 0 +1)) + 1

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
        function selectFrom(min, max) {
          var choices = max - min + 1;
          return Math.floor(Math.random() * choices + min);
        }
        var rancustom = selectFrom(parseInt(custommin), parseInt(custommax));

        if (rancustom !== 0) {
          var rancustom = rancustom + ' %';
        }
      } else {
        function selectFrom(min, max) {
          var choices = max - min + 1;
          return Math.floor(Math.random() * choices + min);
        }
        var rancustom = selectFrom(parseInt(custommin), parseInt(custommax));
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
console.log(result_custom);



// var xxx = Math.floor(Math.random() * (parseInt(custommax) - parseInt(custommin) +1)) + parseInt(custommin);



//var cut_cus_value = text.subsubstring(find_cus_val1+1,leng);

//charAt  = 입력받은 index 번째 문자 반환;
//indexof  = 해당 문자의 위치 . 없으면 -1
//lastindexof = 해당문자의 위치 (오른쪾에서부터)
//length = 주어진 문자열의 길이


/* @를 기준으로 문자열을 추출할 것이다.

       String mail = "abced@naver.com";

       // 먼저 @ 의 인덱스를 찾는다 - 인덱스 값: 5
       int idx = mail.indexOf("@");

       // @ 앞부분을 추출
       // substring은 첫번째 지정한 인덱스는 포함하지 않는다.
       // 아래의 경우는 첫번째 문자열인 a 부터 추출된다.
       String mail1 = mail.substring(0, idx);

       // 뒷부분을 추출
       // 아래 substring은 @ 바로 뒷부분인 n부터 추출된다.
       String mail2 = mail.substring(idx+1);

       System.out.println("mail1 : "+mail1);
       System.out.println("mail2 : "+mail2);
*/

//math.floor 정수화
/*
console.log("커스텀 수 " + eqcustom.length)
console.log(cut_cus_name);
console.log(cut_cus_value);
console.log(cus_per);

console.log("커스텀 확률" + cus_per);
console.log("ㅋ스텀 뜰 확률 수치 " + cus_per_1)
console.log("ㅋ스텀 뜰 확률 수치 주사위굴리기" + cus_per_2)
console.log("커스텀 min" + parseInt(custommin))
console.log("소괄호 인덱스" + find_cus_val1);
console.log("대괄호 인덱스" + find_cus_per1);
console.log("문자 길이" + leng);
console.log("커스텀 수치" + cut_cus_value);

console.log("커스텀 수치 최소치" + custommin);
console.log("커스텀 수치 최대치" + custommax);
*/

function Dice_roll(min, max){
  var diceroll = max - min + 1;
  return Math.floor(Math.random() * diceroll + min);
}




var testsocket = "2~5"
//console.log("소켓" + testsocket.length)
//console.log("소켓 구분" + testsocket.indexOf("~"))

var minsocket = testsocket.substring(0,testsocket.indexOf("~"));
var maxsocket = testsocket.substring(testsocket.indexOf("~")+1,testsocket.length)
console.log("최소 소켓" + minsocket)
console.log("최대 소켓" +maxsocket)

//console.log(Dice_roll(parseInt(minsocket),parseInt(maxsocket)))
var socket = "";
var socketx = "";
var socket_roll = Dice_roll(parseInt(minsocket),parseInt(maxsocket)) //소켓 범위 내에서 굴리기

for (var i = 0; i < socket_roll; i++) {
  socket = socket + "○"
}   //최소소켓 맞추기
for (var j = parseInt(maxsocket)-socket_roll ; j > 0; j--) {
  socketx = socketx + "●"
}
console.log("소켓 주사위 굴리기" +socket_roll)
console.log(socket + socketx)

var result_socket =socket + socketx;



//스텟 재조립
var teststats = "+ 1670 / + 442"
// console.log(teststats.indexOf("/"))
var cut1_stats = teststats.substring(0,teststats.indexOf("/"))
var cut2_stats = teststats.substring(teststats.indexOf("/")+1)
console.log(cut1_stats)
console.log(cut2_stats)
var first_stat = cut1_stats.substring(cut1_stats.indexOf("+") +1)
var second_stat = cut2_stats.substring(cut2_stats.indexOf("+") +1)
console.log(first_stat)
console.log(second_stat)
console.log(parseInt(first_stat))

var Dice_roll_first_stat = parseInt(Dice_roll(-10,10))
console.log(Dice_roll_first_stat)
var Dice_roll_first_stat_per =  (100 + Dice_roll_first_stat  )/100
console.log(Dice_roll_first_stat_per)
var first_stat = parseInt(first_stat)*Dice_roll_first_stat_per
var first_stat = Math.floor(first_stat)  //소수점 버리기
if (Dice_roll_first_stat > 0) {
  var result_first_stats = first_stat + "(" +" + "+ Dice_roll_first_stat + " % " + ")";
}else {
  var result_first_stats =first_stat + " ( " + Dice_roll_first_stat + " % " + ") ";

}


var Dice_roll_second_stat = parseInt(Dice_roll(-10,10))
console.log(Dice_roll_second_stat)
var Dice_roll_second_stat_per =  (100 + Dice_roll_second_stat  )/100
console.log(Dice_roll_second_stat_per)
var second_stat = parseInt(second_stat)*Dice_roll_second_stat_per
var second_stat = Math.floor(second_stat) //소수점 버리기
if (Dice_roll_second_stat > 0) {
  var result_second_stats = second_stat + "(" +" + "+ Dice_roll_second_stat + " % " + ")";
}else {
  var result_second_stats =second_stat + " ( " + Dice_roll_second_stat + " % " + ") ";
}



console.log(result_first_stats +" / " +result_second_stats)
var result_stats= result_first_stats +" / " +result_second_stats;
var result = {
  result_socket: result_socket,
  result_custom: result_custom,
  result_stats:result_stats,
}
console.log('              var stat1 ="<td colspan="3" value="data.result_stats"  name="" id="" > data.result_stats </td>";'.substring(39))
console.log(result)
