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


var query="";
var querySnapshot="";
var currentQuerySnapshot = "";
var currentQueryList = [];
var backQueryList = [];
document.getElementById('prevButton').style.visibility = 'hidden';
document.getElementById('nextButton').style.visibility = 'hidden';

//テーブル表示(初期値)
(async () => {
    try {
    // 省略 
    // (Cloud Firestoreのインスタンスを初期化してdbにセット)

    query = await db.collection('reports').orderBy('CreatedAt', 'desc').limit(10); // firebase.firestore.QuerySnapshotのインスタンスを取得
    querySnapshot = await query.get();

    var stocklist = '<table class="table">'
    stocklist += '<tr class="table_title"><th>発生日時</th><th>店舗名</th><th>項目</th><th>フロント名</th><th>処理内容</th><th>機能</th></tr>';
    querySnapshot.forEach((postDoc) => {
        stocklist += '<tbody class="yetBack"><tr><td>'+ postDoc.get('orderDate') +'</td><td>'+ postDoc.get('storeName') +'</td><td>'+ postDoc.get('demand') +'</td><td>' + postDoc.get('requesterName') + '</td><td>'+ postDoc.get('process_content') +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('requesterName') +'\',\''+ postDoc.get('demand') +'\')">削除</button></td></tr></tbody>';
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
            stocklist += '<tr class="table_title"><th>発生日時</th><th>店舗名</th><th>項目</th><th>フロント名</th><th>処理内容</th><th>機能</th></tr>';
            querySnapshot.forEach((postDoc) => {
                stocklist += '<tbody class="yetBack"><tr><td>'+ postDoc.get('orderDate') +'</td><td>'+ postDoc.get('storeName') +'</td><td>'+ postDoc.get('demand') +'</td><td>' + postDoc.get('requesterName') + '</td><td>'+ postDoc.get('process_content') +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('requesterName') +'\',\''+ postDoc.get('demand') +'\')">削除</button></td></tr></tbody>';
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
    stocklist += '<tr class="table_title"><th>発生日時</th><th>店舗名</th><th>項目</th><th>フロント名</th><th>処理内容</th><th>機能</th></tr>';
    querySnapshot.forEach((postDoc) => {
        stocklist += '<tbody class="yetBack"><tr><td>'+ postDoc.get('orderDate') +'</td><td>'+ postDoc.get('storeName') +'</td><td>'+ postDoc.get('demand') +'</td><td>' + postDoc.get('requesterName') + '</td><td>'+ postDoc.get('process_content') +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('requesterName') +'\',\''+ postDoc.get('demand') +'\')">削除</button></td></tr></tbody>';
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
        querySnapshot = await query.orderBy('orderDate', 'desc').get();

        var stocklist = '<table class="table">'
        stocklist += '<tr class="table_title"><th>発生日時</th><th>店舗名</th><th>項目</th><th>フロント名</th><th>処理内容</th><th>機能</th></tr>';
        querySnapshot.forEach((postDoc) => {
            stocklist += '<tbody class="yetBack"><tr><td>'+ postDoc.get('orderDate') +'</td><td>'+ postDoc.get('storeName') +'</td><td>'+ postDoc.get('demand') +'</td><td>' + postDoc.get('requesterName') + '</td><td>'+ postDoc.get('process_content') +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('requesterName') +'\',\''+ postDoc.get('demand') +'\')">削除</button></td></tr></tbody>';
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