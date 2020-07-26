const view = {}

view.state = '' //chat, swipe, matches

view.setActiveScreen = (screenName) => {
    document.getElementById('app').innerHTML = components.welcomeScreen
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
            })
            const registerSpan = document.getElementById('redirect-to-register')
            registerSpan.addEventListener('click', (e) => {
                view.setActiveScreen('registerScreen')
            })
            break
        case 'chatScreen':
            view.state = 'chat'
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
                    if (view.state === 'chat') {
                        model.addMessage(message)
                    }

                } else {
                    // alert('blank message?')
                }
            })

            document.getElementById('my-profile')
                .addEventListener('click', () => {
                    view.setActiveScreen('changeProfileSettingScreen')
                })

            model.loadConversations()
            view.showCurrentConversation()
            model.listenConversationChange()
            model.listenUserChange()
            model.loadMatches()
            document.querySelector('#sendMessageForm input').addEventListener('click', () => {
                view.hideNotify(model.currentConversation.id)
            })
            document.getElementById('back-to-swipe').addEventListener('click', () => {
                view.backToSwipeScreen()
            })

            break
        case 'changeProfileSettingScreen':
            view.state = 'profile'
            document.getElementById('app').innerHTML = components.changeProfileSettingScreen
            document.querySelector('.profile-container .right').innerHTML = components.carousel
            document.getElementById('back-to-chat').addEventListener('click', () => {
                view.backToChatScreen()
            })

            const changeProfileSettingForm = document.getElementById('change-profile-setting-form')

            view.showCurrentUserProfile()

            changeProfileSettingForm.addEventListener('submit', (e) => {
                e.preventDefault()

                const data = {
                    displayName: changeProfileSettingForm.displayName.value,
                    bio: changeProfileSettingForm.bio.value,
                    birthYear: changeProfileSettingForm.birthYear.value,
                    picture1: changeProfileSettingForm.picture1.files[0], // nếu lưu thì sẽ đè lên ảnh cũ. chưa xóa ảnh cũ TODO!!
                    picture2: changeProfileSettingForm.picture2.files[0],
                    picture3: changeProfileSettingForm.picture3.files[0],
                }
                controller.changeProfileSetting(data)
            })
            break
        case 'swipeScreen':
            view.state = 'swipe'
            document.getElementById('app').innerHTML = components.chatScreen
            document.querySelector('.chat-container .main').innerHTML = components.swipe
            document.querySelector('.chat-container .main .conversation-detail').innerHTML = components.carousel

            document.getElementById('my-profile')
                .addEventListener('click', () => {
                    view.setActiveScreen('changeProfileSettingScreen')
                })
            console.log(model.currentUser)
            model.loadConversations()
            // view.showConversation()
            model.loadMatches()
            // view.showMatches()
            model.listenConversationChange()
            model.listenUserChange()


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
        .innerHTML = model.currentChatFriend // hiện email bạn chat

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
    // if (conversation.id === model.currentConversation.id) {
    //     conversationWrapper.classList.add('current')
    // }



    conversationWrapper.innerHTML = `
        <div class ="conversation-title">${conversation.title}</div>
        <div class ="conversation-num-users">${conversation.users.length} users</div>
        <div class ="conversation-notify"></div>
        `
    conversationWrapper.addEventListener('click', () => {
        if (view.state === 'swipe') {
            view.backToChatScreen()
            // document.querySelector('.chat-container .main').innerHTML = components.chat

            document.getElementById("nav-matches-tab").classList.remove('active')
            document.getElementById("nav-chats-tab").classList.add('active')
            document.getElementById("nav-matches").classList.remove('active', 'show')
            document.getElementById("nav-chats").classList.add('active', 'show')

        }
        view.state = 'chat'


        if (document.querySelector('.conversation.current')) {
            document.querySelector('.conversation.current').classList.remove('current')
        }
        conversationWrapper.classList.add('current')
        console.log('test')
        console.log(conversation.id)
        model.changeCurrentConversation(conversation.id)

        view.hideNotify(conversation.id)
        // conversationWrapper.lastElementChild.style = 'display: none'
    })

    document.querySelector('.list-conversations').appendChild(conversationWrapper)
}

view.backToChatScreen = () => {

    if(view.state==='profile'){
        document.getElementById('app').innerHTML = components.chatScreen
        view.showConversation()
        view.showCurrentConversation()
        view.showMatches()
    } else {
        document.querySelector('.chat-container .main').innerHTML = components.chat
    }

    view.state = 'chat'


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
            if (view.state === 'chat') {
                model.addMessage(message)
            }
        } else {
            // alert('blank message?')
        }
    })

    document.getElementById('my-profile')
        .addEventListener('click', () => {
            view.setActiveScreen('changeProfileSettingScreen')
        })

    const addUserForm = document.getElementById('add-user-form')


    document.querySelector('#sendMessageForm input').addEventListener('click', () => {
        view.hideNotify(model.currentConversation.id)
    })
    document.getElementById('back-to-swipe').addEventListener('click', () => {
        view.backToSwipeScreen()
    })
    
    // model.loadConversations()
    // model.listenConversationChange()

}

view.showNotify = (conversationId) => {
    document.getElementById(conversationId).lastElementChild.style = 'display :block'
}

view.hideNotify = (conversationId) => {
    document.getElementById(conversationId).lastElementChild.style = 'display :none'
}



view.showCurrentUserProfile = () => {
    const changeProfileSettingForm = document.getElementById('change-profile-setting-form')
    console.log("dddd");
    console.log(model.currentUser)
    changeProfileSettingForm.displayName.value = model.currentUser.displayName
    changeProfileSettingForm.bio.value = model.currentUser.bio
    changeProfileSettingForm.birthYear.value = model.currentUser.birthYear
    changeProfileSettingForm.picture1preview.src = model.currentUser.images[0]
    changeProfileSettingForm.picture2preview.src = model.currentUser.images[1]
    changeProfileSettingForm.picture3preview.src = model.currentUser.images[2]

    document.querySelector(".main .display-name").innerHTML = model.currentUser.displayName
    document.querySelector(".right .display-name").innerHTML = model.currentUser.displayName + ' ' + (new Date().getUTCFullYear() - model.currentUser.birthYear)
    document.querySelector(".right .bio").innerHTML = model.currentUser.bio
    document.querySelector("#picture1slide").src = model.currentUser.images[0]
    document.querySelector("#picture2slide").src = model.currentUser.images[1]
    document.querySelector("#picture3slide").src = model.currentUser.images[2]

    const inputHandler = (e) => {
        document.querySelector(".right .display-name").innerHTML = changeProfileSettingForm.displayName.value + ' ' + (new Date().getUTCFullYear() - changeProfileSettingForm.birthYear.value)
        document.querySelector(".right .bio").innerHTML = changeProfileSettingForm.bio.value
        document.querySelector("#picture1slide").src = changeProfileSettingForm.picture1preview.src
        document.querySelector("#picture2slide").src = changeProfileSettingForm.picture2preview.src
        document.querySelector("#picture3slide").src = changeProfileSettingForm.picture3preview.src


    }
    changeProfileSettingForm.addEventListener('input', inputHandler);
    changeProfileSettingForm.addEventListener('propertychange', inputHandler);
    changeProfileSettingForm.addEventListener('change', inputHandler);

}

// ======================================================
view.showCurrentMatch = () => {
    // đổi về màn chat screen hay không?

    document.querySelector('.chat-container .main .conversation-detail .list-message').innerHTML = components.carousel
    // console.log(model.currentMatch)
    document.querySelector(".main .conversation-title").innerHTML = model.currentMatch.displayName
    document.querySelector(".display-name").innerHTML = model.currentMatch.displayName + ' ' + (new Date().getUTCFullYear() - model.currentMatch.birthYear)
    document.querySelector(".bio").innerHTML = model.currentMatch.bio
    document.querySelector("#picture1slide").src = model.currentMatch.images[0]
    document.querySelector("#picture2slide").src = model.currentMatch.images[1]
    document.querySelector("#picture3slide").src = model.currentMatch.images[2]

}


view.showMatches = () => {
    document.querySelector('.list-matches').innerHTML = '' // refresh list after sign out and sign back in
    for (oneMatch of model.matches) {
        view.addMatch(oneMatch)
    }
}

// }
view.addMatch = (match) => {

    const matchWrapper = document.createElement('div')
    matchWrapper.classList.add('match')
    matchWrapper.classList.add('p-2')
    matchWrapper.id = match.uid

    // if ((model.currentMatch) && (match.uid === model.currentMatch.uid)) {
    //     matchWrapper.classList.add('current')
    // }
    matchWrapper.innerHTML = `
        <div class="card bg-dark text-white ">
            <img src="${match.images[0]}" class="card-img" alt="..." />
            <div class="card-img-overlay">
                <div class="card-title position-absolute bottom-0">${match.displayName}</div>
            </div>
        </div>
        `
    matchWrapper.addEventListener('click', () => {
        if (view.state === 'swipe') {
            view.backToChatScreen()

            // document.querySelector('.chat-container .main').innerHTML = components.chat
            // document.getElementById("nav-chats-tab").classList.remove('active')
            // document.getElementById("nav-matches-tab").classList.add('active')
        }
        view.state = 'match'
        if (document.querySelector('.match.current')) {
            document.querySelector('.match.current').classList.remove('current')
        }
        model.changeCurrentMatch(match)

        matchWrapper.classList.add('current')

    })

    document.querySelector('.list-matches').appendChild(matchWrapper)
}


view.backToSwipeScreen = () => {
    view.state = 'swipe'
    // document.getElementById('app').innerHTML = components.chatScreen
    document.querySelector('.chat-container .main').innerHTML = components.swipe
    document.querySelector('.chat-container .main .conversation-detail').innerHTML = components.carousel

    // document.getElementById('my-profile')
    //     .addEventListener('click', () => {
    //         view.setActiveScreen('changeProfileSettingScreen')
    //     })
    // console.log(model.currentUser)
    // view.showMatches()
    // view.showConversation()
}

