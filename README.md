# Battlesnake TypeScript Starter Project Devcontainer

**_A devcontainer template adaptated from the [official Battlesnake starter template](https://github.com/BattlesnakeOfficial/starter-snake-typescript) written in Typescript, including the installation of the Battlesnake CLI and setup to test performance locally._**

## Technologies Used

This project uses [TypeScript](https://www.typescriptlang.org/), [Node.js](https://nodejs.org/en/), and [Express](https://expressjs.com/). It also comes with an optional [Dockerfile](https://docs.docker.com/engine/reference/builder/) to help with deployment.

## Run Your Battlesnake

Start your Battlesnake

```sh
npm run start
```

You should see the following output once it is running

```sh
Running Battlesnake at http://0.0.0.0:8000
```

Open [localhost:8000](http://localhost:8000) in your browser and you should see

```json
{"apiversion":"1","author":"","color":"#888888","head":"default","tail":"default"}
```

## Play a Game Locally

Install the [Battlesnake CLI](https://github.com/BattlesnakeOfficial/rules/tree/main/cli)
* You can [download compiled binaries here](https://github.com/BattlesnakeOfficial/rules/releases)
* or [install as a go package](https://github.com/BattlesnakeOfficial/rules/tree/main/cli#installation) (requires Go 1.18 or higher)

Command to run a local game

```sh
battlesnake play -W 11 -H 11 --name 'TypeScript Starter Project' --url http://localhost:8000 -g solo --browser
```

## Test your Battlesnake Performance

Command to execute the performance test locally:
```sh
npm run battlesnake
```

## Next Steps

Continue with the [Battlesnake Quickstart Guide](https://docs.battlesnake.com/quickstart) to customize and improve your Battlesnake's behavior.

**Note:** To play games on [play.battlesnake.com](https://play.battlesnake.com) you'll need to deploy your Battlesnake to a live web server OR use a port forwarding tool like [ngrok](https://ngrok.com/) to access your server locally.
