const Config = {
    apiKey: "AIzaSyDJQ534D9SszcYEt8m4KzRMDEPx1sWJf8M",
    authDomain: "watanabe-bc-work.firebaseapp.com",
    projectId: "watanabe-bc-work",
    storageBucket: "watanabe-bc-work.appspot.com",
    messagingSenderId: "299351282418",
    appId: "1:299351282418:web:348999f1df61b69917366b"
  };

  firebase.initializeApp(Config);

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});

//年齢のselectBox用
(function() {
    var selectBox = document.getElementById('age_input');
    var option = '<option value="">年齢を選択する</option>';
    selectBox.insertAdjacentHTML('beforeend', option);
    for (var i = 18; i <= 70; i++) {
        option = '<option value="' + i + '">' + i + '歳</option>';
        selectBox.insertAdjacentHTML('beforeend', option);
    };
})();

(function() {
    var selectBox = document.getElementById('age_input_edit');
    var option = '<option value="">年齢を選択する</option>';
    selectBox.insertAdjacentHTML('beforeend', option);
    for (var i = 18; i <= 70; i++) {
        option = '<option value="' + i + '">' + i + '歳</option>';
        selectBox.insertAdjacentHTML('beforeend', option);
    };
})();

//テーブル表示
(async () => {
    try {
      // 省略 
      // (Cloud Firestoreのインスタンスを初期化してdbにセット)
  
      const querySnapshot = await db.collection('interview').orderBy('ReceptionDate', 'desc').limit(20).get() // firebase.firestore.QuerySnapshotのインスタンスを取得
      var i = 0;
      var stocklist = '<div class="container"><table class="table">'
      querySnapshot.forEach((postDoc) => {
        i += 1;
        switch(postDoc.get('Status')){
            case '面接済み':
                stocklist += '<tbody class="Already_back"><tr><td>'+ postDoc.get('Status') + '</td><td>' + i + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('Receiver') + '</td><td>' + postDoc.get('Media') + '</td><td>' + postDoc.get('Station') + '</td><td>' + postDoc.get('Name') + '</td><td>' + postDoc.get('Sex') + '</td><td>' + postDoc.get('Age') + '</td><td>' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td>' + postDoc.get('InterviewDate') + '<br>' + postDoc.get('InterviewTime') + '</td><td>' + postDoc.get('InterviewPlace') + '</td><td>' + postDoc.get('Dormitory') + '</td><td>' + '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
                break;

            case '来社せず':
                stocklist += '<tbody class="notcome_back"><tr><td>'+ postDoc.get('Status') + '</td><td>' + i + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('Receiver') + '</td><td>' + postDoc.get('Media') + '</td><td>' + postDoc.get('Station') + '</td><td>' + postDoc.get('Name') + '</td><td>' + postDoc.get('Sex') + '</td><td>' + postDoc.get('Age') + '</td><td>' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td>' + postDoc.get('InterviewDate') + '<br>' + postDoc.get('InterviewTime') + '</td><td>' + postDoc.get('InterviewPlace') + '</td><td>' + postDoc.get('Dormitory') + '</td><td>' + '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>'; 
                break;

            case '採用':
                stocklist += '<tbody class="recruit_back"><tr><td>'+ postDoc.get('Status') + '</td><td>' + i + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('Receiver') + '</td><td>' + postDoc.get('Media') + '</td><td>' + postDoc.get('Station') + '</td><td>' + postDoc.get('Name') + '</td><td>' + postDoc.get('Sex') + '</td><td>' + postDoc.get('Age') + '</td><td>' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td>' + postDoc.get('InterviewDate') + '<br>' + postDoc.get('InterviewTime') + '</td><td>' + postDoc.get('InterviewPlace') + '</td><td>' + postDoc.get('Dormitory') + '</td><td>' + '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';  
                break; 
            
            case '不採用':
                stocklist += '<tbody class="norecruit_back"><tr><td>'+ postDoc.get('Status') + '</td><td>' + i + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('Receiver') + '</td><td>' + postDoc.get('Media') + '</td><td>' + postDoc.get('Station') + '</td><td>' + postDoc.get('Name') + '</td><td>' + postDoc.get('Sex') + '</td><td>' + postDoc.get('Age') + '</td><td>' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td>' + postDoc.get('InterviewDate') + '<br>' + postDoc.get('InterviewTime') + '</td><td>' + postDoc.get('InterviewPlace') + '</td><td>' + postDoc.get('Dormitory') + '</td><td>' + '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>'; 
                break;
            
            case 'キャンセル':
                stocklist += '<tbody class="cancel_back"><tr><td>'+ postDoc.get('Status') + '</td><td>' + i + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('Receiver') + '</td><td>' + postDoc.get('Media') + '</td><td>' + postDoc.get('Station') + '</td><td>' + postDoc.get('Name') + '</td><td>' + postDoc.get('Sex') + '</td><td>' + postDoc.get('Age') + '</td><td>' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td>' + postDoc.get('InterviewDate') + '<br>' + postDoc.get('InterviewTime') + '</td><td>' + postDoc.get('InterviewPlace') + '</td><td>' + postDoc.get('Dormitory') + '</td><td>' + '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
                break;

            default:    
                stocklist += '<tbody><tr><td>'+ postDoc.get('Status') + '</td><td>' + i + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('Receiver') + '</td><td>' + postDoc.get('Media') + '</td><td>' + postDoc.get('Station') + '</td><td>' + postDoc.get('Name') + '</td><td>' + postDoc.get('Sex') + '</td><td>' + postDoc.get('Age') + '</td><td>' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td>' + postDoc.get('InterviewDate') + '<br>' + postDoc.get('InterviewTime') + '</td><td>' + postDoc.get('InterviewPlace') + '</td><td>' + postDoc.get('Dormitory') + '</td><td>' + '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
        }
      })

      stocklist += '</table></div>';
      document.getElementById('interview_list').innerHTML = stocklist;

    } catch (err) {
        console.log(err);
    }
})();

//追加
function InterviewUpdate(){
    //状態
    var status = document.getElementById('status_input').value;
    //受付者
    var receiver = document.getElementById('receiver_input').value;
    //応募媒体
    var media = document.getElementById('media_input').value;
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
    //面接場所
    var place_obj = document.getElementById('interview_place');
    var place_idx = place_obj.selectedIndex;
    var interview_place = place_obj.options[place_idx].text;
    if(interview_place == '本部or現地'){
        interview_place = "";
    }
    var place_input = document.getElementById('place_input').value;
    interview_place += place_input;

    //寮希望
    var checkBox = document.getElementById('dormitory');
    var dormitory = "";
    if(checkBox.checked){
        dormitory = "希望";
    }else{
        dormitory = "不要";
    };

    //特記事項
    var notice = document.getElementById('notice_input').value;

    //DBへ送信
    db.collection('interview').add({
        Status:status,
        Receiver:receiver,
        Media:media,
        Station:station,
        Name:name,
        Sex:sex,
        Age:age,
        Nationality:nationality,
        Tel:tel,
        InterviewDate:interview_date,
        InterviewTime:interview_time,
        InterviewPlace:interview_place,
        Dormitory:dormitory,
        Notice:notice,
        ReceptionDate: firebase.firestore.FieldValue.serverTimestamp(),
    });
    console.log('ok');
    var collectAlert = document.getElementById('collectAlert');
    collectAlert.innerHTML = '<div class="alert alert-success" role="alert">編集完了!リロードします。</div>';
    setTimeout("location.reload()",2000);
}

//編集用モーダルウィンドウ
function EditContent(id){
    (async () => {
        try {
            const carrentinterviewDB = await db.collection('interview').doc(id).get();
            //面接
            document.getElementById('status_input_edit').value = carrentinterviewDB.get('Status');

            //受付者
            document.getElementById('receiver_input_edit').value = carrentinterviewDB.get('Receiver');

            //応募媒体
            document.getElementById('media_input_edit').value = carrentinterviewDB.get('Media');

            //自宅最寄り駅
            document.getElementById('station_input_edit').value = carrentinterviewDB.get('Station');

            //氏名
            document.getElementById('name_input_edit').value = carrentinterviewDB.get('Name');

            //性別
            var sex_elements = document.getElementsByName('sex_edit');

            switch(carrentinterviewDB.get('Sex')){
                case '男性':
                    sex_elements.item(0).checked = true;
                    break;
                case '女性':
                    sex_elements.item(1).checked = true;
                    break;
                case 'その他':
                    sex_elements.item(2).checked = true;
                    break;
            }

            //年齢
            document.getElementById('age_input_edit').value = carrentinterviewDB.get('Age');

            //国籍
            document.getElementById('nationality_input_edit').value = carrentinterviewDB.get('Nationality');

            //連絡先
            document.getElementById('tel_input_edit').value = carrentinterviewDB.get('Tel');

            //面接日時
            document.getElementById('interview_date_input_edit').value = carrentinterviewDB.get('InterviewDate');
            document.getElementById('interview_time_input_edit').value = carrentinterviewDB.get('InterviewTime');

            //面接場所
            if(carrentinterviewDB.get('InterviewPlace') == "本部"){
                document.getElementById('interview_place_edit').options[1].selected = true;
            }else{
                document.getElementById('interview_place_edit').options[2].selected = true;
                document.getElementById('place_input_edit').value = carrentinterviewDB.get('InterviewPlace').replace("現地:","");
            };

            //寮希望
            if(carrentinterviewDB.get('Dormitory') == "不要"){

            }else{
                document.getElementById('dormitory_edit').checked = true;
            }

            //特記事項
            document.getElementById('notice_input_edit').value = carrentinterviewDB.get('Notice');

            //編集送信ボタン生成
            document.getElementById('edit_submit_button').innerHTML = '<button type="submit" class="btn btn-success" onclick="EditUpdate(\''+id+'\')">送信する</button>';

        } catch (err) {
        console.log(`Error: ${JSON.stringify(err)}`)
        }
    })();

    $(function(){
        $(document).on('click','.js-modal-open2',function(){
            $('.js-modal2').fadeIn();
            return false;
        });
        $('.js-modal-close2').on('click',function(){
            $('.js-modal2').fadeOut();
            return false;
        });
    });
};

//編集
function EditUpdate(id){
    //状態
    var status = document.getElementById('status_input_edit').value;
    //受付者
    var receiver = document.getElementById('receiver_input_edit').value;
    //応募媒体
    var media = document.getElementById('media_input_edit').value;
    //自宅最寄り駅
    var station = document.getElementById('station_input_edit').value;
    //氏名
    var name = document.getElementById('name_input_edit').value;
    //性別
    var sex_elements = document.getElementsByName('sex_edit');
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
    var age = document.getElementById('age_input_edit').value;
    //国籍
    var nationality = document.getElementById('nationality_input_edit').value;
    //連絡先
    var tel = document.getElementById('tel_input_edit').value;
    //面接日時
    var interview_date = document.getElementById('interview_date_input_edit').value;
    var interview_time = document.getElementById('interview_time_input_edit').value;
    //面接場所
    var place_obj = document.getElementById('interview_place_edit');
    var place_idx = place_obj.selectedIndex;
    var interview_place = place_obj.options[place_idx].text;
    if(interview_place == '本部or現地'){
        interview_place = "";
    }
    var place_input = document.getElementById('place_input_edit').value;
    interview_place += place_input;

    //寮希望
    var checkBox = document.getElementById('dormitory_edit');
    var dormitory = "";
    if(checkBox.checked){
        dormitory = "希望";
    }else{
        dormitory = "不要";
    };

    //特記事項
    var notice = document.getElementById('notice_input_edit').value;

    //DBへ送信
    db.collection('interview').doc(id).update({
        Status:status,
        Receiver:receiver,
        Media:media,
        Station:station,
        Name:name,
        Sex:sex,
        Age:age,
        Nationality:nationality,
        Tel:tel,
        InterviewDate:interview_date,
        InterviewTime:interview_time,
        InterviewPlace:interview_place,
        Dormitory:dormitory,
        Notice:notice,
    });
    console.log('ok');
    var collectAlert = document.getElementById('collectAlert1');
    collectAlert.innerHTML = '<div class="alert alert-success" role="alert">編集完了!リロードします。</div>';
    setTimeout("location.reload()",2000);
}

//削除
function DeleteContent(id,index){
    var res = window.confirm(index + "番目の内容を削除しますか？");
    if( res ) {
        db.collection('interview').doc(id).delete();
        alert("削除されました。");
        setTimeout("location.reload()",500);
    }
    else {
        // キャンセルならアラートボックスを表示
        alert("キャンセルしました。");
    } 
};

//今日の面接のみ表示
function TodayInterview(){
    (async () => {
        try {
          // 省略 
          // (Cloud Firestoreのインスタンスを初期化してdbにセット)
          var date = new Date();
          var today = date.getFullYear() + '-' + ('00' + (date.getMonth()+1)).slice(-2) + '-' + ('00' + date.getDate()).slice(-2);
          console.log(today);
          const querySnapshot = await db.collection('interview').where('InterviewDate','==',today).orderBy('InterviewTime','desc').limit(20).get() // firebase.firestore.QuerySnapshotのインスタンスを取得
          var i = 0;
          var stocklist = '<div class="container"><table class="table">'
          querySnapshot.forEach((postDoc) => {
            i += 1;
            switch(postDoc.get('Status')){
                case '面接済み':
                    stocklist += '<tbody class="Already_back"><tr><td>'+ postDoc.get('Status') + '</td><td>' + i + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('Receiver') + '</td><td>' + postDoc.get('Media') + '</td><td>' + postDoc.get('Station') + '</td><td>' + postDoc.get('Name') + '</td><td>' + postDoc.get('Sex') + '</td><td>' + postDoc.get('Age') + '</td><td>' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td>' + postDoc.get('InterviewDate') + '<br>' + postDoc.get('InterviewTime') + '</td><td>' + postDoc.get('InterviewPlace') + '</td><td>' + postDoc.get('Dormitory') + '</td><td>' + '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
                    break;
    
                case '来社せず':
                    stocklist += '<tbody class="notcome_back"><tr><td>'+ postDoc.get('Status') + '</td><td>' + i + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('Receiver') + '</td><td>' + postDoc.get('Media') + '</td><td>' + postDoc.get('Station') + '</td><td>' + postDoc.get('Name') + '</td><td>' + postDoc.get('Sex') + '</td><td>' + postDoc.get('Age') + '</td><td>' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td>' + postDoc.get('InterviewDate') + '<br>' + postDoc.get('InterviewTime') + '</td><td>' + postDoc.get('InterviewPlace') + '</td><td>' + postDoc.get('Dormitory') + '</td><td>' + '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>'; 
                    break;
    
                case '採用':
                    stocklist += '<tbody class="recruit_back"><tr><td>'+ postDoc.get('Status') + '</td><td>' + i + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('Receiver') + '</td><td>' + postDoc.get('Media') + '</td><td>' + postDoc.get('Station') + '</td><td>' + postDoc.get('Name') + '</td><td>' + postDoc.get('Sex') + '</td><td>' + postDoc.get('Age') + '</td><td>' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td>' + postDoc.get('InterviewDate') + '<br>' + postDoc.get('InterviewTime') + '</td><td>' + postDoc.get('InterviewPlace') + '</td><td>' + postDoc.get('Dormitory') + '</td><td>' + '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';  
                    break; 
                
                case '不採用':
                    stocklist += '<tbody class="norecruit_back"><tr><td>'+ postDoc.get('Status') + '</td><td>' + i + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('Receiver') + '</td><td>' + postDoc.get('Media') + '</td><td>' + postDoc.get('Station') + '</td><td>' + postDoc.get('Name') + '</td><td>' + postDoc.get('Sex') + '</td><td>' + postDoc.get('Age') + '</td><td>' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td>' + postDoc.get('InterviewDate') + '<br>' + postDoc.get('InterviewTime') + '</td><td>' + postDoc.get('InterviewPlace') + '</td><td>' + postDoc.get('Dormitory') + '</td><td>' + '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>'; 
                    break;
                
                case 'キャンセル':
                    stocklist += '<tbody class="cancel_back"><tr><td>'+ postDoc.get('Status') + '</td><td>' + i + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('Receiver') + '</td><td>' + postDoc.get('Media') + '</td><td>' + postDoc.get('Station') + '</td><td>' + postDoc.get('Name') + '</td><td>' + postDoc.get('Sex') + '</td><td>' + postDoc.get('Age') + '</td><td>' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td>' + postDoc.get('InterviewDate') + '<br>' + postDoc.get('InterviewTime') + '</td><td>' + postDoc.get('InterviewPlace') + '</td><td>' + postDoc.get('Dormitory') + '</td><td>' + '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
                    break;
    
                default:    
                    stocklist += '<tbody><tr><td>'+ postDoc.get('Status') + '</td><td>' + i + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('Receiver') + '</td><td>' + postDoc.get('Media') + '</td><td>' + postDoc.get('Station') + '</td><td>' + postDoc.get('Name') + '</td><td>' + postDoc.get('Sex') + '</td><td>' + postDoc.get('Age') + '</td><td>' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td>' + postDoc.get('InterviewDate') + '<br>' + postDoc.get('InterviewTime') + '</td><td>' + postDoc.get('InterviewPlace') + '</td><td>' + postDoc.get('Dormitory') + '</td><td>' + '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
            }
          })
    
          stocklist += '</table></div>';
          document.getElementById('interview_list').innerHTML = stocklist;
    
        } catch (err) {
            console.log(err);
        }
    })();
}