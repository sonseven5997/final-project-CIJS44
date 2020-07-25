utils = {}

utils.getDataFromDoc = (doc) => {
    const data = doc.data()
    data.id = doc.id
    return data
}

utils.getDataFromDocs = (docs) => {
    return docs.map(utils.getDataFromDoc)
}

utils.uploadPic = (file) => {
    if (!file) return '';
    const fileName = file.name
    const filePath = `${model.currentUser.uid}/${fileName}`
    const fileRef = firebase.storage().ref().child(filePath)
    fileRef.put(file).then(res => {
        
    })
    return utils.getFileUrl(fileRef)
}

utils.getFileUrl = (fileRef) => {
    return `https://firebasestorage.googleapis.com/v0/b/${fileRef.bucket}/o/${encodeURIComponent(fileRef.fullPath)}?alt=media`
}

