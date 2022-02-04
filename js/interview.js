//年齢のselectBox用
(function() {
    var selectBox = document.getElementById('age_input');
    var option = '<option value="">年齢を選択する</option>';
    selectBox.insertAdjacentHTML('beforeend', option);
    for (var i = 18; i <= 50; i++) {
        option = '<option value="' + i + '">' + i + '歳</option>';
        selectBox.insertAdjacentHTML('beforeend', option);
    };
})();

function InterviewUpdate(){
    //状態
    var status_obj = document.getElementById('status');
    var status_idx = status_obj.selectedIndex;
    var status = status_obj.options[status_idx].text;
    if(status == '状態を選択する'){
        status = "";
    }

    //受付者
    var receiver = document.getElementById('receiver_input').value;
    //応募媒体
    var media_obj = document.getElementById('application_media');
    var media_idx = media_obj.selectedIndex;
    var media = media_obj.options[media_idx].text;
    if(media == '応募媒体を選択する'){
        media = "";
    }
    //自宅最寄り駅
    var station = document.getElementById('station_input').value;
    //氏名
    var name = document.getElementById('name_input').value;
    //性別
    var sex_elements = document.getElementsByName('sex');
    var sex_len = sex_elements.length;
    var sex_checkValue = '';
    var sex = "";

    for(var i = 0;i<sex_len;i++){
        if(sex_elements.item(i).checked){
            sex_checkValue = sex_elements.item(i).value;
            if(sex_checkValue == 'men'){
                sex = "男性";
            }else if(sex_checkValue == "woman"){
                sex = "女性";
            }else{
                sex = "その他";
            }
        }
    };
    //年齢
    var age = document.getElementById('age_input').value;
    //国籍
    var nationality = document.getElementById('nationality_input').value;
    //連絡先
    var tel = document.getElementById('tel_input').value;
    //面接日時
    var interview_date = document.getElementById('interview_date_input').value;
    var interview_time = document.getElementById('interview_time_input').value;
    var interview_day = interview_date + " " + interview_time;
    console.log(interview_day);
    //面接場所
    
}