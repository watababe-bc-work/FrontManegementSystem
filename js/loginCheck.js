// Initialize Cloud Firestore through Firebase
var db = firebase.firestore(); 

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        (async () => {
            try {
                //最終ログイン確認した日付
                var query = await db.collection('Users').doc(user.uid).get();
                var loginDate = query.get('loginDate');
                //今日の日付
                var today = new Date();
                //最終ログイン確認が1週間以上前ならログアウトする
                if((today - loginDate.toDate()) / 86400000 >= 7){
                    firebase.auth().onAuthStateChanged(user => {
                        firebase
                        .auth()
                        .signOut()
                        .then(() => {
                            console.log('ログアウトしました');
                        })
                        .catch((error) => {
                            console.log(`ログアウト時にエラーが発生しました (${error})`);
                        });
                    });
                }
            } catch (err) {
              console.log(err);
            }

        })();
    }else{
        location.href = "login.html" ;
    }
});