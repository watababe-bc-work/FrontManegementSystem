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

//初期ログイン機能
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        //最終ログイン日を更新
        var nowDate = new Date();
        db.collection('Users').doc(user.uid).update({
            loginDate:nowDate,
        });
        setTimeout("history.back()",2000);
    }else{

    }
});

//ログイン
function login(){
    var email = document.getElementById('email_login').value;
    var password = document.getElementById('password_login').value;
    document.getElementById('Alert').innerHTML = '<div class="alertCheck alert-danger" role="alert">ログイン確認中です...</div>';
    firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(function(error) {
        document.getElementById('Alert').innerHTML = '<div class="alert alert-danger" role="alert">メールアドレスまたはパスワードが誤っています。</div>';
    });
} 