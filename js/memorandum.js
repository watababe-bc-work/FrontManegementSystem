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

var occurrenceDate = document.getElementById('occurrence_date');
var dueDate = document.getElementById('due_date');
var storenameAdd = document.getElementById('store_name_add');
var storenameSearch = document.getElementById('store_name_search');
var frontName = document.getElementById('frontName');
var generationDateApprover = document.getElementById('generationDate_approver');
var price = document.getElementById('price');
var guestName = document.getElementById('guest_name');
var phoneNumber1 = document.getElementById('phoneNumber1');
var phoneNumber2 = document.getElementById('phoneNumber2');
var iscollect = document.getElementById('iscollect');
var fix = document.getElementById('fix');
var approver = document.getElementById('approver');
var supportedPerson = document.getElementById('supported_person');
var collectionDate = document.getElementById('collection_date');
//写真データ
var fileList = [];
var fileNameList = [];

var query="";
var querySnapshot="";
var currentQuerySnapshot = "";
var currentQueryList = [];
document.getElementById('prevButton').style.visibility = 'hidden';

//時間の桁を2桁にする
var toDoubleDigits = function(num) {
    num += "";
    if (num.length === 1) {
        num = "0" + num;
    }
    return num;     
};

var collectAlert = document.getElementById('collectAlert');
var today = new Date(); 
var year = today.getFullYear();
var month = toDoubleDigits(today.getMonth()+1);
var day = toDoubleDigits(today.getDate());
today = year + '-' + month + '-' + day;

showDB();

//DB追加
function update(){
    (async () => {
        try {
            if(occurrenceDate.value != '' && dueDate.value != '' && storenameAdd.value != "" && fix.value != ""){
                var files = document.getElementById('file_add').files;
                //DBへ送信
                var res =  await db.collection('memorandum').add({
                    occurrenceDate:occurrenceDate.value,
                    dueDate:dueDate.value,
                    storeName: storenameAdd.value,
                    frontName:frontName.value,
                    generationDateApprover:generationDateApprover.value,
                    price:price.value,
                    guestName:guestName.value,
                    phoneNumber1:phoneNumber1.value,
                    phoneNumber2:phoneNumber2.value,
                    fix:fix.value,
                    iscollect:'plan',
                    approver:'',
                    supportedPerson:'',
                    collectionDate:'',
                    documentExists:'false',
                    createdAt:firebase.firestore.FieldValue.serverTimestamp(),
                });
                console.log(files);
                if(files.length != 0){
                    for (let file of files) {
                        //画像
                        fileList.push(file);
                        fileNameList.push(file.name);
                    }
                    //アップロード
                    var uploads = [];
                    var fileTypeList = ['png','jpg','jpeg'];
                    var i = 0;
                    for (var file of fileList) {
                        let file_type = file.name.split('.').pop();
                        //拡張子が写真データでなければ圧縮しない
                        if(fileTypeList.includes(file_type)){
                            if(file.size > 3145728	){
                                //画像を圧縮する
                                var img = new Compressor(file, {
                                    quality: 0.8,
                                    success(result) {
                                        console.log('圧縮完了');
                                        fileList[i] = result;
                                    },
                                    maxWidth:1000,
                                    maxHeight: 400,
                                    mimeType: 'image/png'
                                });
                                var storageRef = firebase.storage().ref('memorandum/' + res.id + '/uploadData');
                                uploads.push(storageRef.put(fileList[i])); 
                                i += 1;
                            }else{
                                var storageRef = firebase.storage().ref('memorandum/' + res.id + '/uploadData');
                                uploads.push(storageRef.put(file)); 
                                i += 1;
                            }
                        }else{
                            var storageRef = firebase.storage().ref('memorandum/' + res.id + '/uploadData');
                            uploads.push(storageRef.put(fileList[i])); 
                            i += 1;
                        }
                    }
                    //すべての画像・PDFのアップロード完了を待つ
                    Promise.all(uploads).then(function () {
                        (async () => {
                            try{
                                db.collection('memorandum').doc(res.id).update({
                                    documentExists:'true',
                                }).then(() => {
                                    console.log('アップロード完了');
                                    collectAlert.innerHTML = '<div class="alert alert-success" role="alert">追加完了!リロードします。</div>';
                                    setTimeout("location.reload()",2000);
                                });
                            } catch(err){
    
                            }
                        })();
                    });
                }else{
                    console.log('アップロード完了');
                    collectAlert.innerHTML = '<div class="alert alert-success" role="alert">追加完了!リロードします。</div>';
                    setTimeout("location.reload()",2000);
                }
            }else{
                collectAlert.innerHTML = '<div class="alert alert-danger role="alert">必須項目は全て入力してください。</div>';
            }
        } catch (err) {
        console.log(err);
        }
    })();
}

//selectBoxからのDB表示
function selectGetDB(e){
    //パラメータに他の店舗名があるとややこしいので、素のURLにしておく
    window.history.replaceState('','','memorandum.html');
    showDB(e);
}

//DB表示
function showDB(e){
    (async () => {
        try {
            if(e){
                //店舗検索
                query = await db.collection('memorandum').where('storeName','==',e).orderBy('createdAt', 'desc').limit(20); 
            }else{
                //初期表示
                query = await db.collection('memorandum').orderBy('createdAt', 'desc').limit(20); 
            }
            querySnapshot = await query.get();
            var stocklist = '<table class="table table-striped">'
            stocklist += '<tr><th>店舗名</th><th>お客様名</th><th>支払い予定日</th><th>経過</th><th>編集</th></tr>';

            querySnapshot.forEach((postDoc) => {
                //status確認
                switch (postDoc.get('iscollect')) {
                    case 'plan':
                        if(postDoc.get('dueDate') < today ){
                            //支払い予定だったが、支払い期限が過ぎた場合
                            //支払い予定のまま赤背景になる
                            stocklist += '<tbody class="alertBack"><tr><td>'+ postDoc.get('storeName') +'</td><td>'+ postDoc.get('guestName') +'</td><td>'+ postDoc.get('dueDate') +'</td><td>' + '[支払い予定]' + '</td><td><a class="js-modal-open1"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">詳細を見る</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('guestName') +'\')">削除</button></td></tr></tbody>';
                        }else{
                            //支払い予定
                            stocklist += '<tbody><tr><td>'+ postDoc.get('storeName') +'</td><td>'+ postDoc.get('guestName') +'</td><td>'+ postDoc.get('dueDate') +'</td><td>' + '[支払い予定]' + '</td><td><a class="js-modal-open1"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">詳細を見る</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('guestName') +'\')">削除</button></td></tr></tbody>';
                        }
                        break;
                    case 'false':
                        //未回収
                        stocklist += '<tbody class="alreadyBack"><tr><td>'+ postDoc.get('storeName') +'</td><td>'+ postDoc.get('guestName') +'</td><td>'+ postDoc.get('dueDate') +'</td><td>' + '[未回収]' + '</td><td><a class="js-modal-open1"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">詳細を見る</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('guestName') +'\')">削除</button></td></tr></tbody>';
                        break;
                    case 'true':
                        //回収済み
                        stocklist += '<tbody class="alreadyBack"><tr><td>'+ postDoc.get('storeName') +'</td><td>'+ postDoc.get('guestName') +'</td><td>'+ postDoc.get('dueDate') +'</td><td>' + '[回収済]' + '</td><td><a class="js-modal-open1"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">詳細を見る</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('guestName') +'\')">削除</button></td></tr></tbody>';
                        break;
                    default:
                        break;
                }
            });

            stocklist += '</table>';
            document.getElementById('contents').innerHTML = stocklist;

            //後が無い場合に非表示
            if(querySnapshot.docs.length < 20){
                document.getElementById('nextButton').style.visibility = "hidden";
            }
            //前ページがないとき、前へボタンを非表示
            if(currentQueryList.length == 0){
                document.getElementById('back_search').style.visibility = "hidden";
            }else{
                document.getElementById('back_search').style.visibility = "";
            }
        } catch (err) {
        console.log(err);
        }
    })();
}

//各種ソート
function changeStatus(status){
    (async () => {
        try {
            //変更前のDB情報を保持しておく
            currentQueryList.push(querySnapshot);

            //selectBoxを初期化
            document.getElementById('change_status_select').value = "";

            //未回収
            query = await db.collection('memorandum').where('iscollect','==',status).orderBy('createdAt', 'desc').limit(20); 
            querySnapshot = await query.get();
            var stocklist = '<table class="table table-striped">'
            stocklist += '<tr><th>店舗名</th><th>お客様名</th><th>支払い予定日</th><th>経過</th><th>編集</th></tr>';

            querySnapshot.forEach((postDoc) => {
                //status確認
                switch (postDoc.get('iscollect')) {
                    case 'plan':
                        if(postDoc.get('dueDate') < today ){
                            //支払い予定だったが、支払い期限が過ぎた場合
                            //支払い予定のまま赤背景になる
                            stocklist += '<tbody class="alertBack"><tr><td>'+ postDoc.get('storeName') +'</td><td>'+ postDoc.get('guestName') +'</td><td>'+ postDoc.get('dueDate') +'</td><td>' + '[支払い予定]' + '</td><td><a class="js-modal-open1"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">詳細を見る</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('guestName') +'\')">削除</button></td></tr></tbody>';
                        }else{
                            //支払い予定
                            stocklist += '<tbody><tr><td>'+ postDoc.get('storeName') +'</td><td>'+ postDoc.get('guestName') +'</td><td>'+ postDoc.get('dueDate') +'</td><td>' + '[支払い予定]' + '</td><td><a class="js-modal-open1"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">詳細を見る</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('guestName') +'\')">削除</button></td></tr></tbody>';
                        }
                        break;
                    case 'false':
                        //未回収
                        stocklist += '<tbody class="alreadyBack"><tr><td>'+ postDoc.get('storeName') +'</td><td>'+ postDoc.get('guestName') +'</td><td>'+ postDoc.get('dueDate') +'</td><td>' + '[未回収]' + '</td><td><a class="js-modal-open1"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">詳細を見る</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('guestName') +'\')">削除</button></td></tr></tbody>';
                        break;
                    case 'true':
                        //回収済み
                        stocklist += '<tbody class="alreadyBack"><tr><td>'+ postDoc.get('storeName') +'</td><td>'+ postDoc.get('guestName') +'</td><td>'+ postDoc.get('dueDate') +'</td><td>' + '[回収済]' + '</td><td><a class="js-modal-open1"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">詳細を見る</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('guestName') +'\')">削除</button></td></tr></tbody>';
                        break;
                    default:
                        break;
                }
            });

            stocklist += '</table>';
            document.getElementById('contents').innerHTML = stocklist;

            //後が無い場合に非表示
            if(querySnapshot.docs.length < 20){
                document.getElementById('nextButton').style.visibility = "hidden";
            }
            //前ページがないとき、前へボタンを非表示
            if(currentQueryList.length == 0){
                document.getElementById('back_search').style.visibility = "hidden";
            }else{
                document.getElementById('back_search').style.visibility = "";
            }
        } catch (err) {
        console.log(err);
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
  
            query = query.limit(20).startAfter(querySnapshot.docs[1]);
            querySnapshot = await query.get();
  
            //後が無い場合に非表示
            if(querySnapshot.docs.length < 20){
                document.getElementById('nextButton').style.visibility = "hidden";
            }
  
            var stocklist = '<table class="table table-striped">'
            stocklist += '<tr><th>店舗名</th><th>お客様名</th><th>支払い予定日</th><th>経過</th><th>編集</th></tr>';

            querySnapshot.forEach((postDoc) => {
                //status確認
                switch (postDoc.get('iscollect')) {
                    case 'plan':
                        if(postDoc.get('dueDate') < today ){
                            //支払い予定だったが、支払い期限が過ぎた場合
                            //支払い予定のまま赤背景になる
                            stocklist += '<tbody class="alertBack"><tr><td>'+ postDoc.get('storeName') +'</td><td>'+ postDoc.get('guestName') +'</td><td>'+ postDoc.get('dueDate') +'</td><td>' + '[支払い予定]' + '</td><td><a class="js-modal-open1"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">詳細を見る</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('guestName') +'\')">削除</button></td></tr></tbody>';
                        }else{
                            //支払い予定
                            stocklist += '<tbody><tr><td>'+ postDoc.get('storeName') +'</td><td>'+ postDoc.get('guestName') +'</td><td>'+ postDoc.get('dueDate') +'</td><td>' + '[支払い予定]' + '</td><td><a class="js-modal-open1"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">詳細を見る</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('guestName') +'\')">削除</button></td></tr></tbody>';
                        }
                        break;
                    case 'false':
                        //未回収
                        stocklist += '<tbody class="alreadyBack"><tr><td>'+ postDoc.get('storeName') +'</td><td>'+ postDoc.get('guestName') +'</td><td>'+ postDoc.get('dueDate') +'</td><td>' + '[未回収]' + '</td><td><a class="js-modal-open1"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">詳細を見る</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('guestName') +'\')">削除</button></td></tr></tbody>';
                        break;
                    case 'true':
                        //回収済み
                        stocklist += '<tbody class="alreadyBack"><tr><td>'+ postDoc.get('storeName') +'</td><td>'+ postDoc.get('guestName') +'</td><td>'+ postDoc.get('dueDate') +'</td><td>' + '[回収済]' + '</td><td><a class="js-modal-open1"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">詳細を見る</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('guestName') +'\')">削除</button></td></tr></tbody>';
                        break;
                    default:
                        break;
                }
            });

            stocklist += '</table>';
            document.getElementById('contents').innerHTML = stocklist;
    
        } catch (err) {
            console.log(err);
        }
    })();
  }
  
//前のテーブルを表示(戻るボタン)
function returnTable(){
    document.getElementById('nextButton').style.visibility = 'visible';
    querySnapshot = currentQueryList.pop();   
  
    var stocklist = '<table class="table table-striped">'
    stocklist += '<tr><th>店舗名</th><th>お客様名</th><th>支払い予定日</th><th>経過</th><th>編集</th></tr>';

    querySnapshot.forEach((postDoc) => {
        //status確認
        switch (postDoc.get('iscollect')) {
            case 'plan':
                if(postDoc.get('dueDate') < today ){
                    //支払い予定だったが、支払い期限が過ぎた場合
                    //支払い予定のまま赤背景になる
                    stocklist += '<tbody class="alertBack"><tr><td>'+ postDoc.get('storeName') +'</td><td>'+ postDoc.get('guestName') +'</td><td>'+ postDoc.get('dueDate') +'</td><td>' + '[支払い予定]' + '</td><td><a class="js-modal-open1"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">詳細を見る</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('guestName') +'\')">削除</button></td></tr></tbody>';
                }else{
                    //支払い予定
                    stocklist += '<tbody><tr><td>'+ postDoc.get('storeName') +'</td><td>'+ postDoc.get('guestName') +'</td><td>'+ postDoc.get('dueDate') +'</td><td>' + '[支払い予定]' + '</td><td><a class="js-modal-open1"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">詳細を見る</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('guestName') +'\')">削除</button></td></tr></tbody>';
                }
                break;
            case 'false':
                //未回収
                stocklist += '<tbody class="alreadyBack"><tr><td>'+ postDoc.get('storeName') +'</td><td>'+ postDoc.get('guestName') +'</td><td>'+ postDoc.get('dueDate') +'</td><td>' + '[未回収]' + '</td><td><a class="js-modal-open1"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">詳細を見る</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('guestName') +'\')">削除</button></td></tr></tbody>';
                break;
            case 'true':
                //回収済み
                stocklist += '<tbody class="alreadyBack"><tr><td>'+ postDoc.get('storeName') +'</td><td>'+ postDoc.get('guestName') +'</td><td>'+ postDoc.get('dueDate') +'</td><td>' + '[回収済]' + '</td><td><a class="js-modal-open1"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">詳細を見る</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('guestName') +'\')">削除</button></td></tr></tbody>';
                break;
            default:
                break;
        }
    });

    stocklist += '</table>';
    document.getElementById('contents').innerHTML = stocklist;
  
    //前が無くなったら前へを非表示
    if(currentQueryList.length < 1){
        document.getElementById('prevButton').style.visibility = 'hidden';
        document.getElementById('back_search').style.visibility = "hidden";
    }else{
        document.getElementById('back_search').style.visibility = "";
    }
}

var occurrenceDateEdit = document.getElementById('occurrence_date_edit');
var dueDateEdit = document.getElementById('due_date_edit');
var storenameEdit = document.getElementById('store_name_edit');
var frontNameEdit = document.getElementById('frontName_edit');
var generationDateApproverEdit = document.getElementById('generationDate_approver_edit');
var priceEdit = document.getElementById('price_edit');
var guestNameEdit = document.getElementById('guest_name_edit');
var phoneNumberEdit1 = document.getElementById('phoneNumber1_edit');
var phoneNumberEdit2 = document.getElementById('phoneNumber2_edit');
var fix_edit = document.getElementById('fix_edit');
var collectAlertEdit = document.getElementById('collectAlert_edit');

//編集用モーダルウィンドウ
function editStatus(id){
    (async () => {
        try {
            const carrentDB = await db.collection('memorandum').doc(id).get();
            //発生日
            occurrenceDateEdit.value = carrentDB.get('occurrenceDate');
            //支払い予定日
            dueDateEdit.value = carrentDB.get('dueDate');
            //店舗名
            storenameEdit.value = carrentDB.get('storeName');
            //フロント名
            frontNameEdit.value = carrentDB.get('frontName');
            //未払い発生日承認者
            generationDateApproverEdit.value = carrentDB.get('generationDateApprover');
            //金額
            priceEdit.value = carrentDB.get('price');
            //お客様名
            guestNameEdit.value = carrentDB.get('guestName');
            //電話番号1
            phoneNumberEdit1.value = carrentDB.get('phoneNumber1');
            //電話番号2
            phoneNumberEdit2.value = carrentDB.get('phoneNumber2');
            //備考
            fix_edit.value = carrentDB.get('fix');
            //経過
            iscollect.value = carrentDB.get('iscollect');
            //承認者
            approver.value = carrentDB.get('approver');
            //対応者
            supportedPerson.value = carrentDB.get('supportedPerson');
            //回収者
            collectionDate.value = carrentDB.get('collectionDate');

            //編集送信ボタン生成
            document.getElementById('edit_submit_button').innerHTML = '<button type="submit" class="btn btn-success" onclick="EditUpdate(\''+id+'\')">送信する</button>';
            //写真表示用ボタン生成
            document.getElementById('edit_photo_button').innerHTML = '<a class="js-modal-open2"><button class="btn btn-secondary" onclick="showMemorandum(\''+id+'\')">念書を見る</button></a>';
        } catch (err) {
        console.log(err)
        }
        })();
}

//編集送信
function EditUpdate(id){
    (async () => {
        try {
            if(occurrenceDateEdit.value != '' && dueDateEdit.value != '' && storenameEdit.value != "" && fix_edit.value != ""){
                //DBへ送信
                db.collection('memorandum').doc(id).update({
                    occurrenceDate:occurrenceDateEdit.value,
                    dueDate:dueDateEdit.value,
                    storeName: storenameEdit.value,
                    frontName:frontNameEdit.value,
                    generationDateApprover:generationDateApproverEdit.value,
                    price:priceEdit.value,
                    guestName:guestNameEdit.value,
                    phoneNumber1:phoneNumberEdit1.value,
                    phoneNumber2:phoneNumberEdit2.value,
                    iscollect:iscollect.value,
                    fix:fix_edit.value,
                    approver:approver.value,
                    supportedPerson:supportedPerson.value,
                    collectionDate:collectionDate.value,
                }).then(() => {
                    collectAlertEdit.innerHTML = '<div class="alert alert-success" role="alert">編集が完了しました。</div>';
                    setTimeout("location.reload()",2000);
                });
            }else{
                collectAlertEdit.innerHTML = '<div class="alert alert-danger role="alert">必須項目は全て入力してください。</div>';
            }
        } catch (err) {
        console.log(err);
        }
    })();
}

//削除機能
function deleteContent(id,name){
    var res = window.confirm(name + "様の内容を削除しますか？");
    if( res ) {
        //storageを削除
        var storageRef = firebase.storage().ref('memorandum/' + id);
        storageRef.listAll().then( (res) => {
            res.items.forEach( (itemRef) =>  {
                itemRef.delete();
            });
            //firestoreを削除
            db.collection('memorandum').doc(id).delete().then(() => {
                alert("削除されました。");
                setTimeout("location.reload()",2000);
            });
        });
    }
    else {
        // キャンセルならアラートボックスを表示
        alert("キャンセルしました。");
    } 
}

//写真データ
var fileListEdit = [];
var fileNameListEdit = [];

//画像/データモーダル
function showMemorandum(id){
    var prevTask = Promise.resolve;
    (async () => {
        try { 
            const storageRef = await db.collection('memorandum').doc(id).get();
            if(storageRef.get('documentExists') == 'false'){
                document.getElementById('modalImgs').innerHTML = '<p>画像及びファイルがアップされていません。</p>';
            }else{
                var storageImageRef = firebase.storage().ref('/memorandum/' + id + '/uploadData');
                var metaData = await storageImageRef.getMetadata();
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
                    var stocklist = '';
                    prevTask = Promise.all([prevTask,storageImageRef.getDownloadURL()]).then(([_,url])=>{
                        // stocklist += '<img src = ' + '"' + url + '"' + '></img>';
                        stocklist += '<img src = ' + '"' + url + '" onclick="imgwin(\''+url+'\')" id="largeImage"></img>';
                        console.log(stocklist);
                        document.getElementById('modalImgs').innerHTML = stocklist;
                    }).catch(error => {
                        console.log(error);
                    }).catch(() => {});
                }
            }
            //送信ボタン生成
            document.getElementById('modalImgButton').innerHTML = '<button type="submit" class="btn btn-success" onclick="sendMemorandum(\''+id+'\')">送信する</button>';
            //削除ボタン生成
            document.getElementById('modalImgDeleteButton').innerHTML = '<button class="btn btn-danger" onclick="deleteMemorandum(\''+id+'\')">写真を削除</button>';
        } catch (err) {
        console.log(err);
        }

    })();
};

//画像を大きく表示する
function imgwin(img){
    var wwidth  = 866;
    var wheight = 580 + 40; //40はメッセージとcloseボタンの分の追加
    var nwin = window.open("", "sub2", "width=" + wwidth + ",height=" + wheight);
    nwin.document.open();
    nwin.document.write('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN"\n');
    nwin.document.write('    "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">\n');
    nwin.document.write('<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ja">\n');
    nwin.document.write('<head>\n');
    nwin.document.write('<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\n');
  
    nwin.document.write('<style type="text/css">\n');
    nwin.document.write('body {background-color:#cccccc;}\n');
    nwin.document.write('span {cursor:pointer;padding:0 4px;background-color:#f0f0f0; border:outset;}\n');
    nwin.document.write('p {text-align:center;}\n');
    nwin.document.write('img {width:60%;}\n');
    nwin.document.write('</style>\n');
  
    nwin.document.write('<title>アップ画像</title>\n</head>\n<body>\n');
    nwin.document.write('<p><img src= '+ img +' alt="" /></p>\n');
    nwin.document.write('</body>\n');
    nwin.document.write('</html>\n');
    nwin.document.close();
    nwin.focus();
}

//画像モーダル送信
function sendMemorandum(id){
    (async () => {
        try {
            var modalImgAlert = document.getElementById('modalImgAlert');
            modalImgAlert.innerHTML = '<div class="alert alert-success" role="alert">送信中...</div>';
            var fileModal = document.getElementById('file_modal').files;
            //アップロード
            var fileTypeList = ['png','jpg','jpeg'];
            var i = 0;
            for (var file of fileModal) {
                let file_type = file.name.split('.').pop();
                //拡張子が写真データでなければ圧縮しない
                if(fileTypeList.includes(file_type)){
                    if(file.size > 3145728	){
                        //画像を圧縮する
                        new Compressor(file, {
                            quality: 0.8,
                            success(result) {
                                console.log('圧縮完了');
                                fileListEdit[i] = result;
                                var storageRefModal = firebase.storage().ref('memorandum/' + id + '/uploadData');
                                storageRefModal.put(fileListEdit[i]).then(function(){
                                    //DBへ送信
                                    db.collection('memorandum').doc(id).update({
                                        documentExists:'true'
                                    }).then(() => {
                                        console.log('アップロード完了');
                                        modalImgAlert.innerHTML = '<div class="alert alert-success" role="alert">追加完了!リロードします。</div>';
                                        setTimeout("location.reload()",2000);
                                    });
                                })
                                console.log(fileListEdit[i]);
                                i += 1;
                            },
                            maxWidth:1000,
                            maxHeight: 400,
                            mimeType: 'image/png'
                        });
                    }else{
                        var storageRefModal = firebase.storage().ref('memorandum/' + id + '/uploadData');
                        storageRefModal.put(file).then(function(){
                            //DBへ送信
                            db.collection('memorandum').doc(id).update({
                                documentExists:'true'
                            }).then(() => {
                                console.log('アップロード完了');
                                modalImgAlert.innerHTML = '<div class="alert alert-success" role="alert">追加完了!リロードします。</div>';
                                setTimeout("location.reload()",2000);
                            });
                        })
                    }
                }else{
                    var storageRefModal = firebase.storage().ref('memorandum/' + id + '/uploadData');
                    storageRefModal.put(fileListEdit[i]).then(function(){
                        //DBへ送信
                        db.collection('memorandum').doc(id).update({
                            documentExists:'true'
                        }).then(() => {
                            console.log('アップロード完了');
                            modalImgAlert.innerHTML = '<div class="alert alert-success" role="alert">追加完了!リロードします。</div>';
                            setTimeout("location.reload()",2000);
                        });
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

//写真のみを削除
function deleteMemorandum(id){
    var res = window.confirm("現在表示されている写真及びファイルを削除してもよろしいですか。");
    if( res ) {
        (async () => {
            try {
                //storageを削除
                firebase.storage().ref('memorandum/' + id + '/uploadData').delete().then(function(){
                    //firestoreのisPDFをfalseにする
                    db.collection('memorandum').doc(id).update({
                        documentExists:'false'
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