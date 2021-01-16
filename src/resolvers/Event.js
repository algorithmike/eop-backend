const Event = {
    content({id}, __, {db}){
        return db.contentData.filter(contentItem => contentItem.event === id)
    },
    attendees({id}, __, {db}){
        let contentFromThisEvent = db.contentData.filter(contentItem => {
        return id === contentItem.event
        })

        return db.userData.filter(user => {
        return contentFromThisEvent.some(content => content.author === user.id)
        })
        
    }
}

export default Event