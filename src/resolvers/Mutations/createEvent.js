createEvent = async (_, {data}, {prisma, tokenData}) => {
    if(!tokenData){
        throw new Error('Unauthorized action!')
    }

    const {
        coordinates, title,
        description = '', country = '',
        state = '', landmark = ''
    } = data
    const organizerId = tokenData.user.id
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

export default createEvent