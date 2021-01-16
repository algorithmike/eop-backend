const Event = {
    author({author}, __, {db}){
        return db.userData.find(user => user.id === author)
    },
    event({event}, __, {db}){
        return db.eventData.find(e => e.id === event)
    }
}

export default Event