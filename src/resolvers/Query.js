const Query = {
    oneUser(_, {id}, {prisma}){
        return prisma.user.findUnique({
            where: {
                id
            }
        })
    },
    users(_, {text}, {prisma}){
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
    oneContent(_, {id}, {prisma}){
        return prisma.content.findUnique({
            where: {
                id
            }
        })
    },
    content(_, {text}, {prisma}){
        if(text){
            return prisma.content.findMany({
                where: {
                    OR: [{
                        title: {
                            contains: text,
                            mode: "insensitive"
                        }
                    },{
                        description: {
                            contains: text,
                            mode: "insensitive"
                        }
                    }]
                }
            })
        }
        return prisma.content.findMany()
    },
    oneEvent(_, {id}, {prisma}){
        return prisma.event.findUnique({
            where: {
                id
            }
        })
    },
    events(_, {text}, {prisma}){
        if(text){
            return prisma.event.findMany({
                where: {
                    OR: [{
                            title: {
                                contains: text,
                                mode: "insensitive"
                            }
                        },{
                            description: {
                                contains: text,
                                mode: "insensitive"
                            }
                        },{
                            landmark: {
                                contains: text,
                                mode: "insensitive"
                            }
                        }]
                }
            })
        }
        return prisma.event.findMany()
    }
}

export default Query