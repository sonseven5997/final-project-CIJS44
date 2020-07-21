const controller = {}

controller.register = (registerInfo) => {

    view.setErrorMessage('error-first-name', !registerInfo.firstName ? 'Please input first name' : '')
    view.setErrorMessage('error-last-name', !registerInfo.lastName ? 'Please input last name' : '')
    view.setErrorMessage('error-email', !registerInfo.email ? 'Please input email' : '')
    view.setErrorMessage('error-email', !controller.validateEmail(registerInfo.email) ? 'Wrong Email Format!' : '')
    view.setErrorMessage('error-password', !registerInfo.password ? 'Please input password' : '')
    view.setErrorMessage('error-confirm-password', !registerInfo.confirmPassword ? 'Please input confirm password' : registerInfo.confirmPassword !== registerInfo.password ? "Your password didn't match" : '')

    if (registerInfo.firstName && registerInfo.lastName && registerInfo.email && registerInfo.password) {
        model.register(registerInfo.firstName, registerInfo.lastName, registerInfo.email, registerInfo.password)
    }
}

controller.login = (loginInfo) => {

    view.setErrorMessage('error-email', !loginInfo.email ? 'Please input email' : '')
    view.setErrorMessage('error-email', !controller.validateEmail(loginInfo.email) ? 'Wrong Email Format!' : '')

    view.setErrorMessage('error-password', !loginInfo.password ? 'Please input password' : '')

    if (loginInfo.email && loginInfo.password) {
        model.login(loginInfo.email, loginInfo.password)
    }
}


controller.changeProfileSetting = ({ displayName, bio, birthYear, picture1, picture2, picture3, }) => {
    view.setErrorMessage('display-name-error', !displayName ? 'Please input display name' : '')
    view.setErrorMessage('bio-error', !bio ? 'Please input bio' : '')
    view.setErrorMessage('birth-year-error', !birthYear ? 'Please input birth year' : '')

    
    if (picture1.length === 0) {
        view.setErrorMessage('picture1-error', 'Please input picture 1')
    } else {
        picture1 = utils.uploadPic(picture1[0])
        console.log(picture1)
    }

    if (picture2.length === 0) {
        view.setErrorMessage('picture2-error', 'Please input picture 2')
    } else {
        picture2 = utils.uploadPic(picture2[0])
    }

    if (picture3.length === 0) {
        view.setErrorMessage('picture3-error', 'Please input picture 3')
    } else {
        picture3 = utils.uploadPic(picture3[0])
    }

    images = [picture1, picture2, picture3]
    console.log(images)
    if (bio && displayName && birthYear && images.length===3) {
        model.changeProfileSetting({
            displayName,
            bio,
            birthYear,
            images
        })
    } else {
        console.log('bbbb')
    }
}

controller.validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

controller.addUser = (email) => {

    view.setErrorMessage('add-email-error', !email ? 'Please input user email' : '')
    view.setErrorMessage('add-email-error', !controller.validateEmail(email) ? 'Wrong Email Format!' : '')
    if (email && controller.validateEmail(email)) {
        model.addUser(email)
    }
}