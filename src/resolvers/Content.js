const Event = {
    postedBy({postedBy}, __, {db}){
        return db.userData.find(user => user.id === postedBy)
    },
    event({event}, __, {db}){
        return db.eventData.find(e => e.id === event)
    }
}

export default Event