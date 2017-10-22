



function paytype(type){
    if (type == '2') {// Переключение на вкладку почасовой оплаты
        $('#payabonent').css('display','none');
        $('#payhours').css('display','block');
        $('.paytype.active').removeClass('active');
        $('#phour').addClass('active');
    }else {
            //Переключение на вкладку абонентской оплаты
        $('#payhours').css('display','none');
        $('#payabonent').css('display','block');
        $('.paytype.active').removeClass('active');
        $('#pabon').addClass('active');
    }
}

function movescroll7(el){
    var x = parseInt($(el).val());
    var dxs = $('.scr7slide:nth-child(6)').css('left');
    var dx = parseInt(dxs);
    for (var i = 1; i<6 ; i++) 
    {
        $('.scr7slide:nth-child('+i+')').css('left', ((i - x)*dx) + 'px');
    }
    $('#pgindex7').html(x + '/');
}

function setdivs(el,maxval,div){
    var valinp = parseInt($(el).val());
    //var maxval = 30;
    var percent = Math.round(100 * (valinp - 1) / (maxval - 1));
    $(div).text(valinp);
    $(el).css('background',  'linear-gradient(to right, #06f 0%,#06f ' + percent + '%,#ccc ' + percent + '%,#ccc 100%)');
}
