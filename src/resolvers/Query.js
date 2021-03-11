import getLocFromCoords from '../utils/locationDetails'

//TODO: Delete these.
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

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
    content: async (_, {filter, location, epochTime, mediaType}, {}) => {
        //TODO: Do we actually need 'location' variable, when filter text is already doing the job?
        // Delete location variable or incorporate it.
        //TODO: Incorporate mediaType variable.

        let content = (epochTime.beginning && epochTime.end) ?
            await prisma.content.findMany(        {
                where: {
                    AND: [
                        {
                            createdAt: {
                                gte: new Date(parseInt(epochTime.beginning))
                            }
                        },{
                            createdAt: {
                                lte: new Date(parseInt(epochTime.end))
                            }
                        },
                        {
                            OR: [
                                {
                                    title: {
                                        contains: filter.text,
                                        mode: 'insensitive'
                                    }
                                },{
                                    description: {
                                        contains: filter.text,
                                        mode: 'insensitive'
                                    }
                                },{
                                    event: {
                                        city: {
                                            contains: filter.text,
                                            mode: 'insensitive'
                                        }
                                    }
                                },{
                                    event: {
                                        landmark: {
                                            contains: filter.text,
                                            mode: 'insensitive'
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            }) :
            await prisma.content.findMany()

        return content;
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
    },
    // To be used in Mobile for dropdown event selector in CreateContent screen.
    eventsInProximity: async (_, {coordinates}, {prisma}) => {
        let [, latitude, , longitude] = coordinates.split(' ')
            .map(item => item.trim().replace(/,/g, ''))
        
        const location = await getLocFromCoords(latitude, longitude)
        if(!location){return []}
        if(location.country !== 'United States'){
            console.log('Currently only works in the United States in English.')
            return[];
        }

        return prisma.event.findMany({
            where: {
                AND: [
                    {
                        city: location.city
                    },
                    {
                        OR: [
                            {landmark: location.landmark},
                            {state: location.state}
                        ]
                    }
                ]
            }
        })
    }
}

export default Query