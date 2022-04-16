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

//本日の日付を初期値に配置
window.onload = function () {
    //今日の日時を表示
    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    document.getElementById("today").textContent = year + "年" + month + "月" + day + "日";
}

//DBへ追加
function equipmentManualUpdate(){
    //タイトル
    var title = document.getElementById('title').value;
    //ファイル名
    var pdf = document.getElementById('pdfname').files[0];
    var pdfname = document.getElementById('pdfname').files[0].name;
    console.log(pdfname)
    if(title == "" || pdf == ""){
        var Alert = document.getElementById('Alert');
        Alert.innerHTML = '<div class="alert alert-danger" role="alert">項目は全て記入してください。</div>';
    }else{
        //DBへ送信
        db.collection('equipmentManuals').add({
            title:title,
            pdfname:pdfname,
            createdAt:firebase.firestore.FieldValue.serverTimestamp(),
        });
        var storageRef = firebase.storage().ref('equipmentManual/' + pdfname);
        storageRef.put(pdf);
        var Alert = document.getElementById('Alert');
        Alert.innerHTML = '<div class="alert alert-success" role="alert">保存が完了しました。リロードします。</div>';
        setTimeout("location.reload()",2000);
    }
}

//テーブル表示(初期値)
(async () => {
    try {
      // 省略 
      // (Cloud Firestoreのインスタンスを初期化してdbにセット)
      var prevTask = Promise.resolve;
      query = await db.collection('equipmentManuals').orderBy('createdAt', 'desc') // firebase.firestore.QuerySnapshotのインスタンスを取得
      querySnapshot = await query.get();
      var i = 0;
      var stocklist = '<table class="table table-striped">'
      stocklist += '<tr><th>作成日</th><th>タイトル</th><th>編集</th>';
      querySnapshot.forEach((postDoc) => {
        const userIconref = firebase.storage().ref('/equipmentManual/' + postDoc.get('pdfname'));
        prevTask = Promise.all([prevTask,userIconref.getDownloadURL()]).then(([_,url])=>{
            stocklist += '<tbody><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('title') + '</td><td><a href="' + url + '" target = "_blank">PDFファイル表示</a></td></tr></tbody>';
            document.getElementById('contentList').innerHTML = stocklist;
            i++;
            if(querySnapshot.length == i){
                stocklist += '</table>';
            }
        }).catch(error => {
            console.log(error);
        }).catch(() => {});
      });
      console.log(stocklist);
    } catch (err) {
        console.log(err);
    }
})();