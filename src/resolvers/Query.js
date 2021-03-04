import getLocFromCoords from '../utils/locationDetails'

//TODO: Delete these lines
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

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
    content: async (_, {filter, location, epochTime, mediaType}) => {
        let content = (location && (location.length > 0)) ?
            await prisma.content.findMany({
                where: {
                    event: {
                        AND: [
                            {country: location.country},
                            {state: location.state},
                            {city: location.city}
                        ]
                    }
                }
            }) :
            await prisma.content.findMany()
        
        if(filter && (filter.length > 0)){
            content = content.filter(item => {
                return(
                    item.title?.includes(filter.text) ||
                    item.description?.includes(filter.text)
                )
                
            })
        }

        if(epochTime && (epochTime.length > 0)){
            const beginning = parseInt(epochTime.beginning)
            const end = parseInt(epochTime.end)

            content = content.filter(item => {
                const time = item.createdAt.getTime()
                return(
                    ((beginning) ? (time >= beginning) : true) &&
                    ((end) ? (time <= end) : true)
                )
            })
        }

        if(mediaType && (mediaType.length > 0)){
            content = content.filter(item => {
                return(
                    item.mediaType === mediaType
                )
            })
        }

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