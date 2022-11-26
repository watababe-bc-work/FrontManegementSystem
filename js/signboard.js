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

var storenameAdd = document.getElementById('store_name_add');
var storenameSearch = document.getElementById('store_name_search');
var title = document.getElementById('title');
var imgfile = document.getElementById('imgfile');
var lighting01 = document.getElementById('lighting01');
var lighting02 = document.getElementById('lighting02');
var size01 = document.getElementById('size01');
var size02 = document.getElementById('size02');

//新規作成モーダルウィンドウ用
function addModal(){
    storenameAdd.value = storenameSearch.value;
    addContentForm(storenameAdd.value);
}

//指定した店舗の何番目なのかを取得
function addContentForm(e){
    (async () => {
        try {
            var query = await db.collection('signboard'); 
            var querySnapshot = await query.get();
            var indexNum = 0;
            querySnapshot.forEach((postDoc) => {
                if(postDoc.get('storename') == e){
                    indexNum += 1;
                }
            });
            
            document.getElementById('indexNum').innerHTML = '<label for="">番号：</label><p id="num">' + (indexNum + 1) +'</p>';
        } catch (err) {
        console.log(err);
        }
    })();
}

//DB追加
function update(){
    (async () => {
        try {
            if(storenameAdd.value != "" && title.value != ""){
                var collectAlert = document.getElementById('collectAlert');
                collectAlert.innerHTML = '<div class="alert alert-success role="alert">送信中...</div>';
                var num = document.getElementById('num');

                var fileTypeList = ['png','jpg','jpeg'];
                let file_type = imgfile.files[0].name.split('.').pop();
                //拡張子が写真データでなければ排除
                if(fileTypeList.includes(file_type)){
                    //DBへ送信
                    var res = await db.collection('signboard').add({
                        storename:storenameAdd.value,
                        title:title.value,
                        lighting01:lighting01.value,
                        lighting02:lighting02.value,
                        size01:size01.value,
                        size02:size02.value,
                        CreatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    });
                    
                    //写真アップロード
                    var img = new Compressor(imgfile.files[0], {
                        quality: 0.5,
                        success(result) {
                            console.log('圧縮完了');
                            imgfile.files[0] = result;
                        },
                        maxWidth:1000,
                        maxHeight: 400,
                        mimeType: 'image/png'
                    });
                    var storageRef = firebase.storage().ref('signboards/' + res.id + '/' + 'indexImage');
                    storageRef.put(imgfile.files[0]).then(() => {
                        //成功アラート
                        collectAlert.innerHTML = '<div class="alert alert-success role="alert">送信完了！</div>';
                        //編集をした店舗を表示させるためのリロード処理
                        window.history.replaceState('','','signboard.html?storename=' + storenameAdd.value)
                        setTimeout('location.reload()',2000);
                    })
                }else{
                    collectAlert.innerHTML = '<div class="alert alert-danger role="alert">ファイルはpng,jpeg,jpgの写真データのみです。</div>';
                }
            }else{
                collectAlert.innerHTML = '<div class="alert alert-danger role="alert">店舗名、タイトルは必須項目です。</div>';
            }
        } catch (err) {
        console.log(err);
        }
    })();
}

//パラメータでのDB表示
const searchParams = decodeURI(window.location.search);
console.log(searchParams);
if(getParam('storename')){
    showDB(getParam('storename'));
    storenameSearch.value = getParam('storename');
}

//selectBoxからのDB表示
function selectGetDB(e){
    //パラメータに他の店舗名があるとややこしいので、素のURLにしておく
    window.history.replaceState('','','signboard.html');
    showDB(e);
}

//DB表示
function showDB(e){
    (async () => {
        try {
            var prevTask = Promise.resolve;
            var query = await db.collection('signboard').where('storename','==',e).orderBy('CreatedAt', 'asc'); 
            var querySnapshot = await query.get();
            var stocklist = "";
            var index = 0;
            var indexImage = 0;

            querySnapshot.forEach((postDoc) => {
                indexImage += 1;
                const storageRef = firebase.storage().ref('/signboards/' + postDoc.id + "/indexImage");
                prevTask = Promise.all([prevTask,storageRef.getDownloadURL()]).then(([_,url])=>{
                    index += 1 ;
                    console.log(postDoc.get('title'));
                    stocklist += '<div class="contents-item"><div class="contents-title"><p class="contents-title-num">' + index + '</p><p class="contents-title-text">' + postDoc.get('title') + '</p></div><img src = "'+ url +'"><table><tbody><tr><th rowspan="2">照明</th><td>'+ postDoc.get('lighting01') +'</td></tr><tr><td>'+ postDoc.get('lighting02') +'</td></tr><tr><th rowspan="2">サイズ</th><td>'+ postDoc.get('size01') +'</td></tr><tr><td>'+ postDoc.get('size02') +'</td></tr></tbody></table><div id="editButton"><a class="js-modal-open1"><button class="btn btn-primary" onclick = "editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick = "deleteDB(\''+postDoc.id+'\',\''+index+'\')">削除</button></div></div>';
                    document.getElementById('contents').innerHTML = stocklist;
                }).catch(error => {
                    console.log(error);
                }).catch(() => {});
            });
        } catch (err) {
        console.log(err);
        }
    })();
}

var storenameedit = document.getElementById('storename_edit');
var titleEdit = document.getElementById('title_edit');
var numEdit = document.getElementById('num_edit');
var imgfileEdit = document.getElementById('imgfile_edit');
var lighting01Edit = document.getElementById('lighting01_edit');
var lighting02Edit = document.getElementById('lighting02_edit');
var size01Edit = document.getElementById('size01_edit');
var size02Edit = document.getElementById('size02_edit');

//編集用モーダルウィンドウ
function editStatus(id){
    (async () => {
        try {
            const carrentDB = await db.collection('signboard').doc(id).get();
            //タイトル
            titleEdit.value = carrentDB.get('title');
            //店舗名
            storenameedit.textContent = carrentDB.get('storename');
            //照明1
            lighting01Edit.value = carrentDB.get('lighting01');
            //照明2
            lighting02Edit.value = carrentDB.get('lighting02');
            //サイズ1
            size01Edit.value = carrentDB.get('size01');
            //サイズ2
            size02Edit.value = carrentDB.get('size02');

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
            var collectAlert = document.getElementById('collectAlert_edit');
            collectAlert.innerHTML = '<div class="alert alert-success role="alert">送信中...</div>';

            var fileTypeList = ['png','jpg','jpeg'];
            if(imgfileEdit.files[0] != undefined){
                let file_type = imgfileEdit.files[0].name.split('.').pop();
                //拡張子が写真データでなければ排除
                if(fileTypeList.includes(file_type)){
                    //写真アップロード
                    var img = new Compressor(imgfileEdit.files[0], {
                        quality: 0.5,
                        success(result) {
                            console.log('圧縮完了');
                            imgfileEdit.files[0] = result;
                        },
                        maxWidth:1000,
                        maxHeight: 400,
                        mimeType: 'image/png'
                    });
                    var storageRef = firebase.storage().ref('signboards/' + id + '/' + 'indexImage');
                    storageRef.put(imgfileEdit.files[0]).then(() => {
                        //DBへ送信
                        db.collection('signboard').doc(id).update({
                            storename:storenameedit.textContent,
                            title:titleEdit.value,
                            lighting01:lighting01Edit.value,
                            lighting02:lighting02Edit.value,
                            size01:size01Edit.value,
                            size02:size02Edit.value,
                        });
                        //成功アラート
                        collectAlert.innerHTML = '<div class="alert alert-success role="alert">編集完了！</div>';
                        //編集をした店舗を表示させるためのリロード処理
                        window.history.replaceState('','','signboard.html?storename=' + storenameedit.textContent)
                        setTimeout('location.reload()',500);
                    });
                }else{
                    collectAlert.innerHTML = '<div class="alert alert-danger role="alert">ファイルはpng,jpeg,jpgの写真データのみです。</div>';
                }
            }else{
                //DBへ送信
                db.collection('signboard').doc(id).update({
                    storename:storenameedit.textContent,
                    title:titleEdit.value,
                    lighting01:lighting01Edit.value,
                    lighting02:lighting02Edit.value,
                    size01:size01Edit.value,
                    size02:size02Edit.value,
                });
                //成功アラート
                collectAlert.innerHTML = '<div class="alert alert-success role="alert">編集完了！</div>';
                //編集をした店舗を表示させるためのリロード処理
                window.history.replaceState('','','signboard.html?storename=' + storenameedit.textContent)
                setTimeout('location.reload()',500);
            }
        } catch (err) {
        console.log(err);
        }
    })();
}

//削除機能
function deleteDB(id,index){
    var res = window.confirm(index + "番目の内容を削除しますか？");
    if( res ) {
        //storage内の写真を削除
        var storageImageRef = firebase.storage().ref('/signboards/' + id + '/' + 'indexImage');
        storageImageRef.delete().then(function(){
            //firestore内の内容を削除
            db.collection('signboard').doc(id).delete();
            alert("削除されました。");
            setTimeout("location.reload()",2000);
        });
    }
    else {
        // キャンセルならアラートボックスを表示
        alert("キャンセルしました。");
    } 
}