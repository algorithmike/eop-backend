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
    eventsInProximity: async (_, {coordinates}) => {
        let [, latitude, , longitude] = coordinates.split(' ')
            .map(item => item.trim().replace(/,/g, ''))
        
        const location = await getLocFromCoords(latitude, longitude)

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