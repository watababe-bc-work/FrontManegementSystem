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
document.getElementById('disapproval_reason').style.display = "none";

//テーブル表示(初期値)
(async () => {
    try {
      // 省略 
      // (Cloud Firestoreのインスタンスを初期化してdbにセット)
  
      query = await db.collection('ptoApps').orderBy('startDate', 'desc').limit(10) // firebase.firestore.QuerySnapshotのインスタンスを取得
      querySnapshot = await query.get();

      //前回のDBとして保存
      backQueryList.push(querySnapshot);

      var stocklist = '<table class="table table-striped">'
      stocklist += '<tr><th>依頼日時</th><th>社員番号</th><th>氏名</th><th>申請期間</th><th>申請理由</th><th>状態</th><th>編集</th>';
      querySnapshot.forEach((postDoc) => {
        switch(postDoc.get('status')){
        //承認
          case 'approve':
              var statusText = "承認";
              stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('staffNum') + '</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('startDate') + "から" + postDoc.get('endDate') + "まで" + '</td><td>' + postDoc.get('reason') + '</td><td>' + statusText + '</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button></td></tr></tbody>';
              break;
        //不承認      
          case 'disapproval':
              var statusText = "不承認";
              stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('staffNum') + '</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('startDate') + "から" + postDoc.get('endDate') + "まで" + '</td><td>' + postDoc.get('reason') + '</td><td>' + statusText + '</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button></td></tr></tbody>';
              break;
        //未承認      
          default:
              var statusText = "未承認";
              stocklist += '<tbody><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('staffNum') + '</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('startDate') + "から" + postDoc.get('endDate') + "まで" + '</td><td>' + postDoc.get('reason') + '</td><td>' + statusText + '</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状態を変更</button></td></tr></tbody>';
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
        const carrentDB = await db.collection('ptoApps').doc(id).get();
        document.getElementById('name_edit').textContent = carrentDB.get('name');
        document.getElementById('createdAt_edit').textContent = carrentDB.get('createdAt');
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
          stocklist += '<tr><th>依頼日時</th><th>社員番号</th><th>氏名</th><th>申請期間</th><th>申請理由</th><th>状態</th><th>編集</th>';
          querySnapshot.forEach((postDoc) => {
            switch(postDoc.get('status')){
            //承認
              case 'approve':
                  var statusText = "承認";
                  stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('staffNum') + '</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('startDate') + "から" + postDoc.get('endDate') + "まで" + '</td><td>' + postDoc.get('reason') + '</td><td>' + statusText + '</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button></td></tr></tbody>';
                  break;
            //不承認      
              case 'disapproval':
                  var statusText = "不承認";
                  stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('staffNum') + '</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('startDate') + "から" + postDoc.get('endDate') + "まで" + '</td><td>' + postDoc.get('reason') + '</td><td>' + statusText + '</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button></td></tr></tbody>';
                  break;
            //未承認      
              default:
                  var statusText = "未承認";
                  stocklist += '<tbody><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('staffNum') + '</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('startDate') + "から" + postDoc.get('endDate') + "まで" + '</td><td>' + postDoc.get('reason') + '</td><td>' + statusText + '</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状態を変更</button></td></tr></tbody>';
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
  stocklist += '<tr><th>依頼日時</th><th>社員番号</th><th>氏名</th><th>申請期間</th><th>申請理由</th><th>状態</th><th>編集</th>';
  querySnapshot.forEach((postDoc) => {
    switch(postDoc.get('status')){
    //承認
      case 'approve':
          var statusText = "承認";
          stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('staffNum') + '</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('startDate') + "から" + postDoc.get('endDate') + "まで" + '</td><td>' + postDoc.get('reason') + '</td><td>' + statusText + '</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button></td></tr></tbody>';
          break;
    //不承認      
      case 'disapproval':
          var statusText = "不承認";
          stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('staffNum') + '</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('startDate') + "から" + postDoc.get('endDate') + "まで" + '</td><td>' + postDoc.get('reason') + '</td><td>' + statusText + '</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button></td></tr></tbody>';
          break;
    //未承認      
      default:
          var statusText = "未承認";
          stocklist += '<tbody><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('staffNum') + '</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('startDate') + "から" + postDoc.get('endDate') + "まで" + '</td><td>' + postDoc.get('reason') + '</td><td>' + statusText + '</td><td><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">状態を変更</button></td></tr></tbody>';
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
    if(order_category == 'disapproval'){
        var disapproval_reason = document.getElementById('disapprovalReason').value;
    };
    var note = document.getElementById('note').value;
    //DBへ送信
    if(order_category == 'disapproval'){
        db.collection('ptoApps').doc(id).update({
            status:order_category,
            disapprovalReason:disapproval_reason,
            note:note,
        });
    }else{
        db.collection('ptoApps').doc(id).update({
            status:order_category,
            note:note,
        });
    };
    var collectAlert = document.getElementById('collectAlert');
    collectAlert.innerHTML = '<div class="alert alert-success" role="alert">編集完了!リロードします。</div>';
    setTimeout("location.reload()",2000);
}

//PDF作成
function createPDF(id){
  (async () => {
    try {
      const carrentDB = await db.collection('ptoApps').doc(id).get();
      //社員番号
      var staffNum = carrentDB.get('staffNum');
      //氏名
      var name = carrentDB.get('name');
      //日時
      var createdAt = carrentDB.get('createdAt');
      //開始日
      var startDate = carrentDB.get('startDate');
      //終了日
      var endDate = carrentDB.get('endDate');
      //申請理由
      var reason = carrentDB.get('reason');
      //処理
      var status = carrentDB.get('status');
      if(status == 'disapproval'){
          var disapprovalReason = carrentDB.get('disapprovalReason');
          //要望詳細の1行の文字数を指定
        var textLimit = 34;//ここだけ設定
        var tmp = disapprovalReason.split("\n");

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


        var disapprovalReason = kaigyouBody.join("\n");
      };
      //備考
      var note = carrentDB.get('note');

      //要望詳細の1行の文字数を指定
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

          if(status == "approve"){
              //PDF作成処理
              var docDef = {
                  content: [
                      {
                          columns: [
                              {
                                  width: '*',
                                  text: createdAt,
                                  style: ['right','border'],
                                  fontSize: 10
                              }
                          ],
                          columnGap: 10
                      },
                      {
                        columns: [
                            {
                                width: '*',
                                text: '年次有給休暇申請書',
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
                            widths: [50,150],
                            body: [
                                ['社員番号',{text:staffNum,fontSize:15,alignment:'center'}],
                                ['氏名',{text:name,fontSize:15,alignment:'center'}],
                            ],
                        }
                      },
                      {
                        table: {
                            headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                            widths: ['*'],
                            style:['center'],
                            body: [
                                ['期間'],
                                [{text:startDate + ' から ' + endDate + ' まで ',fontSize:15,alignment:'center'}]
                            ]
                        }
                      },
                      {
                        table: {
                            headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                            widths: ['*'],
                            body: [
                                ['事由'],
                                [{text:reason,fontSize:15}]
                            ]
                        }
                      },
                      {
                        table: {
                            headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                            widths: ['*'],
                            body: [
                                ['備考'],
                                [{text:note,fontSize:15}]
                            ]
                        }
                      },
                      {
                        table: {
                            headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                            widths: ['*', '*', '*'],
                            style:['center'],
                            body: [
                                ['管理者承認'],
                                [{text:' ',fontSize:20}]
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
                                text: createdAt,
                                style: ['right','border'],
                                fontSize: 10
                            }
                        ],
                        columnGap: 10
                    },
                    {
                      columns: [
                          {
                              width: '*',
                              text: '年次有給休暇申請書',
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
                          widths: [50,150],
                          body: [
                              ['社員番号',{text:staffNum,fontSize:15,alignment:'center'}],
                              ['氏名',{text:name,fontSize:15,alignment:'center'}],
                          ],
                      }
                    },
                    {
                      table: {
                          headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                          widths: ['*'],
                          style:['center'],
                          body: [
                              ['期間'],
                              [{text:startDate + ' から ' + endDate + ' まで ',fontSize:15,alignment:'center'}]
                          ]
                      }
                    },
                    {
                      table: {
                          headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                          widths: ['*'],
                          body: [
                              ['事由'],
                              [{text:reason,fontSize:15}]
                          ]
                      }
                    },
                    {
                      table: {
                          headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                          widths: ['*'],
                          body: [
                              ['備考'],
                              [{text:note,fontSize:15}]
                          ]
                      }
                    },
                    {
                      table: {
                          headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                          widths: ['*', '*', '*'],
                          style:['center'],
                          body: [
                              ['管理者不承認'],
                              [{text:' ',fontSize:20}]
                          ]
                      }
                    },
                    {
                        table: {
                            headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                            widths: ['*'],
                            body: [
                                ['不承認理由'],
                                [{text:disapprovalReason,fontSize:15}]
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
    console.log(`Error: ${JSON.stringify(err)}`)
    }
})();
}