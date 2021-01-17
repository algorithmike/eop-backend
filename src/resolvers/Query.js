const Query = {
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