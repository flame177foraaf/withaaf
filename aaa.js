var Allcustom = "물 속성 추가 데미지 변화 ( 5 % ~ 16 % )<br /> 경험치 획득률 변화 ( 0 % ~ 10 % ) <br />물의 결정 추출 기능 ( 8 ~ 25 )<br />스타라이터 : 페트라 ( 15 ~ 25 )<br />인보크 프리즈 니들 ( 15 ~ 35 )<br />파이어 어벤져 ( 4 % ~ 13 % )";
//console.log(Allcustom);
var Allcustom = ""
var eqcustom = Allcustom.split('<br />');
var result_custom = 'null';

function Dice_roll(min, max){   //주사위 굴리기
  var diceroll = max - min + 1;
  return Math.floor(Math.random() * diceroll + min);
}

// 커스텀 재조립


console.log(result_custom)
