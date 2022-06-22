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
    
    var toTwoDigits = function (num, digit) {
        num += ''
        if (num.length < digit) {
        num = '0' + num
        }
        return num
    }
    
    var yyyy = toTwoDigits(year, 4)
    var mm = toTwoDigits(month, 2)
    var dd = toTwoDigits(day, 2)
    var ymd = yyyy + "-" + mm + "-" + dd;
    
    document.getElementById("order_date").value = ymd;
}

var query="";
var querySnapshot="";
var currentQuerySnapshot = "";
var currentQueryList = [];
var backQueryList = [];
document.getElementById('prevButton').style.visibility = 'hidden';
document.getElementById('nextButton').style.visibility = 'hidden';

//フォームの初期非表示
document.getElementById('addForm').style.display = "none";

//ボタンpushでフォーム表示
function addContent(){
    document.getElementById('addForm').style.display = "block";
}

//追加
function Update(){
    var collectAlert = document.getElementById('collectAlert');
    collectAlert.innerHTML = '<div class="alert alert-success" role="alert">送信中...</div>';
    //発生日時
    var orderDate = document.getElementById('order_date').value;
    //店舗名
    var storeName = document.getElementById('store_name').value;
    //フロント名
    var requesterName = document.getElementById('requester_name').value;
    //項目
    var demand = document.getElementById('demand_input').value;
    //処理内容
    var process_content = document.getElementById('process_content').value;

    //DBへ送信
    db.collection('reports').add({
        orderDate:orderDate,
        storeName:storeName,
        requesterName:requesterName,
        demand:demand,
        process_content:process_content,
        CreatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    var collectAlert = document.getElementById('collectAlert');
    collectAlert.innerHTML = '<div class="alert alert-success" role="alert">編集完了!リロードします。</div>';
    setTimeout("location.reload()",2000);
}

//table表示
function showTable(){
    var store = document.getElementById('store_name_search').value;
    var query="";
    var querySnapshot="";

    //テーブル表示(初期値)
    (async () => {
        try {
        // 省略 
        // (Cloud Firestoreのインスタンスを初期化してdbにセット)
    
        query = await db.collection('reports').where('storeName','==',store).orderBy('CreatedAt', 'desc').limit(10); // firebase.firestore.QuerySnapshotのインスタンスを取得
        querySnapshot = await query.get();

        var stocklist = '<table class="table">'
        stocklist += '<tr class="table_title"><th>発生日時</th><th>項目</th><th>フロント名</th><th>処理内容</th><th>機能</th></tr>';
        querySnapshot.forEach((postDoc) => {
            stocklist += '<tbody class="yetBack"><tr><td>'+ postDoc.get('orderDate') +'</td><td>'+ postDoc.get('demand') +'</td><td>' + postDoc.get('requesterName') + '</td><td>'+ postDoc.get('process_content') +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('requesterName') +'\',\''+ postDoc.get('demand') +'\')">削除</button></td></tr></tbody>';
        })
        stocklist += '</table>';
        document.getElementById('table_list').innerHTML = stocklist;

        //後が無い場合に非表示
        if(querySnapshot.docs.length < 10){
            document.getElementById('nextButton').style.visibility = "hidden";
        }else{
            document.getElementById('nextButton').style.visibility = "";
        }

        } catch (err) {
            console.log(err);
        }
    })();
}

//次へ
function nextPegination(){
    document.getElementById('prevButton').style.visibility = 'visible';
    (async () => {
        try {
            //変更前のDB情報を保持しておく
            currentQueryList.push(querySnapshot);
  
            console.log(currentQueryList);
  
            query = query.limit(10).startAfter(querySnapshot.docs[9]);
            querySnapshot = await query.get();
  
            //後が無い場合に非表示
            if(querySnapshot.docs.length < 10){
                document.getElementById('nextButton').style.visibility = "hidden";
            }
  
            var stocklist = '<table class="table">'
            stocklist += '<tr class="table_title"><th>発生日時</th><th>項目</th><th>フロント名</th><th>処理内容</th><th>機能</th></tr>';
            querySnapshot.forEach((postDoc) => {
                stocklist += '<tbody class="yetBack"><tr><td>'+ postDoc.get('orderDate') +'</td><td>'+ postDoc.get('demand') +'</td><td>' + postDoc.get('requesterName') + '</td><td>'+ postDoc.get('process_content') +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('requesterName') +'\',\''+ postDoc.get('demand') +'\')">削除</button></td></tr></tbody>';
            })
            stocklist += '</table>';
            document.getElementById('table_list').innerHTML = stocklist;
    
        } catch (err) {
            console.log(err);
        }
    })();
  }
  
  //前のテーブルを表示
  function returnTable(){
    document.getElementById('nextButton').style.visibility = 'visible';
    querySnapshot = currentQueryList.pop();
  
    var stocklist = '<table class="table">'
    stocklist += '<tr class="table_title"><th>発生日時</th><th>項目</th><th>フロント名</th><th>処理内容</th><th>機能</th></tr>';
    querySnapshot.forEach((postDoc) => {
        stocklist += '<tbody class="yetBack"><tr><td>'+ postDoc.get('orderDate') +'</td><td>'+ postDoc.get('demand') +'</td><td>' + postDoc.get('requesterName') + '</td><td>'+ postDoc.get('process_content') +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('requesterName') +'\',\''+ postDoc.get('demand') +'\')">削除</button></td></tr></tbody>';
    })
    stocklist += '</table>';
    document.getElementById('table_list').innerHTML = stocklist;
  
    //前が無くなったら前へを非表示
    if(currentQueryList.length < 1){
        document.getElementById('prevButton').style.visibility = 'hidden';
    }
}

//編集用モーダルウィンドウ
function editStatus(id){
    (async () => {
      try {
        const carrentDB = await db.collection('reports').doc(id).get();
        //発生日時
        document.getElementById('order_date_edit').textContent = carrentDB.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'});
        //フロント名
        document.getElementById('requester_name_edit').value = carrentDB.get('requesterName');
        //項目
        document.getElementById('demand_input_edit').value = carrentDB.get('demand');
        //処理内容
        document.getElementById('process_content_edit').value = carrentDB.get('process_content');
        //編集送信ボタン生成
        document.getElementById('edit_submit_button').innerHTML = '<button type="submit" class="btn btn-success" onclick="EditUpdate(\''+id+'\')">送信する</button>';
      } catch (err) {
      console.log(err);
      }
  })();
}

//編集内容DB送信
function EditUpdate(id){
    //フロント名
    var requesterName = document.getElementById('requester_name_edit').value;
    //項目
    var demand = document.getElementById('demand_input_edit').value;
    //処理内容
    var process_content = document.getElementById('process_content_edit').value;

    //DBへ送信
    db.collection('reports').doc(id).update({
        requesterName:requesterName,
        demand:demand,
        process_content:process_content,
    });

    var collectAlert = document.getElementById('collectAlert_edit');
    collectAlert.innerHTML = '<div class="alert alert-success" role="alert">編集完了!リロードします。</div>';
    setTimeout("location.reload()",2000);
}

//検索
function search(){
    var store = document.getElementById('store_name_search').value;
    var demand = document.getElementById('demand_input_search').value;
    var StartDate_search = document.getElementById('StartDate_search').value;
    var EndDate_search = document.getElementById('EndDate_search').value;
    (async () => {
        try {
        // 省略 
        // (Cloud Firestoreのインスタンスを初期化してdbにセット)
    
        query = await db.collection('reports'); // firebase.firestore.QuerySnapshotのインスタンスを取得

        //店舗での検索
        if(store != ""){
            query = query.where('storeName','==',store);
            console.log(store);
        }else{
        }

        //項目での検索
        if(demand != ''){
            query = query.where('demand','==',demand);
        }else{
        }

        //日時での範囲検索
        if(StartDate_search != ""){
            if(EndDate_search != ""){
                //からまで
                query = query.where('orderDate','>=',StartDate_search).where('orderDate','<',EndDate_search + 1);
            }else{
                //から
                query = query.where('orderDate','>=',StartDate_search);
            }
        }else{
            if(EndDate_search != ""){
                //まで
                query = query.where('orderDate','<',EndDate_search + 1);
            }else{
                //検索なし
            }
        }
        console.log(query);
        querySnapshot = await query.orderBy('CreatedAt', 'desc').get();

        //前回のDBとして保存
        backQueryList.push(querySnapshot);

        var stocklist = '<table class="table">'
        stocklist += '<tr class="table_title"><th>発生日時</th><th>項目</th><th>フロント名</th><th>処理内容</th><th>機能</th></tr>';
        querySnapshot.forEach((postDoc) => {
            stocklist += '<tbody class="yetBack"><tr><td>'+ postDoc.get('orderDate') +'</td><td>'+ postDoc.get('demand') +'</td><td>' + postDoc.get('requesterName') + '</td><td>'+ postDoc.get('process_content') +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('requesterName') +'\',\''+ postDoc.get('demand') +'\')">削除</button></td></tr></tbody>';
        })
        stocklist += '</table>';
        document.getElementById('table_list').innerHTML = stocklist;

        //検索なので次を表示しない
        document.getElementById('nextButton').style.visibility = "hidden";

        } catch (err) {
            console.log(err);
        }
    })();
}

//検索欄キャンセル
function cancel(){
    setTimeout("location.reload()");
}

//削除
function deleteContent(id,name,demand){
    var res = window.confirm(name + "さんの"+ demand +"申請を削除しますか？");
    if( res ) {
        db.collection('reports').doc(id).delete();
        alert("削除されました。");
        setTimeout("location.reload()",500);
    }
    else {
        // キャンセルならアラートボックスを表示
        alert("キャンセルしました。");
    } 
};