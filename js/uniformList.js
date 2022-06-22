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

      var stocklist = '<table class="table table-striped" id="download_table">'
      stocklist += '<tr><th>申請日</th><th>社員番号</th><th>店舗名</th><th>氏名</th><th>種類</th><th>状態</th><th>承認者</th><th>納品書</th><th>編集</th>';
      querySnapshot.forEach((postDoc) => {
        if(postDoc.get('demandStatus') == "追加購入"){
            switch(postDoc.get('status')){
                //承認
                  case 'approve':
                      var statusText = "完了";
                      stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td class ="buy-td">' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td>'+ postDoc.get('deliverySlip') +'</td><td><button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                      break;
                //発送済み     
                  case 'delivered':
                      var statusText = "対応済み";
                      stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td class ="buy-td">' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td>'+ postDoc.get('deliverySlip') +'</td><td><button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                      break;
                //未承認      
                  default:
                      var statusText = "未承認";
                      stocklist += '<tbody><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td class ="buy-td">' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ '' +'</td><td>'+ postDoc.get('deliverySlip') +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                      break;        
            }
        }else if(postDoc.get('demandStatus') == "忘れ購入"){
            switch(postDoc.get('status')){
                //承認
                  case 'approve':
                      var statusText = "完了";
                      stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td class ="buy-td">' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td>'+ postDoc.get('deliverySlip') +'</td><td><button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                      break;
                //発送済み     
                  case 'delivered':
                      var statusText = "対応済み";
                      stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td class ="buy-td">' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td>'+ postDoc.get('deliverySlip') +'</td><td><button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                      break;
                //未承認      
                  default:
                      var statusText = "未承認";
                      stocklist += '<tbody><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td class ="buy-td">' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ '' +'</td><td>'+ postDoc.get('deliverySlip') +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                      break;        
            }
        }else{
            switch(postDoc.get('status')){
                //承認
                  case 'approve':
                      var statusText = "完了";
                      stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td class ="buy-td">' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td>'+ postDoc.get('deliverySlip') +'</td><td><button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                      break;
                //発送済み     
                  case 'delivered':
                      var statusText = "対応済み";
                      stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td class ="buy-td">' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td>'+ postDoc.get('deliverySlip') +'</td><td><button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                      break;
                //未承認      
                  default:
                      var statusText = "未承認";
                      stocklist += '<tbody><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td class ="buy-td">' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ '' +'</td><td>'+ postDoc.get('deliverySlip') +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
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

            console.log(query);
            querySnapshot = await query.orderBy('orderDate', 'desc').orderBy('createdAt','desc').get();

            var stocklist = '<table class="table table-striped" id="download_table">'
            stocklist += '<tr><th>申請日</th><th>社員番号</th><th>店舗名</th><th>氏名</th><th>種類</th><th>状態</th><th>承認者</th><th>納品書</th><th>編集</th>';
            querySnapshot.forEach((postDoc) => {
                if(postDoc.get('demandStatus') == "追加購入"){
                    switch(postDoc.get('status')){
                        //承認
                        case 'approve':
                            var statusText = "完了";
                            stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td class ="buy-td">' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td>'+ postDoc.get('deliverySlip') +'</td><td><button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                            break;
                        //発送済み     
                        case 'delivered':
                            var statusText = "対応済み";
                            stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td class ="buy-td">' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td>'+ postDoc.get('deliverySlip') +'</td><td><button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                            break;
                        //未承認      
                        default:
                            var statusText = "未承認";
                            stocklist += '<tbody><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td class ="buy-td">' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ '' +'</td><td>'+ postDoc.get('deliverySlip') +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                            break;        
                    }
                }else if(postDoc.get('demandStatus') == "忘れ購入"){
                    switch(postDoc.get('status')){
                        //承認
                        case 'approve':
                            var statusText = "完了";
                            stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td class ="buy-td">' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td>'+ postDoc.get('deliverySlip') +'</td><td><button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                            break;
                        //発送済み     
                        case 'delivered':
                            var statusText = "対応済み";
                            stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td class ="buy-td">' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td>'+ postDoc.get('deliverySlip') +'</td><td><button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                            break;
                        //未承認      
                        default:
                            var statusText = "未承認";
                            stocklist += '<tbody><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td class ="buy-td">' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ '' +'</td><td>'+ postDoc.get('deliverySlip') +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                            break;        
                    }
                }else{
                    switch(postDoc.get('status')){
                        //承認
                        case 'approve':
                            var statusText = "完了";
                            stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td class ="buy-td">' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td>'+ postDoc.get('deliverySlip') +'</td><td><button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                            break;
                        //発送済み     
                        case 'delivered':
                            var statusText = "対応済み";
                            stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td class ="buy-td">' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td>'+ postDoc.get('deliverySlip') +'</td><td><button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                            break;
                        //未承認      
                        default:
                            var statusText = "未承認";
                            stocklist += '<tbody><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td class ="buy-td">' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ '' +'</td><td>'+ postDoc.get('deliverySlip') +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
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

//編集用モーダルウィンドウ
function editStatus(id){
  (async () => {
    try {
        const carrentDB = await db.collection('uniforms').doc(id).get();

        document.getElementById('createdAt_edit').textContent = carrentDB.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'});
        document.getElementById('stuffNum_edit').textContent = carrentDB.get('stuffNum');
        document.getElementById('name_edit').textContent = carrentDB.get('name');
        var demandStatus = carrentDB.get('demandStatus');
        if(demandStatus == '追加購入'){
            document.getElementById('normal').style.display = "";
            document.getElementById('emergency').style.display = "none";
            document.getElementById('nameplate').style.display = "none";
            document.getElementById('blackS').value = carrentDB.get('blackS');
            document.getElementById('blackM').value = carrentDB.get('blackM');
            document.getElementById('blackL').value = carrentDB.get('blackL');
            document.getElementById('blackLL').value = carrentDB.get('blackLL');
            document.getElementById('black3L').value = carrentDB.get('black3L');
            document.getElementById('blueS').value = carrentDB.get('blueS');
            document.getElementById('blueM').value = carrentDB.get('blueM');
            document.getElementById('blueL').value = carrentDB.get('blueL');
            document.getElementById('blueLL').value = carrentDB.get('blueLL');
            document.getElementById('blue3L').value = carrentDB.get('blue3L');
            document.getElementById('apron').value = carrentDB.get('apron');
            document.getElementById('head_towel').value = carrentDB.get('head_towel');
            document.getElementById('fleece_blueS').value = carrentDB.get('fleece_blueS');
            document.getElementById('fleece_blueM').value = carrentDB.get('fleece_blueM');
            document.getElementById('fleece_blueL').value = carrentDB.get('fleece_blueL');
            document.getElementById('fleece_blueXL').value = carrentDB.get('fleece_blueXL');
        }else if(demandStatus == "忘れ購入"){
            document.getElementById('normal').style.display = "none";
            document.getElementById('emergency').style.display = "";  
            document.getElementById('nameplate').style.display = "none";
            var category = carrentDB.get('category');
            if(category == "ポロシャツ青LL"){
                document.getElementById('blue').checked = true;
                document.getElementById('black').checked = false;
            }else{
                document.getElementById('black').checked = true;
                document.getElementById('blue').checked = false;
            }
        }else{
            document.getElementById('normal').style.display = "none";
            document.getElementById('emergency').style.display = "none";
            document.getElementById('nameplate').style.display = "";
            document.getElementById('shiftName').value = carrentDB.get('shiftName');
            var nameplateColor = document.getElementById('nameplateColor');
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

        var approver = carrentDB.get('approver');
        if(approver == null){
            document.getElementById('approver').value = "";
        }else{
            document.getElementById('approver').value = approver;
        }
        var order_category = document.getElementById('order_category');
        switch(carrentDB.get('status')){
            case 'approval':
                order_category.options[2].selected = true;
                break;
            case 'delivered':
                order_category.options[1].selected = true;
                break;
            default:
                order_category.options[0].selected = true;
                break;    
        }
        //納品書
        var deliverySlip = document.getElementById('delivery_slip');
        switch(carrentDB.get('delivery_slip')){
            case '○':
                deliverySlip.options[1].selected = true;
            break;
            default:
                deliverySlip.options[0].selected = true;
            break;        
        }
        //編集送信ボタン生成
        document.getElementById('edit_submit_button').innerHTML = '<button type="submit" class="btn btn-success" onclick="EditUpdate(\''+id+'\',\''+ demandStatus +'\')">送信する</button>';
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

          var stocklist = '<table class="table table-striped" id="download_table">'
          stocklist += '<tr><th>申請日</th><th>社員番号</th><th>店舗名</th><th>氏名</th><th>種類</th><th>状態</th><th>承認者</th><th>納品書</th><th>編集</th>';
          querySnapshot.forEach((postDoc) => {
            if(postDoc.get('demandStatus') == "追加購入"){
                switch(postDoc.get('status')){
                    //承認
                      case 'approve':
                          var statusText = "完了";
                          stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td class ="buy-td">' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td>'+ postDoc.get('deliverySlip') +'</td><td><button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                          break;
                    //発送済み     
                      case 'delivered':
                          var statusText = "対応済み";
                          stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td class ="buy-td">' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td>'+ postDoc.get('deliverySlip') +'</td><td><button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                          break;
                    //未承認      
                      default:
                          var statusText = "未承認";
                          stocklist += '<tbody><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td class ="buy-td">' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ '' +'</td><td>'+ postDoc.get('deliverySlip') +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                          break;        
                }
            }else if(postDoc.get('demandStatus') == "忘れ購入"){
                switch(postDoc.get('status')){
                    //承認
                      case 'approve':
                          var statusText = "完了";
                          stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td class ="buy-td">' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td>'+ postDoc.get('deliverySlip') +'</td><td><button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                          break;
                    //発送済み     
                      case 'delivered':
                          var statusText = "対応済み";
                          stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td class ="buy-td">' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td>'+ postDoc.get('deliverySlip') +'</td><td><button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                          break;
                    //未承認      
                      default:
                          var statusText = "未承認";
                          stocklist += '<tbody><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td class ="buy-td">' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ '' +'</td><td>'+ postDoc.get('deliverySlip') +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                          break;        
                }
            }else{
                switch(postDoc.get('status')){
                    //承認
                      case 'approve':
                          var statusText = "完了";
                          stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td class ="buy-td">' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td>'+ postDoc.get('deliverySlip') +'</td><td><button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                          break;
                    //発送済み     
                      case 'delivered':
                          var statusText = "対応済み";
                          stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td class ="buy-td">' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td>'+ postDoc.get('deliverySlip') +'</td><td><button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                          break;
                    //未承認      
                      default:
                          var statusText = "未承認";
                          stocklist += '<tbody><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td class ="buy-td">' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ '' +'</td><td>'+ postDoc.get('deliverySlip') +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
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

  var stocklist = '<table class="table table-striped" id="download_table">'
  stocklist += '<tr><th>申請日</th><th>社員番号</th><th>店舗名</th><th>氏名</th><th>種類</th><th>状態</th><th>承認者</th><th>納品書</th><th>編集</th>';
  querySnapshot.forEach((postDoc) => {
    if(postDoc.get('demandStatus') == "追加購入"){
        switch(postDoc.get('status')){
            //承認
              case 'approve':
                  var statusText = "完了";
                  stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td class ="buy-td">' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td>'+ postDoc.get('deliverySlip') +'</td><td><button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                  break;
            //発送済み     
              case 'delivered':
                  var statusText = "対応済み";
                  stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td class ="buy-td">' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td>'+ postDoc.get('deliverySlip') +'</td><td><button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                  break;
            //未承認      
              default:
                  var statusText = "未承認";
                  stocklist += '<tbody><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td class ="buy-td">' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ '' +'</td><td>'+ postDoc.get('deliverySlip') +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                  break;        
        }
    }else if(postDoc.get('demandStatus') == "忘れ購入"){
        switch(postDoc.get('status')){
            //承認
              case 'approve':
                  var statusText = "完了";
                  stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td class ="buy-td">' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td>'+ postDoc.get('deliverySlip') +'</td><td><button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                  break;
            //発送済み     
              case 'delivered':
                  var statusText = "対応済み";
                  stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td class ="buy-td">' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td>'+ postDoc.get('deliverySlip') +'</td><td><button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                  break;
            //未承認      
              default:
                  var statusText = "未承認";
                  stocklist += '<tbody><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td class ="buy-td">' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ '' +'</td><td>'+ postDoc.get('deliverySlip') +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                  break;        
        }
    }else{
        switch(postDoc.get('status')){
            //承認
              case 'approve':
                  var statusText = "完了";
                  stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td class ="buy-td">' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td>'+ postDoc.get('deliverySlip') +'</td><td><button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                  break;
            //発送済み     
              case 'delivered':
                  var statusText = "対応済み";
                  stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td class ="buy-td">' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ postDoc.get('approver') +'</td><td>'+ postDoc.get('deliverySlip') +'</td><td><button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
                  break;
            //未承認      
              default:
                  var statusText = "未承認";
                  stocklist += '<tbody><tr><td>'+ postDoc.get('createdAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'}) +'</td><td>' + postDoc.get('stuffNum') + '</td><td>'+ postDoc.get('storeName') +'</td><td>' + postDoc.get('name') + '</td><td class ="buy-td">' + postDoc.get('demandStatus') + '</td><td>'+ statusText +'</td><td>'+ '' +'</td><td>'+ postDoc.get('deliverySlip') +'</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\',\''+ postDoc.get('demandStatus') +'\')">状態を変更</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('name') +'\')">削除</button></td></tr></tbody>';
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
function EditUpdate(id,status){
    if(status == '追加購入'){
        var blackS = Number(document.getElementById('blackS').value);
        var blackM = Number(document.getElementById('blackM').value);
        var blackL = Number(document.getElementById('blackL').value);
        var blackLL = Number(document.getElementById('blackLL').value);
        var black3L = Number(document.getElementById('black3L').value);
        var blueS = Number(document.getElementById('blueS').value);
        var blueM = Number(document.getElementById('blueM').value);
        var blueL = Number(document.getElementById('blueL').value);
        var blueLL = Number(document.getElementById('blueLL').value);
        var blue3L = Number(document.getElementById('blue3L').value);
        var apron = Number(document.getElementById('apron').value);
        var head_towel = Number(document.getElementById('head_towel').value);
        var fleece_blueS = Number(document.getElementById('fleece_blueS').value);
        var fleece_blueM = Number(document.getElementById('fleece_blueM').value);
        var fleece_blueL = Number(document.getElementById('fleece_blueL').value);
        var fleece_blueXL = Number(document.getElementById('fleece_blueXL').value);
        var sum = (blackS + blackM + blackL + blackLL + black3L + blueS + blueM + blueL + blueLL + blue3L) * 700 + (apron * 800) + (head_towel * 400) + (fleece_blueS + fleece_blueM + fleece_blueL + fleece_blueXL) * 2000;
    }else if(status == '忘れ購入'){
        var checkBox = document.getElementById('black');
        var checkBox2 = document.getElementById('blue');
        var category = "";
        if(checkBox.checked){
            category = "ポロシャツ黒LL";
        }else if(checkBox2.checked){
            category = "ポロシャツ青LL";
        };
    }else{
        var shiftName = document.getElementById('shiftName').value;
        var nameplateColor = document.getElementById('nameplateColor').value;
    }
    //status
    var order_category = document.getElementById('order_category').value;
    var approver = document.getElementById('approver').value;
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
            approver:approver,
        });
    }else if(status == '忘れ購入'){
        //DBへ送信
        db.collection('uniforms').doc(id).update({
            category:category,
            status:order_category,
            approver:approver,
        });
    }else{
        //DBへ送信
        db.collection('uniforms').doc(id).update({
            shiftName:shiftName,
            nameplateColor:nameplateColor,
            status:order_category,
            approver:approver,
        });
    }
    var collectAlert = document.getElementById('collectAlert');
    collectAlert.innerHTML = '<div class="alert alert-success" role="alert">編集完了!リロードします。</div>';
    setTimeout("location.reload()",2000);
}

//削除
function deleteContent(id,name){
    var res = window.confirm(name + "さんの内容を削除しますか？");
    if( res ) {
        db.collection('uniforms').doc(id).delete();
        alert("削除されました。");
        setTimeout("location.reload()",500);
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
        for(var j = 0; j < table.rows[i].cells.length -1; j++){
        //data_csv += table.rows[i].cells[j].innerText;//HTML中の表のセル値をdata_csvに格納
        if(j == 8){
            data_csv += "\n";
        }else{
            data_csv += table.rows[i].cells[j].innerText;
            if(j == table.rows[i].cells.length-2){
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
        var createdAt = carrentDB.get('createdAt');
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