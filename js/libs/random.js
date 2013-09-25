//Рандом генератор
//@Seed
Math.seed = 50;
//@Генартор рандома с сидом и макс-мин
Math.sRandom = function (max, min) {
    max = max || 1;
    min = min || 0;

    Math.seed = (Math.seed * 9301 + 49297) % 233280;
    var rnd = Math.seed / 233280;

    return min + rnd * (max - min);
};
