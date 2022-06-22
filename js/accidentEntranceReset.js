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
var addForm = false;

//ボタンpushでフォーム表示
function addContent(){
    if(addForm){
        document.getElementById('addForm').style.display = "none";
        document.getElementById('addButton').textContent = "+事故報告申請をする";
        addForm = false;
    }else{
        document.getElementById('addForm').style.display = "block";
        document.getElementById('addButton').textContent = "-事故報告申請を閉じる";
        addForm = true;
    }
}

//写真添付の画像数判定
function checkImageCount(inputElement){
    // ファイルリストを取得
    var fileList = inputElement.files;
    // ファイルの数を取得
    var fileCount = fileList.length;
    var collectAlert = document.getElementById('collectAlert');
    if(fileCount > 4){
        collectAlert.innerHTML = '<div class="alert alert-danger" role="alert">画像枚数は4枚以下にして下さい。</div>';
    }else{
        collectAlert.innerHTML = '';
    }
}

//追加
function Update(){
    var collectAlert = document.getElementById('collectAlert');
    collectAlert.innerHTML = '<div class="alert alert-success" role="alert">送信中...</div>';
    //発生日時
    var orderDate = document.getElementById('order_date').value;
    //店舗名
    var storeName = document.getElementById('store_name').value;
    //依頼区分
    var orderCategory = document.getElementById('order_category').value;
    //依頼者氏名
    var requesterName = document.getElementById('requester_name').value;
    //指示者氏名
    var orderPersonName = document.getElementById('orderPerson_name').value;
    //部屋番号
    var place = document.getElementById('place').value;
    //in時間
    var inTime = document.getElementById('inTime').value;
    //out時間/取り消し時間
    var outTime = document.getElementById('outTime').value;
    //プラン/金額
    var planAndprice = document.getElementById('planAndprice').value;
    //訂正
    var correction = document.getElementById('correction').value;
    //件数
    var number = document.getElementById('count').value;
    //金額
    var price = document.getElementById('price').value;
    //出勤その他
    var withdrawal = document.getElementById('withdrawal').value;
    //入金その他
    var moneyReceived = document.getElementById('moneyReceived').value;
    //状況説明
    var status_desc = document.getElementById('status_desc').value;
    //処理内容
    var process_content = document.getElementById('process_content').value;
    //写真データ
    var fileList = [];
    var fileNameList = [];

    (async () => {
        try{
            //写真アップロード
            let files = document.getElementById('file').files;
            for (let file of files) {
                if(fileNameList.includes(file.name)){

                }else{
                    fileList.push(file);
                    fileNameList.push(file.name);
                    console.log(fileList);
                }
            }
            //DBへ送信
            var res = await db.collection('AccidentAndCancel').add({
                orderDate: orderDate,
                storeName:storeName,
                orderCategory:orderCategory,
                requesterName:requesterName,
                orderPersonName:orderPersonName,
                place:place,
                inTime:inTime,
                outTime:outTime,
                planAndprice:planAndprice,
                correction:correction,
                number:number,
                price:price,
                withdrawal:withdrawal,
                moneyReceived:moneyReceived,
                status_desc:status_desc,
                process_content:process_content,
                headquartersComment:'',
                photoCount:fileList.length,
                CreatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
            var uploads = [];
            var i = 0;
            for (var file of fileList) {
                //画像を圧縮する
                var img = new Compressor(file, {
                    quality: 0.5,
                    success(result) {
                        console.log('圧縮完了');
                        fileList[i] = result;
                    },
                    maxWidth:1000,
                    maxHeight: 400,
                    mimeType: 'image/png'
                });
                var storageRef = firebase.storage().ref('accidentEntranceReset/' + res.id + '/' + 'uploadImage' + i);
                uploads.push(storageRef.put(fileList[i])); 
                i += 1;
            }
            //すべての画像のアップロード完了を待つ
            Promise.all(uploads).then(function () {
                (async () => {
                    try{
                        console.log('アップロード完了');
                        collectAlert.innerHTML = '<div class="alert alert-success" role="alert">編集完了!リロードします。</div>';
                        setTimeout("location.reload()",2000);
                    } catch(err){

                    }
                })();
            });

        } catch(err){

        }
    })();
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
    
        query = await db.collection('AccidentAndCancel').where('storeName','==',store).orderBy('orderDate', 'desc').limit(10); // firebase.firestore.QuerySnapshotのインスタンスを取得
        querySnapshot = await query.get();

        var stocklist = '<table class="table">'
        stocklist += '<tr class="table_title"><th>発生日時</th><th>依頼区分</th><th>依頼者</th><th>指示者</th><th>部屋番号</th><th>IN時間</th><th>OUT時間</th><th>利用プラン/金額</th><th>日報訂正</th><th>機能</th><tr class="table_title"><th colspan = "5">状況説明</th><th colspan = "6">本部コメント</th></tr>';
        querySnapshot.forEach((postDoc) => {
            stocklist += '<tbody class="yetBack"><tr><td>'+ postDoc.get('orderDate') +'</td><td>' + postDoc.get('orderCategory') + '</td><td>' + postDoc.get('requesterName') + '</td><td>' + postDoc.get('orderPersonName') + '</td><td>'+ postDoc.get('place') +'</td><td>'+ postDoc.get('inTime') +'</td><td>'+ postDoc.get('outTime') +'</td><td>'+ postDoc.get('planAndprice') +'</td><td>'+ postDoc.get('correction') +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><a class="js-modal-open1"><button class="btn btn-primary" onclick="modalImages(\''+postDoc.id+'\')">画像</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('requesterName') +'\',\''+ postDoc.get('place') +'\')">削除</button></td></tr><tr><td colspan = "5">'+ postDoc.get('status_desc') +'</td><td colspan = "6">'+ postDoc.get('headquartersComment') +'</td></tr></tbody>';
        });
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
            stocklist += '<tr class="table_title"><th>発生日時</th><th>依頼区分</th><th>依頼者</th><th>指示者</th><th>部屋番号</th><th>IN時間</th><th>OUT時間</th><th>利用プラン/金額</th><th>日報訂正</th><th>状態</th><th>機能</th><tr class="table_title"><th colspan = "5">状況説明</th><th colspan = "7">本部コメント</th></tr>';
            querySnapshot.forEach((postDoc) => {
                stocklist += '<tbody class="yetBack"><tr><td>'+ postDoc.get('orderDate') +'</td><td>' + postDoc.get('orderCategory') + '</td><td>' + postDoc.get('requesterName') + '</td><td>' + postDoc.get('orderPersonName') + '</td><td>'+ postDoc.get('place') +'</td><td>'+ postDoc.get('inTime') +'</td><td>'+ postDoc.get('outTime') +'</td><td>'+ postDoc.get('planAndprice') +'</td><td>'+ postDoc.get('correction') +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><a class="js-modal-open1"><button class="btn btn-primary" onclick="modalImages(\''+postDoc.id+'\')">画像</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('requesterName') +'\',\''+ postDoc.get('place') +'\')">削除</button></td></tr><tr><td colspan = "5">'+ postDoc.get('status_desc') +'</td><td colspan = "6">'+ postDoc.get('headquartersComment') +'</td></tr></tbody>';
            });
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
    stocklist += '<tr class="table_title"><th>発生日時</th><th>依頼区分</th><th>依頼者</th><th>指示者</th><th>部屋番号</th><th>IN時間</th><th>OUT時間</th><th>利用プラン/金額</th><th>日報訂正</th><th>状態</th><th>機能</th><tr class="table_title"><th colspan = "5">状況説明</th><th colspan = "7">本部コメント</th></tr>';
    querySnapshot.forEach((postDoc) => {
        stocklist += '<tbody class="yetBack"><tr><td>'+ postDoc.get('orderDate') +'</td><td>' + postDoc.get('orderCategory') + '</td><td>' + postDoc.get('requesterName') + '</td><td>' + postDoc.get('orderPersonName') + '</td><td>'+ postDoc.get('place') +'</td><td>'+ postDoc.get('inTime') +'</td><td>'+ postDoc.get('outTime') +'</td><td>'+ postDoc.get('planAndprice') +'</td><td>'+ postDoc.get('correction') +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><a class="js-modal-open1"><button class="btn btn-primary" onclick="modalImages(\''+postDoc.id+'\')">画像</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('requesterName') +'\',\''+ postDoc.get('place') +'\')">削除</button></td></tr><tr><td colspan = "5">'+ postDoc.get('status_desc') +'</td><td colspan = "6">'+ postDoc.get('headquartersComment') +'</td></tr></tbody>';
    });
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
        const carrentDB = await db.collection('AccidentAndCancel').doc(id).get();
        //発生日時
        document.getElementById('order_date_edit').textContent = carrentDB.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'});
        //依頼区分
        document.getElementById('order_category_edit').value = carrentDB.get('orderCategory');
        //依頼者氏名
        document.getElementById('requester_name_edit').value = carrentDB.get('requesterName');
        //指示者氏名
        document.getElementById('orderPerson_name_edit').value = carrentDB.get('orderPersonName');
        //部屋番号
        document.getElementById('place_edit').value = carrentDB.get('place');
        //in時間
        document.getElementById('inTime_edit').value = carrentDB.get('inTime');
        //out時間/取り消し時間
        document.getElementById('outTime_edit').value = carrentDB.get('outTime');
        //プラン/金額
        document.getElementById('planAndprice_edit').value = carrentDB.get('planAndprice');
        //訂正
        var correction_edit = document.getElementById('correction_edit');
        switch(carrentDB.get('correction')){
            case 'プラス有り':
                correction_edit.options[1].selected = true;
                break;
            case 'マイナス有り':
                correction_edit.options[2].selected = true;
                break;
            default:
                correction_edit.options[0].selected = true;
                break;    
        }
        //件数
        document.getElementById('count_edit').value = carrentDB.get('number');
        //金額
        document.getElementById('price_edit').value = carrentDB.get('price');
        //出勤その他
        document.getElementById('withdrawal_edit').value = carrentDB.get('withdrawal');
        //入金その他
        document.getElementById('moneyReceived_edit').value = carrentDB.get('moneyReceived');
        //状況説明
        document.getElementById('status_desc_edit').value = carrentDB.get('status_desc');
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
    //依頼区分
    var orderCategory = document.getElementById('order_category_edit').value;
    //依頼者氏名
    var requesterName = document.getElementById('requester_name_edit').value;
    //指示者氏名
    var orderPersonName = document.getElementById('orderPerson_name_edit').value;
    //部屋番号
    var place = document.getElementById('place_edit').value;
    //in時間
    var inTime = document.getElementById('inTime_edit').value;
    //out時間/取り消し時間
    var outTime = document.getElementById('outTime_edit').value;
    //プラン/金額
    var planAndprice = document.getElementById('planAndprice_edit').value;
    //訂正
    var correction = document.getElementById('correction_edit').value;
    //件数
    var number = document.getElementById('count_edit').value;
    //金額
    var price = document.getElementById('price_edit').value;
    //出勤その他
    var withdrawal = document.getElementById('withdrawal_edit').value;
    //入金その他
    var moneyReceived = document.getElementById('moneyReceived_edit').value;
    //状況説明
    var status_desc = document.getElementById('status_desc_edit').value;
    //処理内容
    var process_content = document.getElementById('process_content_edit').value;

    //DBへ送信
    db.collection('AccidentAndCancel').doc(id).update({
        orderCategory:orderCategory,
        requesterName:requesterName,
        orderPersonName:orderPersonName,
        place:place,
        inTime:inTime,
        outTime:outTime,
        planAndprice:planAndprice,
        correction:correction,
        number:number,
        price:price,
        withdrawal:withdrawal,
        moneyReceived:moneyReceived,
        status_desc:status_desc,
        process_content:process_content,
    });

    var collectAlert = document.getElementById('collectAlert_edit');
    collectAlert.innerHTML = '<div class="alert alert-success" role="alert">編集完了!リロードします。</div>';
    setTimeout("location.reload()",2000);
}

//検索
function search(){
    var store = document.getElementById('store_name_search').value;
    var StartDate_search = document.getElementById('StartDate_search').value;
    var EndDate_search = document.getElementById('EndDate_search').value;
    (async () => {
        try {
        // 省略 
        // (Cloud Firestoreのインスタンスを初期化してdbにセット)
    
        query = await db.collection('AccidentAndCancel'); // firebase.firestore.QuerySnapshotのインスタンスを取得

        //店舗での検索
        if(store != ""){
            query = query.where('storeName','==',store);
            console.log(store);
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

        //前回のDBとして保存
        backQueryList.push(querySnapshot);

        var stocklist = '<table class="table">'
        stocklist += '<tr class="table_title"><th>発生日時</th><th>依頼区分</th><th>依頼者</th><th>指示者</th><th>部屋番号</th><th>IN時間</th><th>OUT時間</th><th>利用プラン/金額</th><th>日報訂正</th><th>機能</th><tr class="table_title"><th colspan = "5">状況説明</th><th colspan = "6">本部コメント</th></tr>';
        querySnapshot.forEach((postDoc) => {
            stocklist += '<tbody class="yetBack"><tr><td>'+ postDoc.get('orderDate') +'</td><td>' + postDoc.get('orderCategory') + '</td><td>' + postDoc.get('requesterName') + '</td><td>' + postDoc.get('orderPersonName') + '</td><td>'+ postDoc.get('place') +'</td><td>'+ postDoc.get('inTime') +'</td><td>'+ postDoc.get('outTime') +'</td><td>'+ postDoc.get('planAndprice') +'</td><td>'+ postDoc.get('correction') +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><a class="js-modal-open1"><button class="btn btn-primary" onclick="modalImages(\''+postDoc.id+'\')">画像</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('requesterName') +'\',\''+ postDoc.get('place') +'\')">削除</button></td></tr><tr><td colspan = "5">'+ postDoc.get('status_desc') +'</td><td colspan = "6">'+ postDoc.get('headquartersComment') +'</td></tr></tbody>';
        });
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

//画像モーダル
function modalImages(id){
    console.log(id);
    var prevTask = Promise.resolve;
    (async () => {
        try {
            const querySnapshot = await db.collection('AccidentAndCancel').doc(id).get();
            document.getElementById('modalImgs').innerHTML = '<p></p>';  
            //写真の枚数を取得
            var photoCount = querySnapshot.get('photoCount');
            if(photoCount == 0 || photoCount == undefined){
                document.getElementById('modalImgs').innerHTML = '<p>画像はありません。</p>';     
            }else{
                for(var i = 0; i < photoCount; i++){
                    document.getElementById('modalImgs').innerHTML = '<p>画像ロード中...</p>';  
                    var storageImageRef = firebase.storage().ref('/accidentEntranceReset/' + id + '/' + 'uploadImage' + i);
                    var stocklist = '';
                    prevTask = Promise.all([prevTask,storageImageRef.getDownloadURL()]).then(([_,url])=>{
                        console.log(url);
                        stocklist += "<img src = " + "'" + url + "'" + "></img>";
                        document.getElementById('modalImgs').innerHTML = stocklist;
                    }).catch(error => {
                    }).catch(() => {});
                }
            }
        } catch (err) {
        console.log(err);
        }

    })();
};

//削除
function deleteContent(id,name,place){
    var res = window.confirm("場所:" + place + "の" + name + "さんの申請を削除しますか？");
    if( res ) {
        (async () => {
            try {
                const carrentDB = await db.collection('AccidentAndCancel').doc(id).get();
                if(carrentDB.get('photoCount') == 0 || carrentDB.get('photoCount') == undefined){

                }else{
                    for(var i = 0;i < carrentDB.get('photoCount');i++){
                        //削除するフォルダへの参照を作成
                        var storageImageRef = firebase.storage().ref('/accidentEntranceReset/' + id + '/' + 'uploadImage' + i);
                        storageImageRef.delete();
                    }
                }
                //firestoreを削除
                db.collection('AccidentAndCancel').doc(id).delete();  
                alert("削除されました。");
                setTimeout("location.reload()",500);
            } catch (err) {
            console.log(err);
            }
    
        })();
    }
    else {
        // キャンセルならアラートボックスを表示
        alert("キャンセルしました。");
    } 
};