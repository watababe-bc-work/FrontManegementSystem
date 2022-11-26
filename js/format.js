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
var PhotoPrevTask = Promise.resolve;
var MetaDataPrevTask = Promise.resolve;
var contentIndexCarrent = 0;
var nowShowDB = 'PDF';

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

var title = document.getElementById('title');
var noticeTime = document.getElementById('notice_time');
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

//パラメータでのDB表示と表示DB変更用ボタン生成
const searchParams = decodeURI(window.location.search);
let DBChangeButtons = document.getElementById('DBChangeButtons');
if(getParam('storename')){
    addButton.style.display = "none";
    DBChangeButtons.innerHTML = "<button class='btn btn-success' onclick = 'showPDFDB("+ true +")'>PDF一覧を表示</button>" + "<button class='btn btn-success' onclick = 'showInPhotoDB("+ true +")'>Excel,Word一覧を表示</button>";
    showPDFDB(true);
}else{
    addButton.style.display = "";
    DBChangeButtons.innerHTML = "<button class='btn btn-success' onclick = 'showPDFDB()'>PDF一覧を表示</button>" + "<button class='btn btn-success' onclick = 'showInPhotoDB()'>Excel,Word一覧を表示</button>";
    showPDFDB(false);
}

let isPDF = false;
//追加
function formatUpdate(){
    collectAlert.innerHTML = '<div class="alert alert-success" role="alert">送信中...</div>';
    (async () => {
        try{
            var pdfs = document.getElementById('pdf').files;
            var photos = document.getElementById('photo').files;
            if(pdfs.length != 0){
                //PDFを配列に配置
                for (let pdf of pdfs) {
                    //PDF
                    fileList.push(pdf);
                    fileNameList.push(pdf.name);
                    if(pdf.name.split('.').pop() == "pdf"){
                        isPDF = true;
                        console.log(true);
                    }
                }
                //PDFファイルじゃない&写真が存在しない時
                if(isPDF == false && photos.length == 0){
                    collectAlert.innerHTML = '<div class="alert alert-danger" role="alert">PDFファイル以外を追加する際、サムネイル画像は必須です。</div>';
                }else{
                    //画像を配列に配置
                    for (let photo of photos) {
                        //画像
                        fileList.push(photo);
                        fileNameList.push(photo.name);
                    }
                    //DBへ送信
                    var res = await db.collection('format').add({
                        title:title.value,
                        noticeTime:noticeTime.value,
                        CreatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                        isPDF:isPDF
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
                            var storageRef = firebase.storage().ref('format/' + res.id + '/uploadPhoto');
                            uploads.push(storageRef.put(fileList[i])); 
                            i += 1;
                        }else{
                            var storageRef = firebase.storage().ref('format/' + res.id + '/uploadPDF');
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
                }
            }else{
                collectAlert.innerHTML = '<div class="alert alert-danger" role="alert">店舗名とファイル添付は必須項目です。</div>';
            }
        } catch(err){
            console.log(err);
        }
    })();
}

// //DB表示(ボタンでの切り替えなしver)
// function showDB(storename){
//     (async () => {
//         try {
//             query = await db.collection('format').orderBy('CreatedAt', 'desc').limit(15); 
//             querySnapshot = await query.get();
//             if(storename){
//                 var stocklist = "";
//                 contentIndexCarrent = 0;
//                 querySnapshot.forEach((postDoc) => {
//                     const imageStorageRef = firebase.storage().ref('/format/' + postDoc.id + "/uploadPDF");
//                     ImagePrevTask = Promise.all([ImagePrevTask,imageStorageRef.getDownloadURL()]).then(([_,imageurl])=>{
//                         contentIndexCarrent += 1 ;
//                         stocklist += '<div class="contents-item"><div class="contents-title"><p class="contents-title-num">' + contentIndexCarrent + '</p><p class="contents-title-text">' + postDoc.get('title') + '</p></div><iframe src = "'+ imageurl +'"></iframe><table><tbody><tr><th>掲示日時</th><td>'+ postDoc.get('noticeTime') +'</td></tr></tbody></table><div id="editButton"><a href="'+ imageurl +'" target = "_blank"><button class="btn btn-success">PDFを表示</button></a></div></div>';
//                         document.getElementById('contents').innerHTML = stocklist;
//                     }).catch(error => {
//                         console.log(error);
//                     })
//                 });
//             }else{
//                 var stocklist = "";
//                 contentIndexCarrent = 0;
//                 querySnapshot.forEach((postDoc) => {
//                     const imageStorageRef = firebase.storage().ref('/format/' + postDoc.id + "/uploadPDF");
//                     MetaDataPrevTask = Promise.all([MetaDataPrevTask,imageStorageRef.getMetadata()]).then(([_,metaData])=>{
//                         if(metaData.contentType == 'application/pdf'){
//                             ImagePrevTask = Promise.all([ImagePrevTask,imageStorageRef.getDownloadURL()]).then(([_,imageurl])=>{
//                                 console.log(postDoc.get('title'));
//                                 contentIndexCarrent += 1 ;
//                                 stocklist += '<div class="contents-item"><div class="contents-title"><p class="contents-title-num">' + contentIndexCarrent + '</p><p class="contents-title-text">' + postDoc.get('title') + '</p></div><iframe src = "'+ imageurl +'"></iframe><table><tbody><tr><th>掲示日時</th><td>'+ postDoc.get('noticeTime') +'</td></tr></tbody></table><div id="editButton"><a href="'+ imageurl +'" target = "_blank"><button class="btn btn-success">PDFを表示</button></a><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('title') +'\')">削除</button></div></div>';
//                                 document.getElementById('contents').innerHTML = stocklist;
//                                 console.log(contentIndexCarrent);
//                             }).catch(error => {
//                                 console.log(error);
//                             })
//                         }else{
//                             const PhotoStorageRef = firebase.storage().ref('/format/' + postDoc.id + "/uploadPhoto");
//                             PhotoPrevTask = Promise.all([PhotoPrevTask,PhotoStorageRef.getDownloadURL()]).then(([_,photourl])=>{
//                                 ImagePrevTask = Promise.all([ImagePrevTask,imageStorageRef.getDownloadURL()]).then(([_,imageurl])=>{
//                                     console.log(postDoc.get('title'));
//                                     contentIndexCarrent += 1 ;
//                                     stocklist += '<div class="contents-item"><div class="contents-title"><p class="contents-title-num">' + contentIndexCarrent + '</p><p class="contents-title-text">' + postDoc.get('title') + '</p></div><img src = "'+ photourl +'"><table><tbody><tr><th>掲示日時</th><td>'+ postDoc.get('noticeTime') +'</td></tr></tbody></table><div id="editButton"><a href="'+ imageurl +'" target = "_blank"><button class="btn btn-success">ファイルを保存</button></a><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('title') +'\')">削除</button></div></div>';
//                                     document.getElementById('contents').innerHTML = stocklist;
//                                     console.log(contentIndexCarrent);
//                                 }).catch(error => {
//                                     console.log(error);
//                                 })
//                             }).catch(error => {
//                                 console.log(error);
//                             })
//                         }
//                     })
//                 });
//             }

//             //後が無い場合に非表示
//             if(querySnapshot.docs.length < 15){
//                 document.getElementById('nextButton').style.visibility = "hidden";
//                 document.getElementById('nextButton_bottom').style.visibility = "hidden";
//             }

//         } catch (err) {
//         console.log(err);
//         }
//     })();
// }

//PDFのみDB表示
function showPDFDB(storename){
    (async () => {
        try {
            nowShowDB = 'PDF';
            query = await db.collection('format').orderBy('CreatedAt', 'desc').limit(15); 
            querySnapshot = await query.get();
            if(storename){
                var stocklist = "";
                contentIndexCarrent = 0;
                querySnapshot.forEach((postDoc) => {
                    const imageStorageRef = firebase.storage().ref('/format/' + postDoc.id + "/uploadPDF");
                    MetaDataPrevTask = Promise.all([MetaDataPrevTask,imageStorageRef.getMetadata()]).then(([_,metaData])=>{
                        if(metaData.contentType == 'application/pdf'){
                            ImagePrevTask = Promise.all([ImagePrevTask,imageStorageRef.getDownloadURL()]).then(([_,imageurl])=>{
                                contentIndexCarrent += 1 ;
                                stocklist += '<div class="contents-item"><div class="contents-title"><p class="contents-title-num">' + contentIndexCarrent + '</p><p class="contents-title-text">' + postDoc.get('title') + '</p></div><iframe src = "'+ imageurl +'"></iframe><table><tbody><tr><th>掲示日時</th><td>'+ postDoc.get('noticeTime') +'</td></tr></tbody></table><div id="editButton"><a href="'+ imageurl +'" target = "_blank"><button class="btn btn-success">PDFを表示</button></a></div></div>';
                                document.getElementById('contents').innerHTML = stocklist;
                            }).catch(error => {
                                console.log(error);
                            })
                        }
                    })
                });
            }else{
                var stocklist = "";
                contentIndexCarrent = 0;
                querySnapshot.forEach((postDoc) => {
                    const imageStorageRef = firebase.storage().ref('/format/' + postDoc.id + "/uploadPDF");
                    MetaDataPrevTask = Promise.all([MetaDataPrevTask,imageStorageRef.getMetadata()]).then(([_,metaData])=>{
                        if(metaData.contentType == 'application/pdf'){
                            ImagePrevTask = Promise.all([ImagePrevTask,imageStorageRef.getDownloadURL()]).then(([_,imageurl])=>{
                                contentIndexCarrent += 1 ;
                                stocklist += '<div class="contents-item"><div class="contents-title"><p class="contents-title-num">' + contentIndexCarrent + '</p><p class="contents-title-text">' + postDoc.get('title') + '</p></div><iframe src = "'+ imageurl +'"></iframe><table><tbody><tr><th>掲示日時</th><td>'+ postDoc.get('noticeTime') +'</td></tr></tbody></table><div id="editButton"><a href="'+ imageurl +'" target = "_blank"><button class="btn btn-success">PDFを表示</button></a><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('title') +'\')">削除</button></div></div>';
                                document.getElementById('contents').innerHTML = stocklist;
                            }).catch(error => {
                                console.log(error);
                            })
                        }
                    })
                });
            }

            //後が無い場合に非表示
            if(querySnapshot.docs.length < 15){
                document.getElementById('nextButton').style.visibility = "hidden";
                document.getElementById('nextButton_bottom').style.visibility = "hidden";
            }

        } catch (err) {
        console.log(err);
        }
    })();
}

//PDF以外のDB表示
function showInPhotoDB(storename){
    (async () => {
        try {
            nowShowDB = 'inPhotoDB';
            query = await db.collection('format').orderBy('CreatedAt', 'desc').limit(15); 
            querySnapshot = await query.get();
            if(storename){
                var stocklist = "";
                contentIndexCarrent = 0;
                querySnapshot.forEach((postDoc) => {
                    const imageStorageRef = firebase.storage().ref('/format/' + postDoc.id + "/uploadPDF");
                    MetaDataPrevTask = Promise.all([MetaDataPrevTask,imageStorageRef.getMetadata()]).then(([_,metaData])=>{
                        if(metaData.contentType != 'application/pdf'){
                            const PhotoStorageRef = firebase.storage().ref('/format/' + postDoc.id + "/uploadPhoto");
                            PhotoPrevTask = Promise.all([PhotoPrevTask,PhotoStorageRef.getDownloadURL()]).then(([_,photourl])=>{
                                ImagePrevTask = Promise.all([ImagePrevTask,imageStorageRef.getDownloadURL()]).then(([_,imageurl])=>{
                                    contentIndexCarrent += 1 ;
                                    stocklist += '<div class="contents-item"><div class="contents-title"><p class="contents-title-num">' + contentIndexCarrent + '</p><p class="contents-title-text">' + postDoc.get('title') + '</p></div><img src = "'+ photourl +'"><table><tbody><tr><th>掲示日時</th><td>'+ postDoc.get('noticeTime') +'</td></tr></tbody></table><div id="editButton"><a href="'+ imageurl +'" target = "_blank"><button class="btn btn-success">ファイルを保存</button></a></div></div>';
                                    document.getElementById('contents').innerHTML = stocklist;
                                }).catch(error => {
                                    console.log(error);
                                })
                            }).catch(error => {
                                console.log(error);
                            })
                        }
                    })
                });
            }else{
                var stocklist = "";
                contentIndexCarrent = 0;
                querySnapshot.forEach((postDoc) => {
                    const imageStorageRef = firebase.storage().ref('/format/' + postDoc.id + "/uploadPDF");
                    MetaDataPrevTask = Promise.all([MetaDataPrevTask,imageStorageRef.getMetadata()]).then(([_,metaData])=>{
                        if(metaData.contentType != 'application/pdf'){
                            const PhotoStorageRef = firebase.storage().ref('/format/' + postDoc.id + "/uploadPhoto");
                            PhotoPrevTask = Promise.all([PhotoPrevTask,PhotoStorageRef.getDownloadURL()]).then(([_,photourl])=>{
                                ImagePrevTask = Promise.all([ImagePrevTask,imageStorageRef.getDownloadURL()]).then(([_,imageurl])=>{
                                    contentIndexCarrent += 1 ;
                                    stocklist += '<div class="contents-item"><div class="contents-title"><p class="contents-title-num">' + contentIndexCarrent + '</p><p class="contents-title-text">' + postDoc.get('title') + '</p></div><img src = "'+ photourl +'"><table><tbody><tr><th>掲示日時</th><td>'+ postDoc.get('noticeTime') +'</td></tr></tbody></table><div id="editButton"><a href="'+ imageurl +'" target = "_blank"><button class="btn btn-success">ファイルを保存</button></a><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('title') +'\')">削除</button></div></div>';
                                    document.getElementById('contents').innerHTML = stocklist;
                                }).catch(error => {
                                    console.log(error);
                                })
                            }).catch(error => {
                                console.log(error);
                            })
                        }
                    })
                });
            }

            //後が無い場合に非表示
            if(querySnapshot.docs.length < 15){
                document.getElementById('nextButton').style.visibility = "hidden";
                document.getElementById('nextButton_bottom').style.visibility = "hidden";
            }

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

            if(nowShowDB == "PDF"){
                if(getParam('storename')){
                    var stocklist = "";
                    querySnapshot.forEach((postDoc) => {
                        const imageStorageRef = firebase.storage().ref('/format/' + postDoc.id + "/uploadPDF");
                        MetaDataPrevTask = Promise.all([MetaDataPrevTask,imageStorageRef.getMetadata()]).then(([_,metaData])=>{
                            if(metaData.contentType == 'application/pdf'){
                                ImagePrevTask = Promise.all([ImagePrevTask,imageStorageRef.getDownloadURL()]).then(([_,imageurl])=>{
                                    contentIndexCarrent += 1 ;
                                    stocklist += '<div class="contents-item"><div class="contents-title"><p class="contents-title-num">' + contentIndexCarrent + '</p><p class="contents-title-text">' + postDoc.get('title') + '</p></div><iframe src = "'+ imageurl +'"></iframe><table><tbody><tr><th>掲示日時</th><td>'+ postDoc.get('noticeTime') +'</td></tr></tbody></table><div id="editButton"><a href="'+ imageurl +'" target = "_blank"><button class="btn btn-success">PDFを表示</button></a></div></div>';
                                    document.getElementById('contents').innerHTML = stocklist;
                                }).catch(error => {
                                    console.log(error);
                                })
                            }
                        })
                    });
                }else{
                    var stocklist = "";
                    querySnapshot.forEach((postDoc) => {
                        const imageStorageRef = firebase.storage().ref('/format/' + postDoc.id + "/uploadPDF");
                        MetaDataPrevTask = Promise.all([MetaDataPrevTask,imageStorageRef.getMetadata()]).then(([_,metaData])=>{
                            if(metaData.contentType == 'application/pdf'){
                                ImagePrevTask = Promise.all([ImagePrevTask,imageStorageRef.getDownloadURL()]).then(([_,imageurl])=>{
                                    contentIndexCarrent += 1 ;
                                    stocklist += '<div class="contents-item"><div class="contents-title"><p class="contents-title-num">' + contentIndexCarrent + '</p><p class="contents-title-text">' + postDoc.get('title') + '</p></div><iframe src = "'+ imageurl +'"></iframe><table><tbody><tr><th>掲示日時</th><td>'+ postDoc.get('noticeTime') +'</td></tr></tbody></table><div id="editButton"><a href="'+ imageurl +'" target = "_blank"><button class="btn btn-success">PDFを表示</button></a><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('title') +'\')">削除</button></div></div>';
                                    document.getElementById('contents').innerHTML = stocklist;
                                }).catch(error => {
                                    console.log(error);
                                })
                            }
                        })
                    });
                }
            }else if(nowShowDB == "inPhotoDB"){
                if(storename){
                    var stocklist = "";
                    querySnapshot.forEach((postDoc) => {
                        const imageStorageRef = firebase.storage().ref('/format/' + postDoc.id + "/uploadPDF");
                        MetaDataPrevTask = Promise.all([MetaDataPrevTask,imageStorageRef.getMetadata()]).then(([_,metaData])=>{
                            if(metaData.contentType != 'application/pdf'){
                                const PhotoStorageRef = firebase.storage().ref('/format/' + postDoc.id + "/uploadPhoto");
                                PhotoPrevTask = Promise.all([PhotoPrevTask,PhotoStorageRef.getDownloadURL()]).then(([_,photourl])=>{
                                    ImagePrevTask = Promise.all([ImagePrevTask,imageStorageRef.getDownloadURL()]).then(([_,imageurl])=>{
                                        contentIndexCarrent += 1 ;
                                        stocklist += '<div class="contents-item"><div class="contents-title"><p class="contents-title-num">' + contentIndexCarrent + '</p><p class="contents-title-text">' + postDoc.get('title') + '</p></div><img src = "'+ photourl +'"><table><tbody><tr><th>掲示日時</th><td>'+ postDoc.get('noticeTime') +'</td></tr></tbody></table><div id="editButton"><a href="'+ imageurl +'" target = "_blank"><button class="btn btn-success">ファイルを保存</button></a></div></div>';
                                        document.getElementById('contents').innerHTML = stocklist;
                                    }).catch(error => {
                                        console.log(error);
                                    })
                                }).catch(error => {
                                    console.log(error);
                                })
                            }
                        })
                    });
                }else{
                    var stocklist = "";
                    querySnapshot.forEach((postDoc) => {
                        const imageStorageRef = firebase.storage().ref('/format/' + postDoc.id + "/uploadPDF");
                        MetaDataPrevTask = Promise.all([MetaDataPrevTask,imageStorageRef.getMetadata()]).then(([_,metaData])=>{
                            if(metaData.contentType != 'application/pdf'){
                                const PhotoStorageRef = firebase.storage().ref('/format/' + postDoc.id + "/uploadPhoto");
                                PhotoPrevTask = Promise.all([PhotoPrevTask,PhotoStorageRef.getDownloadURL()]).then(([_,photourl])=>{
                                    ImagePrevTask = Promise.all([ImagePrevTask,imageStorageRef.getDownloadURL()]).then(([_,imageurl])=>{
                                        contentIndexCarrent += 1 ;
                                        stocklist += '<div class="contents-item"><div class="contents-title"><p class="contents-title-num">' + contentIndexCarrent + '</p><p class="contents-title-text">' + postDoc.get('title') + '</p></div><img src = "'+ photourl +'"><table><tbody><tr><th>掲示日時</th><td>'+ postDoc.get('noticeTime') +'</td></tr></tbody></table><div id="editButton"><a href="'+ imageurl +'" target = "_blank"><button class="btn btn-success">ファイルを保存</button></a><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('title') +'\')">削除</button></div></div>';
                                        document.getElementById('contents').innerHTML = stocklist;
                                    }).catch(error => {
                                        console.log(error);
                                    })
                                }).catch(error => {
                                    console.log(error);
                                })
                            }
                        })
                    });
                }
            }
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
    if(nowShowDB == "PDF"){
        if(getParam('storename')){
            var stocklist = "";
            querySnapshot.forEach((postDoc) => {
                const imageStorageRef = firebase.storage().ref('/format/' + postDoc.id + "/uploadPDF");
                MetaDataPrevTask = Promise.all([MetaDataPrevTask,imageStorageRef.getMetadata()]).then(([_,metaData])=>{
                    if(metaData.contentType == 'application/pdf'){
                        ImagePrevTask = Promise.all([ImagePrevTask,imageStorageRef.getDownloadURL()]).then(([_,imageurl])=>{
                            contentIndexCarrent += 1 ;
                            stocklist += '<div class="contents-item"><div class="contents-title"><p class="contents-title-num">' + contentIndexCarrent + '</p><p class="contents-title-text">' + postDoc.get('title') + '</p></div><iframe src = "'+ imageurl +'"></iframe><table><tbody><tr><th>掲示日時</th><td>'+ postDoc.get('noticeTime') +'</td></tr></tbody></table><div id="editButton"><a href="'+ imageurl +'" target = "_blank"><button class="btn btn-success">PDFを表示</button></a></div></div>';
                            document.getElementById('contents').innerHTML = stocklist;
                        }).catch(error => {
                            console.log(error);
                        })
                    }
                })
            });
        }else{
            var stocklist = "";
            querySnapshot.forEach((postDoc) => {
                const imageStorageRef = firebase.storage().ref('/format/' + postDoc.id + "/uploadPDF");
                MetaDataPrevTask = Promise.all([MetaDataPrevTask,imageStorageRef.getMetadata()]).then(([_,metaData])=>{
                    if(metaData.contentType == 'application/pdf'){
                        ImagePrevTask = Promise.all([ImagePrevTask,imageStorageRef.getDownloadURL()]).then(([_,imageurl])=>{
                            contentIndexCarrent += 1 ;
                            stocklist += '<div class="contents-item"><div class="contents-title"><p class="contents-title-num">' + contentIndexCarrent + '</p><p class="contents-title-text">' + postDoc.get('title') + '</p></div><iframe src = "'+ imageurl +'"></iframe><table><tbody><tr><th>掲示日時</th><td>'+ postDoc.get('noticeTime') +'</td></tr></tbody></table><div id="editButton"><a href="'+ imageurl +'" target = "_blank"><button class="btn btn-success">PDFを表示</button></a><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('title') +'\')">削除</button></div></div>';
                            document.getElementById('contents').innerHTML = stocklist;
                        }).catch(error => {
                            console.log(error);
                        })
                    }
                })
            });
        }
    }else if(nowShowDB == "inPhotoDB"){
        if(storename){
            var stocklist = "";
            querySnapshot.forEach((postDoc) => {
                const imageStorageRef = firebase.storage().ref('/format/' + postDoc.id + "/uploadPDF");
                MetaDataPrevTask = Promise.all([MetaDataPrevTask,imageStorageRef.getMetadata()]).then(([_,metaData])=>{
                    if(metaData.contentType != 'application/pdf'){
                        const PhotoStorageRef = firebase.storage().ref('/format/' + postDoc.id + "/uploadPhoto");
                        PhotoPrevTask = Promise.all([PhotoPrevTask,PhotoStorageRef.getDownloadURL()]).then(([_,photourl])=>{
                            ImagePrevTask = Promise.all([ImagePrevTask,imageStorageRef.getDownloadURL()]).then(([_,imageurl])=>{
                                contentIndexCarrent += 1 ;
                                stocklist += '<div class="contents-item"><div class="contents-title"><p class="contents-title-num">' + contentIndexCarrent + '</p><p class="contents-title-text">' + postDoc.get('title') + '</p></div><img src = "'+ photourl +'"><table><tbody><tr><th>掲示日時</th><td>'+ postDoc.get('noticeTime') +'</td></tr></tbody></table><div id="editButton"><a href="'+ imageurl +'" target = "_blank"><button class="btn btn-success">ファイルを保存</button></a></div></div>';
                                document.getElementById('contents').innerHTML = stocklist;
                            }).catch(error => {
                                console.log(error);
                            })
                        }).catch(error => {
                            console.log(error);
                        })
                    }
                })
            });
        }else{
            var stocklist = "";
            querySnapshot.forEach((postDoc) => {
                const imageStorageRef = firebase.storage().ref('/format/' + postDoc.id + "/uploadPDF");
                MetaDataPrevTask = Promise.all([MetaDataPrevTask,imageStorageRef.getMetadata()]).then(([_,metaData])=>{
                    if(metaData.contentType != 'application/pdf'){
                        const PhotoStorageRef = firebase.storage().ref('/format/' + postDoc.id + "/uploadPhoto");
                        PhotoPrevTask = Promise.all([PhotoPrevTask,PhotoStorageRef.getDownloadURL()]).then(([_,photourl])=>{
                            ImagePrevTask = Promise.all([ImagePrevTask,imageStorageRef.getDownloadURL()]).then(([_,imageurl])=>{
                                contentIndexCarrent += 1 ;
                                stocklist += '<div class="contents-item"><div class="contents-title"><p class="contents-title-num">' + contentIndexCarrent + '</p><p class="contents-title-text">' + postDoc.get('title') + '</p></div><img src = "'+ photourl +'"><table><tbody><tr><th>掲示日時</th><td>'+ postDoc.get('noticeTime') +'</td></tr></tbody></table><div id="editButton"><a href="'+ imageurl +'" target = "_blank"><button class="btn btn-success">ファイルを保存</button></a><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('title') +'\')">削除</button></div></div>';
                                document.getElementById('contents').innerHTML = stocklist;
                            }).catch(error => {
                                console.log(error);
                            })
                        }).catch(error => {
                            console.log(error);
                        })
                    }
                })
            });
        }
    }
  
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

//Status編集用モーダルウィンドウ
function editStatus(id){
    (async () => {
      try {
          const carrentFormatDB = await db.collection('format').doc(id).get();
          let sendIsPDF = carrentFormatDB.get('isPDF');
          if(sendIsPDF == true){
              document.getElementById('thumbnail_edit').style.display = 'none';
          }
          //タイトル
          titleEdit.value = carrentFormatDB.get('title');
          //掲示日時
          noticeTimeEdit.value = carrentFormatDB.get('noticeTime');

          //編集送信ボタン生成
          document.getElementById('edit_submit_button').innerHTML = '<button type="submit" class="btn btn-success" onclick="EditUpdate(\''+id+'\',\''+sendIsPDF+'\')">送信する</button>';
  
      } catch (err) {
      console.log(err)
      }
  })();
}

//status編集
function EditUpdate(id,sendIsPDF){
    collectAlertEdit.innerHTML = '<div class="alert alert-success" role="alert">保存中・・・</div>';
    //DBへ送信
    db.collection('format').doc(id).update({
        title:titleEdit.value,
        noticeTime:noticeTimeEdit.value,
    });
    //storage写真を変更
    var pdfEdit = document.getElementById('pdf_edit').files;
    if(sendIsPDF == 'true'){
        if(pdfEdit.length == 0){
            //PDF変更なし
            console.log('アップロード完了');
            collectAlertEdit.innerHTML = '<div class="alert alert-success" role="alert">保存が完了しました</div>';
            setTimeout("location.reload()",2000);
        }else{
            //PDF変更あり
            var storageRefpdf = firebase.storage().ref('format/' + id + '/uploadPDF');
            storageRefpdf.put(pdfEdit[0]).then(function(){
                console.log('アップロード完了');
                collectAlertEdit.innerHTML = '<div class="alert alert-success" role="alert">保存が完了しました</div>';
                setTimeout("location.reload()",2000);
            }); 
        }
    }else{
        var photoEdit = document.getElementById('photo_edit').files;
        if(pdfEdit.length == 0){
            if(photoEdit.length == 0){
                //PDF以外のファイルの変更なし&サムネイル写真の変更もなし
                console.log('アップロード完了');
                collectAlertEdit.innerHTML = '<div class="alert alert-success" role="alert">保存が完了しました</div>';
                setTimeout("location.reload()",2000);
            }else{
                //PDF以外のファイルの変更なし&サムネイル写真の変更だけあり
                //画像を圧縮する
                var img = new Compressor(photoEdit[0], {
                    quality: 0.5,
                    success(result) {
                        console.log('圧縮完了');
                        photoEdit[0] = result;
                    },
                    maxWidth:1000,
                    maxHeight: 400,
                    mimeType: 'image/png'
                });
                console.log('ok');
                var storageRefphoto = firebase.storage().ref('format/' + id + '/uploadPhoto');
                storageRefphoto.put(photoEdit[0]).then(function(){
                    console.log('ok');
                    console.log('アップロード完了');
                    collectAlertEdit.innerHTML = '<div class="alert alert-success" role="alert">保存が完了しました</div>';
                    setTimeout("location.reload()",2000);
                });
            }
        }else{
            if(photoEdit.length == 0){
                //PDF以外のファイルの変更あり&サムネイル写真の変更はなし
                var storageRefpdf = firebase.storage().ref('format/' + id + '/uploadPDF');
                storageRefpdf.put(pdfEdit[0]).then(function(){
                    console.log('アップロード完了');
                    collectAlertEdit.innerHTML = '<div class="alert alert-success" role="alert">保存が完了しました</div>';
                    setTimeout("location.reload()",2000);
                }); 
            }else{
                //PDF以外のファイルの変更あり&サムネイル写真の変更もあり
                var storageRefpdf = firebase.storage().ref('format/' + id + '/uploadPDF');
                storageRefpdf.put(pdfEdit[0]).then(function(){
                    //画像を圧縮する
                    var img = new Compressor(photoEdit[0], {
                        quality: 0.5,
                        success(result) {
                            console.log('圧縮完了');
                            photoEdit[0] = result;
                        },
                        maxWidth:1000,
                        maxHeight: 400,
                        mimeType: 'image/png'
                    });
                    var storageRefphoto = firebase.storage().ref('format/' + id + '/uploadPhoto');
                    storageRefphoto.put(photoEdit[0]).then(function(){
                        console.log('アップロード完了');
                        collectAlertEdit.innerHTML = '<div class="alert alert-success" role="alert">保存が完了しました</div>';
                        setTimeout("location.reload()",2000);
                    });
                }); 
            }
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
                var storageRef = firebase.storage().ref('format/' + id);
                storageRef.listAll().then( (res) => {
                    res.items.forEach( (itemRef) =>  {
                        itemRef.delete();
                    })
                }).then(function(){
                    //firestoreを削除
                    db.collection('format').doc(id).delete().then(function(){
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

//pdf出力
function showPDF(id){
    var pdfPrevTask = Promise.resolve;
    const pdfStorageRef = firebase.storage().ref('/format/' + id + "/uploadPDF");
    pdfPrevTask = Promise.all([pdfPrevTask,pdfStorageRef.getDownloadURL()]).then(([_,pdfurl])=>{
        window.open(pdfurl, '_blank');
    }).catch(error => {
        console.log(error);
    })
}