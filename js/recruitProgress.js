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

//一覧

var query="";
var querySnapshot="";

var hundleDownload2Check = false;

//テーブル表示(初期値)
(async () => {
    try {
      // 省略 
      // (Cloud Firestoreのインスタンスを初期化してdbにセット)
      const TodaysMonth = new Date().getMonth() + 1 ;
      var stocklist = '<table class="table table-striped" id="download_table"><tbody><tr><th colspan="3"><p id = "monthTitle">'+ TodaysMonth +'月進捗</p></th></tr><tr><th>面接数</th><th>応募数</th><th>取組・課題</th></tr>';
      var stocklist1 = '<table class="table table-striped" id="download_table2"><tbody><tr><th colspan="4">現状</th></tr><tr><th></th><th>入社</th><th>不足</th><th>退社</th></tr>';
      const start = new Date(new Date().getFullYear() + "-" + TodaysMonth + "-" + "01");
      const end = new Date(new Date().getFullYear() + "-" + TodaysMonth + "-" + "31");
      query = await db.collection('interview').where('ReceptionDate','>',start).where('ReceptionDate','<',end);

    //総合管理面接数
    query.where('post','==','総合管理').where('Status','in',['面接済み','採用','不採用'],).orderBy('ReceptionDate').get().then(snap => {
        stocklist += '<tr><td>' + snap.size + '</td>';
    });
    //総合管理応募数
    query.where('post','==','総合管理').orderBy('ReceptionDate').get().then(snap => {
        stocklist += '<td>' + snap.size + '</td>';
        //総合管理取組・課題
        stocklist += '<td><input type="text" id="total_management"></td></tr>';
        //取組・課題の値を取得
        (async () => {
            try {
                queryRef2 = await db.collection('recruitProgress').where('name','==','総合管理').get();
                queryRef2.forEach((postDoc) => {
                    document.getElementById('total_management').value = postDoc.get('text');
                })
            } catch (err) {
                console.log(err);
            }
        })();
    });
    //総合管理入社数
    query.where('post','==','総合管理').where('Status','==','入社',).orderBy('ReceptionDate').get().then(snap => {
        stocklist1 += '<tr><th>総合管理</th><td>' + snap.size + '</td>';
        //総合管理不足数
        stocklist1 += '<td><input type="text" id="total_management_loss"></td>';
        //不足の値を取得
        (async () => {
            try {
                queryRef3 = await db.collection('recruitProgress').where('name','==','総合管理').get();
                queryRef3.forEach((postDoc) => {
                    document.getElementById('total_management_loss').value = postDoc.get('text_loss');
                })
            } catch (err) {
                console.log(err);
            }
        })();
    });
    //総合管理退社数
    query.where('post','==','総合管理').where('Status','==','退社',).orderBy('ReceptionDate').get().then(snap => {
        stocklist1 += '<td>' + snap.size + '</td></tr>';
    });

    //運営面接数
    query.where('post','==','運営').where('Status','in',['面接済み','採用','不採用'],).orderBy('ReceptionDate').get().then(snap => {
        stocklist += '<tr><td>' + snap.size + '</td>';
    });
    //運営応募数
    query.where('post','==','運営').orderBy('ReceptionDate').get().then(snap => {
        stocklist += '<td>' + snap.size + '</td>';
        //運営取組・課題
        stocklist += '<td><input type="text" id="management"></td></tr>';
        //取組・課題の値を取得
        (async () => {
            try {
                queryRef2 = await db.collection('recruitProgress').where('name','==','運営').get();
                queryRef2.forEach((postDoc) => {
                    document.getElementById('management').value = postDoc.get('text');
                })
            } catch (err) {
                console.log(err);
            }
        })();
    });
    //運営入社数
    query.where('post','==','運営').where('Status','==','入社',).orderBy('ReceptionDate').get().then(snap => {
        stocklist1 += '<tr><th>運営</th><td>' + snap.size + '</td>';
        //運営不足数
        stocklist1 += '<td><input type="text" id="management_loss"></td>';
        //不足の値を取得
        (async () => {
            try {
                queryRef3 = await db.collection('recruitProgress').where('name','==','運営').get();
                queryRef3.forEach((postDoc) => {
                    document.getElementById('management_loss').value = postDoc.get('text_loss');
                })
            } catch (err) {
                console.log(err);
            }
        })();
    });
    //運営退社数
    query.where('post','==','運営').where('Status','==','退社',).orderBy('ReceptionDate').get().then(snap => {
        stocklist1 += '<td>' + snap.size + '</td></tr>';
    });

    //メンテ面接数
    query.where('post','==','メンテ').where('Status','in',['面接済み','採用','不採用'],).orderBy('ReceptionDate').get().then(snap => {
        stocklist += '<tr><td>' + snap.size + '</td>';
    });
    //メンテ応募数
    query.where('post','==','メンテ').orderBy('ReceptionDate').get().then(snap => {
        stocklist += '<td>' + snap.size + '</td>';
        //メンテ取組・課題
        stocklist += '<td><input type="text" id="maintenance"></td></tr>';
        //取組・課題の値を取得
        (async () => {
            try {
                queryRef2 = await db.collection('recruitProgress').where('name','==','メンテ').get();
                queryRef2.forEach((postDoc) => {
                    document.getElementById('maintenance').value = postDoc.get('text');
                })
            } catch (err) {
                console.log(err);
            }
        })();
    });
    //メンテ入社数
    query.where('post','==','メンテ').where('Status','==','入社',).orderBy('ReceptionDate').get().then(snap => {
        stocklist1 += '<tr><th>メンテ</th><td>' + snap.size + '</td>';
        //メンテ不足数
        stocklist1 += '<td><input type="text" id="maintenance_loss"></td>';
        //不足の値を取得
        (async () => {
            try {
                queryRef3 = await db.collection('recruitProgress').where('name','==','メンテ').get();
                queryRef3.forEach((postDoc) => {
                    document.getElementById('maintenance_loss').value = postDoc.get('text_loss');
                })
            } catch (err) {
                console.log(err);
            }
        })();
    });
    //メンテ退社数
    query.where('post','==','メンテ').where('Status','==','退社',).orderBy('ReceptionDate').get().then(snap => {
        stocklist1 += '<td>' + snap.size + '</td></tr>';
    });

    //フロント面接数
    query.where('post','==','フロント').where('Status','in',['面接済み','採用','不採用'],).orderBy('ReceptionDate').get().then(snap => {
        stocklist += '<tr><td>' + snap.size + '</td>';
    });
    //フロント応募数
    query.where('post','==','フロント').orderBy('ReceptionDate').get().then(snap => {
        stocklist += '<td>' + snap.size + '</td>';
        //フロント取組・課題
        stocklist += '<td><input type="text" id="front"></td></tr>';
        //取組・課題の値を取得
        (async () => {
            try {
                queryRef2 = await db.collection('recruitProgress').where('name','==','フロント').get();
                queryRef2.forEach((postDoc) => {
                    document.getElementById('front').value = postDoc.get('text');
                })
            } catch (err) {
                console.log(err);
            }
        })();
    });
    //フロント入社数
    query.where('post','==','フロント').where('Status','==','入社',).orderBy('ReceptionDate').get().then(snap => {
        stocklist1 += '<tr><th>フロント</th><td>' + snap.size + '</td>';
        //フロント不足数
        stocklist1 += '<td><input type="text" id="front_loss"></td>';
        //不足の値を取得
        (async () => {
            try {
                queryRef3 = await db.collection('recruitProgress').where('name','==','フロント').get();
                queryRef3.forEach((postDoc) => {
                    document.getElementById('front_loss').value = postDoc.get('text_loss');
                })
            } catch (err) {
                console.log(err);
            }
        })();
    });
    //フロント退社数
    query.where('post','==','フロント').where('Status','==','退社',).orderBy('ReceptionDate').get().then(snap => {
        stocklist1 += '<td>' + snap.size + '</td></tr>';
    });

    //池袋面接数
    query.where('post','==','池袋').where('Status','in',['面接済み','採用','不採用'],).orderBy('ReceptionDate').get().then(snap => {
        stocklist += '<tr><td>' + snap.size + '</td>';
    });
    //池袋応募数
    query.where('post','==','池袋').orderBy('ReceptionDate').get().then(snap => {
        stocklist += '<td>' + snap.size + '</td>';
        //池袋取組・課題
        stocklist += '<td><input type="text" id="ikebukuro"></td></tr>';
        //取組・課題の値を取得
        (async () => {
            try {
                queryRef2 = await db.collection('recruitProgress').where('name','==','池袋').get();
                queryRef2.forEach((postDoc) => {
                    document.getElementById('ikebukuro').value = postDoc.get('text');
                })
            } catch (err) {
                console.log(err);
            }
        })();
    });
    //池袋入社数
    query.where('post','==','池袋').where('Status','==','入社',).orderBy('ReceptionDate').get().then(snap => {
        stocklist1 += '<tr><th>池袋</th><td>' + snap.size + '</td>';
        //池袋不足数
        stocklist1 += '<td><input type="text" id="ikebukuro_loss"></td>';
        //不足の値を取得
        (async () => {
            try {
                queryRef3 = await db.collection('recruitProgress').where('name','==','池袋').get();
                queryRef3.forEach((postDoc) => {
                    document.getElementById('ikebukuro_loss').value = postDoc.get('text_loss');
                })
            } catch (err) {
                console.log(err);
            }
        })();
    });
    //池袋退社数
    query.where('post','==','池袋').where('Status','==','退社',).orderBy('ReceptionDate').get().then(snap => {
        stocklist1 += '<td>' + snap.size + '</td></tr>';
    });

    //渋谷面接数
    query.where('post','==','渋谷').where('Status','in',['面接済み','採用','不採用'],).orderBy('ReceptionDate').get().then(snap => {
        stocklist += '<tr><td>' + snap.size + '</td>';
    });
    //渋谷応募数
    query.where('post','==','渋谷').orderBy('ReceptionDate').get().then(snap => {
        stocklist += '<td>' + snap.size + '</td>';
        //渋谷取組・課題
        stocklist += '<td><input type="text" id="shibuya"></td></tr>';
        //取組・課題の値を取得
        (async () => {
            try {
                queryRef2 = await db.collection('recruitProgress').where('name','==','渋谷').get();
                queryRef2.forEach((postDoc) => {
                    document.getElementById('shibuya').value = postDoc.get('text');
                })
            } catch (err) {
                console.log(err);
            }
        })();
    });
    //渋谷入社数
    query.where('post','==','渋谷').where('Status','==','入社',).orderBy('ReceptionDate').get().then(snap => {
        stocklist1 += '<tr><th>渋谷</th><td>' + snap.size + '</td>';
        //渋谷不足数
        stocklist1 += '<td><input type="text" id="shibuya_loss"></td>';
        //不足の値を取得
        (async () => {
            try {
                queryRef3 = await db.collection('recruitProgress').where('name','==','渋谷').get();
                queryRef3.forEach((postDoc) => {
                    document.getElementById('shibuya_loss').value = postDoc.get('text_loss');
                })
            } catch (err) {
                console.log(err);
            }
        })();
    });
    //渋谷退社数
    query.where('post','==','渋谷').where('Status','==','退社',).orderBy('ReceptionDate').get().then(snap => {
        stocklist1 += '<td>' + snap.size + '</td></tr>';
    });

    //新宿面接数
    query.where('post','==','新宿').where('Status','in',['面接済み','採用','不採用'],).orderBy('ReceptionDate').get().then(snap => {
        stocklist += '<tr><td>' + snap.size + '</td>';
    });
    //新宿応募数
    query.where('post','==','新宿').orderBy('ReceptionDate').get().then(snap => {
        stocklist += '<td>' + snap.size + '</td>';
        //新宿取組・課題
        stocklist += '<td><input type="text" id="shinjyuku"></td></tr>';
        //取組・課題の値を取得
        (async () => {
            try {
                queryRef2 = await db.collection('recruitProgress').where('name','==','新宿').get();
                queryRef2.forEach((postDoc) => {
                    document.getElementById('shinjyuku').value = postDoc.get('text');
                })
            } catch (err) {
                console.log(err);
            }
        })();
    });
    //新宿入社数
    query.where('post','==','新宿').where('Status','==','入社',).orderBy('ReceptionDate').get().then(snap => {
        stocklist1 += '<tr><th>新宿</th><td>' + snap.size + '</td>';
        //新宿不足数
        stocklist1 += '<td><input type="text" id="shinjyuku_loss"></td>';
        //不足の値を取得
        (async () => {
            try {
                queryRef3 = await db.collection('recruitProgress').where('name','==','新宿').get();
                queryRef3.forEach((postDoc) => {
                    document.getElementById('shinjyuku_loss').value = postDoc.get('text_loss');
                })
            } catch (err) {
                console.log(err);
            }
        })();
    });
    //新宿退社数
    query.where('post','==','新宿').where('Status','==','退社',).orderBy('ReceptionDate').get().then(snap => {
        stocklist1 += '<td>' + snap.size + '</td></tr>';
    });
    
    //五反田面接数
    query.where('post','==','五反田').where('Status','in',['面接済み','採用','不採用'],).orderBy('ReceptionDate').get().then(snap => {
        stocklist += '<tr><td>' + snap.size + '</td>';
    });
    //五反田応募数
    query.where('post','==','五反田').orderBy('ReceptionDate').get().then(snap => {
        stocklist += '<td>' + snap.size + '</td>';
        //五反田取組・課題
        stocklist += '<td><input type="text" id="gotanda"></td></tr>';
        //取組・課題の値を取得
        (async () => {
            try {
                queryRef2 = await db.collection('recruitProgress').where('name','==','五反田').get();
                queryRef2.forEach((postDoc) => {
                    document.getElementById('gotanda').value = postDoc.get('text');
                })
            } catch (err) {
                console.log(err);
            }
        })();
    });
    //五反田入社数
    query.where('post','==','五反田').where('Status','==','入社',).orderBy('ReceptionDate').get().then(snap => {
        stocklist1 += '<tr><th>五反田</th><td>' + snap.size + '</td>';
        //五反田不足数
        stocklist1 += '<td><input type="text" id="gotanda_loss"></td>';
        //不足の値を取得
        (async () => {
            try {
                queryRef3 = await db.collection('recruitProgress').where('name','==','五反田').get();
                queryRef3.forEach((postDoc) => {
                    document.getElementById('gotanda_loss').value = postDoc.get('text_loss');
                })
            } catch (err) {
                console.log(err);
            }
        })();
    });
    //五反田退社数
    query.where('post','==','五反田').where('Status','==','退社',).orderBy('ReceptionDate').get().then(snap => {
        stocklist1 += '<td>' + snap.size + '</td></tr>';
    });

    //新横浜・川崎面接数
    query.where('post','==','新横浜・川崎').where('Status','in',['面接済み','採用','不採用'],).orderBy('ReceptionDate').get().then(snap => {
        stocklist += '<tr><td>' + snap.size + '</td>';
    });
    //新横浜・川崎応募数
    query.where('post','==','新横浜・川崎').orderBy('ReceptionDate').get().then(snap => {
        stocklist += '<td>' + snap.size + '</td>';
        //新横浜・川崎取組・課題
        stocklist += '<td><input type="text" id="shinyoko_kawasaki"></td></tr>';
        //取組・課題の値を取得
        (async () => {
            try {
                queryRef2 = await db.collection('recruitProgress').where('name','==','新横浜・川崎').get();
                queryRef2.forEach((postDoc) => {
                    document.getElementById('shinyoko_kawasaki').value = postDoc.get('text');
                })
            } catch (err) {
                console.log(err);
            }
        })();
    });
    //新横浜・川崎入社数
    query.where('post','==','新横浜・川崎').where('Status','==','入社',).orderBy('ReceptionDate').get().then(snap => {
        stocklist1 += '<tr><th>新横浜・川崎</th><td>' + snap.size + '</td>';
        //新横浜・川崎不足数
        stocklist1 += '<td><input type="text" id="shinyoko_kawasaki_loss"></td>';
        //不足の値を取得
        (async () => {
            try {
                queryRef3 = await db.collection('recruitProgress').where('name','==','新横浜・川崎').get();
                queryRef3.forEach((postDoc) => {
                    document.getElementById('shinyoko_kawasaki_loss').value = postDoc.get('text_loss');
                })
            } catch (err) {
                console.log(err);
            }
        })();
    });
    //新横浜・川崎退社数
    query.where('post','==','新横浜・川崎').where('Status','==','退社',).orderBy('ReceptionDate').get().then(snap => {
        stocklist1 += '<td>' + snap.size + '</td></tr>';
    });

    //千葉・船橋・松戸面接数
    query.where('post','==','千葉・船橋・松戸').where('Status','in',['面接済み','採用','不採用'],).orderBy('ReceptionDate').get().then(snap => {
        stocklist += '<tr><td>' + snap.size + '</td>';
    });
    //千葉・船橋・松戸応募数
    query.where('post','==','千葉・船橋・松戸').orderBy('ReceptionDate').get().then(snap => {
        stocklist += '<td>' + snap.size + '</td>';
        //千葉・船橋・松戸取組・課題
        stocklist += '<td><input type="text" id="tiba_funabashi_matudo"></td></tr>';
        //取組・課題の値を取得
        (async () => {
            try {
                queryRef2 = await db.collection('recruitProgress').where('name','==','千葉・船橋・松戸').get();
                queryRef2.forEach((postDoc) => {
                    document.getElementById('tiba_funabashi_matudo').value = postDoc.get('text');
                })
            } catch (err) {
                console.log(err);
            }
        })();
    });
    //千葉・船橋・松戸入社数
    query.where('post','==','千葉・船橋・松戸').where('Status','==','入社',).orderBy('ReceptionDate').get().then(snap => {
        stocklist1 += '<tr><th>千葉・船橋・松戸</th><td>' + snap.size + '</td>';
        //千葉・船橋・松戸不足数
        stocklist1 += '<td><input type="text" id="tiba_funabashi_matudo_loss"></td>';
        //不足の値を取得
        (async () => {
            try {
                queryRef3 = await db.collection('recruitProgress').where('name','==','千葉・船橋・松戸').get();
                queryRef3.forEach((postDoc) => {
                    document.getElementById('tiba_funabashi_matudo_loss').value = postDoc.get('text_loss');
                })
            } catch (err) {
                console.log(err);
            }
        })();
    });
    //千葉・船橋・松戸退社数
    query.where('post','==','千葉・船橋・松戸').where('Status','==','退社',).orderBy('ReceptionDate').get().then(snap => {
        stocklist1 += '<td>' + snap.size + '</td></tr>';
    });

    //岩槻面接数
    query.where('post','==','岩槻').where('Status','in',['面接済み','採用','不採用'],).orderBy('ReceptionDate').get().then(snap => {
        stocklist += '<tr><td>' + snap.size + '</td>';
    });
    //岩槻応募数
    query.where('post','==','岩槻').orderBy('ReceptionDate').get().then(snap => {
        stocklist += '<td>' + snap.size + '</td>';
        //岩槻取組・課題
        stocklist += '<td><input type="text" id="iwatsuki"></td></tr>';
        //取組・課題の値を取得
        (async () => {
            try {
                queryRef2 = await db.collection('recruitProgress').where('name','==','岩槻').get();
                queryRef2.forEach((postDoc) => {
                    document.getElementById('iwatsuki').value = postDoc.get('text');
                })
            } catch (err) {
                console.log(err);
            }
        })();
    });
    //岩槻入社数
    query.where('post','==','岩槻').where('Status','==','入社',).orderBy('ReceptionDate').get().then(snap => {
        stocklist1 += '<tr><th>岩槻</th><td>' + snap.size + '</td>';
        //岩槻不足数
        stocklist1 += '<td><input type="text" id="iwatsuki_loss"></td>';
        //不足の値を取得
        (async () => {
            try {
                queryRef3 = await db.collection('recruitProgress').where('name','==','岩槻').get();
                queryRef3.forEach((postDoc) => {
                    document.getElementById('iwatsuki_loss').value = postDoc.get('text_loss');
                })
            } catch (err) {
                console.log(err);
            }
        })();
    });
    //岩槻退社数
    query.where('post','==','岩槻').where('Status','==','退社',).orderBy('ReceptionDate').get().then(snap => {
        stocklist1 += '<td>' + snap.size + '</td></tr>';
    });

    //仙台面接数
    query.where('post','==','仙台').where('Status','in',['面接済み','採用','不採用'],).orderBy('ReceptionDate').get().then(snap => {
        stocklist += '<tr><td>' + snap.size + '</td>';
    });
    //仙台応募数
    query.where('post','==','仙台').orderBy('ReceptionDate').get().then(snap => {
        stocklist += '<td>' + snap.size + '</td>';
        //仙台取組・課題
        stocklist += '<td><input type="text" id="sendai"></td></tr>';
        //取組・課題の値を取得
        (async () => {
            try {
                queryRef2 = await db.collection('recruitProgress').where('name','==','仙台').get();
                queryRef2.forEach((postDoc) => {
                    document.getElementById('sendai').value = postDoc.get('text');
                })
            } catch (err) {
                console.log(err);
            }
        })();
        stocklist += '</tbody></table>';
        stocklist += '<button class="btn btn-success" onclick="update()">取組・課題変更</button>';
        document.getElementById('table_list_progress').innerHTML = stocklist;
    });
    //仙台入社数
    query.where('post','==','仙台').where('Status','==','入社',).orderBy('ReceptionDate').get().then(snap => {
        stocklist1 += '<tr><th>仙台</th><td>' + snap.size + '</td>';
        //仙台不足数
        stocklist1 += '<td><input type="text" id="sendai_loss"></td>';
        //不足の値を取得
        (async () => {
            try {
                queryRef3 = await db.collection('recruitProgress').where('name','==','仙台').get();
                queryRef3.forEach((postDoc) => {
                    document.getElementById('sendai_loss').value = postDoc.get('text_loss');
                })
            } catch (err) {
                console.log(err);
            }
        })();
    });
    //仙台退社数
    query.where('post','==','仙台').where('Status','==','退社',).orderBy('ReceptionDate').get().then(snap => {
        stocklist1 += '<td>' + snap.size + '</td></tr>';
        stocklist1 += '</tbody></table>';
        stocklist1 += '<button class="btn btn-success" onclick="update1()">不足変更</button>';
        document.getElementById('table_list').innerHTML = stocklist1;
    });

    } catch (err) {
        console.log(err);
    }
})();

//取組・課題変更
function update(){
    //総合管理
    var total_management = document.getElementById('total_management').value;
    db.collection('recruitProgress').doc('JQj8yVfh3JkMZAhs6AX5').update({
        text:total_management
    });

    //運営
    var management = document.getElementById('management').value;
    db.collection('recruitProgress').doc('BgMnrME6DoxOgRFl4aIf').update({
        text:management
    });

    //メンテ
    var maintenance = document.getElementById('maintenance').value;
    db.collection('recruitProgress').doc('PZUvay4dM9x4TcHxiBIa').update({
        text:maintenance
    });

    //フロント
    var front = document.getElementById('front').value;
    db.collection('recruitProgress').doc('FfpX3VEVnaCFPyZmOUyN').update({
        text:front
    });

    //池袋
    var ikebukuro = document.getElementById('ikebukuro').value;
    db.collection('recruitProgress').doc('dzCWGXeO7L3iPDMpqBGe').update({
        text:ikebukuro
    });

    //渋谷
    var shibuya = document.getElementById('shibuya').value;
    db.collection('recruitProgress').doc('ppLbV2MQTm2EwnX0zwy8').update({
        text:shibuya
    });

    //新宿
    var shinjyuku = document.getElementById('shinjyuku').value;
    db.collection('recruitProgress').doc('IQ3zBTGV76eGErO0cogy').update({
        text:shinjyuku
    });

    //五反田
    var gotanda = document.getElementById('gotanda').value;
    db.collection('recruitProgress').doc('sDsOJbWlKeKiKoHxM8cm').update({
        text:gotanda
    });

    //新横浜・川崎
    var shinyoko_kawasaki = document.getElementById('shinyoko_kawasaki').value;
    db.collection('recruitProgress').doc('xt4udMsrglXDEc3hjPav').update({
        text:shinyoko_kawasaki
    });

    //千葉・船橋・松戸
    var tiba_funabashi_matudo = document.getElementById('tiba_funabashi_matudo').value;
    db.collection('recruitProgress').doc('Z1xW4qa8PnBgWrc6cLvx').update({
        text:tiba_funabashi_matudo
    });

    //岩槻
    var iwatsuki = document.getElementById('iwatsuki').value;
    db.collection('recruitProgress').doc('NEEWClllugfpxPIxXy3J').update({
        text:iwatsuki
    });

    //仙台
    var sendai = document.getElementById('sendai').value;
    db.collection('recruitProgress').doc('QyH673jytrRPxI8s1oDM').update({
        text:sendai
    });

    var collectAlert = document.getElementById('collectAlert');
    collectAlert.innerHTML = '<div class="alert alert-success" role="alert">編集完了!リロードします。</div>';
    setTimeout("location.reload()",2000);
}

//不足変更
function update1(){
    //総合管理
    var total_management = document.getElementById('total_management_loss').value;
    db.collection('recruitProgress').doc('JQj8yVfh3JkMZAhs6AX5').update({
        text_loss:total_management
    });

    //運営
    var management = document.getElementById('management_loss').value;
    db.collection('recruitProgress').doc('BgMnrME6DoxOgRFl4aIf').update({
        text_loss:management
    });

    //メンテ
    var maintenance = document.getElementById('maintenance_loss').value;
    db.collection('recruitProgress').doc('PZUvay4dM9x4TcHxiBIa').update({
        text_loss:maintenance
    });

    //フロント
    var front = document.getElementById('front_loss').value;
    db.collection('recruitProgress').doc('FfpX3VEVnaCFPyZmOUyN').update({
        text_loss:front
    });

    //池袋
    var ikebukuro = document.getElementById('ikebukuro_loss').value;
    db.collection('recruitProgress').doc('dzCWGXeO7L3iPDMpqBGe').update({
        text_loss:ikebukuro
    });

    //渋谷
    var shibuya = document.getElementById('shibuya_loss').value;
    db.collection('recruitProgress').doc('ppLbV2MQTm2EwnX0zwy8').update({
        text_loss:shibuya
    });

    //新宿
    var shinjyuku = document.getElementById('shinjyuku_loss').value;
    db.collection('recruitProgress').doc('IQ3zBTGV76eGErO0cogy').update({
        text_loss:shinjyuku
    });

    //五反田
    var gotanda = document.getElementById('gotanda_loss').value;
    db.collection('recruitProgress').doc('sDsOJbWlKeKiKoHxM8cm').update({
        text_loss:gotanda
    });

    //新横浜・川崎
    var shinyoko_kawasaki = document.getElementById('shinyoko_kawasaki_loss').value;
    db.collection('recruitProgress').doc('xt4udMsrglXDEc3hjPav').update({
        text_loss:shinyoko_kawasaki
    });

    //千葉・船橋・松戸
    var tiba_funabashi_matudo = document.getElementById('tiba_funabashi_matudo_loss').value;
    db.collection('recruitProgress').doc('Z1xW4qa8PnBgWrc6cLvx').update({
        text_loss:tiba_funabashi_matudo
    });

    //岩槻
    var iwatsuki = document.getElementById('iwatsuki_loss').value;
    db.collection('recruitProgress').doc('NEEWClllugfpxPIxXy3J').update({
        text_loss:iwatsuki
    });

    //仙台
    var sendai = document.getElementById('sendai_loss').value;
    db.collection('recruitProgress').doc('QyH673jytrRPxI8s1oDM').update({
        text_loss:sendai
    });

    var collectAlert = document.getElementById('collectAlert');
    collectAlert.innerHTML = '<div class="alert alert-success" role="alert">編集完了!リロードします。</div>';
    setTimeout("location.reload()",2000);
}

//検索
function monthSearch(){
    var monthSearch = document.getElementById('month_input').value;
    const TodaysYear = new Date().getFullYear();
    const TodaysMonth = new Date().getMonth() + 1 ;
    console.log(typeof(TodaysMonth));
    const TodaysMonthString = String(TodaysMonth);
    if(monthSearch == TodaysYear + '-' + TodaysMonthString.padStart(2, '0')){
        setTimeout("location.reload()",2000);
    };
    document.getElementById('download').textContent = "結果をPDFで保存";
    hundleDownload2Check = true;
    console.log(hundleDownload2Check);
    (async () => {
        try {
          // 省略 
          // (Cloud Firestoreのインスタンスを初期化してdbにセット)
          var stocklist = '<table class="table table-striped" id="download_table"><tbody><tr><th colspan="2">'+ monthSearch +'月進捗</th></tr><tr><th>面接数</th><th>応募数</th></tr>';
          var stocklist1 = '<table class="table table-striped" id="download_table2"><tbody><tr><th colspan="3">'+ monthSearch +'月結果</th></tr><tr><th></th><th>入社</th><th>退社</th></tr>';
          const start = new Date(monthSearch +  "-" + "01");
          const end = new Date(monthSearch +  "-" + "31");
          query = await db.collection('interview').where('ReceptionDate','>',start).where('ReceptionDate','<',end);
    
        //総合管理面接数
        query.where('post','==','総合管理').where('Status','in',['面接済み','採用','不採用'],).orderBy('ReceptionDate').get().then(snap => {
            stocklist += '<tr><td>' + snap.size + '</td>';
        });
        //総合管理応募数
        query.where('post','==','総合管理').orderBy('ReceptionDate').get().then(snap => {
            stocklist += '<td>' + snap.size + '</td>';
        });
        //総合管理入社数
        query.where('post','==','総合管理').where('Status','==','入社',).orderBy('ReceptionDate').get().then(snap => {
            stocklist1 += '<tr><th>総合管理</th><td>' + snap.size + '</td>';
        });
        //総合管理退社数
        query.where('post','==','総合管理').where('Status','==','退社',).orderBy('ReceptionDate').get().then(snap => {
            stocklist1 += '<td>' + snap.size + '</td></tr>';
        });
    
        //運営面接数
        query.where('post','==','運営').where('Status','in',['面接済み','採用','不採用'],).orderBy('ReceptionDate').get().then(snap => {
            stocklist += '<tr><td>' + snap.size + '</td>';
        });
        //運営応募数
        query.where('post','==','運営').orderBy('ReceptionDate').get().then(snap => {
            stocklist += '<td>' + snap.size + '</td>';
        });
        //運営入社数
        query.where('post','==','運営').where('Status','==','入社',).orderBy('ReceptionDate').get().then(snap => {
            stocklist1 += '<tr><th>運営</th><td>' + snap.size + '</td>';
        });
        //運営退社数
        query.where('post','==','運営').where('Status','==','退社',).orderBy('ReceptionDate').get().then(snap => {
            stocklist1 += '<td>' + snap.size + '</td></tr>';
        });
    
        //メンテ面接数
        query.where('post','==','メンテ').where('Status','in',['面接済み','採用','不採用'],).orderBy('ReceptionDate').get().then(snap => {
            stocklist += '<tr><td>' + snap.size + '</td>';
        });
        //メンテ応募数
        query.where('post','==','メンテ').orderBy('ReceptionDate').get().then(snap => {
            stocklist += '<td>' + snap.size + '</td>';
        });
        //メンテ入社数
        query.where('post','==','メンテ').where('Status','==','入社',).orderBy('ReceptionDate').get().then(snap => {
            stocklist1 += '<tr><th>メンテ</th><td>' + snap.size + '</td>';
        });
        //メンテ退社数
        query.where('post','==','メンテ').where('Status','==','退社',).orderBy('ReceptionDate').get().then(snap => {
            stocklist1 += '<td>' + snap.size + '</td></tr>';
        });
    
        //フロント面接数
        query.where('post','==','フロント').where('Status','in',['面接済み','採用','不採用'],).orderBy('ReceptionDate').get().then(snap => {
            stocklist += '<tr><td>' + snap.size + '</td>';
        });
        //フロント応募数
        query.where('post','==','フロント').orderBy('ReceptionDate').get().then(snap => {
            stocklist += '<td>' + snap.size + '</td>';
        });
        //フロント入社数
        query.where('post','==','フロント').where('Status','==','入社',).orderBy('ReceptionDate').get().then(snap => {
            stocklist1 += '<tr><th>フロント</th><td>' + snap.size + '</td>';
        });
        //フロント退社数
        query.where('post','==','フロント').where('Status','==','退社',).orderBy('ReceptionDate').get().then(snap => {
            stocklist1 += '<td>' + snap.size + '</td></tr>';
        });
    
        //池袋面接数
        query.where('post','==','池袋').where('Status','in',['面接済み','採用','不採用'],).orderBy('ReceptionDate').get().then(snap => {
            stocklist += '<tr><td>' + snap.size + '</td>';
        });
        //池袋応募数
        query.where('post','==','池袋').orderBy('ReceptionDate').get().then(snap => {
            stocklist += '<td>' + snap.size + '</td>';
        });
        //池袋入社数
        query.where('post','==','池袋').where('Status','==','入社',).orderBy('ReceptionDate').get().then(snap => {
            stocklist1 += '<tr><th>池袋</th><td>' + snap.size + '</td>';
        });
        //池袋退社数
        query.where('post','==','池袋').where('Status','==','退社',).orderBy('ReceptionDate').get().then(snap => {
            stocklist1 += '<td>' + snap.size + '</td></tr>';
        });
    
        //渋谷面接数
        query.where('post','==','渋谷').where('Status','in',['面接済み','採用','不採用'],).orderBy('ReceptionDate').get().then(snap => {
            stocklist += '<tr><td>' + snap.size + '</td>';
        });
        //渋谷応募数
        query.where('post','==','渋谷').orderBy('ReceptionDate').get().then(snap => {
            stocklist += '<td>' + snap.size + '</td>';
        });
        //渋谷入社数
        query.where('post','==','渋谷').where('Status','==','入社',).orderBy('ReceptionDate').get().then(snap => {
            stocklist1 += '<tr><th>渋谷</th><td>' + snap.size + '</td>';
        });
        //渋谷退社数
        query.where('post','==','渋谷').where('Status','==','退社',).orderBy('ReceptionDate').get().then(snap => {
            stocklist1 += '<td>' + snap.size + '</td></tr>';
        });
    
        //新宿面接数
        query.where('post','==','新宿').where('Status','in',['面接済み','採用','不採用'],).orderBy('ReceptionDate').get().then(snap => {
            stocklist += '<tr><td>' + snap.size + '</td>';
        });
        //新宿応募数
        query.where('post','==','新宿').orderBy('ReceptionDate').get().then(snap => {
            stocklist += '<td>' + snap.size + '</td>';
        });
        //新宿入社数
        query.where('post','==','新宿').where('Status','==','入社',).orderBy('ReceptionDate').get().then(snap => {
            stocklist1 += '<tr><th>新宿</th><td>' + snap.size + '</td>';
        });
        //新宿退社数
        query.where('post','==','新宿').where('Status','==','退社',).orderBy('ReceptionDate').get().then(snap => {
            stocklist1 += '<td>' + snap.size + '</td></tr>';
        });
        
        //五反田面接数
        query.where('post','==','五反田').where('Status','in',['面接済み','採用','不採用'],).orderBy('ReceptionDate').get().then(snap => {
            stocklist += '<tr><td>' + snap.size + '</td>';
        });
        //五反田応募数
        query.where('post','==','五反田').orderBy('ReceptionDate').get().then(snap => {
            stocklist += '<td>' + snap.size + '</td>';
        });
        //五反田入社数
        query.where('post','==','五反田').where('Status','==','入社',).orderBy('ReceptionDate').get().then(snap => {
            stocklist1 += '<tr><th>五反田</th><td>' + snap.size + '</td>';
        });
        //五反田退社数
        query.where('post','==','五反田').where('Status','==','退社',).orderBy('ReceptionDate').get().then(snap => {
            stocklist1 += '<td>' + snap.size + '</td></tr>';
        });
    
        //新横浜・川崎面接数
        query.where('post','==','新横浜・川崎').where('Status','in',['面接済み','採用','不採用'],).orderBy('ReceptionDate').get().then(snap => {
            stocklist += '<tr><td>' + snap.size + '</td>';
        });
        //新横浜・川崎応募数
        query.where('post','==','新横浜・川崎').orderBy('ReceptionDate').get().then(snap => {
            stocklist += '<td>' + snap.size + '</td>';
        });
        //新横浜・川崎入社数
        query.where('post','==','新横浜・川崎').where('Status','==','入社',).orderBy('ReceptionDate').get().then(snap => {
            stocklist1 += '<tr><th>新横浜・川崎</th><td>' + snap.size + '</td>';
        });
        //新横浜・川崎退社数
        query.where('post','==','新横浜・川崎').where('Status','==','退社',).orderBy('ReceptionDate').get().then(snap => {
            stocklist1 += '<td>' + snap.size + '</td></tr>';
        });
    
        //千葉・船橋・松戸面接数
        query.where('post','==','千葉・船橋・松戸').where('Status','in',['面接済み','採用','不採用'],).orderBy('ReceptionDate').get().then(snap => {
            stocklist += '<tr><td>' + snap.size + '</td>';
        });
        //千葉・船橋・松戸応募数
        query.where('post','==','千葉・船橋・松戸').orderBy('ReceptionDate').get().then(snap => {
            stocklist += '<td>' + snap.size + '</td>';
        });
        //千葉・船橋・松戸入社数
        query.where('post','==','千葉・船橋・松戸').where('Status','==','入社',).orderBy('ReceptionDate').get().then(snap => {
            stocklist1 += '<tr><th>千葉・船橋・松戸</th><td>' + snap.size + '</td>';
        });
        //千葉・船橋・松戸退社数
        query.where('post','==','千葉・船橋・松戸').where('Status','==','退社',).orderBy('ReceptionDate').get().then(snap => {
            stocklist1 += '<td>' + snap.size + '</td></tr>';
        });
    
        //岩槻面接数
        query.where('post','==','岩槻').where('Status','in',['面接済み','採用','不採用'],).orderBy('ReceptionDate').get().then(snap => {
            stocklist += '<tr><td>' + snap.size + '</td>';
        });
        //岩槻応募数
        query.where('post','==','岩槻').orderBy('ReceptionDate').get().then(snap => {
            stocklist += '<td>' + snap.size + '</td>';
        });
        //岩槻入社数
        query.where('post','==','岩槻').where('Status','==','入社',).orderBy('ReceptionDate').get().then(snap => {
            stocklist1 += '<tr><th>岩槻</th><td>' + snap.size + '</td>';
        });
        //岩槻退社数
        query.where('post','==','岩槻').where('Status','==','退社',).orderBy('ReceptionDate').get().then(snap => {
            stocklist1 += '<td>' + snap.size + '</td></tr>';
        });
    
        //仙台面接数
        query.where('post','==','仙台').where('Status','in',['面接済み','採用','不採用'],).orderBy('ReceptionDate').get().then(snap => {
            stocklist += '<tr><td>' + snap.size + '</td>';
        });
        //仙台応募数
        query.where('post','==','仙台').orderBy('ReceptionDate').get().then(snap => {
            stocklist += '<td>' + snap.size + '</td>';
            stocklist += '</tbody></table>';
            stocklist += '<button class="btn btn-success" onclick="update()">取組・課題変更</button>';
            document.getElementById('table_list_progress').innerHTML = stocklist;
        });
        //仙台入社数
        query.where('post','==','仙台').where('Status','==','入社',).orderBy('ReceptionDate').get().then(snap => {
            stocklist1 += '<tr><th>仙台</th><td>' + snap.size + '</td>';
        });
        //仙台退社数
        query.where('post','==','仙台').where('Status','==','退社',).orderBy('ReceptionDate').get().then(snap => {
            stocklist1 += '<td>' + snap.size + '</td></tr>';
            stocklist1 += '</tbody></table>';
            stocklist1 += '<button class="btn btn-success" onclick="update1()">不足変更</button>';
            document.getElementById('table_list').innerHTML = stocklist1;
        });
    
        } catch (err) {
            console.log(err);
        }
    })();
}

//CSV出力＆ダウンロード
function handleDownload(){
    var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);//文字コードをBOM付きUTF-8に指定
    var table2 = document.getElementById('download_table2');
    var data_csv2 = "";
    for(var i = 0;  i < table2.rows.length; i++){
        for(var j = 0; j < table2.rows[i].cells.length; j++){
        data_csv2 += table2.rows[i].cells[j].innerText;
        if(hundleDownload2Check == false && i != 1 && j == 2){
            data_csv2 += table2.rows[i].cells[j].firstElementChild.value;
        }
        if(j == table2.rows[i].cells.length-1){
            data_csv2 += ",";
            data_csv2 += "\n";
        }
        else {
            data_csv2 += ",";//セル値の区切り文字として,を追加
        }
        }
    }

    var blob = new Blob([ bom, data_csv2], { "type" : "text/csv" });//data_csvのデータをcsvとしてダウンロードする関数
    if (window.navigator.msSaveBlob) { //IEの場合の処理
        window.navigator.msSaveBlob(blob, "test.csv"); 
        //window.navigator.msSaveOrOpenBlob(blob, "test.csv");// msSaveOrOpenBlobの場合はファイルを保存せずに開ける
    } else {
        document.getElementById("download").href = window.URL.createObjectURL(blob);
    }

    delete data_csv;//data_csvオブジェクトはもういらないので消去してメモリを開放
}

function handleDownload2(){
    var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);//文字コードをBOM付きUTF-8に指定
    var table = document.getElementById('download_table');
    var data_csv="";//ここに文字データとして値を格納していく

    for(var i = 0;  i < table.rows.length; i++){
        for(var j = 0; j < table.rows[i].cells.length; j++){
        data_csv += table.rows[i].cells[j].innerText;
        if(i != 1 && j == 2){
            data_csv += table.rows[i].cells[j].firstElementChild.value;
        }
        if(j == table.rows[i].cells.length-1){
            data_csv += ",";
            data_csv += "\n";
        }
        else {
            data_csv += ",";//セル値の区切り文字として,を追加
        }
        }
    }

    var blob = new Blob([ bom,data_csv], { "type" : "text/csv" });//data_csvのデータをcsvとしてダウンロードする関数
    if (window.navigator.msSaveBlob) { //IEの場合の処理
        window.navigator.msSaveBlob(blob, "test.csv"); 
        //window.navigator.msSaveOrOpenBlob(blob, "test.csv");// msSaveOrOpenBlobの場合はファイルを保存せずに開ける
    } else {
        document.getElementById("download2").href = window.URL.createObjectURL(blob);
    }

    delete data_csv;//data_csvオブジェクトはもういらないので消去してメモリを開放
}

