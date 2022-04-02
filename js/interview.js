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
    for (var i = 18; i <= 75; i++) {
        option = '<option value="' + i + '">' + i + '歳</option>';
        selectBox.insertAdjacentHTML('beforeend', option);
    };
})();

(function() {
    var selectBox = document.getElementById('age_input_edit');
    var option = '<option value="">年齢を選択する</option>';
    selectBox.insertAdjacentHTML('beforeend', option);
    for (var i = 18; i <= 75; i++) {
        option = '<option value="' + i + '">' + i + '歳</option>';
        selectBox.insertAdjacentHTML('beforeend', option);
    };
})();

var query="";
var querySnapshot="";
var currentQuerySnapshot = "";
var currentTitle = document.getElementById('title').innerHTML;
var currentQueryList = [];
var currentTitleList = [];
var backQueryList = [];
var backQueryTitleList = [];
document.getElementById('prevButton').style.visibility = 'hidden';
document.getElementById('prevTableButton').style.visibility = 'hidden';

//テーブル表示(初期値)
(async () => {
    try {
      // 省略 
      // (Cloud Firestoreのインスタンスを初期化してdbにセット)
  
      query = await db.collection('interview').orderBy('ReceptionDate', 'desc').limit(10) // firebase.firestore.QuerySnapshotのインスタンスを取得
      querySnapshot = await query.get();

      //前回のDBとして保存
      backQueryList.push(querySnapshot);
      backQueryTitleList.push(document.getElementById('title').textContent);
      document.getElementById('prevTableButton').style.visibility = "hidden";

      var i = 0;
      var stocklist = '<table class="table" id="download_table">'
      querySnapshot.forEach((postDoc) => {
        i += 1;
        switch(postDoc.get('Status')){
            case '面接済み':
                stocklist += '<tbody class="Already_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh" class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
                break;

            case '来社せず':
                stocklist += '<tbody class="notcome_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>'; 
                break;

            case '採用':
                stocklist += '<tbody class="recruit_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';  
                break; 
            
            case '不採用':
                stocklist += '<tbody class="norecruit_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>'; 
                break;
            
            case 'キャンセル':
                stocklist += '<tbody class="cancel_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
                break;

            case 'リスケジュール':
                stocklist += '<tbody class="reschedule_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
                break;    

            default:    
                stocklist += '<tbody><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
        }
      })
      stocklist += '</table>';
      document.getElementById('interview_list').innerHTML = stocklist;

    } catch (err) {
        console.log(err);
    }
})();

//全表示ボタン用
function newTable(){
    document.getElementById('title').textContent = "全表示";
    (async () => {
        try {
        //変更前のDB情報を保持しておく
        currentQueryList.push(querySnapshot);
        currentTitleList.push(document.getElementById('title').textContent);

        //前回のDBとして保存
        backQueryList.push(querySnapshot);
        backQueryTitleList.push(document.getElementById('title').textContent);
        document.getElementById('prevTableButton').style.visibility = "visible";

          // 省略 
          // (Cloud Firestoreのインスタンスを初期化してdbにセット)
      
          query = await db.collection('interview').orderBy('ReceptionDate', 'desc').limit(10) // firebase.firestore.QuerySnapshotのインスタンスを取得
          querySnapshot = await query.get();

            //10件以下なら次へを表示しない
            if(querySnapshot.docs.length < 10){
                document.getElementById('nextButton').style.visibility = "hidden";
            }else{
            document.getElementById('nextButton').style.visibility = "visible";
            }

          var i = 0;
          var stocklist = '<table class="table" id="download_table">'
          querySnapshot.forEach((postDoc) => {
            i += 1;
            switch(postDoc.get('Status')){
                case '面接済み':
                    stocklist += '<tbody class="Already_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh" class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
                    break;
    
                case '来社せず':
                    stocklist += '<tbody class="notcome_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>'; 
                    break;
    
                case '採用':
                    stocklist += '<tbody class="recruit_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';  
                    break; 
                
                case '不採用':
                    stocklist += '<tbody class="norecruit_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>'; 
                    break;
                
                case 'キャンセル':
                    stocklist += '<tbody class="cancel_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
                    break;

                case 'リスケジュール':
                    stocklist += '<tbody class="reschedule_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
                    break;       
    
                default:    
                    stocklist += '<tbody><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
            }
          })
          stocklist += '</table>';
          document.getElementById('interview_list').innerHTML = stocklist;
    
        } catch (err) {
            console.log(err);
        }
    })();
}

//更に表示
function nextPegination(){
    document.getElementById('prevButton').style.visibility = 'visible';
    (async () => {
        try {
            //変更前のDB情報を保持しておく
            currentQueryList.push(querySnapshot);
            currentTitleList.push(document.getElementById('title').textContent);

            console.log(currentQueryList);
            console.log(currentTitleList);

            query = query.limit(10).startAfter(querySnapshot.docs[9]);
            querySnapshot = await query.get();

            //後が無い場合に非表示
            if(querySnapshot.docs.length < 10){
                document.getElementById('nextButton').style.visibility = "hidden";
            }

            var i = 0;
            var stocklist = '<table class="table" id="download_table">'
            querySnapshot.forEach((postDoc) => {
              i += 1;
              switch(postDoc.get('Status')){
                  case '面接済み':
                      stocklist += '<tbody class="Already_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
                      break;
        
                  case '来社せず':
                      stocklist += '<tbody class="notcome_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>'; 
                      break;
        
                  case '採用':
                      stocklist += '<tbody class="recruit_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';  
                      break; 
                  
                  case '不採用':
                      stocklist += '<tbody class="norecruit_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>'; 
                      break;
                  
                  case 'キャンセル':
                      stocklist += '<tbody class="cancel_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
                      break;

                    case 'リスケジュール':
                    stocklist += '<tbody class="reschedule_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
                    break;       
        
                  default:    
                      stocklist += '<tbody><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
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
    var sex = document.getElementById('sex').value;
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
    var interview_place = document.getElementById('interview_place_input').value;
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
    var collectAlert = document.getElementById('collectAlert');
    collectAlert.innerHTML = '<div class="alert alert-success" role="alert">編集完了!リロードします。</div>';
    
    //追加した際に検索内容を保持したまま更新
    if(document.getElementById('title').textContent == "本日の面接"){
        setTimeout("TodayInterview();",2000);
        console.log('ok');
    }else if(document.getElementById('title').textContent == "全表示"){
        setTimeout("location.reload()",2000);
    }else{
        setTimeout("search();",2000);
    }
    $('.js-modal').fadeOut();
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
            var sex_elements = document.getElementById('sex_edit');

            switch(carrentinterviewDB.get('Sex')){
                case '男性':
                    sex_elements.options[1].selected = true;
                    break;
                case '女性':
                    sex_elements.options[2].selected = true;
                    break;
                case 'その他':
                    sex_elements.options[3].selected = true;   
                    break;
                default:
                    sex_elements.options[0].selected = true;
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
            document.getElementById('interview_place_edit_input').value = carrentinterviewDB.get('InterviewPlace');

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
    var sex = document.getElementById('sex_edit').value;
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
    var interview_place = document.getElementById('interview_place_edit_input').value;

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
    var collectAlert = document.getElementById('collectAlert1');
    collectAlert.innerHTML = '<div class="alert alert-success" role="alert">編集完了!リロードします。</div>';
    setTimeout("location.reload()",2000);
}

//状態がFocusされたら値をリセット
var resetStatus = document.getElementById('status_input_edit');
resetStatus.addEventListener('focus', (event) => {
    event.target.value= '';
});

var resetMedia = document.getElementById('media_input_edit')
resetMedia.addEventListener('focus', (event) => {
    event.target.value= '';
});

var resetMedia = document.getElementById('interview_place_edit_input')
resetMedia.addEventListener('focus', (event) => {
    event.target.value= '';
});


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
    
    document.getElementById('title').textContent = "本日の面接";
    console.log(document.getElementById('title').textContent);
    (async () => {
        try {
            //変更前のDB情報を保持しておく
            currentQueryList.push(querySnapshot);
            currentTitleList.push(document.getElementById('title').textContent);
            //前回のDBとして保存
            backQueryList.push(querySnapshot);
            backQueryTitleList.push(document.getElementById('title').textContent); 
            document.getElementById('prevTableButton').style.visibility = "visible";

          // 省略 
          // (Cloud Firestoreのインスタンスを初期化してdbにセット)
          var date = new Date();
          var today = date.getFullYear() + '-' + ('00' + (date.getMonth()+1)).slice(-2) + '-' + ('00' + date.getDate()).slice(-2);
          query = await db.collection('interview').where('InterviewDate','==',today).orderBy('InterviewTime','desc').limit(10) // firebase.firestore.QuerySnapshotのインスタンスを取得
          querySnapshot = await query.get();

          //10件以下なら次へを表示しない
          if(querySnapshot.docs.length < 10){
                document.getElementById('nextButton').style.visibility = "hidden";
          }else{
            document.getElementById('nextButton').style.visibility = "visible";
          }

          var i = 0;
          var stocklist = '<table class="table" id="download_table">'
          querySnapshot.forEach((postDoc) => {
            i += 1;
            switch(postDoc.get('Status')){
                case '面接済み':
                    stocklist += '<tbody class="Already_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
                    break;
    
                case '来社せず':
                    stocklist += '<tbody class="notcome_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>'; 
                    break;
    
                case '採用':
                    stocklist += '<tbody class="recruit_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';  
                    break; 
                
                case '不採用':
                    stocklist += '<tbody class="norecruit_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>'; 
                    break;
                
                case 'キャンセル':
                    stocklist += '<tbody class="cancel_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
                    break;

                case 'リスケジュール':
                    stocklist += '<tbody class="reschedule_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
                    break;   
    
                default:    
                    stocklist += '<tbody><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
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
    var place = document.getElementById('interview_place_search_input').value;
    var status = document.getElementById('status_input_search').value;
    var DateBoolean = false;
    var titleContent = '';
    (async () => {
        try {
            //変更前のDB情報を保持しておく
            currentQueryList.push(querySnapshot);
            currentTitleList.push(document.getElementById('title').textContent);
            //前回のDBとして保存
            backQueryList.push(querySnapshot);
            backQueryTitleList.push(document.getElementById('title').textContent);
            document.getElementById('prevTableButton').style.visibility = "visible";

            query = await db.collection('interview');
            
            //面接日での範囲検索
            if(StartDate_search != ""){
                if(EndDate_search != ""){
                    //からまで
                    titleContent += '検索範囲:' + StartDate_search + '~' + EndDate_search + 'まで';
                    query = query.where('InterviewDate','>',StartDate_search).where('InterviewDate','<',EndDate_search + 1);
                }else{
                    //から
                    titleContent += '検索範囲:' + StartDate_search + '~';
                    query = query.where('InterviewDate','>',StartDate_search);
                }
            }else{
                if(EndDate_search != ""){
                    //まで
                    titleContent += '検索範囲:' + EndDate_search + 'まで';
                    query = query.where('InterviewDate','<',EndDate_search + 1);
                }else{
                    //検索なし
                }
            }

            //面接日での検索
            if(InterviewDay_search != ""){
                DateBoolean = true;
                titleContent += '検索日:' + InterviewDay_search;
                query = query.where('InterviewDate','==',InterviewDay_search);
            }else{
                //検索なし
            }

            //面接場所
            switch(place){
                case '本部':
                    titleContent += '面接場所:本部';
                    query = query.where('InterviewPlace','==','本部');
                    break;
                case 'イフ':
                    titleContent += '面接場所:イフ';
                    query = query.where('InterviewPlace','==','イフ');  
                    break;
                case 'ZALA':
                    titleContent += '面接場所:ZALA';
                    query = query.where('InterviewPlace','==','ZALA');  
                    break;    
                case 'センチュリー':
                    titleContent += '面接場所:センチュリー';
                    query = query.where('InterviewPlace','==','センチュリー');  
                    break;  
                case 'ファイヤー':
                    titleContent += '面接場所:ファイヤー';
                    query = query.where('InterviewPlace','==','ファイヤー');  
                    break; 
                case 'ファイヤー':
                    titleContent += '面接場所:アジアン';
                    query = query.where('InterviewPlace','==','アジアン');  
                    break;     
                default:
                    //検索なし
                    break;       
            }

            //状態
            switch(status){
                case '面接前':
                    titleContent += '状態：面接前';
                    query = query.where('Status','==','面接前');
                    break;
                case '面接済み':
                    titleContent += '状態：面接済み';
                    query = query.where('Status','==','面接済み');
                    break; 
                case '来社せず':
                    titleContent += '状態：来社せず';
                    query = query.where('Status','==','来社せず');
                    break;   
                case '採用':
                    titleContent += '状態：採用';
                    query = query.where('Status','==','採用');
                    break;   
                case '不採用':
                    titleContent += '状態：不採用';
                    query = query.where('Status','==','不採用');
                    break; 
                case 'キャンセル':
                    titleContent += '状態：キャンセル';
                    query = query.where('Status','==','キャンセル');
                    break;   
                case 'リスケジュール':
                    titleContent += '状態：リスケジュール';
                    query = query.where('Status','==','リスケジュール');
                    break; 
                case '':
                    //検索なし
                    break;  
                default:
                    titleContent += '状態：'+ status;
                    query = query.where('Status','==',status);
                    break;      
            }

            if(DateBoolean == true){
                query = query.orderBy('InterviewTime','desc').limit(10);
            }else{
                //応募媒体での検索
                if(media_search != ""){
                    //応募媒体での検索
                    titleContent += '応募媒体:' + media_search;
                    query = query.where('Media', '>=', media_search).where('Media', '<=', media_search).orderBy('Media');
                }
                query = query.orderBy('InterviewDate','desc').orderBy('InterviewTime','desc').limit(10);
            }

            //混合したタイトルを表示
            title.textContent = titleContent + " の検索";

            var i = 0;
            var stocklist = '<table class="table" id="download_table">';

            querySnapshot = await query.get();

            //10件以下なら次へを表示しない
            if(querySnapshot.docs.length < 10){
                document.getElementById('nextButton').style.visibility = "hidden";
            }else{

            }

            querySnapshot.forEach((postDoc) => {
                i += 1;
                switch(postDoc.get('Status')){
                    case '面接済み':
                        stocklist += '<tbody class="Already_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
                        break;
        
                    case '来社せず':
                        stocklist += '<tbody class="notcome_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>'; 
                        break;
        
                    case '採用':
                        stocklist += '<tbody class="recruit_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';  
                        break; 
                    
                    case '不採用':
                        stocklist += '<tbody class="norecruit_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>'; 
                        break;
                    
                    case 'キャンセル':
                        stocklist += '<tbody class="cancel_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
                        break;

                    case 'リスケジュール':
                        stocklist += '<tbody class="reschedule_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
                        break;      
        
                    default:    
                        stocklist += '<tbody><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
                }
            });
        
            stocklist += '</table>';
            document.getElementById('interview_list').innerHTML = stocklist;

        } catch (err) {
            console.log(err);
        }
    })();
}

function ResetSearch(){
    document.getElementById('StartDate_search').value = "";
    document.getElementById('EndDate_search').value = "";
    document.getElementById('InterviewDay_search').value = "";
    document.getElementById('media_search').value = "";
    document.getElementById('interview_place_search').value = "";
    document.getElementById('status_input_search').value = "";
    document.getElementById('interview_place_search_input').value = "";
};

//前のテーブルを表示
function returnTable(){
    document.getElementById('nextButton').style.visibility = 'visible';
    querySnapshot = currentQueryList.pop();

    var i = 0;
    var stocklist = '<table class="table" id="download_table">';
    document.getElementById('title').textContent = currentTitleList.pop();
    querySnapshot.forEach((postDoc) => {
        i += 1;
        switch(postDoc.get('Status')){
            case '面接済み':
                stocklist += '<tbody class="Already_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
                break;

            case '来社せず':
                stocklist += '<tbody class="notcome_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>'; 
                break;

            case '採用':
                stocklist += '<tbody class="recruit_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';  
                break; 
            
            case '不採用':
                stocklist += '<tbody class="norecruit_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>'; 
                break;
            
            case 'キャンセル':
                stocklist += '<tbody class="cancel_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
                break;
            
            case 'リスケジュール':
                stocklist += '<tbody class="reschedule_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
                break;  

            default:    
                stocklist += '<tbody><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
        }
    });

    stocklist += '</table>';
    document.getElementById('interview_list').innerHTML = stocklist;

    //前が無くなったら前へを非表示
    if(currentQueryList.length < 1){
        document.getElementById('prevButton').style.visibility = 'hidden';
    }
}

//前回検索結果のDBを表示
function prevTable(){
    querySnapshot = backQueryList.pop();

    var i = 0;
    var stocklist = '<table class="table" id="download_table">';
    document.getElementById('title').textContent = backQueryTitleList.pop();
    querySnapshot.forEach((postDoc) => {
        i += 1;
        switch(postDoc.get('Status')){
            case '面接済み':
                stocklist += '<tbody class="Already_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
                break;

            case '来社せず':
                stocklist += '<tbody class="notcome_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>'; 
                break;

            case '採用':
                stocklist += '<tbody class="recruit_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';  
                break; 
            
            case '不採用':
                stocklist += '<tbody class="norecruit_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>'; 
                break;
            
            case 'キャンセル':
                stocklist += '<tbody class="cancel_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
                break;
            
            case 'リスケジュール':
                stocklist += '<tbody class="reschedule_back"><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
                break;  

            default:    
                stocklist += '<tbody><tr><td class="center">'+ postDoc.get('Status') + '</td><td class="center">' + i + '</td><td class="center">' + postDoc.get('Receiver') + '</td><td class="bigTh">' + postDoc.get('Media') + '</td><td class="center">' + postDoc.get('Station') + '</td><td class="bigTh_name">' + postDoc.get('Name') + '</td><td class="center">' + postDoc.get('Sex') + '</td><td class="center">' + postDoc.get('Age') + '</td><td class="center">' + postDoc.get('Nationality') + '</td><td>' + postDoc.get('Tel') + '</td><td class="bigTh_interviewDate">' + postDoc.get('InterviewDate') + "  " + postDoc.get('InterviewTime') + '</td><td class="bigTh center">' + postDoc.get('InterviewPlace') + '</td><td class="center">' + postDoc.get('Dormitory') + '</td><td>' + postDoc.get('ReceptionDate').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td class="center">' +  '<a class="js-modal-open2"><button class="btn btn-success" onclick="EditContent(\''+postDoc.id+'\')">変更</button></a><button class="btn btn-danger" onClick="DeleteContent(\''+postDoc.id+'\',\''+ i +'\')">削除</button>' +'</td></tr><tr><td colspan="15" class="notice">' + postDoc.get('Notice') + '</td></tr><tr><td colspan="15"></td></tr></tbody>';
        }
    });

    stocklist += '</table>';
    document.getElementById('interview_list').innerHTML = stocklist;

    if(backQueryList.length == 0){
        document.getElementById('prevTableButton').style.visibility = "hidden";
    }else{

    }
}

//CSV出力＆ダウンロード
function handleDownload(){
    var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);//文字コードをBOM付きUTF-8に指定
    var table = document.getElementById('download_table');
    var data_csv="";//ここに文字データとして値を格納していく
    data_csv += "状態,番号,受付者,応募媒体,最寄駅,氏名,性別,年齢,国籍,連絡先,面接日時,面接場所,寮希望,受付日,概要\n\n"; 

    for(var i = 0;  i < table.rows.length; i++){
        for(var j = 0; j < table.rows[i].cells.length -1; j++){
        //data_csv += table.rows[i].cells[j].innerText;//HTML中の表のセル値をdata_csvに格納
        data_csv += table.rows[i].cells[j].innerText;
        if(j == table.rows[i].cells.length-2){
            data_csv += ",";
            data_csv += table.rows[i + 1].cells[0].innerText;
            data_csv += "\n";
        }
        else {
            data_csv += ",";//セル値の区切り文字として,を追加
        }
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