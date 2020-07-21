window.onload = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyA0d4x8L9I3moBCGXiBaqcEI5MQrDV2ltQ",
    authDomain: "chatapp-dd.firebaseapp.com",
    databaseURL: "https://chatapp-dd.firebaseio.com",
    projectId: "chatapp-dd",
    storageBucket: "chatapp-dd.appspot.com",
    messagingSenderId: "389335102992",
    appId: "1:389335102992:web:46a8c7e798ad604e877c95"
  };
  firebase.initializeApp(firebaseConfig);
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      if (user.emailVerified) {
        // model.currentUser = user
        model.currentUser = {
          displayName: user.displayName,
          email: user.email
        }
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

templateQueryDatabase = () => {
  const docId = 'oTVtYS2O9Ixhj5rVUHna'
  // get one
  firebase.firestore().collection('users').doc(docId).get().then(res => {
    console.log(getDataFromDoc(res))
  }).catch(err => {
    console.log(err)
  })
  // get many
  firebase.firestore().collection('users').where('age', '==', 20).get().then(res => {
    console.log(res)
    // console.log(getDataFromDoc(res.docs[0]))
    console.log(getDataFromDocs(res.docs));
    
  })
  // create
  const dataToCreate = {
    name: 'Create',
    age: 18,
    email: 'duongkx@gmail.com',
    phoneNumber: ['01233434343']
  }

  // firebase.firestore().collection('users').add(dataToCreate).then(res => {
  //   alert('added!')
  // })
  // update
  const docIdUpdate = 'B56BnDlsvdMoQvq5Z71I'
  const dataToUpdate = {
    age: 21,
    address: 'HN',
    phone: firebase.firestore.FieldValue.arrayUnion('090909094')
  }

  firebase.firestore().collection('users').doc(docIdUpdate).update(dataToUpdate).then(res => {
    // alert('updated!')
  })
  // delete
  const docIdDelete = 'DzvsrYM8CJQvuOgtY4El'
  firebase.firestore().collection('users').doc(docIdDelete).delete().then(res => {
    alert('deleted!')
  })
}

