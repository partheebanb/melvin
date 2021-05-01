const Commando = require('discord.js-commando')
const axios = require('axios')

const params = {
    access_key: process.env.ALPHAVANTAGE_KEY
}

const getReplyToday = (apiResponse, arg1) => {
    
    const last = 'The last price: ' + apiResponse["Global Quote"]["05. price"]
    const high = "Today's high: " + apiResponse["Global Quote"]["03. high"]
    const low = "Today's low: " + apiResponse["Global Quote"]["04. low"]
    const open = "Today's open: " + apiResponse["Global Quote"]["02. open"]
    const all = open + '\n' + high + '\n' + low + '\n' + last

    switch(arg1) {
        case 'last':
            return(last)
        case 'high':
            return(high)
        case 'low':
            return(low)
        case 'open':
            return(open)
        case 'all':
            return(all)
        default:
            return("Unknown argument. Please try again with either 'last', 'high', 'low', or 'open'")
      } 
}




module.exports = class Today extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'data',
            aliases: ['d'],
            group: 'data',
            memberName: 'data',
            description: "Gets trading data for a single security",
            argsType: 'multiple'

        })
    }

    run = async (message, args) => {

        const dates = args[0]
        const command = args[1]
        const ticker = args[2]


        if (dates === 'today') {
            axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${params.access_key}`)
                .then(response => {
                console.log('gotta tha response')
                const apiResponse = response.data;
                const reply = getReplyToday(apiResponse, command)
                message.channel.send(`Fetching info for: ${ticker}` )
                message.channel.send(reply)

                }).catch(error => {
                    console.log(error)
                    message.channel.send("Couldn't find the stock");
                });
        } 
    }
}