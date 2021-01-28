const Query = {
    oneUser(_, {id}, {prisma}){
        return prisma.user.findUnique({
            where: {
                id
            }
        })
    },
    users(_, {filter}, {prisma}){
        if(filter){
            return prisma.user.findMany({
                take: filter.take || 10,
                skip: filter.skip,
                where: {
                    OR: [{
                            username: { 
                                contains: filter.text || '',
                                mode: "insensitive"
                            }
                        },{
                            email: {
                                contains: filter.text || '',
                                mode: "insensitive"
                            }
                        },{
                            realname: {
                                contains: filter.text || '',
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
    content(_, {filter}, {prisma}){
        if(filter){
            return prisma.content.findMany({
                take: filter.take || 10,
                skip: filter.skip,
                where: {
                    OR: [{
                        title: {
                            contains: filter.text || '',
                            mode: "insensitive"
                        }
                    },{
                        description: {
                            contains: filter.text || '',
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
    events(_, {filter}, {prisma}){
        if(filter){
            return prisma.event.findMany({
                take: filter.take || 10,
                skip: filter.skip,
                where: {
                    OR: [{
                            title: {
                                contains: filter.text,
                                mode: "insensitive"
                            }
                        },{
                            description: {
                                contains: filter.text,
                                mode: "insensitive"
                            }
                        },{
                            landmark: {
                                contains: filter.text,
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