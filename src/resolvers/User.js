const User = {
    content({id}, __, {db}){
        return db.contentData.filter(contentItem => contentItem.postedBy === id)
    },
    events({id}, __, {db}){
        let thisUserContent =
        db.contentData.filter(contentItem => contentItem.postedBy === id)

        return db.eventData.filter(event => {
        return thisUserContent.some(content => content.event === event.id)
        })
    }
}

export default User