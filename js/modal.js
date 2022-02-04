//モーダルウィンドウ(新規登録)
$(function(){
    $('.js-modal-open').on('click',function(){
        $('.js-modal').fadeIn();
        return false;
    });
    $('.js-modal-close').on('click',function(){
        $('.js-modal').fadeOut();
        return false;
    });
});

//モーダルウィンドウ(特記事項)
$(function(){
    $(document).on('click','.js-modal-open1',function(){
        $('.js-modal1').fadeIn();
        var weekalert = document.getElementById('getWeekAlert');
        var Timealert = document.getElementById('getTimeAlert');
        weekalert.textContent = "";
        Timealert.textContent = "";
        return false;
    });
    $('.js-modal-close1').on('click',function(){
        $('.js-modal1').fadeOut();
        return false;
    });
});