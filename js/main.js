//-----
//Предупреждаю, в коде много рандома, цель которого
//создать больше вариантов котов. Мяу!
//-----
$(document).ready(function() {
	//Инициализируем переменные
	Graphics.init();
	//Генерируем случайного кота
	generateCat();
	//Вешаем на кнопку событие
	$("#generate").bind("click", function(){	
		generateCat();	
	});
});
//Функция генерации случайного кота
function generateCat()
{
	Math.seed = Math.random();
	//Чистим сцену
	Graphics.clear();
	//--Генерим круг
	var radius = Math.sRandom(60, 70);
	//Изменяем размеры
	var scaleCircle = {x:Math.sRandom(1,1.1),y:Math.sRandom(0.9,1.0)};
	//Задаем цвета
	var whiteColor = "#fff";
	var blackColor = "#000";
	//Рисуем
	add(function(ctx){
		drawСircle(ctx, {x:0,y:0}, radius, whiteColor, (Math.sRandom(0, 100) < 95 ? blackColor : whiteColor), Math.sRandom(2,5));

	}, scaleCircle);

	//---Уши
	//Вектор, который будем поворачивать, в поисках точек ушей
	var dir = {x:0, y:radius};
	//Первый угол
    var angleOne = Math.PI + Math.PI/Math.sRandom(2, 5);
    //Поворачиваем вектор и получаем первую точку
    var pointR1 = VectorRot(dir, angleOne);
    //Делаем вторую точку, через поворт вектора на первый угол минус отклонение
    var pointR2 = VectorRot(dir, angleOne - Math.PI/Math.sRandom(4, 7));
    //Считаем верхнюю точку уха
    var topPointR = {x:((pointR1.x + pointR2.x) / 2)+Math.sRandom(-10, 10), y:pointR2.y - 30 + Math.sRandom(0, 5)};
    //Рисуем
	add(function(ctx){
		//Рисуем правое ухо
	    ctx.beginPath();
        ctx.strokeStyle = blackColor;
        ctx.fillStyle = whiteColor;
        ctx.lineWidth = Math.sRandom(2, 4);
        topPointR = {x:topPointR.x+Math.sRandom(-1,5), y:topPointR.y+Math.sRandom(-5,5)};
		ctx.moveTo(center.x + pointR1.x,center.y + pointR1.y);
		ctx.lineTo(center.x + topPointR.x,center.y + topPointR.y);
		ctx.lineTo(center.x + pointR2.x,center.y +pointR2.y);
		ctx.fill();
		ctx.stroke();
		//Рисуем левое ухо
    	ctx.beginPath();
        ctx.strokeStyle = blackColor;
        ctx.fillStyle = whiteColor;
        ctx.lineWidth = Math.sRandom(2, 4);
        var topPointL = VectorXInvert({x:topPointR.x+Math.sRandom(-5,5), y:topPointR.y+Math.sRandom(-5,5)});
        var pointL1 = VectorXInvert(pointR1);
        var pointL2 = VectorXInvert(pointR2);
		ctx.moveTo(center.x + pointL1.x,center.y + pointL1.y);
		ctx.lineTo(center.x + topPointL.x,center.y + topPointL.y);
		ctx.lineTo(center.x + pointL2.x,center.y +pointL2.y);
		ctx.fill();
		ctx.stroke();


	}, {x:1,y:1});

	//---Усы
	//Расчитываем точки начала усов
	//путем выбора вектора, и поворота вектора на почти случайное значение
	//Результат - точка начала уса
	var pointsR = [];
	//Выбираем число усов
	var count = Math.floor(Math.sRandom(3, 5));
	for (var i = 0; i < count; i++) {
		//Делаем вектор, с длиной из радиуса круга / на случайное значение
		var dir = {x:0, y:radius/Math.sRandom(1.6,1.9)};
		//Выбираем угол, плюс некоторые действия, для красоты
		var angleOne = Math.PI/(2 + ((i+1)/4));
		//Пвоворачиваем вектор
		var pointR1 = VectorRot(dir, angleOne);
		//Выбираем y конечной точки, так чтобы первую половину count усы отлонялись в одну сторону
		//а во второй половине в другую
		var y = pointR1.y+(i < count / 2 ? -Math.sRandom(8, 25) : Math.sRandom(7, 15) );
		//Записываем точки начала и конца в массив
		pointsR.push({begin:pointR1, end:{x:pointR1.x - Math.sRandom(60, 100),y:y}});
	}
	//Случайное значение ширины линии
	var lineWidth = Math.sRandom(0.5, 2);
	//Рисуем
	add(function(ctx){
		//Правая сторона
		for (var i = 0; i < pointsR.length; i++) {
			ctx.beginPath();
	        ctx.strokeStyle = blackColor;
	        ctx.fillStyle = whiteColor;
	        ctx.lineWidth = lineWidth;
			ctx.moveTo(center.x - pointsR[i].begin.x,center.y + pointsR[i].begin.y);
			ctx.lineTo(center.x - pointsR[i].end.x,center.y + pointsR[i].end.y);
			ctx.stroke();
		}
		//Левая сторона
	    for (var i = 0; i < pointsR.length; i++) {
			
			ctx.beginPath();
	        ctx.strokeStyle = blackColor;
	        ctx.fillStyle = whiteColor;
	        ctx.lineWidth = lineWidth;
	        var pointLBegin = VectorXInvert(pointsR[i].begin);
	        var pointLEnd = VectorXInvert(pointsR[i].end);
			ctx.moveTo(center.x - pointLBegin.x,center.y + pointLBegin.y);
			ctx.lineTo(center.x - pointLEnd.x,center.y + pointLEnd.y);
			ctx.stroke();
		}

	}, {x:1,y:1});

	//---Рот
	//Рот строем с помощью кривых Безье. Задаем четыре точки + 2 точки для отражения
	//      P0
	//  P3  |   iP3
	//  |   |    |
	//  P2--P1--iP2
	var P0 = {x:center.x, y:center.y};
	var P1 = {x:center.x, y:center.y + Math.sRandom(40, 65)};
	var P2 = {x:center.x - Math.sRandom(29, 36),y: center.y + 40};
	var P3 = {x:center.x - Math.sRandom(20, 40), y:center.y + Math.sRandom(23, 28)};
	var iP2 = {x:center.x + Math.sRandom(29, 36),y: center.y + 40};
	var iP3 = {x:center.x + Math.sRandom(20, 40), y:center.y + Math.sRandom(23, 28)};
	//Рисуем
	add(function(ctx){
	    ctx.beginPath();
        ctx.strokeStyle = blackColor;
        ctx.fillStyle = whiteColor ;
        ctx.lineWidth = Math.sRandom(1,3);
		ctx.moveTo(P0.x,P0.y );
		ctx.bezierCurveTo(P1.x, P1.y, P2.x, P2.y, P3.x, P3.y);
		ctx.stroke();

	    ctx.beginPath();
        ctx.strokeStyle = blackColor;
        ctx.fillStyle = whiteColor ;
        ctx.lineWidth = Math.sRandom(1,3);
		ctx.moveTo(P0.x,P0.y );
		
		ctx.bezierCurveTo(P1.x, P1.y, iP2.x, iP2.y, iP3.x, iP3.y);
		ctx.stroke();


	}, {x:1,y:1});

	//---Нос
	//Два типа носа - либо треугольник, либо круг
	var chance = Math.sRandom(0, 100);
	if(chance < 98)
	{
		//Коефициент размера
		var scale = {x:Math.sRandom(0.9,1.3), y:Math.sRandom(0.9,1.3)};
		//Правая точка
		var pointR ={x:Math.sRandom(4,5)*scale.x,y:Math.sRandom(-5,-4)*scale.y};
		//Левая точка
		var pointL ={x:Math.sRandom(-4,-5)*scale.x,y:Math.sRandom(-5,-4)*scale.y};
		//Нижняя точка
		var bottomPoint ={x:0,y:Math.sRandom(5,6)*scale.y};
		//Рисуем
		add(function(ctx){
		    ctx.beginPath();
	        ctx.strokeStyle = blackColor;
	        ctx.fillStyle = (Math.sRandom(0, 100) > 50 ? whiteColor : blackColor);
	        ctx.lineWidth = Math.sRandom(1,3);
			ctx.moveTo(center.x + pointR.x,center.y + 5 + pointR.y);
			ctx.lineTo(center.x + bottomPoint.x,center.y + 5 + bottomPoint.y);
			ctx.lineTo(center.x + pointL.x,center.y + 5 + pointL.y);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();

		}, {x:1,y:1});
	}
	else
	{
		//Рисуем кот
		add(function(ctx){
			drawСircle(ctx, {x:0,y:0}, Math.sRandom(7, 10), blackColor, blackColor, 1);
		}, {x:1,y:1});
	}
	//--Глаза
	//Глаза представляют собой две кривых безье, построенных сверху и снизу, очень похоже на рот
	//Модфикикатор размера глаз
	var scaleEye = Math.sRandom(0.7, 1.4);
	//Точки
	var P0 = {x:20*scaleEye, y:20*scaleEye};
	var P1 = {x:20*scaleEye, y:- Math.sRandom(25, 30)*scaleEye};
	var P2 = {x:+ Math.sRandom(30, 35)*scaleEye,y: - Math.sRandom(25, 30)*scaleEye};
	var P3 = {x:+ Math.sRandom(30, 35)*scaleEye,y: - 20*scaleEye};
	var bP1 = {x:20*scaleEye, y:- Math.sRandom(15, 20)*scaleEye};
	var bP2 = {x:+ Math.sRandom(30, 35)*scaleEye,y: - Math.sRandom(15, 20)*scaleEye};
	//Шанс на закрытый первый глаз
	var chanceCloseFirstEye = Math.sRandom(0, 100);
	//Шанс на закрытый второй глаз
	var chanceCloseSecondEye = Math.sRandom(0, 100);
	//Рисуем
	add(function(ctx){
		
	    ctx.beginPath();
        ctx.strokeStyle = blackColor;
        ctx.fillStyle = whiteColor;
        ctx.lineWidth = Math.sRandom(3,5);;
        //Если меньше 70 - то рисуем глаз, если нет - глаз закрыт. Дальше аналогично
        if(chanceCloseFirstEye < 70)
        {
        	ctx.moveTo(center.x + P0.x, center.y - P0.y );
			ctx.bezierCurveTo(center.x + P1.x, center.y + P1.y, center.x + P2.x, center.y + P2.y, center.x + P3.x,center.y +  P3.y);
		}
		ctx.moveTo(center.x + P0.x, center.y - P0.y );
		ctx.bezierCurveTo(center.x + bP1.x, center.y + bP1.y, center.x + bP2.x, center.y + bP2.y, center.x + P3.x, center.y + P3.y);
		ctx.stroke();
		ctx.fill();

	    ctx.beginPath();
        ctx.strokeStyle = blackColor;
        ctx.fillStyle = whiteColor;
        ctx.lineWidth = Math.sRandom(3,5);
	    if(chanceCloseSecondEye < 70)
        {
			ctx.moveTo(center.x - P0.x, center.y - P0.y );
			ctx.bezierCurveTo(center.x - P1.x, center.y + P1.y, center.x - P2.x, center.y + P2.y, center.x - P3.x,center.y +  P3.y);
		}
		ctx.moveTo(center.x - P0.x, center.y - P0.y );
		ctx.bezierCurveTo(center.x - bP1.x, center.y + bP1.y, center.x - bP2.x, center.y + bP2.y, center.x - P3.x, center.y + P3.y);
		ctx.stroke();
		ctx.fill();

        //Два типа зрачков - круг и полоска
		var eyeTypeChance = Math.sRandom(0, 100);
		if(eyeTypeChance > 50)
		{
			//Рисуем круги-зрачки + проверяем шанс на закрытый глаз. Ниже - точно также, только рисуется линия
			var shift = Math.sRandom(-5,5);
			if(chanceCloseSecondEye < 70)
        	{
				drawСircle(ctx, {x:((P0.x + P3.x)/2)+shift,y:(P1.y + 6)}, 2, blackColor, blackColor, Math.sRandom(1, 2));
			}
			if(chanceCloseFirstEye < 70)
			{
				drawСircle(ctx, {x:-(((P0.x) + (P3.x))/2) + shift,y:(P1.y + 6)}, 2, blackColor, blackColor, Math.sRandom(1, 2));
			}
			
		}
		else
		{	
			var shift = Math.sRandom(-5,5);
			var widthEye = Math.sRandom(3, 5);
			if(chanceCloseFirstEye < 70)
        	{
        		//Рисуем линию достаточно сложно. Выичисляем центральную точку глаза, и рисуем
				drawLine(ctx, {x:((P0.x + P3.x)/2)+shift, y: (P1.y + 10) }, {x:((P0.x + P3.x)/2)+shift,y:(P1.y)}, blackColor, blackColor, widthEye);
			}
			if(chanceCloseSecondEye < 70)
			{
				drawLine(ctx, {x:-((P0.x + P3.x)/2)+shift, y: (P1.y + 10) }, {x:-((P0.x + P3.x)/2)+shift,y:(P1.y)}, blackColor, blackColor, widthEye);
			}
		}
	}, {x:1,y:1});

	//---Точки на щеках, как бывают у котов
	if(Math.sRandom(0, 100) > 60)
	{
		add(function(ctx){

			for (var i = 0; i < Math.sRandom(5, 7); i++) {
				var P = {x:Math.sRandom(20, 40),y:Math.sRandom(0, 30)};
				drawСircle(ctx, P, 1, blackColor, blackColor, 1);
			}
		    for (var i = 0; i < Math.sRandom(5, 7); i++) {
				var P = {x:-Math.sRandom(20, 40),y:Math.sRandom(0, 30)};
				drawСircle(ctx, P, 1, blackColor, blackColor, 1);
			}

		}, {x:1,y:1});
	}
	//--Челка
	if(Math.sRandom(0, 100) > 75)
	{
		add(function(ctx){

			
			for (var i = 0; i < Math.sRandom(3, 5); i++) {
				//Берем вектор равный по длине радиусу
				var radiusVector = {x:0,y:-radius};
				//Поворачиваем вектор на некоторое отлонение
				//Нужно чтобы волосы выходили ровно из окружности
				radiusVector = VectorRot(radiusVector, Math.sRandom(-0.01, 0.01))
				//Строим нижнии точки
				var P0 = {x:Math.sRandom(-25, 25), y: radiusVector.y};
				var P1 = {x:Math.sRandom(-25, 25), y: Math.sRandom(-50, -40)};
				//Ширина волоса
				var lineWidth = Math.sRandom(0.5, 1.5);
				//Рисуем
				drawLine(ctx, P0, P1, blackColor, blackColor, lineWidth);
			}

		}, {x:1,y:1});
	}

	//---Бабочка и Колокольчик
	//Декорации
	//Либо бабочка либо колокольчик
	var chanceBottom = Math.sRandom(0, 100);
	if(chanceBottom > 50)
	{

		var chance = Math.sRandom(0, 100);
		if(chance > 90)
		{
			//Бабочка - два треугольника + круг, с точками в случайном дипазаоне
			var P = {x:0,y:radius};
			var P0 = {x:Math.sRandom(20, 45), y:radius- Math.sRandom(13, 22)};
			var P1 = {x:Math.sRandom(20, 45), y:radius+ Math.sRandom(13, 22)};
			add(function(ctx){
					
				var color = (Math.sRandom(0, 100) > 50 ? whiteColor : blackColor);
			    ctx.beginPath();
		    	ctx.strokeStyle = blackColor;
		    	ctx.fillStyle = color;
		    	ctx.lineWidth = Math.sRandom(2, 5);
				ctx.moveTo(center.x + P.x,center.y + P.y);
				ctx.lineTo(center.x + P0.x,center.y + P0.y);
				ctx.lineTo(center.x + P1.x,center.y + P1.y);
				ctx.closePath();
				ctx.stroke();
				ctx.fill();

				ctx.beginPath();
		    	ctx.strokeStyle = blackColor;
		    	ctx.fillStyle = color;
		    	ctx.lineWidth = Math.sRandom(2, 5);
				ctx.moveTo(center.x - P.x,center.y + P.y);
				ctx.lineTo(center.x - P0.x,center.y + P0.y);
				ctx.lineTo(center.x - P1.x,center.y + P1.y);
				ctx.closePath();
				ctx.stroke();
				ctx.fill();

				drawСircle(ctx, P, Math.sRandom(6, 12), (Math.sRandom(0, 100) > 50 ? whiteColor : blackColor), blackColor, Math.sRandom(1, 3));

			}, {x:1,y:1});
		}
	}
	else
	{
		//Колокольчик
		var chance = Math.sRandom(0, 100);
		if(chance > 90)
		{
			//Колокольчик - треугольник, внизу с кругом. Строится по трём точкам, всё аналогично, как и выше
			var P = {x:0,y:radius};
			var P0 = {x:Math.sRandom(8, 15), y:radius+ Math.sRandom(23, 29)};
			var P1 = {x:-P0.x, y:P0.y};
			var P3 = {x:0,y:P0.y + Math.sRandom(0, 7)};
			add(function(ctx){

				drawСircle(ctx, P3, Math.sRandom(2, 6), (Math.sRandom(0, 100) > 50 ? whiteColor : blackColor), blackColor, Math.sRandom(1, 3));

				var color = (Math.sRandom(0, 100) > 50 ? whiteColor : blackColor);
			    ctx.beginPath();
		    	ctx.strokeStyle = blackColor;
		    	ctx.fillStyle = color;
		    	ctx.lineWidth = Math.sRandom(2, 5);
				ctx.moveTo(center.x + P.x,center.y + P.y);
				ctx.lineTo(center.x + P0.x,center.y + P0.y);
				ctx.lineTo(center.x + P1.x,center.y + P1.y);
				ctx.closePath();
				ctx.stroke();
				ctx.fill();

			}, {x:1,y:1});
		}
	}
	download();
}
//Нарисовать объект
function add(func, scale){
	
	Graphics.ctx.scale(scale.x, scale.y);
	func(Graphics.ctx);	
	Graphics.ctx.scale(1, 1);

}

//Поворачиваем вектора на угл
function VectorRot(dir, angle){
	var vecRes = {x:0,y:0};
 	vecRes.x = dir.x * Math.cos(angle) - dir.y * Math.sin(angle);
    vecRes.y = dir.x * Math.sin(angle) + dir.y * Math.cos(angle);
    return vecRes;
}

//Меняем знак у X
function VectorXInvert(vec){
	return {x:-vec.x,y:vec.y};	
}
//Рисуем круг
function drawСircle(ctx, pos, radius, fillColor, strokeColor, lineWidth)
{
    ctx.beginPath();
    ctx.arc(center.x - pos.x, center.y + pos.y, radius, 0, 2*Math.PI, false);
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeColor;
    ctx.stroke();
}
//Рисуем одиночкую линию
function drawLine(ctx, vec1, vec2, fillColor, strokeColor, width)
{
    ctx.beginPath();
    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = fillColor ;
    ctx.lineWidth = width;
	ctx.moveTo(center.x + vec1.x,center.y + vec1.y);
	ctx.lineTo(center.x + vec2.x,center.y + vec2.y);
	ctx.stroke();


}

function download()
{
	downloadCanvas = document.getElementById("canvas");
	downloadLink = document.getElementById("download");
	downloadLink.href = downloadCanvas.toDataURL('image/png');
	downloadLink.download = "RandomCat " + Math.round(Math.sRandom(999999,100000)) + ".png";
}





