const ALL_CONTENT = 'ALL_CONTENT'
const ALL_EVENTS = 'ALL_EVENTS'

const Subscription = {
    content: {
        subscribe(_, __, {pubsub}){
            return pubsub.asyncIterator(ALL_CONTENT)
        }
    },
    events: {
        subscribe(_, __, {pubsub}){
            return pubsub.asyncIterator(ALL_EVENTS)
        }
    }
}

export {
    Subscription as default,
    ALL_CONTENT,
    ALL_EVENTS
}