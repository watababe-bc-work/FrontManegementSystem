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

let ShowMonth;

// カレンダー表示
var year = "";
function showProcess(date) {
    year = date.getFullYear();
    ShowMonth = date.getMonth();
    document.querySelector('#header').innerHTML = "店舗設備点検予定表 " + year + "年 " + (ShowMonth + 1) + "月";
    var calendar = createProcess(year, ShowMonth);
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

//パラメータでのDB表示
const searchParams = decodeURI(window.location.search);
console.log(searchParams);
if(getParam('storename')){
    search(getParam('storename'));
    document.getElementById('storesSearch').value = getParam('storename');
}else{
    showDB();
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



//今日の予定を表示
function showDB(){
    (async () => {
        try {
            //選択した月のドキュメントが存在するかの確認
            var date = new Date(); 
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var monthlyDB = await db.collection('program').doc(year + '-' + month).get();
            if(monthlyDB.exists){
                //選択した日のコレクションが存在するかの確認
                var daylyDB = await db.collection('program').doc(year + '-' + (month)).collection('Day' + day).doc('firstData').get();
                if(daylyDB.exists){
                    //データを取得して表示
                    querySnapshot = await db.collection('program').doc(year + '-' + (month)).collection('Day' + day).orderBy('startTimeInput','asc').get();
                    var stocklist = '<table><tr><th>店舗名</th><th>項目</th><th>重要事項</th><th>時間</th><th>担当者</th><th>編集</th></tr>';
                    var i = 0;
                    querySnapshot.forEach((postDoc) => {
                        if(postDoc.id == "firstData"){
                            //表示しない
                        }else{
                            stocklist += '<tr><td>' + postDoc.get('storename') + '</td><td>' + postDoc.get('item') + '</td><td>' + postDoc.get('important') + '</td><td>' + postDoc.get('startTimeInput') + '~' +  postDoc.get('endTimeInput') + '</td><td>' + postDoc.get('rep') + '</td><td><a class="js-modal-open1"><button class="btn btn-primary" onClick="EditdairyContent(\''+day+'\',\''+ month +'\',\''+ postDoc.id +'\')">編集</button></a><button class="btn btn-secondary" onClick="DeletedairyContent(\''+day+'\',\''+ month +'\',\''+ postDoc.id +'\')">削除</button></td></tr>';
                        }
                        i++;
                    })
                    stocklist += '</table>';
                    if(i == 1){
                        document.getElementById('dairyContent').innerHTML = "<p>予定はありません</p>" + '<a class="js-modal-open"><button class="btn btn-success" onClick="AdddairyContent(\''+day+'\',\''+ month +'\')">追加する</button></a>';
                    }else{
                        document.getElementById('dairyContent').innerHTML = stocklist + '<a class="js-modal-open"><button class="btn btn-success" onClick="AdddairyContent(\''+day+'\',\''+ month +'\')">追加する</button></a>';
                    }
                    document.getElementById('dairyTitle').textContent = month + '月' + day + "日の内容";
                }else{
                    //コレクションを作成(同時に存在可否を調べるためのFirstDataドキュメントを新規作成)
                    db.collection('program').doc(year + '-' + (month)).collection('Day' + day).doc('firstData').set({
                        storename:'',
                        item:'',
                        startTimeInput:'',
                        endTimeInput:'',
                        rep:'',
                        important:'',
                    });
                    document.getElementById('dairyContent').innerHTML = "<p>予定はありません</p>" + '<a class="js-modal-open"><button class="btn btn-success" onClick="AdddairyContent(\''+day+'\',\''+ month +'\')">追加する</button></a>';
                    document.getElementById('dairyTitle').textContent = month + '月' + day + "日の内容";
                }
                showWeekDB();
            }else{
                showWeekDB();
                //ドキュメントを作成
                db.collection('program').doc(year + '-' + (month + 1)).set({});
                document.getElementById('dairyContent').innerHTML = '<p>予定はありません。</p>' + '<a class="js-modal-open"><button class="btn btn-success" onClick="AdddairyContent(\''+day+'\',\''+ month +'\')">追加する</button></a>';
                document.getElementById('dairyTitle').textContent = month + '月' + day + "日の内容";
            }
        } catch (err) {
            console.log(err);
        }
    })();
}

//今週１週間の予定を表示
function showWeekDB(){
    (async () => {
        try{
            date = new Date(); 
            year = date.getFullYear();
            var stocklist1 = '<table><tr><th>日付</th><th>店舗名</th><th>項目</th><th>重要事項</th><th>時間</th><th>担当者</th></tr>';
            var k = 0;
            var nextmonthList = [];
            var nextdayList = [];
            for(var i = 1;i < 8; i++){
                date.setDate(date.getDate() + 1);
                var nextmonth = date.getMonth() + 1;
                var nextday = date.getDate();
                nextmonthList.push(nextmonth);
                nextdayList.push(nextday);
                querySnapshot1 = await db.collection('program').doc(year + '-' + (nextmonth)).collection('Day' + nextday).orderBy('startTimeInput','asc').get();
                querySnapshot1.forEach((postDoc) => {
                    if(postDoc.id == "firstData"){
                    }else{
                        stocklist1 += '<tr><td>'+ nextmonth + '/' + nextday +'</td><td>' + postDoc.get('storename') + '</td><td>' + postDoc.get('item') + '</td><td>' + postDoc.get('important') + '</td><td>' + postDoc.get('startTimeInput') + '~' +  postDoc.get('endTimeInput') + '</td><td>' + postDoc.get('rep') + '</td></tr>';
                        k++;
                    }
                })
            }
            stocklist1 += '</table>';
            document.getElementById('AllmemoTitle').textContent = nextmonthList.shift() + "/" + nextdayList.shift() + "~" + nextmonthList.pop() + "/" + nextdayList.pop() + "の予定";
            if(k == 0){
                document.getElementById('AllmemoContent').innerHTML = "<p>今週の予定はありません。</p>";
            }else{
                document.getElementById('AllmemoContent').innerHTML = stocklist1;
            }
        }catch (err) {
            console.log(err);
        }    
    })();
}

//一ヶ月ごとの予定を表示
function showMonthDB(){
    (async () => {
        try{
            date = new Date(); 
            year = date.getFullYear();
            document.getElementById('AllmemoTitle').textContent = (ShowMonth + 1) + "月の予定";
            document.getElementById('AllmemoContent').innerHTML = "<p>検索中...</p>";
            var stocklist1 = '<table><tr><th>日付</th><th>店舗名</th><th>項目</th><th>重要事項</th><th>時間</th><th>担当者</th></tr>';
            var k = 0;
            for(var i = 1;i < 31; i++){
                querySnapshot1 = await db.collection('program').doc(year + '-' + (ShowMonth + 1)).collection('Day' + i).orderBy('startTimeInput','asc').get();
                querySnapshot1.forEach((postDoc) => {
                    if(postDoc.id == "firstData"){

                    }else{
                        stocklist1 += '<tr><td>'+ (ShowMonth + 1) + '/' + i +'</td><td>' + postDoc.get('storename') + '</td><td>' + postDoc.get('item') + '</td><td>' + postDoc.get('important') + '</td><td>' + postDoc.get('startTimeInput') + '~' +  postDoc.get('endTimeInput') + '</td><td>' + postDoc.get('rep') + '</td></tr>';
                        k++;
                    }
                })
            }
            stocklist1 += '</table>';
            if(k == 0){
                document.getElementById('AllmemoContent').innerHTML = "<p>"+ (ShowMonth + 1) +"月の予定はありません。</p>";
            }else{
                document.getElementById('AllmemoContent').innerHTML = stocklist1;
            }
        }catch (err) {
            console.log(err);
        }    
    })();
}


//各日付の詳細表示
function dairyShow(day,month){
    (async () => {
        try {
            date = new Date(); 
            year = date.getFullYear();
            const monthTrue = Number(month) + 1;
            //選択した月のドキュメントが存在するかの確認
            var monthlyDB = await db.collection('program').doc(year + '-' + (monthTrue)).get();
            if(monthlyDB.exists){
                //選択した日のコレクションが存在するかの確認
                var daylyDB = await db.collection('program').doc(year + '-' + (monthTrue)).collection('Day' + day).doc('firstData').get();
                if(daylyDB.exists){
                    //データを取得して表示
                    var storename = document.getElementById('storename_search').value;
                    console.log(storename);
                    // querySnapshot = await db.collection('program').doc(year + '-' + (monthTrue)).collection('Day' + day);
                    // if(storename == ""){
                    //     querySnapshot= querySnapshot.orderBy('startTimeInput','asc').get();
                    // }else{
                    //     querySnapshot = querySnapshot.where('storename','==',storename).orderBy('startTimeInput','asc').get();
                    // }
                    querySnapshot = await db.collection('program').doc(year + '-' + (monthTrue)).collection('Day' + day).orderBy('startTimeInput','asc').get();
                    var stocklist = '<table><tr><th>店舗名</th><th>項目</th><th>重要事項</th><th>時間</th><th>担当者</th><th>編集</th></tr>';
                    var i = 0;
                    querySnapshot.forEach((postDoc) => {
                        if(postDoc.id == "firstData"){
                            //表示しない
                        }else{
                            stocklist += '<tr><td>' + postDoc.get('storename') + '</td><td>' + postDoc.get('item') + '</td><td>' + postDoc.get('important') + '</td><td>' + postDoc.get('startTimeInput') + '~' +  postDoc.get('endTimeInput') + '</td><td>' + postDoc.get('rep') + '</td><td><a class="js-modal-open1"><button class="btn btn-primary" onClick="EditdairyContent(\''+day+'\',\''+ monthTrue +'\',\''+ postDoc.id +'\')">編集</button><button class="btn btn-secondary" onClick="DeletedairyContent(\''+day+'\',\''+ monthTrue +'\',\''+ postDoc.id +'\')">削除</button></td></tr>';
                        }
                        i++;
                    })
                    stocklist += '</table>';
                    if(i == 1){
                        document.getElementById('dairyContent').innerHTML = "<p>予定はありません</p>" + '<a class="js-modal-open"><button class="btn btn-success" onClick="AdddairyContent(\''+day+'\',\''+ monthTrue +'\')">追加する</button></a>';
                    }else{
                        document.getElementById('dairyContent').innerHTML = stocklist + '<a class="js-modal-open"><button class="btn btn-success" onClick="AdddairyContent(\''+day+'\',\''+ monthTrue +'\')">追加する</button></a>';
                    }
                    document.getElementById('dairyTitle').textContent = monthTrue + "月" +  day + "日の内容";
                }else{
                    //コレクションを作成(同時に存在可否を調べるためのFirstDataドキュメントを新規作成)
                    db.collection('program').doc(year + '-' + (monthTrue)).collection('Day' + day).doc('firstData').set({
                        storename:'',
                        item:'',
                        startTimeInput:'',
                        endTimeInput:'',
                        rep:'',
                        important:'',
                    });
                    document.getElementById('dairyContent').innerHTML = "<p>予定はありません</p>" + '<a class="js-modal-open"><button class="btn btn-success" onClick="AdddairyContent(\''+day+'\',\''+ monthTrue +'\')">追加する</button></a>';
                    document.getElementById('dairyTitle').textContent = monthTrue + "月" +  day + "日の内容";
                }

                //今週の予定を表示
                var stocklist1 = '<table><tr><th>日付</th><th>店舗名</th><th>項目</th><th>重要事項</th><th>時間</th><th>担当者</th></tr>';
                var k = 0;
                var nextmonthList = [];
                var nextdayList = [];
                for(var i = 1;i < 8; i++){
                    date.setDate(date.getDate() + 1);
                    var nextmonth = date.getMonth() + 1;
                    var nextday = date.getDate();
                    nextmonthList.push(nextmonth);
                    nextdayList.push(nextday);
                    querySnapshot1 = await db.collection('program').doc(year + '-' + (nextmonth)).collection('Day' + nextday).orderBy('startTimeInput','asc').get();
                    querySnapshot1.forEach((postDoc) => {
                        if(postDoc.id == "firstData"){

                        }else{
                            stocklist1 += '<tr><td>'+ nextmonth + '/' + nextday +'</td><td>' + postDoc.get('storename') + '</td><td>' + postDoc.get('item') + '</td><td>' + postDoc.get('important') + '</td><td>' + postDoc.get('startTimeInput') + '~' +  postDoc.get('endTimeInput') + '</td><td>' + postDoc.get('rep') + '</td></tr>';
                            k++;
                        }
                    })
                }
                stocklist1 += '</table>';
                document.getElementById('AllmemoTitle').textContent = nextmonthList.shift() + "/" + nextdayList.shift() + "~" + nextmonthList.pop() + "/" + nextdayList.pop() + "の予定";
                if(k == 0){
                    document.getElementById('AllmemoContent').innerHTML = "<p>今週の予定はありません。</p>";
                }else{

                    document.getElementById('AllmemoContent').innerHTML = stocklist1;
                }
            }else{
                //ドキュメントを作成
                db.collection('program').doc(year + '-' + (monthTrue)).set({});
                document.getElementById('dairyContent').innerHTML = '<p>予定はありません。</p>' + '<a class="js-modal-open"><button class="btn btn-success" onClick="AdddairyContent(\''+day+'\',\''+ monthTrue +'\')">追加する</button></a>';
                document.getElementById('dairyTitle').textContent = monthTrue + "月" +  day + "日の内容";
                //今週の予定を表示
                var stocklist1 = '<table><tr><th>日付</th><th>店舗名</th><th>項目</th><th>重要事項</th><th>時間</th><th>担当者</th></tr>';
                var k = 0;
                var nextmonthList = [];
                var nextdayList = [];
                for(var i = 1;i < 8; i++){
                    date.setDate(date.getDate() + 1);
                    var nextmonth = date.getMonth() + 1;
                    var nextday = date.getDate();
                    nextmonthList.push(nextmonth);
                    nextdayList.push(nextday);
                    querySnapshot1 = await db.collection('program').doc(year + '-' + (nextmonth)).collection('Day' + nextday).orderBy('startTimeInput','asc').get();
                    querySnapshot1.forEach((postDoc) => {
                        if(postDoc.id == "firstData"){

                        }else{
                            stocklist1 += '<tr><td>'+ nextmonth + '/' + nextday +'</td><td>' + postDoc.get('storename') + '</td><td>' + postDoc.get('item') + '</td><td>' + postDoc.get('important') + '</td><td>' + postDoc.get('startTimeInput') + '~' +  postDoc.get('endTimeInput') + '</td><td>' + postDoc.get('rep') + '</td></tr>';
                            k++;
                        }
                    })
                }
                stocklist1 += '</table>';
                document.getElementById('AllmemoTitle').textContent = nextmonthList.shift() + "/" + nextdayList.shift() + "~" + nextmonthList.pop() + "/" + nextdayList.pop() + "の予定";
                if(k == 0){
                    document.getElementById('AllmemoContent').innerHTML = "<p>今週の予定はありません。</p>";
                }else{

                    document.getElementById('AllmemoContent').innerHTML = stocklist1;
                }
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

//日付別日程追加
function AdddairyContentDB(day,month){
    const rep = document.getElementById('rep_input').value;
    const storename = document.getElementById('storename_input').value;
    const start = document.getElementById('start_time_input').value;
    const end = document.getElementById('end_time_input').value;
    const item = document.getElementById('item_input').value;
    const important = document.getElementById('important_input').value;

    //DBへ送信
    db.collection('program').doc(year + '-' + (month)).collection('Day' + day).add({
        storename:storename,
        item:item,
        startTimeInput:start,
        endTimeInput:end,
        rep:rep,
        important:important,
        createdAt:year + '-' + month + '-' + day,
    });
    var collectAlert = document.getElementById('collectAlert');
    collectAlert.innerHTML = '<div class="alert alert-success" role="alert">編集完了!リロードします。</div>';
    setTimeout("location.reload()",2000);
}

//formクリア
function dairyFormClear(){
    document.dairyContents.reset();
}

function searchClear(){
    //パラメータに他の店舗名があるとややこしいので、素のURLにしておく
    window.history.replaceState('','','program.html');
    document.searchContents.reset();
    showDB();
}

//日付別日程編集モーダルウィンドウ
function EditdairyContent(day,month,id){
    document.getElementById('EditdairyTitle').textContent = month + "月" + day + "日の内容編集";
    (async () => {
        var editDairyDB = await db.collection('program').doc(year + '-' + (month)).collection('Day' + day).doc(id).get();
        //店舗名
        document.getElementById('storename_edit').value = editDairyDB.get('storename');
        //項目
        document.getElementById('item_edit').value = editDairyDB.get('item');
        //重要事項
        document.getElementById('important_edit').value = editDairyDB.get('important');
        //時間
        month = month.padStart(2, '0');
        day = day.padStart(2, '0');
        document.getElementById('date_edit').value = year + '-' + month + '-' + day;
        document.getElementById('start_time_edit').value = editDairyDB.get('startTimeInput');
        document.getElementById('end_time_edit').value = editDairyDB.get('endTimeInput');
        //担当者
        document.getElementById('rep_edit').value = editDairyDB.get('rep');

        document.getElementById('EditdairyButton').innerHTML = '<button class="btn btn-success" onClick="EditdairyContentDB(\''+day+'\',\''+ month +'\',\''+ id +'\')">編集する</button>'
    })();
}

//日付別日程編集
function EditdairyContentDB(day,month,id){
    const rep = document.getElementById('rep_edit').value;
    const storename = document.getElementById('storename_edit').value;
    const date = document.getElementById('date_edit').value;
    const start = document.getElementById('start_time_edit').value;
    const end = document.getElementById('end_time_edit').value;
    const item = document.getElementById('item_edit').value;
    const important = document.getElementById('important_edit').value;

    if(date == year + "-" + month + "-" + day){
        //update
        const newmonth = Number(month);
        const newday = Number(day);
        db.collection('program').doc(year + '-' + (newmonth)).collection('Day' + newday).doc(id).update({
            storename:storename,
            item:item,
            startTimeInput:start,
            endTimeInput:end,
            rep:rep,
            important:important,
            createdAt:year + '-' + newmonth + '-' + newday,
        });
    }else{
        //新規登録して古い方を削除
        const newMonth = Number(date.substr(5,2));
        const newDay = Number(date.substr(8));
        db.collection('program').doc(year + '-' + (newMonth)).collection('Day' + newDay).add({
            storename:storename,
            item:item,
            startTimeInput:start,
            endTimeInput:end,
            rep:rep,
            important:important,
            createdAt:year + '-' + newMonth + '-' + newDay,
        });
        month = Number(month);
        day = Number(day);
        db.collection('program').doc(year + '-' + (month)).collection('Day' + day).doc(id).delete();
    }
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

//検索
function search(storename){
    const item = document.getElementById('item_search').value;
    document.getElementById('search_button').textContent = "検索中...";
    document.getElementById('AllmemoContent').innerHTML = "<p>検索中...</p>";

    (async () => {
        try {
            var stocklist2 = '<table><tr><th>日付</th><th>店舗名</th><th>項目</th><th>重要事項</th><th>時間</th><th>担当者</th></tr>';
            //プログラムDBを呼び出す
            query = await db.collection('program').get();
            var k = 0;
            var subCollectionList = [];
            //プログラムDB内にあるドキュメントを全て呼び出す
            query.forEach(async(postDoc) => {
                //呼び出したドキュメント内のコレクションも全て呼び出す
                for(var i = 1;i < 32;i++){
                    var subCollection = await db.collection('program').doc(postDoc.id).collection('Day' + i);
                    if(storename != ''){
                        subCollection = subCollection.where('storename','==',storename);
                        if(item != ''){
                            subCollection = subCollection.where('item','==',item);
                            document.getElementById('AllmemoTitle').textContent = "検索内容：" + storename + "," + item;
                        }else{
                            document.getElementById('AllmemoTitle').textContent = "検索内容：" + storename;
                        }
                    }else{
                        if(item != ''){
                            subCollection = subCollection.where('item','==',item);
                            document.getElementById('AllmemoTitle').textContent = "検索内容：" + item;
                        }
                    }
                    subCollection = await subCollection.get();
                    subCollection.forEach(async(postDoc1) => {
                        //出力された値の日付ソートのための配列に格納
                        subCollectionList.push([new Date(postDoc1.get('createdAt')),'<tr><td>'+ postDoc.id + '-' + i +'</td><td>' + postDoc1.get('storename') + '</td><td>' + postDoc1.get('item') + '</td><td>' + postDoc1.get('important') + '</td><td>' + postDoc1.get('startTimeInput') + '~' +  postDoc1.get('endTimeInput') + '</td><td>' + postDoc1.get('rep') + '</td></tr>']);
                    });
                };
                if(subCollectionList.length == 0){
                    document.getElementById('AllmemoContent').innerHTML = "<p>予定はありません。</p>";
                }else{
                    //日付と出力HTMLが入った配列を日付でソート
                    subCollectionList.sort(function(a,b){return (a[0] < b[0] ? 1 : -1);});
                    if(k < subCollectionList.length){
                        stocklist2 += subCollectionList[k][1];
                        console.log(stocklist2);
                        document.getElementById('AllmemoContent').innerHTML = stocklist2;
                        document.getElementById('search_button').textContent = "検索する";
                    }
                }
                k++;
            });
        } catch (err) {
            console.log(err);
        }
    })();
}

//検索
function searchForm(){
    const storename = document.getElementById('storename_search').value;
    const item = document.getElementById('item_search').value;
    document.getElementById('search_button').textContent = "検索中...";
    document.getElementById('AllmemoContent').innerHTML = "<p>検索中...</p>";

    (async () => {
        try {
            var stocklist2 = '<table><tr><th>日付</th><th>店舗名</th><th>項目</th><th>重要事項</th><th>時間</th><th>担当者</th></tr>';
            //プログラムDBを呼び出す
            query = await db.collection('program').get();
            var k = 0;
            var subCollectionList = [];
            //プログラムDB内にあるドキュメントを全て呼び出す
            query.forEach(async(postDoc) => {
                //呼び出したドキュメント内のコレクションも全て呼び出す
                for(var i = 1;i < 32;i++){
                    var subCollection = await db.collection('program').doc(postDoc.id).collection('Day' + i);
                    if(storename != ''){
                        subCollection = subCollection.where('storename','==',storename);
                        if(item != ''){
                            subCollection = subCollection.where('item','==',item);
                            document.getElementById('AllmemoTitle').textContent = "検索内容：" + storename + "," + item;
                        }else{
                            document.getElementById('AllmemoTitle').textContent = "検索内容：" + storename;
                        }
                    }else{
                        if(item != ''){
                            subCollection = subCollection.where('item','==',item);
                            document.getElementById('AllmemoTitle').textContent = "検索内容：" + item;
                        }
                    }
                    subCollection = await subCollection.get();
                    subCollection.forEach(async(postDoc1) => {
                        //出力された値の日付ソートのための配列に格納
                        subCollectionList.push([new Date(postDoc1.get('createdAt')),'<tr><td>'+ postDoc.id + '-' + i +'</td><td>' + postDoc1.get('storename') + '</td><td>' + postDoc1.get('item') + '</td><td>' + postDoc1.get('important') + '</td><td>' + postDoc1.get('startTimeInput') + '~' +  postDoc1.get('endTimeInput') + '</td><td>' + postDoc1.get('rep') + '</td></tr>']);
                    });
                };
                if(subCollectionList.length == 0){
                    document.getElementById('AllmemoContent').innerHTML = "<p>予定はありません。</p>";
                }else{
                    //日付と出力HTMLが入った配列を日付でソート
                    subCollectionList.sort(function(a,b){return (a[0] < b[0] ? 1 : -1);});
                    if(k < subCollectionList.length){
                        stocklist2 += subCollectionList[k][1];
                        console.log(stocklist2);
                        document.getElementById('AllmemoContent').innerHTML = stocklist2;
                        document.getElementById('search_button').textContent = "検索する";
                    }
                }
                k++;
            });
        } catch (err) {
            console.log(err);
        }
    })();
}