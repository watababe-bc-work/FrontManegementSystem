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

//追加する店舗名リストを作成
var storeList = [];
function addStore(e){
    storeList.push(e);
    document.getElementById('addstoreList').innerHTML= "<p>送信店舗一覧:</p><p>" + storeList + "</p>";
    document.getElementById('store_name').value = "";
}

//DBへ追加
function equipmentManualUpdate(){
    //タイトル
    var title = document.getElementById('title').value;
    //全店が選択されているか
    if(document.getElementById('allShop').checked){
        var storename = "全店";
    }else{
        var storename = storeList;
    }
    //ファイル名
    var pdf = document.getElementById('pdfname').files[0];
    if(pdf != null){
        var pdfname = document.getElementById('pdfname').files[0].name;
    }
    //概要
    var overview = document.getElementById('overview').value;
    console.log(pdfname)
    if(title == "" || pdf == null || storename == ""){
        var Alert = document.getElementById('Alert');
        Alert.innerHTML = '<div class="alert alert-danger" role="alert">項目は全て記入してください。</div>';
    }else{
        //DBへ送信
        db.collection('equipmentManuals').add({
            title:title,
            storename:storename,
            pdfname:pdfname,
            overview:overview,
            createdAt:firebase.firestore.FieldValue.serverTimestamp(),
        });
        var storageRef = firebase.storage().ref('equipmentManual/' + pdfname);
        storageRef.put(pdf);
        var Alert = document.getElementById('Alert');
        Alert.innerHTML = '<div class="alert alert-success" role="alert">保存が完了しました。リロードします。</div>';
        setTimeout("location.reload()",2000);
    }
}

//パラメータでのDB表示
const searchParams = decodeURI(window.location.search);
console.log(searchParams);
if(getParam('storename')){
    search(getParam('storename'));
    document.getElementById('store_name_search').value = getParam('storename');
}else{
    //パラメータが特になければテーブル表示
    showDB();
}

//パラメータ取得
function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

//テーブル表示(初期値)
function showDB(){
    (async () => {
        try {
          // 省略 
          // (Cloud Firestoreのインスタンスを初期化してdbにセット)
          document.getElementById('contentList').innerHTML = "<p class='loading'>ロード中...</p>"
          var prevTask = Promise.resolve;
          query = await db.collection('equipmentManuals').orderBy('createdAt', 'desc') // firebase.firestore.QuerySnapshotのインスタンスを取得
          querySnapshot = await query.get();
          var i = 0;
          var stocklist = '<table class="table table-striped">'
          stocklist += '<tr><th>作成日</th><th>店舗名</th><th>タイトル</th><th>概要</th><th>編集</th>';
          querySnapshot.forEach((postDoc) => {
            const userIconref = firebase.storage().ref('/equipmentManual/' + postDoc.get('pdfname'));
            prevTask = Promise.all([prevTask,userIconref.getDownloadURL()]).then(([_,url])=>{
                stocklist += '<tbody><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('storename') + '</td><td>' + postDoc.get('title') + '</td><td>' + postDoc.get('overview') + '</td><td><a href="' + url + '" target = "_blank"><button class="btn btn-success">PDFファイル表示</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('pdfname') +'\')">削除</button></td></tr></tbody>';
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
}

//削除
function deleteContent(id,name){
    var res = window.confirm(name + "の内容を削除しますか？");
    if( res ) {
        db.collection('equipmentManuals').doc(id).delete();
        firebase.storage().ref('/equipmentManual/' + name).delete();
        alert("削除されました。");
        setTimeout("location.reload()",500);
    }
    else {
        // キャンセルならアラートボックスを表示
        alert("キャンセルしました。");
    } 
};

//検索
function search(e){
    (async () => {
        try {
        // 省略 
        // (Cloud Firestoreのインスタンスを初期化してdbにセット)
    
        query = await db.collection('equipmentManuals'); // firebase.firestore.QuerySnapshotのインスタンスを取得

        //店舗での検索
        if(e != ""){
            query = query.where('storename','in',[e,'全店共通']);
        }else{
        }
        console.log(query);
        querySnapshot = await query.orderBy('createdAt', 'desc').get();

        var i = 0;
        var stocklist = '<table class="table table-striped">'
        stocklist += '<tr><th>作成日</th><th>店舗名</th><th>タイトル</th><th>概要</th><th>編集</th>';
        querySnapshot.forEach((postDoc) => {
          const userIconref = firebase.storage().ref('/equipmentManual/' + postDoc.get('pdfname'));
          var prevTask = Promise.resolve;
          prevTask = Promise.all([prevTask,userIconref.getDownloadURL()]).then(([_,url])=>{
              stocklist += '<tbody><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('storename') + '</td><td>' + postDoc.get('title') + '</td><td>' + postDoc.get('overview') + '</td><td><a href="' + url + '" target = "_blank"><button class="btn btn-success">PDFファイル表示</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('pdfname') +'\')">削除</button></td></tr></tbody>';
              document.getElementById('contentList').innerHTML = stocklist;
              i++;
              if(querySnapshot.length == i){
                  stocklist += '</table>';
               }
          }).catch(error => {
              console.log(error);
          }).catch(() => {});
        });
        if(i == 0){
            document.getElementById('contentList').innerHTML = '<p class="NoQuery">指定した店舗宛てのマニュアルはありません。</p>';
        }
        } catch (err) {
            console.log(err);
        }
    })();
}