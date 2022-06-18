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

    query = await db.collection('AccidentAndCancel').orderBy('orderDate', 'desc').limit(10); // firebase.firestore.QuerySnapshotのインスタンスを取得
    querySnapshot = await query.get();

    var stocklist = '<table class="table">'
    stocklist += '<tr class="table_title"><th>発生日時</th><th>店舗名</th><th>依頼区分</th><th>依頼者</th><th>指示者</th><th>場所・部屋番号</th><th>IN時間</th><th>OUT時間/取消時間</th><th>利用プラン/金額</th><th>日報訂正</th><th>状態</th><th>機能</th></tr><tr class="table_title"><th colspan = "5">状況説明</th><th colspan = "7">処理内容</th></tr>';
    querySnapshot.forEach((postDoc) => {
        switch(postDoc.get('status')){
            //完了
            case '完了':
                var statusText = "完了";
                stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('orderDate') +'</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('orderCategory') + '</td><td>' + postDoc.get('requesterName') + '</td><td>' + postDoc.get('orderPersonName') + '</td><td>'+ postDoc.get('place') +'</td><td>'+ postDoc.get('inTime') +'</td><td>'+ postDoc.get('outTime') +'</td><td>'+ postDoc.get('planAndprice') +'</td><td>'+ postDoc.get('correction') +'</td><td>'+ statusText +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('requesterName') +'\',\''+ postDoc.get('place') +'\')">削除</button>'+ '<a class="js-modal-open1"><button class="btn btn-primary" onclick="modalImages(\''+postDoc.id+'\')">画像</button></a>' + '</td></tr><tr><td colspan = "5">'+ postDoc.get('status_desc') +'</td><td colspan = "7">'+ postDoc.get('process_content') +'</td></tr></tbody>';
            break;
            //未了    
            case '未了':
                var statusText = "未了";
                stocklist += '<tbody class="yetBack"><tr><td>'+ postDoc.get('orderDate') +'</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('orderCategory') + '</td><td>' + postDoc.get('requesterName') + '</td><td>' + postDoc.get('orderPersonName') + '</td><td>'+ postDoc.get('place') +'</td><td>'+ postDoc.get('inTime') +'</td><td>'+ postDoc.get('outTime') +'</td><td>'+ postDoc.get('planAndprice') +'</td><td>'+ postDoc.get('correction') +'</td><td>'+ statusText +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('requesterName') +'\',\''+ postDoc.get('place') +'\')">削除</button><a class="js-modal-open1"><button class="btn btn-primary" onclick="modalImages(\''+postDoc.id+'\')">画像</button></a></td></tr><tr><td colspan = "5">'+ postDoc.get('status_desc') +'</td><td colspan = "7">'+ postDoc.get('process_content') +'</td></tr></tbody>';
            break;
        }
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
            stocklist += '<tr class="table_title"><th>発生日時</th><th>店舗名</th><th>依頼区分</th><th>依頼者</th><th>指示者</th><th>場所・部屋番号</th><th>IN時間</th><th>OUT時間/取消時間</th><th>利用プラン/金額</th><th>日報訂正</th><th>状態</th><th>機能</th></tr><tr class="table_title"><th colspan = "5">状況説明</th><th colspan = "7">処理内容</th></tr>';
            querySnapshot.forEach((postDoc) => {
                switch(postDoc.get('status')){
                    //完了
                    case '完了':
                        var statusText = "完了";
                        stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('orderDate') +'</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('orderCategory') + '</td><td>' + postDoc.get('requesterName') + '</td><td>' + postDoc.get('orderPersonName') + '</td><td>'+ postDoc.get('place') +'</td><td>'+ postDoc.get('inTime') +'</td><td>'+ postDoc.get('outTime') +'</td><td>'+ postDoc.get('planAndprice') +'</td><td>'+ postDoc.get('correction') +'</td><td>'+ statusText +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('requesterName') +'\',\''+ postDoc.get('place') +'\')">削除</button>'+ '<a class="js-modal-open1"><button class="btn btn-primary" onclick="modalImages(\''+postDoc.id+'\')">画像</button></a>' + '</td></tr><tr><td colspan = "5">'+ postDoc.get('status_desc') +'</td><td colspan = "7">'+ postDoc.get('process_content') +'</td></tr></tbody>';
                    break;
                    //未了    
                    case '未了':
                        var statusText = "未了";
                        stocklist += '<tbody class="yetBack"><tr><td>'+ postDoc.get('orderDate') +'</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('orderCategory') + '</td><td>' + postDoc.get('requesterName') + '</td><td>' + postDoc.get('orderPersonName') + '</td><td>'+ postDoc.get('place') +'</td><td>'+ postDoc.get('inTime') +'</td><td>'+ postDoc.get('outTime') +'</td><td>'+ postDoc.get('planAndprice') +'</td><td>'+ postDoc.get('correction') +'</td><td>'+ statusText +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('requesterName') +'\',\''+ postDoc.get('place') +'\')">削除</button><a class="js-modal-open1"><button class="btn btn-primary" onclick="modalImages(\''+postDoc.id+'\')">画像</button></a></td></tr><tr><td colspan = "5">'+ postDoc.get('status_desc') +'</td><td colspan = "7">'+ postDoc.get('process_content') +'</td></tr></tbody>';
                    break;
                }
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
    stocklist += '<tr class="table_title"><th>発生日時</th><th>店舗名</th><th>依頼区分</th><th>依頼者</th><th>指示者</th><th>場所・部屋番号</th><th>IN時間</th><th>OUT時間/取消時間</th><th>利用プラン/金額</th><th>日報訂正</th><th>状態</th><th>機能</th></tr><tr class="table_title"><th colspan = "5">状況説明</th><th colspan = "7">処理内容</th></tr>';
    querySnapshot.forEach((postDoc) => {
        switch(postDoc.get('status')){
            //完了
            case '完了':
                var statusText = "完了";
                stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('orderDate') +'</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('orderCategory') + '</td><td>' + postDoc.get('requesterName') + '</td><td>' + postDoc.get('orderPersonName') + '</td><td>'+ postDoc.get('place') +'</td><td>'+ postDoc.get('inTime') +'</td><td>'+ postDoc.get('outTime') +'</td><td>'+ postDoc.get('planAndprice') +'</td><td>'+ postDoc.get('correction') +'</td><td>'+ statusText +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('requesterName') +'\',\''+ postDoc.get('place') +'\')">削除</button>'+ '<a class="js-modal-open1"><button class="btn btn-primary" onclick="modalImages(\''+postDoc.id+'\')">画像</button></a>' + '</td></tr><tr><td colspan = "5">'+ postDoc.get('status_desc') +'</td><td colspan = "7">'+ postDoc.get('process_content') +'</td></tr></tbody>';
            break;
            //未了    
            case '未了':
                var statusText = "未了";
                stocklist += '<tbody class="yetBack"><tr><td>'+ postDoc.get('orderDate') +'</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('orderCategory') + '</td><td>' + postDoc.get('requesterName') + '</td><td>' + postDoc.get('orderPersonName') + '</td><td>'+ postDoc.get('place') +'</td><td>'+ postDoc.get('inTime') +'</td><td>'+ postDoc.get('outTime') +'</td><td>'+ postDoc.get('planAndprice') +'</td><td>'+ postDoc.get('correction') +'</td><td>'+ statusText +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('requesterName') +'\',\''+ postDoc.get('place') +'\')">削除</button><a class="js-modal-open1"><button class="btn btn-primary" onclick="modalImages(\''+postDoc.id+'\')">画像</button></a></td></tr><tr><td colspan = "5">'+ postDoc.get('status_desc') +'</td><td colspan = "7">'+ postDoc.get('process_content') +'</td></tr></tbody>';
            break;
        }
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
        const carrentDB = await db.collection('AccidentAndCancel').doc(id).get();
        //発生日時
        document.getElementById('order_date_edit').textContent = carrentDB.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'});
        //依頼区分
        var order_category_edit = document.getElementById('order_category_edit');
        switch(carrentDB.get('orderCategory')){
            case '入室取消':
                order_category_edit.options[1].selected = true;
                break;
            case '退店取消':
                order_category_edit.options[2].selected = true;
                break;
            case '複数名利用':
                order_category_edit.options[3].selected = true;
                break;    
            case '操作ミス・未回収':
                order_category_edit.options[4].selected = true;
                break;
            default:
                order_category_edit.options[0].selected = true;
                break;    
        }
        //依頼者氏名
        document.getElementById('requester_name_edit').value = carrentDB.get('requesterName');
        //指示者氏名
        document.getElementById('orderPerson_name_edit').value = carrentDB.get('orderPersonName');
        //場所/部屋番号
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
        //状態
        var status = document.getElementById('status');
        switch(carrentDB.get('status')){
            case '未了':
                status.options[0].selected = true;
                break;
            case '完了':
                status.options[1].selected = true;
                break;
            default:
                break;    
        }
        //本部コメント
        document.getElementById('headquartersComment').value = carrentDB.get('headquartersComment');
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
    //場所/部屋番号
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
    //状態
    var status = document.getElementById('status').value;
    //本部コメント
    var headquartersComment = document.getElementById('headquartersComment').value;

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
        status:status,
        headquartersComment,headquartersComment
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
    var orderCategory_search = document.getElementById('order_category_search').value;
    var requesterName_search = document.getElementById('requester_name_search').value;
    var orderPersonName_search = document.getElementById('orderPerson_name_search').value;
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

        //依頼区分での検索
        if(orderCategory_search != ""){
            query = query.where('orderCategory','==',orderCategory_search);
        }

        //依頼者での検索
        if(requesterName_search != ""){
            query = query.where('requesterName','==',requesterName_search);
        }

        //指示者での検索
        if(orderPersonName_search != ""){
            query = query.where('orderPersonName','==',orderPersonName_search);
        }

        console.log(query);
        querySnapshot = await query.orderBy('orderDate', 'desc').get();

        var stocklist = '<table class="table">'
        stocklist += '<tr class="table_title"><th>発生日時</th><th>店舗名</th><th>依頼区分</th><th>依頼者</th><th>指示者</th><th>場所・部屋番号</th><th>IN時間</th><th>OUT時間/取消時間</th><th>利用プラン/金額</th><th>日報訂正</th><th>状態</th><th>機能</th></tr><tr class="table_title"><th colspan = "5">状況説明</th><th colspan = "7">処理内容</th></tr>';
        querySnapshot.forEach((postDoc) => {
            switch(postDoc.get('status')){
                //完了
                case '完了':
                    var statusText = "承認";
                    stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('orderDate') +'</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('orderCategory') + '</td><td>' + postDoc.get('requesterName') + '</td><td>' + postDoc.get('orderPersonName') + '</td><td>'+ postDoc.get('place') +'</td><td>'+ postDoc.get('inTime') +'</td><td>'+ postDoc.get('outTime') +'</td><td>'+ postDoc.get('planAndprice') +'</td><td>'+ postDoc.get('correction') +'</td><td>'+ statusText +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('requesterName') +'\',\''+ postDoc.get('place') +'\')">削除</button>'+ '<a class="js-modal-open1"><button class="btn btn-primary" onclick="modalImages(\''+postDoc.id+'\')">画像</button></a>' + '</td></tr><tr><td colspan = "5">'+ postDoc.get('status_desc') +'</td><td colspan = "7">'+ postDoc.get('process_content') +'</td></tr></tbody>';
                break;
                //未了    
                case '未了':
                    var statusText = "未了";
                    stocklist += '<tbody class="yetBack"><tr><td>'+ postDoc.get('orderDate') +'</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('orderCategory') + '</td><td>' + postDoc.get('requesterName') + '</td><td>' + postDoc.get('orderPersonName') + '</td><td>'+ postDoc.get('place') +'</td><td>'+ postDoc.get('inTime') +'</td><td>'+ postDoc.get('outTime') +'</td><td>'+ postDoc.get('planAndprice') +'</td><td>'+ postDoc.get('correction') +'</td><td>'+ statusText +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('requesterName') +'\',\''+ postDoc.get('place') +'\')">削除</button><a class="js-modal-open1"><button class="btn btn-primary" onclick="modalImages(\''+postDoc.id+'\')">画像</button></a></td></tr><tr><td colspan = "5">'+ postDoc.get('status_desc') +'</td><td colspan = "7">'+ postDoc.get('process_content') +'</td></tr></tbody>';
                break;
            }
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
function deleteContent(id,name,place){
    var res = window.confirm("場所:" + place + "の" + name + "さんの申請を削除しますか？");
    if( res ) {
        db.collection('AccidentAndCancel').doc(id).delete();
        alert("削除されました。");
        setTimeout("location.reload()",500);
    }
    else {
        // キャンセルならアラートボックスを表示
        alert("キャンセルしました。");
    } 
};

//PDF作成
function createPDF(id){
    (async () => {
      try {
        const carrentDB = await db.collection('certificates').doc(id).get();
        //申請日
        var createdAt = carrentDB.get('createdAt');
        //所属店舗
        var store = carrentDB.get('storeName')
        //社員番号
        var staffNum = carrentDB.get('staffNum');
        //氏名
        var name = carrentDB.get('name');
        //必要書類
        var paper = carrentDB.get('paper');
          //必要書類input
          switch(paper){
              case "源泉徴収票":
                  var tax_withholding = carrentDB.get('tax_withholding');
              break;
              case "給与明細":
                  var payroll_item_start = carrentDB.get('payroll_item_start');
                  var payroll_item_end = carrentDB.get('payroll_item_end');
              break;
              case "賃金台帳":
                  var wage_ledger_start = carrentDB.get('wage_ledger_start');
                  var wage_ledger_end = carrentDB.get('wage_ledger_end');
              break;
              case "その他":
                  var other = carrentDB.get('other');
              break;
              default:
              break;
          }
  
      //必要書類確認
      var paperCheck = carrentDB.get('paper');
      var stocklist = "";
      if(paperCheck.match(/在籍証明書/)){
          stocklist += "在籍証明書\n";
      }
      if(paperCheck.match(/源泉徴収票/)){
          stocklist += '源泉徴収票('+ carrentDB.get('tax_withholding') +'年分)\n'
      }
      if(paperCheck.match(/給与明細/)){
          stocklist += '給与明細(期間：'+ carrentDB.get('payroll_item_start') + '月度分~' + carrentDB.get('payroll_item_end') +'月度分)\n';
      }
      if(paperCheck.match(/賃金台帳/)){
          stocklist += '賃金台帳(期間：'+ carrentDB.get('wage_ledger_start') + '~' + carrentDB.get('wage_ledger_end') +')\n';
      }
      if(paperCheck.match(/その他/)){
          stocklist += 'その他'+ carrentDB.get('other') +'\n';
      }  
  
        //必要部数  
        var required_number = carrentDB.get('required_number');
        //提出先
        var submission_target = carrentDB.get('submission_target');
        //依頼理由
        var reason = carrentDB.get('reason');
        //依頼理由の1行の文字数を指定
        var textLimit = 34;//ここだけ設定
        var tmp = reason.split("\n");
  
        var kaigyouBody = [];
  
  
        for (var key in tmp) {
  
            if(tmp[key] != ""){
  
                if(tmp[key].length >= textLimit){
  
                    let oneSplit = tmp[key].split('');
                    let oneBody = [];
  
                    for (var key2 in oneSplit) {
  
                    //key2 1文字目でなく、さらに textLimit の倍数の数値なら改行コードを挿入
                    if(key2 != 0 && key2%textLimit == 0){
                        oneBody.push("\n");
                    }
  
                    oneBody.push(oneSplit[key2]);
  
                }
  
                    kaigyouBody.push(oneBody.join(""));
  
                } else {
                    kaigyouBody.push(tmp[key]);
                }
  
            }
  
        }
  
  
        var reason = kaigyouBody.join("\n");
        //希望日時
        var endDate = carrentDB.get('endDate');
        //備考・連絡事項
        var note = carrentDB.get('note');
        //備考・連絡事項の1行の文字数を指定
        var textLimit1 = 34;//ここだけ設定
        var tmp1 = note.split("\n");
        var kaigyouBody1 = [];
        for (var key in tmp1) {
  
            if(tmp1[key] != ""){
  
                if(tmp1[key].length >= textLimit1){
  
                    let oneSplit1 = tmp1[key].split('');
                    let oneBody1 = [];
  
                    for (var key2 in oneSplit1) {
  
                    //key2 1文字目でなく、さらに textLimit の倍数の数値なら改行コードを挿入
                    if(key2 != 0 && key2%textLimit1 == 0){
                        oneBody1.push("\n");
                    }
  
                    oneBody1.push(oneSplit1[key2]);
  
                }
  
                    kaigyouBody1.push(oneBody1.join(""));
  
                } else {
                    kaigyouBody1.push(tmp1[key]);
                }
  
            }
  
        }
        var note = kaigyouBody1.join("\n");
  
            //日本語フォント読み込み
            pdfMake.fonts = {
                GenShin: {
                normal: 'GenShinGothic-Normal-Sub.ttf',
                bold: 'GenShinGothic-Normal-Sub.ttf',
                italics: 'GenShinGothic-Normal-Sub.ttf',
                bolditalics: 'GenShinGothic-Normal-Sub.ttf'
                }
            };
  
            //ここからPDFコード
            //PDF作成処理
            var docDef = {
              content: [
                  {
                  columns: [
                      {
                          width: '*',
                          text: '証明書等発行申請書',
                          margin: [ 0, 0, 0, 10 ],
                          style: ['center','border'],
                          fontSize: 20
                      }
                  ],
                  columnGap: 10
                  },
                  {
                  columns: [
                      {
                          width: '*',
                          text: '《 申請日 》' + createdAt,
                          margin: [ 0, 0, 0, 10 ],
                          style: ['right','border'],
                          fontSize: 15
                      }
                  ],
                  columnGap: 10
                  },
                  {
                  columns: [
                      {
                          width: '*',
                          text: '《 所属店舗 》' + store,
                          margin: [ 0, 0, 0, 10 ],
                          style: ['right','border'],
                          fontSize: 15
                      }
                  ],
                  columnGap: 10
                  },
                  {
                      columns: [
                          {
                              width: '*',
                              text: '《 社員番号 》' + staffNum,
                              margin: [ 0, 0, 0, 10 ],
                              style: ['right','border'],
                              fontSize: 15
                          }
                      ],
                      columnGap: 10
                      },
                  {
                      columns: [
                          {
                              width: '*',
                              text: '《 氏名 》' + name + '       印',
                              margin: [ 0, 0, 0, 10 ],
                              style: ['right','border'],
                              fontSize: 15
                          }
                      ],
                      columnGap: 10
                  },
                  {
                      columns: [
                          {
                              width: 'auto',
                              text:  '必要書類:',
                              margin: [ 0, 10, 0, 10 ],
                              style: ['left'],
                              fontSize: 15
                          },
                          {
                              width: '*',
                              text: stocklist,
                              margin: [ 0, 5, 0, 10 ],
                              style: ['left'],
                              fontSize: 20
                          }
                      ],
                      columnGap: 10
                  },
                  {
                      columns: [
                          {
                              width: 'auto',
                              text:  '必要部数:',
                              margin: [ 0, 10, 0, 10 ],
                              style: ['left'],
                              fontSize: 15
                          },
                          {
                              width: '*',
                              text: required_number + "部",
                              margin: [ 0, 5, 0, 10 ],
                              style: ['left'],
                              fontSize: 20
                          }
                      ],
                      columnGap: 10
                  },
                  {
                      columns: [
                          {
                              width: 'auto',
                              text:  '提出先:',
                              margin: [ 0, 10, 0, 10 ],
                              style: ['left'],
                              fontSize: 15
                          },
                          {
                              width: '*',
                              text: submission_target,
                              margin: [ 0, 5, 0, 10 ],
                              style: ['left'],
                              fontSize: 20
                          }
                      ],
                      columnGap: 10
                  },
                  {
                      columns: [
                          {
                              width: 'auto',
                              text:  '依頼理由:',
                              margin: [ 0, 10, 0, 10 ],
                              style: ['left'],
                              fontSize: 15
                          },
                          {
                              width: '*',
                              text: reason,
                              margin: [ 0, 5, 0, 10 ],
                              style: ['left'],
                              fontSize: 20
                          }
                      ],
                      columnGap: 10
                  },
                  {
                      columns: [
                          {
                              width: 'auto',
                              text:  '希望期日:',
                              margin: [ 0, 10, 0, 10 ],
                              style: ['left'],
                              fontSize: 15
                          },
                          {
                              width: '*',
                              text: endDate + "まで",
                              margin: [ 0, 5, 0, 10 ],
                              style: ['left'],
                              fontSize: 20
                          }
                      ],
                      columnGap: 10
                  },
                  {
                      columns: [
                          {
                              width: 'auto',
                              text:  '備考/連絡事項:',
                              margin: [ 0, 10, 0, 0 ],
                              style: ['left'],
                              fontSize: 15
                          }
                      ],
                      columnGap: 10
                  },
                  {
                      columns: [
                          {
                              width: '*',
                              text: note,
                              margin: [ 0, 0, 0, 50 ],
                              style: ['left'],
                              fontSize: 20
                          }
                      ],
                      columnGap: 10
                  },
                  {
                      table: {
                          headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                          widths: [100,100],
                          margin: [ 100, 0, 0, 0 ],
                          style:['right'],
                          body: [
                              [{text:'承認印',fontSize:15,alignment:'center'},{text:'経理印',fontSize:15,alignment:'center'}],
                              [{text:' ',fontSize:20,alignment:'center'},{text:' ',fontSize:20,alignment:'center'}]
                          ]
                      }
                  },
              ],
              styles:{
                  center:{
                      alignment: 'center'
                  },
                  right:{
                  alignment: 'right'
                  },
                  left:{
                  alignment: 'left'
                  },
                  border:{
                      decorationStyle:'dashed'
                  }
              },
              defaultStyle: {
                  font: 'GenShin',
              },
          };
            pdfMake.createPdf(docDef).print();
            //pdfMake.createPdf(docDef).download("残業申請書.pdf");
      } catch (err) {
      console.log(`Error: ${JSON.stringify(err)}`)
      }
  })();
  
}

//画像モーダル
function modalImages(id){
    console.log(id);
    var prevTask = Promise.resolve;
    (async () => {
        try {
            const querySnapshot = await db.collection('AccidentAndCancel').doc(id).get();
            //写真の枚数を取得
            var photoCount = querySnapshot.get('photoCount');
            if(photoCount == 0){
                document.getElementById('modalImgs').innerHTML = '<p>画像はありません。</p>';     
            }else{
                document.getElementById('modalImgs').innerHTML = '<p>画像ロード中...</p>';  
                for(var i = 0; i < photoCount; i++){
                    var storageImageRef = firebase.storage().ref('/accidentEntranceReset/' + id + '/' + 'uploadImage' + i);
                    prevTask = Promise.all([prevTask,storageImageRef.getDownloadURL()]).then(([_,url])=>{
                        var stocklist = "<img src = " + "'" + url + "'" + "></img>";
                        document.getElementById('modalImgs').innerHTML = stocklist;
                    }).catch(error => {
                    }).catch(() => {});
                }
            }
        } catch (err) {
        console.log(err);
        }

    })();
}