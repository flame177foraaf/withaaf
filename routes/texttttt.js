var testtext = "무의 결정 추출 기능 ( 3 ~ 9 ) [100% 확률]<br>절대 명중 기능 ( 3 % ~ 10 % ) [80% 확률]<br>무기 레벨업 필요 경험치 변화 ( 5 % ~ 10 % ) [100% 확률]<br>루엘 파편 획득 확률 변화 ( 5 ~ 15 ) [100% 확률]<br>실드 HP 추가 ( 3 % ~ 6 % ) [60% 확률]<br>페이즈 변화 ( 0 ~ 2 ) [20% 확률]";
// split()은 지정한 문자를 기준으로 문자열을 잘라 배열로 반환한다.

var test = testtext.split( '<br>');

for (var i = 0; i < test.length; i++) {
  var find_cus_val1 = test[i].indexOf("(");
  var find_cus_val2 = test[i].indexOf(")");
  var find_cus_per1 = test[i].indexOf("[");
  var find_cus_per2 = test[i].indexOf("]");
  var cut_cus_name = test[i].substring(0,find_cus_val1);
  var cut_cus_value = test[i].substring(find_cus_val1+1,find_cus_val2); //커스텀 수치


  //var random_num = Math.floor(Math.random() * 10 + 1);
  var leng = test[i].length;


  var cus_per = test[i].substring(find_cus_per1+1,find_cus_per2); // 대괄호
  var cus_per_0 = cus_per.indexOf("%");
  var cus_per_1 = cus_per.substring(0,cus_per_0);  // 커스텀 뜰 확률
  var cus_per_2 = Math.floor(Math.random() * (100 - 0 +1)) + 1

  if (cus_per_2 <= parseInt(cus_per_1)) {
    var cut_in_custom = cut_cus_value.indexOf("~");
    var find_per_custom = cut_cus_value.indexOf("%");
    var custommin = cut_cus_value.substring(0,cut_in_custom); //커스텀 수치 최소  3 %
    var custommax = cut_cus_value.substring(cut_in_custom+1); //커스텀 수치 최대    20 %
    if (find_per_custom !== -1) {
      var find_per_cusmin = custommin.indexOf("%");
      var find_per_cusmax = custommax.indexOf("%");
      var custommin = custommin.substring(0,find_per_cusmin);
      var custommax = custommax.substring(0, find_per_cusmax);
      function selectFrom(x, y){
        var choices = y - x + 1;
        return Math.floor(Math.random() * choices + x);
      }
      var rancustom = selectFrom(parseInt(custommax), parseInt(custommin));

      if (rancustom !== 0) {
        var rancustom = rancustom + ' %';
      }
    } else {
      function selectFrom(x, y) {
        var choices = y - x + 1;
        return Math.floor(Math.random() * choices + x);
      }
      var rancustom = selectFrom(parseInt(custommax), parseInt(custommin));
    }
    if (rancustom !== 0) {
      console.log(cut_cus_name + rancustom);
    }
  }
}



// var xxx = Math.floor(Math.random() * (parseInt(custommax) - parseInt(custommin) +1)) + parseInt(custommin);



//var cut_cus_value = testtext.subsubstring(find_cus_val1+1,leng);

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

console.log(test);
console.log("커스텀 수 " + test.length)
console.log(cut_cus_name);
console.log(cut_cus_value);
console.log(cut_cus_value);
console.log(cus_per);
console.log("ㅋ스텀 뜰 확률 수치 " + cus_per_1)
console.log("ㅋ스텀 뜰 확률 수치 주사위굴리기" + cus_per_2)

console.log("소괄호 인덱스" + find_cus_val1);
console.log("대괄호 인덱스" + find_cus_per1);
console.log("문자 길이" + leng);
console.log("커스텀 수치" + cut_cus_value);

console.log("커스텀 수치 최소치" + custommin);
console.log("커스텀 수치 최대치" + custommax);

console.log("커스텀 확률" + cus_per);
console.log(cus_per_1);