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

function addCertificateContent(){
    document.getElementById('addForm').style.display = "block";
}

function adduniformContent(){
    document.getElementById('addForm2').style.display = "block";
}

//必要書類のinput追加
function paperInput(){
    var paperStatus = document.getElementById('paper').value;
    switch(paperStatus){
        case "源泉徴収票":
            document.getElementById('paper_input').innerHTML = '<input type="text" id="tax_withholding">年分';
        break;
        case "給与明細":
                document.getElementById('paper_input').innerHTML = '期間：<input type="date" id="payroll_item_start">~<input type="date" id="payroll_item_end">';
        break;
        case "賃金台帳":
                document.getElementById('paper_input').innerHTML = '期間：<input type="date" id="wage_ledger_start">~<input type="date" id="wage_ledger_end">';
        break;
        case "その他":
                document.getElementById('paper_input').innerHTML = '<input type="text" id="other">';
        break;
        default:
                document.getElementById('paper_input').innerHTML = '';
        break;
    }
}

//証明書等
//DBへ追加
function certificateUpdate(){
    //社員番号
    var staffNum = document.getElementById('staffNum').value;
    //氏名
    var name = document.getElementById('name').value;
    //申請日
    var createdAt = document.getElementById('order_date').textContent;
    //所属店舗
    var storeName = document.getElementById('store_name').value;
    //必要書類
    var paper = document.getElementById('paper').value;
    //必要書類input
    switch(paper){
        case "源泉徴収票":
            var tax_withholding = document.getElementById('tax_withholding').value;
        break;
        case "給与明細":
            var payroll_item_start = document.getElementById('payroll_item_start').value;
            var payroll_item_end = document.getElementById('payroll_item_end').value;
        break;
        case "賃金台帳":
            var wage_ledger_start = document.getElementById('wage_ledger_start').value;
            var wage_ledger_end = document.getElementById('wage_ledger_end').value;
        break;
        case "その他":
            var other = document.getElementById('other').value;
        break;
        default:
        break;
    }
    //必要部数
    var required_number = document.getElementById('required_number').value;
    //提出先
    var submission_target = document.getElementById('submission_target').value;
    //理由
    var reason = document.getElementById('reason_detail').value;
    //希望期日
    var endDate = document.getElementById('enddate').value;
    //備考
    var note = document.getElementById('note_detail').value;
    if(staffNum == "" || name == "" || storeName == "" || reason == "" || paper == "" || required_number == ""){
        var Alert = document.getElementById('Alert');
        Alert.innerHTML = '<div class="alert alert-danger" role="alert">項目は全て記入してください。</div>';
    }else{
        //DBへ送信
        switch(paper){
            case "源泉徴収票":
                db.collection('certificates').add({
                    staffNum:staffNum,
                    name:name,
                    createdAt:createdAt,
                    storeName:storeName,
                    paper:paper,
                    required_number:required_number,
                    submission_target:submission_target,
                    reason:reason,
                    endDate:endDate,
                    note:note,
                    tax_withholding:tax_withholding,
                    status:"unapproved",
                });
            break;
            case "給与明細":
                db.collection('certificates').add({
                    staffNum:staffNum,
                    name:name,
                    createdAt:createdAt,
                    storeName:storeName,
                    paper:paper,
                    required_number:required_number,
                    submission_target:submission_target,
                    reason:reason,
                    endDate:endDate,
                    note:note,
                    payroll_item_start:payroll_item_start,
                    payroll_item_end:payroll_item_end,
                    status:"unapproved",
                });
            break;
            case "賃金台帳":
                db.collection('certificates').add({
                    staffNum:staffNum,
                    name:name,
                    createdAt:createdAt,
                    storeName:storeName,
                    paper:paper,
                    required_number:required_number,
                    submission_target:submission_target,
                    reason:reason,
                    endDate:endDate,
                    note:note,
                    wage_ledger_start:wage_ledger_start,
                    wage_ledger_end:wage_ledger_end,
                    status:"unapproved",
                });
            break;
            case "その他":
                db.collection('certificates').add({
                    staffNum:staffNum,
                    name:name,
                    createdAt:createdAt,
                    storeName:storeName,
                    paper:paper,
                    required_number:required_number,
                    submission_target:submission_target,
                    reason:reason,
                    endDate:endDate,
                    note:note,
                    other:other,
                    status:"unapproved",
                });
            break;
            default:
                db.collection('certificates').add({
                    staffNum:staffNum,
                    name:name,
                    createdAt:createdAt,
                    storeName:storeName,
                    paper:paper,
                    required_number:required_number,
                    submission_target:submission_target,
                    reason:reason,
                    endDate:endDate,
                    note:note,
                    status:"unapproved",
                });
            break;
        }
        var Alert = document.getElementById('Alert');
        Alert.innerHTML = '<div class="alert alert-success" role="alert">申請が完了しました。状態は下記の一覧表から確認してください。</div>';
        setTimeout("location.reload()",2000);
    }
}

//table表示
function showTable(){
    var store = document.getElementById('store_name_search').value;
    console.log(store);
    var query="";
    var querySnapshot="";

    //テーブル表示(初期値)
    (async () => {
        try {
        // 省略 
        // (Cloud Firestoreのインスタンスを初期化してdbにセット)
    
        query = await db.collection('certificates').where('storeName','==',store).orderBy('createdAt', 'desc'); // firebase.firestore.QuerySnapshotのインスタンスを取得
        querySnapshot = await query.get();

        var stocklist = '<table class="table table-striped">'
        stocklist += '<tr><th>申請日</th><th>社員番号</th><th>氏名</th><th>必要書類</th><th>希望期日</th><th>状態</th>';
        querySnapshot.forEach((postDoc) => {
            switch(postDoc.get('status')){
                //承認
                case 'approve':
                    var statusText = "承認";
                    stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('staffNum') + '</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('paper') + '</td><td>'+ postDoc.get('endDate') +'</td><td>'+ statusText +'</td></tr></tbody>';
                    break;
                //発送済み      
                case 'delivered':
                    var statusText = "発送済み";
                    stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('staffNum') + '</td><td>' + postDoc.get('name') + '</td><td>' + postDoc.get('paper') + '</td><td>'+ postDoc.get('endDate') +'</td><td>'+ statusText +'</td></tr></tbody>';
                    break;
                //未承認      
                default:
                    var statusText = "未承認";
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

//ユニフォーム申請
document.getElementById('normal').style.display = "none";
document.getElementById('emergency').style.display = "none";

//種類別の表示非表示
function demandChange(){
    var demandStatus = document.getElementById('demand_uni').value;
    switch(demandStatus){
        case "購入":
            document.getElementById('normal').style.display = "block";
            document.getElementById('emergency').style.display = "none";
        break;
        case "店舗予備":
            document.getElementById('emergency').style.display = "block";
            document.getElementById('normal').style.display = "none";
        break;
    }
}

//DBへ追加
function uniformUpdate(){
    //社員番号
    var stuffNum = document.getElementById('stuffNum_uni').value;
    //氏名
    var name = document.getElementById('name_uni').value;
    //申請日
    var createdAt = document.getElementById('order_date2').textContent;
    //店舗名
    var storeName = document.getElementById('store_name_uni').value;
    //種類
    var demandStatus = document.getElementById('demand_uni').value;
    switch(demandStatus){
        case "購入":
            var blackS = Number(document.getElementById('blackS').value);
            var blackM = Number(document.getElementById('blackM').value);
            var blackL = Number(document.getElementById('blackL').value);
            var blackLL = Number(document.getElementById('blackLL').value);
            var black3L = Number(document.getElementById('black3L').value);
            var blueS = Number(document.getElementById('blueS').value);
            var blueM = Number(document.getElementById('blueM').value);
            var blueL = Number(document.getElementById('blueL').value);
            var blueLL = Number(document.getElementById('blueLL').value);
            var blue3L = Number(document.getElementById('blue3L').value);
            var apron = Number(document.getElementById('apron').value);
            var head_towel = Number(document.getElementById('head_towel').value);
            var fleece_blueS = Number(document.getElementById('fleece_blueS').value);
            var fleece_blueM = Number(document.getElementById('fleece_blueM').value);
            var fleece_blueL = Number(document.getElementById('fleece_blueL').value);
            var fleece_blueXL = Number(document.getElementById('fleece_blueXL').value);
            var sum = (blackS + blackM + blackL + blackLL + black3L + blueS + blueM + blueL + blueLL + blue3L) * 700 + (apron * 800) + (head_towel * 400) + (fleece_blueS + fleece_blueM + fleece_blueL + fleece_blueXL) * 2000;
        break;
        case "店舗予備":
            var checkBox = document.getElementById('black');
            var checkBox2 = document.getElementById('blue');
            var category = "";
            if(checkBox.checked){
                category = "ポロシャツ黒LL";
            }else if(checkBox2.checked){
                category = "ポロシャツ青LL";
            };
        break;
    }

    if(name == "" || storeName == "" || demandStatus == ""){
        var Alert = document.getElementById('Alert2');
        Alert.innerHTML = '<div class="alert alert-danger" role="alert">項目は全て記入してください。</div>';
    }else{
        if(demandStatus == "購入"){
            //DBへ送信
            db.collection('uniforms').add({
                stuffNum:stuffNum,
                name:name,
                createdAt:createdAt,
                storeName:storeName,
                demandStatus:demandStatus,
                blackS:blackS,
                blackM:blackM,
                blackL:blackL,
                blackLL:blackLL,
                black3L:black3L,
                blueS:blueS,
                blueM:blueM,
                blueL:blueL,
                blueLL:blueLL,
                blue3L:blue3L,
                apron:apron,
                head_towel:head_towel,
                fleece_blueS:fleece_blueS,
                fleece_blueM:fleece_blueM,
                fleece_blueL:fleece_blueL,
                fleece_blueXL:fleece_blueXL,
                sum:sum,
                status:"unapproved",
            });
        }else{
            //DBへ送信
            db.collection('uniforms').add({
                stuffNum:stuffNum,
                name:name,
                createdAt:createdAt,
                storeName:storeName,
                demandStatus:demandStatus,
                category:category,
                status:"unapproved",
            });
        }
        var Alert = document.getElementById('Alert2');
        Alert.innerHTML = '<div class="alert alert-success" role="alert">申請が完了しました。状態は下記の一覧表から確認してください。</div>';
        setTimeout("location.reload()",2000);
    }
}

//table表示
function showTableuni(){
    var store = document.getElementById('store_name_uni_search').value;
    var query="";
    var querySnapshot="";

    //テーブル表示(初期値)
    (async () => {
        try {
        // 省略 
        // (Cloud Firestoreのインスタンスを初期化してdbにセット)
    
        query = await db.collection('uniforms').where('storeName','==',store).orderBy('createdAt', 'desc') // firebase.firestore.QuerySnapshotのインスタンスを取得
        querySnapshot = await query.get();

        var stocklist = '<table class="table table-striped">'
        stocklist += '<tr><th>申請日</th><th>社員番号</th><th>氏名</th><th>要望内容</th><th>状態</th><th>PDF</th>';
        querySnapshot.forEach((postDoc) => {
            if(postDoc.get('demandStatus') == '購入'){
                switch(postDoc.get('status')){
                    //承認
                    case 'approve':
                        var statusText = "承認";
                        stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('stuffNum') + '</td><td>' + postDoc.get('name') + '</td><td>'+ postDoc.get('demandStatus') +'</td><td>' + statusText + '</td><td>'+ '<button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">PDFで印刷</button>' +'</td></tr></tbody>';
                        break;
                    //不承認      
                    case 'delivered':
                        var statusText = "発送済み";
                        stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('stuffNum') + '</td><td>' + postDoc.get('name') + '</td><td>'+ postDoc.get('demandStatus') +'</td><td>' + statusText + '</td><td>'+ '<button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">PDFで印刷</button>' +'</td></tr></tbody>';
                        break;
                    //未承認      
                    default:
                        var statusText = "未承認";
                        stocklist += '<tbody class="yetBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('stuffNum') + '</td><td>' + postDoc.get('name') + '</td><td>'+ postDoc.get('demandStatus') +'</td><td>' + statusText + '</td><td>'+ '<button class="btn btn-success" onclick="NormalPDF(\''+postDoc.id+'\')">PDFで印刷</button>' +'</td></tr></tbody>';
                        break;        
                    }
            }else{
                switch(postDoc.get('status')){
                    //承認
                    case 'approve':
                        var statusText = "承認";
                        stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('stuffNum') + '</td><td>' + postDoc.get('name') + '</td><td>'+ postDoc.get('category') +'</td><td>' + statusText + '</td><td>'+ '<button class="btn btn-success" onclick="emergencyPDF(\''+postDoc.id+'\')">PDFで印刷</button>' +'</td></tr></tbody>';
                        break;
                    //不承認      
                    case 'delivered':
                        var statusText = "発送済み";
                        stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('stuffNum') + '</td><td>' + postDoc.get('name') + '</td><td>'+ postDoc.get('category') +'</td><td>' + statusText + '</td><td>'+ '<button class="btn btn-success" onclick="emergencyPDF(\''+postDoc.id+'\')">PDFで印刷</button>' +'</td></tr></tbody>';
                        break;
                    //未承認      
                    default:
                        var statusText = "未承認";
                        stocklist += '<tbody class="yetBack"><tr><td>'+ postDoc.get('createdAt') +'</td><td>' + postDoc.get('stuffNum') + '</td><td>' + postDoc.get('name') + '</td><td>'+ postDoc.get('category') +'</td><td>' + statusText + '</td><td>'+ '<button class="btn btn-success" onclick="emergencyPDF(\''+postDoc.id+'\')">PDFで印刷</button>' +'</td></tr></tbody>';
                        break;        
                }
            }
        })
        stocklist += '</table>';
        document.getElementById('table_list2').innerHTML = stocklist;

        } catch (err) {
            console.log(err);
        }
    })();
}

//購入PDF作成
function NormalPDF(id){
    (async () => {
      try {
        const carrentDB = await db.collection('uniforms').doc(id).get();
        //社員番号
        var stuffNum = carrentDB.get('stuffNum');
        //氏名
        var name = carrentDB.get('name');
        //申請日
        var createdAt = carrentDB.get('createdAt');
        //店舗名
        var storeName = carrentDB.get('storeName');
        //要望内容
        var demandStatus = carrentDB.get('demandStatus');
        //それぞれの備品が1以上ある時合計金額を表示
        if(carrentDB.get('blackS') == 0){
            var blackS = '';
            var blackS_sum = '';
        }else{
            var blackS = carrentDB.get('blackS');
            var blackS_sum = 700 * carrentDB.get('blackS');
        }
        if(carrentDB.get('blackM') == 0){
            var blackM = '';
            var blackM_sum = '';
        }else{
            var blackM = carrentDB.get('blackM');
            var blackM_sum = 700 * carrentDB.get('blackM');
        }
        if(carrentDB.get('blackL') == 0){
            var blackL = '';
            var blackL_sum = '';
        }else{
            var blackL = carrentDB.get('blackL');
            var blackL_sum = 700 * carrentDB.get('blackL');
        }
        if(carrentDB.get('blackLL') == 0){
            var blackLL = '';
            var blackLL_sum = '';
        }else{
            var blackLL = carrentDB.get('blackLL');
            var blackLL_sum = 700 * carrentDB.get('blackLL');
        }
        if(carrentDB.get('black3L') == 0){
            var black3L = '';
            var black3L_sum = '';
        }else{
            var black3L = carrentDB.get('black3L');
            var black3L_sum = 700 * carrentDB.get('black3L');
        }
        if(carrentDB.get('blueS') == 0){
            var blueS = '';
            var blueS_sum = '';
        }else{
            var blueS = carrentDB.get('blueS');
            var blueS_sum = 700 * carrentDB.get('blueS');
        }
        if(carrentDB.get('blueM') == 0){
            var blueM = '';
            var blueM_sum = '';
        }else{
            var blueM = carrentDB.get('blueM');
            var blueM_sum = 700 * carrentDB.get('blueM');
        }
        if(carrentDB.get('blueL') == 0){
            var blueL = '';
            var blueL_sum = '';
        }else{
            var blueL = carrentDB.get('blueL');
            var blueL_sum = 700 * carrentDB.get('blueL');
        }
        if(carrentDB.get('blue3L') == 0){
            var blue3L = '';
            var blue3L_sum = '';
        }else{
            var blue3L = carrentDB.get('blue3L');
            var blue3L_sum = 700 * carrentDB.get('blue3L');
        }
        if(carrentDB.get('apron') == 0){
            var apron = '';
            var apron_sum = '';
        }else{
            var apron = carrentDB.get('apron');
            var apron_sum = 700 * carrentDB.get('apron');
        }
        if(carrentDB.get('head_towel') == 0){
            var head_towel = '';
            var head_towel_sum = '';
        }else{
            var head_towel = carrentDB.get('head_towel');
            var head_towel_sum = 700 * carrentDB.get('head_towel');
        }
        if(carrentDB.get('fleece_blueS') == 0){
            var fleece_blueS = '';
            var fleece_blueS_sum = '';
        }else{
            var fleece_blueS = carrentDB.get('fleece_blueS');
            var fleece_blueS_sum = 700 * carrentDB.get('fleece_blueS');
        }
        //日本語フォント読み込み
        pdfMake.fonts = {
            GenShin: {
            normal: 'GenShinGothic-Normal-Sub.ttf',
            bold: 'GenShinGothic-Normal-Sub.ttf',
            italics: 'GenShinGothic-Normal-Sub.ttf',
            bolditalics: 'GenShinGothic-Normal-Sub.ttf'
            }
        };
  
            if(category == "ポロシャツ黒LL"){
                //PDF作成処理
                var docDef = {
                    content: [
                        {
                          columns: [
                              {
                                  width: '*',
                                  text: 'ユニフォーム申請書(店舗用)',
                                  margin: [ 0, 0, 0, 10 ],
                                  style: ['center','border'],
                                  fontSize: 20
                              }
                          ],
                          columnGap: 10
                        },
                        {
                          table: {
                              headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                              widths: ['*','*'],
                              body: [
                                  [{text:'日付・店舗名',fontSize:15,alignment:'center'},{text:'社員番号・氏名',fontSize:15,alignment:'center'}],
                                  [{text:createdAt,fontSize:15,alignment:'center'},{text:'社員番号: ' + stuffNum,fontSize:15,alignment:'center'}],
                                  [{text:'店舗: ' + storeName,fontSize:15,alignment:'center'},{text:'氏名: ' + name + '            印',fontSize:15,alignment:'center'}],
                              ],
                          }
                        },
                        {
                            columns: [
                                {
                                    width: '*',
                                    height:100,
                                    text: ' ',
                                    style: ['center'],
                                    fontSize: 10
                                }
                            ],
                            columnGap: 10
                        },
                        {
                          table: {
                              headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                              widths: [150,100,150,'*'],
                              style:['center'],
                              body: [
                                  ['',{text:'単価',fontSize:15,alignment:'center'},{text:'枚数',fontSize:15,alignment:'center'},{text:'金額',fontSize:15,alignment:'center'}],
                                  [{text:'ポロシャツ黒LL',fontSize:20,alignment:'center'},{text:'¥700',fontSize:20,alignment:'center'},{text:'1枚',fontSize:20,alignment:'center'},{text:'¥700',fontSize:20,alignment:'center'}]
                              ]
                          }
                        },
                        {
                            columns: [
                                {
                                    width: '*',
                                    text: '合計金額    ¥700',
                                    margin: [ 0, 10, 0, 10 ],
                                    style: ['center','border'],
                                    fontSize: 20
                                }
                            ],
                            columnGap: 10
                        },
                        {
                            columns: [
                                {
                                    width: '*',
                                    text: '切り取り不要',
                                    style: ['center'],
                                    fontSize: 15
                                }
                            ],
                            columnGap: 10
                        },
                        {
                            columns: [
                                {
                                    width: 'auto',
                                    text:  '受領書(会社控え)',
                                    margin: [ 0, 10, 0, 10 ],
                                    style: ['left'],
                                    fontSize: 15
                                },
                                {
                                    width: '*',
                                    text: createdAt,
                                    margin: [ 0, 10, 0, 10 ],
                                    style: ['right'],
                                    fontSize: 15
                                }
                            ],
                            columnGap: 10
                        },
                        {
                            table: {
                                headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                                widths: [150,100,150,'*'],
                                style:['center'],
                                body: [
                                    ['',{text:'単価',fontSize:15,alignment:'center'},{text:'枚数',fontSize:15,alignment:'center'},{text:'金額',fontSize:15,alignment:'center'}],
                                    [{text:'ポロシャツLL',fontSize:20,alignment:'center'},{text:'¥700',fontSize:20,alignment:'center'},{text:'1枚',fontSize:20,alignment:'center'},{text:'¥700',fontSize:20,alignment:'center'}]
                                ]
                            }
                          },
                                                  {
                            columns: [
                                {
                                    width: '*',
                                    height:100,
                                    text: ' ',
                                    style: ['center'],
                                    fontSize: 10
                                }
                            ],
                            columnGap: 10
                        },
                        {
                            table: {
                                headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                                widths: [100],
                                style:['center'],
                                body: [
                                    [{text:'本人受取印',fontSize:15,alignment:'center'}],
                                    [{text:'印',fontSize:20,alignment:'center'}]
                                ]
                            }
                        },
                        {
                            columns: [
                                {
                                    width: '*',
                                    text: '------------------------------切り取り-----------------------------',
                                    margin: [ 0, 0, 0, 10 ],
                                    style: ['center','border'],
                                    fontSize: 15
                                }
                            ],
                            columnGap: 10
                        },
                        {
                            columns: [
                                {
                                    width: 'auto',
                                    text:  '受領書(本人控え)',
                                    margin: [ 0, 10, 0, 10 ],
                                    style: ['left'],
                                    fontSize: 15
                                },
                                {
                                    width: '*',
                                    text: createdAt,
                                    margin: [ 0, 10, 0, 10 ],
                                    style: ['right'],
                                    fontSize: 15
                                }
                            ],
                            columnGap: 10
                        },
                        {
                            columns: [
                                {
                                    width: 'auto',
                                    text:  '社員番号: ' + stuffNum,
                                    style: ['center'],
                                    fontSize: 15
                                },
                                {
                                    width: '*',
                                    text: '氏名: ' + name,
                                    style: ['center'],
                                    fontSize: 15
                                }
                            ],
                            columnGap: 10
                        },
                        {
                            table: {
                                headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                                widths: [150,100,150,'*'],
                                style:['center'],
                                body: [
                                    ['',{text:'単価',fontSize:15,alignment:'center'},{text:'枚数',fontSize:15,alignment:'center'},{text:'金額',fontSize:15,alignment:'center'}],
                                    [{text:'ポロシャツLL',fontSize:20,alignment:'center'},{text:'¥700',fontSize:20,alignment:'center'},{text:'1枚',fontSize:20,alignment:'center'},{text:'¥700',fontSize:20,alignment:'center'}]
                                ]
                            }
                          },
                    ],
                    styles:{
                        center:{
                            alignment: 'center'
                        },
                        right:{
                          alignment: 'right'
                        },
                        left:{
                          alignment: 'left'
                        },
                        border:{
                            decorationStyle:'dashed'
                        }
                    },
                    defaultStyle: {
                        font: 'GenShin',
                    },
                };
            }else{
                //PDF作成処理
                var docDef = {
                    content: [
                        {
                          columns: [
                              {
                                  width: '*',
                                  text: 'ユニフォーム申請書(店舗用)',
                                  margin: [ 0, 0, 0, 10 ],
                                  style: ['center','border'],
                                  fontSize: 20
                              }
                          ],
                          columnGap: 10
                        },
                        {
                          table: {
                              headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                              widths: ['*','*'],
                              body: [
                                [{text:'日付・店舗名',fontSize:15,alignment:'center'},{text:'社員番号・氏名',fontSize:15,alignment:'center'}],
                                [{text:createdAt,fontSize:15,alignment:'center'},{text:'社員番号: ' + stuffNum,fontSize:15,alignment:'center'}],
                                [{text:'店舗: ' + storeName,fontSize:15,alignment:'center'},{text:'氏名: ' + name + '            印',fontSize:15,alignment:'center'}],
                              ],
                          }
                        },
                        {
                            columns: [
                                {
                                    width: '*',
                                    height:100,
                                    text: ' ',
                                    style: ['center'],
                                    fontSize: 10
                                }
                            ],
                            columnGap: 10
                        },
                        {
                          table: {
                              headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                              widths: [150,100,150,'*'],
                              style:['center'],
                              body: [
                                  ['',{text:'単価',fontSize:15,alignment:'center'},{text:'枚数',fontSize:15,alignment:'center'},{text:'金額',fontSize:15,alignment:'center'}],
                                  [{text:'ポロシャツ青LL',fontSize:20,alignment:'center'},{text:'¥700',fontSize:20,alignment:'center'},{text:'1枚',fontSize:20,alignment:'center'},{text:'¥700',fontSize:20,alignment:'center'}]
                              ]
                          }
                        },
                        {
                            columns: [
                                {
                                    width: '*',
                                    text: '合計金額    ¥700',
                                    margin: [ 0, 10, 0, 10 ],
                                    style: ['center','border'],
                                    fontSize: 20
                                }
                            ],
                            columnGap: 10
                        },
                        {
                            columns: [
                                {
                                    width: '*',
                                    text: '切り取り不要',
                                    style: ['center'],
                                    fontSize: 15
                                }
                            ],
                            columnGap: 10
                        },
                        {
                            columns: [
                                {
                                    width: 'auto',
                                    text:  '受領書(会社控え)',
                                    margin: [ 0, 10, 0, 10 ],
                                    style: ['left'],
                                    fontSize: 15
                                },
                                {
                                    width: '*',
                                    text: createdAt,
                                    margin: [ 0, 10, 0, 10 ],
                                    style: ['right'],
                                    fontSize: 15
                                }
                            ],
                            columnGap: 10
                        },
                        {
                            table: {
                                headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                                widths: [150,100,150,'*'],
                                style:['center'],
                                body: [
                                    ['',{text:'単価',fontSize:15,alignment:'center'},{text:'枚数',fontSize:15,alignment:'center'},{text:'金額',fontSize:15,alignment:'center'}],
                                    [{text:'ポロシャツLL',fontSize:20,alignment:'center'},{text:'¥700',fontSize:20,alignment:'center'},{text:'1枚',fontSize:20,alignment:'center'},{text:'¥700',fontSize:20,alignment:'center'}]
                                ]
                            }
                          },
                                                  {
                            columns: [
                                {
                                    width: '*',
                                    height:100,
                                    text: ' ',
                                    style: ['center'],
                                    fontSize: 10
                                }
                            ],
                            columnGap: 10
                        },
                        {
                            table: {
                                headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                                widths: [100],
                                style:['center'],
                                body: [
                                    [{text:'本人受取印',fontSize:15,alignment:'center'}],
                                    [{text:'印',fontSize:20,alignment:'center'}]
                                ]
                            }
                        },
                        {
                            columns: [
                                {
                                    width: '*',
                                    text: '------------------------------切り取り-----------------------------',
                                    margin: [ 0, 0, 0, 10 ],
                                    style: ['center','border'],
                                    fontSize: 15
                                }
                            ],
                            columnGap: 10
                        },
                        {
                            columns: [
                                {
                                    width: 'auto',
                                    text:  '受領書(本人控え)',
                                    margin: [ 0, 10, 0, 10 ],
                                    style: ['left'],
                                    fontSize: 15
                                },
                                {
                                    width: '*',
                                    text: createdAt,
                                    margin: [ 0, 10, 0, 10 ],
                                    style: ['right'],
                                    fontSize: 15
                                }
                            ],
                            columnGap: 10
                        },
                        {
                            columns: [
                                {
                                    width: 'auto',
                                    text:  '社員番号: ' + stuffNum,
                                    style: ['center'],
                                    fontSize: 15
                                },
                                {
                                    width: '*',
                                    text: '氏名: ' + name,
                                    style: ['center'],
                                    fontSize: 15
                                }
                            ],
                            columnGap: 10
                        },
                        {
                            table: {
                                headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                                widths: [150,100,150,'*'],
                                style:['center'],
                                body: [
                                    ['',{text:'単価',fontSize:15,alignment:'center'},{text:'枚数',fontSize:15,alignment:'center'},{text:'金額',fontSize:15,alignment:'center'}],
                                    [{text:'ポロシャツLL',fontSize:20,alignment:'center'},{text:'¥700',fontSize:20,alignment:'center'},{text:'1枚',fontSize:20,alignment:'center'},{text:'¥700',fontSize:20,alignment:'center'}]
                                ]
                            }
                          },
                    ],
                    styles:{
                        center:{
                            alignment: 'center'
                        },
                        right:{
                          alignment: 'right'
                        },
                        left:{
                          alignment: 'left'
                        },
                        border:{
                            decorationStyle:'dashed'
                        }
                    },
                    defaultStyle: {
                        font: 'GenShin',
                    },
                };
            }
            pdfMake.createPdf(docDef).print();
            //pdfMake.createPdf(docDef).download("残業申請書.pdf");
      } catch (err) {
      console.log(`Error: ${JSON.stringify(err)}`)
      }
  })();
}

//緊急用PDF作成
function emergencyPDF(id){
    (async () => {
      try {
        const carrentDB = await db.collection('uniforms').doc(id).get();
        //社員番号
        var stuffNum = carrentDB.get('stuffNum');
        //氏名
        var name = carrentDB.get('name');
        //申請日
        var createdAt = carrentDB.get('createdAt');
        //店舗名
        var storeName = carrentDB.get('storeName');
        //要望内容
        var demandStatus = carrentDB.get('demandStatus');
        //日本語フォント読み込み
        pdfMake.fonts = {
            GenShin: {
            normal: 'GenShinGothic-Normal-Sub.ttf',
            bold: 'GenShinGothic-Normal-Sub.ttf',
            italics: 'GenShinGothic-Normal-Sub.ttf',
            bolditalics: 'GenShinGothic-Normal-Sub.ttf'
            }
        };

        if(demandStatus == "購入"){
            //それぞれの備品が1以上ある時合計金額を表示
            if(carrentDB.get('blackS') == 0){
                var blackS = '';
                var blackS_sum = '';
            }else{
                var blackS_sum = 700 * carrentDB.get('blackS');
            }
            if(carrentDB.get('blackM') == 0){
                var blackM = '';
                var blackM_sum = '';
            }else{
                var blackM_sum = 700 * carrentDB.get('blackM');
            }
            if(carrentDB.get('blackL') == 0){
                var blackL = '';
                var blackL_sum = '';
            }else{
                var blackL_sum = 700 * carrentDB.get('blackL');
            }
            if(carrentDB.get('blackLL') == 0){
                var blackLL = '';
                var blackLL_sum = '';
            }else{
                var blackLL_sum = 700 * carrentDB.get('blackLL');
            }
        }
  
            if(category == "ポロシャツ黒LL"){
                //PDF作成処理
                var docDef = {
                    content: [
                        {
                          columns: [
                              {
                                  width: '*',
                                  text: 'ユニフォーム申請書(店舗用)',
                                  margin: [ 0, 0, 0, 10 ],
                                  style: ['center','border'],
                                  fontSize: 20
                              }
                          ],
                          columnGap: 10
                        },
                        {
                          table: {
                              headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                              widths: ['*','*'],
                              body: [
                                  [{text:'日付・店舗名',fontSize:15,alignment:'center'},{text:'社員番号・氏名',fontSize:15,alignment:'center'}],
                                  [{text:createdAt,fontSize:15,alignment:'center'},{text:'社員番号: ' + stuffNum,fontSize:15,alignment:'center'}],
                                  [{text:'店舗: ' + storeName,fontSize:15,alignment:'center'},{text:'氏名: ' + name + '            印',fontSize:15,alignment:'center'}],
                              ],
                          }
                        },
                        {
                            columns: [
                                {
                                    width: '*',
                                    height:100,
                                    text: ' ',
                                    style: ['center'],
                                    fontSize: 10
                                }
                            ],
                            columnGap: 10
                        },
                        {
                          table: {
                              headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                              widths: [150,100,150,'*'],
                              style:['center'],
                              body: [
                                  ['',{text:'単価',fontSize:15,alignment:'center'},{text:'枚数',fontSize:15,alignment:'center'},{text:'金額',fontSize:15,alignment:'center'}],
                                  [{text:'ポロシャツ黒LL',fontSize:20,alignment:'center'},{text:'¥700',fontSize:20,alignment:'center'},{text:'1枚',fontSize:20,alignment:'center'},{text:'¥700',fontSize:20,alignment:'center'}]
                              ]
                          }
                        },
                        {
                            columns: [
                                {
                                    width: '*',
                                    text: '合計金額    ¥700',
                                    margin: [ 0, 10, 0, 10 ],
                                    style: ['center','border'],
                                    fontSize: 20
                                }
                            ],
                            columnGap: 10
                        },
                        {
                            columns: [
                                {
                                    width: '*',
                                    text: '切り取り不要',
                                    style: ['center'],
                                    fontSize: 15
                                }
                            ],
                            columnGap: 10
                        },
                        {
                            columns: [
                                {
                                    width: 'auto',
                                    text:  '受領書(会社控え)',
                                    margin: [ 0, 10, 0, 10 ],
                                    style: ['left'],
                                    fontSize: 15
                                },
                                {
                                    width: '*',
                                    text: createdAt,
                                    margin: [ 0, 10, 0, 10 ],
                                    style: ['right'],
                                    fontSize: 15
                                }
                            ],
                            columnGap: 10
                        },
                        {
                            table: {
                                headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                                widths: [150,100,150,'*'],
                                style:['center'],
                                body: [
                                    ['',{text:'単価',fontSize:15,alignment:'center'},{text:'枚数',fontSize:15,alignment:'center'},{text:'金額',fontSize:15,alignment:'center'}],
                                    [{text:'ポロシャツLL',fontSize:20,alignment:'center'},{text:'¥700',fontSize:20,alignment:'center'},{text:'1枚',fontSize:20,alignment:'center'},{text:'¥700',fontSize:20,alignment:'center'}]
                                ]
                            }
                          },
                                                  {
                            columns: [
                                {
                                    width: '*',
                                    height:100,
                                    text: ' ',
                                    style: ['center'],
                                    fontSize: 10
                                }
                            ],
                            columnGap: 10
                        },
                        {
                            table: {
                                headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                                widths: [100],
                                style:['center'],
                                body: [
                                    [{text:'本人受取印',fontSize:15,alignment:'center'}],
                                    [{text:'印',fontSize:20,alignment:'center'}]
                                ]
                            }
                        },
                        {
                            columns: [
                                {
                                    width: '*',
                                    text: '------------------------------切り取り-----------------------------',
                                    margin: [ 0, 0, 0, 10 ],
                                    style: ['center','border'],
                                    fontSize: 15
                                }
                            ],
                            columnGap: 10
                        },
                        {
                            columns: [
                                {
                                    width: 'auto',
                                    text:  '受領書(本人控え)',
                                    margin: [ 0, 10, 0, 10 ],
                                    style: ['left'],
                                    fontSize: 15
                                },
                                {
                                    width: '*',
                                    text: createdAt,
                                    margin: [ 0, 10, 0, 10 ],
                                    style: ['right'],
                                    fontSize: 15
                                }
                            ],
                            columnGap: 10
                        },
                        {
                            columns: [
                                {
                                    width: 'auto',
                                    text:  '社員番号: ' + stuffNum,
                                    style: ['center'],
                                    fontSize: 15
                                },
                                {
                                    width: '*',
                                    text: '氏名: ' + name,
                                    style: ['center'],
                                    fontSize: 15
                                }
                            ],
                            columnGap: 10
                        },
                        {
                            table: {
                                headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                                widths: [150,100,150,'*'],
                                style:['center'],
                                body: [
                                    ['',{text:'単価',fontSize:15,alignment:'center'},{text:'枚数',fontSize:15,alignment:'center'},{text:'金額',fontSize:15,alignment:'center'}],
                                    [{text:'ポロシャツLL',fontSize:20,alignment:'center'},{text:'¥700',fontSize:20,alignment:'center'},{text:'1枚',fontSize:20,alignment:'center'},{text:'¥700',fontSize:20,alignment:'center'}]
                                ]
                            }
                          },
                    ],
                    styles:{
                        center:{
                            alignment: 'center'
                        },
                        right:{
                          alignment: 'right'
                        },
                        left:{
                          alignment: 'left'
                        },
                        border:{
                            decorationStyle:'dashed'
                        }
                    },
                    defaultStyle: {
                        font: 'GenShin',
                    },
                };
            }else{
                //PDF作成処理
                var docDef = {
                    content: [
                        {
                          columns: [
                              {
                                  width: '*',
                                  text: 'ユニフォーム申請書(店舗用)',
                                  margin: [ 0, 0, 0, 10 ],
                                  style: ['center','border'],
                                  fontSize: 20
                              }
                          ],
                          columnGap: 10
                        },
                        {
                          table: {
                              headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                              widths: ['*','*'],
                              body: [
                                [{text:'日付・店舗名',fontSize:15,alignment:'center'},{text:'社員番号・氏名',fontSize:15,alignment:'center'}],
                                [{text:createdAt,fontSize:15,alignment:'center'},{text:'社員番号: ' + stuffNum,fontSize:15,alignment:'center'}],
                                [{text:'店舗: ' + storeName,fontSize:15,alignment:'center'},{text:'氏名: ' + name + '            印',fontSize:15,alignment:'center'}],
                              ],
                          }
                        },
                        {
                            columns: [
                                {
                                    width: '*',
                                    height:100,
                                    text: ' ',
                                    style: ['center'],
                                    fontSize: 10
                                }
                            ],
                            columnGap: 10
                        },
                        {
                          table: {
                              headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                              widths: [150,100,150,'*'],
                              style:['center'],
                              body: [
                                  ['',{text:'単価',fontSize:15,alignment:'center'},{text:'枚数',fontSize:15,alignment:'center'},{text:'金額',fontSize:15,alignment:'center'}],
                                  [{text:'ポロシャツ青LL',fontSize:20,alignment:'center'},{text:'¥700',fontSize:20,alignment:'center'},{text:'1枚',fontSize:20,alignment:'center'},{text:'¥700',fontSize:20,alignment:'center'}]
                              ]
                          }
                        },
                        {
                            columns: [
                                {
                                    width: '*',
                                    text: '合計金額    ¥700',
                                    margin: [ 0, 10, 0, 10 ],
                                    style: ['center','border'],
                                    fontSize: 20
                                }
                            ],
                            columnGap: 10
                        },
                        {
                            columns: [
                                {
                                    width: '*',
                                    text: '切り取り不要',
                                    style: ['center'],
                                    fontSize: 15
                                }
                            ],
                            columnGap: 10
                        },
                        {
                            columns: [
                                {
                                    width: 'auto',
                                    text:  '受領書(会社控え)',
                                    margin: [ 0, 10, 0, 10 ],
                                    style: ['left'],
                                    fontSize: 15
                                },
                                {
                                    width: '*',
                                    text: createdAt,
                                    margin: [ 0, 10, 0, 10 ],
                                    style: ['right'],
                                    fontSize: 15
                                }
                            ],
                            columnGap: 10
                        },
                        {
                            table: {
                                headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                                widths: [150,100,150,'*'],
                                style:['center'],
                                body: [
                                    ['',{text:'単価',fontSize:15,alignment:'center'},{text:'枚数',fontSize:15,alignment:'center'},{text:'金額',fontSize:15,alignment:'center'}],
                                    [{text:'ポロシャツLL',fontSize:20,alignment:'center'},{text:'¥700',fontSize:20,alignment:'center'},{text:'1枚',fontSize:20,alignment:'center'},{text:'¥700',fontSize:20,alignment:'center'}]
                                ]
                            }
                          },
                                                  {
                            columns: [
                                {
                                    width: '*',
                                    height:100,
                                    text: ' ',
                                    style: ['center'],
                                    fontSize: 10
                                }
                            ],
                            columnGap: 10
                        },
                        {
                            table: {
                                headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                                widths: [100],
                                style:['center'],
                                body: [
                                    [{text:'本人受取印',fontSize:15,alignment:'center'}],
                                    [{text:'印',fontSize:20,alignment:'center'}]
                                ]
                            }
                        },
                        {
                            columns: [
                                {
                                    width: '*',
                                    text: '------------------------------切り取り-----------------------------',
                                    margin: [ 0, 0, 0, 10 ],
                                    style: ['center','border'],
                                    fontSize: 15
                                }
                            ],
                            columnGap: 10
                        },
                        {
                            columns: [
                                {
                                    width: 'auto',
                                    text:  '受領書(本人控え)',
                                    margin: [ 0, 10, 0, 10 ],
                                    style: ['left'],
                                    fontSize: 15
                                },
                                {
                                    width: '*',
                                    text: createdAt,
                                    margin: [ 0, 10, 0, 10 ],
                                    style: ['right'],
                                    fontSize: 15
                                }
                            ],
                            columnGap: 10
                        },
                        {
                            columns: [
                                {
                                    width: 'auto',
                                    text:  '社員番号: ' + stuffNum,
                                    style: ['center'],
                                    fontSize: 15
                                },
                                {
                                    width: '*',
                                    text: '氏名: ' + name,
                                    style: ['center'],
                                    fontSize: 15
                                }
                            ],
                            columnGap: 10
                        },
                        {
                            table: {
                                headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                                widths: [150,100,150,'*'],
                                style:['center'],
                                body: [
                                    ['',{text:'単価',fontSize:15,alignment:'center'},{text:'枚数',fontSize:15,alignment:'center'},{text:'金額',fontSize:15,alignment:'center'}],
                                    [{text:'ポロシャツLL',fontSize:20,alignment:'center'},{text:'¥700',fontSize:20,alignment:'center'},{text:'1枚',fontSize:20,alignment:'center'},{text:'¥700',fontSize:20,alignment:'center'}]
                                ]
                            }
                          },
                    ],
                    styles:{
                        center:{
                            alignment: 'center'
                        },
                        right:{
                          alignment: 'right'
                        },
                        left:{
                          alignment: 'left'
                        },
                        border:{
                            decorationStyle:'dashed'
                        }
                    },
                    defaultStyle: {
                        font: 'GenShin',
                    },
                };
            }
            pdfMake.createPdf(docDef).print();
            //pdfMake.createPdf(docDef).download("残業申請書.pdf");
      } catch (err) {
      console.log(`Error: ${JSON.stringify(err)}`)
      }
  })();
}

