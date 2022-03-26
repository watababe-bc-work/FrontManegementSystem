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

const week = ["日", "月", "火", "水", "木", "金", "土"];
const today = new Date();
// 月末だとずれる可能性があるため、1日固定で取得
var showDate = new Date(today.getFullYear(), today.getMonth(), 1);

// 初期表示
window.onload = function () {
    showProcess(today, calendar);
    //createDB();
};
// 前の月表示
function prev(){
    showDate.setMonth(showDate.getMonth() - 1);
    showProcess(showDate);
}

// 次の月表示
function next(){
    showDate.setMonth(showDate.getMonth() + 1);
    showProcess(showDate);
}

// カレンダー表示
var year = "";
function showProcess(date) {
    year = date.getFullYear();
    var month = date.getMonth();
    document.querySelector('#header').innerHTML = year + "年 " + (month + 1) + "月";

    var calendar = createProcess(year, month);
    document.querySelector('#calendar').innerHTML = calendar;
}

// カレンダー作成
function createProcess(year, month) {
    // 曜日
    var calendar = "<table><tr class='dayOfWeek'>";
    for (var i = 0; i < week.length; i++) {
        calendar += "<th>" + week[i] + "</th>";
    }
    calendar += "</tr>";

    var count = 0;
    var startDayOfWeek = new Date(year, month, 1).getDay();
    var endDate = new Date(year, month + 1, 0).getDate();
    var lastMonthEndDate = new Date(year, month, 0).getDate();
    var row = Math.ceil((startDayOfWeek + endDate) / week.length);

    // 1行ずつ設定
    for (var i = 0; i < row; i++) {
        calendar += "<tr>";
        // 1colum単位で設定
        for (var j = 0; j < week.length; j++) {
            if (i == 0 && j < startDayOfWeek) {
                // 1行目で1日まで先月の日付を設定
                calendar += "<td class='disabled'>" + (lastMonthEndDate - startDayOfWeek + j + 1) + "</td>";
            } else if (count >= endDate) {
                // 最終行で最終日以降、翌月の日付を設定
                count++;
                calendar += "<td class='disabled'>" + (count - endDate) + "</td>";
            } else {
                // 当月の日付を曜日に照らし合わせて設定
                count++;
                if(year == today.getFullYear()
                  && month == (today.getMonth())
                  && count == today.getDate()){
                    calendar += "<td class='today'><a href = '#attendancedetail'><button onclick = 'dairyShow("+ count + ","+ month +")'>" + count + "</button></a></td>";
                } else {
                    calendar += "<td><a href = '#attendancedetail'><button onclick = 'dairyShow("+ count + ","+ month +")'>" + count + "</button></a></td>";
                }
            }
        }
        calendar += "</tr>";
    }
    return calendar;
}

//各日付の詳細表示
function dairyShow(day,month){
    (async () => {
        try {
            //選択した月のドキュメントが存在するかの確認
            var monthlyDB = await db.collection('program').doc(year + '-' + (month + 1)).get();
            if(monthlyDB.exists){
                //選択した日のコレクションが存在するかの確認
                var daylyDB = await db.collection('program').doc(year + '-' + (month + 1)).collection('Day' + day).doc('firstData').get();
                if(daylyDB.exists){
                    //データを取得して表示
                    querySnapshot = await await db.collection('program').doc(year + '-' + (month + 1)).collection('Day' + day).get();
                    var stocklist = '<div>';
                    var i = 0;
                    querySnapshot.forEach((postDoc) => {
                        stocklist += '<p>' + postDoc.get('rep') + ' ' + postDoc.get('storename') + ' ' + postDoc.get('time') + ' ' + postDoc.get('item') + ' ' + postDoc.get('content') + '</p>';
                        i++;
                    })
                    stocklist += '</div>';
                    if(i == 1){
                        document.getElementById('dairyContent').innerHTML = "<p>予定はありません</p>";
                    }else{
                        document.getElementById('dairyContent').innerHTML = stocklist;
                    }
                    document.getElementById('dairyTitle').textContent = day + "日の内容";
                }else{
                    //コレクションを作成(同時に存在可否を調べるためのFirstDataドキュメントを新規作成)
                    db.collection('program').doc(year + '-' + (month + 1)).collection('Day' + day).doc('firstData').set({
                        storename:'',
                        item:'',
                        time:'',
                        rep:'',
                        content:'',
                    });
                    document.getElementById('dairyContent').innerHTML = "<p>予定はありません</p>";
                    document.getElementById('dairyTitle').textContent = day + "日の内容";
                }

                //全体メモを表示
                querySnapshot1 = await await db.collection('program').doc(year + '-' + (month + 1)).collection('Allmemo').get();
                var stocklist1 = '<div>';
                var i = 0;
                querySnapshot1.forEach((postDoc) => {
                    stocklist1 += '<p>' + postDoc.get('content') + '</p>';
                    i++;
                })
                stocklist1 += '</div>';
                if(i == 1){
                    document.getElementById('AllmemoContent').innerHTML = "<p>全体メモはありません</p>";
                }else{
                    document.getElementById('AllmemoContent').innerHTML = stocklist1;
                }
            }else{
                //ドキュメントを作成
                db.collection('program').doc(year + '-' + (month + 1)).set({});
                db.collection('program').doc(year + '-' + (month + 1)).collection('Allmemo').doc('firstdata').set({
                    content:'',
                });
                document.getElementById('dairyContent').innerHTML = '<p>予定はありません。</p>';
                document.getElementById('dairyTitle').textContent = day + "日の内容";
                document.getElementById('AllmemoContent').innerHTML = '<p>全体メモはありません。</p>';
            }
        } catch (err) {
        console.log(`Error: ${JSON.stringify(err)}`)
        }
    })();
}


