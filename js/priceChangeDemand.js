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

//2~4つめのformを非表示
for(var i=1; i<5; i++){
    document.getElementById('select' + i).style.display = "none";
}

//change用のformを非表示
for(var i=0; i<5; i++){
    document.getElementById('select' + i + '_change').style.display = "none";
}

//本日の日付を初期値に配置
window.onload = function () {
    //今日の日時を表示
    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    
    var toTwoDigits = function (num, digit) {
        num += ''
        if (num.length < digit) {
        num = '0' + num
        }
        return num
    }
    
    var yyyy = toTwoDigits(year, 4)
    var mm = toTwoDigits(month, 2)
    var dd = toTwoDigits(day, 2)
    var ymd = yyyy + "-" + mm + "-" + dd;
    
    document.getElementById("order_date").value = ymd;
}


var orderContent = 1;
function addOrderContent(){
    document.getElementById('select' + orderContent).style.display = "block";
    orderContent += 1;
    if(orderContent == 5){
        document.getElementById('addButton').style.display = "none";
    }
}

//現行を選択したときにchange用のformを表示
function orderCategoryChange(i){
    if(document.getElementById('order_category' + i).value == "現行から変更"){
        document.getElementById('select' + i + '_change').style.display = "block";
    }else{
        document.getElementById('select' + i + '_change').style.display = "none";
    }
}

//追加
function priceChangeUpdate(){
    //依頼日
    var orderDate = document.getElementById('order_date').value;
    //希望日
    var preferredDate = document.getElementById('preferred_date').value;
    //店舗名
    var storeName = document.getElementById('store_name').value;
    //依頼者氏名
    var requesterName = document.getElementById('requester_name').value;

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
    db.collection('priceChangeDemands').add({
        orderDate: orderDate,
        preferredDate:preferredDate,
        storeName:storeName,
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
        status:'未完了',
        supportPerson:'',
        CreatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    var collectAlert = document.getElementById('collectAlert');
    collectAlert.innerHTML = '<div class="alert alert-success" role="alert">保存が完了しました</div>';
}

//pdf出力
function createPDF(){
    //依頼日
    var orderDate = document.getElementById('order_date').value;
    //希望日
    var preferredDate = document.getElementById('preferred_date').value;
    //店舗名
    var storeName = document.getElementById('store_name').value;
    //依頼者氏名
    var requesterName = document.getElementById('requester_name').value;

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
    
    pdfMake.createPdf(docDef).download("料金変更要望.pdf");
}