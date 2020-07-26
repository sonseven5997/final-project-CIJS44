window.onload = () => {

  const firebaseConfig = {
    apiKey: "AIzaSyB48uWim6oBeFnwh4EAiCIz-uTJTcBbJpE",
    authDomain: "tindx-859f1.firebaseapp.com",
    databaseURL: "https://tindx-859f1.firebaseio.com",
    projectId: "tindx-859f1",
    storageBucket: "tindx-859f1.appspot.com",
    messagingSenderId: "647564294858",
    appId: "1:647564294858:web:57bba09cba7963e0019233",
    measurementId: "G-QMVWRCWTP8"
  };
  firebase.initializeApp(firebaseConfig);
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      //user.emailVerified = true
      if (user.emailVerified) {
        model.currentUser = user

        // console.log(model.currentUser)
        

        firebase.firestore().collection('users').where('uid', '==', model.currentUser.uid).limit(1).get().then(
          (querySnapshot) => {
            if (querySnapshot.docs.length === 1) {
              console.log("duong: user already exist in collection users!")
              model.currentUser = utils.getDataFromDoc(querySnapshot.docs[0])     //gán model.currentUser vào record trong collection users 
              console.log(model.currentUser)
              view.setActiveScreen('swipeScreen')
            } else {
              model.createUserProfile(model.currentUser)
              view.setActiveScreen('changeProfileSettingScreen') //log in lần đầu thì chuyển đến sửa profile ngay
            }
          }
        ).catch((e) =>{
          alert(e.message)
        })
        

      } else {
        view.setActiveScreen('loginScreen')
      }
    } else {
      view.setActiveScreen('loginScreen')
    }
  });
  console.log(firebase.app().name)
  console.log('loaded!')
  // view.setActiveScreen('registerScreen')
  // view.setActiveScreen('loginScreen')

  // templateQueryDatabase()
}

