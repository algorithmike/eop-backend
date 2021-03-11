import { PrismaClient } from '@prisma/client'
import hashPassword from './hashPassword'

const prisma = new PrismaClient();

const seed = async () => {
    // Clear all records.
    await prisma.content.deleteMany()
    await prisma.event.deleteMany()
    await prisma.user.deleteMany()

    // Seed users.
    const {id: user1_id} = await prisma.user.create({
        data: {
            email: 'user.test.one1@email.com',
            username: 'usertest_username1',
            password: await hashPassword('testPassword123'),
            realname: 'User Test 1',
            description: 'This is the first user tester.',
            profilePicUrl: 'https://i.pinimg.com/564x/4d/f1/93/4df193b6dc700bd806fc0273506f8587.jpg'
        }
    })

    const {id: user2_id} = await prisma.user.create({
        data: {
            email: 'user.test.two2@email.com',
            username: 'usertest_username2',
            password: await hashPassword('testPassword123'),
            realname: 'User Test 2',
            description: 'This is the second user tester.',
            profilePicUrl: 'https://i.pinimg.com/564x/4d/f1/93/4df193b6dc700bd806fc0273506f8587.jpg'
        }
    })

    // Seed events.
    // coordinates = 'Latitude: 37.42342342342342, Longitude: -122.08395287867832'
    const {id: event1_id} = await prisma.event.create({
        data: {
            organizer: {
                connect: {
                    id: user1_id
                }
            },
            coordinates: 'Latitude: 37.42342342342342, Longitude: -122.08395287867832',
            title: 'Event One Title',
            description: 'This is a description for the first event.',
            country: 'United States',
            state: 'California 94043',
            city: 'Mountain View',
            landmark: 'Ampitheater Parkway'
        }
    })

    const {id: event2_id} = await prisma.event.create({
        data: {
            organizer: {
                connect: {
                    id: user2_id
                }
            },
            coordinates: 'Latitude: 36.6002, Longitude: -121.8947',
            title: 'Event Two Title',
            description: 'This is a description for the second event.',
            country: 'United States',
            state: 'California 93940',
            city: 'Monterey',
            landmark: 'West Franklin Street'
        }
    })

    await prisma.event.create({
        data: {
            organizer: {
                connect: {
                    id: user2_id
                }
            },
            coordinates: 'Latitude: 33.8704, Longitude: -117.9242',
            title: 'Event Three Title',
            description: 'This is a description for the third event.',
            country: 'United States',
            state: 'California 92832',
            city: 'Fullerton',
            landmark: 'East Commonwealth Avenue'
        }
    })

    // Seed content.
    for(let x = 0; x < 12; x++){
        await prisma.content.create({
            data: {
                mediaType: 'image',
                mediaUrl: 'https://avatarfiles.alphacoders.com/124/thumb-1920-124420.jpg',
                mediaPreviewUrl: 'https://avatarfiles.alphacoders.com/124/thumb-1920-124420.jpg',
                title: `Test Content #${x + 1}`,
                description: `This is a description about content #${x + 1}! Lorem ipsum, etc.`,
                author: {
                    connect: {
                        id: user2_id
                    }
                },
                event: {
                    connect: {
                        id: event2_id
                    }
                },
            }
        })
    }

    await prisma.content.create({
        data: {
            mediaType: 'video',
            mediaUrl: 'https://eop-video-bucket.sfo3.digitaloceanspaces.com/DummyVideo.mp4',
            mediaPreviewUrl: 'https://eop-video-bucket.sfo3.digitaloceanspaces.com/DummyVideo.mp4',
            title: 'Test Content Two',
            description: ' This is demo video content!',
            author: {
                connect: {
                    id: user1_id
                }
            },
            event: {
                connect: {
                    id: event2_id
                }
            },
        }
    })

    await prisma.content.create({
        data: {
            mediaType: 'video',
            mediaUrl: 'https://eop-video-bucket.sfo3.digitaloceanspaces.com/DummyVideo.mp4',
            mediaPreviewUrl: 'https://eop-video-bucket.sfo3.digitaloceanspaces.com/DummyVideo.mp4',
            title: 'Test Content Three',
            description: ' This is another demo video!',
            author: {
                connect: {
                    id: user1_id
                }
            },
            event: {
                connect: {
                    id: event1_id
                }
            },
        }
    })

    await prisma.$disconnect()
}

export default seed;