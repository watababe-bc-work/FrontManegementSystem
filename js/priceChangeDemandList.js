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
  
      query = await db.collection('priceChangeDemands').orderBy('CreatedAt', 'desc').limit(10) // firebase.firestore.QuerySnapshotのインスタンスを取得
      querySnapshot = await query.get();

      //前回のDBとして保存
      backQueryList.push(querySnapshot);

      var i = 0;
      var stocklist = '<table class="table table-striped">'
      stocklist += '<tr><th>依頼日</th><th>希望日</th><th>店舗名</th><th>状況</th><th>対応者</th><th>編集</th></tr>';
      querySnapshot.forEach((postDoc) => {
        switch(postDoc.get('status')){
          case '完了':
              stocklist += '<tbody class="collectBack"><tr><td>' + postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('orderDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>'+ postDoc.get('status') +'</td><td>'+ postDoc.get('supportPerson') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状況を変更する</button></a></td></tr></tbody>';
              break;
          case '依頼中':
              stocklist += '<tbody class="orderBack"><tr><td>' + postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('orderDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>'+ postDoc.get('status') +'</td><td>'+ postDoc.get('supportPerson') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状況を変更する</button></a></td></tr></tbody>';
              break;
          default:
              stocklist += '<tbody><tr><td>' + postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('orderDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>'+ postDoc.get('status') +'</td><td>'+ postDoc.get('supportPerson') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状況を変更する</button></a></td></tr></tbody>';
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

//Status編集用モーダルウィンドウ
function editStatus(id){
  (async () => {
    try {
        const carrentpriceChangeDemandDB = await db.collection('priceChangeDemands').doc(id).get();
        var status_elements = document.getElementById('status');

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

          var i = 0;
          var stocklist = '<table class="table table-striped">'
          stocklist += '<tr><th>依頼日</th><th>納品日</th><th>店舗名</th><th>状況</th><th>対応者</th><th>編集</th></tr>';
          querySnapshot.forEach((postDoc) => {
            switch(postDoc.get('status')){
              case '完了':
                  stocklist += '<tbody class="collectBack"><tr><td>' + postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('orderDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>'+ postDoc.get('status') +'</td><td>'+ postDoc.get('supportPerson') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状況を変更する</button></a></td></tr></tbody>';
                  break;
              case '依頼中':
                  stocklist += '<tbody class="orderBack"><tr><td>' + postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('orderDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>'+ postDoc.get('status') +'</td><td>'+ postDoc.get('supportPerson') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状況を変更する</button></a></td></tr></tbody>';
                  break;
              default:
                  stocklist += '<tbody><tr><td>' + postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('orderDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>'+ postDoc.get('status') +'</td><td>'+ postDoc.get('supportPerson') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状況を変更する</button></a></td></tr></tbody>';
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

  var i = 0;
  var stocklist = '<table class="table table-striped">'
  stocklist += '<tr><th>依頼日</th><th>納品日</th><th>店舗名</th><th>状況</th><th>対応者</th><th>編集</th></tr>';
  querySnapshot.forEach((postDoc) => {
    switch(postDoc.get('status')){
      case '完了':
          stocklist += '<tbody class="collectBack"><tr><td>' + postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('orderDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>'+ postDoc.get('status') +'</td><td>'+ postDoc.get('supportPerson') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状況を変更する</button></a></td></tr></tbody>';
          break;
      case '依頼中':
          stocklist += '<tbody class="orderBack"><tr><td>' + postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('orderDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>'+ postDoc.get('status') +'</td><td>'+ postDoc.get('supportPerson') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状況を変更する</button></a></td></tr></tbody>';
          break;
      default:
          stocklist += '<tbody><tr><td>' + postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('orderDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>'+ postDoc.get('status') +'</td><td>'+ postDoc.get('supportPerson') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状況を変更する</button></a></td></tr></tbody>';
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
    var status = document.getElementById('status').value;
    var supportPerson = document.getElementById('supportPerson').value;
    //DBへ送信
    db.collection('priceChangeDemands').doc(id).update({
      status:status,
      supportPerson:supportPerson
  });
  var collectAlert = document.getElementById('collectAlert');
  collectAlert.innerHTML = '<div class="alert alert-success" role="alert">編集完了!リロードします。</div>';
  setTimeout("location.reload()",2000);
}

//PDF作成
function createPDF(id){
  (async () => {
    try {
      const carrentpriceChangeDemandDB = await db.collection('priceChangeDemands').doc(id).get();
      //依頼日
      var orderDate = carrentpriceChangeDemandDB.get('orderDate');
      //納品日
      var preferredDate = carrentpriceChangeDemandDB.get('preferredDate');
      //店舗名
      var storeName = carrentpriceChangeDemandDB.get('storeName');
      //依頼者氏名
      var requesterName = carrentpriceChangeDemandDB.get('requesterName');

    //依頼等
    var ordercategory0 = carrentpriceChangeDemandDB.get('ordercategory0');
    var orderContent0 = carrentpriceChangeDemandDB.get('orderContent0');
    var receptionDate0 = carrentpriceChangeDemandDB.get('receptionDate0');
    var price0 = carrentpriceChangeDemandDB.get('price0');
    var orderContent_change0 = carrentpriceChangeDemandDB.get('orderContent_change0');
    var receptionDate_change0 = carrentpriceChangeDemandDB.get('receptionDate_change0');
    var price_change0 = carrentpriceChangeDemandDB.get('price_change0');

    var ordercategory1 = carrentpriceChangeDemandDB.get('ordercategory1');
    var orderContent1 = carrentpriceChangeDemandDB.get('orderContent1');
    var receptionDate1 = carrentpriceChangeDemandDB.get('receptionDate1');
    var price1 = carrentpriceChangeDemandDB.get('price1');
    var orderContent_change1 = carrentpriceChangeDemandDB.get('orderContent_change1');
    var receptionDate_change1 = carrentpriceChangeDemandDB.get('receptionDate_change1');
    var price_change1 = carrentpriceChangeDemandDB.get('price_change1');

    var ordercategory2 = carrentpriceChangeDemandDB.get('ordercategory2');
    var orderContent2 = carrentpriceChangeDemandDB.get('orderContent2');
    var receptionDate2 = carrentpriceChangeDemandDB.get('receptionDate2');
    var price2 = carrentpriceChangeDemandDB.get('price2');
    var orderContent_change2 = carrentpriceChangeDemandDB.get('orderContent_change2');
    var receptionDate_change2 = carrentpriceChangeDemandDB.get('receptionDate_change2');
    var price_change2 = carrentpriceChangeDemandDB.get('price_change2');

    var ordercategory3 = carrentpriceChangeDemandDB.get('ordercategory3');
    var orderContent3 = carrentpriceChangeDemandDB.get('orderContent3');
    var receptionDate3 = carrentpriceChangeDemandDB.get('receptionDate3');
    var price3 = carrentpriceChangeDemandDB.get('price3');
    var orderContent_change3 = carrentpriceChangeDemandDB.get('orderContent_change3');
    var receptionDate_change3 = carrentpriceChangeDemandDB.get('receptionDate_change3');
    var price_change3 = carrentpriceChangeDemandDB.get('price_change3');

    var ordercategory4 = carrentpriceChangeDemandDB.get('ordercategory4');
    var orderContent4 = carrentpriceChangeDemandDB.get('orderContent4');
    var receptionDate4 = carrentpriceChangeDemandDB.get('receptionDate4');
    var price4 = carrentpriceChangeDemandDB.get('price4');
    var orderContent_change4 = carrentpriceChangeDemandDB.get('orderContent_change4');
    var receptionDate_change4 = carrentpriceChangeDemandDB.get('receptionDate_change4');
    var price_change4 = carrentpriceChangeDemandDB.get('price_change4');

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
    if(ordercategory0 == '新規プラン'){
        var table_content0 = {
            layout:'noBorders',
            table: {
                headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                widths: ['*', '*','*'],
                body: [
                    [{text:ordercategory0,background:"black",color:"white",margin:[0,10,0,0]},'',''],
                    ['プラン', '受付日時', '金額'],
                    [{text:orderContent0,fontSize:20},{text:receptionDate0,fontSize:20},{text:price0,fontSize:20}],
                ]
            }
        };
    }else if(ordercategory0 == "現行から変更"){
        var table_content0 = {
            layout:'noBorders',
            table: {
                headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                widths: ['*', '*','*'],
                body: [
                    [{text:ordercategory0,background:"black",color:"white",margin:[0,10,0,0]},' ',' '],
                    ['プラン', '受付日時', '金額'],
                    [{text:orderContent0,fontSize:20},{text:receptionDate0,fontSize:20},{text:price0,fontSize:20}],
                    [' ',{text:'↓',alignment:'center'},' '],
                    [{text:orderContent_change0,fontSize:20},{text:receptionDate_change0,fontSize:20},{text:price_change0,fontSize:20}],
                ]
            }
        };
    }else{
        var table_content0 = "";
    }

    if(ordercategory1 == '新規プラン'){
        var table_content1 = {
            layout:'noBorders',
            table: {
                headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                widths: ['*', '*','*'],
                body: [
                    [{text:ordercategory1,background:"black",color:"white",margin:[0,10,0,0]},'',''],
                    ['プラン', '受付日時', '金額'],
                    [{text:orderContent1,fontSize:20},{text:receptionDate1,fontSize:20},{text:price1,fontSize:20}],
                ]
            }
        };
    }else if(ordercategory1 == "現行から変更"){
        var table_content1 = {
            layout:'noBorders',
            table: {
                headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                widths: ['*', '*','*'],
                body: [
                    [{text:ordercategory1,background:"black",color:"white",margin:[0,10,0,0]},' ',' '],
                    ['プラン', '受付日時', '金額'],
                    [{text:orderContent1,fontSize:20},{text:receptionDate1,fontSize:20},{text:price1,fontSize:20}],
                    [' ',{text:'↓',alignment:'center'},' '],
                    [{text:orderContent_change1,fontSize:20},{text:receptionDate_change1,fontSize:20},{text:price_change1,fontSize:20}],
                ]
            }
        };
    }else{
        var table_content1 = "";
    }

    if(ordercategory2 == '新規プラン'){
        var table_content2 = {
            layout:'noBorders',
            table: {
                headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                widths: ['*', '*','*'],
                body: [
                    [{text:ordercategory2,background:"black",color:"white",margin:[0,10,0,0]},'',''],
                    ['プラン', '受付日時', '金額'],
                    [{text:orderContent2,fontSize:20},{text:receptionDate2,fontSize:20},{text:price2,fontSize:20}],
                ]
            }
        };
    }else if(ordercategory2 == "現行から変更"){
        var table_content2 = {
            layout:'noBorders',
            table: {
                headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                widths: ['*', '*','*'],
                body: [
                    [{text:ordercategory2,background:"black",color:"white",margin:[0,10,0,0]},' ',' '],
                    ['プラン', '受付日時', '金額'],
                    [{text:orderContent2,fontSize:20},{text:receptionDate2,fontSize:20},{text:price2,fontSize:20}],
                    [' ',{text:'↓',alignment:'center'},' '],
                    [{text:orderContent_change2,fontSize:20},{text:receptionDate_change2,fontSize:20},{text:price_change2,fontSize:20}],
                ]
            }
        };
    }else{
        var table_content2 = "";
    }

    if(ordercategory3 == '新規プラン'){
        var table_content3 = {
            layout:'noBorders',
            table: {
                headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                widths: ['*', '*','*'],
                body: [
                    [{text:ordercategory3,background:"black",color:"white",margin:[0,10,0,0]},'',''],
                    ['プラン', '受付日時', '金額'],
                    [{text:orderContent3,fontSize:20},{text:receptionDate3,fontSize:20},{text:price3,fontSize:20}],
                ]
            }
        };
    }else if(ordercategory3 == "現行から変更"){
        var table_content3 = {
            layout:'noBorders',
            table: {
                headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                widths: ['*', '*','*'],
                body: [
                    [{text:ordercategory3,background:"black",color:"white",margin:[0,10,0,0]},' ',' '],
                    ['プラン', '受付日時', '金額'],
                    [{text:orderContent3,fontSize:20},{text:receptionDate3,fontSize:20},{text:price3,fontSize:20}],
                    [' ',{text:'↓',alignment:'center'},' '],
                    [{text:orderContent_change3,fontSize:20},{text:receptionDate_change3,fontSize:20},{text:price_change3,fontSize:20}],
                ]
            }
        };
    }else{
        var table_content3 = "";
    }

    if(ordercategory4 == '新規プラン'){
        var table_content4 = {
            layout:'noBorders',
            table: {
                headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                widths: ['*', '*','*'],
                body: [
                    [{text:ordercategory4,background:"black",color:"white",margin:[0,10,0,0]},'',''],
                    ['プラン', '受付日時', '金額'],
                    [{text:orderContent4,fontSize:20},{text:receptionDate4,fontSize:20},{text:price4,fontSize:20}],
                ]
            }
        };
    }else if(ordercategory4 == "現行から変更"){
        var table_content4 = {
            layout:'noBorders',
            table: {
                headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                widths: ['*', '*','*'],
                body: [
                    [{text:ordercategory4,background:"black",color:"white",margin:[0,10,0,0]},' ',' '],
                    ['プラン', '受付日時', '金額'],
                    [{text:orderContent4,fontSize:20},{text:receptionDate4,fontSize:20},{text:price4,fontSize:20}],
                    [' ',{text:'↓',alignment:'center'},' '],
                    [{text:orderContent_change4,fontSize:20},{text:receptionDate_change4,fontSize:20},{text:price_change4,fontSize:20}],
                ]
            }
        };
    }else{
        var table_content4 = "";
    }

    var docDef = {
        content: [
            {
                columns: [
                    {
                        width: 'auto',
                        text:  '料金変更要望',
                        fontSize: 25
                    },
                    {
                        width: '*',
                        text: '所属長印',
                        style: ['center','border'],
                        fontSize: 20
                    }
                ],
                columnGap: 10
            },
            {
                table: {
                    headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                    widths: ['*', '*',220,'*'],
                    body: [
                        ['依頼日', '納品日', '店舗名','依頼者氏名'],
                        [{text:orderDate,fontSize:15},{text:preferredDate,fontSize:15},{text:storeName,fontSize:15},{text:requesterName,fontSize:15}],
                    ]
                }
            },
            table_content0,
            table_content1,
            table_content2,
            table_content3,
            table_content4,
            {text:'更新確認用',alignment:'center',margin:[0,10,0,0]},
            {
                table: {
                    headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                    widths: ['*', '*','*','*','*','*'],
                    body: [
                        ['HP', '予約サイト', 'ハピホテ','カップルズ','Twitter',''],
                        ['  ','  ','  ','  ','  ','  '],
                    ]
                }
            },
        ],
        styles:{
            center:{
                alignment: 'center'
            },
            border:{
                decorationStyle:'dashed'
            }
        },
        defaultStyle: {
            font: 'GenShin'
        },
    };
    
    pdfMake.createPdf(docDef).download("料金変更要望.pdf");createPdf(docDef).download(orderCategory + "要望.pdf");
    } catch (err) {
    console.log(`Error: ${JSON.stringify(err)}`)
    }
})();
}