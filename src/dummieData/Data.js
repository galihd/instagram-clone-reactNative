export const users = [
    {
        username : "therandomee",
        image : "https://source.unsplash.com/random/800x800/?img=1"
    },
    {
        username : "suicidal_coderz",
        image : "https://source.unsplash.com/random/800x800/?img=2"
    },
    {
        username : "impawsibble",
        image : "https://source.unsplash.com/random/800x800/?img=123"
    },
    {
        username : "dreamerz69",
        image : "https://source.unsplash.com/random/800x800/?img=21"
    },
    {
        username : "thepayback_journey",
        image : "https://source.unsplash.com/random/800x800/?img=33"
    },
    {
        username : "OneSh0tz",
        image : "https://source.unsplash.com/random/800x800/?img=66"
    },
    {
        username : "oneOpportunity",
        image : "https://source.unsplash.com/random/800x800/?img=80"
    },
    {
        username : "Momma spaghetti",
        image : "https://source.unsplash.com/random/800x800/?img=69"
    },
]

export const Posts = [
    {
        image : `https://source.unsplash.com/random/800x800/?img=${Math.floor(Math.random() * 200)}`,
        user : users[Math.floor(Math.random() * users.length)],
        caption : "this is the caption that you would read!",
        likes : 5021,
        comments : [
            {
                user : users[Math.floor(Math.random() * users.length)],
                comment : "commented!"
            },
            {
                user : users[Math.floor(Math.random() * users.length)],
                comment : "commente adfasdfasdf asdfsadfsadasdfasdfsafsadfs!"
            },
            {
                user : users[Math.floor(Math.random() * users.length)],
                comment : "i just commented a comment!"
            }
        ]
    },
    {
        image : `https://source.unsplash.com/random/800x800/?img=${Math.floor(Math.random() * 200)}`,
        user : users[Math.floor(Math.random() * users.length)],
        caption : "this is the caption that you would read!",
        likes : 645,
        comments : [
            {
                user : users[Math.floor(Math.random() * users.length)],
                comment : "commented!"
            }
        ]
    },
    {
        image : `https://source.unsplash.com/random/800x800/?img=${Math.floor(Math.random() * 200)}`,
        user : users[Math.floor(Math.random() * users.length)],
        caption : "this is the caption that you would read!",
        likes : 64548,
        comments : [
        ]
    }
]