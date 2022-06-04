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

var query="";
var querySnapshot="";
var currentQuerySnapshot = "";
var currentQueryList = [];
var backQueryList = [];
document.getElementById('prevButton').style.visibility = 'hidden';

//フォームの初期非表示
document.getElementById('addForm').style.display = "none";

//ボタンpushでフォーム表示
function addContent(){
    document.getElementById('addForm').style.display = "block";
}

//追加
function Update(){
    //発生日時
    var orderDate = document.getElementById('order_date').value;
    //店舗名
    var storeName = document.getElementById('store_name').value;
    //依頼区分
    var orderCategory = document.getElementById('order_category').value;
    //依頼者氏名
    var requesterName = document.getElementById('requester_name').value;
    //指示者氏名
    var orderPersonName = document.getElementById('orderPerson_name').value;
    //場所/部屋番号
    var place = document.getElementById('place').value;
    //in時間
    var inTime = document.getElementById('inTime').value;
    //out時間/取り消し時間
    var outTime = document.getElementById('outTime').value;
    //プラン/金額
    var planAndprice = document.getElementById('planAndprice').value;
    //訂正
    var correction = document.getElementById('correction').value;
    //件数
    var number = document.getElementById('count').value;
    //金額
    var price = document.getElementById('price').value;
    //出勤その他
    var withdrawal = document.getElementById('withdrawal').value;
    //入金その他
    var moneyReceived = document.getElementById('moneyReceived').value;
    //状況説明
    var status_desc = document.getElementById('status_desc').value;
    //処理内容
    var process_content = document.getElementById('process_content').value;

    //DBへ送信
    db.collection('AccidentAndCancel').add({
        orderDate: orderDate,
        storeName:storeName,
        orderCategory:orderCategory,
        requesterName:requesterName,
        orderPersonName:orderPersonName,
        place:place,
        inTime:inTime,
        outTime:outTime,
        planAndprice:planAndprice,
        correction:correction,
        number:number,
        price:price,
        withdrawal:withdrawal,
        moneyReceived:moneyReceived,
        status_desc:status_desc,
        process_content:process_content,
        status:'未了',
        CreatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    var collectAlert = document.getElementById('collectAlert');
    collectAlert.innerHTML = '<div class="alert alert-success" role="alert">申請が完了しました。状態は下記の一覧表から確認してください。</div>';
    setTimeout("location.reload()",2000);
}

//table表示
function showTable(){
    var store = document.getElementById('store_name_search').value;
    var query="";
    var querySnapshot="";

    //テーブル表示(初期値)
    (async () => {
        try {
        // 省略 
        // (Cloud Firestoreのインスタンスを初期化してdbにセット)
    
        query = await db.collection('AccidentAndCancel').where('storeName','==',store).orderBy('createdAt', 'desc').limit(10); // firebase.firestore.QuerySnapshotのインスタンスを取得
        querySnapshot = await query.get();

        var stocklist = '<table class="table table-striped">'
        stocklist += '<tr><th>発生日時</th><th>依頼区分</th><th>依頼者</th><th>指示者</th><th>場所・部屋番号</th><th>IN時間</th><th>OUT時間/取消時間</th><th>利用プラン/金額</th><th>日報訂正</th><th>状態</th><th>機能</th>';
        querySnapshot.forEach((postDoc) => {
            switch(postDoc.get('status')){
                //完了
                case '完了':
                    var statusText = "承認";
                    stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('orderCategory') + '</td><td>' + postDoc.get('requesterName') + '</td><td>' + postDoc.get('orderPersonName') + '</td><td>'+ postDoc.get('place') +'</td><td>'+ postDoc.get('inTime') +'</td><td>'+ postDoc.get('outTime') +'</td><td>'+ postDoc.get('planAndprice') +'</td><td>'+ postDoc.get('correction') +'</td><td>'+ statusText +'</td><td></td></tr></tbody>';
                    break;
                //未了    
                case '未了':
                    var statusText = "未了";
                    stocklist += '<tbody class="yetBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('staffNum') + '</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('paper') + '</td><td>'+ postDoc.get('endDate') +'</td><td>'+ statusText +'</td></tr></tbody>';
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

