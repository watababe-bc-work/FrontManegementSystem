//モーダルウィンドウ
$(function(){
    $(document).on('click','.js-modal-open',function(){
        $('.js-modal').fadeIn();
        return false;
    });
    $('.js-modal-close').on('click',function(){
        $('.js-modal').fadeOut();
        return false;
    });
});

//モーダルウィンドウ
$(function(){
    $(document).on('click','.js-modal-open1',function(){
        $('.js-modal1').fadeIn();
        return false;
    });
    $('.js-modal-close1').on('click',function(){
        $('.js-modal1').fadeOut();
        return false;
    });
});