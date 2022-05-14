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
    ignoreUndefinedProperties: true,
    timestampsInSnapshots: true
});

var query="";
var querySnapshot="";
var currentQuerySnapshot = "";
var currentQueryList = [];
var backQueryList = [];
document.getElementById('prevButton').style.visibility = 'hidden';
document.getElementById('disapproval_reason').style.display = "none";

//テーブル表示(初期値)
(async () => {
    try {
      // 省略 
      // (Cloud Firestoreのインスタンスを初期化してdbにセット)
  
      query = await db.collection('overtimeApp').orderBy('date', 'desc').limit(10) // firebase.firestore.QuerySnapshotのインスタンスを取得
      querySnapshot = await query.get();

      //前回のDBとして保存
      backQueryList.push(querySnapshot);

      var stocklist = '<table class="table table-striped">'
      stocklist += '<tr><th>依頼日時</th><th>店舗名</th><th>社員番号</th><th>氏名</th><th>申請理由</th><th>申請日時</th><th>電話承認者</th><th>FMS承認者</th><th>状態</th><th>編集</th>';
      querySnapshot.forEach((postDoc) => {
        switch(postDoc.get('status')){
        //承認
          case 'approve':
              var statusText = "承認";
              stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>'+ postDoc.get('storeName') +'</td><td>'+ postDoc.get('staffNum') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('reason') + '</td><td>' + postDoc.get('date') + " " + postDoc.get('startDate') + "~" + postDoc.get('endDate') +  '</td><td>' + postDoc.get('phoneApprover') + '</td><td>' + postDoc.get('approvalPerson') + '</td><td>' + statusText + '</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
              break;
        //不承認      
          case 'disapproval':
              var statusText = "不承認";
              stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>'+ postDoc.get('storeName') +'</td><td>'+ postDoc.get('staffNum') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('reason') + '</td><td>' + postDoc.get('date') + " " + postDoc.get('startDate') + "~" + postDoc.get('endDate') +  '</td><td>' + postDoc.get('phoneApprover') + '</td><td>' + postDoc.get('approvalPerson') + '</td><td>' + statusText + '</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
              break;
        //未承認      
          default:
              var statusText = "未承認";
              stocklist += '<tbody><tr><td>'+ postDoc.get('createdAt') +'</td><td>'+ postDoc.get('storeName') +'</td><td>'+ postDoc.get('staffNum') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('reason') + '</td><td>' + postDoc.get('date') + " " + postDoc.get('startDate') + "~" + postDoc.get('endDate') +  '</td><td>' + postDoc.get('phoneApprover') + '</td><td></td><td>' + statusText + '</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
              break;        
        }
      })
      stocklist += '</table>';
      document.getElementById('table_list').innerHTML = stocklist;

      //後が無い場合に非表示
      if(querySnapshot.docs.length < 10){
        document.getElementById('nextButton').style.visibility = "hidden";
      }

    } catch (err) {
        console.log(err);
    }
})();

//キャンセル
function cancel(){
    setTimeout("location.reload()");
}

//不承認理由表示
function change(){
    if(document.getElementById('order_category').value == "disapproval"){
        document.getElementById('disapproval_reason').style.display = "";
    }else{
        document.getElementById('disapproval_reason').style.display = "none";
    }
}

//編集用モーダルウィンドウ
function editStatus(id){
  (async () => {
    try {
        const carrentDB = await db.collection('overtimeApp').doc(id).get();
        document.getElementById('createdAt_edit').textContent = carrentDB.get('createdAt');
        document.getElementById('staffNum_edit').textContent = carrentDB.get('staffNum');
        document.getElementById('name_edit').textContent = carrentDB.get('name');
        document.getElementById('date_edit').value = carrentDB.get('date');
        document.getElementById('startDate_edit').value = carrentDB.get('startDate');
        document.getElementById('endDate_edit').value = carrentDB.get('endDate');
        document.getElementById('reason_detail_edit').value = carrentDB.get('reason');
        var phoneApprover =  carrentDB.get('phoneApprover');
        if(phoneApprover == null){
            document.getElementById('phoneApprover').value = '';
        }else{
            document.getElementById('phoneApprover').value = phoneApprover;
        }
        var approvalPerson = carrentDB.get('approvalPerson');
        if(approvalPerson == null){
            document.getElementById('approvalPerson').value = '';
        }else{
            document.getElementById('approvalPerson').value = approvalPerson;
        }
        var status = document.getElementById('order_category');
        switch(carrentDB.get('status')){
            case 'unapproved':
                status.options[0].selected = true; 
                document.getElementById('disapproval_reason').style.display = "none";
            break;
            case 'approve':
                status.options[1].selected = true; 
                document.getElementById('disapproval_reason').style.display = "none";
            break;   
            case 'disapproval':
                status.options[2].selected = true; 
                document.getElementById('disapproval_reason').style.display = "";
                document.getElementById('disapprovalReason').value = carrentDB.get('disapprovalReason');    
            break;   
        }
        var note = carrentDB.get('note');
        if(note == null){
            document.getElementById('note').value = '';
        }else{
            document.getElementById('note').value = note;
        }
        //編集送信ボタン生成
        document.getElementById('edit_submit_button').innerHTML = '<button type="submit" class="btn btn-success" onclick="EditUpdate(\''+id+'\')">送信する</button>';

    } catch (err) {
    console.log(`Error: ${JSON.stringify(err)}`)
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

          var stocklist = '<table class="table table-striped">'
          stocklist += '<tr><th>依頼日時</th><th>店舗名</th><th>社員番号</th><th>氏名</th><th>申請理由</th><th>申請日時</th><th>電話承認者</th><th>FMS承認者</th><th>状態</th><th>編集</th>';
          querySnapshot.forEach((postDoc) => {
            switch(postDoc.get('status')){
            //承認
              case 'approve':
                  var statusText = "承認";
                  stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>'+ postDoc.get('storeName') +'</td><td>'+ postDoc.get('staffNum') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('reason') + '</td><td>' + postDoc.get('date') + " " + postDoc.get('startDate') + "~" + postDoc.get('endDate') +  '</td><td>' + postDoc.get('phoneApprover') + '</td><td>' + postDoc.get('approvalPerson') + '</td><td>' + statusText + '</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                  break;
            //不承認      
              case 'disapproval':
                  var statusText = "不承認";
                  stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>'+ postDoc.get('storeName') +'</td><td>'+ postDoc.get('staffNum') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('reason') + '</td><td>' + postDoc.get('date') + " " + postDoc.get('startDate') + "~" + postDoc.get('endDate') +  '</td><td>' + postDoc.get('phoneApprover') + '</td><td>' + postDoc.get('approvalPerson') + '</td><td>' + statusText + '</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                  break;
            //未承認      
              default:
                  var statusText = "未承認";
                  stocklist += '<tbody><tr><td>'+ postDoc.get('createdAt') +'</td><td>'+ postDoc.get('storeName') +'</td><td>'+ postDoc.get('staffNum') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('reason') + '</td><td>' + postDoc.get('date') + " " + postDoc.get('startDate') + "~" + postDoc.get('endDate') +  '</td><td>' + postDoc.get('phoneApprover') + '</td><td></td><td>' + statusText + '</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
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

  var stocklist = '<table class="table table-striped">'
  stocklist += '<tr><th>依頼日時</th><th>店舗名</th><th>社員番号</th><th>氏名</th><th>申請理由</th><th>申請日時</th><th>電話承認者</th><th>FMS承認者</th><th>状態</th><th>編集</th>';
  querySnapshot.forEach((postDoc) => {
    switch(postDoc.get('status')){
    //承認
      case 'approve':
          var statusText = "承認";
          stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>'+ postDoc.get('storeName') +'</td><td>'+ postDoc.get('staffNum') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('reason') + '</td><td>' + postDoc.get('date') + " " + postDoc.get('startDate') + "~" + postDoc.get('endDate') +  '</td><td>' + postDoc.get('phoneApprover') + '</td><td>' + postDoc.get('approvalPerson') + '</td><td>' + statusText + '</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
          break;
    //不承認      
      case 'disapproval':
          var statusText = "不承認";
          stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>'+ postDoc.get('storeName') +'</td><td>'+ postDoc.get('staffNum') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('reason') + '</td><td>' + postDoc.get('date') + " " + postDoc.get('startDate') + "~" + postDoc.get('endDate') +  '</td><td>' + postDoc.get('phoneApprover') + '</td><td>' + postDoc.get('approvalPerson') + '</td><td>' + statusText + '</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
          break;
    //未承認      
      default:
          var statusText = "未承認";
          stocklist += '<tbody><tr><td>'+ postDoc.get('createdAt') +'</td><td>'+ postDoc.get('storeName') +'</td><td>'+ postDoc.get('staffNum') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('reason') + '</td><td>' + postDoc.get('date') + " " + postDoc.get('startDate') + "~" + postDoc.get('endDate') +  '</td><td>' + postDoc.get('phoneApprover') + '</td><td></td><td>' + statusText + '</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
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

//検索
function showTable(){
    var name = document.getElementById('name_search').value;
    var store = document.getElementById('store_name_search').value;
    //テーブル表示(初期値)
    (async () => {
        try {
            query = await db.collection('overtimeApp')
            // 省略 
            // (Cloud Firestoreのインスタンスを初期化してdbにセット)
        if(name != ''){
            query = query.where('name','==',name)
        }
        if(store != ''){
            query = query.where('storeName','==',store)
        }
        query = query.orderBy('date', 'desc').limit(10) 
        querySnapshot = await query.get();

        //前回のDBとして保存
        backQueryList.push(querySnapshot);

        var stocklist = '<table class="table table-striped">'
        stocklist += '<tr><th>依頼日時</th><th>店舗名</th><th>社員番号</th><th>氏名</th><th>申請理由</th><th>申請日時</th><th>電話承認者</th><th>FMS承認者</th><th>状態</th><th>編集</th>';
        querySnapshot.forEach((postDoc) => {
          switch(postDoc.get('status')){
          //承認
            case 'approve':
                var statusText = "承認";
                //以下PDFで印刷のコード
                //<button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button>
                stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>'+ postDoc.get('storeName') +'</td><td>'+ postDoc.get('staffNum') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('reason') + '</td><td>' + postDoc.get('date') + " " + postDoc.get('startDate') + "~" + postDoc.get('endDate') +  '</td><td>' + postDoc.get('phoneApprover') + '</td><td>' + postDoc.get('approvalPerson') + '</td><td>' + statusText + '</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                break;
          //不承認      
            case 'disapproval':
                var statusText = "不承認";
                stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>'+ postDoc.get('storeName') +'</td><td>'+ postDoc.get('staffNum') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('reason') + '</td><td>' + postDoc.get('date') + " " + postDoc.get('startDate') + "~" + postDoc.get('endDate') +  '</td><td>' + postDoc.get('phoneApprover') + '</td><td>' + postDoc.get('approvalPerson') + '</td><td>' + statusText + '</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                break;
          //未承認      
            default:
                var statusText = "未承認";
                stocklist += '<tbody><tr><td>'+ postDoc.get('createdAt') +'</td><td>'+ postDoc.get('storeName') +'</td><td>'+ postDoc.get('staffNum') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('reason') + '</td><td>' + postDoc.get('date') + " " + postDoc.get('startDate') + "~" + postDoc.get('endDate') +  '</td><td>' + postDoc.get('phoneApprover') + '</td><td></td><td>' + statusText + '</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                break;        
          }
        })
        stocklist += '</table>';
        document.getElementById('table_list').innerHTML = stocklist;

        //後が無い場合に非表示
        if(querySnapshot.docs.length < 10){
            document.getElementById('nextButton').style.visibility = "hidden";
        }

        } catch (err) {
            console.log(err);
        }
    })();
}

//status編集
function EditUpdate(id){
    //status
    var createdAt = document.getElementById('createdAt_edit').value;
    var staffNum = document.getElementById('staffNum_edit').value;
    var name = document.getElementById('name_edit').value;
    var date = document.getElementById('date_edit').value;
    var startDate = document.getElementById('startDate_edit').value;
    var endDate = document.getElementById('endDate_edit').value;
    var reason = document.getElementById('reason_detail_edit').value;
    var phoneApprover = document.getElementById('phoneApprover').value;
    var approvalPerson = document.getElementById('approvalPerson').value;
    var order_category = document.getElementById('order_category').value;
    if(order_category == 'disapproval'){
        var disapproval_reason = document.getElementById('disapprovalReason').value;
    };
    var note = document.getElementById('note').value;
    //DBへ送信
    if(order_category == 'disapproval'){
        db.collection('overtimeApp').doc(id).update({
            createdAt:createdAt,
            staffNum:staffNum,
            name:name,
            date:date,
            startDate:startDate,
            endDate:endDate,
            reason:reason,
            phoneApprover:phoneApprover,
            approvalPerson:approvalPerson,
            status:order_category,
            disapprovalReason:disapproval_reason,
            note:note,
        });
    }else{
        db.collection('overtimeApp').doc(id).update({
            createdAt:createdAt,
            staffNum:staffNum,
            name:name,
            date:date,
            startDate:startDate,
            endDate:endDate,
            reason:reason,
            phoneApprover:phoneApprover,
            approvalPerson:approvalPerson,
            status:order_category,
            note:note,
        });
    };
    var collectAlert = document.getElementById('collectAlert');
    collectAlert.innerHTML = '<div class="alert alert-success" role="alert">編集完了!リロードします。</div>';
    setTimeout("location.reload()",2000);
}

//削除
function deleteContent(id,name){
    var res = window.confirm(name + "さんの内容を削除しますか？");
    if( res ) {
        db.collection('overtimeApp').doc(id).delete();
        alert("削除されました。");
        setTimeout("location.reload()",500);
    }
    else {
        // キャンセルならアラートボックスを表示
        alert("キャンセルしました。");
    } 
};

//PDF作成
// function createPDF(id){
//   (async () => {
//     try {
//       const carrentDB = await db.collection('overtimeApp').doc(id).get();
//       //氏名
//       var name = carrentDB.get('name');
//       //日時
//       var createdAt = carrentDB.get('createdAt');
//       //残業日時
//       var date = carrentDB.get('date');
//       //開始時
//       var startDate = carrentDB.get('startDate');
//       //終了時
//       var endDate = carrentDB.get('endDate');
//       //申請理由
//       var reason = carrentDB.get('reason');
//       //承認者氏名
//       var approvalPerson = carrentDB.get('approvalPerson');
//       //処理
//       var status = carrentDB.get('status');
//       if(status == 'disapproval'){
//           var disapprovalReason = carrentDB.get('disapprovalReason');
//           //要望詳細の1行の文字数を指定
//         var textLimit = 34;//ここだけ設定
//         var tmp = disapprovalReason.split("\n");

//         var kaigyouBody = [];


//         for (var key in tmp) {

//             if(tmp[key] != ""){

//                 if(tmp[key].length >= textLimit){

//                     let oneSplit = tmp[key].split('');
//                     let oneBody = [];

//                     for (var key2 in oneSplit) {

//                     //key2 1文字目でなく、さらに textLimit の倍数の数値なら改行コードを挿入
//                     if(key2 != 0 && key2%textLimit == 0){
//                         oneBody.push("\n");
//                     }

//                     oneBody.push(oneSplit[key2]);

//                 }

//                     kaigyouBody.push(oneBody.join(""));

//                 } else {
//                     kaigyouBody.push(tmp[key]);
//                 }

//             }

//         }


//         var disapprovalReason = kaigyouBody.join("\n");
//       };
//       //備考
//       var note = carrentDB.get('note');

//       //要望詳細の1行の文字数を指定
//       var textLimit1 = 34;//ここだけ設定
//       var tmp1 = note.split("\n");

//       var kaigyouBody1 = [];


//       for (var key in tmp1) {

//           if(tmp1[key] != ""){

//               if(tmp1[key].length >= textLimit1){

//                   let oneSplit1 = tmp1[key].split('');
//                   let oneBody1 = [];

//                   for (var key2 in oneSplit1) {

//                   //key2 1文字目でなく、さらに textLimit の倍数の数値なら改行コードを挿入
//                   if(key2 != 0 && key2%textLimit1 == 0){
//                       oneBody1.push("\n");
//                   }

//                   oneBody1.push(oneSplit1[key2]);

//               }

//                   kaigyouBody1.push(oneBody1.join(""));

//               } else {
//                   kaigyouBody1.push(tmp1[key]);
//               }

//           }

//       }


//       var note = kaigyouBody1.join("\n");

//           //日本語フォント読み込み
//           pdfMake.fonts = {
//               GenShin: {
//               normal: 'GenShinGothic-Normal-Sub.ttf',
//               bold: 'GenShinGothic-Normal-Sub.ttf',
//               italics: 'GenShinGothic-Normal-Sub.ttf',
//               bolditalics: 'GenShinGothic-Normal-Sub.ttf'
//               }
//           };

//           if(status == "approve"){
//               //PDF作成処理
//               var docDef = {
//                   content: [
//                       {
//                           columns: [
//                               {
//                                   width: '*',
//                                   text: createdAt,
//                                   style: ['right','border'],
//                                   fontSize: 10
//                               }
//                           ],
//                           columnGap: 10
//                       },
//                       {
//                         columns: [
//                             {
//                                 width: '*',
//                                 text: '残業申請書',
//                                 margin: [ 0, 0, 0, 10 ],
//                                 style: ['center','border'],
//                                 fontSize: 20
//                             }
//                         ],
//                         columnGap: 10
//                       },
//                       {
//                         table: {
//                             headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
//                             widths: [50, '*'],
//                             body: [
//                                 ['氏名',{text:name,fontSize:15,alignment:'center'}],
//                             ],
//                         }
//                       },
//                       {
//                         columns: [
//                             {
//                                 width: '*',
//                                 text: '下記の通り残業の申請をします。',
//                                 margin:[0,10],
//                                 style: ['left','border'],
//                                 fontSize: 10
//                             }
//                         ],
//                         columnGap: 10
//                       },
//                       {
//                         table: {
//                             headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
//                             widths: ['*'],
//                             style:['center'],
//                             body: [
//                                 ['日時'],
//                                 [{text:date + '\n' + startDate + '~' + endDate,fontSize:15,alignment:'center'}]
//                             ]
//                         }
//                       },
//                       {
//                         table: {
//                             headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
//                             widths: ['*'],
//                             body: [
//                                 ['申請理由'],
//                                 [{text:reason,fontSize:15}]
//                             ]
//                         }
//                       },
//                       {
//                         table: {
//                             headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
//                             widths: ['*', '*', '*'],
//                             style:['center'],
//                             body: [
//                                 ['管理者承認', '本部承認者'],
//                                 [{text:'',fontSize:20},{text:approvalPerson,fontSize:15,alignment:'center'}]
//                             ]
//                         }
//                       },
//                       {
//                         table: {
//                             headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
//                             widths: ['*'],
//                             body: [
//                                 ['備考'],
//                                 [{text:note,fontSize:15}]
//                             ]
//                         }
//                       },
//                   ],
//                   styles:{
//                       center:{
//                           alignment: 'center'
//                       },
//                       right:{
//                         alignment: 'right'
//                       },
//                       left:{
//                         alignment: 'left'
//                       },
//                       border:{
//                           decorationStyle:'dashed'
//                       }
//                   },
//                   defaultStyle: {
//                       font: 'GenShin',
//                   },
//               };
//           }else{
//                //PDF作成処理
//                var docDef = {
//                 content: [
//                     {
//                         columns: [
//                             {
//                                 width: '*',
//                                 text: createdAt,
//                                 style: ['right','border'],
//                                 fontSize: 10
//                             }
//                         ],
//                         columnGap: 10
//                     },
//                     {
//                       columns: [
//                           {
//                               width: '*',
//                               text: '残業申請書',
//                               margin: [ 0, 0, 0, 10 ],
//                               style: ['center','border'],
//                               fontSize: 20
//                           }
//                       ],
//                       columnGap: 10
//                     },
//                     {
//                       table: {
//                           headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
//                           widths: [50, '*'],
//                           body: [
//                               ['氏名',{text:name,fontSize:15,alignment:'center'}],
//                           ],
//                       }
//                     },
//                     {
//                       columns: [
//                           {
//                               width: '*',
//                               text: '下記の通り残業の申請をします。',
//                               margin:[0,10],
//                               style: ['left','border'],
//                               fontSize: 10
//                           }
//                       ],
//                       columnGap: 10
//                     },
//                     {
//                       table: {
//                           headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
//                           widths: ['*'],
//                           style:['center'],
//                           body: [
//                               ['日時'],
//                               [{text:date + '\n' + startDate + '~' + endDate,fontSize:15,alignment:'center'}]
//                           ]
//                       }
//                     },
//                     {
//                       table: {
//                           headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
//                           widths: ['*'],
//                           body: [
//                               ['申請理由'],
//                               [{text:reason,fontSize:15}]
//                           ]
//                       }
//                     },
//                     {
//                       table: {
//                           headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
//                           widths: ['*', '*', '*'],
//                           style:['center'],
//                           body: [
//                               ['管理者不承認', '本部承認者'],
//                               [{text:'',fontSize:20},{text:approvalPerson,fontSize:15,alignment:'center'}]
//                           ]
//                       }
//                     },
//                     {
//                         table: {
//                             headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
//                             widths: ['*'],
//                             body: [
//                                 ['不承認理由'],
//                                 [{text:disapprovalReason,fontSize:15}]
//                             ]
//                         }
//                       },
//                     {
//                       table: {
//                           headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
//                           widths: ['*'],
//                           body: [
//                               ['備考'],
//                               [{text:note,fontSize:15}]
//                           ]
//                       }
//                     },
//                 ],
//                 styles:{
//                     center:{
//                         alignment: 'center'
//                     },
//                     right:{
//                       alignment: 'right'
//                     },
//                     left:{
//                       alignment: 'left'
//                     },
//                     border:{
//                         decorationStyle:'dashed'
//                     }
//                 },
//                 defaultStyle: {
//                     font: 'GenShin',
//                 },
//             };
//           }
//           pdfMake.createPdf(docDef).print();
//           //pdfMake.createPdf(docDef).download("残業申請書.pdf");
//     } catch (err) {
//     console.log(`Error: ${JSON.stringify(err)}`)
//     }
// })();
// }