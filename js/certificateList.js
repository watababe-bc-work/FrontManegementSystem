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

//テーブル表示(初期値)
(async () => {
    try {
      // 省略 
      // (Cloud Firestoreのインスタンスを初期化してdbにセット)
  
      query = await db.collection('certificates').orderBy('createdAt', 'desc').limit(10) // firebase.firestore.QuerySnapshotのインスタンスを取得
      querySnapshot = await query.get();

      //前回のDBとして保存
      backQueryList.push(querySnapshot);

      var stocklist = '<table class="table table-striped">'
      stocklist += '<tr><th>申請日</th><th>社員番号</th><th>店舗名</th><th>氏名</th><th>必要書類</th><th>部数</th><th>提出先</th><th>依頼内容</th><th>希望期日</th><th>状態</th><th>承認者</th><th>編集</th>';
      querySnapshot.forEach((postDoc) => {
        switch(postDoc.get('status')){
        //承認
          case 'approve':
              var statusText = "承認";
              stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('staffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('paper') + '</td><td>' + postDoc.get('required_number') + '枚</td><td>'+ postDoc.get('submission_target') +'</td><td>' + postDoc.get('reason') + '</td><td>'+ postDoc.get('endDate') +'</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
              break;
        //発送済み     
          case 'delivered':
              var statusText = "発送済み";
              stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('staffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('paper') + '</td><td>' + postDoc.get('required_number') + '枚</td><td>'+ postDoc.get('submission_target') +'</td><td>' + postDoc.get('reason') + '</td><td>'+ postDoc.get('endDate') +'</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
              break;
        //未承認      
          default:
              var statusText = "未承認";
              stocklist += '<tbody><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('staffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('paper') + '</td><td>' + postDoc.get('required_number') + '枚</td><td>'+ postDoc.get('submission_target') +'</td><td>' + postDoc.get('reason') + '</td><td>'+ postDoc.get('endDate') +'</td><td>'+ statusText +'</td><td>'+ '' +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
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

//検索
function showTable(){
    var store = document.getElementById('store_name_search').value;
    //テーブル表示(初期値)
    (async () => {
        try {
        // 省略 
        // (Cloud Firestoreのインスタンスを初期化してdbにセット)
    
        query = await db.collection('certificates').where('storeName','==',store).orderBy('createdAt', 'desc').limit(10) // firebase.firestore.QuerySnapshotのインスタンスを取得
        querySnapshot = await query.get();

        //前回のDBとして保存
        backQueryList.push(querySnapshot);

        var stocklist = '<table class="table table-striped">'
        stocklist += '<tr><th>申請日</th><th>社員番号</th><th>店舗名</th><th>氏名</th><th>必要書類</th><th>部数</th><th>提出先</th><th>依頼内容</th><th>希望期日</th><th>状態</th><th>承認者</th><th>編集</th>';
        querySnapshot.forEach((postDoc) => {
            switch(postDoc.get('status')){
            //承認
              case 'approve':
                  var statusText = "承認";
                  stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('staffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('paper') + '</td><td>' + postDoc.get('required_number') + '枚</td><td>'+ postDoc.get('submission_target') +'</td><td>' + postDoc.get('reason') + '</td><td>'+ postDoc.get('endDate') +'</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                  break;
            //発送済み     
              case 'delivered':
                  var statusText = "発送済み";
                  stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('staffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('paper') + '</td><td>' + postDoc.get('required_number') + '枚</td><td>'+ postDoc.get('submission_target') +'</td><td>' + postDoc.get('reason') + '</td><td>'+ postDoc.get('endDate') +'</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                  break;
            //未承認      
              default:
                  var statusText = "未承認";
                  stocklist += '<tbody><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('staffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('paper') + '</td><td>' + postDoc.get('required_number') + '枚</td><td>'+ postDoc.get('submission_target') +'</td><td>' + postDoc.get('reason') + '</td><td>'+ postDoc.get('endDate') +'</td><td>'+ statusText +'</td><td>'+ '' +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
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

//キャンセル
function cancel(){
    setTimeout("location.reload()");
}

//編集用モーダルウィンドウ
function editStatus(id){
  (async () => {
    try {
        const carrentDB = await db.collection('certificates').doc(id).get();
        document.getElementById('name_edit').textContent = carrentDB.get('name');
        document.getElementById('createdAt_edit').textContent = carrentDB.get('createdAt');
        document.getElementById('note_edit').textContent = carrentDB.get('note');
        document.getElementById('headquartersComment').textContent = carrentDB.get('headquartersComment');

        //必要書類確認
        var paperCheck = carrentDB.get('paper');
        var stocklist = "<label>必要書類</label>";
        if(paperCheck.match(/在職証明書/)){
            stocklist += '<p>在職証明書</p>';
        }
        if(paperCheck.match(/源泉徴収票/)){
            stocklist += '<p>源泉徴収票('+ carrentDB.get('tax_withholding') +'年分)</p>';
        }
        if(paperCheck.match(/給与明細/)){
            stocklist += '<p>給与明細(期間：'+ carrentDB.get('payroll_item_start') + '~' + carrentDB.get('payroll_item_end') +')</p>';
        }
        if(paperCheck.match(/賃金台帳/)){
            stocklist += '<p>賃金台帳(期間：'+ carrentDB.get('wage_ledger_start') + '~' + carrentDB.get('wage_ledger_end') +')</p>';
        }
        if(paperCheck.match(/その他/)){
            stocklist += '<p>その他'+ carrentDB.get('other') +'</p>';
        }

        document.getElementById('papersCheck').innerHTML = stocklist;

        var approver = carrentDB.get('approver');
        if(approver == null){
            document.getElementById('approver').value = "";
        }else{
            document.getElementById('approver').value = approver;
        }
        var order_category = document.getElementById('order_category');
        switch(carrentDB.get('status')){
            case 'approve':
                order_category.options[1].selected = true;
                break;
            case 'delivered':
                order_category.options[2].selected = true;
                break;
            default:
                order_category.options[0].selected = true;
                break;    
        }
        //編集送信ボタン生成
        document.getElementById('edit_submit_button').innerHTML = '<button type="submit" class="btn btn-success" onclick="EditUpdate(\''+id+'\')">送信する</button>';
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

          var stocklist = '<table class="table table-striped">'
          stocklist += '<tr><th>依頼日時</th><th>社員番号</th><th>店舗名</th><th>氏名</th><th>申請期間</th><th>申請理由</th><th>承認者</th><th>状態</th><th>承認者</th><th>編集</th>';
          querySnapshot.forEach((postDoc) => {
            switch(postDoc.get('status')){
            //承認
              case 'approve':
                  var statusText = "承認";
                  stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('staffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('paper') + '</td><td>' + postDoc.get('required_number') + '枚</td><td>'+ postDoc.get('submission_target') +'</td><td>' + postDoc.get('reason') + '</td><td>'+ postDoc.get('endDate') +'</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                  break;
            //発送済み     
              case 'delivered':
                  var statusText = "発送済み";
                  stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('staffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('paper') + '</td><td>' + postDoc.get('required_number') + '枚</td><td>'+ postDoc.get('submission_target') +'</td><td>' + postDoc.get('reason') + '</td><td>'+ postDoc.get('endDate') +'</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                  break;
            //未承認      
              default:
                  var statusText = "未承認";
                  stocklist += '<tbody><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('staffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('paper') + '</td><td>' + postDoc.get('required_number') + '枚</td><td>'+ postDoc.get('submission_target') +'</td><td>' + postDoc.get('reason') + '</td><td>'+ postDoc.get('endDate') +'</td><td>'+ statusText +'</td><td>'+ '' +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
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
  stocklist += '<tr><th>申請日</th><th>社員番号</th><th>店舗名</th><th>氏名</th><th>必要書類</th><th>部数</th><th>提出先</th><th>依頼内容</th><th>希望期日</th><th>状態</th><th>承認者</th><th>編集</th>';
  querySnapshot.forEach((postDoc) => {
    switch(postDoc.get('status')){
    //承認
      case 'approve':
          var statusText = "承認";
          stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('staffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('paper') + '</td><td>' + postDoc.get('required_number') + '枚</td><td>'+ postDoc.get('submission_target') +'</td><td>' + postDoc.get('reason') + '</td><td>'+ postDoc.get('endDate') +'</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
          break;
    //発送済み     
      case 'delivered':
          var statusText = "発送済み";
          stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('staffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('paper') + '</td><td>' + postDoc.get('required_number') + '枚</td><td>'+ postDoc.get('submission_target') +'</td><td>' + postDoc.get('reason') + '</td><td>'+ postDoc.get('endDate') +'</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
          break;
    //未承認      
      default:
          var statusText = "未承認";
          stocklist += '<tbody><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('staffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('paper') + '</td><td>' + postDoc.get('required_number') + '枚</td><td>'+ postDoc.get('submission_target') +'</td><td>' + postDoc.get('reason') + '</td><td>'+ postDoc.get('endDate') +'</td><td>'+ statusText +'</td><td>'+ '' +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
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

//status編集
function EditUpdate(id){
    //status
    var order_category = document.getElementById('order_category').value;
    var approver = document.getElementById('approver').value;
    var headquartersComment = document.getElementById('headquartersComment').value;
    //DBへ送信
    db.collection('certificates').doc(id).update({
        status:order_category,
        approver:approver,
        headquartersComment:headquartersComment,
    });
    var collectAlert = document.getElementById('collectAlert');
    collectAlert.innerHTML = '<div class="alert alert-success" role="alert">編集完了!リロードします。</div>';
    setTimeout("location.reload()",2000);
}

//削除
function deleteContent(id,name){
    var res = window.confirm(name + "さんの申請を削除しますか？");
    if( res ) {
        db.collection('certificates').doc(id).delete();
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
    if(paperCheck.match(/在職証明書/)){
        stocklist += "在職証明書\n";
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