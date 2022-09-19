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

document.getElementById('addForm').style.display = "none";
document.getElementById('addForm2').style.display = "none";
var store_name_pto_search = document.getElementById('store_name_search');
var store_name_ot_search = document.getElementById('store_name_ot_search');
var store_name_pto = document.getElementById('store_name');
var store_name_ot = document.getElementById('store_name_ot');

//本日の日付を初期値に配置
window.onload = function () {
    //今日の日時を表示
    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    document.getElementById("order_date").textContent = "令和" + (year - 2018) + "年" + month + "月" + day + "日";
    document.getElementById("order_date2").textContent = "令和" + (year - 2018) + "年" + month + "月" + day + "日";
}

function addOrderContent(){
    document.getElementById('addForm').style.display = "block";
}

function addoverTimeContent(){
    document.getElementById('addForm2').style.display = "block";
}

//パラメータでのDB表示
const searchParams = decodeURI(window.location.search);
console.log(searchParams);
if(getParam('storename')){
    showTable(getParam('storename'));
    showTableOt(getParam('storename'));
    store_name_pto_search.value = getParam('storename');
    store_name_ot_search.value = getParam('storename');
    store_name_pto.value = getParam('storename');
    store_name_ot.value = getParam('storename');
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

//有休申請
//DBへ追加
function PtoUpdate(){
    //社員番号
    var staffNum = document.getElementById('staffNum').value;
    //氏名
    var name = document.getElementById('name').value;
    //作成日
    var createdAt = document.getElementById('order_date').textContent;
    //店舗名
    var storeName = document.getElementById('store_name').value;
    //日時
    var startDate = document.getElementById('startdate').value;
    var endDate = document.getElementById('enddate').value;
    //理由
    var reason = document.getElementById('reason_detail').value;
    if(staffNum == "" || name == "" || storeName == "" || startDate == "" || endDate == "" || reason == ""){
        var Alert = document.getElementById('Alert');
        Alert.innerHTML = '<div class="alert alert-danger" role="alert">項目は全て記入してください。</div>';
    }else{
        //DBへ送信
        db.collection('ptoApps').add({
            staffNum:staffNum,
            name:name,
            createdAt:createdAt,
            startDate:startDate,
            endDate:endDate,
            reason:reason,
            storeName:storeName,
            status:"unapproved",
        });
        var Alert = document.getElementById('Alert');
        Alert.innerHTML = '<div class="alert alert-success" role="alert">申請が完了しました。状態は下記の一覧表から確認してください。</div>';
        setTimeout("location.reload()",2000);
    }
}

//table表示
function showTable(store){
    console.log(store);
    var query="";
    var querySnapshot="";

    //テーブル表示(初期値)
    (async () => {
        try {
        // 省略 
        // (Cloud Firestoreのインスタンスを初期化してdbにセット)
    
        query = await db.collection('ptoApps').where('storeName','==',store).orderBy('startDate', 'desc'); // firebase.firestore.QuerySnapshotのインスタンスを取得
        querySnapshot = await query.get();

        var stocklist = '<table class="table table-striped">'
        stocklist += '<tr><th>依頼日時</th><th>社員番号</th><th>氏名</th><th>申請期間</th><th>承認者</th><th>状態</th><th>本部回答</th>';
        querySnapshot.forEach((postDoc) => {
            switch(postDoc.get('status')){
            //承認
            case 'approve':
                var statusText = "承認";
                stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('staffNum') + '</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('startDate') + "から" + postDoc.get('endDate') + "まで" + '</td><td>'+ postDoc.get('approver') +'</td><td>' + statusText + '</td><td>' + postDoc.get('note') +'</td></tr></tbody>';
                break;
            //不承認      
            case 'disapproval':
                var statusText = "不承認";
                stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('staffNum') + '</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('startDate') + "から" + postDoc.get('endDate') + "まで" + '</td><td>'+ postDoc.get('approver') +'</td><td>' + statusText + '</td><td>' + postDoc.get('note') +'</td></tr></tbody>';
                break;
            //未承認      
            default:
                var statusText = "未承認";
                stocklist += '<tbody class="yetBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('staffNum') + '</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('startDate') + "から" + postDoc.get('endDate') + "まで" + '</td><td></td><td>' + statusText + '</td><td></td></tr></tbody>';
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

//残業申請
//DBへ追加
function overTimeUpdate(){
    //社員番号
    var staffNum = document.getElementById('staffNum_ot').value;
    //氏名
    var name = document.getElementById('name_ot').value;
    //作成日
    var createdAt = document.getElementById('order_date2').textContent;
    console.log(createdAt);
    //日時
    var date = document.getElementById('date_ot').value;
    var startDate = document.getElementById('startDate_ot').value;
    var endDate = document.getElementById('endDate_ot').value;
    //電話承認者
    var phoneApprover = document.getElementById('phoneApprover_ot').value;
    console.log(phoneApprover);
    var storeName = document.getElementById('store_name_ot').value;
    var reason = document.getElementById('reason_detail_ot').value;
    if(name == "" || date == "" || startDate == "" || endDate == "" || storeName == "" || reason == ""){
        var Alert = document.getElementById('Alert2');
        Alert.innerHTML = '<div class="alert alert-danger" role="alert">項目は全て記入してください。</div>';
    }else{
        //DBへ送信
        db.collection('overtimeApp').add({
            staffNum,staffNum,
            name:name,
            createdAt:createdAt,
            date:date,
            startDate:startDate,
            endDate:endDate,
            storeName:storeName,
            phoneApprover:phoneApprover,
            reason:reason,
            status:"unapproved",
        });
        var Alert = document.getElementById('Alert2');
        Alert.innerHTML = '<div class="alert alert-success" role="alert">申請が完了しました。状態は下記の一覧表から確認してください。</div>';
        setTimeout("location.reload()",2000);
    }
}

//table表示
function showTableOt(store){
    var query="";
    var querySnapshot="";

    //テーブル表示(初期値)
    (async () => {
        try {
        // 省略 
        // (Cloud Firestoreのインスタンスを初期化してdbにセット)
    
        query = await db.collection('overtimeApp').where('storeName','==',store).orderBy('date', 'desc') // firebase.firestore.QuerySnapshotのインスタンスを取得
        querySnapshot = await query.get();

        var stocklist = '<table class="table table-striped">'
        stocklist += '<tr><th>依頼日時</th><th>社員番号</th><th>氏名</th><th>申請日時</th><th>電話承認者</th><th>FMS承認者</th><th>状態</th><th>本部回答</th>';
        querySnapshot.forEach((postDoc) => {
            switch(postDoc.get('status')){
            //承認
            case 'approve':
                var statusText = "承認";
                stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>'+ postDoc.get('staffNum') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('date') + " " + postDoc.get('startDate') + "~" + postDoc.get('endDate') +  '</td><td>'+ postDoc.get('phoneApprover') +'</td><td>'+ postDoc.get('approvalPerson') +'</td><td>' + statusText + '</td><td>'+ postDoc.get('note') +'</td></tr></tbody>';
                break;
            //不承認      
            case 'disapproval':
                var statusText = "不承認";
                stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>'+ postDoc.get('staffNum') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('date') + " " + postDoc.get('startDate') + "~" + postDoc.get('endDate') +  '</td><td>'+ postDoc.get('phoneApprover') +'</td><td>'+ postDoc.get('approvalPerson') +'</td><td>' + statusText + '</td><td>'+ postDoc.get('note') +'</td></tr></tbody>';
                break;
            //未承認      
            default:
                var statusText = "未承認";
                stocklist += '<tbody class="yetBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>'+ postDoc.get('staffNum') +'</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('date') + " " + postDoc.get('startDate') + "~" + postDoc.get('endDate') +  '</td><td>'+ postDoc.get('phoneApprover') +'</td><td></td><td>' + statusText + '</td><td></td></tr></tbody>';
                break;        
            }
        })
        stocklist += '</table>';
        document.getElementById('table_list2').innerHTML = stocklist;

        } catch (err) {
            console.log(err);
        }
    })();
}