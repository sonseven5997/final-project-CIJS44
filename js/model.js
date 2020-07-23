const model = {}
model.currentUser = undefined
model.collectionName = 'conversations'
model.currentConversation = undefined
model.conversations = undefined
model.currentFriend = undefined

model.register = (firstName, lastname, email, password) => {
    firebase.auth().createUserWithEmailAndPassword(email, password).then((user) => {
        firebase.auth().currentUser.sendEmailVerification()
        firebase.auth().currentUser.updateProfile({
            displayName: firstName + ' ' + lastname
        })
        alert('Register success, please check your email!')
        view.setActiveScreen('loginScreen')

    }).catch((e) => {
        alert(e.message)
        console.log(e)
    })
}

model.login = (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((user) => {
            console.log(user)
            if (user.user.emailVerified) {
                model.currentUser = user.user
                // model.currentUser = {
                //     displayName: user.user.displayName,
                //     email: user.user.email
                // }
                console.log(model.currentUser)
                view.setActiveScreen('chatScreen')

                // nếu chưa có document trong collection users thì thêm mới!
                firebase.firestore().collection('users').where('uid', '==', model.currentUser.uid).limit(1).get().then(
                    (querySnapshot) => {
                        if (querySnapshot.docs.length === 1) {
                            console.log("duong: user already exist in collection users!")
                        } else {
                            model.createUserRecord(model.currentUser)
                            view.setActiveScreen('changeProfileSettingScreen') //log in lần đầu thì chuyển đến sửa profile ngay
                        }
                    }
                )

            } else {
                alert('Vefify your email!')
            }
        }).catch((e) => {
            alert(e.message)
        })
}

model.loadConversations = () => {
    firebase.firestore().collection(model.collectionName)
        .where('users', 'array-contains', model.currentUser.email)
        .get()
        .then(res => {
            const data = utils.getDataFromDocs(res.docs)
            model.conversations = data

            if (data.length > 0) {
                model.currentConversation = data[0]
                model.currentFriend = model.currentConversation.users
                .filter(item => item !== model.currentUser.email)[0]
                view.showCurrentConversation()
            }

            view.showConversation()
            // console.log(data);

        })
}


model.addMessage = (message) => {
    const dataToUpdate = {
        messages: firebase.firestore.FieldValue.arrayUnion(message),
    }
    firebase.firestore()
        .collection('conversations')
        .doc(model.currentConversation.id)
        .update(dataToUpdate)
}

model.listenConversationChange = () => {
    let isFirstRun = false
    firebase.firestore().collection(model.collectionName)
        .where('users', 'array-contains', model.currentUser.email)
        .onSnapshot((res) => {
            if (!isFirstRun) {
                isFirstRun = true
                return
            }
            // console.log(res)
            const docChanges = res.docChanges()
            // console.log(docChanges)

            for (oneChange of docChanges) {
                const type = oneChange.type
                console.log(type)
                const oneChangeData = utils.getDataFromDoc(oneChange.doc)
                console.log(oneChangeData);
                if (type === 'modified') {
                    console.log(oneChangeData)

                    if (oneChangeData.id === model.currentConversation.id) {

                        if (model.currentConversation.users.length === oneChangeData.users.length) {
                            view.addMessage(oneChangeData.messages[oneChangeData.messages.length - 1])
                        } else {
                            view.addUser(oneChangeData.users[oneChangeData.users.length - 1])
                        }
                        model.currentConversation = oneChangeData


                    }

                    for (let i = 0; i < model.conversations.length; i++) {
                        const element = model.conversations[i]
                        if (element.id === oneChangeData.id) {
                            model.conversations[i] = oneChangeData
                            if (oneChangeData.messages[oneChangeData.messages.length - 1].owner !== model.currentUser.email) {
                                view.showNotify(oneChangeData.id)
                            }

                        }
                    }
                    // console.log(model.conversations)

                }

                else if (type === 'added') {
                    model.conversations.push(oneChangeData)
                    view.addConversation(oneChangeData)
                    view.showNotify(oneChangeData.id)
                }
            }
        })
}


model.changeCurrentConversation = (conversationId) => {
    // for (conversation of model.conversations) {
    //     if (conversation.id === conversationId) {
    //         model.currentConversation = conversation
    //     }
    // }

    model.currentConversation = model.conversations
        .filter(item => item.id === conversationId)[0]
    console.log(model.currentConversation)

    model.currentFriend = model.currentConversation.users
        .filter(item => item !== model.currentUser.email)[0]   //khi click vào 1 conversation, update title thành email của người bạn chat
    console.log(model.currentFriend)
    view.showCurrentConversation()
}

model.changeProfileSetting = (profileSetting) => {

    const docIdUpdate = model.currentUser.uid
    console.log(docIdUpdate)
    console.log(profileSetting)

    firebase.firestore().collection('users')
        .where('uid', '==', model.currentUser.uid)
        .limit(1)
        .get()
        .then(
            (querySnapshot) => {
                var user = querySnapshot.docs[0];
                user.ref.update(profileSetting)
            }
        )
    // update(profileSetting).then(res => {
    //     alert('updated!')
    // })
    view.backToChatScreen()

}



model.addUser = (email) => {
    const dataToUpdate = {
        users: firebase.firestore.FieldValue.arrayUnion(email)
    }
    firebase.firestore().collection(model.collectionName)
        .doc(model.currentConversation.id).update(dataToUpdate)
}



model.createUserRecord = (currentUser) => {
    const dataToCreate = {
        uid: currentUser.uid,
    }
    firebase.firestore().collection('users').add(dataToCreate).then(res => {
        // alert('added!')
    })

}