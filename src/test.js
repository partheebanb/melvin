require('dotenv').config()

// const { Client } = require('discord.js')
// const client = new Client()
const PREFIX = "/"

const path = require('path')
const axios = require('axios');
const params = {
  access_key: process.env.ALPHAVANTAGE_KEY
}

ticker = 'tsla'

axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${params.access_key}`)
        .then(response => {
        const apiResponse = response.data;
        console.log(apiResponse)
        a = apiResponse["Global Quote"]["05. price"]
        console.log(a)
        console.log(JSON.parse(apiResponse)["Global Quote"]["05. price"])


        }).catch(error => {
            return (error);
    });
