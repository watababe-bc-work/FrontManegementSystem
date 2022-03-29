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
                    calendar += "<td class='today'><a href = '#attendancedetail' onclick = 'dairyShow("+ count + ","+ month +")'>"+ count +"</a></td>";
                } else {
                    calendar += "<td><a href = '#attendancedetail' onclick = 'dairyShow("+ count + ","+ month +")'>"+ count +"</a></td>";
                }
            }
        }
        calendar += "</tr>";
    }
    return calendar;
}

//今日の予定を表示
(async () => {
    try {
        var date = new Date(); 
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        //選択した月のドキュメントが存在するかの確認
        var monthlyDB = await db.collection('program').doc(year + '-' + (month)).get();
        if(monthlyDB.exists){
            //選択した日のコレクションが存在するかの確認
            var daylyDB = await db.collection('program').doc(year + '-' + (month)).collection('Day' + day).doc('firstData').get();
            if(daylyDB.exists){
                //データを取得して表示
                querySnapshot = await await db.collection('program').doc(year + '-' + (month)).collection('Day' + day).get();
                var stocklist = '<div>';
                var i = 0;
                querySnapshot.forEach((postDoc) => {
                    if(postDoc.id == "firstData"){
                        stocklist += '<p>' + postDoc.get('rep') + ' ' + postDoc.get('storename') + ' ' + postDoc.get('time') + ' ' + postDoc.get('item') + ' ' + postDoc.get('content') + '</p>';
                    }else{
                        stocklist += '<div class="insertContents"><p>' + postDoc.get('rep') + ' ' + postDoc.get('storename') + ' ' + postDoc.get('time') + ' ' + postDoc.get('item') + '<br>' + postDoc.get('content') + '</p><button class="btn btn-secondary" onClick="DeletedairyContent(\''+day+'\',\''+ month +'\',\''+ postDoc.id +'\')">削除する</button></div>';
                    }
                    i++;
                })
                stocklist += '</div>';
                if(i == 1){
                    document.getElementById('dairyContent').innerHTML = "<p>予定はありません</p>" + '<a class="js-modal-open"><button class="btn btn-success" onClick="AdddairyContent(\''+day+'\',\''+ month +'\')">追加する</button></a>';
                }else{
                    document.getElementById('dairyContent').innerHTML = stocklist + '<a class="js-modal-open"><button class="btn btn-success" onClick="AdddairyContent(\''+day+'\',\''+ month +'\')">追加する</button></a>';
                }
                document.getElementById('dairyTitle').textContent = "本日の内容";
            }else{
                //コレクションを作成(同時に存在可否を調べるためのFirstDataドキュメントを新規作成)
                db.collection('program').doc(year + '-' + (month)).collection('Day' + day).doc('firstData').set({
                    storename:'',
                    item:'',
                    time:'',
                    rep:'',
                    content:'',
                });
                document.getElementById('dairyContent').innerHTML = "<p>予定はありません</p>" + '<a class="js-modal-open"><button class="btn btn-success" onClick="AdddairyContent(\''+day+'\',\''+ month +'\')">追加する</button></a>';
                document.getElementById('dairyTitle').textContent = "本日の内容";
            }

            //全体メモを表示
            querySnapshot1 = await db.collection('program').doc(year + '-' + (month)).collection('Allmemo').get();
            var stocklist1 = '<div>';
            var i = 0;
            querySnapshot1.forEach((postDoc) => {
                if(postDoc.id == "firstdata"){
                    stocklist1 += '<p>' + postDoc.get('content') + '</p>';
                }else{
                    stocklist1 += '<div class="insertContents"><p>' + postDoc.get('content') + '</p><button class="btn btn-secondary" onClick="DeleteAllmemoContent(\''+month+'\',\''+ postDoc.id +'\')">削除する</button></div>';
                }
                i++;
            })
            stocklist1 += '</div>';
            if(i == 1){
                document.getElementById('AllmemoContent').innerHTML = "<p>全体メモはありません</p>" + '<a class="js-modal-open1"><button class="btn btn-success" onClick="AddAllmemo(\''+day+'\',\''+ month +'\')">追加する</button></a>';
            }else{
                document.getElementById('AllmemoContent').innerHTML = stocklist1 + '<a class="js-modal-open1"><button class="btn btn-success" onClick="AddAllmemo(\''+day+'\',\''+ month +'\')">追加する</button></a>';
            }
        }else{
            //ドキュメントを作成
            db.collection('program').doc(year + '-' + (month + 1)).set({});
            db.collection('program').doc(year + '-' + (month + 1)).collection('Allmemo').doc('firstdata').set({
                content:'',
            });
            document.getElementById('dairyContent').innerHTML = '<p>予定はありません。</p>' + '<a class="js-modal-open"><button class="btn btn-success" onClick="AdddairyContent(\''+day+'\',\''+ month +'\')">追加する</button></a>';
            document.getElementById('dairyTitle').textContent = "本日の内容";
            document.getElementById('AllmemoContent').innerHTML = '<p>全体メモはありません。</p>' + '<a class="js-modal-open1"><button class="btn btn-success" onClick="AddAllmemo(\''+day+'\',\''+ month +'\')">追加する</button></a>';
        }
    } catch (err) {
    console.log(`Error: ${JSON.stringify(err)}`)
    }
})();

//各日付の詳細表示
function dairyShow(day,month){
    (async () => {
        try {
            var date = new Date(); 
            var TodaysMonth = date.getMonth() + 1;
            var TodaysDay = date.getDate();
            const monthTrue = Number(month) + 1;
            //選択した月のドキュメントが存在するかの確認
            var monthlyDB = await db.collection('program').doc(year + '-' + (monthTrue)).get();
            if(monthlyDB.exists){
                //選択した日のコレクションが存在するかの確認
                var daylyDB = await db.collection('program').doc(year + '-' + (monthTrue)).collection('Day' + day).doc('firstData').get();
                if(daylyDB.exists){
                    //データを取得して表示
                    querySnapshot = await await db.collection('program').doc(year + '-' + (monthTrue)).collection('Day' + day).get();
                    var stocklist = '<div>';
                    var i = 0;
                    querySnapshot.forEach((postDoc) => {
                        if(postDoc.id == "firstData"){
                            stocklist += '<p>' + postDoc.get('rep') + ' ' + postDoc.get('storename') + ' ' + postDoc.get('time') + ' ' + postDoc.get('item') + ' ' + postDoc.get('content') + '</p>';
                        }else{
                            stocklist += '<div class="insertContents"><p>' + postDoc.get('rep') + ' ' + postDoc.get('storename') + ' ' + postDoc.get('time') + ' ' + postDoc.get('item') + ' ' + postDoc.get('content') + '</p><button class="btn btn-secondary" onClick="DeletedairyContent(\''+day+'\',\''+ monthTrue +'\',\''+ postDoc.id +'\')">削除する</button></div>';
                        }
                        i++;
                    })
                    stocklist += '</div>';
                    if(i == 1){
                        document.getElementById('dairyContent').innerHTML = "<p>予定はありません</p>" + '<a class="js-modal-open"><button class="btn btn-success" onClick="AdddairyContent(\''+day+'\',\''+ monthTrue +'\')">追加する</button></a>';
                    }else{
                        document.getElementById('dairyContent').innerHTML = stocklist + '<a class="js-modal-open"><button class="btn btn-success" onClick="AdddairyContent(\''+day+'\',\''+ monthTrue +'\')">追加する</button></a>';
                    }
                    document.getElementById('dairyTitle').textContent = day + "日の内容";
                }else{
                    //コレクションを作成(同時に存在可否を調べるためのFirstDataドキュメントを新規作成)
                    db.collection('program').doc(year + '-' + (monthTrue)).collection('Day' + day).doc('firstData').set({
                        storename:'',
                        item:'',
                        time:'',
                        rep:'',
                        content:'',
                    });
                    document.getElementById('dairyContent').innerHTML = "<p>予定はありません</p>" + '<a class="js-modal-open"><button class="btn btn-success" onClick="AdddairyContent(\''+day+'\',\''+ monthTrue +'\')">追加する</button></a>';
                    document.getElementById('dairyTitle').textContent = day + "日の内容";
                }

                //全体メモを表示
                querySnapshot1 = await db.collection('program').doc(year + '-' + (monthTrue)).collection('Allmemo').get();
                var stocklist1 = '<div>';
                var i = 0;
                querySnapshot1.forEach((postDoc) => {
                    if(postDoc.id == "firstdata"){
                        stocklist1 += '<p>' + postDoc.get('content') + '</p>';
                    }else{
                        stocklist1 += '<div class="insertContents"><p>' + postDoc.get('content') + '</p><button class="btn btn-secondary" onClick="DeleteAllmemoContent(\''+monthTrue+'\',\''+ postDoc.id +'\')">削除する</button></div>';
                    }
                    i++;
                })
                stocklist1 += '</div>';
                if(i == 1){
                    console.log(i);
                    document.getElementById('AllmemoContent').innerHTML = "<p>全体メモはありません</p>" + '<a class="js-modal-open1"><button class="btn btn-success" onClick="AddAllmemo(\''+day+'\',\''+ monthTrue +'\')">追加する</button></a>';
                }else{
                    console.log(i);
                    document.getElementById('AllmemoContent').innerHTML = stocklist1 + '<a class="js-modal-open1"><button class="btn btn-success" onClick="AddAllmemo(\''+day+'\',\''+ monthTrue +'\')">追加する</button></a>';
                }
            }else{
                //ドキュメントを作成
                db.collection('program').doc(year + '-' + (monthTrue)).set({});
                db.collection('program').doc(year + '-' + (monthTrue)).collection('Allmemo').doc('firstdata').set({
                    content:'',
                });
                document.getElementById('dairyContent').innerHTML = '<p>予定はありません。</p>' + '<a class="js-modal-open"><button class="btn btn-success" onClick="AdddairyContent(\''+day+'\',\''+ monthTrue +'\')">追加する</button></a>';
                document.getElementById('dairyTitle').textContent = day + "日の内容";
                document.getElementById('AllmemoContent').innerHTML = '<p>全体メモはありません。</p>' + '<a class="js-modal-open1"><button class="btn btn-success" onClick="AddAllmemo(\''+day+'\',\''+ monthTrue +'\')">追加する</button></a>';
            }

            if(TodaysDay == day && TodaysMonth == monthTrue){
                document.getElementById('dairyTitle').textContent = "本日の内容";
            }
        } catch (err) {
        console.log(`Error: ${JSON.stringify(err)}`)
        }
    })();
}

//日付別日程モーダルウィンドウ
function AdddairyContent(day,month){
    document.getElementById('AdddairyTitle').textContent = month + '月' + day + '日の予定新規登録';
    document.getElementById('AdddairyButton').innerHTML = '<a class="js-modal-open"><button class="btn btn-success" onClick="AdddairyContentDB(\''+day+'\',\''+ month +'\')">追加する</button></a>';
}

//全体メモモーダルウィンドウ
function AddAllmemo(day,month){
    document.getElementById('AddAllmemoButton').innerHTML = '<a class="js-modal-open1"><button class="btn btn-success" onClick="AddAllmemoDB(\''+day+'\',\''+ month +'\')">追加する</button></a>';
}

//日付別日程追加
function AdddairyContentDB(day,month){
    const rep = document.getElementById('rep_input').value;
    const storename = document.getElementById('storename_input').value;
    const date = document.getElementById('date_input').value;
    const time = document.getElementById('time_input').value;
    const item = document.getElementById('item_input').value;
    const content = document.getElementById('content_input').value;

    //DBへ送信
    db.collection('program').doc(year + '-' + (month)).collection('Day' + day).add({
        storename:storename,
        item:item,
        date:date,
        time:time,
        rep:rep,
        content:content,
    });
    var collectAlert = document.getElementById('collectAlert');
    collectAlert.innerHTML = '<div class="alert alert-success" role="alert">編集完了!リロードします。</div>';
    setTimeout("location.reload()",2000);
}

//全体メモ追加
function AddAllmemoDB(day,month){
    const content = document.getElementById('AllmemoContent_input').value;

    //DBへ送信
    db.collection('program').doc(year + '-' + (month)).collection('Allmemo').add({
        content:content,
    });
    var collectAlert = document.getElementById('collectAlert1');
    collectAlert.innerHTML = '<div class="alert alert-success" role="alert">編集完了!リロードします。</div>';
    setTimeout("location.reload()",2000);
}

//日付別日程削除
function DeletedairyContent(day,month,id){
    var res = window.confirm(day + "日の指定項目を削除しますか？");
    if( res ) {
        db.collection('program').doc(year + '-' + (month)).collection('Day' + day).doc(id).delete();
        alert("削除されました。");
        setTimeout("location.reload()",500);
    }
    else {
        // キャンセルならアラートボックスを表示
        alert("キャンセルしました。");
    } 
}

//全体メモ削除
function DeleteAllmemoContent(month,id){
    var res = window.confirm("全体メモの指定項目を削除しますか？");
    if( res ) {
        db.collection('program').doc(year + '-' + (month)).collection('Allmemo').doc(id).delete();
        alert("削除されました。");
        setTimeout("location.reload()",500);
    }
    else {
        // キャンセルならアラートボックスを表示
        alert("キャンセルしました。");
    } 
}
