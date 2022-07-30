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

//今日の日付
var today = new Date();
//編集する日付
var date = new Date(); 
var month = date.getMonth() + 1;
var day = date.getDate();
var weekday = [ "日", "月", "火", "水", "木", "金", "土" ];
var wday = "(" + weekday[ date.getDay() ] + ")";

var prevButton = document.getElementById('prevButton');
var nextButton = document.getElementById('nextButton');
nextButton.style.visibility = "hidden";

//各ユーザーのinput
var kumatani = document.getElementById('kumatani');
var shiotani = document.getElementById('shiotani');
var shibahara = document.getElementById('shibahara');
var takaku = document.getElementById('takaku');
var saeki = document.getElementById('saeki');
var nakamuraTsukasa = document.getElementById('nakamuraTsukasa');
var shirai = document.getElementById('shirai');
var shimizu = document.getElementById('shimizu');
var watanabeRumiko = document.getElementById('watanabeRumiko');
var yoshida = document.getElementById('yoshida');
var masukudo = document.getElementById('masukudo');
var kudou = document.getElementById('kudou');
var uruwashi = document.getElementById('uruwashi');
var kimura = document.getElementById('kimura');
var nagasawa = document.getElementById('nagasawa');
var satou = document.getElementById('satou');
var kojima = document.getElementById('kojima');
var yamada = document.getElementById('yamada');
var matoi = document.getElementById('matoi');
var ishida = document.getElementById('ishida');
var toro = document.getElementById('toro');
var shimano = document.getElementById('shimano');
var yamagishi = document.getElementById('yamagishi');
var nakaura = document.getElementById('nakaura');
var hirai = document.getElementById('hirai');
var suda = document.getElementById('suda');
var takahashiMikiya = document.getElementById('takahashiMikiya');
var tanabe = document.getElementById('tanabe');
var doi = document.getElementById('doi');
var inoue = document.getElementById('inoue');
var komano = document.getElementById('komano');
var okamura = document.getElementById('okamura');
var ishi = document.getElementById('ishi');
var hamada = document.getElementById('hamada');
var okuhara = document.getElementById('okuhara');
var nakata = document.getElementById('nakata');
var iwataYukari = document.getElementById('iwataYukari');
var nakanishi = document.getElementById('nakanishi');
var mizumura = document.getElementById('mizumura');
var nakamuraGou = document.getElementById('nakamuragou');
var kubota = document.getElementById('kubota');

//今日の予定を表示
(async () => {
    try {
        //今日の日付を表示
        var wday = "(" + weekday[ date.getDay() ] + ")";
        document.getElementById('today').textContent = month + "/" + day + wday;

        //今月初めて開いていれば、DB情報をキャッシュする
        var query = await db.collection('actProgram').doc('contentDay' + day).get(); 
        var queryDate = query.get('updated_at').toDate().toLocaleString('ja-JP', {month:'numeric',day:'numeric'});
        if(queryDate != month + "/" + day){
            //DBをキャッシュ
            db.collection('actProgram').doc('contentDay' + day).update({
                kumatani:"",
                shiotani:"",
                shibahara:"",
                takaku:"",
                saeki:"",
                nakamuraTsukasa:"",
                shirai:"",
                shimizu:"",
                watanabeRumiko:"",
                yoshida:"",
                masukudo:"",
                kudou:"",
                uruwashi:"",
                kimura:"",
                nagasawa:"",
                satou:"",
                kojima:"",
                yamada:"",
                matoi:"",
                ishida:"",
                toro:"",
                shimano:"",
                yamagishi:"",
                nakaura:"",
                hirai:"",
                suda:"",
                takahashiMikiya:"",
                tanabe:"",
                doi:"",
                inoue:"",
                komano:"",
                okamura:"",
                ishi:"",
                hamada:"",
                okuhara:"",
                nakata:"",
                iwataYukari:"",
                nakanishi:"",
                mizumura:"",
                nakamuraGou:"",
                kubota:"",
                updated_at:firebase.firestore.FieldValue.serverTimestamp(),
            });
        }

        //DB表示
        kumatani.value = query.get('kumatani');
        shiotani.value = query.get('shiotani');
        shibahara.value = query.get('shibahara');
        takaku.value = query.get('takaku');
        saeki.value = query.get('saeki');
        nakamuraTsukasa.value = query.get('nakamuraTsukasa');
        shirai.value = query.get('shirai');
        shimizu.value = query.get('shimizu');
        watanabeRumiko.value = query.get('watanabeRumiko');
        yoshida.value = query.get('yoshida');
        masukudo.value = query.get('masukudo');
        kudou.value = query.get('kudou');
        uruwashi.value = query.get('uruwashi');
        kimura.value = query.get('kimura');
        nagasawa.value = query.get('nagasawa');
        satou.value = query.get('satou');
        kojima.value = query.get('kojima');
        yamada.value = query.get('yamada');
        matoi.value = query.get('matoi');
        ishida.value = query.get('ishida');
        toro.value = query.get('toro');
        shimano.value = query.get('shimano');
        yamagishi.value = query.get('yamagishi');
        nakaura.value = query.get('nakaura');
        hirai.value = query.get('hirai');
        suda.value = query.get('suda');
        takahashiMikiya.value = query.get('takahashiMikiya');
        tanabe.value = query.get('tanabe');
        doi.value = query.get('doi');
        inoue.value = query.get('inoue');
        komano.value = query.get('komano');
        okamura.value = query.get('okamura');
        ishi.value = query.get('ishi');
        hamada.value = query.get('hamada');
        okuhara.value = query.get('okuhara');
        nakata.value = query.get('nakata');
        iwataYukari.value = query.get('iwataYukari');
        nakanishi.value = query.get('nakanishi');
        mizumura.value = query.get('mizumura');
        nakamuraGou.value = query.get('nakamuraGou');
        kubota.value = query.get('kubota');
    
    } catch (err) {
    console.log(err);
    }
})();

//DB更新
function update(){
    var updateDay = date.getDate();

    //DBへ送信
    db.collection('actProgram').doc('contentDay' + updateDay).update({
        kumatani:kumatani.value,
        shiotani:shiotani.value,
        shibahara:shibahara.value,
        takaku:takaku.value,
        saeki:saeki.value,
        nakamuraTsukasa:nakamuraTsukasa.value,
        shirai:shirai.value,
        shimizu:shimizu.value,
        watanabeRumiko:watanabeRumiko.value,
        yoshida:yoshida.value,
        masukudo:masukudo.value,
        kudou:kudou.value,
        uruwashi:uruwashi.value,
        kimura:kimura.value,
        nagasawa:nagasawa.value,
        satou:satou.value,
        kojima:kojima.value,
        yamada:yamada.value,
        matoi:matoi.value,
        ishida:ishida.value,
        toro:toro.value,
        shimano:shimano.value,
        yamagishi:yamagishi.value,
        nakaura:nakaura.value,
        hirai:hirai.value,
        suda:suda.value,
        takahashiMikiya:takahashiMikiya.value,
        tanabe:tanabe.value,
        doi:doi.value,
        inoue:inoue.value,
        komano:komano.value,
        okamura:okamura.value,
        ishi:ishi.value,
        hamada:hamada.value,
        okuhara:okamura.value,
        nakata:nakata.value,
        iwataYukari:iwataYukari.value,
        nakanishi:nakanishi.value,
        mizumura:mizumura.value,
        nakamuraGou:nakamuraGou.value,
        kubota:kubota.value,
    });
    var collectAlert = document.getElementById('collectAlert');
    collectAlert.innerHTML = '<div class="alert alert-success" role="alert">編集完了!リロードします。</div>';
    setTimeout("location.reload()",2000);
}

//前の日を表示
function returnTable(){
    (async () => {
        try {
            //一回ボタンが押されるごとに前日になっていく
            date = new Date(date.getFullYear(), date.getMonth(),date.getDate() - 1);
            var prevMonth = date.getMonth() + 1;
            var prevDay = date.getDate();
            wday = "(" + weekday[ date.getDay() ] + ")";
            document.getElementById('today').textContent = prevMonth + "/" + prevDay + wday;

            //次の日へボタンを表示
            nextButton.style.visibility = "";

            //一ヶ月前の今日になったら前に戻るを非表示
            if(month - 1 == prevMonth && day + 1 == prevDay){
                prevButton.style.visibility = 'hidden';
            }

            var query = await db.collection('actProgram').doc('contentDay' + prevDay).get(); 
            //DB表示
            kumatani.value = query.get('kumatani');
            shiotani.value = query.get('shiotani');
            shibahara.value = query.get('shibahara');
            takaku.value = query.get('takaku');
            saeki.value = query.get('saeki');
            nakamuraTsukasa.value = query.get('nakamuraTsukasa');
            shirai.value = query.get('shirai');
            shimizu.value = query.get('shimizu');
            watanabeRumiko.value = query.get('watanabeRumiko');
            yoshida.value = query.get('yoshida');
            masukudo.value = query.get('masukudo');
            kudou.value = query.get('kudou');
            uruwashi.value = query.get('uruwashi');
            kimura.value = query.get('kimura');
            nagasawa.value = query.get('nagasawa');
            satou.value = query.get('satou');
            kojima.value = query.get('kojima');
            yamada.value = query.get('yamada');
            matoi.value = query.get('matoi');
            ishida.value = query.get('ishida');
            toro.value = query.get('toro');
            shimano.value = query.get('shimano');
            yamagishi.value = query.get('yamagishi');
            nakaura.value = query.get('nakaura');
            hirai.value = query.get('hirai');
            suda.value = query.get('suda');
            takahashiMikiya.value = query.get('takahashiMikiya');
            tanabe.value = query.get('tanabe');
            doi.value = query.get('doi');
            inoue.value = query.get('inoue');
            komano.value = query.get('komano');
            okamura.value = query.get('okamura');
            ishi.value = query.get('ishi');
            hamada.value = query.get('hamada');
            okuhara.value = query.get('okuhara');
            nakata.value = query.get('nakata');
            iwataYukari.value = query.get('iwataYukari');
            nakanishi.value = query.get('nakanishi');
            mizumura.value = query.get('mizumura');
            nakamuraGou.value = query.get('nakamuraGou');
            kubota.value = query.get('kubota');

        } catch (err) {
        console.log(err);
        }
    })();
}

//次の日を表示
function nextPegination(){
    (async () => {
        try {
            //一回ボタンが押されるごとに後日になっていく
            date = new Date(date.getFullYear(), date.getMonth(),date.getDate() + 1);
            var nextMonth = date.getMonth() + 1;
            var nextDay = date.getDate();
            wday = "(" + weekday[ date.getDay() ] + ")";
            document.getElementById('today').textContent = nextMonth + "/" + nextDay + wday;

            //前に戻るを表示
            prevButton.style.visibility = '';
            //今日になったら次の日へを非表示
            if(month == nextMonth && day == nextDay){
                nextButton.style.visibility = 'hidden';
            }

            var query = await db.collection('actProgram').doc('contentDay' + nextDay).get(); 
            //DB表示
            kumatani.value = query.get('kumatani');
            shiotani.value = query.get('shiotani');
            shibahara.value = query.get('shibahara');
            takaku.value = query.get('takaku');
            saeki.value = query.get('saeki');
            nakamuraTsukasa.value = query.get('nakamuraTsukasa');
            shirai.value = query.get('shirai');
            shimizu.value = query.get('shimizu');
            watanabeRumiko.value = query.get('watanabeRumiko');
            yoshida.value = query.get('yoshida');
            masukudo.value = query.get('masukudo');
            kudou.value = query.get('kudou');
            uruwashi.value = query.get('uruwashi');
            kimura.value = query.get('kimura');
            nagasawa.value = query.get('nagasawa');
            satou.value = query.get('satou');
            kojima.value = query.get('kojima');
            yamada.value = query.get('yamada');
            matoi.value = query.get('matoi');
            ishida.value = query.get('ishida');
            toro.value = query.get('toro');
            shimano.value = query.get('shimano');
            yamagishi.value = query.get('yamagishi');
            nakaura.value = query.get('nakaura');
            hirai.value = query.get('hirai');
            suda.value = query.get('suda');
            takahashiMikiya.value = query.get('takahashiMikiya');
            tanabe.value = query.get('tanabe');
            doi.value = query.get('doi');
            inoue.value = query.get('inoue');
            komano.value = query.get('komano');
            okamura.value = query.get('okamura');
            ishi.value = query.get('ishi');
            hamada.value = query.get('hamada');
            okuhara.value = query.get('okuhara');
            nakata.value = query.get('nakata');
            iwataYukari.value = query.get('iwataYukari');
            nakanishi.value = query.get('nakanishi');
            mizumura.value = query.get('mizumura');
            nakamuraGou.value = query.get('nakamuraGou');
            kubota.value = query.get('kubota');

        } catch (err) {
        console.log(err);
        }
    })();
}
