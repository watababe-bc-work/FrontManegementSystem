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
        stocklist += '<tbody><tr><td>'+ postDoc.get('Status') + '</td><td>' + i + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('Receiver') + '</td><td>' + postDoc.get('Media') + '</td><td>' + postDoc.get('Station') + '</td><td>' + postDoc.get('Name') + '</td><td>' + postDoc.get('Sex') + '</td><td>' + postDoc.get('Age') + '</td><td>' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td>' + postDoc.get('InterviewDay') + '</td><td>' + postDoc.get('InterviewPlace') + '</td><td>' + postDoc.get('Dormitory') + '</td><td>' + '<button>変更</button><button>削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
      })

      stocklist += '</table></div>';
      document.getElementById('interview_list').innerHTML = stocklist;

    } catch (err) {
        console.log(err);
    }
})();

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
    var interview_day = interview_date + " " + interview_time;
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
        InterviewDay:interview_day,
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