'use strict';
var ATUtil = require('atutil');

var weatherMapping = {
    mapWeatherCode: function(code, temp) {
        var lightness;
        var tempMax = 35;
        var tempMin = 0;
        var tempDelta = 50;
        temp = Math.floor(temp);
        temp = Math.floor(ATUtil.clamp(temp, tempMin, tempMax));
        temp = Math.floor(ATUtil.map(temp, tempMin, tempMax, 345, 0));
        var ColorA = temp;
        var ColorB = ATUtil.randomInt(0, 360);
        lightness = ATUtil.randomInt(40, 100);
        ColorB = "hsl(" + ColorB + ", 100%, " + lightness + "%)";
        switch (code) {
            //Thunderstorm
            //light rain
            case 200:
                lightness = ATUtil.randomInt(60, 80);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //rain
            case 201:
                lightness = ATUtil.randomInt(50, 70);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //heavy rain 
            case 202:
                lightness = ATUtil.randomInt(40, 60);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //light thunderstorm
            case 210:
                lightness = ATUtil.randomInt(40, 55);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //thunderstorm
            case 211:
                lightness = ATUtil.randomInt(40, 50);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //heavy thunderstorm
            case 212:
                lightness = ATUtil.randomInt(35, 50);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //ragged thunderstorm 
            case 221:
                lightness = ATUtil.randomInt(35, 50);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //light drizzle
            case 230:
                lightness = ATUtil.randomInt(60, 80);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //drizzle 
            case 231:
                lightness = ATUtil.randomInt(50, 70);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //heavy drizzle 
            case 232:
                lightness = ATUtil.randomInt(40, 60);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;

            //Drizzle
            //light intensity drizzle 
            case 300:
                lightness = ATUtil.randomInt(60, 80);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            // drizzle 
            case 301:
                lightness = ATUtil.randomInt(60, 70);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //  heavy intensity drizzle 
            case 302:
                lightness = ATUtil.randomInt(50, 70);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            // light intensity drizzle rain 
            case 310:
                lightness = ATUtil.randomInt(60, 90);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //  drizzle rain 
            case 311:
                lightness = ATUtil.randomInt(40, 70);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            // heavy intensity drizzle rain 
            case 312:
                lightness = ATUtil.randomInt(40, 60);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //  shower rain and drizzle 
            case 313:
                lightness = ATUtil.randomInt(40, 55);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //  heavy shower rain and drizzle 
            case 314:
                lightness = ATUtil.randomInt(40, 50);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            // shower drizzle 
            case 321:
                lightness = ATUtil.randomInt(40, 50);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;

            //RAIN
            //  light rain  
            case 500:
                lightness = ATUtil.randomInt(60, 90);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //  moderate rain  
            case 501:
                lightness = ATUtil.randomInt(50, 80);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //  heavy intensity rain  
            case 502:
                lightness = ATUtil.randomInt(40, 60);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //  very heavy rain  
            case 503:
                lightness = ATUtil.randomInt(40, 50);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //  extreme rain  
            case 504:
                lightness = ATUtil.randomInt(40, 50);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //  freezing rain  
            case 511:
                lightness = ATUtil.randomInt(40, 50);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //  light intensity shower rain  
            case 520:
                lightness = ATUtil.randomInt(50, 60);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //  shower rain  
            case 521:
                lightness = ATUtil.randomInt(40, 50);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //  heavy intensity shower rain  
            case 522:
                lightness = ATUtil.randomInt(40, 50);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //  ragged shower rain  
            case 531:
                lightness = ATUtil.randomInt(40, 60);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;

            //SNOW
            //  light snow  
            case 600:
                lightness = ATUtil.randomInt(80, 95);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //  snow  
            case 601:
                lightness = ATUtil.randomInt(70, 95);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //  heavy snow  
            case 602:
                lightness = ATUtil.randomInt(80, 100);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //  sleet  
            case 611:
                lightness = ATUtil.randomInt(80, 100);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //  shower sleet  
            case 612:
                lightness = ATUtil.randomInt(80, 100);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //  light rain and snow  
            case 615:
                lightness = ATUtil.randomInt(60, 80);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //  rain and snow  
            case 616:
                lightness = ATUtil.randomInt(50, 80);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //  light shower snow  
            case 620:
                lightness = ATUtil.randomInt(60, 80);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //  shower snow  
            case 621:
                lightness = ATUtil.randomInt(50, 80);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //  heavy shower snow  
            case 622:
                lightness = ATUtil.randomInt(60, 80);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;

            //ATMOSPHERE
            //  mist  
            case 701:
                lightness = ATUtil.randomInt(40, 100);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //  smoke  
            case 711:
                lightness = ATUtil.randomInt(40, 70);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //  haze  
            case 721:
                lightness = ATUtil.randomInt(70, 100);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //  sand, dust whirls  
            case 731:
                lightness = ATUtil.randomInt(80, 100);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //  fog  
            case 741:
                lightness = ATUtil.randomInt(85, 100);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //  sand  
            case 751:
                lightness = ATUtil.randomInt(90, 100);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //  dust  
            case 761:
                lightness = ATUtil.randomInt(80, 100);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //  volcanic ash  
            case 762:
                lightness = ATUtil.randomInt(40, 50);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //  squalls  
            case 771:
                lightness = ATUtil.randomInt(40, 100);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //  tornado  
            case 781:
                lightness = ATUtil.randomInt(40, 60);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;

            // CLEAR
            //  clear sky  
            case 800:
                lightness = ATUtil.randomInt(60, 100);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;

            // CLOUDS
            //  few clouds  
            case 801:
                lightness = ATUtil.randomInt(50, 90);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //  scattered clouds 
            case 802:
                lightness = ATUtil.randomInt(50, 80);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            // broken clouds 
            case 803:
                lightness = ATUtil.randomInt(40, 70);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //  overcast clouds 
            case 804:
                lightness = ATUtil.randomInt(40, 60);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;

            // EXTREME
            //  tornado  
            case 900:
                lightness = ATUtil.randomInt(40, 60);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //  tropical storm  
            case 901:
                lightness = ATUtil.randomInt(40, 60);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //  hurricane  
            case 902:
                lightness = ATUtil.randomInt(40, 65);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //  cold  
            case 903:
                lightness = ATUtil.randomInt(40, 100);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //  hot  
            case 904:
                lightness = ATUtil.randomInt(70, 100);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //  windy  
            case 905:
                lightness = ATUtil.randomInt(40, 100);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //  hail  
            case 906:
                lightness = ATUtil.randomInt(40, 100);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;

            //ADDITIONAL
            //   calm   
            case 951:
                lightness = ATUtil.randomInt(40, 80);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //   light breeze   
            case 952:
                lightness = ATUtil.randomInt(40, 80);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //   gentle breeze   
            case 953:
                lightness = ATUtil.randomInt(40, 80);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //   moderate breeze   
            case 954:
                lightness = ATUtil.randomInt(40, 80);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //   fresh breeze   
            case 955:
                lightness = ATUtil.randomInt(40, 80);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //   strong breeze   
            case 956:
                lightness = ATUtil.randomInt(40, 80);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //   high wind, near gale   
            case 957:
                lightness = ATUtil.randomInt(40, 80);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //   gale   
            case 958:
                lightness = ATUtil.randomInt(40, 80);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //   severe gale   
            case 959:
                lightness = ATUtil.randomInt(40, 80);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //   storm   
            case 960:
                lightness = ATUtil.randomInt(40, 60);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //   violent storm   
            case 961:
                lightness = ATUtil.randomInt(40, 50);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
            //   hurricane   
            case 962:
                lightness = ATUtil.randomInt(40, 60);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;

            default:
                lightness = ATUtil.randomInt(40, 100);
                ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
            break;
        }
        return {
            colorA: ColorA,
            colorB: ColorB
        }
    }
};