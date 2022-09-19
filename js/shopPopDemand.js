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

var addForm = document.getElementById('addForm');
addForm.style.display = "none";

var addButton = document.getElementById('addButton');

//フォーム表示非表示
function showForm(){
    if(addForm.style.display == ""){
        addForm.style.display = "none";
        addButton.textContent = "+要望登録する";
    }else{
        addForm.style.display = "";
        addButton.textContent = "-要望登録を非表示にする";
    }
}

//追加する店舗名リストを作成
var storeList = [];
function addStore(e){
    storeList.push(e);
    document.getElementById('addstoreList').innerHTML= "<p>送信店舗一覧:</p><p>" + storeList + "</p>";
    document.getElementById('store_name').value = "";
}

//店舗のリセット
function resetStore(){
    document.getElementById('addstoreList').innerHTML= "";
    storeList = [];
}

var title = document.getElementById('title');
var noticeTime = document.getElementById('notice_time');
var noticePeriod = document.getElementById('notice_period');
var storename = document.getElementById('addstoreList');
var size = document.getElementById('size');
var demandDetail = document.getElementById('demand_detail');
//写真データ
var fileList = [];
var fileNameList = [];
var collectAlert = document.getElementById('collectAlert');

//パラメータ取得
function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

//パラメータでのDB表示
const searchParams = decodeURI(window.location.search);
if(getParam('storename')){
    showDB(getParam('storename'));
}else{
    showDB(false);
}

//追加
function shopPopDemandUpdate(){
    collectAlert.innerHTML = '<div class="alert alert-success" role="alert">送信中...</div>';
    (async () => {
        try{
            if(storename != "" || files != ""){
                var files = document.getElementById('file').files;
                //画像を配列に配置
                for (let file of files) {
                    if(fileNameList.includes(file.name)){
                    }else{
                        fileList.push(file);
                        fileNameList.push(file.name);
                        console.log(fileList);
                    }
                }
                //DBへ送信
                var res = await db.collection('shopPOPDemand').add({
                    title:title.value,
                    noticeTime:noticeTime.value,
                    noticePeriod:noticePeriod.value,
                    storename:storeList,
                    size:size.value,
                    demandDetail:demandDetail.value,
                    CreatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                });    
                //アップロード
                var uploads = [];
                var fileTypeList = ['png','jpg','jpeg'];
                var i = 0;
                for (var file of fileList) {
                    let file_type = file.name.split('.').pop();
                    //拡張子が写真データでなければ圧縮しない
                    if(fileTypeList.includes(file_type)){
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
                    }
                    var storageRef = firebase.storage().ref('shopPOPDemand/' + res.id + '/uploadData');
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
            }else{
                collectAlert.innerHTML = '<div class="alert alert-danger" role="alert">店舗名と写真添付は必須項目です。</div>';
            }
        } catch(err){
            console.log(err);
        }
    })();
}

//DB表示
function showDB(storename){
    (async () => {
        try {
          // 省略 
          // (Cloud Firestoreのインスタンスを初期化してdbにセット)

          if(storename){
              var query = await db.collection('shopPOPDemand').where('storename','array-contains-any',[storename,'全店共通']).orderBy('CreatedAt', 'desc'); 
          }else{
              var query = await db.collection('shopPOPDemand').orderBy('CreatedAt', 'desc'); 
          }
      
          var querySnapshot = await query.get();
    
          var i = 0;
          var stocklist = '<table class="table table-striped" id="download_table">'
          stocklist += '<tr><th>タイトル</th><th>掲示日時</th><th>掲示期間</th><th>掲載店舗</th><th>サイズ</th><th>詳細</th><th>編集</th></tr>';
          querySnapshot.forEach((postDoc) => {
            //pdf非表示中
            //<button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button>
            stocklist += '<tbody><tr><td>'+ postDoc.get('title') +'</td><td>' + postDoc.get('noticeTime') + '</td><td>' + postDoc.get('noticePeriod') + '</td><td>' + postDoc.get('storename') + '</td><td>' + postDoc.get('size') + '</td><td>' + postDoc.get('demandDetail') + '</td><td><a class="js-modal-open2"><button class="btn btn-primary" onclick="modalImages(\''+postDoc.id+'\')">画像/データ</button></a><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('title') +'\')">削除</button></td></tr></tbody>';
          })
          stocklist += '</table>';
          document.getElementById('table_list').innerHTML = stocklist;
    
        } catch (err) {
            console.log(err);
        }
    })();
}

//追加する店舗名リストを作成(編集)
var storeListEdit = [];
function addStoreEdit(e){
    storeListEdit.push(e);
    document.getElementById('addstoreEditList').innerHTML= "<p>送信店舗一覧:</p><p>" + storeListEdit + "</p>";
    document.getElementById('store_name').value = "";
}

var titleEdit = document.getElementById('title_edit');
var noticeTimeEdit = document.getElementById('notice_time_edit');
var noticePeriodEdit = document.getElementById('notice_period_edit');
var storenameEdit = document.getElementById('addstoreEditList');
var sizeEdit = document.getElementById('size_edit');
var demandDetailEdit = document.getElementById('demand_detail_edit');
//写真データ
var fileListEdit = [];
var fileNameListEdit = [];
var collectAlertEdit = document.getElementById('collectAlert_edit');

//Status編集用モーダルウィンドウ
function editStatus(id){
    (async () => {
      try {
          const carrentpopDemandDB = await db.collection('shopPOPDemand').doc(id).get();
          //タイトル
          titleEdit.value = carrentpopDemandDB.get('title');
          //掲示日時
          noticeTimeEdit.value = carrentpopDemandDB.get('noticeTime');
          //掲示期限
          noticePeriodEdit.value = carrentpopDemandDB.get('noticePeriod');
          //店舗名
          storenameEdit.innerHTML = '<p>送信店舗一覧:</p><p>' +  carrentpopDemandDB.get('storename') + '</p>';
          //サイズ
          sizeEdit.value = carrentpopDemandDB.get('size');
          //要望詳細
          demandDetailEdit.value = carrentpopDemandDB.get('demandDetail');

          //編集送信ボタン生成
          document.getElementById('edit_submit_button').innerHTML = '<button type="submit" class="btn btn-success" onclick="EditUpdate(\''+id+'\')">送信する</button>';
  
      } catch (err) {
      console.log(err)
      }
  })();
}

//status編集
function EditUpdate(id){
    //DBへ送信
    db.collection('shopPOPDemand').doc(id).update({
        title:titleEdit.value,
        noticeTime:noticeTimeEdit.value,
        noticePeriod:noticePeriodEdit.value,
        storename:storeListEdit,
        size:sizeEdit.value,
        demandDetail:demandDetailEdit.value,
    });
    collectAlertEdit.innerHTML = '<div class="alert alert-success" role="alert">保存が完了しました</div>';
    setTimeout("location.reload()",2000);
}

//画像/データモーダル
function modalImages(id){
    var prevTask = Promise.resolve;
    (async () => {
        try { 
            var storageImageRef = firebase.storage().ref('/shopPOPDemand/' + id + '/uploadData');
            var metaData = await storageImageRef.getMetadata();
            console.log(metaData);
            if(metaData.contentType == 'application/pdf'){
                document.getElementById('modalImgs').innerHTML = '<p>データリストをロード中...</p>';  
                var stocklist = "";
                prevTask = Promise.all([prevTask,storageImageRef.getDownloadURL()]).then(([_,url])=>{
                    stocklist += "<a href = " + "'" + url + "' target='_blank'" + "><p>"+ metaData.name +"</p></a>";
                    document.getElementById('modalImgs').innerHTML = stocklist;
                }).catch(error => {
                }).catch(() => {});
            }else{
                document.getElementById('modalImgs').innerHTML = '<p>画像ロード中...</p>';  
                var stocklist = "";
                prevTask = Promise.all([prevTask,storageImageRef.getDownloadURL()]).then(([_,url])=>{
                    stocklist += "<img src = " + "'" + url + "'" + "></img>";
                    document.getElementById('modalImgs').innerHTML = stocklist;
                }).catch(error => {
                }).catch(() => {});
            }

            //送信ボタン生成
            document.getElementById('modalImgButton').innerHTML = '<button type="submit" class="btn btn-success" onclick="modalImgUpdate(\''+id+'\')">送信する</button>';
        } catch (err) {
        console.log(err);
        }

    })();
};

//画像/データ編集
function modalImgUpdate(id){
    (async () => {
        try {
            var modalImgAlert = document.getElementById('modalImgAlert');
            modalImgAlert.innerHTML = '<div class="alert alert-success" role="alert">送信中...</div>';
            var fileModal = document.getElementById('file_modal').files;
            //アップロード
            var uploadsModal = [];
            var fileTypeList = ['png','jpg','jpeg'];
            var i = 0;
            for (var file of fileModal) {
                let file_type = file.name.split('.').pop();
                //拡張子が写真データでなければ圧縮しない
                if(fileTypeList.includes(file_type)){
                    //画像を圧縮する
                    var img = new Compressor(file, {
                        quality: 0.5,
                        success(result) {
                            console.log('圧縮完了');
                            fileListEdit[i] = result;
                            var storageRefModal = firebase.storage().ref('shopPOPDemand/' + id + '/uploadData');
                            storageRefModal.put(fileListEdit[i]).then(function(){
                                console.log('アップロード完了');
                                modalImgAlert.innerHTML = '<div class="alert alert-success" role="alert">追加完了!リロードします。</div>';
                                setTimeout("location.reload()",2000);
                            })
                            console.log(fileListEdit[i]);
                            i += 1;
                        },
                        maxWidth:1000,
                        maxHeight: 400,
                        mimeType: 'image/png'
                    });
                }else{
                    var storageRefModal = firebase.storage().ref('shopPOPDemand/' + id + '/uploadData');
                    storageRefModal.put(fileListEdit[i]).then(function(){
                        console.log('アップロード完了');
                        modalImgAlert.innerHTML = '<div class="alert alert-success" role="alert">追加完了!リロードします。</div>';
                        setTimeout("location.reload()",2000);
                    })
                    console.log(fileListEdit[i]);
                    i += 1;
                }
            }
        } catch (err) {
        console.log(err)
        }
    })();
}


//削除
function deleteContent(id,title){
    var res = window.confirm("タイトル：" + title + "の内容を削除しますか？");
    if( res ) {
        (async () => {
            try {
                //削除するフォルダへの参照を作成
                var storageImageRef = firebase.storage().ref('/shopPOPDemand/' + id + '/' + 'uploadData');
                storageImageRef.delete();
                //firestoreを削除
                db.collection('shopPOPDemand').doc(id).delete();
                alert("削除されました。");
                setTimeout("location.reload()",500);
            } catch (err) {
            console.log(err);
            }
    
        })();
    }
    else {
        // キャンセルならアラートボックスを表示
        alert("キャンセルしました。");
    } 
};

// //pdf出力
// function createPDF(){
//     //依頼区分
//     var orderCategory = document.getElementById('order_category').value;
//     //依頼日
//     var orderDate = document.getElementById('order_date').value;
//     //納品日
//     var preferredDate = document.getElementById('preferred_date').value;
//     //店舗名
//     var storeName = document.getElementById('store_name').value;
//     //依頼者氏名
//     var requesterName = document.getElementById('requester_name').value;
//     //件名
//     var subject = document.getElementById('subject').value;
//     //出力
//     var output = document.getElementById('output').value;
//     //加工
//     var processing = document.getElementById('processing').value;
//     //枚数
//     var number = document.getElementById('number').value;
//     //webサイト
//     var WebSite = document.getElementById('website').value;
//     //サイズ
//     var sizeCheckBox = document.getElementById('size_checkBox').value;
//     var sizeDerection = document.getElementById('size_derection').value;
//     var horizontal = document.getElementById('horizontal').value;
//     var vertical = document.getElementById('vertical').value;
//     var coveringFare = document.getElementById('covering_fare').value;
//     //要望詳細
//     var demandDetail = document.getElementById('demand_detail').value;

//     if(sizeCheckBox == ''){
//         var size = '縦' + horizontal + 'mm × 横' + vertical + 'mm + 貼り代' + coveringFare + 'mm';
//     }else{
//         var size = sizeCheckBox + ' ' + sizeDerection;
//     }

// //要望詳細の1行の文字数を指定
// var textLimit = 34;//ここだけ設定
// var tmp = demandDetail.split("\n");

// var kaigyouBody = [];


// for (var key in tmp) {

//     if(tmp[key] != ""){

//         if(tmp[key].length >= textLimit){

//             let oneSplit = tmp[key].split('');
//             let oneBody = [];

//             for (var key2 in oneSplit) {

//             //key2 1文字目でなく、さらに textLimit の倍数の数値なら改行コードを挿入
//             if(key2 != 0 && key2%textLimit == 0){
//                 oneBody.push("\n");
//             }

//             oneBody.push(oneSplit[key2]);

//         }

//             kaigyouBody.push(oneBody.join(""));

//         } else {
//             kaigyouBody.push(tmp[key]);
//         }

//     }

// }


// var demandDetail = kaigyouBody.join("\n");

// console.log(demandDetail);


//     //日本語フォント読み込み
//     pdfMake.fonts = {
//         GenShin: {
//         normal: 'GenShinGothic-Normal-Sub.ttf',
//         bold: 'GenShinGothic-Normal-Sub.ttf',
//         italics: 'GenShinGothic-Normal-Sub.ttf',
//         bolditalics: 'GenShinGothic-Normal-Sub.ttf'
//         }
//     };

//     if(orderCategory == "POP"){
//         //PDF作成処理
//         var docDef = {
//             content: [
//                 {
//                     columns: [
//                         {
//                             width: 'auto',
//                             text:  orderCategory + '要望',
//                             fontSize: 25
//                         },
//                         {
//                             width: '*',
//                             text: '所属長印',
//                             style: ['center','border'],
//                             fontSize: 20
//                         }
//                     ],
//                     columnGap: 10
//                 },
//                 {
//                     table: {
//                         headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
//                         widths: ['*', '*',220,'*'],
//                         body: [
//                             ['依頼日', '納品日', '店舗名','依頼者氏名'],
//                             [{text:orderDate,fontSize:15},{text:preferredDate,fontSize:15},{text:storeName,fontSize:15},{text:requesterName,fontSize:15}],
//                         ]
//                     }
//                 },
//                 {
//                     table: {
//                         headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
//                         widths: [50, '*'],
//                         body: [
//                             ['件名',{text:subject,fontSize:15}],
//                             ['サイズ',{text:size,fontSize:20}]
//                         ]
//                     }
//                 },
//                 {
//                     table: {
//                         headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
//                         widths: ['*', '*', '*'],
//                         body: [
//                             ['出力', '加工', '枚数'],
//                             [{text:output,fontSize:20},{text:processing,fontSize:20},{text:number,fontSize:20}]
//                         ]
//                     }
//                 },
//                 {
//                     table: {
//                         headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
//                         widths: ['*'],
//                         body: [
//                             ['要望詳細'],
//                             [{text:demandDetail,fontSize:15}]
//                         ]
//                     }
//                 },
//             ],
//             styles:{
//                 center:{
//                     alignment: 'center'
//                 },
//                 border:{
//                     decorationStyle:'dashed'
//                 }
//             },
//             defaultStyle: {
//                 font: 'GenShin',
//             },
//         };
//     }else{
//         //PDF作成処理
//         var docDef = {
//             content: [
//                 {
//                     columns: [
//                         {
//                             width: 'auto',
//                             text:  orderCategory + '要望',
//                             fontSize: 25
//                         },
//                         {
//                             width: '*',
//                             text: '所属長印',
//                             style: ['center','border'],
//                             fontSize: 20
//                         }
//                     ],
//                     columnGap: 10
//                 },
//                 {
//                     table: {
//                         headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
//                         widths: ['*', '*',220,'*'],
//                         body: [
//                             ['依頼日', '納品日', '店舗名','依頼者氏名'],
//                             [{text:orderDate,fontSize:15},{text:preferredDate,fontSize:15},{text:storeName,fontSize:15},{text:requesterName,fontSize:15}],
//                         ]
//                     }
//                 },
//                 {
//                     table: {
//                         headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
//                         widths: [60, '*'],
//                         body: [
//                             ['件名',{text:subject,fontSize:15}]
//                         ]
//                     }
//                 },
//                 {
//                     table: {
//                         headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
//                         widths: [60, '*'],
//                         body: [
//                             ['Webサイト',{text:WebSite,fontSize:15}]
//                         ]
//                     }
//                 },
//                 {
//                     table: {
//                         headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
//                         widths: ['*'],
//                         body: [
//                             ['要望詳細'],
//                             [{text:demandDetail,fontSize:15}]
//                         ]
//                     }
//                 },
//             ],
//             styles:{
//                 center:{
//                     alignment: 'center'
//                 },
//                 border:{
//                     decorationStyle:'dashed'
//                 }
//             },
//             defaultStyle: {
//                 font: 'GenShin',
//             },
//         };
//     }
    
//     pdfMake.createPdf(docDef).download(orderCategory + "要望.pdf");
// }

// //PDF作成
// function createPDF(id){
//     (async () => {
//       try {
//         const carrentpopDemandDB = await db.collection('POPDemands').doc(id).get();
//         //依頼区分
//         var orderCategory = carrentpopDemandDB.get('orderCategory');
//         //依頼日
//         var orderDate = carrentpopDemandDB.get('orderDate');
//         //納品日
//         var preferredDate = carrentpopDemandDB.get('preferredDate');
//         //店舗名
//         var storeName = carrentpopDemandDB.get('storeName');
//         //依頼者氏名
//         var requesterName = carrentpopDemandDB.get('requesterName');
//         //件名
//         var subject = carrentpopDemandDB.get('subject');
//         //要望詳細
//         var demandDetail = carrentpopDemandDB.get('demandDetail');
  
//         if(orderCategory == "web"){
//           //webサイト
//           var WebSite = carrentpopDemandDB.get('WebSite');
//         }else{
//           //出力
//           var output = carrentpopDemandDB.get('output');
//           //加工
//           var processing = carrentpopDemandDB.get('processing');
//           //枚数
//           var number = carrentpopDemandDB.get('number');
//           //サイズ
//           var sizeCheckBox = carrentpopDemandDB.get('sizeCheckBox');
//           var sizeDerection = carrentpopDemandDB.get('sizeDerection');
//           var horizontal = carrentpopDemandDB.get('horizontal');
//           var vertical = carrentpopDemandDB.get('vertical');
//           var coveringFare = carrentpopDemandDB.get('coveringFare');
//           if(sizeCheckBox == ''){
//             var size = '縦' + horizontal + 'mm × 横' + vertical + 'mm + 貼り代' + coveringFare + 'mm';
//           }else{
//               var size = sizeCheckBox + ' ' + sizeDerection;
//           }
//         }
  
//         //要望詳細の1行の文字数を指定
//         var textLimit = 34;//ここだけ設定
//         var tmp = demandDetail.split("\n");
  
//         var kaigyouBody = [];
  
  
//         for (var key in tmp) {
  
//             if(tmp[key] != ""){
  
//                 if(tmp[key].length >= textLimit){
  
//                     let oneSplit = tmp[key].split('');
//                     let oneBody = [];
  
//                     for (var key2 in oneSplit) {
  
//                     //key2 1文字目でなく、さらに textLimit の倍数の数値なら改行コードを挿入
//                     if(key2 != 0 && key2%textLimit == 0){
//                         oneBody.push("\n");
//                     }
  
//                     oneBody.push(oneSplit[key2]);
  
//                 }
  
//                     kaigyouBody.push(oneBody.join(""));
  
//                 } else {
//                     kaigyouBody.push(tmp[key]);
//                 }
  
//             }
  
//         }
  
  
//         var demandDetail = kaigyouBody.join("\n");
  
//         console.log(demandDetail);
  
  
//             //日本語フォント読み込み
//             pdfMake.fonts = {
//                 GenShin: {
//                 normal: 'GenShinGothic-Normal-Sub.ttf',
//                 bold: 'GenShinGothic-Normal-Sub.ttf',
//                 italics: 'GenShinGothic-Normal-Sub.ttf',
//                 bolditalics: 'GenShinGothic-Normal-Sub.ttf'
//                 }
//             };
  
//             if(orderCategory == "POP"){
//                 //PDF作成処理
//                 var docDef = {
//                     content: [
//                         {
//                             columns: [
//                                 {
//                                     width: 'auto',
//                                     text:  orderCategory + '要望',
//                                     fontSize: 25
//                                 },
//                                 {
//                                     width: '*',
//                                     text: '所属長印',
//                                     style: ['center','border'],
//                                     fontSize: 20
//                                 }
//                             ],
//                             columnGap: 10
//                         },
//                         {
//                           columns: [
//                               {
//                                   width: '*',
//                                   height:100,
//                                   text: ' ',
//                                   style: ['center'],
//                                   fontSize: 10
//                               }
//                           ],
//                           columnGap: 10
//                         },
//                         {
//                             table: {
//                                 headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
//                                 widths: ['*', '*',220,'*'],
//                                 body: [
//                                     ['依頼日', '納品日', '店舗名','依頼者氏名'],
//                                     [{text:orderDate,fontSize:15},{text:preferredDate,fontSize:15},{text:storeName,fontSize:15},{text:requesterName,fontSize:15}],
//                                 ]
//                             }
//                         },
//                         {
//                           columns: [
//                               {
//                                   width: '*',
//                                   height:100,
//                                   text: ' ',
//                                   style: ['center'],
//                                   fontSize: 10
//                               }
//                           ],
//                           columnGap: 10
//                         },
//                         {
//                             table: {
//                                 headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
//                                 widths: [50, '*'],
//                                 body: [
//                                     ['件名',{text:subject,fontSize:15}],
//                                     ['サイズ',{text:size,fontSize:20}]
//                                 ]
//                             }
//                         },
//                         {
//                             table: {
//                                 headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
//                                 widths: ['*', '*', '*'],
//                                 body: [
//                                     ['出力', '加工', '枚数'],
//                                     [{text:output,fontSize:20},{text:processing,fontSize:20},{text:number,fontSize:20}]
//                                 ]
//                             }
//                         },
//                         {
//                           columns: [
//                               {
//                                   width: '*',
//                                   height:100,
//                                   text: ' ',
//                                   style: ['center'],
//                                   fontSize: 10
//                               }
//                           ],
//                           columnGap: 10
//                         },
//                         {
//                             table: {
//                                 headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
//                                 widths: ['*'],
//                                 body: [
//                                     ['要望詳細'],
//                                     [{text:demandDetail,fontSize:15}]
//                                 ]
//                             }
//                         },
//                     ],
//                     styles:{
//                         center:{
//                             alignment: 'center'
//                         },
//                         border:{
//                             decorationStyle:'dashed'
//                         }
//                     },
//                     defaultStyle: {
//                         font: 'GenShin',
//                     },
//                 };
//             }else{
//                 //PDF作成処理
//                 var docDef = {
//                     content: [
//                         {
//                             columns: [
//                                 {
//                                     width: 'auto',
//                                     text:  orderCategory + '要望',
//                                     fontSize: 25
//                                 },
//                                 {
//                                     width: '*',
//                                     text: '所属長印',
//                                     style: ['center','border'],
//                                     fontSize: 20
//                                 }
//                             ],
//                             columnGap: 10
//                         },
//                         {
//                             table: {
//                                 headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
//                                 widths: ['*', '*',220,'*'],
//                                 body: [
//                                     ['依頼日', '納品日', '店舗名','依頼者氏名'],
//                                     [{text:orderDate,fontSize:15},{text:preferredDate,fontSize:15},{text:storeName,fontSize:15},{text:requesterName,fontSize:15}],
//                                 ]
//                             }
//                         },
//                         {
//                             table: {
//                                 headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
//                                 widths: [60, '*'],
//                                 body: [
//                                     ['件名',{text:subject,fontSize:15}]
//                                 ]
//                             }
//                         },
//                         {
//                             table: {
//                                 headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
//                                 widths: [60, '*'],
//                                 body: [
//                                     ['Webサイト',{text:WebSite,fontSize:15}]
//                                 ]
//                             }
//                         },
//                         {
//                             table: {
//                                 headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
//                                 widths: ['*'],
//                                 body: [
//                                     ['要望詳細'],
//                                     [{text:demandDetail,fontSize:15}]
//                                 ]
//                             }
//                         },
//                     ],
//                     styles:{
//                         center:{
//                             alignment: 'center'
//                         },
//                         border:{
//                             decorationStyle:'dashed'
//                         }
//                     },
//                     defaultStyle: {
//                         font: 'GenShin',
//                     },
//                 };
//             }
//             pdfMake.createPdf(docDef).print();
//       } catch (err) {
//       console.log(`Error: ${JSON.stringify(err)}`)
//       }
//   })();
// }