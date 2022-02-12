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

//スムーススクロール
$(function(){
    // #で始まるリンクをクリックした場合
    $('a[href^="#"]').click(function() {
      // スクロールの速度
      let speed = 500;
      // スクロールタイプ
      let type = 'swing';
      // href属性の取得
      let href= $(this).attr("href");
      // 移動先の取得（hrefが#indexならトップ$(html)に、）
      let target = $(href == "#index" ? 'html' : href);
      // 移動先のポジション取得
      let position = target.offset().top;
      // animateでスムーススクロール
      $('body,html').animate({scrollTop:position}, speed, type);
      return false;
    });
});

//特記事項表示
(async () => {
    try {
      // 省略 
      // (Cloud Firestoreのインスタンスを初期化してdbにセット)
  
      querySnapshot = await db.collection('interview').doc('notice').get() // firebase.firestore.QuerySnapshotのインスタンスを取得
      var stocklist = "";
      var content = querySnapshot.get('content');
      stocklist += '<p>' + content + '</p>';
      document.getElementById('NoticeShow').innerHTML = stocklist;
      var stocklistReplace = content.replace(/<br>/g, "\n");
      document.getElementById('NoticeTextArea').innerHTML = stocklistReplace;
    } catch (err) {
        console.log(err);
    }
})();

//特記事項の表示非表示
document.getElementById("NoticeContent").style.display ="none";
function NoticeDisplay(){
    const noticeContent = document.getElementById("NoticeContent");
    if(noticeContent.style.display=="block"){
		// noneで非表示
		noticeContent.style.display ="none";
	}else{
		// blockで表示
        noticeContent.style.display ="block";
	}
}

//特記事項の編集
function NoticeUpdate(){
    let textarea = document.getElementById('NoticeTextArea');
    let text = textarea.value;
    let textArray = text.split('\n');
    let newText = textArray.join('<br>');
    //DBへ送信
    db.collection('interview').doc('notice').update({
        content:newText,
    });
    console.log('ok');
    var collectAlert = document.getElementById('collectAlert2');
    collectAlert.innerHTML = '<div class="alert alert-success" role="alert">編集完了!リロードします。</div>';
    setTimeout("location.reload()",2000);
}

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

var query="";
var querySnapshot="";

//テーブル表示
(async () => {
    try {
      // 省略 
      // (Cloud Firestoreのインスタンスを初期化してdbにセット)
  
      query = await db.collection('interview').orderBy('ReceptionDate', 'desc').limit(10) // firebase.firestore.QuerySnapshotのインスタンスを取得
      querySnapshot = await query.get();
      var i = 0;
      var stocklist = '<table class="table" id="download_table">'
      querySnapshot.forEach((postDoc) => {
        i += 1;
        switch(postDoc.get('Status')){
            case '面接済み':
                stocklist += '<tbody class="Already_back"><tr><td>'+ postDoc.get('Status') + '</td><td>' + i + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('Receiver') + '</td><td>' + postDoc.get('Media') + '</td><td>' + postDoc.get('Station') + '</td><td>' + postDoc.get('Name') + '</td><td>' + postDoc.get('Sex') + '</td><td>' + postDoc.get('Age') + '</td><td>' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td>' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td>' + postDoc.get('InterviewPlace') + '</td><td>' + postDoc.get('Dormitory') + '</td><td>' + '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
                break;

            case '来社せず':
                stocklist += '<tbody class="notcome_back"><tr><td>'+ postDoc.get('Status') + '</td><td>' + i + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('Receiver') + '</td><td>' + postDoc.get('Media') + '</td><td>' + postDoc.get('Station') + '</td><td>' + postDoc.get('Name') + '</td><td>' + postDoc.get('Sex') + '</td><td>' + postDoc.get('Age') + '</td><td>' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td>' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td>' + postDoc.get('InterviewPlace') + '</td><td>' + postDoc.get('Dormitory') + '</td><td>' + '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>'; 
                break;

            case '採用':
                stocklist += '<tbody class="recruit_back"><tr><td>'+ postDoc.get('Status') + '</td><td>' + i + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('Receiver') + '</td><td>' + postDoc.get('Media') + '</td><td>' + postDoc.get('Station') + '</td><td>' + postDoc.get('Name') + '</td><td>' + postDoc.get('Sex') + '</td><td>' + postDoc.get('Age') + '</td><td>' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td>' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td>' + postDoc.get('InterviewPlace') + '</td><td>' + postDoc.get('Dormitory') + '</td><td>' + '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';  
                break; 
            
            case '不採用':
                stocklist += '<tbody class="norecruit_back"><tr><td>'+ postDoc.get('Status') + '</td><td>' + i + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('Receiver') + '</td><td>' + postDoc.get('Media') + '</td><td>' + postDoc.get('Station') + '</td><td>' + postDoc.get('Name') + '</td><td>' + postDoc.get('Sex') + '</td><td>' + postDoc.get('Age') + '</td><td>' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td>' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td>' + postDoc.get('InterviewPlace') + '</td><td>' + postDoc.get('Dormitory') + '</td><td>' + '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>'; 
                break;
            
            case 'キャンセル':
                stocklist += '<tbody class="cancel_back"><tr><td>'+ postDoc.get('Status') + '</td><td>' + i + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('Receiver') + '</td><td>' + postDoc.get('Media') + '</td><td>' + postDoc.get('Station') + '</td><td>' + postDoc.get('Name') + '</td><td>' + postDoc.get('Sex') + '</td><td>' + postDoc.get('Age') + '</td><td>' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td>' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td>' + postDoc.get('InterviewPlace') + '</td><td>' + postDoc.get('Dormitory') + '</td><td>' + '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
                break;

            default:    
                stocklist += '<tbody><tr><td>'+ postDoc.get('Status') + '</td><td>' + i + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('Receiver') + '</td><td>' + postDoc.get('Media') + '</td><td>' + postDoc.get('Station') + '</td><td>' + postDoc.get('Name') + '</td><td>' + postDoc.get('Sex') + '</td><td>' + postDoc.get('Age') + '</td><td>' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td>' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td>' + postDoc.get('InterviewPlace') + '</td><td>' + postDoc.get('Dormitory') + '</td><td>' + '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
        }
      })
      stocklist += '</table>';
      document.getElementById('interview_list').innerHTML = stocklist;

    } catch (err) {
        console.log(err);
    }
})();

//更に表示
function nextPegination(){
    (async () => {
        try {
            query = query.limit(querySnapshot.docs.length + 10).startAt(querySnapshot.docs[0]);
            querySnapshot = await query.get();
            var i = 0;
            var stocklist = '<table class="table" id="download_table">'
            querySnapshot.forEach((postDoc) => {
              i += 1;
              switch(postDoc.get('Status')){
                  case '面接済み':
                      stocklist += '<tbody class="Already_back"><tr><td>'+ postDoc.get('Status') + '</td><td>' + i + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('Receiver') + '</td><td>' + postDoc.get('Media') + '</td><td>' + postDoc.get('Station') + '</td><td>' + postDoc.get('Name') + '</td><td>' + postDoc.get('Sex') + '</td><td>' + postDoc.get('Age') + '</td><td>' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td>' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td>' + postDoc.get('InterviewPlace') + '</td><td>' + postDoc.get('Dormitory') + '</td><td>' + '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
                      break;
        
                  case '来社せず':
                      stocklist += '<tbody class="notcome_back"><tr><td>'+ postDoc.get('Status') + '</td><td>' + i + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('Receiver') + '</td><td>' + postDoc.get('Media') + '</td><td>' + postDoc.get('Station') + '</td><td>' + postDoc.get('Name') + '</td><td>' + postDoc.get('Sex') + '</td><td>' + postDoc.get('Age') + '</td><td>' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td>' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td>' + postDoc.get('InterviewPlace') + '</td><td>' + postDoc.get('Dormitory') + '</td><td>' + '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>'; 
                      break;
        
                  case '採用':
                      stocklist += '<tbody class="recruit_back"><tr><td>'+ postDoc.get('Status') + '</td><td>' + i + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('Receiver') + '</td><td>' + postDoc.get('Media') + '</td><td>' + postDoc.get('Station') + '</td><td>' + postDoc.get('Name') + '</td><td>' + postDoc.get('Sex') + '</td><td>' + postDoc.get('Age') + '</td><td>' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td>' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td>' + postDoc.get('InterviewPlace') + '</td><td>' + postDoc.get('Dormitory') + '</td><td>' + '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';  
                      break; 
                  
                  case '不採用':
                      stocklist += '<tbody class="norecruit_back"><tr><td>'+ postDoc.get('Status') + '</td><td>' + i + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('Receiver') + '</td><td>' + postDoc.get('Media') + '</td><td>' + postDoc.get('Station') + '</td><td>' + postDoc.get('Name') + '</td><td>' + postDoc.get('Sex') + '</td><td>' + postDoc.get('Age') + '</td><td>' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td>' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td>' + postDoc.get('InterviewPlace') + '</td><td>' + postDoc.get('Dormitory') + '</td><td>' + '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>'; 
                      break;
                  
                  case 'キャンセル':
                      stocklist += '<tbody class="cancel_back"><tr><td>'+ postDoc.get('Status') + '</td><td>' + i + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('Receiver') + '</td><td>' + postDoc.get('Media') + '</td><td>' + postDoc.get('Station') + '</td><td>' + postDoc.get('Name') + '</td><td>' + postDoc.get('Sex') + '</td><td>' + postDoc.get('Age') + '</td><td>' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td>' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td>' + postDoc.get('InterviewPlace') + '</td><td>' + postDoc.get('Dormitory') + '</td><td>' + '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
                      break;
        
                  default:    
                      stocklist += '<tbody><tr><td>'+ postDoc.get('Status') + '</td><td>' + i + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('Receiver') + '</td><td>' + postDoc.get('Media') + '</td><td>' + postDoc.get('Station') + '</td><td>' + postDoc.get('Name') + '</td><td>' + postDoc.get('Sex') + '</td><td>' + postDoc.get('Age') + '</td><td>' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td>' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td>' + postDoc.get('InterviewPlace') + '</td><td>' + postDoc.get('Dormitory') + '</td><td>' + '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
              }
            })
            stocklist += '</table>';
            document.getElementById('interview_list').innerHTML = stocklist;
    
        } catch (err) {
            console.log(err);
        }
    })();
}

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
    document.getElementById('title').innerHTML = "<p>本日の面接</p>";
    (async () => {
        try {
          // 省略 
          // (Cloud Firestoreのインスタンスを初期化してdbにセット)
          var date = new Date();
          var today = date.getFullYear() + '-' + ('00' + (date.getMonth()+1)).slice(-2) + '-' + ('00' + date.getDate()).slice(-2);
          console.log(today);
          query = await db.collection('interview').where('InterviewDate','==',today).orderBy('InterviewTime','desc').limit(10) // firebase.firestore.QuerySnapshotのインスタンスを取得
          querySnapshot = await query.get();
          var i = 0;
          var stocklist = '<table class="table" id="download_table">'
          querySnapshot.forEach((postDoc) => {
            i += 1;
            switch(postDoc.get('Status')){
                case '面接済み':
                    stocklist += '<tbody class="Already_back"><tr><td>'+ postDoc.get('Status') + '</td><td>' + i + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('Receiver') + '</td><td>' + postDoc.get('Media') + '</td><td>' + postDoc.get('Station') + '</td><td>' + postDoc.get('Name') + '</td><td>' + postDoc.get('Sex') + '</td><td>' + postDoc.get('Age') + '</td><td>' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td>' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td>' + postDoc.get('InterviewPlace') + '</td><td>' + postDoc.get('Dormitory') + '</td><td>' + '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
                    break;
    
                case '来社せず':
                    stocklist += '<tbody class="notcome_back"><tr><td>'+ postDoc.get('Status') + '</td><td>' + i + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('Receiver') + '</td><td>' + postDoc.get('Media') + '</td><td>' + postDoc.get('Station') + '</td><td>' + postDoc.get('Name') + '</td><td>' + postDoc.get('Sex') + '</td><td>' + postDoc.get('Age') + '</td><td>' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td>' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td>' + postDoc.get('InterviewPlace') + '</td><td>' + postDoc.get('Dormitory') + '</td><td>' + '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>'; 
                    break;
    
                case '採用':
                    stocklist += '<tbody class="recruit_back"><tr><td>'+ postDoc.get('Status') + '</td><td>' + i + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('Receiver') + '</td><td>' + postDoc.get('Media') + '</td><td>' + postDoc.get('Station') + '</td><td>' + postDoc.get('Name') + '</td><td>' + postDoc.get('Sex') + '</td><td>' + postDoc.get('Age') + '</td><td>' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td>' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td>' + postDoc.get('InterviewPlace') + '</td><td>' + postDoc.get('Dormitory') + '</td><td>' + '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';  
                    break; 
                
                case '不採用':
                    stocklist += '<tbody class="norecruit_back"><tr><td>'+ postDoc.get('Status') + '</td><td>' + i + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('Receiver') + '</td><td>' + postDoc.get('Media') + '</td><td>' + postDoc.get('Station') + '</td><td>' + postDoc.get('Name') + '</td><td>' + postDoc.get('Sex') + '</td><td>' + postDoc.get('Age') + '</td><td>' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td>' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td>' + postDoc.get('InterviewPlace') + '</td><td>' + postDoc.get('Dormitory') + '</td><td>' + '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>'; 
                    break;
                
                case 'キャンセル':
                    stocklist += '<tbody class="cancel_back"><tr><td>'+ postDoc.get('Status') + '</td><td>' + i + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('Receiver') + '</td><td>' + postDoc.get('Media') + '</td><td>' + postDoc.get('Station') + '</td><td>' + postDoc.get('Name') + '</td><td>' + postDoc.get('Sex') + '</td><td>' + postDoc.get('Age') + '</td><td>' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td>' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td>' + postDoc.get('InterviewPlace') + '</td><td>' + postDoc.get('Dormitory') + '</td><td>' + '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
                    break;
    
                default:    
                    stocklist += '<tbody><tr><td>'+ postDoc.get('Status') + '</td><td>' + i + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('Receiver') + '</td><td>' + postDoc.get('Media') + '</td><td>' + postDoc.get('Station') + '</td><td>' + postDoc.get('Name') + '</td><td>' + postDoc.get('Sex') + '</td><td>' + postDoc.get('Age') + '</td><td>' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td>' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td>' + postDoc.get('InterviewPlace') + '</td><td>' + postDoc.get('Dormitory') + '</td><td>' + '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
            }
          })
    
          stocklist += '</table>';
          document.getElementById('interview_list').innerHTML = stocklist;
    
        } catch (err) {
            console.log(err);
        }
    })();
}

//検索
function search(){
    var title = document.getElementById('title');
    var StartDate_search = document.getElementById('StartDate_search').value;
    var EndDate_search = document.getElementById('EndDate_search').value;
    var InterviewDay_search = document.getElementById('InterviewDay_search').value;
    var media_search = document.getElementById('media_search').value;
    var place_obj = document.getElementById('interview_place_search');
    var place_idx = place_obj.selectedIndex;
    var interview_place_search = place_obj.options[place_idx].text;
    var place_input_search = document.getElementById('place_input_search').value;
    (async () => {
        try {
            //面接日での範囲検索
            if(StartDate_search != ""){
                if(EndDate_search != ""){
                    //からまで
                    title.innerHTML = '<p>検索範囲:' + StartDate_search + 'から' + EndDate_search + 'まで</p>';
                    query = await db.collection('interview').where('InterviewDate','>',StartDate_search).where('InterviewDate','<',EndDate_search + 1).orderBy('InterviewDate','desc').orderBy('InterviewTime','desc').limit(10);
                }else{
                    //から
                    title.innerHTML = '<p>検索範囲:' + StartDate_search + 'から</p>';
                    query = await db.collection('interview').where('InterviewDate','>',StartDate_search).orderBy('InterviewDate','desc').orderBy('InterviewTime','desc').limit(10);
                }
            }else{
                if(EndDate_search != ""){
                    //まで
                    title.innerHTML = '<p>検索範囲:' + EndDate_search + 'まで</p>';
                    query = await db.collection('interview').where('InterviewDate','<',EndDate_search + 1).orderBy('InterviewDate','desc').orderBy('InterviewTime','desc').limit(10);
                }else{
                    //検索なし
                }
            }

            //面接日での検索
            if(InterviewDay_search != ""){
                title.innerHTML = '<p>検索日:' + InterviewDay_search + '</p>';
                query = await db.collection('interview').where('InterviewDate','==',InterviewDay_search).orderBy('InterviewTime','desc').limit(10);
            }else{
                //検索なし
            }

            //応募媒体での検索
            if(media_search != ""){
                title.innerHTML = '<p>応募媒体:' + media_search + 'での検索</p>';
                query = await db.collection('interview').orderBy('InterviewDate','desc').orderBy('InterviewTime','desc').orderBy('Media').startAt(media_search).endAt(media_search + '\uf8ff').limit(10);
            }else{
                //検索なし
            }

            //面接場所
            if(interview_place_search != "本部or現地"){
                if(interview_place_search == "本部"){
                    title.innerHTML = '<p>面接場所:本部での検索</p>';
                    query = await db.collection('interview').where('InterviewPlace','==','本部').orderBy('InterviewDate','desc').orderBy('InterviewTime','desc').limit(10);
                }else{
                    title.innerHTML = '<p>面接場所: 現地:'+ place_input_search +'での検索</p>';
                    query = await db.collection('interview').where('InterviewPlace','==','現地:' + place_input_search).orderBy('InterviewDate','desc').orderBy('InterviewTime','desc').limit(10);
                }
            }else{
                //検索なし
            }

            var i = 0;
            var stocklist = '<table class="table" id="download_table">';

            querySnapshot = await query.get();

            querySnapshot.forEach((postDoc) => {
                i += 1;
                switch(postDoc.get('Status')){
                    case '面接済み':
                        stocklist += '<tbody class="Already_back"><tr><td>'+ postDoc.get('Status') + '</td><td>' + i + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('Receiver') + '</td><td>' + postDoc.get('Media') + '</td><td>' + postDoc.get('Station') + '</td><td>' + postDoc.get('Name') + '</td><td>' + postDoc.get('Sex') + '</td><td>' + postDoc.get('Age') + '</td><td>' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td>' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td>' + postDoc.get('InterviewPlace') + '</td><td>' + postDoc.get('Dormitory') + '</td><td>' + '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
                        break;
        
                    case '来社せず':
                        stocklist += '<tbody class="notcome_back"><tr><td>'+ postDoc.get('Status') + '</td><td>' + i + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('Receiver') + '</td><td>' + postDoc.get('Media') + '</td><td>' + postDoc.get('Station') + '</td><td>' + postDoc.get('Name') + '</td><td>' + postDoc.get('Sex') + '</td><td>' + postDoc.get('Age') + '</td><td>' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td>' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td>' + postDoc.get('InterviewPlace') + '</td><td>' + postDoc.get('Dormitory') + '</td><td>' + '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>'; 
                        break;
        
                    case '採用':
                        stocklist += '<tbody class="recruit_back"><tr><td>'+ postDoc.get('Status') + '</td><td>' + i + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('Receiver') + '</td><td>' + postDoc.get('Media') + '</td><td>' + postDoc.get('Station') + '</td><td>' + postDoc.get('Name') + '</td><td>' + postDoc.get('Sex') + '</td><td>' + postDoc.get('Age') + '</td><td>' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td>' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td>' + postDoc.get('InterviewPlace') + '</td><td>' + postDoc.get('Dormitory') + '</td><td>' + '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';  
                        break; 
                    
                    case '不採用':
                        stocklist += '<tbody class="norecruit_back"><tr><td>'+ postDoc.get('Status') + '</td><td>' + i + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('Receiver') + '</td><td>' + postDoc.get('Media') + '</td><td>' + postDoc.get('Station') + '</td><td>' + postDoc.get('Name') + '</td><td>' + postDoc.get('Sex') + '</td><td>' + postDoc.get('Age') + '</td><td>' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td>' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td>' + postDoc.get('InterviewPlace') + '</td><td>' + postDoc.get('Dormitory') + '</td><td>' + '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>'; 
                        break;
                    
                    case 'キャンセル':
                        stocklist += '<tbody class="cancel_back"><tr><td>'+ postDoc.get('Status') + '</td><td>' + i + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('Receiver') + '</td><td>' + postDoc.get('Media') + '</td><td>' + postDoc.get('Station') + '</td><td>' + postDoc.get('Name') + '</td><td>' + postDoc.get('Sex') + '</td><td>' + postDoc.get('Age') + '</td><td>' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td>' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td>' + postDoc.get('InterviewPlace') + '</td><td>' + postDoc.get('Dormitory') + '</td><td>' + '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
                        break;
        
                    default:    
                        stocklist += '<tbody><tr><td>'+ postDoc.get('Status') + '</td><td>' + i + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('Receiver') + '</td><td>' + postDoc.get('Media') + '</td><td>' + postDoc.get('Station') + '</td><td>' + postDoc.get('Name') + '</td><td>' + postDoc.get('Sex') + '</td><td>' + postDoc.get('Age') + '</td><td>' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td>' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td>' + postDoc.get('InterviewPlace') + '</td><td>' + postDoc.get('Dormitory') + '</td><td>' + '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
                }
            });
        
            stocklist += '</table>';
            document.getElementById('interview_list').innerHTML = stocklist;

        } catch (err) {
            console.log(err);
        }
    })();
}

//CSV出力＆ダウンロード
function handleDownload(){
    var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);//文字コードをBOM付きUTF-8に指定
    var table = document.getElementById('download_table');
    var data_csv="";//ここに文字データとして値を格納していく
    data_csv += "状態,番号,受付日,受付者,応募媒体,最寄駅,氏名,性別,年齢,国籍,連絡先,面接日時,面接場所,寮希望,編集\n概要\n\n"; 

    for(var i = 0;  i < table.rows.length; i++){
        for(var j = 0; j < table.rows[i].cells.length; j++){
        data_csv += table.rows[i].cells[j].innerText;//HTML中の表のセル値をdata_csvに格納
        if(j == table.rows[i].cells.length-1) data_csv += "\n";//行終わりに改行コードを追加
        else data_csv += ",";//セル値の区切り文字として,を追加
        }
    }

    var blob = new Blob([ bom, data_csv], { "type" : "text/csv" });//data_csvのデータをcsvとしてダウンロードする関数
    if (window.navigator.msSaveBlob) { //IEの場合の処理
        window.navigator.msSaveBlob(blob, "test.csv"); 
        //window.navigator.msSaveOrOpenBlob(blob, "test.csv");// msSaveOrOpenBlobの場合はファイルを保存せずに開ける
    } else {
        document.getElementById("download").href = window.URL.createObjectURL(blob);
    }

    delete data_csv;//data_csvオブジェクトはもういらないので消去してメモリを開放
}