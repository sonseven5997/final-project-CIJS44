const model = {}
model.currentUser = undefined
model.collectionName = 'conversations'
model.currentConversation = undefined
model.conversations = undefined
model.currentChatFriend = undefined

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
         
            
            if (user.user.emailVerified) {
                model.currentUser = user.user
                // console.log(user)
                // model.currentUser = {
                //     displayName: user.user.displayName,
                //     email: user.user.email
                // }
                // console.log(model.currentUser)
                

                // nếu chưa có document trong collection users thì thêm mới!
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
                model.currentChatFriend = model.currentConversation.users
                    .filter(item => item !== model.currentUser.email)[0]
                if(view.state==='chat'){
                    view.showCurrentConversation()
                }
                    
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

    model.currentChatFriend = model.currentConversation.users
        .filter(item => item !== model.currentUser.email)[0]   //khi click vào 1 conversation, update title thành email của người bạn chat
    console.log(model.currentChatFriend)
    view.showCurrentConversation()
}



model.createConversation = (conversation) => {

    firebase.firestore().collection(model.collectionName).add(conversation)
    view.backToChatScreen()

}

model.addUser = (email) => {   //add user to conversation
    const dataToUpdate = {
        users: firebase.firestore.FieldValue.arrayUnion(email)
    }
    firebase.firestore().collection(model.collectionName)
        .doc(model.currentConversation.id).update(dataToUpdate)
}



model.createUserProfile = (currentUser) => {
    now = new Date().toISOString
    const dataToCreate = {
        uid: currentUser.uid,
        displayName: currentUser.displayName,
        email: currentUser.email,
        bio: "",
        birthYear: "",
        images: ["", "", ""],
        matchedId: [],
        likedId: [],
        dislikedId: [],
        // lastActive: now,


    }
    firebase.firestore().collection('users').add(dataToCreate).then(res => {
        // model.currentUser = dataToCreate
        alert("created!")
    })

}

model.changeProfileSetting = (profileSetting) => {
    let dataToUpdate = undefined
    if (profileSetting.images.length !== 0) {
        profileSetting.images = profileSetting.images.map((picture) => utils.uploadPic(picture))
        dataToUpdate = {
            displayName: profileSetting.displayName,
            bio: profileSetting.bio,
            birthYear: profileSetting.birthYear,
            // images: firebase.firestore.FieldValue.arrayUnion(profileSetting.images),
            images: profileSetting.images
        }
    } else {
        delete profileSetting.images;
        dataToUpdate = profileSetting
    }


    firebase.firestore().collection('users')
        .where('uid', '==', model.currentUser.uid)
        .limit(1)
        .get()
        .then(
            (querySnapshot) => {
                var user = querySnapshot.docs[0];
                user.ref.update(dataToUpdate).then(
                    view.showCurrentUserProfile()
                )


            }
        )



    // view.backToChatScreen()

}

model.loadMatches = () => {
    
    if (model.currentUser.matchedId.length > 0) {
        console.log("eeee");
        console.log(model.currentUser.matchedId)

        firebase.firestore().collection('users').where('uid','in',model.currentUser.matchedId).get()
        .then(res => {
            console.log("ggggg")
            const data = utils.getDataFromDocs(res.docs)
            
            model.matches = data
            // model.currentMatch = data[0]
            if (view.state !=='profile'){
                view.showMatches()
            }
            
        })

    }
    // console.log("ffff");
    // console.log(model.matches)
    
    // view.showMatches()
}

model.changeCurrentMatch = (match) => {
    
    model.currentMatch = match
    
    view.showCurrentMatch()
}


model.listenUserChange = () => {
    let isFirstRun = false
    firebase.firestore().collection('users')
        .where('uid', '==', model.currentUser.uid)
        .onSnapshot((res) => {
            if (!isFirstRun) {
                isFirstRun = true
                return
            }
            // console.log(res)
            const docChanges = res.docChanges()
            console.log(docChanges)

            for (oneChange of docChanges) {
                const type = oneChange.type
                console.log(type)
                const oneChangeData = utils.getDataFromDoc(oneChange.doc)
                console.log(oneChangeData);
                if (type === 'modified') {
                    console.log(oneChangeData)

                    
                    
                    if (view.state==='profile'){
                        model.currentUser = oneChangeData
                        view.showCurrentUserProfile()
                    } else if (model.currentUser.matchedId.length !== oneChangeData.matchedId.length){
                        model.loadMatches()
                    }
                    

                }

            }
        })

    // khi ai đó  like mình, check xem mình đã like họ chưa --> update matches list
}

model.getListRecommendation = () => {
    listOfLike = model.currentUser.likedId
    listOfDislike = model.currentUser.dislikedId
    firebase.firestore().collection('users')
        .where(uid, '')
}