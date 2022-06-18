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

document.getElementById('web').style.display = "none";

//依頼区分とサイズの表示非表示
function change(){
    if(document.getElementById('order_category').value == "Web"){
        document.getElementById('web').style.display = "";
        document.getElementById('sizes').style.display = "none";
        document.getElementById('pops').style.display = "none";
    }else{
        document.getElementById('web').style.display = "none";
        document.getElementById('sizes').style.display = "";
        document.getElementById('pops').style.display = "";
    }
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

//追加
function POPDemandUpdate(){
    var collectAlert = document.getElementById('collectAlert');
    collectAlert.innerHTML = '<div class="alert alert-success" role="alert">送信中...</div>';
    //依頼区分
    var orderCategory = document.getElementById('order_category').value;
    //依頼日
    var orderDate = document.getElementById('order_date').value;
    //納品日
    var preferredDate = document.getElementById('preferred_date').value;
    //店舗名
    var storeName = document.getElementById('store_name').value;
    //依頼者氏名
    var requesterName = document.getElementById('requester_name').value;
    //件名
    var subject = document.getElementById('subject').value;
    //出力
    var output = document.getElementById('output').value;
    //加工
    var processing = document.getElementById('processing').value;
    //枚数
    var number = document.getElementById('number').value;
    //webサイト
    var WebSite = document.getElementById('website').value;
    //サイズ
    var sizeCheckBox = document.getElementById('size_checkBox').value;
    var sizeDerection = document.getElementById('size_derection').value;
    var horizontal = document.getElementById('horizontal').value;
    var vertical = document.getElementById('vertical').value;
    var coveringFare = document.getElementById('covering_fare').value;
    //要望詳細
    var demandDetail = document.getElementById('demand_detail').value;
    var collectAlert = document.getElementById('collectAlert');
    //写真データ
    var fileList = [];
    var fileNameList = [];

    (async () => {
        try{
            switch(orderCategory){
                case '':
                    collectAlert.innerHTML = '<div class="alert alert-danger" role="alert">依頼区分を選択してください。</div>'; 
                    break;
                case 'POP':
                    //画像を配列に配置
                    var files = document.getElementById('file').files;
                    for (let file of files) {
                        if(fileNameList.includes(file.name)){
        
                        }else{
                            fileList.push(file);
                            fileNameList.push(file.name);
                            console.log(fileList);
                        }
                    }
                    //DBへ送信
                    var res = await db.collection('POPDemands').add({
                        orderCategory: orderCategory,
                        orderDate: orderDate,
                        preferredDate:preferredDate,
                        storeName:storeName,
                        requesterName:requesterName,
                        subject:subject,
                        output:output,
                        processing:processing,
                        number:number,
                        sizeCheckBox:sizeCheckBox,
                        sizeDerection:sizeDerection,
                        horizontal:horizontal,
                        vertical:vertical,
                        coveringFare:coveringFare,
                        demandDetail:demandDetail,
                        status:'未完了',
                        photoCount:fileList.length,
                        supportPerson:'',
                        CreatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    });    
                    //写真アップロード
                    var uploads = [];
                    var i = 0;
                    for (var file of fileList) {
                        //画像を圧縮する
                        var img = new Compressor(file, {
                            quality: 0.5,
                            success(result) {
                                console.log('圧縮完了');
                                fileList[i] = result;
                            },
                            maxWidth:1000,
                            maxHeight: 400,
                            mimeType: 'image/png'
                        });
                        var storageRef = firebase.storage().ref('POPDemand/' + res.id + '/' + 'uploadImage' + i);
                        uploads.push(storageRef.put(fileList[i])); 
                        i += 1;
                    }
                    //すべての画像のアップロード完了を待つ
                    Promise.all(uploads).then(function () {
                        (async () => {
                            try{
                                console.log('アップロード完了');
                                collectAlert.innerHTML = '<div class="alert alert-success" role="alert">追加完了!リロードします。</div>';
                                setTimeout("location.reload()",2000);
                            } catch(err){
        
                            }
                        })();
                    });
                    break;
                case 'Web':
                    //画像を配列に配置
                    var files = document.getElementById('file').files;
                    for (let file of files) {
                        if(fileNameList.includes(file.name)){
        
                        }else{
                            fileList.push(file);
                            fileNameList.push(file.name);
                            console.log(fileList);
                        }
                    }
                    //DBへ送信
                    var res = await db.collection('POPDemands').add({
                        orderCategory: orderCategory,
                        orderDate: orderDate,
                        preferredDate:preferredDate,
                        storeName:storeName,
                        requesterName:requesterName,
                        subject:subject,
                        WebSite:WebSite,
                        demandDetail:demandDetail,
                        status:'未完了',
                        photoCount:fileList.length,
                        CreatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    });
                    //storageへアップロード
                    var uploads = [];
                    var i = 0;
                    for (var file of fileList) {
                        var storageRef = firebase.storage().ref('POPDemand/' + res.id + '/' + 'uploadfile' + i);
                        uploads.push(storageRef.put(fileList[i])); 
                        i += 1;
                    }
                    //すべての画像のアップロード完了を待つ
                    Promise.all(uploads).then(function () {
                        (async () => {
                            try{
                                console.log('アップロード完了');
                                collectAlert.innerHTML = '<div class="alert alert-success" role="alert">編集完了!リロードします。</div>';
                                setTimeout("location.reload()",2000);
                            } catch(err){
        
                            }
                        })();
                    });
                    break;
                default:break;    
            }
        } catch(err){

        }
    })();
}

//pdf出力
function createPDF(){
    //依頼区分
    var orderCategory = document.getElementById('order_category').value;
    //依頼日
    var orderDate = document.getElementById('order_date').value;
    //納品日
    var preferredDate = document.getElementById('preferred_date').value;
    //店舗名
    var storeName = document.getElementById('store_name').value;
    //依頼者氏名
    var requesterName = document.getElementById('requester_name').value;
    //件名
    var subject = document.getElementById('subject').value;
    //出力
    var output = document.getElementById('output').value;
    //加工
    var processing = document.getElementById('processing').value;
    //枚数
    var number = document.getElementById('number').value;
    //webサイト
    var WebSite = document.getElementById('website').value;
    //サイズ
    var sizeCheckBox = document.getElementById('size_checkBox').value;
    var sizeDerection = document.getElementById('size_derection').value;
    var horizontal = document.getElementById('horizontal').value;
    var vertical = document.getElementById('vertical').value;
    var coveringFare = document.getElementById('covering_fare').value;
    //要望詳細
    var demandDetail = document.getElementById('demand_detail').value;

    if(sizeCheckBox == ''){
        var size = '縦' + horizontal + 'mm × 横' + vertical + 'mm + 貼り代' + coveringFare + 'mm';
    }else{
        var size = sizeCheckBox + ' ' + sizeDerection;
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
}