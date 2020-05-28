

var Allproperty = "(3600/3500/0/0/5000/-3000)";

var Special = 'checked';
var Reinforce = 'checked';
    function Dice_roll(min, max){   //주사위 굴리기
      var diceroll = max - min + 1;
      return Math.floor(Math.random() * diceroll + min);
    }

    //console.log(response.rows[0].acccustom);
    //console.log(response.rows[0])

    //속방 재조립
    var result_property = 'null'

    var cut1_property = Allproperty.indexOf("(")
    var cut2_property = Allproperty.indexOf(")")
    var cut_property = Allproperty.substring(cut1_property+1,cut2_property)
    var cuts_property = cut_property.split("/")


    for (var i = 0; i < cuts_property.length; i++) {
      if (Special === "checked") {
        var random = Dice_roll(-20,40)
      } else {
        var random = Dice_roll(-30,30)
      }

      if (parseInt(cuts_property[i]) == 0) {
        var eachproperty = 0;
        if (result_property === 'null') {
          var result_property = eachproperty
        } else {
          var result_property = result_property + " / " + eachproperty
        }
      } else if (parseInt(cuts_property[i]) > 0 ) {
        //속방 수치가 0 이상일때
        if (Reinforce == "checked") {
          var Reinforce1 = 1.8435;
        } else {
          var Reinforce1 = 1;
        }
        if (random == 0) {
          var eachproperty = parseInt(cuts_property[i]);
          if (result_property === 'null') {
            var result_property = eachproperty + " ( " + random +" % "+ ")"
          } else {
            var result_property = result_property + " / " + eachproperty + " ( " + random +" % "+ ")"
          }
        } else if ( random > 0 ){
          var ranproperty = (100 + random )/100
          var eachproperty = Math.round(parseInt(cuts_property[i])*Reinforce1*ranproperty)
          console.log(eachproperty)
          if (result_property === 'null') {
            var result_property = eachproperty + " ( " + random +" % "+ ")"
          } else {
            var result_property = result_property + " / " + eachproperty + " ( " + random +" % "+ ")"
          }
        } else {

          var ranproperty = (100 + random )/100
          var eachproperty = Math.round(parseInt(cuts_property[i])*Reinforce1*ranproperty)
          if (result_property === 'null') {
            var result_property = eachproperty + " ( " + random +" % "+ ")"
          } else {
            var result_property = result_property + " / " + eachproperty + " ( " + random +" % "+ ")"
          }
        }

      } else if (parseInt(cuts_property[i]) < 0 ){
        if (Reinforce == "checked") {
          var Reinforce1 = Math.pow(1.07,5);
        } else {
          var Reinforce1 = 1;
        }

        if (random == 0) {
          var eachproperty = parseInt(cuts_property[i]);
          if (result_property === 'null') {
            var result_property = eachproperty + " ( " + random +" % "+ ")"
          } else {
            var result_property = result_property + " / " + eachproperty + " ( " + random +" % "+ ")"
          }
        } else if ( random > 0 ){
          var ranproperty = (100 + random )/100
          var eachproperty = Math.round(parseInt(cuts_property[i])*Reinforce1*ranproperty)
          if (result_property === 'null') {
            var result_property = eachproperty + " ( " + random +" % "+ ")"
          } else {
            var result_property = result_property + " / " + eachproperty + " ( " + random +" % "+ ")"
          }
        } else {
          var ranproperty = (100 + random )/100
          var eachproperty = Math.round(parseInt(cuts_property[i])*Reinforce1*ranproperty)
          if (result_property === 'null') {
            var result_property = eachproperty + " ( " + random +" % "+ ")"
          } else {
            var result_property = result_property + " / " + eachproperty + " ( " + random +" % "+ ")"
          }
        }
      }
    }

console.log(result_property)
