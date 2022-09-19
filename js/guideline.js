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
    //ファイル名
    var pdf = document.getElementById('pdfname').files[0];
    if(pdf != null){
        var pdfname = document.getElementById('pdfname').files[0].name;
    }
    //概要
    var overview = document.getElementById('overview').value;
    console.log(pdfname)
    if(title == "" || pdf == null || storeList == ""){
        var Alert = document.getElementById('Alert');
        Alert.innerHTML = '<div class="alert alert-danger" role="alert">項目は全て記入してください。</div>';
    }else{
        //DBへ送信
        db.collection('guidelines').add({
            title:title,
            storename:storeList,
            pdfname:pdfname,
            overview:overview,
            createdAt:firebase.firestore.FieldValue.serverTimestamp(),
        });
        var storageRef = firebase.storage().ref('guidelines/' + pdfname);
        var Alert = document.getElementById('Alert');
        Alert.innerHTML = '<div class="alert alert-success" role="alert">送信中...</div>';
        storageRef.put(pdf).then(function(){
            Alert.innerHTML = '<div class="alert alert-success" role="alert">保存が完了しました。リロードします。</div>';
            setTimeout("location.reload()",2000);
        });
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
          query = await db.collection('guidelines').orderBy('createdAt', 'desc') // firebase.firestore.QuerySnapshotのインスタンスを取得
          querySnapshot = await query.get();
          var i = 0;
          var stocklist = '<table class="table table-striped">'
          stocklist += '<tr><th>作成日</th><th>店舗名</th><th>タイトル</th><th>概要</th><th>編集</th>';
          querySnapshot.forEach((postDoc) => {
            const userIconref = firebase.storage().ref('/guidelines/' + postDoc.get('pdfname'));
            prevTask = Promise.all([prevTask,userIconref.getDownloadURL()]).then(([_,url])=>{
                stocklist += '<tbody><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('storename') + '</td><td>' + postDoc.get('title') + '</td><td>' + postDoc.get('overview') + '</td><td><a href="' + url + '" target = "_blank"><button class="btn btn-success">PDFファイル表示</button></a><a class="js-modal-open1"><button class="btn btn-primary" onclick="editContent(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('pdfname') +'\')">削除</button></td></tr></tbody>';
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
        db.collection('guidelines').doc(id).delete();
        firebase.storage().ref('/guidelines/' + name).delete();
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
    
        query = await db.collection('guidelines'); // firebase.firestore.QuerySnapshotのインスタンスを取得
        //店舗での検索
        if(e != ""){
            query = query.where('storename','array-contains-any',[e,'全店共通']);
        }else{
        }
        console.log(query);
        querySnapshot = await query.orderBy('createdAt', 'desc').get();

        var i = 0;
        var stocklist = '<table class="table table-striped">'
        stocklist += '<tr><th>作成日</th><th>店舗名</th><th>タイトル</th><th>概要</th><th>編集</th>';
        querySnapshot.forEach((postDoc) => {
          const userIconref = firebase.storage().ref('/guidelines/' + postDoc.get('pdfname'));
          var prevTask = Promise.resolve;
          prevTask = Promise.all([prevTask,userIconref.getDownloadURL()]).then(([_,url])=>{
              stocklist += '<tbody><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('storename') + '</td><td>' + postDoc.get('title') + '</td><td>' + postDoc.get('overview') + '</td><td><a href="' + url + '" target = "_blank"><button class="btn btn-success">PDFファイル表示</button></a><a class="js-modal-open1"><button class="btn btn-primary" onclick="editContent(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('pdfname') +'\')">削除</button></td></tr></tbody>';
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

var todayEdit = document.getElementById('today_edit');
var addstoreListEdit = document.getElementById('addstoreList_edit');
var titleEdit = document.getElementById('title_edit');
var overviewEdit = document.getElementById('overview_edit');
//追加店舗
var storeListEdit = [];

//編集用モーダルウィンドウ
function editContent(id){
    (async () => {
        try {
          const carrentDB = await db.collection('guidelines').doc(id).get();
          //発生日時
          todayEdit.textContent = carrentDB.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'});
          storeListEdit.push(carrentDB.get('storename'));
          addstoreListEdit.value = storeListEdit;
          //タイトル
          titleEdit.value = carrentDB.get('title');
          //概要
          overviewEdit.value = carrentDB.get('overview');
          //編集送信ボタン生成
          document.getElementById('edit_submit_button').innerHTML = '<button type="submit" class="btn btn-success" onclick="EditUpdate(\''+id+'\')">送信する</button>';
        } catch (err) {
        console.log(err);
        }
    })();
}

//追加する店舗名リストを作成(編集用)
function addStoreEdit(e){
    storeListEdit.push(e);
    addstoreListEdit.value = storeListEdit;
    document.getElementById('store_name_edit').value = "";
}

//編集内容送信
function EditUpdate(id){
    //ファイル名
    var pdfEdit = document.getElementById('pdfname_edit').files[0];
    console.log(pdfEdit);
    if(pdfEdit != undefined){
        var pdfnameEdit = document.getElementById('pdfname_edit').files[0].name;
        //DBへ送信
        db.collection('guidelines').doc(id).update({
            title:titleEdit.value,
            storename:addstoreListEdit.value,
            pdfname:pdfnameEdit,
            overview:overviewEdit.value,
        });
        var storageRefEdit = firebase.storage().ref('guidelines/' + pdfnameEdit);
        var AlertEdit = document.getElementById('Alert_edit');
        Alert.innerHTML = '<div class="alert alert-success" role="alert">送信中...</div>';
        storageRefEdit.put(pdfEdit).then(function(){
            AlertEdit.innerHTML = '<div class="alert alert-success" role="alert">保存が完了しました。リロードします。</div>';
            setTimeout("location.reload()",2000);
        });
    }else{
        //DBへ送信
        db.collection('guidelines').doc(id).update({
            title:titleEdit.value,
            storename:addstoreListEdit.value,
            overview:overviewEdit.value,
        });
        var AlertEdit = document.getElementById('Alert_edit');
        Alert.innerHTML = '<div class="alert alert-success" role="alert">送信中...</div>';
        AlertEdit.innerHTML = '<div class="alert alert-success" role="alert">保存が完了しました。リロードします。</div>';
        setTimeout("location.reload()",2000);
    }
}

