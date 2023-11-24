const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const newspapers = [
    {
        name: 'completesport',
        address: 'https://www.completesports.com/category/world-football/',
        base: ''
    },
    {
        name: 'skysport',
        address: 'https://www.skysports.com/football',
        base: ''
    },
    {
        name: 'bbc',
        address: 'https://www.bbc.com/sport/football',
        base: '',
    },
    {
        name: 'routers',
        address: 'https://www.reuters.com/sports/soccer/',
        base: 'https://www.reuters.com/',
    },
    {
        name: 'euronews',
        address: 'https://www.euronews.com/programs/football-now',
        base: '',
    },
    {
        name: 'eurosport',
        address: 'https://www.eurosport.com/football/',
        base: '',
    },
    {
        name: 'espn',
        address: 'https://africa.espn.com/soccer/transfers-news-and-features/',
        base: 'https://africa.espn.com/soccer',
    },
    {
        name: 'yahoosport',
        address: 'https://sports.yahoo.com/soccer/',
        base: 'https://sports.yahoo.com',
    },
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("transfer")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })

        })
})

app.get('/', (req, res) => {
    res.json('Welcome to my Football Transfer News API')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base


    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))