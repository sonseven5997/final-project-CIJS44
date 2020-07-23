const view = {}

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
            changeProfileSettingForm.addEventListener('submit', (e) => {
                e.preventDefault()

                const data = {
                    displayName: changeProfileSettingForm.displayName.value,
                    bio: changeProfileSettingForm.bio.value,
                    birthYear: changeProfileSettingForm.birthYear.value,
                    picture1: changeProfileSettingForm.picture1.files,
                    picture2: changeProfileSettingForm.picture2.files,
                    picture3: changeProfileSettingForm.picture3.files,
                }
                controller.changeProfileSetting(data)
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
        .innerHTML = model.currentFriend // hiện email bạn chat

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
    

    document.querySelector('#sendMessageForm input').addEventListener('click', () => {
        view.hideNotify(model.currentConversation.id)
    })
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