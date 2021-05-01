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


const getCloses = (apiResponse, n) => {
  // apiResponse: The data obtained from the AlphaVantage API. Header should be removed in advance
  // n: The first n closes(ie the latest n time periods) will be returned
  const dates = Object.keys(apiResponse).slice(0, n).reverse()
  const prices = Object.values(apiResponse).slice(0, n).reverse()
  let closes = []

  for (const day in prices) {
    console.log(prices[day]['5. adjusted close'])
    closes.push(prices[day]['5. adjusted close'])
  }
  return {
    dates: dates,
    closes: closes
  }
}

const plot = async (canvas, ticker, dates, prices) => {
  // canvas: The canvas on which the graph will be plotted
  // ticker: The ticker of the security. Will be added to the label of the graph
  // dates: The dates/times of corresponding to the prices. Plotted on the x-asis
  // prices: The prices which will be plotted on the y-axis
  const chartConfig = {
    type: 'line',
    
    data: {
      labels: dates,
      datasets: [
        {
          label: `Stock Price History for ${ticker}`,
          data: prices,
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
            aliases: ['c', 'plot', 'graph'],
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
      if (d === 'month') {
        axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker}&apikey=${params.access_key}`)
                .then(async response => {
                const apiResponse = response.data['Time Series (Daily)'];
                const {dates, closes} = getCloses(apiResponse, 22)

                const attachment = await plot(canvas, ticker, dates, closes)

                message.channel.send(attachment)
        
              }).catch(error => {
                  return (error);
              });

      } else if (d === 'quarter') {
        axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker}&apikey=${params.access_key}`)
                .then(async response => {                
                const apiResponse = response.data['Time Series (Daily)'];
                const {dates, closes} = getCloses(apiResponse, 67)

                const attachment = await plot(canvas, ticker, dates, closes)

                message.channel.send(attachment)
          
              }).catch(error => {
                  return (error);
              })  

      } else if (d === 'year') {
        axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=${ticker}&outputsize=compact&&apikey=${params.access_key}`)
                .then(async response => {
                const apiResponse = response.data['Weekly Adjusted Time Series'];
                const {dates, closes} = getCloses(apiResponse, 53)

                const attachment = await plot(canvas, ticker, dates, closes)

                message.channel.send(attachment)
          
              }).catch(error => {
                  return (error);
              })  
      }
  }
}