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
  
      query = await db.collection('POPDemands').orderBy('CreatedAt', 'desc').limit(10) // firebase.firestore.QuerySnapshotのインスタンスを取得
      querySnapshot = await query.get();

      //前回のDBとして保存
      backQueryList.push(querySnapshot);

      var i = 0;
      var stocklist = '<table class="table table-striped">'
      stocklist += '<tr><th>区分</th><th>依頼日</th><th>納品日</th><th>店舗名</th><th>件名</th><th>状況</th><th>編集</th></tr>';
      querySnapshot.forEach((postDoc) => {
        switch(postDoc.get('status')){
          case '完了':
              stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('orderCategory') +'</td><td>' + postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('orderDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('subject') + '</td><td>'+ postDoc.get('status') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状況を変更する</button></a></td></tr></tbody>';
              break;
          case '依頼中':
              stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('orderCategory') +'</td><td>' + postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('orderDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('subject') + '</td><td>'+ postDoc.get('status') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状況を変更する</button></a></td></tr></tbody>';
              break;
          default:
              stocklist += '<tbody><tr><td>'+ postDoc.get('orderCategory') +'</td><td>' + postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('orderDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('subject') + '</td><td>'+ postDoc.get('status') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状況を変更する</button></a></td></tr></tbody>';
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
        const carrentpopDemandDB = await db.collection('POPDemands').doc(id).get();
        //性別
        var status_elements = document.getElementById('status');

        switch(carrentpopDemandDB.get('status')){
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
          stocklist += '<tr><th>区分</th><th>依頼日</th><th>納品日</th><th>店舗名</th><th>件名</th><th>状況</th><th>編集</th></tr>';
          querySnapshot.forEach((postDoc) => {
            switch(postDoc.get('status')){
              case '完了':
                  stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('orderCategory') +'</td><td>' + postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('orderDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('subject') + '</td><td>'+ postDoc.get('status') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状況を変更する</button></a></td></tr></tbody>';
                  break;
              case '依頼中':
                  stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('orderCategory') +'</td><td>' + postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('orderDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('subject') + '</td><td>'+ postDoc.get('status') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状況を変更する</button></a></td></tr></tbody>';
                  break;
              default:
                  stocklist += '<tbody><tr><td>'+ postDoc.get('orderCategory') +'</td><td>' + postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('orderDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('subject') + '</td><td>'+ postDoc.get('status') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状況を変更する</button></a></td></tr></tbody>';
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
  stocklist += '<tr><th>区分</th><th>依頼日</th><th>納品日</th><th>店舗名</th><th>件名</th><th>状況</th><th>編集</th></tr>';
  querySnapshot.forEach((postDoc) => {
    switch(postDoc.get('status')){
      case '完了':
          stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('orderCategory') +'</td><td>' + postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('orderDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('subject') + '</td><td>'+ postDoc.get('status') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状況を変更する</button></a></td></tr></tbody>';
          break;
      case '依頼中':
          stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('orderCategory') +'</td><td>' + postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('orderDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('subject') + '</td><td>'+ postDoc.get('status') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状況を変更する</button></a></td></tr></tbody>';
          break;
      default:
          stocklist += '<tbody><tr><td>'+ postDoc.get('orderCategory') +'</td><td>' + postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('orderDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('subject') + '</td><td>'+ postDoc.get('status') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状況を変更する</button></a></td></tr></tbody>';
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
    //DBへ送信
    db.collection('POPDemands').doc(id).update({
      status:status,
  });
  var collectAlert = document.getElementById('collectAlert');
  collectAlert.innerHTML = '<div class="alert alert-success" role="alert">編集完了!リロードします。</div>';
  setTimeout("location.reload()",2000);
}

//PDF作成
function createPDF(id){
  (async () => {
    try {
      const carrentpopDemandDB = await db.collection('POPDemands').doc(id).get();
      //依頼区分
      var orderCategory = carrentpopDemandDB.get('orderCategory');
      //依頼日
      var orderDate = carrentpopDemandDB.get('orderDate');
      //納品日
      var preferredDate = carrentpopDemandDB.get('preferredDate');
      //店舗名
      var storeName = carrentpopDemandDB.get('storeName');
      //依頼者氏名
      var requesterName = carrentpopDemandDB.get('requesterName');
      //件名
      var subject = carrentpopDemandDB.get('subject');
      //要望詳細
      var demandDetail = carrentpopDemandDB.get('demandDetail');

      if(orderCategory == "POP"){
        //出力
        var output = carrentpopDemandDB.get('output');
        //加工
        var processing = carrentpopDemandDB.get('processing');
        //枚数
        var number = carrentpopDemandDB.get('number');
        //サイズ
        var sizeCheckBox = carrentpopDemandDB.get('sizeCheckBox');
        var sizeDerection = carrentpopDemandDB.get('sizeDerection');
        var horizontal = carrentpopDemandDB.get('horizontal');
        var vertical = carrentpopDemandDB.get('vertical');
        var coveringFare = carrentpopDemandDB.get('coveringFare');
        if(sizeCheckBox == ''){
          var size = '縦' + horizontal + 'mm × 横' + vertical + 'mm + 貼り代' + coveringFare + 'mm';
        }else{
            var size = sizeCheckBox + ' ' + sizeDerection;
        }
      }else{
        //webサイト
        var WebSite = carrentpopDemandDB.get('WebSite');
      }

      //要望詳細の1行の文字数を指定
      var textLimit = 34;//ここだけ設定
      var tmp = demandDetail.split("\n");

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


      var demandDetail = kaigyouBody.join("\n");

      console.log(demandDetail);


          //日本語フォント読み込み
          pdfMake.fonts = {
              GenShin: {
              normal: 'GenShinGothic-Normal-Sub.ttf',
              bold: 'GenShinGothic-Normal-Sub.ttf',
              italics: 'GenShinGothic-Normal-Sub.ttf',
              bolditalics: 'GenShinGothic-Normal-Sub.ttf'
              }
          };

          if(orderCategory == "POP"){
              //PDF作成処理
              var docDef = {
                  content: [
                      {
                          columns: [
                              {
                                  width: 'auto',
                                  text:  orderCategory + '要望',
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
                      {
                          table: {
                              headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                              widths: [50, '*'],
                              body: [
                                  ['件名',{text:subject,fontSize:15}],
                                  ['サイズ',{text:size,fontSize:20}]
                              ]
                          }
                      },
                      {
                          table: {
                              headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                              widths: ['*', '*', '*'],
                              body: [
                                  ['出力', '加工', '枚数'],
                                  [{text:output,fontSize:20},{text:processing,fontSize:20},{text:number,fontSize:20}]
                              ]
                          }
                      },
                      {
                          table: {
                              headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                              widths: ['*'],
                              body: [
                                  ['要望詳細'],
                                  [{text:demandDetail,fontSize:15}]
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
                                  width: 'auto',
                                  text:  orderCategory + '要望',
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
                      {
                          table: {
                              headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                              widths: [60, '*'],
                              body: [
                                  ['件名',{text:subject,fontSize:15}]
                              ]
                          }
                      },
                      {
                          table: {
                              headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                              widths: [60, '*'],
                              body: [
                                  ['Webサイト',{text:WebSite,fontSize:15}]
                              ]
                          }
                      },
                      {
                          table: {
                              headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                              widths: ['*'],
                              body: [
                                  ['要望詳細'],
                                  [{text:demandDetail,fontSize:15}]
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
                      font: 'GenShin',
                  },
              };
          }
          
          pdfMake.createPdf(docDef).download(orderCategory + "要望.pdf");
    } catch (err) {
    console.log(`Error: ${JSON.stringify(err)}`)
    }
})();
}