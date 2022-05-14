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
  
      query = await db.collection('uniforms').orderBy('createdAt', 'desc').limit(10) // firebase.firestore.QuerySnapshotのインスタンスを取得
      querySnapshot = await query.get();

      //前回のDBとして保存
      backQueryList.push(querySnapshot);

      var stocklist = '<table class="table table-striped">'
      stocklist += '<tr><th>申請日</th><th>社員番号</th><th>店舗名</th><th>氏名</th><th>種類</th><th>状態</th><th>承認者</th><th>編集</th>';
      querySnapshot.forEach((postDoc) => {
        if(postDoc.get('demandStatus') == "通常購入"){
            switch(postDoc.get('status')){
                //承認
                  case 'approve':
                      var statusText = "承認";
                      stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状態を変更</button></a></td></tr></tbody>';
                      break;
                //発送済み     
                  case 'delivered':
                      var statusText = "発送済み";
                      stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状態を変更</button></a></td></tr></tbody>';
                      break;
                //未承認      
                  default:
                      var statusText = "未承認";
                      stocklist += '<tbody><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ '' +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状態を変更</button></a></td></tr></tbody>';
                      break;        
            }
        }else{
            switch(postDoc.get('status')){
                //承認
                  case 'approve':
                      var statusText = "承認";
                      stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('category') + '</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状態を変更</button></a></td></tr></tbody>';
                      break;
                //発送済み     
                  case 'delivered':
                      var statusText = "発送済み";
                      stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('category') + '</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状態を変更</button></a></td></tr></tbody>';
                      break;
                //未承認      
                  default:
                      var statusText = "未承認";
                      stocklist += '<tbody><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('category') + '</td><td>'+ statusText +'</td><td>'+ '' +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状態を変更</button></a></td></tr></tbody>';
                      break;        
            }
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
    
        query = await db.collection('uniforms').where('storeName','==',store).orderBy('createdAt', 'desc').limit(10) // firebase.firestore.QuerySnapshotのインスタンスを取得
        querySnapshot = await query.get();

        //前回のDBとして保存
        backQueryList.push(querySnapshot);

        var stocklist = '<table class="table table-striped">'
        stocklist += '<tr><th>申請日</th><th>社員番号</th><th>店舗名</th><th>氏名</th><th>種類</th><th>状態</th><th>承認者</th><th>編集</th>';
        querySnapshot.forEach((postDoc) => {
            if(postDoc.get('demandStatus') == "通常購入"){
                switch(postDoc.get('status')){
                    //承認
                      case 'approve':
                          var statusText = "承認";
                          stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状態を変更</button></a></td></tr></tbody>';
                          break;
                    //発送済み     
                      case 'delivered':
                          var statusText = "発送済み";
                          stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状態を変更</button></a></td></tr></tbody>';
                          break;
                    //未承認      
                      default:
                          var statusText = "未承認";
                          stocklist += '<tbody><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ '' +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状態を変更</button></a></td></tr></tbody>';
                          break;        
                }
            }else{
                switch(postDoc.get('status')){
                    //承認
                      case 'approve':
                          var statusText = "承認";
                          stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('category') + '</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状態を変更</button></a></td></tr></tbody>';
                          break;
                    //発送済み     
                      case 'delivered':
                          var statusText = "発送済み";
                          stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('category') + '</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状態を変更</button></a></td></tr></tbody>';
                          break;
                    //未承認      
                      default:
                          var statusText = "未承認";
                          stocklist += '<tbody><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('category') + '</td><td>'+ statusText +'</td><td>'+ '' +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状態を変更</button></a></td></tr></tbody>';
                          break;        
                }
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
        const carrentDB = await db.collection('uniforms').doc(id).get();
        document.getElementById('name_edit').textContent = carrentDB.get('name');
        document.getElementById('stuffNum_edit').textContent = carrentDB.get('stuffNum')
        document.getElementById('createdAt_edit').textContent = carrentDB.get('createdAt');
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
          stocklist += '<tr><th>申請日</th><th>社員番号</th><th>店舗名</th><th>氏名</th><th>種類</th><th>状態</th><th>承認者</th><th>編集</th>';
          querySnapshot.forEach((postDoc) => {
            if(postDoc.get('demandStatus') == "通常購入"){
                switch(postDoc.get('status')){
                    //承認
                      case 'approve':
                          var statusText = "承認";
                          stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状態を変更</button></a></td></tr></tbody>';
                          break;
                    //発送済み     
                      case 'delivered':
                          var statusText = "発送済み";
                          stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状態を変更</button></a></td></tr></tbody>';
                          break;
                    //未承認      
                      default:
                          var statusText = "未承認";
                          stocklist += '<tbody><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ '' +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状態を変更</button></a></td></tr></tbody>';
                          break;        
                }
            }else{
                switch(postDoc.get('status')){
                    //承認
                      case 'approve':
                          var statusText = "承認";
                          stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('category') + '</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状態を変更</button></a></td></tr></tbody>';
                          break;
                    //発送済み     
                      case 'delivered':
                          var statusText = "発送済み";
                          stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('category') + '</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状態を変更</button></a></td></tr></tbody>';
                          break;
                    //未承認      
                      default:
                          var statusText = "未承認";
                          stocklist += '<tbody><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('category') + '</td><td>'+ statusText +'</td><td>'+ '' +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状態を変更</button></a></td></tr></tbody>';
                          break;        
                }
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
  stocklist += '<tr><th>申請日</th><th>社員番号</th><th>店舗名</th><th>氏名</th><th>種類</th><th>状態</th><th>承認者</th><th>編集</th>';
  querySnapshot.forEach((postDoc) => {
    if(postDoc.get('demandStatus') == "通常購入"){
        switch(postDoc.get('status')){
            //承認
              case 'approve':
                  var statusText = "承認";
                  stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状態を変更</button></a></td></tr></tbody>';
                  break;
            //発送済み     
              case 'delivered':
                  var statusText = "発送済み";
                  stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状態を変更</button></a></td></tr></tbody>';
                  break;
            //未承認      
              default:
                  var statusText = "未承認";
                  stocklist += '<tbody><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ '' +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状態を変更</button></a></td></tr></tbody>';
                  break;        
        }
    }else{
        switch(postDoc.get('status')){
            //承認
              case 'approve':
                  var statusText = "承認";
                  stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('category') + '</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状態を変更</button></a></td></tr></tbody>';
                  break;
            //発送済み     
              case 'delivered':
                  var statusText = "発送済み";
                  stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('category') + '</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状態を変更</button></a></td></tr></tbody>';
                  break;
            //未承認      
              default:
                  var statusText = "未承認";
                  stocklist += '<tbody><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('category') + '</td><td>'+ statusText +'</td><td>'+ '' +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状態を変更</button></a></td></tr></tbody>';
                  break;        
        }
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
    //DBへ送信
    db.collection('uniforms').doc(id).update({
        status:order_category,
        approver:approver,
    });
    var collectAlert = document.getElementById('collectAlert');
    collectAlert.innerHTML = '<div class="alert alert-success" role="alert">編集完了!リロードします。</div>';
    setTimeout("location.reload()",2000);
}

//PDF作成
function createPDF(id){
  (async () => {
    try {
      const carrentDB = await db.collection('uniforms').doc(id).get();
      //申請日
      var createdAt = carrentDB.get('createdAt');
      //所属店舗
      var store = carrentDB.get('storeName')
      //社員番号
      var staffNum = carrentDB.get('stuffNum');
      //氏名
      var name = carrentDB.get('name');
      //種類
      var category = carrentDB.get('category');
      
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
          if(category == "ポロシャツ黒LL"){
            //PDF作成処理
            var docDef = {
                content: [
                    {
                      columns: [
                          {
                              width: '*',
                              text: 'ユニフォーム申請書',
                              margin: [ 0, 0, 0, 10 ],
                              style: ['center','border'],
                              fontSize: 20
                          }
                      ],
                      columnGap: 10
                    },
                    {
                      table: {
                          headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                          widths: ['*','*'],
                          body: [
                              [{text:'日付・店舗名',fontSize:15,alignment:'center'},{text:'社員番号・氏名',fontSize:15,alignment:'center'}],
                              [{text:createdAt,fontSize:15,alignment:'center'},{text:'社員番号: ' + staffNum,fontSize:15,alignment:'center'}],
                              [{text:'店舗: ' + store,fontSize:15,alignment:'center'},{text:'氏名: ' + name + '            印',fontSize:15,alignment:'center'}],
                          ],
                      }
                    },
                    {
                        columns: [
                            {
                                width: '*',
                                height:100,
                                text: ' ',
                                style: ['center'],
                                fontSize: 10
                            }
                        ],
                        columnGap: 10
                    },
                    {
                      table: {
                          headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                          widths: [150,100,150,'*'],
                          style:['center'],
                          body: [
                              ['',{text:'単価',fontSize:15,alignment:'center'},{text:'枚数',fontSize:15,alignment:'center'},{text:'金額',fontSize:15,alignment:'center'}],
                              [{text:'ポロシャツ黒S',fontSize:15,alignment:'center'},{text:'¥700',fontSize:15,alignment:'center'},{text:'枚',fontSize:15,alignment:'right'},{text:'',fontSize:15,alignment:'center'}],
                              [{text:'ポロシャツ黒M',fontSize:15,alignment:'center'},{text:'¥700',fontSize:15,alignment:'center'},{text:'枚',fontSize:15,alignment:'right'},{text:'',fontSize:15,alignment:'center'}],
                              [{text:'ポロシャツ黒L',fontSize:15,alignment:'center'},{text:'¥700',fontSize:15,alignment:'center'},{text:'枚',fontSize:15,alignment:'right'},{text:'',fontSize:15,alignment:'center'}],
                              [{text:'ポロシャツ黒LL',fontSize:15,alignment:'center'},{text:'¥700',fontSize:15,alignment:'center'},{text:'1枚',fontSize:15,alignment:'right'},{text:'¥700',fontSize:15,alignment:'center'}],
                              [{text:'ポロシャツ黒3L',fontSize:15,alignment:'center'},{text:'¥700',fontSize:15,alignment:'center'},{text:'枚',fontSize:15,alignment:'right'},{text:'',fontSize:15,alignment:'center'}],

                          ]
                      }
                    },
                    {
                        columns: [
                            {
                                width: '*',
                                height:100,
                                text: ' ',
                                style: ['center'],
                                fontSize: 10
                            }
                        ],
                        columnGap: 10
                    },
                    {
                        table: {
                            headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                            widths: [150,100,150,'*'],
                            style:['center'],
                            body: [
                                [{text:'ポロシャツ青S',fontSize:15,alignment:'center'},{text:'¥700',fontSize:15,alignment:'center'},{text:'枚',fontSize:15,alignment:'right'},{text:'',fontSize:15,alignment:'center'}],
                                [{text:'ポロシャツ青M',fontSize:15,alignment:'center'},{text:'¥700',fontSize:15,alignment:'center'},{text:'枚',fontSize:15,alignment:'right'},{text:'',fontSize:15,alignment:'center'}],
                                [{text:'ポロシャツ青L',fontSize:15,alignment:'center'},{text:'¥700',fontSize:15,alignment:'center'},{text:'枚',fontSize:15,alignment:'right'},{text:'',fontSize:15,alignment:'center'}],
                                [{text:'ポロシャツ青LL',fontSize:15,alignment:'center'},{text:'¥700',fontSize:15,alignment:'center'},{text:'枚',fontSize:15,alignment:'right'},{text:'',fontSize:15,alignment:'center'}],
                                [{text:'ポロシャツ青3L',fontSize:15,alignment:'center'},{text:'¥700',fontSize:15,alignment:'center'},{text:'枚',fontSize:15,alignment:'right'},{text:'',fontSize:15,alignment:'center'}],
  
                            ]
                        }
                      },
                      {
                        columns: [
                            {
                                width: '*',
                                height:100,
                                text: ' ',
                                style: ['center'],
                                fontSize: 10
                            }
                        ],
                        columnGap: 10
                    },
                    {
                        table: {
                            headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                            widths: [150,100,150,'*'],
                            style:['center'],
                            body: [
                                [{text:'エプロン',fontSize:15,alignment:'center'},{text:'¥800',fontSize:15,alignment:'center'},{text:'枚',fontSize:15,alignment:'right'},{text:'',fontSize:15,alignment:'center'}],
                                [{text:'ヘッドタオル',fontSize:15,alignment:'center'},{text:'¥400',fontSize:15,alignment:'center'},{text:'枚',fontSize:15,alignment:'right'},{text:'',fontSize:15,alignment:'center'}],
  
                            ]
                        }
                      },
                      {
                        columns: [
                            {
                                width: '*',
                                height:100,
                                text: ' ',
                                style: ['center'],
                                fontSize: 10
                            }
                        ],
                        columnGap: 10
                    },
                    {
                        table: {
                            headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                            widths: [150,100,150,'*'],
                            style:['center'],
                            body: [
                                [{text:'フリース青S',fontSize:15,alignment:'center'},{text:'¥2000',fontSize:15,alignment:'center'},{text:'枚',fontSize:15,alignment:'right'},{text:'',fontSize:15,alignment:'center'}],
                                [{text:'フリース青M',fontSize:15,alignment:'center'},{text:'¥2000',fontSize:15,alignment:'center'},{text:'枚',fontSize:15,alignment:'right'},{text:'',fontSize:15,alignment:'center'}],
                                [{text:'フリース青L',fontSize:15,alignment:'center'},{text:'¥2000',fontSize:15,alignment:'center'},{text:'枚',fontSize:15,alignment:'right'},{text:'',fontSize:15,alignment:'center'}],
                                [{text:'フリース青XL',fontSize:15,alignment:'center'},{text:'¥2000',fontSize:15,alignment:'center'},{text:'枚',fontSize:15,alignment:'right'},{text:'',fontSize:15,alignment:'center'}],
                            ]
                        }
                      },
                    {
                        columns: [
                            {
                                width: '*',
                                text: '合計金額    ¥700',
                                margin: [ 0, 30, 0, 10 ],
                                style: ['right','border'],
                                fontSize: 20
                            }
                        ],
                        columnGap: 10
                    },
                    {
                        columns: [
                            {
                                width: '*',
                                text: '※入社時にポロシャツ2枚とエプロン1枚(女性のみ)を支給しますが、\n1ヶ月以内に退社の場合は有償となり、上記合計金額が給与から天引きとなります。',
                                style: ['left'],
                                fontSize: 10
                            }
                        ],
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
        }else{
            //PDF作成処理
            var docDef = {
                content: [
                    {
                        columns: [
                            {
                                width: '*',
                                text: 'ユニフォーム申請書',
                                margin: [ 0, 0, 0, 10 ],
                                style: ['center','border'],
                                fontSize: 20
                            }
                        ],
                        columnGap: 10
                    },
                    {
                        table: {
                            headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                            widths: ['*','*'],
                            body: [
                                [{text:'日付・店舗名',fontSize:15,alignment:'center'},{text:'社員番号・氏名',fontSize:15,alignment:'center'}],
                                [{text:createdAt,fontSize:15,alignment:'center'},{text:'社員番号: ' + staffNum,fontSize:15,alignment:'center'}],
                                [{text:'店舗: ' + store,fontSize:15,alignment:'center'},{text:'氏名: ' + name + '            印',fontSize:15,alignment:'center'}],
                            ],
                        }
                    },
                    {
                        columns: [
                            {
                                width: '*',
                                height:100,
                                text: ' ',
                                style: ['center'],
                                fontSize: 10
                            }
                        ],
                        columnGap: 10
                    },
                    {
                        table: {
                            headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                            widths: [150,100,150,'*'],
                            style:['center'],
                            body: [
                                ['',{text:'単価',fontSize:15,alignment:'center'},{text:'枚数',fontSize:15,alignment:'center'},{text:'金額',fontSize:15,alignment:'center'}],
                                [{text:'ポロシャツ黒S',fontSize:15,alignment:'center'},{text:'¥700',fontSize:15,alignment:'center'},{text:'枚',fontSize:15,alignment:'right'},{text:'',fontSize:15,alignment:'center'}],
                                [{text:'ポロシャツ黒M',fontSize:15,alignment:'center'},{text:'¥700',fontSize:15,alignment:'center'},{text:'枚',fontSize:15,alignment:'right'},{text:'',fontSize:15,alignment:'center'}],
                                [{text:'ポロシャツ黒L',fontSize:15,alignment:'center'},{text:'¥700',fontSize:15,alignment:'center'},{text:'枚',fontSize:15,alignment:'right'},{text:'',fontSize:15,alignment:'center'}],
                                [{text:'ポロシャツ黒LL',fontSize:15,alignment:'center'},{text:'¥700',fontSize:15,alignment:'center'},{text:'枚',fontSize:15,alignment:'right'},{text:'',fontSize:15,alignment:'center'}],
                                [{text:'ポロシャツ黒3L',fontSize:15,alignment:'center'},{text:'¥700',fontSize:15,alignment:'center'},{text:'枚',fontSize:15,alignment:'right'},{text:'',fontSize:15,alignment:'center'}],

                            ]
                        }
                    },
                    {
                        columns: [
                            {
                                width: '*',
                                height:100,
                                text: ' ',
                                style: ['center'],
                                fontSize: 10
                            }
                        ],
                        columnGap: 10
                    },
                    {
                        table: {
                            headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                            widths: [150,100,150,'*'],
                            style:['center'],
                            body: [
                                [{text:'ポロシャツ青S',fontSize:15,alignment:'center'},{text:'¥700',fontSize:15,alignment:'center'},{text:'枚',fontSize:15,alignment:'right'},{text:'',fontSize:15,alignment:'center'}],
                                [{text:'ポロシャツ青M',fontSize:15,alignment:'center'},{text:'¥700',fontSize:15,alignment:'center'},{text:'枚',fontSize:15,alignment:'right'},{text:'',fontSize:15,alignment:'center'}],
                                [{text:'ポロシャツ青L',fontSize:15,alignment:'center'},{text:'¥700',fontSize:15,alignment:'center'},{text:'枚',fontSize:15,alignment:'right'},{text:'',fontSize:15,alignment:'center'}],
                                [{text:'ポロシャツ青LL',fontSize:15,alignment:'center'},{text:'¥700',fontSize:15,alignment:'center'},{text:'1枚',fontSize:15,alignment:'right'},{text:'¥700',fontSize:15,alignment:'center'}],
                                [{text:'ポロシャツ青3L',fontSize:15,alignment:'center'},{text:'¥700',fontSize:15,alignment:'center'},{text:'枚',fontSize:15,alignment:'right'},{text:'',fontSize:15,alignment:'center'}],
    
                            ]
                        }
                        },
                        {
                        columns: [
                            {
                                width: '*',
                                height:100,
                                text: ' ',
                                style: ['center'],
                                fontSize: 10
                            }
                        ],
                        columnGap: 10
                    },
                    {
                        table: {
                            headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                            widths: [150,100,150,'*'],
                            style:['center'],
                            body: [
                                [{text:'エプロン',fontSize:15,alignment:'center'},{text:'¥800',fontSize:15,alignment:'center'},{text:'枚',fontSize:15,alignment:'right'},{text:'',fontSize:15,alignment:'center'}],
                                [{text:'ヘッドタオル',fontSize:15,alignment:'center'},{text:'¥400',fontSize:15,alignment:'center'},{text:'枚',fontSize:15,alignment:'right'},{text:'',fontSize:15,alignment:'center'}],
    
                            ]
                        }
                        },
                        {
                        columns: [
                            {
                                width: '*',
                                height:100,
                                text: ' ',
                                style: ['center'],
                                fontSize: 10
                            }
                        ],
                        columnGap: 10
                    },
                    {
                        table: {
                            headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                            widths: [150,100,150,'*'],
                            style:['center'],
                            body: [
                                [{text:'フリース青S',fontSize:15,alignment:'center'},{text:'¥2000',fontSize:15,alignment:'center'},{text:'枚',fontSize:15,alignment:'right'},{text:'',fontSize:15,alignment:'center'}],
                                [{text:'フリース青M',fontSize:15,alignment:'center'},{text:'¥2000',fontSize:15,alignment:'center'},{text:'枚',fontSize:15,alignment:'right'},{text:'',fontSize:15,alignment:'center'}],
                                [{text:'フリース青L',fontSize:15,alignment:'center'},{text:'¥2000',fontSize:15,alignment:'center'},{text:'枚',fontSize:15,alignment:'right'},{text:'',fontSize:15,alignment:'center'}],
                                [{text:'フリース青XL',fontSize:15,alignment:'center'},{text:'¥2000',fontSize:15,alignment:'center'},{text:'枚',fontSize:15,alignment:'right'},{text:'',fontSize:15,alignment:'center'}],
                            ]
                        }
                        },
                    {
                        columns: [
                            {
                                width: '*',
                                text: '合計金額    ¥700',
                                margin: [ 0, 30, 0, 10 ],
                                style: ['right','border'],
                                fontSize: 20
                            }
                        ],
                        columnGap: 10
                    },
                    {
                        columns: [
                            {
                                width: '*',
                                text: '※入社時にポロシャツ2枚とエプロン1枚(女性のみ)を支給しますが、\n1ヶ月以内に退社の場合は有償となり、上記合計金額が給与から天引きとなります。',
                                style: ['left'],
                                fontSize: 10
                            }
                        ],
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
        }
          pdfMake.createPdf(docDef).print();
          //pdfMake.createPdf(docDef).download("残業申請書.pdf");
    } catch (err) {
    console.log(`Error: ${JSON.stringify(err)}`)
    }
})();
}