export const dummyUsers = [
    {
        id: 'abcd1234',
        username: 'algorithmike',
        email: 'mike@test.com',
        password: 'password',
        realname: 'Michael',
        description: 'Lorem ipsum...',
    },
    {
        id: 'efgh5678',
        username: 'justanothausa',
        email: 'testuser@test.com',
        password: 'passwordTest',
        realname: 'Test Name',
        description: 'This is a test user!'
    },
    {
        id: 'ijkl9101112',
        username: 'imarobot',
        email: 'robot@matrix.com',
        password: 'robotPassword',
        realname: 'Mr. Smith',
    }
];

export const dummyContent = [
    {
        id: 'contentID123',
        mediaType: 'IMAGE',
        title: 'The First Dummy Image',
        postedAt: '20201225',
        postedBy: 'abcd1234',
        postedFromEop: false,
        media: 'http://dummycontent1.png',
        mediaPreview: 'http://dummycontentpreview1.png',
        description: 'This is some dummy content. Gotta figure out where to store those images.'
    },
    {
        id: 'contentID456',
        mediaType: 'IMAGE',
        title: 'The Second Dummy Image',
        postedAt: '11112020',
        postedBy: 'efgh5678',
        postedFromEop: false,
        media: 'http://dummycontent2.png',
        mediaPreview: 'http://dummycontentpreview2.png',
        description: 'There\'s gotta be at least two dummy content.'
    },
    {
        id: 'contentID789',
        mediaType: 'IMAGE',
        title: 'The Third Dummy Image',
        postedAt: '20210108',
        postedBy: 'abcd1234',
        postedFromEop: false,
        media: 'http://dummycontent3.png',
        mediaPreview: 'http://dummycontentpreview3.png',
        description: 'Three is a good number.'
    }
];

export const dummyEvents = [
    {
        id: 'eventid123',
        title: 'Dummy Festival',
        startedAt: '20201111',
        coordinates: '1.0, 2.0',
        description: 'This is the best!',
        landmark: 'Bee Boo Building'
    },
    {
        id: 'eventid456',
        title: 'The Gathering of Dummy',
        startedAt: '20203214',
        coordinates: '3.0, 4.0',
        description: 'This is the second best!',
        landmark: 'La La Land'
    },
    {
        id: 'eventid123',
        title: 'Dummy in the Park',
        startedAt: '20204444',
        coordinates: '6.0, 7.0',
        description: 'This is the third best!',
        landmark: 'What Now Park'
    }
]