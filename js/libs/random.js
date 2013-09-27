//Рандом генератор
//@Seed
Math.seed = 50;
Math.startSeed = 50;

Math.live = {
};
Math.liveCycle = 0;
Math.liveMax = 0;

Math.liveReset = function(){
    Math.liveMax = Math.liveCycle;
    Math.liveCycle = 0;
}

//@Генартор рандома с сидом и макс-мин
Math.sRandom = function (max, min) {
    max = max || 1;
    min = min || 0;
    var div = 233280;
    Math.liveCycle++;
    Math.seed = (Math.seed * 9301 + 49297 ) % div;
    var range = max-min;
    var rnd = Math.seed / div;
    if( !Math.live[ Math.liveCycle ] ){
      return min + rnd * range;
    }
    return min + range * (1 +  Math.sin( rnd * Math.PI + Date.now() *  Math.live[ Math.liveCycle ])) /2;
}
