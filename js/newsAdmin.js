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

//DBへ追加
function Update(){
    //タイトル
    var title = document.getElementById('title').value;
    //日付
    var date = document.getElementById('date').value;
    //カテゴリ
    var category = document.getElementById('category').value;
    //一覧用の写真ファイル名
    var listPhoto = document.getElementById('listPhoto').value;
    //htmlファイル名
    var listfile = document.getElementById('listfile').value;
    //説明文
    var listText = document.getElementById('listText').value;
    if(title == "" || date == "" || category == "" || listPhoto == "" || listText == ""){
        var Alert = document.getElementById('Alert');
        Alert.innerHTML = '<div class="alert alert-danger" role="alert">項目は全て記入してください。</div>';
    }else{
        //DBへ送信
        db.collection('RocksNewsLists').add({
            title:title,
            date:date,
            category:category,
            listPhoto:listPhoto,
            listfile:listfile,
            listText:listText
        });
        var Alert = document.getElementById('Alert');
        Alert.innerHTML = '<div class="alert alert-success" role="alert">保存が完了しました。画面を閉じて終了してください。</div>';
    }
}