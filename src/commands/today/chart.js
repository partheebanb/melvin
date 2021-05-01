const Commando = require('discord.js-commando')
const { CanvasRenderService, ChartJSNodeCanvas } = require('chartjs-node-canvas')
const { MessageAttachment } = require('discord.js')
const ChartJS = require('chart.js')
const  {LineController, Chart} = require('chart.js')
const axios = require('axios')

const params = {
  access_key: process.env.ALPHAVANTAGE_KEY
}

const width = 800
const height = 600


const plugin = {
  id: 'custom_canvas_background_color',
  beforeDraw: (chart) => {
    const ctx = chart.canvas.getContext('2d');
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  }
};


const plot = async (canvas, ticker, labels, data) => {
  const chartConfig = {
    type: 'line',
    
    data: {
      labels: labels,
      datasets: [
        {
          label: `Stock Price History for ${ticker}`,
          data: data,
          backgroundColor: '#7280d9'
        }
      ]
    },

    plugins: [plugin]
  }

  const image = await canvas.renderToBuffer(chartConfig)
  return new MessageAttachment(image)

}




module.exports = class ChartCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'chart', 
            aliases: ['c', 'plot'],
            group: 'chart',
            memberName: 'chart',
            description: "Display chart for today's trading data",
            argsType: 'multiple'
        })   
    }

    run = async (message, args) => {

      const d = args[0]
      const tickers = args.slice(1)
      const ticker = tickers[0] // just for now

      const canvas = new ChartJSNodeCanvas(
        {
          width,
          height
        }
      )
      console.log(args[0])
      if (d === 'month') {
        axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker}&apikey=${params.access_key}`)
                .then(async response => {
                console.log('gotta tha response')
                const apiResponse = response.data['Time Series (Daily)'];
                const dates = Object.keys(apiResponse).slice(0, 22).reverse()
                const prices = Object.values(apiResponse).slice(0, 22).reverse()
                let close = []

                for (const day in prices) {
                  console.log(prices[day]['5. adjusted close'])
                  close.push(prices[day]['5. adjusted close'])

                }

                const attachment = await plot(canvas, ticker, dates, close)

                message.channel.send(attachment)
          
              }).catch(error => {
                  return (error);
              });
      } else if (d === 'quarter') {
        axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker}&apikey=${params.access_key}`)
                .then(async response => {
                console.log('gotta tha response')
                const apiResponse = response.data['Time Series (Daily)'];
                const dates = Object.keys(apiResponse).slice(0, 67).reverse()
                const prices = Object.values(apiResponse).slice(0, 67).reverse()
                let close = []

                for (const day in prices) {
                  console.log(prices[day]['5. adjusted close'])
                  close.push(prices[day]['5. adjusted close'])

                }

                const attachment = await plot(canvas, ticker, dates, close)

                message.channel.send(attachment)
          
              }).catch(error => {
                  return (error);
              })  
      } else if (d === 'year') {
        axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=${ticker}&outputsize=compact&&apikey=${params.access_key}`)
                .then(async response => {
                // console.log('gotta tha response', response)
                const apiResponse = response.data['Weekly Adjusted Time Series'];
                const dates = Object.keys(apiResponse).slice(0, 53).reverse()
                const prices = Object.values(apiResponse).slice(0, 53).reverse()
                let close = []
                // console.log(response.data)
                for (const day in prices) {
                  console.log(prices[day]['5. adjusted close'])
                  close.push(prices[day]['5. adjusted close'])

                }

                const attachment = await plot(canvas, ticker, dates, close)

                message.channel.send(attachment)
          
              }).catch(error => {
                  return (error);
              })  
      }
  }
}