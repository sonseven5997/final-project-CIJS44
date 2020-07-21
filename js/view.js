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

            document.getElementById('new-conversation')
                .addEventListener('click', () => {
                    view.setActiveScreen('createConversationScreen')
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

            document.querySelector('#sendMessageForm input').addEventListener('click', () =>{
                view.hideNotify(model.currentConversation.id)
            })

            break
        case 'createConversationScreen':
            document.getElementById('app').innerHTML = components.createConversationScreen
            document.getElementById('back-to-chat').addEventListener('click', () => {
                view.backToChatScreen()
            })
            const createConversationForm = document.getElementById('create-conversation-form')
            createConversationForm.addEventListener('submit', (e) => {
                e.preventDefault()
                const data = {
                    title: createConversationForm.title.value,
                    friendEmail: createConversationForm.email.value
                }
                controller.createConversation(data)
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
    
    const mediaQuery = window.matchMedia('screen and (max-width: 768px')
    if (mediaQuery.matches) {
        conversationWrapper.firstElementChild
        .innerHTML = conversation.title.charAt(0)
        document.getElementById('new-conversation').innerText = '+'
    }

    mediaQuery.addListener((mediaMatch) => {
        if(mediaMatch.matches){
            conversationWrapper.firstElementChild
            .innerHTML = conversation.title.charAt(0)
            document.getElementById('new-conversation').innerText = '+'
        } else{
            conversationWrapper.firstElementChild.innerHTML = conversation.title
            document.getElementById('new-conversation').innerText = '+ New conversation'
        }
    })

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

    document.getElementById('new-conversation')
        .addEventListener('click', () => {
            view.setActiveScreen('createConversationScreen')
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

    document.querySelector('#sendMessageForm input').addEventListener('click', () =>{
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