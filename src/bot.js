require('dotenv').config()

const Commando = require('discord.js-commando')
const path = require('path')
const axios = require('axios');

const PREFIX = "/"
const params = {
  access_key: process.env.ALPHAVANTAGE_KEY
}

const client = new Commando.CommandoClient({
    owner: process.env.MY_ID,
    commandPrefix: PREFIX
})


client.on('ready', async () => {
    console.log('Client ready')

    client.registry
        .registerGroups([
            ['data', "Gets trading data for a single security"],
            ['chart', "Plots charts for one or more securities"]
        ])
        .registerDefaults()
        .registerCommandsIn(path.join(__dirname, 'commands'))

})

client.login(process.env.DISCORDJS_BOT_TOKEN)
