// const Config = {
//     apiKey: "AIzaSyDJQ534D9SszcYEt8m4KzRMDEPx1sWJf8M",
//     authDomain: "watanabe-bc-work.firebaseapp.com",
//     projectId: "watanabe-bc-work",
//     storageBucket: "watanabe-bc-work.appspot.com",
//     messagingSenderId: "299351282418",
//     appId: "1:299351282418:web:348999f1df61b69917366b"
//   };

//   firebase.initializeApp(Config);

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();
// db.settings({
//   timestampsInSnapshots: true
// });

var queryPrice="";
var queryPriceSnapshot="";
var currentqueryPriceSnapshot = "";
var currentqueryPriceList = [];
var backqueryPriceList = [];
document.getElementById('prevButton_price').style.visibility = 'hidden';

//テーブル表示(初期値)
(async () => {
    try {
      // 省略 
      // (Cloud Firestoreのインスタンスを初期化してdbにセット)
  
      queryPrice = await db.collection('priceChangeDemands').orderBy('CreatedAt', 'desc').limit(10) // firebase.firestore.queryPriceSnapshotのインスタンスを取得
      queryPriceSnapshot = await queryPrice.get();

      //前回のDBとして保存
      backqueryPriceList.push(queryPriceSnapshot);

      var i = 0;
      var stocklist = '<table class="table table-striped" id="download_table_price">'
      stocklist += '<tr><th>依頼日</th><th>希望日</th><th>店舗名</th><th>状況</th><th>依頼者</th><th>対応者</th><th>編集</th></tr>';
      queryPriceSnapshot.forEach((postDoc) => {
        switch(postDoc.get('status')){
          case '完了':
              stocklist += '<tbody class="collectBack"><tr><td>' + postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('orderDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>'+ postDoc.get('status') +'</td><td>'+ postDoc.get('requesterName') +'</td><td>'+ postDoc.get('supportPerson') +'</td><td><a class="js-modal-open1"><button class="btn btn-info" onclick="editStatusPrice(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContentPrice(\''+postDoc.id+'\',\''+ postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) +'\')">削除</button></td></tr></tbody>';
              break;
          case '依頼中':
              stocklist += '<tbody class="orderBack"><tr><td>' + postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('orderDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>'+ postDoc.get('status') +'</td><td>'+ postDoc.get('requesterName') +'</td><td>'+ postDoc.get('supportPerson') +'</td><td><a class="js-modal-open1"><button class="btn btn-info" onclick="editStatusPrice(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContentPrice(\''+postDoc.id+'\',\''+ postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) +'\')">削除</button></td></tr></tbody>';
              break;
          default:
              stocklist += '<tbody><tr><td>' + postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('orderDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>'+ postDoc.get('status') +'</td><td>'+ postDoc.get('requesterName') +'</td><td>'+ postDoc.get('supportPerson') +'</td><td><a class="js-modal-open1"><button class="btn btn-info" onclick="editStatusPrice(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContentPrice(\''+postDoc.id+'\',\''+ postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) +'\')">削除</button></td></tr></tbody>';
              break;        
        }
      })
      stocklist += '</table>';
      document.getElementById('table_list_priceChange').innerHTML = stocklist;

      //後が無い場合に非表示
      if(queryPriceSnapshot.docs.length < 10){
        document.getElementById('nextButton_price').style.visibility = "hidden";
      }

    } catch (err) {
        console.log(err);
    }
})();

//change用のformを非表示
for(var i=0; i<5; i++){
    document.getElementById('select' + i + '_change').style.display = "none";
}

//現行を選択したときにchange用のformを表示
function orderCategoryChange(i){
    if(document.getElementById('order_category' + i).value == "現行から変更"){
        document.getElementById('select' + i + '_change').style.display = "block";
    }else{
        document.getElementById('select' + i + '_change').style.display = "none";
    }
}

//Status編集用モーダルウィンドウ
function editStatusPrice(id){
  (async () => {
    try {
        const carrentpriceChangeDemandDB = await db.collection('priceChangeDemands').doc(id).get();
        //依頼日
        document.getElementById('CreatedAt').textContent = carrentpriceChangeDemandDB.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'});;
        //希望日
        document.getElementById('preferredDate').value = carrentpriceChangeDemandDB.get('preferredDate');
        //店舗名
        document.getElementById('storeName').textContent = carrentpriceChangeDemandDB.get('storeName');
        //依頼者
        document.getElementById('requesterName_price').value = carrentpriceChangeDemandDB.get('requesterName');
        //対応者
        document.getElementById('supportPerson_price').value = carrentpriceChangeDemandDB.get('supportPerson');
        //状況
        var status_elements = document.getElementById('status_price');
        switch(carrentpriceChangeDemandDB.get('status')){
            case '未完了':
                status_elements.options[1].selected = true;
                break;
            case '完了':
                status_elements.options[2].selected = true;
                break;
            case '依頼中':
                status_elements.options[3].selected = true;   
                break;
            default:
                status_elements.options[0].selected = true;
                break;    
        }
        //1つめ
        var ordercategory0 = document.getElementById('order_category0');
        switch(carrentpriceChangeDemandDB.get('ordercategory0')){
            case '新規プラン':
                ordercategory0.options[1].selected = true;
                break;
            case '現行から変更':
                ordercategory0.options[2].selected = true;  
                document.getElementById('select0_change').style.display = "block";
                break;
            default:
                ordercategory0.options[0].selected = true;  
            break;    
        }
        document.getElementById('orderContent0').value = carrentpriceChangeDemandDB.get('orderContent0');
        document.getElementById('receptionDate0').value = carrentpriceChangeDemandDB.get('receptionDate0');
        document.getElementById('price0').value = carrentpriceChangeDemandDB.get('price0');
        document.getElementById('orderContent_change0').value = carrentpriceChangeDemandDB.get('orderContent_change0');
        document.getElementById('receptionDate_change0').value = carrentpriceChangeDemandDB.get('receptionDate_change0');
        document.getElementById('price_change0').value = carrentpriceChangeDemandDB.get('price_change0');

        //2つめ
        var ordercategory1 = document.getElementById('order_category1');
        switch(carrentpriceChangeDemandDB.get('ordercategory1')){
            case '新規プラン':
                ordercategory1.options[1].selected = true;
                break;
            case '現行から変更':
                ordercategory1.options[2].selected = true; 
                document.getElementById('select1_change').style.display = "block"; 
                break;
            default:
                ordercategory1.options[0].selected = true;  
            break;    
        }
        document.getElementById('orderContent1').value = carrentpriceChangeDemandDB.get('orderContent1');
        document.getElementById('receptionDate1').value = carrentpriceChangeDemandDB.get('receptionDate1');
        document.getElementById('price1').value = carrentpriceChangeDemandDB.get('price1');
        document.getElementById('orderContent_change1').value = carrentpriceChangeDemandDB.get('orderContent_change1');
        document.getElementById('receptionDate_change1').value = carrentpriceChangeDemandDB.get('receptionDate_change1');
        document.getElementById('price_change1').value = carrentpriceChangeDemandDB.get('price_change1');

        //3つめ
        var ordercategory2 = document.getElementById('order_category2');
        switch(carrentpriceChangeDemandDB.get('ordercategory2')){
            case '新規プラン':
                ordercategory2.options[1].selected = true;
                break;
            case '現行から変更':
                ordercategory2.options[2].selected = true;  
                document.getElementById('select2_change').style.display = "block";
                break;
            default:
                ordercategory2.options[0].selected = true;  
            break;    
        }
        document.getElementById('orderContent2').value = carrentpriceChangeDemandDB.get('orderContent2');
        document.getElementById('receptionDate2').value = carrentpriceChangeDemandDB.get('receptionDate2');
        document.getElementById('price2').value = carrentpriceChangeDemandDB.get('price2');
        document.getElementById('orderContent_change2').value = carrentpriceChangeDemandDB.get('orderContent_change2');
        document.getElementById('receptionDate_change2').value = carrentpriceChangeDemandDB.get('receptionDate_change2');
        document.getElementById('price_change2').value = carrentpriceChangeDemandDB.get('price_change2');

        //4つめ
        var ordercategory3 = document.getElementById('order_category3');
        switch(carrentpriceChangeDemandDB.get('ordercategory3')){
            case '新規プラン':
                ordercategory3.options[1].selected = true;
                break;
            case '現行から変更':
                ordercategory3.options[2].selected = true;  
                document.getElementById('select3_change').style.display = "block";
                break;
            default:
                ordercategory3.options[0].selected = true;  
            break;    
        }
        document.getElementById('orderContent3').value = carrentpriceChangeDemandDB.get('orderContent3');
        document.getElementById('receptionDate3').value = carrentpriceChangeDemandDB.get('receptionDate3');
        document.getElementById('price3').value = carrentpriceChangeDemandDB.get('price3');
        document.getElementById('orderContent_change3').value = carrentpriceChangeDemandDB.get('orderContent_change3');
        document.getElementById('receptionDate_change3').value = carrentpriceChangeDemandDB.get('receptionDate_change3');
        document.getElementById('price_change3').value = carrentpriceChangeDemandDB.get('price_change3');

        //5つめ
        var ordercategory4 = document.getElementById('order_category4');
        switch(carrentpriceChangeDemandDB.get('ordercategory4')){
            case '新規プラン':
                ordercategory4.options[1].selected = true;
                break;
            case '現行から変更':
                ordercategory4.options[2].selected = true;  
                document.getElementById('select4_change').style.display = "block";
                break;
            default:
                ordercategory4.options[0].selected = true;  
            break;    
        }
        document.getElementById('orderContent4').value = carrentpriceChangeDemandDB.get('orderContent4');
        document.getElementById('receptionDate4').value = carrentpriceChangeDemandDB.get('receptionDate4');
        document.getElementById('price4').value = carrentpriceChangeDemandDB.get('price4');
        document.getElementById('orderContent_change4').value = carrentpriceChangeDemandDB.get('orderContent_change4');
        document.getElementById('receptionDate_change4').value = carrentpriceChangeDemandDB.get('receptionDate_change4');
        document.getElementById('price_change4').value = carrentpriceChangeDemandDB.get('price_change4');

        //編集送信ボタン生成
        document.getElementById('edit_submit_button_price').innerHTML = '<button type="submit" class="btn btn-success" onclick="EditUpdatePrice(\''+id+'\')">送信する</button>';

    } catch (err) {
    console.log(err);
    }
})();
}

//次へ
function nextPeginationPrice(){
  document.getElementById('prevButton_price').style.visibility = 'visible';
  (async () => {
      try {
          //変更前のDB情報を保持しておく
          currentqueryPriceList.push(queryPriceSnapshot);

          console.log(currentqueryPriceList);

          queryPrice = queryPrice.limit(10).startAfter(queryPriceSnapshot.docs[9]);
          queryPriceSnapshot = await queryPrice.get();

          //後が無い場合に非表示
          if(queryPriceSnapshot.docs.length < 10){
              document.getElementById('nextButton_price').style.visibility = "hidden";
          }

          var i = 0;
          var stocklist = '<table class="table table-striped" id="download_table_price">'
          stocklist += '<tr><th>依頼日</th><th>希望日</th><th>店舗名</th><th>状況</th><th>依頼者</th><th>対応者</th><th>編集</th></tr>';
          queryPriceSnapshot.forEach((postDoc) => {
            switch(postDoc.get('status')){
              case '完了':
                  stocklist += '<tbody class="collectBack"><tr><td>' + postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('orderDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>'+ postDoc.get('status') +'</td><td>'+ postDoc.get('requesterName') +'</td><td>'+ postDoc.get('supportPerson') +'</td><td><a class="js-modal-open1"><button class="btn btn-info" onclick="editStatusPrice(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContentPrice(\''+postDoc.id+'\',\''+ postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) +'\')">削除</button></td></tr></tbody>';
                  break;
              case '依頼中':
                  stocklist += '<tbody class="orderBack"><tr><td>' + postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('orderDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>'+ postDoc.get('status') +'</td><td>'+ postDoc.get('requesterName') +'</td><td>'+ postDoc.get('supportPerson') +'</td><td><a class="js-modal-open1"><button class="btn btn-info" onclick="editStatusPrice(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContentPrice(\''+postDoc.id+'\',\''+ postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) +'\')">削除</button></td></tr></tbody>';
                  break;
              default:
                  stocklist += '<tbody><tr><td>' + postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('orderDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>'+ postDoc.get('status') +'</td><td>'+ postDoc.get('requesterName') +'</td><td>'+ postDoc.get('supportPerson') +'</td><td><a class="js-modal-open1"><button class="btn btn-info" onclick="editStatusPrice(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContentPrice(\''+postDoc.id+'\',\''+ postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) +'\')">削除</button></td></tr></tbody>';
                  break;        
            }
          })
          stocklist += '</table>';
          document.getElementById('table_list_priceChange').innerHTML = stocklist;
  
      } catch (err) {
          console.log(err);
      }
  })();
}

//前のテーブルを表示
function returnTablePrice(){
  document.getElementById('nextButton_price').style.visibility = 'visible';
  queryPriceSnapshot = currentqueryPriceList.pop();

  var i = 0;
  var stocklist = '<table class="table table-striped" id="download_table_price">'
  stocklist += '<tr><th>依頼日</th><th>希望日</th><th>店舗名</th><th>状況</th><th>依頼者</th><th>対応者</th><th>編集</th></tr>';
  queryPriceSnapshot.forEach((postDoc) => {
    //pdfで印刷用コード
    //<button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button>
    switch(postDoc.get('status')){
      case '完了':
          stocklist += '<tbody class="collectBack"><tr><td>' + postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('orderDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>'+ postDoc.get('status') +'</td><td>'+ postDoc.get('requesterName') +'</td><td>'+ postDoc.get('supportPerson') +'</td><td><a class="js-modal-open1"><button class="btn btn-info" onclick="editStatusPrice(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContentPrice(\''+postDoc.id+'\',\''+ postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) +'\')">削除</button></td></tr></tbody>';
          break;
      case '依頼中':
          stocklist += '<tbody class="orderBack"><tr><td>' + postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('orderDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>'+ postDoc.get('status') +'</td><td>'+ postDoc.get('requesterName') +'</td><td>'+ postDoc.get('supportPerson') +'</td><td><a class="js-modal-open1"><button class="btn btn-info" onclick="editStatusPrice(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContentPrice(\''+postDoc.id+'\',\''+ postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) +'\')">削除</button></td></tr></tbody>';
          break;
      default:
          stocklist += '<tbody><tr><td>' + postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('orderDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>'+ postDoc.get('status') +'</td><td>'+ postDoc.get('requesterName') +'</td><td>'+ postDoc.get('supportPerson') +'</td><td><a class="js-modal-open1"><button class="btn btn-info" onclick="editStatusPrice(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContentPrice(\''+postDoc.id+'\',\''+ postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) +'\')">削除</button></td></tr></tbody>';
          break;        
    }
  })
  stocklist += '</table>';
  document.getElementById('table_list_priceChange').innerHTML = stocklist;

  //前が無くなったら前へを非表示
  if(currentqueryPriceList.length < 1){
      document.getElementById('prevButton_price').style.visibility = 'hidden';
  }
}

//status編集
function EditUpdatePrice(id){
    //希望日
    var preferredDate = document.getElementById('preferredDate').value;
    //依頼者
    var requesterName = document.getElementById('requesterName_price').value;
    //対応者
    var supportPerson = document.getElementById('supportPerson_price').value;
    //status
    var status = document.getElementById('status_price').value;
    //依頼区分
    //依頼等
    var ordercategory0 = document.getElementById('order_category0').value;
    var orderContent0 = document.getElementById('orderContent0').value;
    var receptionDate0 = document.getElementById('receptionDate0').value;
    var price0 = document.getElementById('price0').value;
    var orderContent_change0 = document.getElementById('orderContent_change0').value;
    var receptionDate_change0 = document.getElementById('receptionDate_change0').value;
    var price_change0 = document.getElementById('price_change0').value;

    var ordercategory1 = document.getElementById('order_category1').value;
    var orderContent1 = document.getElementById('orderContent1').value;
    var receptionDate1 = document.getElementById('receptionDate1').value;
    var price1 = document.getElementById('price1').value;
    var orderContent_change1 = document.getElementById('orderContent_change1').value;
    var receptionDate_change1 = document.getElementById('receptionDate_change1').value;
    var price_change1 = document.getElementById('price_change1').value;

    var ordercategory2 = document.getElementById('order_category2').value;
    var orderContent2 = document.getElementById('orderContent2').value;
    var receptionDate2 = document.getElementById('receptionDate2').value;
    var price2 = document.getElementById('price2').value;
    var orderContent_change2 = document.getElementById('orderContent_change2').value;
    var receptionDate_change2 = document.getElementById('receptionDate_change2').value;
    var price_change2 = document.getElementById('price_change2').value;

    var ordercategory3 = document.getElementById('order_category3').value;
    var orderContent3 = document.getElementById('orderContent3').value;
    var receptionDate3 = document.getElementById('receptionDate3').value;
    var price3 = document.getElementById('price3').value;
    var orderContent_change3 = document.getElementById('orderContent_change3').value;
    var receptionDate_change3 = document.getElementById('receptionDate_change3').value;
    var price_change3 = document.getElementById('price_change3').value;

    var ordercategory4 = document.getElementById('order_category4').value;
    var orderContent4 = document.getElementById('orderContent4').value;
    var receptionDate4 = document.getElementById('receptionDate4').value;
    var price4 = document.getElementById('price4').value;
    var orderContent_change4 = document.getElementById('orderContent_change4').value;
    var receptionDate_change4 = document.getElementById('receptionDate_change4').value;
    var price_change4 = document.getElementById('price_change4').value;

    //DBへ送信
    db.collection('priceChangeDemands').doc(id).update({
        preferredDate:preferredDate,
        requesterName:requesterName,
        ordercategory0:ordercategory0,
        orderContent0:orderContent0,
        receptionDate0,receptionDate0,
        price0:price0,
        orderContent_change0:orderContent_change0,
        receptionDate_change0:receptionDate_change0,
        price_change0:price_change0,
        ordercategory1:ordercategory1,
        orderContent1:orderContent1,
        receptionDate1,receptionDate1,
        price1:price1,
        orderContent_change1:orderContent_change1,
        receptionDate_change1:receptionDate_change1,
        price_change1:price_change1,
        ordercategory2:ordercategory2,
        orderContent2:orderContent2,
        receptionDate2,receptionDate2,
        price2:price2,
        orderContent_change2:orderContent_change2,
        receptionDate_change2:receptionDate_change2,
        price_change2:price_change2,
        ordercategory3:ordercategory3,
        orderContent3:orderContent3,
        receptionDate3,receptionDate3,
        price3:price3,
        orderContent_change3:orderContent_change3,
        receptionDate_change3:receptionDate_change3,
        price_change3:price_change3,
        ordercategory4:ordercategory4,
        orderContent4:orderContent4,
        receptionDate4,receptionDate4,
        price4:price4,
        orderContent_change4:orderContent_change4,
        receptionDate_change4:receptionDate_change4,
        price_change4:price_change4,
        status:status,
        supportPerson:supportPerson
  });
  var collectAlert_price = document.getElementById('collectAlert_price');
  collectAlert_price.innerHTML = '<div class="alert alert-success" role="alert">編集完了!リロードします。</div>';
  setTimeout("location.reload()",2000);
}

//削除
function deleteContentPrice(id,date){
    var res = window.confirm(date + "の内容を削除しますか？");
    if( res ) {
        db.collection('priceChangeDemands').doc(id).delete();
        alert("削除されました。");
        setTimeout("location.reload()",500);
    }
    else {
        // キャンセルならアラートボックスを表示
        alert("キャンセルしました。");
    } 
};

//CSV出力＆ダウンロード
function handleDownloadPrice(){
    var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);//文字コードをBOM付きUTF-8に指定
    var table = document.getElementById('download_table_price');
    var data_csv="";//ここに文字データとして値を格納していく

    for(var i = 0;  i < table.rows.length; i++){
        for(var j = 0; j < table.rows[i].cells.length -1; j++){
        //data_csv += table.rows[i].cells[j].innerText;//HTML中の表のセル値をdata_csvに格納
        if(j == 5){
            data_csv += table.rows[i].cells[j].innerText;
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
        document.getElementById("downloadPrice").href = window.URL.createObjectURL(blob);
    }

    delete data_csv;//data_csvオブジェクトはもういらないので消去してメモリを開放
}

// //PDF作成
// function createPDF(id){
//   (async () => {
//     try {
//       const carrentpriceChangeDemandDB = await db.collection('priceChangeDemands').doc(id).get();
//       //依頼日
//       var orderDate = carrentpriceChangeDemandDB.get('orderDate');
//       //納品日
//       var preferredDate = carrentpriceChangeDemandDB.get('preferredDate');
//       //店舗名
//       var storeName = carrentpriceChangeDemandDB.get('storeName');
//       //依頼者氏名
//       var requesterName = carrentpriceChangeDemandDB.get('requesterName');

//     //依頼等
//     var ordercategory0 = carrentpriceChangeDemandDB.get('ordercategory0');
//     var orderContent0 = carrentpriceChangeDemandDB.get('orderContent0');
//     var receptionDate0 = carrentpriceChangeDemandDB.get('receptionDate0');
//     var price0 = carrentpriceChangeDemandDB.get('price0');
//     var orderContent_change0 = carrentpriceChangeDemandDB.get('orderContent_change0');
//     var receptionDate_change0 = carrentpriceChangeDemandDB.get('receptionDate_change0');
//     var price_change0 = carrentpriceChangeDemandDB.get('price_change0');

//     var ordercategory1 = carrentpriceChangeDemandDB.get('ordercategory1');
//     var orderContent1 = carrentpriceChangeDemandDB.get('orderContent1');
//     var receptionDate1 = carrentpriceChangeDemandDB.get('receptionDate1');
//     var price1 = carrentpriceChangeDemandDB.get('price1');
//     var orderContent_change1 = carrentpriceChangeDemandDB.get('orderContent_change1');
//     var receptionDate_change1 = carrentpriceChangeDemandDB.get('receptionDate_change1');
//     var price_change1 = carrentpriceChangeDemandDB.get('price_change1');

//     var ordercategory2 = carrentpriceChangeDemandDB.get('ordercategory2');
//     var orderContent2 = carrentpriceChangeDemandDB.get('orderContent2');
//     var receptionDate2 = carrentpriceChangeDemandDB.get('receptionDate2');
//     var price2 = carrentpriceChangeDemandDB.get('price2');
//     var orderContent_change2 = carrentpriceChangeDemandDB.get('orderContent_change2');
//     var receptionDate_change2 = carrentpriceChangeDemandDB.get('receptionDate_change2');
//     var price_change2 = carrentpriceChangeDemandDB.get('price_change2');

//     var ordercategory3 = carrentpriceChangeDemandDB.get('ordercategory3');
//     var orderContent3 = carrentpriceChangeDemandDB.get('orderContent3');
//     var receptionDate3 = carrentpriceChangeDemandDB.get('receptionDate3');
//     var price3 = carrentpriceChangeDemandDB.get('price3');
//     var orderContent_change3 = carrentpriceChangeDemandDB.get('orderContent_change3');
//     var receptionDate_change3 = carrentpriceChangeDemandDB.get('receptionDate_change3');
//     var price_change3 = carrentpriceChangeDemandDB.get('price_change3');

//     var ordercategory4 = carrentpriceChangeDemandDB.get('ordercategory4');
//     var orderContent4 = carrentpriceChangeDemandDB.get('orderContent4');
//     var receptionDate4 = carrentpriceChangeDemandDB.get('receptionDate4');
//     var price4 = carrentpriceChangeDemandDB.get('price4');
//     var orderContent_change4 = carrentpriceChangeDemandDB.get('orderContent_change4');
//     var receptionDate_change4 = carrentpriceChangeDemandDB.get('receptionDate_change4');
//     var price_change4 = carrentpriceChangeDemandDB.get('price_change4');

//     //日本語フォント読み込み
//     pdfMake.fonts = {
//         GenShin: {
//         normal: 'GenShinGothic-Normal-Sub.ttf',
//         bold: 'GenShinGothic-Normal-Sub.ttf',
//         italics: 'GenShinGothic-Normal-Sub.ttf',
//         bolditalics: 'GenShinGothic-Normal-Sub.ttf'
//         }
//     };

//     //PDF作成処理
//     if(ordercategory0 == '新規プラン'){
//         var table_content0 = {
//             layout:'noBorders',
//             table: {
//                 headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
//                 widths: ['*', '*','*'],
//                 body: [
//                     [{text:ordercategory0,background:"black",color:"white",margin:[0,10,0,0]},'',''],
//                     ['プラン', '受付日時', '金額'],
//                     [{text:orderContent0,fontSize:20},{text:receptionDate0,fontSize:20},{text:price0,fontSize:20}],
//                 ]
//             }
//         };
//     }else if(ordercategory0 == "現行から変更"){
//         var table_content0 = {
//             layout:'noBorders',
//             table: {
//                 headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
//                 widths: ['*', '*','*'],
//                 body: [
//                     [{text:ordercategory0,background:"black",color:"white",margin:[0,10,0,0]},' ',' '],
//                     ['プラン', '受付日時', '金額'],
//                     [{text:orderContent0,fontSize:20},{text:receptionDate0,fontSize:20},{text:price0,fontSize:20}],
//                     [' ',{text:'↓',alignment:'center'},' '],
//                     [{text:orderContent_change0,fontSize:20},{text:receptionDate_change0,fontSize:20},{text:price_change0,fontSize:20}],
//                 ]
//             }
//         };
//     }else{
//         var table_content0 = "";
//     }

//     if(ordercategory1 == '新規プラン'){
//         var table_content1 = {
//             layout:'noBorders',
//             table: {
//                 headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
//                 widths: ['*', '*','*'],
//                 body: [
//                     [{text:ordercategory1,background:"black",color:"white",margin:[0,10,0,0]},'',''],
//                     ['プラン', '受付日時', '金額'],
//                     [{text:orderContent1,fontSize:20},{text:receptionDate1,fontSize:20},{text:price1,fontSize:20}],
//                 ]
//             }
//         };
//     }else if(ordercategory1 == "現行から変更"){
//         var table_content1 = {
//             layout:'noBorders',
//             table: {
//                 headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
//                 widths: ['*', '*','*'],
//                 body: [
//                     [{text:ordercategory1,background:"black",color:"white",margin:[0,10,0,0]},' ',' '],
//                     ['プラン', '受付日時', '金額'],
//                     [{text:orderContent1,fontSize:20},{text:receptionDate1,fontSize:20},{text:price1,fontSize:20}],
//                     [' ',{text:'↓',alignment:'center'},' '],
//                     [{text:orderContent_change1,fontSize:20},{text:receptionDate_change1,fontSize:20},{text:price_change1,fontSize:20}],
//                 ]
//             }
//         };
//     }else{
//         var table_content1 = "";
//     }

//     if(ordercategory2 == '新規プラン'){
//         var table_content2 = {
//             layout:'noBorders',
//             table: {
//                 headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
//                 widths: ['*', '*','*'],
//                 body: [
//                     [{text:ordercategory2,background:"black",color:"white",margin:[0,10,0,0]},'',''],
//                     ['プラン', '受付日時', '金額'],
//                     [{text:orderContent2,fontSize:20},{text:receptionDate2,fontSize:20},{text:price2,fontSize:20}],
//                 ]
//             }
//         };
//     }else if(ordercategory2 == "現行から変更"){
//         var table_content2 = {
//             layout:'noBorders',
//             table: {
//                 headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
//                 widths: ['*', '*','*'],
//                 body: [
//                     [{text:ordercategory2,background:"black",color:"white",margin:[0,10,0,0]},' ',' '],
//                     ['プラン', '受付日時', '金額'],
//                     [{text:orderContent2,fontSize:20},{text:receptionDate2,fontSize:20},{text:price2,fontSize:20}],
//                     [' ',{text:'↓',alignment:'center'},' '],
//                     [{text:orderContent_change2,fontSize:20},{text:receptionDate_change2,fontSize:20},{text:price_change2,fontSize:20}],
//                 ]
//             }
//         };
//     }else{
//         var table_content2 = "";
//     }

//     if(ordercategory3 == '新規プラン'){
//         var table_content3 = {
//             layout:'noBorders',
//             table: {
//                 headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
//                 widths: ['*', '*','*'],
//                 body: [
//                     [{text:ordercategory3,background:"black",color:"white",margin:[0,10,0,0]},'',''],
//                     ['プラン', '受付日時', '金額'],
//                     [{text:orderContent3,fontSize:20},{text:receptionDate3,fontSize:20},{text:price3,fontSize:20}],
//                 ]
//             }
//         };
//     }else if(ordercategory3 == "現行から変更"){
//         var table_content3 = {
//             layout:'noBorders',
//             table: {
//                 headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
//                 widths: ['*', '*','*'],
//                 body: [
//                     [{text:ordercategory3,background:"black",color:"white",margin:[0,10,0,0]},' ',' '],
//                     ['プラン', '受付日時', '金額'],
//                     [{text:orderContent3,fontSize:20},{text:receptionDate3,fontSize:20},{text:price3,fontSize:20}],
//                     [' ',{text:'↓',alignment:'center'},' '],
//                     [{text:orderContent_change3,fontSize:20},{text:receptionDate_change3,fontSize:20},{text:price_change3,fontSize:20}],
//                 ]
//             }
//         };
//     }else{
//         var table_content3 = "";
//     }

//     if(ordercategory4 == '新規プラン'){
//         var table_content4 = {
//             layout:'noBorders',
//             table: {
//                 headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
//                 widths: ['*', '*','*'],
//                 body: [
//                     [{text:ordercategory4,background:"black",color:"white",margin:[0,10,0,0]},'',''],
//                     ['プラン', '受付日時', '金額'],
//                     [{text:orderContent4,fontSize:20},{text:receptionDate4,fontSize:20},{text:price4,fontSize:20}],
//                 ]
//             }
//         };
//     }else if(ordercategory4 == "現行から変更"){
//         var table_content4 = {
//             layout:'noBorders',
//             table: {
//                 headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
//                 widths: ['*', '*','*'],
//                 body: [
//                     [{text:ordercategory4,background:"black",color:"white",margin:[0,10,0,0]},' ',' '],
//                     ['プラン', '受付日時', '金額'],
//                     [{text:orderContent4,fontSize:20},{text:receptionDate4,fontSize:20},{text:price4,fontSize:20}],
//                     [' ',{text:'↓',alignment:'center'},' '],
//                     [{text:orderContent_change4,fontSize:20},{text:receptionDate_change4,fontSize:20},{text:price_change4,fontSize:20}],
//                 ]
//             }
//         };
//     }else{
//         var table_content4 = "";
//     }

//     var docDef = {
//         content: [
//             {
//                 columns: [
//                     {
//                         width: 'auto',
//                         text:  '料金変更要望',
//                         fontSize: 25
//                     },
//                     {
//                         width: '*',
//                         text: '所属長印',
//                         style: ['center','border'],
//                         fontSize: 20
//                     }
//                 ],
//                 columnGap: 10
//             },
//             {
//                 table: {
//                     headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
//                     widths: ['*', '*',220,'*'],
//                     body: [
//                         ['依頼日', '納品日', '店舗名','依頼者氏名'],
//                         [{text:orderDate,fontSize:15},{text:preferredDate,fontSize:15},{text:storeName,fontSize:15},{text:requesterName,fontSize:15}],
//                     ]
//                 }
//             },
//             table_content0,
//             table_content1,
//             table_content2,
//             table_content3,
//             table_content4,
//             {text:'更新確認用',alignment:'center',margin:[0,10,0,0]},
//             {
//                 table: {
//                     headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
//                     widths: ['*', '*','*','*','*','*'],
//                     body: [
//                         ['HP', '予約サイト', 'ハピホテ','カップルズ','Twitter',''],
//                         ['  ','  ','  ','  ','  ','  '],
//                     ]
//                 }
//             },
//         ],
//         styles:{
//             center:{
//                 alignment: 'center'
//             },
//             border:{
//                 decorationStyle:'dashed'
//             }
//         },
//         defaultStyle: {
//             font: 'GenShin'
//         },
//     };
    
//     pdfMake.createPdf(docDef).download("料金変更要望.pdf");createPdf(docDef).download(orderCategory + "要望.pdf");
//     } catch (err) {
//     console.log(`Error: ${JSON.stringify(err)}`)
//     }
// })();
// }