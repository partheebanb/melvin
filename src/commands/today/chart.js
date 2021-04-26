const Commando = require('discord.js-commando')
const { CanvasRenderService, ChartJSNodeCanvas } = require('chartjs-node-canvas')
const { MessageAttachment } = require('discord.js')

const data = 
[
    {
      "members": 1946,
      "date": "10/1/2020"
    },
    {
      "members": 2011,
      "date": "10/2/2020"
    },
    {
      "members": 2072,
      "date": "10/3/2020"
    },
    {
      "members": 2119,
      "date": "10/4/2020"
    },
    {
      "members": 2172,
      "date": "10/5/2020"
    }
  ]

const members = []
const dates = []

for (const item of data) {
  members.push(item.members)
  dates.push(item.date)
}

const width = 800
const height = 600

const chartCallback = (ChartJS) => {
  ChartJS.plugins.register({
    beforeDraw: (chartInstance) => {
      const { chart } = chartInstance
      const { ctx } = chart
      ctx.fillstyle = 'white'
      ctx.fillRect(0, 0, chart.width, chart.height)
    }
  })
}

module.exports = class ChartCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'chart', 
            group: 'today',
            memberName: 'chart',
            description: "Display chart for today's trading data"
        })   
    }

    run = async (message) => {
      const canvas = new ChartJSNodeCanvas(
        {
          width,
          height,
          chartCallback: chartCallback
        }
      )
      
      const chartConfig = {
        type: 'line',
        data: {
          labels: dates,
          datasets: [
            {
              label: 'Discord Members',
              data: members,
              backgroundColor: '#7280d9'
            }
          ]
        }
      }

      const image = await canvas.renderToBuffer(chartConfig)

      const attachment = new MessageAttachment(image)

      message.channel.send(attachment)
    }
}