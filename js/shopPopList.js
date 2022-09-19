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

var title = document.getElementById('title');
var noticeTime = document.getElementById('notice_time');
var noticePeriod = document.getElementById('notice_period');
var storename = document.getElementById('addstoreList');
var size = document.getElementById('size');
var demandDetail = document.getElementById('demand_detail');
//写真データ
var fileList = [];
var fileNameList = [];
var files = document.getElementById('file').files;
var collectAlert = document.getElementById('collectAlert');

//追加
function shopPopDemandUpdate(){
    collectAlert.innerHTML = '<div class="alert alert-success" role="alert">送信中...</div>';
    (async () => {
        try{
            if(storename != "" || files != ""){
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
            }else{
                collectAlert.innerHTML = '<div class="alert alert-danger" role="alert">店舗名と写真添付は必須項目です。</div>';
            }
        } catch(err){

        }
    })();
}

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
console.log(searchParams);
if(getParam('storename')){
    showDB(getParam('storename'));
}else{
    showDB(false);
}

//DB表示
function showDB(storename){
    (async () => {
        try {
          // 省略 
          // (Cloud Firestoreのインスタンスを初期化してdbにセット)

          if(storename){
              var query = await db.collection('POPDemands').where('storeName','==',storename).orderBy('CreatedAt', 'desc'); 
          }else{
              var query = await db.collection('POPDemands').orderBy('CreatedAt', 'desc'); 
          }
      
          var querySnapshot = await query.get();
    
          var i = 0;
          var stocklist = '<table class="table table-striped" id="download_table">'
          stocklist += '<tr><th>区分</th><th>依頼日</th><th>納品日</th><th>店舗名</th><th>件名</th><th>状況</th><th>依頼者</th><th>対応者</th><th>編集</th></tr>';
          querySnapshot.forEach((postDoc) => {
            switch(postDoc.get('status')){
              case '完了':
                  stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('orderCategory') +'</td><td>' + postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('orderDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('subject') + '</td><td>'+ postDoc.get('status') +'</td><td>' + postDoc.get('requesterName') + '</td><td>'+ postDoc.get('supportPerson') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open2"><button class="btn btn-primary" onclick="modalImages(\''+postDoc.id+'\')">画像/データ</button></a><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) +'\')">削除</button></td></tr></tbody>';
                  break;
              case '依頼中':
                  stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('orderCategory') +'</td><td>' + postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('orderDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('subject') + '</td><td>'+ postDoc.get('status') +'</td><td>' + postDoc.get('requesterName') + '</td><td>'+ postDoc.get('supportPerson') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open2"><button class="btn btn-primary" onclick="modalImages(\''+postDoc.id+'\')">画像/データ</button></a><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) +'\')">削除</button></td></tr></tbody>';
                  break;
              default:
                  stocklist += '<tbody><tr><td>'+ postDoc.get('orderCategory') +'</td><td>' + postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('orderDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('subject') + '</td><td>'+ postDoc.get('status') +'</td><td>' + postDoc.get('requesterName') + '</td><td>'+ postDoc.get('supportPerson') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open2"><button class="btn btn-primary" onclick="modalImages(\''+postDoc.id+'\')">画像/データ</button></a><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) +'\')">削除</button></td></tr></tbody>';
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

//Status編集用モーダルウィンドウ
function editStatus(id){
    (async () => {
      try {
          const carrentpopDemandDB = await db.collection('POPDemands').doc(id).get();
          //依頼区分
          document.getElementById('orderCategory_edit').textContent = carrentpopDemandDB.get('orderCategory');
          //依頼日
          document.getElementById('createdAt_edit').textContent = carrentpopDemandDB.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'});
          //納品日
          document.getElementById('preferredDate_edit').value = carrentpopDemandDB.get('preferredDate');
          //店舗名
          document.getElementById('store_name_edit').textContent = carrentpopDemandDB.get('storeName');
          //件名
          if(carrentpopDemandDB.get('subject') == null){
              document.getElementById('subject_edit').value = '';
          }else{
              document.getElementById('subject_edit').value = carrentpopDemandDB.get('subject');
          }
          //依頼者氏名
          if(carrentpopDemandDB.get('requesterName') == null){
              document.getElementById('requesterName_edit').value = '';
          }else{
              document.getElementById('requesterName_edit').value = carrentpopDemandDB.get('requesterName');
          }
          //状況
          var status_elements = document.getElementById('status_edit');
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
          //対応者氏名
          if(carrentpopDemandDB.get('supportPerson') == null){
              document.getElementById('supportPerson_edit').value = '';
          }else{
              document.getElementById('supportPerson_edit').value = carrentpopDemandDB.get('supportPerson');
          }

          //要望詳細
          if(carrentpopDemandDB.get('demandDetail') == null){
            document.getElementById('demand_detail_edit').value = '';
          }else{
            document.getElementById('demand_detail_edit').value = carrentpopDemandDB.get('demandDetail');
          }

          //依頼区分によって項目を変える
          if(carrentpopDemandDB.get('orderCategory') == 'Web'){
            document.getElementById('pop_edit').style.display = "none";
            document.getElementById('web_edit').style.display = "";
            //webサイト
            var web = document.getElementById('website_edit');
            switch(carrentpopDemandDB.get('WebSite')){
                case '公式HP':
                    web.options[1].selected = true;
                break;
                case 'ハピホテ':
                    web.options[2].selected = true;
                break;
                case 'カップルズ':
                    web.options[3].selected = true;
                break;
                case '予約サイト':
                    web.options[4].selected = true;
                break;
                case 'twitter':
                    web.options[5].selected = true;
                default:break;        

            }
          }else{
              document.getElementById('web_edit').style.display = "none";
              document.getElementById('pop_edit').style.display = "";
              //出力
              var output = document.getElementById('output_edit');
              switch(carrentpopDemandDB.get('output')){
                  case '塩ビシート(看板)':
                      output.options[1].selected = true;
                      break;
                  case '内照シート(看板)':
                      output.options[2].selected = true;
                      break;
                  case '普通紙':
                      output.options[3].selected = true;
                      break;
                  case '内照紙':
                      output.options[4].selected = true;
                      break;
                  case 'シール紙':
                      output.options[5].selected = true;   
                      break;
                  case 'その他':
                      output.options[6].selected = true;    
                  default:break;                 
              }
              //加工
              var processing = document.getElementById('processing_edit');
              switch(carrentpopDemandDB.get('processing')){
                  case 'グロス':
                      processing.options[1].selected = true;
                      break;
                  case 'マット':
                      processing.options[2].selected = true;  
                      break;  
                  default:break;         
              }
              //枚数
              if(carrentpopDemandDB.get('number') == null){
                  document.getElementById('number_edit').value = '';
              }else{
                document.getElementById('number_edit').value = carrentpopDemandDB.get('number');
              }
              //サイズ
              var sizeCheckBox = document.getElementById('size_checkBox_edit');
              switch(carrentpopDemandDB.get('sizeCheckBox')){
                  case '名刺サイズ':
                      sizeCheckBox.options[1].selected = true;
                      break;
                  case 'A6':
                      sizeCheckBox.options[2].selected = true;
                      break;
                  case 'A5':
                      sizeCheckBox.options[3].selected = true;
                      break;
                  case 'A4':
                      sizeCheckBox.options[4].selected = true;
                      break;       
                  case 'A3':
                      sizeCheckBox.options[5].selected = true;
                      break;    
                  case 'A3':
                      sizeCheckBox.options[6].selected = true;
                      break; 
                  default:break;           
              }
              //向き
              var sizeDerection = document.getElementById('size_derection_edit');
              switch(carrentpopDemandDB.get('sizeDerection')){
                  case '縦':
                      sizeDerection.options[1].selected = true;
                      break;
                  case '横':
                      sizeDerection.options[2].selected = true;
                      break;
                  default:break;     
              }
              //横
              if(carrentpopDemandDB.get('horizontal') == null){
                document.getElementById('horizontal_edit').value = '';
              }else{
                document.getElementById('horizontal_edit').value = carrentpopDemandDB.get('horizontal');
              }
              //縦
              if(carrentpopDemandDB.get('vertical') == null){
                document.getElementById('vertical_edit').value = '';
              }else{
                document.getElementById('vertical_edit').value = carrentpopDemandDB.get('vertical');
              }
              //貼り代
              if(carrentpopDemandDB.get('coveringFare') == null){
                document.getElementById('covering_fare_edit').value = '';
              }else{
                document.getElementById('covering_fare_edit').value = carrentpopDemandDB.get('coveringFare');
              }
          }
          //編集送信ボタン生成
          document.getElementById('edit_submit_button').innerHTML = '<button type="submit" class="btn btn-success" onclick="EditUpdate(\''+id+'\')">送信する</button>';
  
      } catch (err) {
      console.log(err)
      }
  })();
}

//status編集
function EditUpdate(id){
    var collectAlert = document.getElementById('collectAlert_edit');
    //納品日
    var preferredDate = document.getElementById('preferredDate_edit').value;
    //件名
    var subject = document.getElementById('subject_edit').value;
    //要望詳細
    var demandDetail = document.getElementById('demand_detail_edit').value;
    //状況
    var status = document.getElementById('status_edit').value;
    //依頼者
    var requesterName = document.getElementById('requesterName_edit').value;
    //対応者
    var supportPerson = document.getElementById('supportPerson_edit').value;
    //依頼区分によって項目を変える
    if(document.getElementById('orderCategory') == "web_edit"){
        var WebSite = document.getElementById('website_edit').value;
        //DBへ送信
        db.collection('POPDemands').doc(id).update({
            preferredDate:preferredDate,
            requesterName:requesterName,
            subject:subject,
            WebSite:WebSite,
            demandDetail:demandDetail,
            status:status,
            supportPerson:supportPerson,
        });
        collectAlert.innerHTML = '<div class="alert alert-success" role="alert">保存が完了しました</div>';
        setTimeout("location.reload()",2000);
    }else{
        //出力
        var output = document.getElementById('output_edit').value;
        //加工
        var processing = document.getElementById('processing_edit').value;
        //枚数
        var number = document.getElementById('number_edit').value;
        //サイズ
        var sizeCheckBox = document.getElementById('size_checkBox_edit').value;
        //向き
        var sizeDerection = document.getElementById('size_derection_edit').value;
        //横
        var horizontal = document.getElementById('horizontal_edit').value;
        //縦
        var vertical = document.getElementById('vertical_edit').value;
        //張り紙
        var coveringFare = document.getElementById('covering_fare_edit').value;
        //DBへ送信
        db.collection('POPDemands').doc(id).update({
            preferredDate:preferredDate,
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
            status:status,
            supportPerson:supportPerson,
        });    
        collectAlert.innerHTML = '<div class="alert alert-success" role="alert">保存が完了しました</div>';
        setTimeout("location.reload()",2000);
    }
}

//画像/データモーダル
function modalImages(id){
    console.log(id);
    var prevTask = Promise.resolve;
    (async () => {
        try { 
            const querySnapshot = await db.collection('POPDemands').doc(id).get();
            //写真の枚数を取得
            var photoCount = querySnapshot.get('photoCount');
            if(photoCount == 0 || photoCount == null){
                document.getElementById('modalImgs').innerHTML = '<p>画像/データファイルはありません。</p>';     
            }else{
                if(querySnapshot.get('orderCategory') == 'POP'){
                    //POPの時は写真を出す
                    document.getElementById('modalImgs').innerHTML = '<p>画像ロード中...</p>';  
                    var stocklist = "";
                    for(var i = 0; i < photoCount; i++){
                        var storageImageRef = firebase.storage().ref('/POPDemand/' + id + '/' + 'uploadImage' + i);
                        prevTask = Promise.all([prevTask,storageImageRef.getDownloadURL()]).then(([_,url])=>{
                            stocklist += "<img src = " + "'" + url + "'" + "></img>";
                            document.getElementById('modalImgs').innerHTML = stocklist;
                        }).catch(error => {
                        }).catch(() => {});
                    }
                }else{
                    //Webの時はaタグを羅列
                    document.getElementById('modalImgs').innerHTML = '<p>データリストをロード中...</p>';  
                    var stocklist = "";
                    for(var i = 0; i < photoCount; i++){
                        var storagefileRef = firebase.storage().ref('/POPDemand/' + id + '/' + 'uploadfile' + i);
                        prevTask = Promise.all([prevTask,storagefileRef.getDownloadURL()]).then(([_,url])=>{
                            stocklist += "<a href = " + "'" + url + "' target='_blank'" + "><p>データ</p></a>";
                            document.getElementById('modalImgs').innerHTML = stocklist;
                        }).catch(error => {
                        }).catch(() => {});
                    }
                }
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
            const carrentpopDemandDB = await db.collection('POPDemands').doc(id).get();
            var orderCategory = carrentpopDemandDB.get('orderCategory');
            var modalImgAlert = document.getElementById('modalImgAlert');
            modalImgAlert.innerHTML = '<div class="alert alert-success" role="alert">送信中...</div>';
            //写真データ
            var fileList = [];
            var fileNameList = [];
            
            switch(orderCategory){
                case 'POP':    
                    //写真アップロード
                    var uploads = [];
                    var i = 0;
                    //画像を配列に配置
                    var files = document.getElementById('file_modal').files;
                    for (let file of files) {
                        if(fileNameList.includes(file.name)){
        
                        }else{
                            fileList.push(file);
                            fileNameList.push(file.name);
                            console.log(fileList);
                        }
                    }
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
                        var storageRef = firebase.storage().ref('POPDemand/' + id + '/' + 'uploadImage' + i);
                        uploads.push(storageRef.put(fileList[i])); 
                        i += 1;
                    }
                    //すべての画像のアップロード完了を待つ
                    Promise.all(uploads).then(function () {
                        (async () => {
                            try{
                                console.log('アップロード完了');
                                modalImgAlert.innerHTML = '<div class="alert alert-success" role="alert">追加完了!リロードします。</div>';
                                setTimeout("location.reload()",2000);
                            } catch(err){
        
                            }
                        })();
                    });
                    break;
                case 'Web':
                    //storageへアップロード
                    var uploads = [];
                    var i = 0;
                    //ファイルを配列に配置
                    var files = document.getElementById('file_modal').files;
                    for (let file of files) {
                        if(fileNameList.includes(file.name)){
        
                        }else{
                            fileList.push(file);
                            fileNameList.push(file.name);
                            console.log(fileList);
                        }
                    }
                    for (var file of fileList) {
                        var storageRef = firebase.storage().ref('POPDemand/' + id + '/' + 'uploadfile' + i);
                        uploads.push(storageRef.put(fileList[i])); 
                        i += 1;
                    }
                    //すべての画像のアップロード完了を待つ
                    Promise.all(uploads).then(function () {
                        (async () => {
                            try{
                                console.log('アップロード完了');
                                modalImgAlert.innerHTML = '<div class="alert alert-success" role="alert">編集完了!リロードします。</div>';
                                setTimeout("location.reload()",2000);
                            } catch(err){
        
                            }
                        })();
                    });
                    break;
                default:break;    
            }
        } catch (err) {
        console.log(err)
        }
    })();
}


//削除
function deleteContent(id,date){
    var res = window.confirm(date + "の内容を削除しますか？");
    if( res ) {
        (async () => {
            try {
                const carrentDB = await db.collection('POPDemands').doc(id).get();
                if(carrentDB.get('photoCount') == 0 || carrentDB.get('photoCount') == undefined){

                }else{
                    for(var i = 0;i < carrentDB.get('photoCount');i++){
                        //削除するフォルダへの参照を作成
                        var storageImageRef = firebase.storage().ref('/POPDemand/' + id + '/' + 'uploadImage' + i);
                        storageImageRef.delete();
                    }
                }
                //firestoreを削除
                db.collection('POPDemands').doc(id).delete();
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
  
        if(orderCategory == "web"){
          //webサイト
          var WebSite = carrentpopDemandDB.get('WebSite');
        }else{
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
                                widths: ['*', '*',220,'*'],
                                body: [
                                    ['依頼日', '納品日', '店舗名','依頼者氏名'],
                                    [{text:orderDate,fontSize:15},{text:preferredDate,fontSize:15},{text:storeName,fontSize:15},{text:requesterName,fontSize:15}],
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
            pdfMake.createPdf(docDef).print();
      } catch (err) {
      console.log(`Error: ${JSON.stringify(err)}`)
      }
  })();
  }