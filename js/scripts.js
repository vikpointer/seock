var timOut;
var scrNums = ['.scr2','.scr3','.scr7','.scr8','.scr10'];//Названия классов экранов, имеющих слайдеры
var scrWid = [1366,1024,770,320];// Брейкпоинтсы экранов
var scrSummary = [450,335,450,450,1070,800,800,800,740,550,660,660,40,40,65,75,150,113,225,285];
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
        $('.scr5__abonent').css('display','none');
        $('.scr6-abonent').css('display','none');
        $('.scr5-hours').css('display','block');
        $('.scr6-hours').css('display','block');
        $('.scr5-payment').removeClass('payment_active');
        $('.scr5-payments .scr5-payment:nth-child(2)').addClass('payment_active');
    }else 
    {
            //Переключение на вкладку абонентской оплаты
        $('.scr5-hours').css('display','none');
        $('.scr6-hours').css('display','none');
        $('.scr5__abonent').css('display','block');
        $('.scr6-abonent').css('display','block');
        $('.scr5-payment').removeClass('payment_active');
        $('.scr5-payments .scr5-payment:nth-child(1)').addClass('payment_active');
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
    
function setPage(setPageTo,scrClass)  // Перемотка на слайдер с заданным номером в заданном экране
{
    var slideCount = parseInt($(scrClass + ' .pager__bottom').text());// количество слайдов в экране
    var stepSlide = scrResol[scrClass][getWidthWindow()];//шаг между слайдами в указанном экране при текущей ширине
    var posContainer = -stepSlide * (setPageTo - 1);// вычисляем положение контейнера
    $(scrClass + '-slider-container').css('left',posContainer + 'px');// двигаем контейнер вместе со слайдами
    $(scrClass + ' .pager__number').html(setPageTo);//Меняем номер страницы в Pager

    if (parseInt(scrClass.substring(4,5)) == 7) 
        $(scrClass + ' .slider__bar').val(setPageTo);//Если экран №7 - двигаем бегунок

}  

function moveSlide(pos)//непосредственно движение слайдов за один шаг
{
    var slideBase = pos['scrClass'] + '-slider .slide:nth-child(';//Заготовка для названия слайдов в данном экране
    var stepJ = Math.floor(pos['step160']);// находим смещение для крайнего положения слайда

    for (var i = 1; i <= pos['slideCount'] ; i++) 
    {
        var position = pos[i-1] + stepJ;    //Вычисляем положение каждого слайда для крайнего положения
        $(slideBase + i + ')').css('left', position + 'px'); // Двигаем слайд
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
    var txtOpen = '1120px';
    var txtClose = '760px';
    if (scrWidth < 770)
    {
        txtOpen = '1180px';
        txtClose = '60em';
    }
    else if (scrWidth < 1024)
    {
        txtOpen = '1375px';
        txtClose = '1030px';
    }
    else if (scrWidth < 1366)
    {
        txtOpen = '920px';
        txtClose = '600px';
    }

    if (collapseStatus)
    {
        $('.scr1-expand-textbox').data('toggle','');
        $('.expand-textbox').removeClass('expand-textbox_collapsed');
        $('.expand-textbox__btn .expand__txt').html('Свернуть');
        $('.scr1').css('height',txtOpen);
        //$('.page-scr2').css('top','18em');
    }
    else 
    { 
        $('.scr1-expand-textbox').data('toggle','collapsed');
        $('.expand-textbox').addClass('expand-textbox_collapsed');
        $('.expand-textbox__btn .expand__txt').html('Развернуть');
        $('.scr1').css('height',txtClose);
       // $('.page-scr2').css('top','18em');
    }
}

function expandTextboxCollapse(){
    var collapseStatus = $('.scr1-expand-textbox').data('toggle');
    if (collapseStatus) return;
    expandTextboxBtnClick();
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
    if ($(el).hasClass('quest_active')) 
    {
        $('.lost-quest').removeClass('quest_active');
        return;
        
    }
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
    $('.scr5a-inner .rate:nth-child(1)').css('margin-left',((1 - numberRate)*16.4) + 'em');
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

function focusInput(el)// Установка обёрток input в form__divinput_active для обводки рамки при получении фокуса
{
    $(el).parent().addClass('form__divinput_active');
}

function blurInput(el)// Снятие form__divinput_active при потере фокуса
{
    $(el).parent().removeClass('form__divinput_active');
}