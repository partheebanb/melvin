const Commando = require('discord.js-commando')
const axios = require('axios')

const params = {
    access_key: process.env.ALPHAVANTAGE_KEY
}

const getReply = (apiResponse, arg1) => {
    switch(arg1) {
        case 'last':
            return('The last price was: ' + apiResponse["Global Quote"]["05. price"])
        case 'high':
            return("Today's high was: " + apiResponse["Global Quote"]["03. high"])
        case 'low':
            return("Today's low was: " + apiResponse["Global Quote"]["04. low"])
        case 'open':
            return("Today's open was: " + apiResponse["Global Quote"]["02. open"])
        default:
            return("Unknown argument. Please try again with either 'last', 'high', 'low', or 'open'")
      } 
}


module.exports = class Today extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'today',
            group: 'today',
            memberName: 'today',
            description: "Get's today's trading data",
            argsType: 'multiple'

        })
    }

    run = async (message, args) => {
        console.log(args[0])

        const command = args[0]
        const ticker = args[1]

        axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${params.access_key}`)
            .then(response => {
            console.log('gotta tha response')
            const apiResponse = response.data;
            const  reply = getReply(apiResponse, command)
            message.channel.send(`Fetching info for: ${ticker}` )
            message.channel.send(reply)

            }).catch(error => {
                console.log(error)
                message.channel.send("Couldn't find the stock");
            });
    }
}