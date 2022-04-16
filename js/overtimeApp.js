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
    document.getElementById("order_date").textContent = "令和" + (year - 2018) + "年" + month + "月" + day + "日";
}

//DBへ追加
function POPDemandUpdate(){
    //氏名
    var name = document.getElementById('name').value;
    //作成日
    var createdAt = document.getElementById('order_date').textContent;
    console.log(createdAt);
    //日時
    var date = document.getElementById('date').value;
    var startDate = document.getElementById('startDate').value;
    var endDate = document.getElementById('endDate').value;
    var reason = document.getElementById('reason_detail').value;
    if(name == "" || date == "" || startDate == "" || endDate == "" || reason == ""){
        var Alert = document.getElementById('Alert');
        Alert.innerHTML = '<div class="alert alert-danger" role="alert">項目は全て記入してください。</div>';
    }else{
        //DBへ送信
        db.collection('overtimeApp').add({
            name:name,
            createdAt:createdAt,
            date:date,
            startDate:startDate,
            endDate:endDate,
            reason:reason,
            status:"unapproved",
        });
        var Alert = document.getElementById('Alert');
        Alert.innerHTML = '<div class="alert alert-success" role="alert">保存が完了しました。画面を閉じて終了してください。</div>';
    }
}