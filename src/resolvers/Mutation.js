import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const Mutation = {
    login: async (_, {email, password}, {prisma}) => {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if(!user || !(await bcrypt.compare(password, user.password))){
            throw new Error("Unable to log in.")
        }

        delete user.password
        
        return {
            token: jwt.sign({user}, 'JWT_SECRET_PLACEHOLDER')
        }
    },
    createUser: async (_, {data}, {prisma} ) => {
        const existingUsers = await prisma.user.count({
            where: {
                OR: [
                    { email: data.email },
                    { username: data.username }
                ]
            }
        })

        if(existingUsers > 0){
            throw new Error('That email or username is already in use.')
        }

        if(!data.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/)){
            throw new Error('Password must contain between 8 and 20 characters including\n'
                + ' at least one number, an upper case letter, and a lower case letter.'
            )
        }

        const user = await prisma.user.create({
            data: {
                ...data,
                password: await bcrypt.hash(data.password, 10)
            }
        })

        return {
            token: jwt.sign({user}, 'JWT_SECRET_PLACEHOLDER')
        }
    },
    createContent: async (_, {data, newEventData = {}}, {prisma} ) => {
        const {
            mediaType, mediaUrl,
            mediaPreviewUrl, title = '',
            description = '', postedFromEop = false,
            authorId, coordinates
        } = data
        let {eventId} = data

        // Check if authorId is valid
        const prismaAuthor = await prisma.user.findFirst({
            where: {id: authorId}
        })
        if(!prismaAuthor){
            throw new Error('Invalid user.')
        }
        
        // Check if eventId is valid, if is provided for connection.
        if(eventId){
            const prismaEvent = await prisma.event.findFirst({
                where: {id: eventId}
            })
            if(!prismaEvent){
                throw new Error('Invalid event.')
            }
        } else {
            eventId = ''
        }

        // Check coordinates
        if(!coordinates){
            throw new Error('Location has not been provided.')
        }

        // Create content and connects it to existing event or creates new one.
        // If new event is created, connects event to organizer(User)
        return await prisma.content.create({
            data: {
                mediaType,
                mediaUrl,
                mediaPreviewUrl,
                title,
                postedFromEop,
                author: {
                    connect: {
                        id: authorId
                    }
                },
                description: description,
                event: {
                    connectOrCreate: {
                        where: { id: eventId },
                        create: {
                            title: newEventData.title ? newEventData.title : 'Unnamed Event',
                            coordinates,
                            description: newEventData.description ? newEventData.description : '',
                            country: newEventData.country ? newEventData.country : '',
                            city: newEventData.city ? newEventData.city : '',
                            state: newEventData.state ? newEventData.state : '',
                            landmark: newEventData.landmark ? newEventData.landmark : '',
                            organizer: {
                                connect: {
                                    id: authorId
                                }
                            }
                        }
                    }
                }
            },
            include: {
                event: true
            }
        })
    },
    createEvent: async (_, {data}, context, info) => {
        const {
            organizerId, coordinates, title,
            description = '', country = '',
            state = '', landmark = ''
        } = data
        const prismaOrganizer = await prisma.user.findFirst({
            where: {id: organizerId}
        })
        if(!prismaOrganizer){
            throw new Error('Invalid user.')
        }

        return await prisma.event.create({
            data: {
                organizer: {
                    connect: {
                        id: organizerId
                    }
                },
                coordinates,
                title,
                description,
                country,
                state,
                landmark
            }
        })
    }
}

export default Mutation