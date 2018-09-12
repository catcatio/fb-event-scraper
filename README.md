# fb-event-scraper

Scrap information from facebook event

## features

- `puppeteer`, Headless Chrome Node API, to start Chrome Headless for loading facebook event page
- `osmosis` , Web scraper for NodeJS, to scrap data from html

## development

### prerequisites

create `.env` file

```env
PORT=3000
PM2_PORT=3001
```

To run locally

```bash
npm i
npm run dev
```

To run in docker container

```bash
npm run up
```

## usage

```bash
curl http://localhost:3000/scrap/?url=https://www.facebook.com/events/2185490331770352/
```

output
```JSON
{
    "title": "Chatbots & Blockchain",
    "coverImage": "https://scontent.fbkk8-1.fna.fbcdn.net/v/t1.0-0/q90/s526x296/40240054_241374303189894_2375067879046381568_n.jpg?_nc_cat=0&oh=b83fdf585d1bcbc41571ee2aa956c552&oe=5C25DFBD",
    "eventTime": "2018-09-01T23:00:00-07:00 to 2018-09-02T03:00:00-07:00",
    "venue": "Discovery HUBBA4th floor Siam Discovery, กรุงเทพมหานคร 10330",
    "venueLink": "https://l.facebook.com/l.php?u=http%3A%2F%2Fshare.here.com%2Fr%2Fmylocation%2Fe-eyJuYW1lIjoiRGlzY292ZXJ5IEhVQkJBIiwiYWRkcmVzcyI6IjR0aCBmbG9vciBTaWFtIERpc2NvdmVyeSwgXHUwZTAxXHUwZTIzXHUwZTM4XHUwZTA3XHUwZTQwXHUwZTE3XHUwZTFlXHUwZTIxXHUwZTJiXHUwZTMyXHUwZTE5XHUwZTA0XHUwZTIzIDEwMzMwIiwibGF0aXR1ZGUiOjEzLjc0Njc2NDA2MzA0OCwibG9uZ2l0dWRlIjoxMDAuNTMxNTMwOTE4MTIsInByb3ZpZGVyTmFtZSI6ImZhY2Vib29rIiwicHJvdmlkZXJJZCI6MTMyNDgwODgwNTEwOTI4fQ%3D%3D%3Flink%3Dunknown%26fb_locale%3Dth_TH%26ref%3Dfacebook&h=AT32xn7Uiwszmy3Kb3CKJmeryHPEqO_d2ak-nPTE9zSDbkfKL1S65L1UkilLRDovWd4TAcVNA7a1wg7FWICI6Bjn8xyv7lkfU6cM2Zl4w9s2MD8F42AN-rFx6dqM4B-aKibNV_NCYf9cL-Pvj3q_DBVDPgA",
    "description": "All about Tickets 🎫Chatbot 🤖via Dialogflow 💬 with Firebase 🔥on Stellar 🚀Blockchain ⛓development.Location : Discovery HUBBA at 5th Floor Siam Discovery (Near Virgin Active)PS : This will be the first event that use tickets on Stellar Blockchain via Chatbots :)Enjoy!"
}
```