var timOut;
var scrNums = ['.scr2','.scr3','.scr7','.scr8','.scr10'];//Названия классов экранов, имеющих слайдеры
var scrWid = [1366,1024,770,320];// Брейкпоинтсы экранов
var scrSummary = [450,335,450,450,1070,800,800,800,740,550,660,660,40,40,65,75,320,240,320,278];
var scrResol = [];
var k = 0;
for (var i = 0 ; i < scrNums.length ; i++)//Формирование рабочего массива с набором данных под разные экраны
{
    scrResol[scrNums[i]] = [];
    for (var j = 0; j < scrWid.length ; j++)
    {
        scrResol[scrNums[i]][scrWid[j]] = scrSummary[k++];
    }
}

function paytype(type)
{
    if (type == '2') 
    {// Переключение на вкладку почасовой оплаты
        $('.scr5-abonent').css('display','none');
        $('.scr6-abonent').css('display','none');
        $('.scr5-hours').css('display','block');
        $('.scr6-hours').css('display','block');
        $('.scr5-payment').removeClass('payment_active');
        $('.scr5-payments .scr5-payment:nth-child(3)').addClass('payment_active');
    }else 
    {
            //Переключение на вкладку абонентской оплаты
        $('.scr5-hours').css('display','none');
        $('.scr6-hours').css('display','none');
        $('.scr5-abonent').css('display','block');
        $('.scr6-abonent').css('display','block');
        $('.scr5-payment').removeClass('payment_active');
        $('.scr5-payments .scr5-payment:nth-child(2)').addClass('payment_active');
    }
}

function getWidthWindow()// Получаем текущую ширину окна : 1366, 1024, 770, 320
{
    return parseInt($('.scr-width').css('width'));
}

function setPage7(el,scrClass)  // Передача значения из ползунка в слайдер
{
    var pageNum = parseInt($(el).val());
    setPage(pageNum,scrClass);
}
    

function setPage(setPageTo,scrClass)  // Перемотка на сладер с заданным номером в заданном экране
{
    var slideCount = parseInt($(scrClass + ' .pager__bottom').text());// количество слайдов в экране
    var stepSlide = scrResol[scrClass][getWidthWindow()];//шаг между слайдами в указанном экране при текущей ширине
    var currentIndex = parseInt($(scrClass + ' .pager__number').text());// номер текущего слайда
    
    // Задаём массив начальных положений слайдов
    var positions = [];
    for (var i = 1; i <= slideCount ; i++)
    {
        positions[i-1] = stepSlide * (i - currentIndex);
    }
    

    // Двигаем слайды от начального положения к заданному за сколько-то шагов (~55)
    var step160 = (currentIndex - setPageTo) * stepSlide;
    positions['step160'] = step160;
    positions['slideCount'] = slideCount;
    positions['j'] = 0;
    positions['scrClass'] = scrClass;
    
    //Запускаем движение по таймеру
    moveSlide(positions);
    
    $(scrClass + ' .pager__number').html(setPageTo);//Меняем номер страницы в Pager

    if (parseInt(scrClass.substring(4,)) == 7) 
        $(scrClass + ' .slider__bar').val(setPageTo);//Если экран №7 - двигаем бегунок

}    

function moveSlide(pos)//непосредственно движение слайдов шажками по 20мс
{
    var step = 1;
    var slideBase = pos['scrClass'] + '-slider .slide:nth-child(';//Заготовка для названия слайдов в данном экране
    if ((pos['j'] > 8)&&(pos['j'] < 152)) 
        step = 4;
    var stepJ = Math.floor(pos['step160'] * pos['j'] / 160);// находим смещение для текущего j
    pos['j'] += step;
    for (var i = 1; i <= pos['slideCount'] ; i++) 
    {
        var position = pos[i-1] + stepJ;    //Вычисляем положение каждого слайда для текущего j
        $(slideBase + i + ')').css('left', position + 'px'); // Двигаем слайд
    }
    // Если это ещё не конец - перезапускаемся через таймер
    if (pos['j'] < 161)
    {
        clearTimeout(timOut);// Вдруг страница уже движется - сбрасываем работающий таймер
        timOut = setTimeout(moveSlide,20,pos);//Запускаем движение с шагом 20мс
    }
}
    
function changePager(scrClass,directChange) // Обработка нажатия Pager
{
    var newIndex = 0;
    var slideBase = scrClass + '-slider .slide:nth-child(';//Заготовка для названия слайдов в данном экране
    var slideCount = parseInt($(scrClass + ' .pager__bottom').text());// количество слайдов в экране
    var currentIndex = parseInt($(scrClass + ' .pager__number').text());// номер текущего слайда

    if ((directChange < 0)&&(currentIndex > 1)) 
        newIndex = currentIndex - 1;
    if ((directChange > 0)&&(currentIndex < slideCount)) 
        newIndex = currentIndex + 1;
    if (newIndex) 
        setPage(newIndex,scrClass); // Если возможно, то перемотка к соседнему слайду.
}   

function expandTextboxBtnClick()// разворачивание полусвёрнутого текста первого экрана
{
    var collapseStatus = $('.scr1-expand-textbox').data('toggle');
    var scrWidth = getWidthWindow();
    var txtOpen = '53rem';
    var txtClose = '46.5rem';
    if (scrWidth < 770)
    {
        txtOpen = '91rem';
        txtClose = '60rem';
    }
    else if (scrWidth < 1024)
    {
        txtOpen = '70rem';
        txtClose = '53rem';
    }

    if (collapseStatus)
    {
        $('.scr1-expand-textbox').data('toggle','');
        $('.expand-textbox').removeClass('expand-textbox__collapsed');
        $('.expand-textbox__btn span').html('Свернуть');
        $('.scr1').css('height',txtOpen);
    }
    else 
    { 
        $('.scr1-expand-textbox').data('toggle','collapsed');
        $('.expand-textbox').addClass('expand-textbox__collapsed');
        $('.expand-textbox__btn span').html('Развернуть');
        $('.scr1').css('height',txtClose);
    }
}



function setRange(el,maxVal,divClass)// Ввод значений ползунками (экран 5 почасовая)
{
    var valInput = parseInt($(el).val());
    //var maxval = 30;
    var percent = Math.round(100 * (valInput - 1) / (maxVal - 1));
    $(divClass).val(valInput);
    $(el).css('background',  'linear-gradient(to right, #06f 0%,#06f ' + percent + '%,#ccc ' + percent + '%,#ccc 100%)');
}

function setInput(el,maxVal,itemIndex)//Ввод значений непосредственно в ячейки input (экран 5 почасовая)
{
    var max = parseInt(maxVal);
    var valInput = parseInt($(el).val());
    var item = parseInt(itemIndex);

    if ((item < 3)||(item>6)) return 0;
    if (valInput > maxVal) return 0;
    if (valInput < 1) return 0;
                            // Перенос введённых данных в ползунки
    var rangeInput = $('.scr5h-inner .scr5-hours-item:nth-child(' + item + ') .range-bar');
    rangeInput.val(valInput);
    var percent = Math.round(100 * (valInput - 1) / (max - 1));
    $(rangeInput).css('background',  'linear-gradient(to right, #06f 0%,#06f ' + percent + '%,#ccc ' + percent + '%,#ccc 100%)');
}

function showAnswer(el)// Разворачивание ответов в экране 11
{
    $('.lost-quest').removeClass('quest_active');
    $(el).addClass('quest_active');
}

function moveScroll8(el)// Перемещение план-графика в экране 8
{
    var posRange = parseInt($(el).val());// Получили значение ползунка [0 - 100]
    var maxShift = scrResol['.scr8'][getWidthWindow()];//максимальное смещение (в -rem) в указанном экране при текущей ширине 
    var position = -posRange * maxShift / 100;
    $('.scr8-plane').css('left',position + 'rem');
}

function viewRate(numRate)// Просмотр абонентских тарифов (экран 5) на смартфонах
{
    var numberRate = parseInt(numRate);
    for (var i = 1; i < 5; i++){
        $('.scr5a-inner .rate:nth-child(' + i + ')').css('margin-left',((i - numberRate)*16.4) + 'em');
    }
    $('.circles-row-circle').removeClass('circle_active');
    $('.scr5a-circles-row .circle:nth-child(' + numRate + ')').addClass('circle_active');
}

function checkPhone()// Первичная валидность введённого номера телефона
{
    var el = $('.scr9-form input[name="phone"]');
    var phone = el.val();
    if(!phone) 
    {
        el.addClass('red');
	} else if(/[^0-9\+ ()\-]/.test(phone)) 
    {
        el.addClass('red');
	} else 
    {
		el.removeClass('red');
	}
    
}
