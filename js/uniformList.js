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
var reloadQuery = "";
var reloadQuerySnapshot = "";
document.getElementById('prevButton').style.visibility = 'hidden';


//テーブル表示(初期値)
(async () => {
    try {
      // 省略 
      // (Cloud Firestoreのインスタンスを初期化してdbにセット)
  
      query = await db.collection('uniforms').orderBy('createdAt', 'desc').limit(20) // firebase.firestore.QuerySnapshotのインスタンスを取得
      querySnapshot = await query.get();
      
      //現在のクエリとしてリロード時のために保存
      reloadQuery = query;

      var stocklist = '<table class="table table-striped" id="download_table">'
      stocklist += '<tr><th>申請日</th><th>店舗名</th><th>社員番号</th><th>シフト名</th><th>要望内容</th><th>発送準備</th><th>本部発送者</th><th>本人へ渡した者</th><th>状態</th><th>編集</th><th>備考</th>';
      querySnapshot.forEach((postDoc) => {
          if(postDoc.get('demandStatus') == '追加購入'){
              switch(postDoc.get('status')){
                  //完了
                  case 'approval':
                      var statusText = "完了";
                      stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('stuffNum') + '</td><td>' + postDoc.get('name') + '</td><td>'+ postDoc.get('demandStatus') +'</td><td>' + postDoc.get('deliveryPreparation') + '</td><td>' + postDoc.get('headerDeliveryPerson') + '</td><td>' + postDoc.get('passedPerson') + '</td><td>' + statusText + '</td><td>'+ '<button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">納品書作成</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button>' +'</td><td>'+ postDoc.get('note') +'</td></tr></tbody>';
                      break;
                  //未対応     
                  default:
                      var statusText = "未完了";
                      stocklist += '<tbody class="yetBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('stuffNum') + '</td><td>' + postDoc.get('name') + '</td><td>'+ postDoc.get('demandStatus') +'</td><td>' + postDoc.get('deliveryPreparation') + '</td><td>' + postDoc.get('headerDeliveryPerson') + '</td><td>' + postDoc.get('passedPerson') + '</td><td>' + statusText + '</td><td>'+ '<button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">納品書作成</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button>' +'</td><td>'+ postDoc.get('note') +'</td></tr></tbody>';
                      break;        
              }
          }else if(postDoc.get('demandStatus') == '忘れ購入'){
              switch(postDoc.get('status')){
                  //完了
                  case 'approval':
                      var statusText = "完了";
                      stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('stuffNum') + '</td><td>' + postDoc.get('name') + '</td><td>'+ postDoc.get('demandStatus') +'</td><td>' + postDoc.get('deliveryPreparation') + '</td><td>' + postDoc.get('headerDeliveryPerson') + '</td><td>' + postDoc.get('passedPerson') + '</td><td>' + statusText + '</td><td>'+ '<button class="btn btn-success" onclick="emergencyPDF(\''+postDoc.id+'\')">納品書作成</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button>' +'</td><td>'+ postDoc.get('note') +'</td></tr></tbody>';
                      break;
                  //未対応     
                  default:
                      var statusText = "未完了";
                      stocklist += '<tbody class="yetBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('stuffNum') + '</td><td>' + postDoc.get('name') + '</td><td>'+ postDoc.get('demandStatus') +'</td><td>' + postDoc.get('deliveryPreparation') + '</td><td>' + postDoc.get('headerDeliveryPerson') + '</td><td>' + postDoc.get('passedPerson') + '</td><td>' + statusText + '</td><td>'+ '<button class="btn btn-success" onclick="emergencyPDF(\''+postDoc.id+'\')">納品書作成</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button>' +'</td><td>'+ postDoc.get('note') +'</td></tr></tbody>';
                      break;               
              }
          }else{
              switch(postDoc.get('status')){
                  //完了
                  case 'approval':
                      var statusText = "完了";
                      stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('stuffNum') + '</td><td>' + postDoc.get('name') + '</td><td>'+ postDoc.get('demandStatus') +'</td><td>' + postDoc.get('deliveryPreparation') + '</td><td>' + postDoc.get('headerDeliveryPerson') + '</td><td>' + postDoc.get('passedPerson') + '</td><td>' + statusText + '</td><td>'+ '<button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">納品書作成</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button>' +'</td><td>'+ postDoc.get('note') +'</td></tr></tbody>';
                      break;
                  //未対応     
                  default:
                      var statusText = "未完了";
                      stocklist += '<tbody class="yetBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('stuffNum') + '</td><td>' + postDoc.get('name') + '</td><td>'+ postDoc.get('demandStatus') +'</td><td>' + postDoc.get('deliveryPreparation') + '</td><td>' + postDoc.get('headerDeliveryPerson') + '</td><td>' + postDoc.get('passedPerson') + '</td><td>' + statusText + '</td><td>'+ '<button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">納品書作成</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button>' +'</td><td>'+ postDoc.get('note') +'</td></tr></tbody>';
                      break;                
              }
          }
      })
      stocklist += '</table>';
      document.getElementById('table_list').innerHTML = stocklist;

      //後が無い場合に非表示
      if(querySnapshot.docs.length < 20){
        document.getElementById('nextButton').style.visibility = "hidden";
      }

    } catch (err) {
        console.log(err);
    }
})();

//検索
function search(){
    var store = document.getElementById('store_name_search').value;
    var StartDate_search = document.getElementById('StartDate_search').value;
    var EndDate_search = document.getElementById('EndDate_search').value;

    //テーブル表示(初期値)
    (async () => {
        try {
            query = await db.collection('uniforms');
    
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

            //項目でのソート
            var demandList = [];
            if(document.getElementById('add_purchase_search').checked){
                demandList.push('追加購入');
            };
            if(document.getElementById('forget_purchase_search').checked){
                demandList.push('忘れ購入');
            };
            if(document.getElementById('nameplate_search').checked){
                demandList.push('ネームプレート');
            };
            console.log(demandList);
            if(demandList.length > 0){
                query = query.where('demandStatus','in',demandList);
            }

            console.log(query);
            querySnapshot = await query.orderBy('orderDate', 'desc').orderBy('createdAt','desc').get();

            var stocklist = '<table class="table table-striped">'
            stocklist += '<tr><th>申請日</th><th>店舗名</th><th>社員番号</th><th>シフト名</th><th>要望内容</th><th>発送準備</th><th>本部発送者</th><th>本人へ渡した者</th><th>状態</th><th>編集</th><th>備考</th>';
            querySnapshot.forEach((postDoc) => {
                if(postDoc.get('demandStatus') == '追加購入'){
                    switch(postDoc.get('status')){
                        //完了
                        case 'approval':
                            var statusText = "完了";
                            stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('stuffNum') + '</td><td>' + postDoc.get('name') + '</td><td>'+ postDoc.get('demandStatus') +'</td><td>' + postDoc.get('deliveryPreparation') + '</td><td>' + postDoc.get('headerDeliveryPerson') + '</td><td>' + postDoc.get('passedPerson') + '</td><td>' + statusText + '</td><td>'+ '<button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">納品書作成</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button>' +'</td><td>'+ postDoc.get('note') +'</td></tr></tbody>';
                            break;
                        //未対応     
                        default:
                            var statusText = "未完了";
                            stocklist += '<tbody class="yetBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('stuffNum') + '</td><td>' + postDoc.get('name') + '</td><td>'+ postDoc.get('demandStatus') +'</td><td>' + postDoc.get('deliveryPreparation') + '</td><td>' + postDoc.get('headerDeliveryPerson') + '</td><td>' + postDoc.get('passedPerson') + '</td><td>' + statusText + '</td><td>'+ '<button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">納品書作成</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button>' +'</td><td>'+ postDoc.get('note') +'</td></tr></tbody>';
                            break;        
                    }
                }else if(postDoc.get('demandStatus') == '忘れ購入'){
                    switch(postDoc.get('status')){
                        //完了
                        case 'approval':
                            var statusText = "完了";
                            stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('stuffNum') + '</td><td>' + postDoc.get('name') + '</td><td>'+ postDoc.get('demandStatus') +'</td><td>' + postDoc.get('deliveryPreparation') + '</td><td>' + postDoc.get('headerDeliveryPerson') + '</td><td>' + postDoc.get('passedPerson') + '</td><td>' + statusText + '</td><td>'+ '<button class="btn btn-success" onclick="emergencyPDF(\''+postDoc.id+'\')">納品書作成</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button>' +'</td><td>'+ postDoc.get('note') +'</td></tr></tbody>';
                            break;
                        //未対応     
                        default:
                            var statusText = "未完了";
                            stocklist += '<tbody class="yetBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('stuffNum') + '</td><td>' + postDoc.get('name') + '</td><td>'+ postDoc.get('demandStatus') +'</td><td>' + postDoc.get('deliveryPreparation') + '</td><td>' + postDoc.get('headerDeliveryPerson') + '</td><td>' + postDoc.get('passedPerson') + '</td><td>' + statusText + '</td><td>'+ '<button class="btn btn-success" onclick="emergencyPDF(\''+postDoc.id+'\')">納品書作成</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button>' +'</td><td>'+ postDoc.get('note') +'</td></tr></tbody>';
                            break;               
                    }
                }else{
                    switch(postDoc.get('status')){
                        //完了
                        case 'approval':
                            var statusText = "完了";
                            stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('stuffNum') + '</td><td>' + postDoc.get('name') + '</td><td>'+ postDoc.get('demandStatus') +'</td><td>' + postDoc.get('deliveryPreparation') + '</td><td>' + postDoc.get('headerDeliveryPerson') + '</td><td>' + postDoc.get('passedPerson') + '</td><td>' + statusText + '</td><td>'+ '<button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">納品書作成</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button>' +'</td><td>'+ postDoc.get('note') +'</td></tr></tbody>';
                            break;
                        //未対応     
                        default:
                            var statusText = "未完了";
                            stocklist += '<tbody class="yetBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('stuffNum') + '</td><td>' + postDoc.get('name') + '</td><td>'+ postDoc.get('demandStatus') +'</td><td>' + postDoc.get('deliveryPreparation') + '</td><td>' + postDoc.get('headerDeliveryPerson') + '</td><td>' + postDoc.get('passedPerson') + '</td><td>' + statusText + '</td><td>'+ '<button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">納品書作成</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button>' +'</td><td>'+ postDoc.get('note') +'</td></tr></tbody>';
                            break;                
                    }
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

//キャンセル
function cancel(){
    setTimeout("location.reload()");
}

//次へ
function nextPegination(){
  document.getElementById('prevButton').style.visibility = 'visible';
  (async () => {
      try {
          //変更前のDB情報を保持しておく
          currentQueryList.push(querySnapshot);

          query = query.limit(20).startAfter(querySnapshot.docs[19]);
          querySnapshot = await query.get();

          //現在のクエリとしてリロード時のために保存
          reloadQuery = query;

          //後が無い場合に非表示
          if(querySnapshot.docs.length < 20){
              document.getElementById('nextButton').style.visibility = "hidden";
          }

          var stocklist = '<table class="table table-striped" id="download_table">'
          stocklist += '<tr><th>申請日</th><th>店舗名</th><th>社員番号</th><th>シフト名</th><th>要望内容</th><th>発送準備</th><th>本部発送者</th><th>本人へ渡した者</th><th>状態</th><th>編集</th><th>備考</th>';
          querySnapshot.forEach((postDoc) => {
              if(postDoc.get('demandStatus') == '追加購入'){
                  switch(postDoc.get('status')){
                      //完了
                      case 'approval':
                          var statusText = "完了";
                          stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('stuffNum') + '</td><td>' + postDoc.get('name') + '</td><td>'+ postDoc.get('demandStatus') +'</td><td>' + postDoc.get('deliveryPreparation') + '</td><td>' + postDoc.get('headerDeliveryPerson') + '</td><td>' + postDoc.get('passedPerson') + '</td><td>' + statusText + '</td><td>'+ '<button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">納品書作成</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button>' +'</td><td>'+ postDoc.get('note') +'</td></tr></tbody>';
                          break;
                      //未対応     
                      default:
                          var statusText = "未完了";
                          stocklist += '<tbody class="yetBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('stuffNum') + '</td><td>' + postDoc.get('name') + '</td><td>'+ postDoc.get('demandStatus') +'</td><td>' + postDoc.get('deliveryPreparation') + '</td><td>' + postDoc.get('headerDeliveryPerson') + '</td><td>' + postDoc.get('passedPerson') + '</td><td>' + statusText + '</td><td>'+ '<button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">納品書作成</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button>' +'</td><td>'+ postDoc.get('note') +'</td></tr></tbody>';
                          break;        
                  }
              }else if(postDoc.get('demandStatus') == '忘れ購入'){
                  switch(postDoc.get('status')){
                      //完了
                      case 'approval':
                          var statusText = "完了";
                          stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('stuffNum') + '</td><td>' + postDoc.get('name') + '</td><td>'+ postDoc.get('demandStatus') +'</td><td>' + postDoc.get('deliveryPreparation') + '</td><td>' + postDoc.get('headerDeliveryPerson') + '</td><td>' + postDoc.get('passedPerson') + '</td><td>' + statusText + '</td><td>'+ '<button class="btn btn-success" onclick="emergencyPDF(\''+postDoc.id+'\')">納品書作成</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button>' +'</td><td>'+ postDoc.get('note') +'</td></tr></tbody>';
                          break;
                      //未対応     
                      default:
                          var statusText = "未完了";
                          stocklist += '<tbody class="yetBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('stuffNum') + '</td><td>' + postDoc.get('name') + '</td><td>'+ postDoc.get('demandStatus') +'</td><td>' + postDoc.get('deliveryPreparation') + '</td><td>' + postDoc.get('headerDeliveryPerson') + '</td><td>' + postDoc.get('passedPerson') + '</td><td>' + statusText + '</td><td>'+ '<button class="btn btn-success" onclick="emergencyPDF(\''+postDoc.id+'\')">納品書作成</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button>' +'</td><td>'+ postDoc.get('note') +'</td></tr></tbody>';
                          break;               
                  }
              }else{
                  switch(postDoc.get('status')){
                      //完了
                      case 'approval':
                          var statusText = "完了";
                          stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('stuffNum') + '</td><td>' + postDoc.get('name') + '</td><td>'+ postDoc.get('demandStatus') +'</td><td>' + postDoc.get('deliveryPreparation') + '</td><td>' + postDoc.get('headerDeliveryPerson') + '</td><td>' + postDoc.get('passedPerson') + '</td><td>' + statusText + '</td><td>'+ '<button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">納品書作成</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button>' +'</td><td>'+ postDoc.get('note') +'</td></tr></tbody>';
                          break;
                      //未対応     
                      default:
                          var statusText = "未完了";
                          stocklist += '<tbody class="yetBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('stuffNum') + '</td><td>' + postDoc.get('name') + '</td><td>'+ postDoc.get('demandStatus') +'</td><td>' + postDoc.get('deliveryPreparation') + '</td><td>' + postDoc.get('headerDeliveryPerson') + '</td><td>' + postDoc.get('passedPerson') + '</td><td>' + statusText + '</td><td>'+ '<button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">納品書作成</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button>' +'</td><td>'+ postDoc.get('note') +'</td></tr></tbody>';
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

//前のテーブルを表示(戻るボタン)
function returnTable(){
  document.getElementById('nextButton').style.visibility = 'visible';
  querySnapshot = currentQueryList.pop();

    //現在のクエリとしてリロード時のために保存
    reloadQuery = querySnapshot;    

    var stocklist = '<table class="table table-striped" id="download_table">'
    stocklist += '<tr><th>申請日</th><th>店舗名</th><th>社員番号</th><th>シフト名</th><th>要望内容</th><th>発送準備</th><th>本部発送者</th><th>本人へ渡した者</th><th>状態</th><th>編集</th><th>備考</th>';
    querySnapshot.forEach((postDoc) => {
        if(postDoc.get('demandStatus') == '追加購入'){
            switch(postDoc.get('status')){
                //完了
                case 'approval':
                    var statusText = "完了";
                    stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('stuffNum') + '</td><td>' + postDoc.get('name') + '</td><td>'+ postDoc.get('demandStatus') +'</td><td>' + postDoc.get('deliveryPreparation') + '</td><td>' + postDoc.get('headerDeliveryPerson') + '</td><td>' + postDoc.get('passedPerson') + '</td><td>' + statusText + '</td><td>'+ '<button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">納品書作成</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button>' +'</td><td>'+ postDoc.get('note') +'</td></tr></tbody>';
                    break;
                //未対応     
                default:
                    var statusText = "未完了";
                    stocklist += '<tbody class="yetBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('stuffNum') + '</td><td>' + postDoc.get('name') + '</td><td>'+ postDoc.get('demandStatus') +'</td><td>' + postDoc.get('deliveryPreparation') + '</td><td>' + postDoc.get('headerDeliveryPerson') + '</td><td>' + postDoc.get('passedPerson') + '</td><td>' + statusText + '</td><td>'+ '<button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">納品書作成</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button>' +'</td><td>'+ postDoc.get('note') +'</td></tr></tbody>';
                    break;        
            }
        }else if(postDoc.get('demandStatus') == '忘れ購入'){
            switch(postDoc.get('status')){
                //完了
                case 'approval':
                    var statusText = "完了";
                    stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('stuffNum') + '</td><td>' + postDoc.get('name') + '</td><td>'+ postDoc.get('demandStatus') +'</td><td>' + postDoc.get('deliveryPreparation') + '</td><td>' + postDoc.get('headerDeliveryPerson') + '</td><td>' + postDoc.get('passedPerson') + '</td><td>' + statusText + '</td><td>'+ '<button class="btn btn-success" onclick="emergencyPDF(\''+postDoc.id+'\')">納品書作成</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button>' +'</td><td>'+ postDoc.get('note') +'</td></tr></tbody>';
                    break;
                //未対応     
                default:
                    var statusText = "未完了";
                    stocklist += '<tbody class="yetBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('stuffNum') + '</td><td>' + postDoc.get('name') + '</td><td>'+ postDoc.get('demandStatus') +'</td><td>' + postDoc.get('deliveryPreparation') + '</td><td>' + postDoc.get('headerDeliveryPerson') + '</td><td>' + postDoc.get('passedPerson') + '</td><td>' + statusText + '</td><td>'+ '<button class="btn btn-success" onclick="emergencyPDF(\''+postDoc.id+'\')">納品書作成</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button>' +'</td><td>'+ postDoc.get('note') +'</td></tr></tbody>';
                    break;               
            }
        }else{
            switch(postDoc.get('status')){
                //完了
                case 'approval':
                    var statusText = "完了";
                    stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('stuffNum') + '</td><td>' + postDoc.get('name') + '</td><td>'+ postDoc.get('demandStatus') +'</td><td>' + postDoc.get('deliveryPreparation') + '</td><td>' + postDoc.get('headerDeliveryPerson') + '</td><td>' + postDoc.get('passedPerson') + '</td><td>' + statusText + '</td><td>'+ '<button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">納品書作成</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button>' +'</td><td>'+ postDoc.get('note') +'</td></tr></tbody>';
                    break;
                //未対応     
                default:
                    var statusText = "未完了";
                    stocklist += '<tbody class="yetBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('stuffNum') + '</td><td>' + postDoc.get('name') + '</td><td>'+ postDoc.get('demandStatus') +'</td><td>' + postDoc.get('deliveryPreparation') + '</td><td>' + postDoc.get('headerDeliveryPerson') + '</td><td>' + postDoc.get('passedPerson') + '</td><td>' + statusText + '</td><td>'+ '<button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">納品書作成</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button>' +'</td><td>'+ postDoc.get('note') +'</td></tr></tbody>';
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

//リロードのためにDB取得
function reloadDB(){
    (async () => {
        try {
            var stocklist = '<table class="table table-striped" id="download_table">'
            stocklist += '<tr><th>申請日</th><th>店舗名</th><th>社員番号</th><th>シフト名</th><th>要望内容</th><th>発送準備</th><th>本部発送者</th><th>本人へ渡した者</th><th>状態</th><th>編集</th><th>備考</th>';
            console.log(reloadQuery);  
            reloadQuerySnapshot = await reloadQuery.get();
            reloadQuerySnapshot.forEach((postDoc) => {
                if(postDoc.get('demandStatus') == '追加購入'){
                    switch(postDoc.get('status')){
                        //完了
                        case 'approval':
                            var statusText = "完了";
                            stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('stuffNum') + '</td><td>' + postDoc.get('name') + '</td><td>'+ postDoc.get('demandStatus') +'</td><td>' + postDoc.get('deliveryPreparation') + '</td><td>' + postDoc.get('headerDeliveryPerson') + '</td><td>' + postDoc.get('passedPerson') + '</td><td>' + statusText + '</td><td>'+ '<button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">納品書作成</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button>' +'</td><td>'+ postDoc.get('note') +'</td></tr></tbody>';
                            break;
                        //未対応     
                        default:
                            var statusText = "未完了";
                            stocklist += '<tbody class="yetBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('stuffNum') + '</td><td>' + postDoc.get('name') + '</td><td>'+ postDoc.get('demandStatus') +'</td><td>' + postDoc.get('deliveryPreparation') + '</td><td>' + postDoc.get('headerDeliveryPerson') + '</td><td>' + postDoc.get('passedPerson') + '</td><td>' + statusText + '</td><td>'+ '<button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">納品書作成</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button>' +'</td><td>'+ postDoc.get('note') +'</td></tr></tbody>';
                            break;        
                    }
                }else if(postDoc.get('demandStatus') == '忘れ購入'){
                    switch(postDoc.get('status')){
                        //完了
                        case 'approval':
                            var statusText = "完了";
                            stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('stuffNum') + '</td><td>' + postDoc.get('name') + '</td><td>'+ postDoc.get('demandStatus') +'</td><td>' + postDoc.get('deliveryPreparation') + '</td><td>' + postDoc.get('headerDeliveryPerson') + '</td><td>' + postDoc.get('passedPerson') + '</td><td>' + statusText + '</td><td>'+ '<button class="btn btn-success" onclick="emergencyPDF(\''+postDoc.id+'\')">納品書作成</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button>' +'</td><td>'+ postDoc.get('note') +'</td></tr></tbody>';
                            break;
                        //未対応     
                        default:
                            var statusText = "未完了";
                            stocklist += '<tbody class="yetBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('stuffNum') + '</td><td>' + postDoc.get('name') + '</td><td>'+ postDoc.get('demandStatus') +'</td><td>' + postDoc.get('deliveryPreparation') + '</td><td>' + postDoc.get('headerDeliveryPerson') + '</td><td>' + postDoc.get('passedPerson') + '</td><td>' + statusText + '</td><td>'+ '<button class="btn btn-success" onclick="emergencyPDF(\''+postDoc.id+'\')">納品書作成</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button>' +'</td><td>'+ postDoc.get('note') +'</td></tr></tbody>';
                            break;               
                    }
                }else{
                    switch(postDoc.get('status')){
                        //完了
                        case 'approval':
                            var statusText = "完了";
                            stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('stuffNum') + '</td><td>' + postDoc.get('name') + '</td><td>'+ postDoc.get('demandStatus') +'</td><td>' + postDoc.get('deliveryPreparation') + '</td><td>' + postDoc.get('headerDeliveryPerson') + '</td><td>' + postDoc.get('passedPerson') + '</td><td>' + statusText + '</td><td>'+ '<button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">納品書作成</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button>' +'</td><td>'+ postDoc.get('note') +'</td></tr></tbody>';
                            break;
                        //未対応     
                        default:
                            var statusText = "未完了";
                            stocklist += '<tbody class="yetBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('stuffNum') + '</td><td>' + postDoc.get('name') + '</td><td>'+ postDoc.get('demandStatus') +'</td><td>' + postDoc.get('deliveryPreparation') + '</td><td>' + postDoc.get('headerDeliveryPerson') + '</td><td>' + postDoc.get('passedPerson') + '</td><td>' + statusText + '</td><td>'+ '<button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">納品書作成</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button>' +'</td><td>'+ postDoc.get('note') +'</td></tr></tbody>';
                            break;                
                    }
                }
            })
            stocklist += '</table>';
            document.getElementById('table_list').innerHTML = stocklist;
            console.log(stocklist);  
        } catch (err) {
            console.log(err);
        }
    })();
}


//編集用モーダルウィンドウ
function editStatus(id){
    (async () => {
      try {
          const carrentDB = await db.collection('uniforms').doc(id).get();

          //依頼日時
          document.getElementById('createdAt_edit').textContent = carrentDB.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'});
          //社員番号
          document.getElementById('stuffNum_edit').textContent = carrentDB.get('stuffNum');
          //シフト名
          document.getElementById('name_edit').textContent = carrentDB.get('name');
          var demandStatus = carrentDB.get('demandStatus');
          if(demandStatus == '追加購入'){
              document.getElementById('normal_edit').style.display = "";
              document.getElementById('emergency_edit').style.display = "none";
              document.getElementById('nameplate_edit').style.display = "none";
              document.getElementById('blackS_edit').value = carrentDB.get('blackS');
              document.getElementById('blackM_edit').value = carrentDB.get('blackM');
              document.getElementById('blackL_edit').value = carrentDB.get('blackL');
              document.getElementById('blackLL_edit').value = carrentDB.get('blackLL');
              document.getElementById('black3L_edit').value = carrentDB.get('black3L');
              document.getElementById('blueS_edit').value = carrentDB.get('blueS');
              document.getElementById('blueM_edit').value = carrentDB.get('blueM');
              document.getElementById('blueL_edit').value = carrentDB.get('blueL');
              document.getElementById('blueLL_edit').value = carrentDB.get('blueLL');
              document.getElementById('blue3L_edit').value = carrentDB.get('blue3L');
              document.getElementById('apron_edit').value = carrentDB.get('apron');
              document.getElementById('head_towel_edit').value = carrentDB.get('head_towel');
              document.getElementById('fleece_blueS_edit').value = carrentDB.get('fleece_blueS');
              document.getElementById('fleece_blueM_edit').value = carrentDB.get('fleece_blueM');
              document.getElementById('fleece_blueL_edit').value = carrentDB.get('fleece_blueL');
              document.getElementById('fleece_blueXL_edit').value = carrentDB.get('fleece_blueXL');
          }else if(demandStatus == "忘れ購入"){
              document.getElementById('normal_edit').style.display = "none";
              document.getElementById('emergency_edit').style.display = "";  
              document.getElementById('nameplate_edit').style.display = "none";
              var category = carrentDB.get('category');
              if(category == "ポロシャツ青LL"){
                  document.getElementById('blue_edit').checked = true;
                  document.getElementById('black_edit').checked = false;
              }else{
                  document.getElementById('black_edit').checked = true;
                  document.getElementById('blue_edit').checked = false;
              }
          }else{
              document.getElementById('normal_edit').style.display = "none";
              document.getElementById('emergency_edit').style.display = "none";
              document.getElementById('nameplate_edit').style.display = "";
              document.getElementById('shiftName_edit').value = carrentDB.get('shiftName');
              var nameplateColor = document.getElementById('nameplateColor_edit');
              switch(carrentDB.get('nameplateColor')){
                  case '白':
                      nameplateColor.options[1].selected = true;
                      break;
                  case '黒':
                      nameplateColor.options[2].selected = true;
                      break;
                  case '金':
                      nameplateColor.options[3].selected = true;
                      break;
                  default:
                      order_category.options[0].selected = true;
                      break;    
              }
          }

          //発送準備
          document.getElementById('delivery_preparation_edit').value = carrentDB.get('deliveryPreparation');
          //本部発送者
          document.getElementById('header_delivery_person_edit').value = carrentDB.get('headerDeliveryPerson');
          //本人へ渡した者
          document.getElementById('passed_person_edit').value = carrentDB.get('passedPerson');
          //備考
          document.getElementById('note_edit').value = carrentDB.get('note');
          //状態
          var order_category = document.getElementById('order_category_edit');
          switch(carrentDB.get('status')){
              case 'approval':
                  order_category.options[1].selected = true;
                  break;
              case 'delivered':
                  order_category.options[1].selected = true;
                  break;
              default:
                  order_category.options[0].selected = true;
                  break;    
          }
          //編集送信ボタン生成
          document.getElementById('edit_submit_button').innerHTML = '<button type="submit" class="btn btn-success" onclick="EditUpdate(\''+id+'\',\''+ demandStatus +'\')">送信する</button>';
      } catch (err) {
      console.log(`Error: ${JSON.stringify(err)}`)
      }
  })();
}

//status編集
function EditUpdate(id,status){
    if(status == '追加購入'){
        var blackS = Number(document.getElementById('blackS_edit').value);
        var blackM = Number(document.getElementById('blackM_edit').value);
        var blackL = Number(document.getElementById('blackL_edit').value);
        var blackLL = Number(document.getElementById('blackLL_edit').value);
        var black3L = Number(document.getElementById('black3L_edit').value);
        var blueS = Number(document.getElementById('blueS_edit').value);
        var blueM = Number(document.getElementById('blueM_edit').value);
        var blueL = Number(document.getElementById('blueL_edit').value);
        var blueLL = Number(document.getElementById('blueLL_edit').value);
        var blue3L = Number(document.getElementById('blue3L_edit').value);
        var apron = Number(document.getElementById('apron_edit').value);
        var head_towel = Number(document.getElementById('head_towel_edit').value);
        var fleece_blueS = Number(document.getElementById('fleece_blueS_edit').value);
        var fleece_blueM = Number(document.getElementById('fleece_blueM_edit').value);
        var fleece_blueL = Number(document.getElementById('fleece_blueL_edit').value);
        var fleece_blueXL = Number(document.getElementById('fleece_blueXL_edit').value);
        var sum = (blackS + blackM + blackL + blackLL + black3L + blueS + blueM + blueL + blueLL + blue3L) * 700 + (apron * 800) + (head_towel * 400) + (fleece_blueS + fleece_blueM + fleece_blueL + fleece_blueXL) * 2000;
    }else if(status == '忘れ購入'){
        var checkBox = document.getElementById('black_edit');
        var checkBox2 = document.getElementById('blue_edit');
        var category = "";
        if(checkBox.checked){
            category = "ポロシャツ黒LL";
        }else if(checkBox2.checked){
            category = "ポロシャツ青LL";
        };
    }else{
        var shiftName = document.getElementById('shiftName_edit').value;
        var nameplateColor = document.getElementById('nameplateColor_edit').value;
    }
    //共通項目
    //発送準備
    var deliveryPreparationEdit = document.getElementById('delivery_preparation_edit').value;
    //本部発送者
    var headerDeliveryPersonEdit = document.getElementById('header_delivery_person_edit').value;
    //本人へ渡した者
    var passedPersonEdit = document.getElementById('passed_person_edit').value;
    //備考
    var noteEdit = document.getElementById('note_edit').value;
    //状態
    var order_category = document.getElementById('order_category_edit').value;
    if(status == "追加購入"){
        //DBへ送信
        db.collection('uniforms').doc(id).update({
            blackS:blackS,
            blackM:blackM,
            blackL:blackL,
            blackLL:blackLL,
            black3L:black3L,
            blueS:blueS,
            blueM:blueM,
            blueL:blueL,
            blueLL:blueLL,
            blue3L:blue3L,
            apron:apron,
            head_towel:head_towel,
            fleece_blueS:fleece_blueS,
            fleece_blueM:fleece_blueM,
            fleece_blueL:fleece_blueL,
            fleece_blueXL:fleece_blueXL,
            sum:sum,
            status:order_category,
            deliveryPreparation:deliveryPreparationEdit,
            headerDeliveryPerson:headerDeliveryPersonEdit,
            passedPerson:passedPersonEdit,
            note:noteEdit
        });
    }else if(status == '忘れ購入'){
        //DBへ送信
        db.collection('uniforms').doc(id).update({
            category:category,
            status:order_category,
            deliveryPreparation:deliveryPreparationEdit,
            headerDeliveryPerson:headerDeliveryPersonEdit,
            passedPerson:passedPersonEdit,
            note:noteEdit
        });
    }else{
        //DBへ送信
        db.collection('uniforms').doc(id).update({
            shiftName:shiftName,
            nameplateColor:nameplateColor,
            status:order_category,
            deliveryPreparation:deliveryPreparationEdit,
            headerDeliveryPerson:headerDeliveryPersonEdit,
            passedPerson:passedPersonEdit,
            note:noteEdit
        });
    }
    var collectAlert = document.getElementById('collectAlert_edit');
    collectAlert.innerHTML = '<div class="alert alert-success" role="alert">編集完了!リロードします。</div>';
    setTimeout("location.reload()",2000);
}

//削除
function deleteContent(id,name){
    var res = window.confirm(name + "さんの内容を削除しますか？");
    if( res ) {
        db.collection('uniforms').doc(id).delete()
        .then(() => {
            alert("削除されました。");
            setTimeout("location.reload()",500);
        });
    }
    else {
        // キャンセルならアラートボックスを表示
        alert("キャンセルしました。");
    } 
};

//CSV出力＆ダウンロード
function handleDownload(){
    var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);//文字コードをBOM付きUTF-8に指定
    var table = document.getElementById('download_table');
    var data_csv="";//ここに文字データとして値を格納していく

    for(var i = 0;  i < table.rows.length; i++){
        //11
        for(var j = 0; j < table.rows[i].cells.length; j++){
        //data_csv += table.rows[i].cells[j].innerText;//HTML中の表のセル値をdata_csvに格納
        if(j == 10){
            data_csv += table.rows[i].cells[j].innerText;
            data_csv += "\n";
        }else{
            data_csv += table.rows[i].cells[j].innerText;
            if(j == table.rows[i].cells.length){
                data_csv += ",";
                data_csv += table.rows[i].cells[0].innerText;
                data_csv += "\n";
            }
            else {
                data_csv += ",";//セル値の区切り文字として,を追加
            }
        }
        }
    }

    var blob = new Blob([ bom, data_csv], { "type" : "text/csv" });//data_csvのデータをcsvとしてダウンロードする関数
    if (window.navigator.msSaveBlob) { //IEの場合の処理
        window.navigator.msSaveBlob(blob, "test.csv"); 
        //window.navigator.msSaveOrOpenBlob(blob, "test.csv");// msSaveOrOpenBlobの場合はファイルを保存せずに開ける
    } else {
        document.getElementById("download").href = window.URL.createObjectURL(blob);
    }

    delete data_csv;//data_csvオブジェクトはもういらないので消去してメモリを開放
}

//追加購入PDF作成
function NormalPDF(id){
    (async () => {
      try {
        const carrentDB = await db.collection('uniforms').doc(id).get();
        //社員番号
        var stuffNum = carrentDB.get('stuffNum');
        //氏名
        var name = carrentDB.get('name');
        //申請日
        var createdAt = carrentDB.get('createdAt');
        //店舗名
        var storeName = carrentDB.get('storeName');
        //それぞれの備品が1以上ある時合計金額を表示
        if(carrentDB.get('blackS') == 0){
            var blackS = '';
            var blackS_sum = '';
        }else{
            var blackS = carrentDB.get('blackS');
            var blackS_sum = '¥' +  700 * carrentDB.get('blackS');
        }
        if(carrentDB.get('blackM') == 0){
            var blackM = '';
            var blackM_sum = '';
        }else{
            var blackM = carrentDB.get('blackM');
            var blackM_sum = '¥' +  700 * carrentDB.get('blackM');
        }
        if(carrentDB.get('blackL') == 0){
            var blackL = '';
            var blackL_sum = '';
        }else{
            var blackL = carrentDB.get('blackL');
            var blackL_sum =  '¥' + 700 * carrentDB.get('blackL');
        }
        if(carrentDB.get('blackLL') == 0){
            var blackLL = '';
            var blackLL_sum = '';
        }else{
            var blackLL = carrentDB.get('blackLL');
            var blackLL_sum = '¥' +  700 * carrentDB.get('blackLL');
        }
        if(carrentDB.get('black3L') == 0){
            var black3L = '';
            var black3L_sum = '';
        }else{
            var black3L = carrentDB.get('black3L');
            var black3L_sum = '¥' +  700 * carrentDB.get('black3L');
        }
        if(carrentDB.get('blueS') == 0){
            var blueS = '';
            var blueS_sum = '';
        }else{
            var blueS = carrentDB.get('blueS');
            var blueS_sum = '¥' +  700 * carrentDB.get('blueS');
        }
        if(carrentDB.get('blueM') == 0){
            var blueM = '';
            var blueM_sum = '';
        }else{
            var blueM = carrentDB.get('blueM');
            var blueM_sum = '¥' +  700 * carrentDB.get('blueM');
        }
        if(carrentDB.get('blueL') == 0){
            var blueL = '';
            var blueL_sum = '';
        }else{
            var blueL = carrentDB.get('blueL');
            var blueL_sum = '¥' +  700 * carrentDB.get('blueL');
        }
        if(carrentDB.get('blueLL') == 0){
            var blueLL = '';
            var blueLL_sum = '';
        }else{
            var blueLL = carrentDB.get('blueLL');
            var blueLL_sum = '¥' +  700 * carrentDB.get('blueLL');
        }
        if(carrentDB.get('blue3L') == 0){
            var blue3L = '';
            var blue3L_sum = '';
        }else{
            var blue3L = carrentDB.get('blue3L');
            var blue3L_sum = '¥' +  700 * carrentDB.get('blue3L');
        }
        if(carrentDB.get('apron') == 0){
            var apron = '';
            var apron_sum = '';
        }else{
            var apron = carrentDB.get('apron');
            var apron_sum = '¥' +  800 * carrentDB.get('apron');
        }
        if(carrentDB.get('head_towel') == 0){
            var head_towel = '';
            var head_towel_sum = '';
        }else{
            var head_towel = carrentDB.get('head_towel');
            var head_towel_sum = '¥' +  400 * carrentDB.get('head_towel');
        }
        if(carrentDB.get('fleece_blueS') == 0){
            var fleece_blueS = '';
            var fleece_blueS_sum = '';
        }else{
            var fleece_blueS = carrentDB.get('fleece_blueS');
            var fleece_blueS_sum = '¥' +  2000 * carrentDB.get('fleece_blueS');
        }
        if(carrentDB.get('fleece_blueM') == 0){
            var fleece_blueM = '';
            var fleece_blueM_sum = '';
        }else{
            var fleece_blueM = carrentDB.get('fleece_blueM');
            var fleece_blueM_sum = '¥' +  2000 * carrentDB.get('fleece_blueM');
        }
        if(carrentDB.get('fleece_blueL') == 0){
            var fleece_blueL = '';
            var fleece_blueL_sum = '';
        }else{
            var fleece_blueL = carrentDB.get('fleece_blueL');
            var fleece_blueL_sum = '¥' +  2000 * carrentDB.get('fleece_blueL');
        }
        if(carrentDB.get('fleece_blueXL') == 0){
            var fleece_blueXL = '';
            var fleece_blueXL_sum = '';
        }else{
            var fleece_blueXL = carrentDB.get('fleece_blueXL');
            var fleece_blueXL_sum = '¥' +  2000 * carrentDB.get('fleece_blueXL');
        }
        //合計金額
        var sum = carrentDB.get('sum');
        //日本語フォント読み込み
        pdfMake.fonts = {
            GenShin: {
            normal: 'GenShinGothic-Normal-Sub.ttf',
            bold: 'GenShinGothic-Normal-Sub.ttf',
            italics: 'GenShinGothic-Normal-Sub.ttf',
            bolditalics: 'GenShinGothic-Normal-Sub.ttf'
            }
        };
  
            //PDF作成処理
            var docDef = {
                content: [
                    {
                      columns: [
                          {
                              width: '*',
                              text: 'ユニフォーム申請書 兼 納品書',
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
                              [{text:createdAt,fontSize:15,alignment:'center'},{text:'社員番号: ' + stuffNum,fontSize:15,alignment:'center'}],
                              [{text:'店舗: ' + storeName,fontSize:15,alignment:'center'},{text:'氏名: ' + name + '            印',fontSize:15,alignment:'center'}],
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
                              [{text:'ポロシャツ黒S',fontSize:15,alignment:'center'},{text:'¥700',fontSize:15,alignment:'center'},{text:blackS + '枚',fontSize:15,alignment:'right'},{text:blackS_sum,fontSize:15,alignment:'center'}],
                              [{text:'ポロシャツ黒M',fontSize:15,alignment:'center'},{text:'¥700',fontSize:15,alignment:'center'},{text:blackM + '枚',fontSize:15,alignment:'right'},{text:blackM_sum,fontSize:15,alignment:'center'}],
                              [{text:'ポロシャツ黒L',fontSize:15,alignment:'center'},{text:'¥700',fontSize:15,alignment:'center'},{text:blackL + '枚',fontSize:15,alignment:'right'},{text:blackL_sum,fontSize:15,alignment:'center'}],
                              [{text:'ポロシャツ黒LL',fontSize:15,alignment:'center'},{text:'¥700',fontSize:15,alignment:'center'},{text:blackLL + '枚',fontSize:15,alignment:'right'},{text:blackLL_sum,fontSize:15,alignment:'center'}],
                              [{text:'ポロシャツ黒3L',fontSize:15,alignment:'center'},{text:'¥700',fontSize:15,alignment:'center'},{text:black3L + '枚',fontSize:15,alignment:'right'},{text:black3L_sum,fontSize:15,alignment:'center'}],

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
                                [{text:'ポロシャツ青S',fontSize:15,alignment:'center'},{text:'¥700',fontSize:15,alignment:'center'},{text:blueS + '枚',fontSize:15,alignment:'right'},{text:blueS_sum,fontSize:15,alignment:'center'}],
                                [{text:'ポロシャツ青M',fontSize:15,alignment:'center'},{text:'¥700',fontSize:15,alignment:'center'},{text:blueM + '枚',fontSize:15,alignment:'right'},{text:blueM_sum,fontSize:15,alignment:'center'}],
                                [{text:'ポロシャツ青L',fontSize:15,alignment:'center'},{text:'¥700',fontSize:15,alignment:'center'},{text:blueL + '枚',fontSize:15,alignment:'right'},{text:blueL_sum,fontSize:15,alignment:'center'}],
                                [{text:'ポロシャツ青LL',fontSize:15,alignment:'center'},{text:'¥700',fontSize:15,alignment:'center'},{text:blueLL + '枚',fontSize:15,alignment:'right'},{text:blueLL_sum,fontSize:15,alignment:'center'}],
                                [{text:'ポロシャツ青3L',fontSize:15,alignment:'center'},{text:'¥700',fontSize:15,alignment:'center'},{text:blue3L + '枚',fontSize:15,alignment:'right'},{text:blue3L_sum,fontSize:15,alignment:'center'}],
  
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
                                [{text:'エプロン',fontSize:15,alignment:'center'},{text:'¥800',fontSize:15,alignment:'center'},{text:apron + '枚',fontSize:15,alignment:'right'},{text:apron_sum,fontSize:15,alignment:'center'}],
                                [{text:'ヘッドタオル',fontSize:15,alignment:'center'},{text:'¥400',fontSize:15,alignment:'center'},{text:head_towel + '枚',fontSize:15,alignment:'right'},{text:head_towel_sum,fontSize:15,alignment:'center'}],
  
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
                                [{text:'フリース青S',fontSize:15,alignment:'center'},{text:'¥2000',fontSize:15,alignment:'center'},{text:fleece_blueS + '枚',fontSize:15,alignment:'right'},{text:fleece_blueS_sum,fontSize:15,alignment:'center'}],
                                [{text:'フリース青M',fontSize:15,alignment:'center'},{text:'¥2000',fontSize:15,alignment:'center'},{text:fleece_blueM + '枚',fontSize:15,alignment:'right'},{text:fleece_blueM_sum,fontSize:15,alignment:'center'}],
                                [{text:'フリース青L',fontSize:15,alignment:'center'},{text:'¥2000',fontSize:15,alignment:'center'},{text:fleece_blueL + '枚',fontSize:15,alignment:'right'},{text:fleece_blueL_sum,fontSize:15,alignment:'center'}],
                                [{text:'フリース青XL',fontSize:15,alignment:'center'},{text:'¥2000',fontSize:15,alignment:'center'},{text:fleece_blueXL + '枚',fontSize:15,alignment:'right'},{text:fleece_blueXL_sum,fontSize:15,alignment:'center'}],
                            ]
                        }
                      },
                    {
                        columns: [
                            {
                                width: '*',
                                text: '合計金額    ¥' + sum,
                                margin: [ 0, 30, 0, 10 ],
                                style: ['right','border'],
                                fontSize: 20
                            }
                        ],
                        columnGap: 10
                    }
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
      console.log(err);
      }
  })();
}

//緊急用PDF作成
function emergencyPDF(id){
    (async () => {
      try {
        const carrentDB = await db.collection('uniforms').doc(id).get();
        //社員番号
        var stuffNum = carrentDB.get('stuffNum');
        //氏名
        var name = carrentDB.get('name');
        //申請日
        var createdAt = carrentDB.get('orderDate');
        //店舗名
        var storeName = carrentDB.get('storeName');
        //要望内容
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
  
            if(category == "ポロシャツ黒LL"){
                //PDF作成処理
                var docDef = {
                    content: [
                        {
                          columns: [
                              {
                                  width: '*',
                                  text: 'ユニフォーム申請書(店舗用)',
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
                                  [{text:createdAt,fontSize:15,alignment:'center'},{text:'社員番号: ' + stuffNum,fontSize:15,alignment:'center'}],
                                  [{text:'店舗: ' + storeName,fontSize:15,alignment:'center'},{text:'氏名: ' + name + '            印',fontSize:15,alignment:'center'}],
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
                                  [{text:'ポロシャツ黒LL',fontSize:20,alignment:'center'},{text:'¥700',fontSize:20,alignment:'center'},{text:'1枚',fontSize:20,alignment:'center'},{text:'¥700',fontSize:20,alignment:'center'}]
                              ]
                          }
                        },
                        {
                            columns: [
                                {
                                    width: '*',
                                    text: '合計金額    ¥700',
                                    margin: [ 0, 10, 0, 10 ],
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
                                    text: '切り取り不要',
                                    style: ['center'],
                                    fontSize: 15
                                }
                            ],
                            columnGap: 10
                        },
                        {
                            columns: [
                                {
                                    width: 'auto',
                                    text:  '受領書(会社控え)',
                                    margin: [ 0, 10, 0, 10 ],
                                    style: ['left'],
                                    fontSize: 15
                                },
                                {
                                    width: '*',
                                    text: createdAt,
                                    margin: [ 0, 10, 0, 10 ],
                                    style: ['right'],
                                    fontSize: 15
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
                                    [{text:'ポロシャツLL',fontSize:20,alignment:'center'},{text:'¥700',fontSize:20,alignment:'center'},{text:'1枚',fontSize:20,alignment:'center'},{text:'¥700',fontSize:20,alignment:'center'}]
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
                                widths: [100],
                                style:['center'],
                                body: [
                                    [{text:'本人受取印',fontSize:15,alignment:'center'}],
                                    [{text:'印',fontSize:20,alignment:'center'}]
                                ]
                            }
                        },
                        {
                            columns: [
                                {
                                    width: '*',
                                    text: '------------------------------切り取り-----------------------------',
                                    margin: [ 0, 0, 0, 10 ],
                                    style: ['center','border'],
                                    fontSize: 15
                                }
                            ],
                            columnGap: 10
                        },
                        {
                            columns: [
                                {
                                    width: 'auto',
                                    text:  '受領書(本人控え)',
                                    margin: [ 0, 10, 0, 10 ],
                                    style: ['left'],
                                    fontSize: 15
                                },
                                {
                                    width: '*',
                                    text: createdAt,
                                    margin: [ 0, 10, 0, 10 ],
                                    style: ['right'],
                                    fontSize: 15
                                }
                            ],
                            columnGap: 10
                        },
                        {
                            columns: [
                                {
                                    width: 'auto',
                                    text:  '社員番号: ' + stuffNum,
                                    style: ['center'],
                                    fontSize: 15
                                },
                                {
                                    width: '*',
                                    text: '氏名: ' + name,
                                    style: ['center'],
                                    fontSize: 15
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
                                    [{text:'ポロシャツLL',fontSize:20,alignment:'center'},{text:'¥700',fontSize:20,alignment:'center'},{text:'1枚',fontSize:20,alignment:'center'},{text:'¥700',fontSize:20,alignment:'center'}]
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
            }else{
                //PDF作成処理
                var docDef = {
                    content: [
                        {
                          columns: [
                              {
                                  width: '*',
                                  text: 'ユニフォーム申請書(店舗用)',
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
                                [{text:createdAt,fontSize:15,alignment:'center'},{text:'社員番号: ' + stuffNum,fontSize:15,alignment:'center'}],
                                [{text:'店舗: ' + storeName,fontSize:15,alignment:'center'},{text:'氏名: ' + name + '            印',fontSize:15,alignment:'center'}],
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
                                  [{text:'ポロシャツ青LL',fontSize:20,alignment:'center'},{text:'¥700',fontSize:20,alignment:'center'},{text:'1枚',fontSize:20,alignment:'center'},{text:'¥700',fontSize:20,alignment:'center'}]
                              ]
                          }
                        },
                        {
                            columns: [
                                {
                                    width: '*',
                                    text: '合計金額    ¥700',
                                    margin: [ 0, 10, 0, 10 ],
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
                                    text: '切り取り不要',
                                    style: ['center'],
                                    fontSize: 15
                                }
                            ],
                            columnGap: 10
                        },
                        {
                            columns: [
                                {
                                    width: 'auto',
                                    text:  '受領書(会社控え)',
                                    margin: [ 0, 10, 0, 10 ],
                                    style: ['left'],
                                    fontSize: 15
                                },
                                {
                                    width: '*',
                                    text: createdAt,
                                    margin: [ 0, 10, 0, 10 ],
                                    style: ['right'],
                                    fontSize: 15
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
                                    [{text:'ポロシャツLL',fontSize:20,alignment:'center'},{text:'¥700',fontSize:20,alignment:'center'},{text:'1枚',fontSize:20,alignment:'center'},{text:'¥700',fontSize:20,alignment:'center'}]
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
                                widths: [100],
                                style:['center'],
                                body: [
                                    [{text:'本人受取印',fontSize:15,alignment:'center'}],
                                    [{text:'印',fontSize:20,alignment:'center'}]
                                ]
                            }
                        },
                        {
                            columns: [
                                {
                                    width: '*',
                                    text: '------------------------------切り取り-----------------------------',
                                    margin: [ 0, 0, 0, 10 ],
                                    style: ['center','border'],
                                    fontSize: 15
                                }
                            ],
                            columnGap: 10
                        },
                        {
                            columns: [
                                {
                                    width: 'auto',
                                    text:  '受領書(本人控え)',
                                    margin: [ 0, 10, 0, 10 ],
                                    style: ['left'],
                                    fontSize: 15
                                },
                                {
                                    width: '*',
                                    text: createdAt,
                                    margin: [ 0, 10, 0, 10 ],
                                    style: ['right'],
                                    fontSize: 15
                                }
                            ],
                            columnGap: 10
                        },
                        {
                            columns: [
                                {
                                    width: 'auto',
                                    text:  '社員番号: ' + stuffNum,
                                    style: ['center'],
                                    fontSize: 15
                                },
                                {
                                    width: '*',
                                    text: '氏名: ' + name,
                                    style: ['center'],
                                    fontSize: 15
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
                                    [{text:'ポロシャツLL',fontSize:20,alignment:'center'},{text:'¥700',fontSize:20,alignment:'center'},{text:'1枚',fontSize:20,alignment:'center'},{text:'¥700',fontSize:20,alignment:'center'}]
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
            }
            pdfMake.createPdf(docDef).print();
            //pdfMake.createPdf(docDef).download("残業申請書.pdf");
      } catch (err) {
      console.log(err);
      }
  })();
}