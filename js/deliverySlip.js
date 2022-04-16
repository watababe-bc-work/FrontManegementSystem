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

//税率部分を削除
for(var i = 1; i<6; i++){
    document.getElementById('taxDiv' + i).style.display = "none";
}

//税抜・税込での変更
function changeDiv(i){
    if(document.getElementById('tax_category' + i).value == "tax_included"){
        document.getElementById('taxDiv' + i).style.display = "";
    }else{
        document.getElementById('taxDiv' + i).style.display = "none";
    }
}

//合計金額を算出
function change(i){
    var num = document.getElementById('pronum' + i).value;
    var price = document.getElementById('proprice' + i).value;
    if(document.getElementById('tax_category' + i).value == "tax_included"){
        var tax = document.getElementById('tax' + i).value;
        var ans = Math.round(num * price * (1 + tax / 100));
        document.getElementById('price' + i).innerHTML = '<p>金額(税込):¥'+ ans +'</p>';
    }else{
        var ans = num * price;
        document.getElementById('price' + i).innerHTML = '<p>金額(税抜):¥'+ ans +'</p>';
    };
}

//追加

//DBへ追加
function POPDemandUpdate(){
    //名称
    var name = document.getElementById('name').value;
    //日時
    var date = document.getElementById('date').value;
    //登録番号
    var register = document.getElementById('registerNum').value;

    //品目
    var proname1 = document.getElementById('proname1').value;
    var pronum1 = document.getElementById('pronum1').value;
    var proprice1 = document.getElementById('proprice1').value;
    var taxCategory1 = document.getElementById('tax_category1').value;
    var tax1 = document.getElementById('tax1').value;
    var price1 = document.getElementById('price1').textContent;

    var proname2 = document.getElementById('proname2').value;
    var pronum2 = document.getElementById('pronum2').value;
    var proprice2 = document.getElementById('proprice2').value;
    var taxCategory2 = document.getElementById('tax_category2').value;
    var tax2 = document.getElementById('tax2').value;
    var price2 = document.getElementById('price2').textContent;

    var proname3 = document.getElementById('proname3').value;
    var pronum3 = document.getElementById('pronum3').value;
    var proprice3 = document.getElementById('proprice3').value;
    var taxCategory3 = document.getElementById('tax_category3').value;
    var tax3 = document.getElementById('tax3').value;
    var price3 = document.getElementById('price3').textContent;

    var proname4 = document.getElementById('proname4').value;
    var pronum4 = document.getElementById('pronum4').value;
    var proprice4 = document.getElementById('proprice4').value;
    var taxCategory4 = document.getElementById('tax_category4').value;
    var tax4 = document.getElementById('tax4').value;
    var price4 = document.getElementById('price4').textContent;

    var proname5 = document.getElementById('proname5').value;
    var pronum5 = document.getElementById('pronum5').value;
    var proprice5 = document.getElementById('proprice5').value;
    var taxCategory5 = document.getElementById('tax_category5').value;
    var tax5 = document.getElementById('tax5').value;
    var price5 = document.getElementById('price5').textContent;

    //DBへ送信
    db.collection('deliverySlips').add({
        name:name,
        date:date,
        register:register,
        proname1:proname1,
        pronum1:pronum1,
        proprice1:proprice1,
        taxCategory1:taxCategory1,
        tax1:tax1,
        price1:price1,
        proname2:proname2,
        pronum2:pronum2,
        proprice2:proprice2,
        taxCategory2:taxCategory2,
        tax2:tax2,
        price2:price2,
        proname3:proname3,
        pronum3:pronum3,
        proprice3:proprice3,
        taxCategory3:taxCategory3,
        tax3:tax3,
        price3:price3,
        proname4:proname4,
        pronum4:pronum4,
        proprice4:proprice4,
        taxCategory4:taxCategory4,
        tax4:tax4,
        price4:price4,
        proname5:proname5,
        pronum5:pronum5,
        proprice5:proprice5,
        taxCategory5:taxCategory5,
        tax5:tax5,
        price5:price5,
    });
    var Alert = document.getElementById('Alert');
    Alert.innerHTML = '<div class="alert alert-success" role="alert">編集完了!リロードします。</div>';
    setTimeout("location.reload()",2000);
}

//一覧

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
  
      query = await db.collection('deliverySlips').orderBy('date', 'desc').limit(10) // firebase.firestore.QuerySnapshotのインスタンスを取得
      querySnapshot = await query.get();

      //前回のDBとして保存
      backQueryList.push(querySnapshot);

      var stocklist = '<table class="table table-striped">'
      stocklist += '<tr><th>日時</th><th>名称</th><th>登録番号</th><th>品名1</th><th>PDF</th>';
      querySnapshot.forEach((postDoc) => {
          stocklist += '<tbody><tr><td>'+ postDoc.get('date') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('register') + '</td><td>' + postDoc.get('proname1') + '</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button></td></tr></tbody>';
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
          stocklist += '<tr><th>日時</th><th>名称</th><th>登録番号</th><th>品名1</th><th>PDF</th>';
          querySnapshot.forEach((postDoc) => {
              stocklist += '<tbody><tr><td>'+ postDoc.get('date') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('register') + '</td><td>' + postDoc.get('proname1') + '</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button></td></tr></tbody>';
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
  stocklist += '<tr><th>日時</th><th>名称</th><th>登録番号</th><th>品名1</th><th>PDF</th>';
  querySnapshot.forEach((postDoc) => {
      stocklist += '<tbody><tr><td>'+ postDoc.get('date') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('register') + '</td><td>' + postDoc.get('proname1') + '</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button></td></tr></tbody>';
  })
  stocklist += '</table>';
  document.getElementById('table_list').innerHTML = stocklist;

  //前が無くなったら前へを非表示
  if(currentQueryList.length < 1){
      document.getElementById('prevButton').style.visibility = 'hidden';
  }
}

//PDF作成
function createPDF(id){
  (async () => {
    try {
      const carrentDB = await db.collection('deliverySlips').doc(id).get();
      //日時
      var date = carrentDB.get('date');
      //名称
      var name = carrentDB.get('name');
      //登録番号
      var register = carrentDB.get('register');

        //品目
        var proname1 = carrentDB.get('proname1');
        var pronum1 = carrentDB.get('pronum1');
        var proprice1 = carrentDB.get('proprice1');
        var tax1 = carrentDB.get('tax1');
        var price1 = carrentDB.get('price1');

        var proname2 = carrentDB.get('proname2');
        var pronum2 = carrentDB.get('pronum2');
        var proprice2 = carrentDB.get('proprice2');
        var tax2 = carrentDB.get('tax2');
        var price2 = carrentDB.get('price2');

        var proname3 = carrentDB.get('proname3');
        var pronum3 = carrentDB.get('pronum3');
        var proprice3 = carrentDB.get('proprice3');
        var tax3 = carrentDB.get('tax3');
        var price3 = carrentDB.get('price3');

        var proname4 = carrentDB.get('proname4');
        var pronum4 = carrentDB.get('pronum4');
        var proprice4 = carrentDB.get('proprice4');
        var tax4 = carrentDB.get('tax4');
        var price4 = carrentDB.get('price4');

        var proname5 = carrentDB.get('proname5');
        var pronum5 = carrentDB.get('pronum5');
        var proprice5 = carrentDB.get('proprice5');
        var tax5 = carrentDB.get('tax5');
        var price5 = carrentDB.get('price5');

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
                            text: "納品書",
                            style: ['left'],
                            fontSize: 20
                        },
                        {
                            width: '*',
                            text: date,
                            style: ['right'],
                            fontSize: 15
                        },
                    ],
                    columnGap: 10
                },
                {
                columns: [
                    {
                        width: '*',
                        text: name + " 様",
                        margin: [ 10, 0, 0, 10 ],
                        style: ['left'],
                        fontSize: 20
                    },
                    {
                        width: '*',
                        text: "登録番号:" + register,
                        style: ['right'],
                        fontSize: 20
                    },
                ],
                columnGap: 10
                },
                {
                    columns: [
                        {
                            width: '*',
                            text: "下記のとおり納品いたしました",
                            margin: [ 10, 0, 0, 10 ],
                            style: ['left'],
                            fontSize: 10
                        },
                    ],
                    columnGap: 10
                    },
                {
                table: {
                    headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                    widths: ['*',50,50,200,50],
                    body: [
                        ['品名','数量','単価','金額','税率'],
                        [proname1,pronum1,proprice1,price1,tax1],
                        [proname2,pronum2,proprice2,price2,tax2],
                        [proname3,pronum3,proprice3,price3,tax3],
                        [proname4,pronum4,proprice4,price4,tax4],
                        [proname5,pronum5,proprice5,price5,tax5],
                    ],
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

