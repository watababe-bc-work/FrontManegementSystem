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

//DB初期値等
var query="";
var querySnapshot="";
var currentQuerySnapshot = "";
var currentQueryList = [];
var reloadQuery = "";
var reloadQuerySnapshot = "";
document.getElementById('prevButton').style.visibility = 'hidden';
document.getElementById('prevButton_bottom').style.visibility = 'hidden';
var ImagePrevTask = Promise.resolve;
var contentIndexCarrent = 0;

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
var storename = document.getElementById('addstoreList');
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
                var pdfs = document.getElementById('pdf').files;
                //画像・PDFを配列に配置
                for (let file of files) {
                    //画像
                    fileList.push(file);
                    fileNameList.push(file.name);
                }
                for (let pdf of pdfs) {
                    //PDF
                    fileList.push(pdf);
                    fileNameList.push(pdf.name);
                    console.log(pdf.name);
                }
                //DBへ送信
                var res = await db.collection('shopPOPDemand').add({
                    title:title.value,
                    noticeTime:noticeTime.value,
                    storename:storeList,
                    demandDetail:demandDetail.value,
                    CreatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    isPDF: false,
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
                        var storageRef = firebase.storage().ref('shopPOPDemand/' + res.id + '/uploadData');
                        uploads.push(storageRef.put(fileList[i])); 
                        i += 1;
                    }else{
                        db.collection('shopPOPDemand').doc(res.id).update({
                            isPDF:true
                        });
                        var storageRef = firebase.storage().ref('shopPOPDemand/' + res.id + '/uploadPDF');
                        uploads.push(storageRef.put(fileList[i])); 
                        i += 1;
                    }
                }
                //すべての画像・PDFのアップロード完了を待つ
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
            if(storename){
                query = await db.collection('shopPOPDemand').where('storename','array-contains-any',[storename,'全店共通']).orderBy('CreatedAt', 'desc').limit(15); 
                //DB情報を保持しておく
                currentQueryList.push(querySnapshot);
            }else{
                query = await db.collection('shopPOPDemand').orderBy('CreatedAt', 'desc').limit(15); 
            }
            querySnapshot = await query.get();

            var stocklist = "";
            contentIndexCarrent = 0;
            querySnapshot.forEach((postDoc) => {
                const imageStorageRef = firebase.storage().ref('/shopPOPDemand/' + postDoc.id + "/uploadData");
                ImagePrevTask = Promise.all([ImagePrevTask,imageStorageRef.getDownloadURL()]).then(([_,imageurl])=>{
                    if(postDoc.get('isPDF') == true){
                        contentIndexCarrent += 1 ;
                        stocklist += '<div class="contents-item"><div class="contents-title"><p class="contents-title-num">' + contentIndexCarrent + '</p><p class="contents-title-text">' + postDoc.get('title') + '</p></div><img src = "'+ imageurl +'"><table><tbody><tr><th>掲載店舗</th><td>'+ postDoc.get('storename') +'</td></tr><tr><th>掲示日時</th><td>'+ postDoc.get('noticeTime') +'</td></tr><tr><th>要望詳細</th><td>'+ postDoc.get('demandDetail') +'</td></tr></tbody></table><div id="editButton"><button class="btn btn-success" onclick="showPDF(\''+postDoc.id+'\')">PDF</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><div class="dropdown"> <button class="btn btn-danger dropdown-toggle" type="button" data-toggle="dropdown">削除</button><ul class="dropdown-menu" role="menu"><li role="presentation"><button onclick="deletePDF(\''+postDoc.id+'\',\''+ postDoc.get('title') +'\')">PDFのみを削除</button></li><li role="presentation"><button onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('title') +'\')">全削除</button></li></ul></div></div></div>';
                        document.getElementById('contents').innerHTML = stocklist;
                    }else{
                        contentIndexCarrent += 1 ;
                        stocklist += '<div class="contents-item"><div class="contents-title"><p class="contents-title-num">' + contentIndexCarrent + '</p><p class="contents-title-text">' + postDoc.get('title') + '</p></div><img src = "'+ imageurl +'"><table><tbody><tr><th>掲載店舗</th><td>'+ postDoc.get('storename') +'</td></tr><tr><th>掲示日時</th><td>'+ postDoc.get('noticeTime') +'</td></tr><tr><th>要望詳細</th><td>'+ postDoc.get('demandDetail') +'</td></tr></tbody></table><div id="editButton"><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('title') +'\')">削除</button></div></div>';
                        document.getElementById('contents').innerHTML = stocklist;
                    }
                }).catch(error => {
                    console.log(error);
                })
            });
        } catch (err) {
        console.log(err);
        }
    })();
}

//次へ
function nextPegination(){
    document.getElementById('prevButton').style.visibility = 'visible';
    document.getElementById('prevButton_bottom').style.visibility = 'visible';
    (async () => {
        try {
            //DB情報を保持しておく
            currentQueryList.push(querySnapshot);

            query = query.limit(15).startAfter(querySnapshot.docs[14]);
            querySnapshot = await query.get();

            //後が無い場合に非表示
            if(querySnapshot.docs.length < 15){
                document.getElementById('nextButton').style.visibility = "hidden";
                document.getElementById('nextButton_bottom').style.visibility = "hidden";
            }

            var stocklist = "";
            querySnapshot.forEach((postDoc) => {
                const imageStorageRef = firebase.storage().ref('/shopPOPDemand/' + postDoc.id + "/uploadData");
                ImagePrevTask = Promise.all([ImagePrevTask,imageStorageRef.getDownloadURL()]).then(([_,imageurl])=>{
                    if(postDoc.get('isPDF') == true){
                        contentIndexCarrent += 1 ;
                        stocklist += '<div class="contents-item"><div class="contents-title"><p class="contents-title-num">' + contentIndexCarrent + '</p><p class="contents-title-text">' + postDoc.get('title') + '</p></div><img src = "'+ imageurl +'"><table><tbody><tr><th>掲載店舗</th><td>'+ postDoc.get('storename') +'</td></tr><tr><th>掲示日時</th><td>'+ postDoc.get('noticeTime') +'</td></tr><tr><th>要望詳細</th><td>'+ postDoc.get('demandDetail') +'</td></tr></tbody></table><div id="editButton"><button class="btn btn-success" onclick="showPDF(\''+postDoc.id+'\')">PDF</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><div class="dropdown"> <button class="btn btn-danger dropdown-toggle" type="button" data-toggle="dropdown">削除</button><ul class="dropdown-menu" role="menu"><li role="presentation"><button onclick="deletePDF(\''+postDoc.id+'\',\''+ postDoc.get('title') +'\')">PDFのみを削除</button></li><li role="presentation"><button onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('title') +'\')">全削除</button></li></ul></div></div></div>';
                        document.getElementById('contents').innerHTML = stocklist;
                    }else{
                        contentIndexCarrent += 1 ;
                        stocklist += '<div class="contents-item"><div class="contents-title"><p class="contents-title-num">' + contentIndexCarrent + '</p><p class="contents-title-text">' + postDoc.get('title') + '</p></div><img src = "'+ imageurl +'"><table><tbody><tr><th>掲載店舗</th><td>'+ postDoc.get('storename') +'</td></tr><tr><th>掲示日時</th><td>'+ postDoc.get('noticeTime') +'</td></tr><tr><th>要望詳細</th><td>'+ postDoc.get('demandDetail') +'</td></tr></tbody></table><div id="editButton"><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('title') +'\')">削除</button></div></div>';
                        document.getElementById('contents').innerHTML = stocklist;
                    }
                }).catch(error => {
                    console.log(error);
                })
            });
        } catch (err) {
            console.log(err);
        }
    })();
}

//前のテーブルを表示(戻るボタン)
function returnTable(){
    document.getElementById('nextButton').style.visibility = 'visible';
    document.getElementById('nextButton_bottom').style.visibility = 'visible';
    //index番号を調整するための計算式
    contentIndexCarrent = contentIndexCarrent - (15 + querySnapshot.docs.length);

    querySnapshot = currentQueryList.pop();   
    var stocklist = "";
    querySnapshot.forEach((postDoc) => {
        const imageStorageRef = firebase.storage().ref('/shopPOPDemand/' + postDoc.id + "/uploadData");
        ImagePrevTask = Promise.all([ImagePrevTask,imageStorageRef.getDownloadURL()]).then(([_,imageurl])=>{
            if(postDoc.get('isPDF') == true){
                contentIndexCarrent += 1 ;
                stocklist += '<div class="contents-item"><div class="contents-title"><p class="contents-title-num">' + contentIndexCarrent + '</p><p class="contents-title-text">' + postDoc.get('title') + '</p></div><img src = "'+ imageurl +'"><table><tbody><tr><th>掲載店舗</th><td>'+ postDoc.get('storename') +'</td></tr><tr><th>掲示日時</th><td>'+ postDoc.get('noticeTime') +'</td></tr><tr><th>要望詳細</th><td>'+ postDoc.get('demandDetail') +'</td></tr></tbody></table><div id="editButton"><button class="btn btn-success" onclick="showPDF(\''+postDoc.id+'\')">PDF</button><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><div class="dropdown"> <button class="btn btn-danger dropdown-toggle" type="button" data-toggle="dropdown">削除</button><ul class="dropdown-menu" role="menu"><li role="presentation"><button onclick="deletePDF(\''+postDoc.id+'\',\''+ postDoc.get('title') +'\')">PDFのみを削除</button></li><li role="presentation"><button onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('title') +'\')">全削除</button></li></ul></div></div></div>';
                document.getElementById('contents').innerHTML = stocklist;
            }else{
                contentIndexCarrent += 1 ;
                stocklist += '<div class="contents-item"><div class="contents-title"><p class="contents-title-num">' + contentIndexCarrent + '</p><p class="contents-title-text">' + postDoc.get('title') + '</p></div><img src = "'+ imageurl +'"><table><tbody><tr><th>掲載店舗</th><td>'+ postDoc.get('storename') +'</td></tr><tr><th>掲示日時</th><td>'+ postDoc.get('noticeTime') +'</td></tr><tr><th>要望詳細</th><td>'+ postDoc.get('demandDetail') +'</td></tr></tbody></table><div id="editButton"><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('title') +'\')">削除</button></div></div>';
                document.getElementById('contents').innerHTML = stocklist;
            }
        }).catch(error => {
            console.log(error);
        })
    });
  
    //前が無くなったら前へを非表示
    if(currentQueryList.length < 1){
        document.getElementById('prevButton').style.visibility = 'hidden';
        document.getElementById('prevButton_bottom').style.visibility = 'hidden';
    }
}

var titleEdit = document.getElementById('title_edit');
var noticeTimeEdit = document.getElementById('notice_time_edit');
var storenameEdit = document.getElementById('addstoreEditList');
var demandDetailEdit = document.getElementById('demand_detail_edit');
var addstoreEditList = document.getElementById('addstoreEditList');
var storeListEdit = [];
//写真データ
var fileListEdit = [];
var fileNameListEdit = [];
var collectAlertEdit = document.getElementById('collectAlert_edit');

//追加する店舗名リストを作成(編集)
function addStoreEdit(e){
    storeListEdit.push(e);
    console.log(storeListEdit);
    addstoreEditList.textContent = storeListEdit;
    document.getElementById('store_name_edit').value = "";
}

//編集の掲載店舗をリセット
function addStoreEditReset(){
    document.getElementById('shopPopDemandForm').onsubmit = function(){return false};
    storeListEdit.splice(0);
    addstoreEditList.textContent = '';
}

//Status編集用モーダルウィンドウ
function editStatus(id){
    (async () => {
      try {
        console.log(storeListEdit);
          const carrentpopDemandDB = await db.collection('shopPOPDemand').doc(id).get();
          //タイトル
          titleEdit.value = carrentpopDemandDB.get('title');
          //掲示日時
          noticeTimeEdit.value = carrentpopDemandDB.get('noticeTime');
          //店舗名
          storeListEdit.splice(0);
          storeListEdit = carrentpopDemandDB.get('storename');
          console.log(storeListEdit);
          addstoreEditList.textContent = storeListEdit;
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
    collectAlertEdit.innerHTML = '<div class="alert alert-success" role="alert">保存中・・・</div>';
    //DBへ送信
    db.collection('shopPOPDemand').doc(id).update({
        title:titleEdit.value,
        noticeTime:noticeTimeEdit.value,
        storename:storeListEdit,
        demandDetail:demandDetailEdit.value,
    });
    //storage写真を変更
    var i = 0;
    var fileModal = document.getElementById('file_modal').files;
    var pdfEdit = document.getElementById('pdf_edit').files;
    if(fileModal.length == 0 && pdfEdit.length == 0){
        //画像・pdfともに変更なし
        console.log('アップロード完了');
        collectAlertEdit.innerHTML = '<div class="alert alert-success" role="alert">保存が完了しました</div>';
        setTimeout("location.reload()",2000);
    }else{
        if(fileModal.length != 0 && pdfEdit.length != 0){
            //画像・pdfともに変更あり
            for (var file of fileModal) {
                //画像を圧縮する
                var img = new Compressor(file, {
                    quality: 0.5,
                    success(result) {
                        console.log('圧縮完了');
                        fileListEdit[i] = result;
                        var storageRefModal = firebase.storage().ref('shopPOPDemand/' + id + '/uploadData');
                        storageRefModal.put(fileListEdit[i]).then(function(){
                            //pdfを変更
                            var storageRefpdf = firebase.storage().ref('shopPOPDemand/' + id + '/uploadPDF');
                            storageRefpdf.put(pdfEdit[0]).then(function(){
                                db.collection('shopPOPDemand').doc(id).update({
                                    isPDF:true
                                }).then(function (){
                                    console.log('アップロード完了');
                                    collectAlertEdit.innerHTML = '<div class="alert alert-success" role="alert">保存が完了しました</div>';
                                    setTimeout("location.reload()",2000);
                                });
                            });   
                        }).catch(error => {
                            console.log(error);
                        })
                        console.log(fileListEdit[i]);
                        i += 1;
                    },
                    maxWidth:1000,
                    maxHeight: 400,
                    mimeType: 'image/png'
                });
            }
        }else if(fileModal.length != 0){
            //画像のみ変更あり
            for (var file of fileModal) {
                //画像を圧縮する
                var img = new Compressor(file, {
                    quality: 0.5,
                    success(result) {
                        console.log('圧縮完了');
                        fileListEdit[i] = result;
                        var storageRefModal = firebase.storage().ref('shopPOPDemand/' + id + '/uploadData');
                        storageRefModal.put(fileListEdit[i]).then(function(){
                            console.log('アップロード完了');
                            collectAlertEdit.innerHTML = '<div class="alert alert-success" role="alert">保存が完了しました</div>';
                            setTimeout("location.reload()",2000);
                        }).catch(error => {
                            console.log(error);
                        })
                        console.log(fileListEdit[i]);
                        i += 1;
                    },
                    maxWidth:1000,
                    maxHeight: 400,
                    mimeType: 'image/png'
                });
            }
        }else{
            //PDFのみ変更あり
            var storageRefpdf = firebase.storage().ref('shopPOPDemand/' + id + '/uploadPDF');
            storageRefpdf.put(pdfEdit[0]).then(function(){
                db.collection('shopPOPDemand').doc(id).update({
                    isPDF:true
                }).then(function (){
                    console.log('アップロード完了');
                    collectAlertEdit.innerHTML = '<div class="alert alert-success" role="alert">保存が完了しました</div>';
                    setTimeout("location.reload()",2000);
                });
            });   
        }
    }
}

//全削除
function deleteContent(id,title){
    var res = window.confirm("タイトル：" + title + "の内容を全削除しますか？");
    if( res ) {
        (async () => {
            try {
                //storageを削除
                var storageRef = firebase.storage().ref('shopPOPDemand/' + id);
                storageRef.listAll().then( (res) => {
                    res.items.forEach( (itemRef) =>  {
                        itemRef.delete();
                    });
                    //firestoreを削除
                    db.collection('shopPOPDemand').doc(id).delete().then(function(){
                        alert("削除されました。");
                        setTimeout("location.reload()",500);
                    }).catch(error => {
                        console.log(error);
                    });
                });
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

//PDFのみの削除
function deletePDF(id,title){
    var res = window.confirm("タイトル：" + title + "のPDFを削除しますか？");
    if( res ) {
        (async () => {
            try {
                //storageを削除
                firebase.storage().ref('shopPOPDemand/' + id + '/uploadPDF').delete().then(function(){
                    //firestoreのisPDFをfalseにする
                    db.collection('shopPOPDemand').doc(id).update({
                        isPDF:false
                    }).then(function (){
                        alert("削除されました。");
                        setTimeout("location.reload()",500);
                    });
                }).catch(error => {
                    console.log(error);
                });
            } catch (err) {
            console.log(err);
            }
    
        })();
    }
    else {
        // キャンセルならアラートボックスを表示
        alert("キャンセルしました。");
    } 
}

//pdf出力
function showPDF(id){
    var pdfPrevTask = Promise.resolve;
    const pdfStorageRef = firebase.storage().ref('/shopPOPDemand/' + id + "/uploadPDF");
    pdfPrevTask = Promise.all([pdfPrevTask,pdfStorageRef.getDownloadURL()]).then(([_,pdfurl])=>{
        window.open(pdfurl, '_blank');
    }).catch(error => {
        console.log(error);
    })
}