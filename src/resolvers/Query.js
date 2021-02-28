import getLocFromCoords from '../utils/locationDetails'

const Query = {
    me(_, __, {prisma, tokenData}){
        return prisma.user.findUnique({
            where: {
                id: tokenData.id
            }
        })
    },
    oneUser(_, {id}, {prisma}){
        return prisma.user.findUnique({
            where: {
                id
            }
        })
    },
    users(_, {filter}, {prisma}){
        if(filter){
            const cursor = filter.cursor ? {id: filter.cursor} : undefined;
            const orderBy = (filter.orderBy) ? 
                {[filter.orderBy.key]: filter.orderBy.direction} :
                {username: 'asc'}

            return prisma.user.findMany({
                take: filter.take || 10,
                skip: filter.skip,
                cursor,
                orderBy,
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
            const cursor = filter.cursor ? {id: filter.cursor} : undefined;
            const orderBy = (filter.orderBy) ? 
                {[filter.orderBy.key]: filter.orderBy.direction} :
                {updatedAt: 'asc'}

            return prisma.content.findMany({
                take: filter.take || 10,
                skip: filter.skip,
                cursor,
                orderBy,
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
    async events(_, {filter}, {prisma}){
        //TODO: Set this up as input rather than hardcoded.
        const coordinates = 'Latitude: 37.42342342342342, Longitude: -122.08395287867832'
        let [, latitude, , longitude] = coordinates.split(' ')
            .map(item => item.trim().replace(/,/g, ''))
        
        const location = await getLocFromCoords(latitude, longitude)
        console.log('location: ', location)

        if(filter){
            const cursor = filter.cursor ? {id: filter.cursor} : undefined;
            const orderBy = (filter.orderBy) ? 
                {[filter.orderBy.key]: filter.orderBy.direction} :
                {updatedAt: 'asc'}

            return prisma.event.findMany({
                take: filter.take || 10,
                skip: filter.skip,
                cursor,
                orderBy,
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
                        },{
                            landmark: {
                                contains: filter.text || '',
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