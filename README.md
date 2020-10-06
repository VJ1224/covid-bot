# COVID-19 India Discord Bot

A Discord bot that gives updates regarding the COVID-19 cases in India

## Usage

To add the bot to your server, [click here](https://discord.com/oauth2/authorize?client_id=723409740083757166&scope=bot&permissions=84032)

## Requirements

* Node.js: Install node

* Discord.js: npm install discord.js

* Axios: npm install axios

* Dotenv: npm install dotenv

## Files

* app.js: Stores the main bot logic to read messages and execute commands.

* commands: Folder that stores each command in a separate .js file. Each .js file exports the execute function as well as relevant information about the command.

* tools.js: Additional functions that are common for multiple commands.

## Run

Run the bot using Node.js

```node
node app.js
```

## Deployment

Deployed using Heroku

## Credits

* COVID19 India Data:

   [covid19india.org](https://api.covid19india.org)

* Medical Data:

   [Infermedica](https://developer.infermedica.com)

* Image Chart API:

   [QuickChart](https://quickchart.io)
