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

//新規作成
function create(){
    var email = document.getElementById('email_login').value;
    var password = document.getElementById('password_login').value;
    var CheckPassword = document.getElementById('password_check').value;
    document.getElementById('Alert_success').innerHTML = '<div class="alertCheck alert-success" role="alert">アカウント作成中です...</div>';
    if(password == CheckPassword){
        //アカウント新規作成
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((user) => {
            var user = firebase.auth().currentUser;
            var nowDate = new Date();
            var userName = document.getElementById('userName').value;
            db.collection('Users').doc(user.uid).set({
                userName:userName,
                loginDate:nowDate,
            });
            document.getElementById('Alert_success').innerHTML = '<div class="alert alert-success" role="alert">アカウント作成が完了しました。そのままページをお閉じください。</div>';
        })
        .catch(function(error) {
            console.log(error);
            document.getElementById('Alert_success').style.display = "none";
            document.getElementById('Alert_danger').innerHTML = '<div class="alert alert-danger" role="alert">アカウント作成に失敗しました。項目は全て記入してください。</div>';
        });
    }else{
        document.getElementById('Alert_success').style.display = "none";
        document.getElementById('Alert_danger').innerHTML = '<div class="alert alert-danger" role="alert">新規パスワードと確認用パスワードが一致していません。</div>';
    }
} 

