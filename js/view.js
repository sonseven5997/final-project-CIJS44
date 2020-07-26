const view = {}

view.setActiveScreen = async (screenName) => {
    switch (screenName) {
        case 'registerScreen':
            document.getElementById('app').innerHTML = components.registerScreen
            const registerForm = document.getElementById('form-register')
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault()
                const registerInfo = {
                    firstName: registerForm.firstName.value,
                    lastName: registerForm.lastName.value,
                    email: registerForm.email.value,
                    password: registerForm.password.value,
                    confirmPassword: registerForm.confirmPassword.value,
                }
                controller.register(registerInfo)
                
            })

            const loginSpan = document.getElementById('redirect-to-login')
            loginSpan.addEventListener('click', (e) => {
                view.setActiveScreen('loginScreen')
            })
            break
        case 'loginScreen':
            document.getElementById('app').innerHTML = components.loginScreen
            const loginForm = document.getElementById('form-login')
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault()
                const loginInfo = {
                    email: loginForm.email.value,
                    password: loginForm.password.value,
                }
                controller.login(loginInfo)
                view.setActiveScreen('matchScreen')
            })
            const registerSpan = document.getElementById('redirect-to-register')
            registerSpan.addEventListener('click', (e) => {
                view.setActiveScreen('registerScreen')
            })
            break
        case 'chatScreen':
            document.getElementById('app').innerHTML = components.chatScreen
            const sendMessageForm = document.querySelector('#sendMessageForm')
            // sendMessageForm.message.focus()
            sendMessageForm.addEventListener('submit', (e) => {
                e.preventDefault()
                if (sendMessageForm.message.value.trim()) {
                    const message = {
                        owner: model.currentUser.email,
                        content: sendMessageForm.message.value,
                        createdAt: new Date().toISOString()
                    }
                    // view.addMessage(message)
                    model.addMessage(message)
                } else {
                    // alert('blank message?')
                }
            })

            document.getElementById('my-profile')
                .addEventListener('click', () => {
                    view.setActiveScreen('changeProfileSettingScreen')
                })

            const addUserForm = document.getElementById('add-user-form')
            addUserForm.addEventListener('submit', (e) => {
                e.preventDefault()
                // if (addUserForm.email.value.trim()) {
                //     controller.addUser(addUserForm.email.value.trim())
                // }
                controller.addUser(addUserForm.email.value)
                addUserForm.email.value = ''
            })



            model.loadConversations()
            model.listenConversationChange()

            document.querySelector('#sendMessageForm input').addEventListener('click', () => {
                view.hideNotify(model.currentConversation.id)
            })

            break
        case 'changeProfileSettingScreen':
            document.getElementById('app').innerHTML = components.changeProfileSettingScreen
            document.getElementById('back-to-chat').addEventListener('click', () => {
                view.backToChatScreen()
            })
            const changeProfileSettingForm = document.getElementById('change-profile-setting-form')
            let gender = true
            if (document.getElementById('1').checked === false) {
                gender = false
            }
            changeProfileSettingForm.addEventListener('submit', (e) => {
                e.preventDefault()
                
                const data = {
                    displayName: changeProfileSettingForm.displayName.value,
                    bio: changeProfileSettingForm.bio.value,
                    birthYear: changeProfileSettingForm.birthYear.value,
                    gender: gender,
                    picture1: changeProfileSettingForm.picture1.files,
                    picture2: changeProfileSettingForm.picture2.files,
                    picture3: changeProfileSettingForm.picture3.files,
                }
                controller.changeProfileSetting(data)
                firebase.firestore().collection('users').where('uid','===',model.currentUser.uid).update(data)
            })
            break
        
        case 'matchScreen' :
            document.getElementById('app').innerHTML = components.matchScreen
            let i=0
            let j=0
            let res = await firebase.firestore().collection('users').get()
            console.log(res)
            let data = utils.getDataFromDocs(res.docs)
            // .then(res => {
            //     return utils.getDataFromDocs(res.docs)
            // })
            console.log('response',data)
                data = data.sort((a,b) => {return new Date(a.createdAt) - new Date(b.createdAt)})
                
                let myIndex = data.findIndex((e) => {
                    return e.uid === model.currentUser.uid
                })
                console.log(myIndex)
                let lastSeenIndex = data.findIndex((e) => {
                    return e.uid === data[myIndex].lastSeen
                })
                console.log(lastSeenIndex)
                if (lastSeenIndex !== -1){
                    j = lastSeenIndex
                    if (j !== myIndex) {
                        view.showMatchOption(data[j+1].displayName,2020-data[j+1].birthYear,data[j+1].bio,data[j+1].images[i])
                    } else {
                        j++
                    }
                } else {
                    if (j !== myIndex) {
                        view.showMatchOption(data[j+1].displayName,2020-data[j+1].birthYear,data[j+1].bio,data[j+1].images[i])
                    } else {
                        j++
                    }
                }
                
            document.onkeydown = function(e) {
                switch (e.keyCode) {
                    case 37: //arrow left
                        if (j == myIndex) {
                            j++
                        } else {
                            if (j<data.length){
                                i--
                                while(i<0){
                                    i=i+3
                                }
                            view.showMatchOption(data[j].displayName,2020-data[j].birthYear,data[j].bio,data[j].images[i])
                            } else {
                                j=data.length -1
                                view.showMatchOption(data[j].displayName,2020-data[j].birthYear,data[j].bio,data[j].images[i])
                            }
                        
                        }
                        
                        
                        
                        break;

                    case 38: //arrow up
                        if (j == myIndex){
                            j++
                        } else {
                            if (j<data.length-1){
                                j++
                            }  
                            else {
                                j=data.length-1
                            }                          
                            let dataToUpdate = {
                                lastSeen: data[j-1].uid,
                                favouriteId: firebase.firestore.FieldValue.arrayUnion(data[j-1].uid)
                            }
                            firebase.firestore().collection('users').doc(data[myIndex].id).update(dataToUpdate)
                            alert(`You liked ${data[j-1].displayName}`)
                            console.log(data[j-1])
                            if (data[j-1].favouriteId.find((e) => {console.log(e); return e == data[myIndex].uid}) !== undefined){
                                    let myUpdate = {
                                        matchedId: firebase.firestore.FieldValue.arrayUnion(data[lastSeenIndex].uid)
                                    }
                                    let theirUpdate = {
                                        matchedId: firebase.firestore.FieldValue.arrayUnion(data[myIndex].uid)
                                    }
                                    firebase.firestore().collection('users').doc(data[myIndex].id).update(myUpdate)
                                    firebase.firestore().collection('users').doc(data[lastSeenIndex].id).update(theirUpdate)
                                    alert(`Congratulation! You matched with ${data[j-1].displayName} `)
                            }
                            // if(lastSeenIndex == -1) {
                            //     lastSeenIndex = j
                            //     console .log(lastSeenIndex)
                            // } else {
                            //     console.log(lastSeenIndex)
                            //     if (data[lastSeenIndex].favouriteId.find((e) => {
                            //         return e == data[myIndex].uid
                            //     }) !== -1) {
                            //         let myUpdate = {
                            //             matchedId: firebase.firestore.FieldValue.arrayUnion(data[lastSeenIndex].uid)
                            //         }
                            //         let theirUpdate = {
                            //             matchedId: firebase.firestore.FieldValue.arrayUnion(data[myIndex].uid)
                            //         }
                            //         firebase.firestore().collection('users').doc(data[myIndex].id).update(myUpdate)
                            //         firebase.firestore().collection('users').doc(data[lastSeenIndex].id).update(theirUpdate)
                            //         alert(`Congratulation! You matched with ${data[j-1].displayName} `)
                            //     }
    
                            // }  
                            console.log('j = ',j)
                            view.showMatchOption(data[j].displayName,2020-data[j].birthYear,data[j].bio,data[j].images[i])
                        }   
                        
                        break;
                    case 39: //arrow right
                        console.log(j)
                        i = (i+1)%3;
                        if (j<data.length){
                            view.showMatchOption(data[j].displayName,2020-data[j].birthYear,data[j].bio,data[j].images[i])
                        } else {
                            j=data.length-1
                            view.showMatchOption(data[j].displayName,2020-data[j].birthYear,data[j].bio,data[j].images[i])
                        }
                            
                        
                        break;
                    case 40:  //arrow down
                            if (j == myIndex){
                                j++
                            } else {
                                if (j<data.length){
                                    j++
                                }
                                alert('Nope')
                                console.log(data[myIndex].lastSeen)
                                let dataToUpdate2 = {
                                    lastSeen: data[j-1].uid
    
                                }
                                firebase.firestore().collection('users').doc(data[myIndex].id).update(dataToUpdate2)
                                view.showMatchOption(data[j].displayName,2020-data[j].birthYear,data[j].bio,data[j].images[i])
                            }
                            
                        break;
                }
            };

            
            document.getElementById('my-profile')
                .addEventListener('click', () => {
                    view.setActiveScreen('changeProfileSettingScreen')
                })
                
            
            
            break

                
            
    }
}

view.setErrorMessage = (id, message) => {
    document.getElementById(id).innerText = message
}

view.addMessage = (message) => {
    const messageWrapper = document.createElement('div')
    messageWrapper.classList.add('message')
    if (message.owner === model.currentUser.email) {
        messageWrapper.classList.add('mine')
        messageWrapper.innerHTML = `
        <div class="content">${message.content}</div>
        `
    } else {
        messageWrapper.classList.add('their')
        messageWrapper.innerHTML = `
        <div class="owner">${message.owner}</div>
        <div class="content">${message.content}</div>
        `
    }
    sendMessageForm.message.value = ''
    const listMessage = document.querySelector('.list-message')


    document.querySelector(".list-message").appendChild(messageWrapper);
    listMessage.scrollTop = listMessage.scrollHeight;
}




view.showCurrentConversation = () => {
    document.querySelector('.list-message').innerHTML = ''
    for (let oneMessage of model.currentConversation.messages) {
        view.addMessage(oneMessage)
    }
    // console.log('duong')
    // console.log(model.currentConversation)
    document.querySelector('.main .conversation-title')
        .innerHTML = model.currentConversation.title

    view.showCurrentConversationUsers(model.currentConversation)
}

view.showConversation = () => {
    document.querySelector('.list-conversations').innerHTML = '' //20200711 - Duong - refresh list after sign out and sign back in
    for (oneConversation of model.conversations) {
        view.addConversation(oneConversation)
    }


}

view.addConversation = (conversation) => {
    const conversationWrapper = document.createElement('div')
    conversationWrapper.classList.add('conversation')
    conversationWrapper.id = conversation.id
    if (conversation.id === model.currentConversation.id) {
        conversationWrapper.classList.add('current')
    }
    conversationWrapper.innerHTML = `
        <div class ="conversation-title">${conversation.title}</div>
        <div class ="conversation-num-users">${conversation.users.length} users</div>
        <div class ="conversation-notify"></div>
        `
    conversationWrapper.addEventListener('click', () => {
        document.querySelector('.current').classList.remove('current')
        conversationWrapper.classList.add('current')
        model.changeCurrentConversation(conversation.id)
        view.hideNotify(conversation.id)
        // conversationWrapper.lastElementChild.style = 'display: none'
    })

    document.querySelector('.list-conversations').appendChild(conversationWrapper)
}

view.backToChatScreen = () => {
    document.getElementById('app').innerHTML = components.chatScreen
    const sendMessageForm = document.querySelector('#sendMessageForm')
    // sendMessageForm.message.focus()
    sendMessageForm.addEventListener('submit', (e) => {
        e.preventDefault()
        if (sendMessageForm.message.value.trim()) {
            const message = {
                owner: model.currentUser.email,
                content: sendMessageForm.message.value,
                createdAt: new Date().toISOString()
            }
            // view.addMessage(message)
            model.addMessage(message)
        } else {
            // alert('blank message?')
        }
    })

    document.getElementById('my-profile')
        .addEventListener('click', () => {
            view.setActiveScreen('changeProfileSettingScreen')
        })
    view.showConversation()
    view.showCurrentConversation()
    const addUserForm = document.getElementById('add-user-form')
    addUserForm.addEventListener('submit', (e) => {
        e.preventDefault()
        // if (addUserForm.email.value.trim()) {
        //     controller.addUser(addUserForm.email.value.trim())
        // }
        controller.addUser(addUserForm.email.value)
        addUserForm.email.value = ''
    })

    document.querySelector('#sendMessageForm input').addEventListener('click', () => {
        view.hideNotify(model.currentConversation.id)
    })
}


view.showCurrentConversationUsers = (users) => {
    document.querySelector('.list-users').innerHTML = ''
    for (oneUser of model.currentConversation.users) {
        view.addUser(oneUser)
    }
}

view.addUser = (user) => {
    const userWrapper = document.createElement('div')

    userWrapper.innerHTML = `
        <p class ="email">${user}</p>
        
    `
    document.querySelector('.list-users').appendChild(userWrapper)
}

view.showNotify = (conversationId) => {
    document.getElementById(conversationId).lastElementChild.style = 'display :block'
}

view.hideNotify = (conversationId) => {
    document.getElementById(conversationId).lastElementChild.style = 'display :none'
}

// ======================================================

// view.showMatches = () => {
//     document.querySelector('.list-matches').innerHTML = '' // refresh list after sign out and sign back in
//     for (oneMatch of model.matches) {
//         view.addMatch(oneMatch)
//     }


// }

// view.addMatch = (match) => {
//     const matchWrapper = document.createElement('div')
//     matchWrapper.classList.add('match')
//     matchWrapper.id = match.id
//     if (match.id === model.currentMatch.id) {
//         matchWrapper.classList.add('current')
//     }
//     matchWrapper.innerHTML = `
//         <img src='https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png' />
//         <div class ="match-title">${match.id}</div>
//         `
//     matchWrapper.addEventListener('click', () => {
//         document.querySelector('.current').classList.remove('current')
//         matchWrapper.classList.add('current')
//         model.changeCurrentMatch(match.id)
     
//         // matchWrapper.lastElementChild.style = 'display: none'
//     })

//     document.querySelector('.list-matches').appendChild(matchWrapper)
// }

view.showMatchOption = (optionName,optionAge,optionBio,optionBackground) => {
    let bio = document.querySelector('.bio')
    let nameAgeWrapper = document.querySelector('.name-age-wrapper')
    nameAgeWrapper.innerHTML = `<div class="name">${optionName}</div>
                                <div class="age">${optionAge}</div>    
    `
    bio.innerHTML = `<div class="bio">${optionBio}</div>`
    document.querySelector('.match-option').style = `background-image: url(${optionBackground})`
    
}
