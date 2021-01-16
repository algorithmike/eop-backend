const Query = {
    users(_, {text}, {db, prisma}){
        // if(text){
        // return db.userData.filter(user => {
        //     return (
        //     user.username.toLocaleLowerCase().includes(text.toLocaleLowerCase()) ||
        //     user.email.toLocaleLowerCase().includes(text.toLocaleLowerCase()) ||
        //     user.realname.toLocaleLowerCase().includes(text.toLocaleLowerCase())
        //     )
        // })
        // }
        // return db.userData
        if(text){
            return prisma.user.findMany({
                where: {
                    OR: [{
                            username: { 
                                contains: text,
                                mode: "insensitive"
                            }
                        },{
                            email: {
                                contains: text,
                                mode: "insensitive"
                            }
                        },{
                            realname: {
                                contains: text,
                                mode: "insensitive"
                            }
                        }]
                }
            })
        }
        return prisma.user.findMany()
    },
    content(_, {text}, {db, prisma}){
        // if(text){
        // return db.contentData.filter(item => {
        //     return (
        //     item.title.toLocaleLowerCase().includes(text.toLocaleLowerCase()) ||
        //     item.description.toLocaleLowerCase().includes(text.toLocaleLowerCase())
        //     )
        // })
        // }
        // return db.contentData
    },
    events(_, {text}, {db}){
        if(text){
        return db.eventData.filter(event => {
            return (
            event.title.toLocaleLowerCase().includes(text.toLocaleLowerCase()) ||
            event.description.toLocaleLowerCase().includes(text.toLocaleLowerCase()) ||
            event.landmark.toLocaleLowerCase().includes(text.toLocaleLowerCase())
            )
        })
        }
        return db.eventData
    }
}

export default Query