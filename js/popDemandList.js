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

var query="";
var querySnapshot="";
var currentQuerySnapshot = "";
var currentQueryList = [];
var backQueryList = [];
document.getElementById('prevButton').style.visibility = 'hidden';

//テーブル表示(初期値)
(async () => {
    try {
      // 省略 
      // (Cloud Firestoreのインスタンスを初期化してdbにセット)
  
      query = await db.collection('POPDemands').orderBy('CreatedAt', 'desc').limit(10) // firebase.firestore.QuerySnapshotのインスタンスを取得
      querySnapshot = await query.get();

      //前回のDBとして保存
      backQueryList.push(querySnapshot);

      var i = 0;
      var stocklist = '<table class="table table-striped" id="download_table">'
      stocklist += '<tr><th>区分</th><th>依頼日</th><th>納品日</th><th>店舗名</th><th>件名</th><th>状況</th><th>依頼者</th><th>対応者</th><th>編集</th></tr>';
      querySnapshot.forEach((postDoc) => {
        switch(postDoc.get('status')){
          case '完了':
              stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('orderCategory') +'</td><td>' + postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('orderDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('subject') + '</td><td>'+ postDoc.get('status') +'</td><td>' + postDoc.get('requesterName') + '</td><td>'+ postDoc.get('supportPerson') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open2"><button class="btn btn-primary" onclick="modalImages(\''+postDoc.id+'\')">画像/データ</button></a><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) +'\')">削除</button></td></tr></tbody>';
              break;
          case '依頼中':
              stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('orderCategory') +'</td><td>' + postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('orderDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('subject') + '</td><td>'+ postDoc.get('status') +'</td><td>' + postDoc.get('requesterName') + '</td><td>'+ postDoc.get('supportPerson') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open2"><button class="btn btn-primary" onclick="modalImages(\''+postDoc.id+'\')">画像/データ</button></a><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) +'\')">削除</button></td></tr></tbody>';
              break;
          default:
              stocklist += '<tbody><tr><td>'+ postDoc.get('orderCategory') +'</td><td>' + postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('orderDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('subject') + '</td><td>'+ postDoc.get('status') +'</td><td>' + postDoc.get('requesterName') + '</td><td>'+ postDoc.get('supportPerson') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open2"><button class="btn btn-primary" onclick="modalImages(\''+postDoc.id+'\')">画像/データ</button></a><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) +'\')">削除</button></td></tr></tbody>';
              break;        
        }
      })
      stocklist += '</table>';
      document.getElementById('table_list').innerHTML = stocklist;

      //後が無い場合に非表示
      if(querySnapshot.docs.length < 10){
        document.getElementById('nextButton').style.visibility = "hidden";
      }

    } catch (err) {
        console.log(err);
    }
})();

//次へ
function nextPegination(){
  document.getElementById('prevButton').style.visibility = 'visible';
  (async () => {
      try {
          //変更前のDB情報を保持しておく
          currentQueryList.push(querySnapshot);

          console.log(currentQueryList);

          query = query.limit(10).startAfter(querySnapshot.docs[9]);
          querySnapshot = await query.get();

          //後が無い場合に非表示
          if(querySnapshot.docs.length < 10){
              document.getElementById('nextButton').style.visibility = "hidden";
          }

          var i = 0;
          var stocklist = '<table class="table table-striped" id="download_table">'
          stocklist += '<tr><th>区分</th><th>依頼日</th><th>納品日</th><th>店舗名</th><th>件名</th><th>状況</th><th>依頼者</th><th>対応者</th><th>編集</th></tr>';
          querySnapshot.forEach((postDoc) => {
            switch(postDoc.get('status')){
              case '完了':
                  stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('orderCategory') +'</td><td>' + postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('orderDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('subject') + '</td><td>'+ postDoc.get('status') +'</td><td>' + postDoc.get('requesterName') + '</td><td>'+ postDoc.get('supportPerson') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open2"><button class="btn btn-primary" onclick="modalImages(\''+postDoc.id+'\')">画像/データ</button></a><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) +'\')">削除</button></td></tr></tbody>';
                  break;
              case '依頼中':
                  stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('orderCategory') +'</td><td>' + postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('orderDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('subject') + '</td><td>'+ postDoc.get('status') +'</td><td>' + postDoc.get('requesterName') + '</td><td>'+ postDoc.get('supportPerson') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open2"><button class="btn btn-primary" onclick="modalImages(\''+postDoc.id+'\')">画像/データ</button></a><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) +'\')">削除</button></td></tr></tbody>';
                  break;
              default:
                  stocklist += '<tbody><tr><td>'+ postDoc.get('orderCategory') +'</td><td>' + postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('orderDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('subject') + '</td><td>'+ postDoc.get('status') +'</td><td>' + postDoc.get('requesterName') + '</td><td>'+ postDoc.get('supportPerson') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open2"><button class="btn btn-primary" onclick="modalImages(\''+postDoc.id+'\')">画像/データ</button></a><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) +'\')">削除</button></td></tr></tbody>';
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

//前のテーブルを表示
function returnTable(){
  document.getElementById('nextButton').style.visibility = 'visible';
  querySnapshot = currentQueryList.pop();

  var i = 0;
  var stocklist = '<table class="table table-striped" id="download_table">'
  stocklist += '<tr><th>区分</th><th>依頼日</th><th>納品日</th><th>店舗名</th><th>件名</th><th>状況</th><th>依頼者</th><th>対応者</th><th>編集</th></tr>';
  querySnapshot.forEach((postDoc) => {
    switch(postDoc.get('status')){
      case '完了':
          stocklist += '<tbody class="collectBack"><tr><td>'+ postDoc.get('orderCategory') +'</td><td>' + postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('orderDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('subject') + '</td><td>'+ postDoc.get('status') +'</td><td>' + postDoc.get('requesterName') + '</td><td>'+ postDoc.get('supportPerson') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open2"><button class="btn btn-primary" onclick="modalImages(\''+postDoc.id+'\')">画像/データ</button></a><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) +'\')">削除</button></td></tr></tbody>';
          break;
      case '依頼中':
          stocklist += '<tbody class="orderBack"><tr><td>'+ postDoc.get('orderCategory') +'</td><td>' + postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('orderDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('subject') + '</td><td>'+ postDoc.get('status') +'</td><td>' + postDoc.get('requesterName') + '</td><td>'+ postDoc.get('supportPerson') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open2"><button class="btn btn-primary" onclick="modalImages(\''+postDoc.id+'\')">画像/データ</button></a><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) +'\')">削除</button></td></tr></tbody>';
          break;
      default:
          stocklist += '<tbody><tr><td>'+ postDoc.get('orderCategory') +'</td><td>' + postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) + '</td><td>' + postDoc.get('orderDate') + '</td><td>' + postDoc.get('storeName') + '</td><td>' + postDoc.get('subject') + '</td><td>'+ postDoc.get('status') +'</td><td>' + postDoc.get('requesterName') + '</td><td>'+ postDoc.get('supportPerson') +'</td><td><button class="btn btn-success" onclick="createPDF(\''+postDoc.id+'\')">PDFで印刷</button><a class="js-modal-open2"><button class="btn btn-primary" onclick="modalImages(\''+postDoc.id+'\')">画像/データ</button></a><a class="js-modal-open"><button class="btn btn-info" onclick="editStatus(\''+postDoc.id+'\')">編集</button></a><button class="btn btn-danger" onclick="deleteContent(\''+postDoc.id+'\',\''+ postDoc.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}) +'\')">削除</button></td></tr></tbody>';
          break;        
    }
  })
  stocklist += '</table>';
  document.getElementById('table_list').innerHTML = stocklist;

  //前が無くなったら前へを非表示
  if(currentQueryList.length < 1){
      document.getElementById('prevButton').style.visibility = 'hidden';
  }
}

//Status編集用モーダルウィンドウ
function editStatus(id){
    (async () => {
      try {
          const carrentpopDemandDB = await db.collection('POPDemands').doc(id).get();
          //依頼区分
          document.getElementById('orderCategory').textContent = carrentpopDemandDB.get('orderCategory');
          //依頼日
          document.getElementById('createdAt').textContent = carrentpopDemandDB.get('CreatedAt').toDate().toLocaleString('ja-JP', {year:'numeric',month:'numeric',day:'numeric'});
          //納品日
          document.getElementById('preferredDate').value = carrentpopDemandDB.get('preferredDate');
          //店舗名
          document.getElementById('store_name').textContent = carrentpopDemandDB.get('storeName');
          //件名
          if(carrentpopDemandDB.get('subject') == null){
              document.getElementById('subject').value = '';
          }else{
              document.getElementById('subject').value = carrentpopDemandDB.get('subject');
          }
          //依頼者氏名
          if(carrentpopDemandDB.get('requesterName') == null){
              document.getElementById('requesterName').value = '';
          }else{
              document.getElementById('requesterName').value = carrentpopDemandDB.get('requesterName');
          }
          //状況
          var status_elements = document.getElementById('status');
          switch(carrentpopDemandDB.get('status')){
              case '未完了':
                  status_elements.options[1].selected = true;
                  break;
              case '完了':
                  status_elements.options[2].selected = true;
                  break;
              case '依頼中':
                  status_elements.options[3].selected = true;   
                  break;
              default:
                  status_elements.options[0].selected = true;
                  break;    
          }
          //対応者氏名
          if(carrentpopDemandDB.get('supportPerson') == null){
              document.getElementById('supportPerson').value = '';
          }else{
              document.getElementById('supportPerson').value = carrentpopDemandDB.get('supportPerson');
          }

          //要望詳細
          if(carrentpopDemandDB.get('demandDetail') == null){
            document.getElementById('demand_detail').value = '';
          }else{
            document.getElementById('demand_detail').value = carrentpopDemandDB.get('demandDetail');
          }

          //依頼区分によって項目を変える
          if(carrentpopDemandDB.get('orderCategory') == 'Web'){
            document.getElementById('pop').style.display = "none";
            //webサイト
            var web = document.getElementById('website');
            switch(carrentpopDemandDB.get('WebSite')){
                case '公式HP':
                    web.options[1].selected = true;
                break;
                case 'ハピホテ':
                    web.options[2].selected = true;
                break;
                case 'カップルズ':
                    web.options[3].selected = true;
                break;
                case '予約サイト':
                    web.options[4].selected = true;
                break;
                case 'twitter':
                    web.options[5].selected = true;
                default:break;        

            }
          }else{
              document.getElementById('web').style.display = "none";
              //出力
              var output = document.getElementById('output');
              switch(carrentpopDemandDB.get('output')){
                  case '塩ビシート(看板)':
                      output.options[1].selected = true;
                      break;
                  case '内照シート(看板)':
                      output.options[2].selected = true;
                      break;
                  case '普通紙':
                      output.options[3].selected = true;
                      break;
                  case '内照紙':
                      output.options[4].selected = true;
                      break;
                  case 'シール紙':
                      output.options[5].selected = true;   
                      break;
                  case 'その他':
                      output.options[6].selected = true;    
                  default:break;                 
              }
              //加工
              var processing = document.getElementById('processing');
              switch(carrentpopDemandDB.get('processing')){
                  case 'グロス':
                      processing.options[1].selected = true;
                      break;
                  case 'マット':
                      processing.options[2].selected = true;  
                      break;  
                  default:break;         
              }
              //枚数
              if(carrentpopDemandDB.get('number') == null){
                  document.getElementById('number').value = '';
              }else{
                document.getElementById('number').value = carrentpopDemandDB.get('number');
              }
              //サイズ
              var sizeCheckBox = document.getElementById('size_checkBox');
              switch(carrentpopDemandDB.get('sizeCheckBox')){
                  case '名刺サイズ':
                      sizeCheckBox.options[1].selected = true;
                      break;
                  case 'A6':
                      sizeCheckBox.options[2].selected = true;
                      break;
                  case 'A5':
                      sizeCheckBox.options[3].selected = true;
                      break;
                  case 'A4':
                      sizeCheckBox.options[4].selected = true;
                      break;       
                  case 'A3':
                      sizeCheckBox.options[5].selected = true;
                      break;    
                  case 'A3':
                      sizeCheckBox.options[6].selected = true;
                      break; 
                  default:break;           
              }
              //向き
              var sizeDerection = document.getElementById('size_derection');
              switch(carrentpopDemandDB.get('sizeDerection')){
                  case '縦':
                      sizeDerection.options[1].selected = true;
                      break;
                  case '横':
                      sizeDerection.options[2].selected = true;
                      break;
                  default:break;     
              }
              //横
              if(carrentpopDemandDB.get('horizontal') == null){
                document.getElementById('horizontal').value = '';
              }else{
                document.getElementById('horizontal').value = carrentpopDemandDB.get('horizontal');
              }
              //縦
              if(carrentpopDemandDB.get('vertical') == null){
                document.getElementById('vertical').value = '';
              }else{
                document.getElementById('vertical').value = carrentpopDemandDB.get('vertical');
              }
              //貼り代
              if(carrentpopDemandDB.get('coveringFare') == null){
                document.getElementById('covering_fare').value = '';
              }else{
                document.getElementById('covering_fare').value = carrentpopDemandDB.get('coveringFare');
              }
          }
          //編集送信ボタン生成
          document.getElementById('edit_submit_button').innerHTML = '<button type="submit" class="btn btn-success" onclick="EditUpdate(\''+id+'\')">送信する</button>';
  
      } catch (err) {
      console.log(err)
      }
  })();
}

//status編集
function EditUpdate(id){
    var collectAlert = document.getElementById('collectAlert');
    //納品日
    var preferredDate = document.getElementById('preferredDate').value;
    //件名
    var subject = document.getElementById('subject').value;
    //要望詳細
    var demandDetail = document.getElementById('demand_detail').value;
    //状況
    var status = document.getElementById('status').value;
    //依頼者
    var requesterName = document.getElementById('requesterName').value;
    //対応者
    var supportPerson = document.getElementById('supportPerson').value;
    //依頼区分によって項目を変える
    if(document.getElementById('orderCategory') == "web"){
        var WebSite = document.getElementById('website').value;
        //DBへ送信
        db.collection('POPDemands').doc(id).update({
            preferredDate:preferredDate,
            requesterName:requesterName,
            subject:subject,
            WebSite:WebSite,
            demandDetail:demandDetail,
            status:status,
            supportPerson:supportPerson,
        });
        collectAlert.innerHTML = '<div class="alert alert-success" role="alert">保存が完了しました</div>';
        setTimeout("location.reload()",2000);
    }else{
        //出力
        var output = document.getElementById('output').value;
        //加工
        var processing = document.getElementById('processing').value;
        //枚数
        var number = document.getElementById('number').value;
        //サイズ
        var sizeCheckBox = document.getElementById('size_checkBox').value;
        //向き
        var sizeDerection = document.getElementById('size_derection').value;
        //横
        var horizontal = document.getElementById('horizontal').value;
        //縦
        var vertical = document.getElementById('vertical').value;
        //張り紙
        var coveringFare = document.getElementById('covering_fare').value;
        //DBへ送信
        db.collection('POPDemands').doc(id).update({
            preferredDate:preferredDate,
            requesterName:requesterName,
            subject:subject,
            output:output,
            processing:processing,
            number:number,
            sizeCheckBox:sizeCheckBox,
            sizeDerection:sizeDerection,
            horizontal:horizontal,
            vertical:vertical,
            coveringFare:coveringFare,
            demandDetail:demandDetail,
            status:status,
            supportPerson:supportPerson,
        });    
        collectAlert.innerHTML = '<div class="alert alert-success" role="alert">保存が完了しました</div>';
        setTimeout("location.reload()",2000);
    }
}


//削除
function deleteContent(id,date){
    var res = window.confirm(date + "の内容を削除しますか？");
    if( res ) {
        (async () => {
            try {
                const carrentDB = await db.collection('POPDemands').doc(id).get();
                if(carrentDB.get('photoCount') == 0 || carrentDB.get('photoCount') == undefined){

                }else{
                    for(var i = 0;i < carrentDB.get('photoCount');i++){
                        //削除するフォルダへの参照を作成
                        var storageImageRef = firebase.storage().ref('/POPDemand/' + id + '/' + 'uploadImage' + i);
                        storageImageRef.delete();
                    }
                }
                //firestoreを削除
                db.collection('POPDemands').doc(id).delete();
                alert("削除されました。");
                setTimeout("location.reload()",500);
            } catch (err) {
            console.log(err);
            }
    
        })();
    }
    else {
        // キャンセルならアラートボックスを表示
        alert("キャンセルしました。");
    } 
};

//画像/データモーダル
function modalImages(id){
    console.log(id);
    var prevTask = Promise.resolve;
    (async () => {
        try { 
            const querySnapshot = await db.collection('POPDemands').doc(id).get();
            //写真の枚数を取得
            var photoCount = querySnapshot.get('photoCount');
            if(photoCount == 0 || photoCount == null){
                document.getElementById('modalImgs').innerHTML = '<p>画像/データファイルはありません。</p>';     
            }else{
                if(querySnapshot.get('orderCategory') == 'POP'){
                    //POPの時は写真を出す
                    document.getElementById('modalImgs').innerHTML = '<p>画像ロード中...</p>';  
                    var stocklist = "";
                    for(var i = 0; i < photoCount; i++){
                        var storageImageRef = firebase.storage().ref('/POPDemand/' + id + '/' + 'uploadImage' + i);
                        prevTask = Promise.all([prevTask,storageImageRef.getDownloadURL()]).then(([_,url])=>{
                            stocklist += "<img src = " + "'" + url + "'" + "></img>";
                            document.getElementById('modalImgs').innerHTML = stocklist;
                        }).catch(error => {
                        }).catch(() => {});
                    }
                }else{
                    //Webの時はaタグを羅列
                    document.getElementById('modalImgs').innerHTML = '<p>データリストをロード中...</p>';  
                    var stocklist = "";
                    for(var i = 0; i < photoCount; i++){
                        var storagefileRef = firebase.storage().ref('/POPDemand/' + id + '/' + 'uploadfile' + i);
                        prevTask = Promise.all([prevTask,storagefileRef.getDownloadURL()]).then(([_,url])=>{
                            stocklist += "<a href = " + "'" + url + "' target='_blank'" + "><p>データ</p></a>";
                            document.getElementById('modalImgs').innerHTML = stocklist;
                        }).catch(error => {
                        }).catch(() => {});
                    }
                }
            }
        } catch (err) {
        console.log(err);
        }

    })();
};

//CSV出力＆ダウンロード
function handleDownload(){
    var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);//文字コードをBOM付きUTF-8に指定
    var table = document.getElementById('download_table');
    var data_csv="";//ここに文字データとして値を格納していく

    for(var i = 0;  i < table.rows.length; i++){
        for(var j = 0; j < table.rows[i].cells.length -1; j++){
        //data_csv += table.rows[i].cells[j].innerText;//HTML中の表のセル値をdata_csvに格納
        if(j == 7){
            data_csv += table.rows[i].cells[j].innerText;
            data_csv += "\n";
        }else{
            data_csv += table.rows[i].cells[j].innerText;
            if(j == table.rows[i].cells.length-2){
                data_csv += ",";
                data_csv += table.rows[i].cells[0].innerText;
                data_csv += "\n";
            }
            else {
                data_csv += ",";//セル値の区切り文字として,を追加
            }
        }
        }
    }

    var blob = new Blob([ bom, data_csv], { "type" : "text/csv" });//data_csvのデータをcsvとしてダウンロードする関数
    if (window.navigator.msSaveBlob) { //IEの場合の処理
        window.navigator.msSaveBlob(blob, "test.csv"); 
        //window.navigator.msSaveOrOpenBlob(blob, "test.csv");// msSaveOrOpenBlobの場合はファイルを保存せずに開ける
    } else {
        document.getElementById("download").href = window.URL.createObjectURL(blob);
    }

    delete data_csv;//data_csvオブジェクトはもういらないので消去してメモリを開放
}

//PDF作成
function createPDF(id){
  (async () => {
    try {
      const carrentpopDemandDB = await db.collection('POPDemands').doc(id).get();
      //依頼区分
      var orderCategory = carrentpopDemandDB.get('orderCategory');
      //依頼日
      var orderDate = carrentpopDemandDB.get('orderDate');
      //納品日
      var preferredDate = carrentpopDemandDB.get('preferredDate');
      //店舗名
      var storeName = carrentpopDemandDB.get('storeName');
      //依頼者氏名
      var requesterName = carrentpopDemandDB.get('requesterName');
      //件名
      var subject = carrentpopDemandDB.get('subject');
      //要望詳細
      var demandDetail = carrentpopDemandDB.get('demandDetail');

      if(orderCategory == "web"){
        //webサイト
        var WebSite = carrentpopDemandDB.get('WebSite');
      }else{
        //出力
        var output = carrentpopDemandDB.get('output');
        //加工
        var processing = carrentpopDemandDB.get('processing');
        //枚数
        var number = carrentpopDemandDB.get('number');
        //サイズ
        var sizeCheckBox = carrentpopDemandDB.get('sizeCheckBox');
        var sizeDerection = carrentpopDemandDB.get('sizeDerection');
        var horizontal = carrentpopDemandDB.get('horizontal');
        var vertical = carrentpopDemandDB.get('vertical');
        var coveringFare = carrentpopDemandDB.get('coveringFare');
        if(sizeCheckBox == ''){
          var size = '縦' + horizontal + 'mm × 横' + vertical + 'mm + 貼り代' + coveringFare + 'mm';
        }else{
            var size = sizeCheckBox + ' ' + sizeDerection;
        }
      }

      //要望詳細の1行の文字数を指定
      var textLimit = 34;//ここだけ設定
      var tmp = demandDetail.split("\n");

      var kaigyouBody = [];


      for (var key in tmp) {

          if(tmp[key] != ""){

              if(tmp[key].length >= textLimit){

                  let oneSplit = tmp[key].split('');
                  let oneBody = [];

                  for (var key2 in oneSplit) {

                  //key2 1文字目でなく、さらに textLimit の倍数の数値なら改行コードを挿入
                  if(key2 != 0 && key2%textLimit == 0){
                      oneBody.push("\n");
                  }

                  oneBody.push(oneSplit[key2]);

              }

                  kaigyouBody.push(oneBody.join(""));

              } else {
                  kaigyouBody.push(tmp[key]);
              }

          }

      }


      var demandDetail = kaigyouBody.join("\n");

      console.log(demandDetail);


          //日本語フォント読み込み
          pdfMake.fonts = {
              GenShin: {
              normal: 'GenShinGothic-Normal-Sub.ttf',
              bold: 'GenShinGothic-Normal-Sub.ttf',
              italics: 'GenShinGothic-Normal-Sub.ttf',
              bolditalics: 'GenShinGothic-Normal-Sub.ttf'
              }
          };

          if(orderCategory == "POP"){
              //PDF作成処理
              var docDef = {
                  content: [
                      {
                          columns: [
                              {
                                  width: 'auto',
                                  text:  orderCategory + '要望',
                                  fontSize: 25
                              },
                              {
                                  width: '*',
                                  text: '所属長印',
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
                              widths: ['*', '*',220,'*'],
                              body: [
                                  ['依頼日', '納品日', '店舗名','依頼者氏名'],
                                  [{text:orderDate,fontSize:15},{text:preferredDate,fontSize:15},{text:storeName,fontSize:15},{text:requesterName,fontSize:15}],
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
                              widths: [50, '*'],
                              body: [
                                  ['件名',{text:subject,fontSize:15}],
                                  ['サイズ',{text:size,fontSize:20}]
                              ]
                          }
                      },
                      {
                          table: {
                              headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                              widths: ['*', '*', '*'],
                              body: [
                                  ['出力', '加工', '枚数'],
                                  [{text:output,fontSize:20},{text:processing,fontSize:20},{text:number,fontSize:20}]
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
                              widths: ['*'],
                              body: [
                                  ['要望詳細'],
                                  [{text:demandDetail,fontSize:15}]
                              ]
                          }
                      },
                  ],
                  styles:{
                      center:{
                          alignment: 'center'
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
                                  width: 'auto',
                                  text:  orderCategory + '要望',
                                  fontSize: 25
                              },
                              {
                                  width: '*',
                                  text: '所属長印',
                                  style: ['center','border'],
                                  fontSize: 20
                              }
                          ],
                          columnGap: 10
                      },
                      {
                          table: {
                              headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                              widths: ['*', '*',220,'*'],
                              body: [
                                  ['依頼日', '納品日', '店舗名','依頼者氏名'],
                                  [{text:orderDate,fontSize:15},{text:preferredDate,fontSize:15},{text:storeName,fontSize:15},{text:requesterName,fontSize:15}],
                              ]
                          }
                      },
                      {
                          table: {
                              headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                              widths: [60, '*'],
                              body: [
                                  ['件名',{text:subject,fontSize:15}]
                              ]
                          }
                      },
                      {
                          table: {
                              headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                              widths: [60, '*'],
                              body: [
                                  ['Webサイト',{text:WebSite,fontSize:15}]
                              ]
                          }
                      },
                      {
                          table: {
                              headerRows: 1, // tableが複数ページにまたがる場合に、ヘッダーとして扱う行数を指定
                              widths: ['*'],
                              body: [
                                  ['要望詳細'],
                                  [{text:demandDetail,fontSize:15}]
                              ]
                          }
                      },
                  ],
                  styles:{
                      center:{
                          alignment: 'center'
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
    } catch (err) {
    console.log(`Error: ${JSON.stringify(err)}`)
    }
})();
}