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
      if (user.emailVerified) {
        model.currentUser = user
        // model.currentUser = {
        //   displayName: user.displayName,
        //   email: user.email
        // }
        view.setActiveScreen('chatScreen')
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

