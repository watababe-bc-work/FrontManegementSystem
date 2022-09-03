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
var price = document.getElementById('price');
var guestName = document.getElementById('guest_name');
var phoneNumber1 = document.getElementById('phoneNumber1');
var phoneNumber2 = document.getElementById('phoneNumber2');
var fix = document.getElementById('fix');
var approver = document.getElementById('approver');
var supportedPerson = document.getElementById('supported_person');
var collectionDate = document.getElementById('collection_date');
var headComment = document.getElementById('head_comment');

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
                //DBへ送信
                db.collection('memorandum').add({
                    occurrenceDate:occurrenceDate.value,
                    dueDate:dueDate.value,
                    storeName: storenameAdd.value,
                    frontName:frontName.value,
                    price:price.value,
                    guestName:guestName.value,
                    phoneNumber1:phoneNumber1.value,
                    phoneNumber2:phoneNumber2.value,
                    fix:fix.value,
                    approver:'',
                    supportedPerson:'',
                    collectionDate:'',
                    headComment:'',
                    createdAt:firebase.firestore.FieldValue.serverTimestamp(),
                }).then(() => {
                    collectAlert.innerHTML = '<div class="alert alert-success" role="alert">申請が完了しました。</div>';
                    setTimeout("location.reload()",2000);
                });
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
                var query = await db.collection('memorandum').where('storeName','==',e).orderBy('occurrenceDate', 'desc'); 
            }else{
                //初期表示
                var query = await db.collection('memorandum').orderBy('occurrenceDate', 'desc'); 
            }
            var querySnapshot = await query.get();
            var stocklist = '<table class="table">'
            stocklist += '<tr><th>発生日</th><th>支払予定日</th><th>店舗名</th><th>フロント</th><th>金額</th><th>お客様名</th><th>電話番号1</th><th>電話番号2</th><th>承認者</th><th>対応者</th><th>回収日</th><th>編集</th></tr>';
            stocklist += '<tr><th colspan = "6">対応及び経過状況</th><th colspan = "6">本部コメント</th></tr>';

            querySnapshot.forEach((postDoc) => {
                if(postDoc.get('dueDate') < today ){
                    //支払い予定日が今日を過ぎている場合
                    console.log(postDoc.get('dueDate'));
                    console.log(today);
                    stocklist += '<tbody class="alertBack"><tr><td>'+ postDoc.get('occurrenceDate') +'</td><td>' + postDoc.get('dueDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('frontName') + '</td><td>'+ postDoc.get('price') +'</td><td>' + postDoc.get('guestName') + '</td><td>' + postDoc.get('phoneNumber1') +'</td><td>' + postDoc.get('phoneNumber2') +'</td><td>'+ postDoc.get('approver') + '</td><td>'+ postDoc.get('supportedPerson') +'</td><td>'+ postDoc.get('collectionDate') +'</td><td><a class="js-modal-open1"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('guestName') +'\')">削除</button></td></tr>';
                    stocklist += '<tr><td colspan="6">' + postDoc.get('fix') +'</td><td colspan="6">' + postDoc.get('headComment') +'</td></tr></tbody>';
                }else{
                    console.log(postDoc.get('dueDate'));
                    console.log(today);
                    stocklist += '<tbody><tr><td>'+ postDoc.get('occurrenceDate') +'</td><td>' + postDoc.get('dueDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('frontName') + '</td><td>'+ postDoc.get('price') +'</td><td>' + postDoc.get('guestName') + '</td><td>' + postDoc.get('phoneNumber1') +'</td><td>' + postDoc.get('phoneNumber2') +'</td><td>'+ postDoc.get('approver') + '</td><td>'+ postDoc.get('supportedPerson') +'</td><td>'+ postDoc.get('collectionDate') +'</td><td><a class="js-modal-open1"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('guestName') +'\')">削除</button></td></tr>';
                    stocklist += '<tr><td colspan="6">' + postDoc.get('fix') +'</td><td colspan="6">' + postDoc.get('headComment') +'</td></tr></tbody>';
                }
            });

            stocklist += '</table>';
            document.getElementById('contents').innerHTML = stocklist;
        } catch (err) {
        console.log(err);
        }
    })();
}

var occurrenceDateEdit = document.getElementById('occurrence_date_edit');
var dueDateEdit = document.getElementById('due_date_edit');
var storenameEdit = document.getElementById('store_name_edit');
var frontNameEdit = document.getElementById('frontName_edit');
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
            //金額
            priceEdit.value = carrentDB.get('price');
            //お客様名
            guestNameEdit.value = carrentDB.get('guestName');
            //電話番号1
            phoneNumberEdit1.value = carrentDB.get('phoneNumber1');
            //電話番号2
            phoneNumberEdit2.value = carrentDB.get('phoneNumber2');
            //対応
            fix_edit.value = carrentDB.get('fix');
            //承認者
            approver.value = carrentDB.get('approver');
            //対応者
            supportedPerson.value = carrentDB.get('supportedPerson');
            //回収者
            collectionDate.value = carrentDB.get('collectionDate');
            //本部コメント
            headComment.value = carrentDB.get('headComment');

            //編集送信ボタン生成
            document.getElementById('edit_submit_button').innerHTML = '<button type="submit" class="btn btn-success" onclick="EditUpdate(\''+id+'\')">送信する</button>';
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
                    price:priceEdit.value,
                    guestName:guestNameEdit.value,
                    phoneNumber1:phoneNumberEdit1.value,
                    phoneNumber2:phoneNumberEdit2.value,
                    fix:fix_edit.value,
                    approver:approver.value,
                    supportedPerson:supportedPerson.value,
                    collectionDate:collectionDate.value,
                    headComment:headComment.value,
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
        db.collection('memorandum').doc(id).delete();
        alert("削除されました。");
        setTimeout("location.reload()",2000);
    }
    else {
        // キャンセルならアラートボックスを表示
        alert("キャンセルしました。");
    } 
}