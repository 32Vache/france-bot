//
// IMPORTANT NOTE
// THIS IS OUTDATED CODE. IT ONLY WORKS WITH DISCORDJS V11, WHICH WILL BE DEPRECATED ON OCTOBER 2020.
// THIS CODE IS NO LONGER BEING UPDATED. FOR THE ACTUAL UPDATED CODE, GO TO index.js 
//


const Discord = require("discord.js");
const express = require("express");
const ms = require("ms");
const ytdl = require("ytdl-core");
const fetch = require("node-fetch");
const Minesweeper = require("discord.js-minesweeper");
const queue = new Map();
require("events").EventEmitter.prototype._maxListeners = 100;
const client = new Discord.Client();
// Login
client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  var d = Date(Date.now());
  client.channels
    .get("637663684356997125")
    .send(
      "Bot successfully started ( " + Date.now() + ", " + d.toString() + " )"
    );
  client.user.setPresence({
    status: "online",
    game: {
      name: `Startup Complete`,
      type: "WATCHING"
    }
  });
  setInterval(async () => {
    const activities = [
      `/n spawn France`,
      `Vive la France !`,
      `${client.users.size} Members`,
      `France Epic!`,
      `Certified Frog`,
      `pepole eat baguette`
    ];
    const activity = activities[Math.floor(Math.random() * activities.length)];
    await client.user.setActivity(activity, { type: "WATCHING" });
  }, 120000);
});
// Error listener
// Websockets and network
client.on('shardError', error => {
   client.channels
    .get("637663684356997125")
    .send(
    ":x: A network error occured...\n```" + error + "```"
    );
});
// API
process.on('unhandledRejection', error => {
   client.channels
    .get("637663684356997125")
    .send(
    ":x: An API error occured...\n```" + error + "```"
    );
});
// /restart
client.on("message", message => {
  if (message.content === "/restart") {
    if (message.author.id !== "485165406881841152")
      return message.reply("Missing permissions!");
    console.log("Restart occurred using /restart");
    message.channel.send("Restarting...").then(() => {
      process.exit(1);
    });
  }
});
// chat filter (Experimental)
client.on('message', async message => {
    var bad = ["nigga", "nigger", "nibba", "<@&705217381399527445>", "<@&705247566245396561>", "cunt", "asshole", "nigg a", "n i g g a", "n igga", "ni gga", "n1gga", "migga"]
    let msg = message.content.toLowerCase();
    for (let x = 0; x < bad.length; x++) {
        if(message.member.hasPermission("MANAGE_MESSAGES")) return;
        if (msg.includes(bad[x])){
            await message.reply("You cannot say that here!")     
            message.delete()
            return;     
        }
    }
});
// /help
client.on("message", message => {
  if (message.content === "/help" || message.content === "/cmds") {
    const helpEmbed = new Discord.RichEmbed()
      .setTitle("France bot | List of commands")
      .setColor("#2222FF")
      .setDescription(
        "**MISC**\n`/help`, `/cmds` : Shows this message\n`/minesweeper <rows> <columns> <lines>` : Play some minesweeper\n`/stats` : Shows the stats of this server\n`/mihai` : <@227569538156331008>\n`/howgay <user>` : Check the gayness of someone\n`/pengun` : Pengun\n`/meme` : Get a random popular meme from reddit\n`/embed <message>` : Converts your message to a pretty embed\n`DISABLED` `/say <message>` : Make the bot say your message (Disabled due to exploit)\n`/birb` : Get a random bird image\n\n**MUSIC**\n`/play <song name>` : Play a song from youtube\n`/stop` : Stops the music\n`/skip` : Skips the currently playing song\n\n**ROLES**\n`/eng` : Adds you the ENG role (only add if you speak english!)\n`/fr` : Adds you the FR role (only add if you speak french)\n`/noeng` : Removes your ENG role\n`/nofr` : Removes your FR role\n\n**MODERATION**\n`/kick <user>` : Kicks the specified user\n`/ban <user>` : Bans the specified user\n`/mute <user>` : Mutes the specified user\n`/unmute <user>` : Unmutes the specified user\n`/purge <amount>` : Deletes the specified amount of messages in the current channel"
      )
      .setTimestamp()
      .setFooter("France bot");
    message.channel.send(helpEmbed);
  }
});
// /evalr
client.on("message", message => {
  const args = message.content.split(" ").slice(1);

  if (message.content.startsWith("/evalr")) {
    if (message.author.id !== "485165406881841152") return;
    try {
      const code = args.join(" ");
      let evaled = eval(code);

      if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
      const theEmbed = new Discord.RichEmbed()
        .setColor("#00ff00")
        .setTitle("Evaluation Success")
        .setDescription(
          `**Expression**\n\`\`\`​${code}\`\`\`\n**Result**\n\`\`\`​${evaled}\`\`\``
        )
        .setTimestamp();
      message.channel.send(theEmbed);
    } catch (err) {
      const errEmbed = new Discord.RichEmbed()
        .setTitle("Evaluation Failed")
        .setColor("#ff0000")
        .setDescription(`\`\`\`${err}\`\`\``)
        .setTimestamp();
      message.channel.send(errEmbed);
    }
    message.delete();
  }
});
// /evaln
client.on("message", message => {
  const args = message.content.split(" ").slice(1);

  if (message.content.startsWith("/evaln")) {
    if (message.author.id !== "485165406881841152") return;
    try {
      const code = args.join(" ");
      let evaled = eval(code);

      if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
    } catch (err) {
      const errEmbed = new Discord.RichEmbed()
        .setTitle("Evaluation Failed")
        .setColor("#ff0000")
        .setDescription(`\`\`\`${err}\`\`\``)
        .setTimestamp();
      message.channel.send(errEmbed);
    }
    message.delete();
  }
});
// /minesweeper
client.on("message", function(message) {
  const content = message.content.split(" ");
  const args = content.slice(1);

  if (content[0] === "/minesweeper") {
    const rows = parseInt(args[0]);
    const columns = parseInt(args[1]);
    const mines = parseInt(args[2]);

    if (!rows) {
      return message.channel.send(
        ":warning: Please provide the number of rows. Correct usage is /minesweeper <rows> <columns> <mines>"
      );
    }

    if (!columns) {
      return message.channel.send(
        ":warning: Please provide the number of columns. Correct usage is /minesweeper <rows> <columns> <mines>"
      );
    }

    if (!mines) {
      return message.channel.send(
        ":warning: Please provide the number of mines. Correct usage is /minesweeper <rows> <columns> <mines>"
      );
    }

    const minesweeper = new Minesweeper({ rows, columns, mines });
    const matrix = minesweeper.start();

    return matrix
      ? message.channel.send(matrix)
      : message.channel.send(":warning: You have provided invalid data.");
  }
});
// /stats
client.on("message", message => {
  if (message.content === "/stats") {
    let cha = message.guild.roles.get("555403931971223552").members;
    let nob = message.guild.roles.get("582070219380490271").members;
    let may = message.guild.roles.get("513860816244834314").members;
    let cit = message.guild.roles.get("513860248239603712").members;
    const statsEmbed = new Discord.RichEmbed()
      .setColor("#ffee00")
      .setTitle("Server Stats")
      .setDescription(
        `${cha.size} Chancellors\n${nob.size} Nobles\n${may.size} Mayors\n${cit.size} Citizens\n${message.guild.memberCount} Total members`
      )
      .setTimestamp();
    message.channel.send(statsEmbed);
  }
});
// /mihai
client.on("message", message => {
  if (message.content === "/mihai") {
    const mihaiEmbed = new Discord.RichEmbed()
      .setColor("#ff2200")
      .setTitle("Gay rate machine")
      .setDescription("Mihai is 101% gay");
    message.channel.send(mihaiEmbed);
  }
});
// /purge
client.on("message", message => {
  if (!message.guild) return;
  if (message.content.startsWith("/purge")) {
    if (
      message.member.hasPermission("MANAGE_MESSAGES") ||
      message.author.id == "485165406881841152"
    ) {
      const amount = message.content.slice(7);
      if (amount) {
        if (Number(amount) <= 99 && Number(amount) >= 1) {
          message.channel
            .bulkDelete(Number(amount) + 1)
            .then(() => {
              const bulkEmbed = new Discord.RichEmbed()
                .setTitle(":white_check_mark: Purge Success")
                .setColor("#00ff00")
                .setDescription(
                  `Messages Deleted : __​${amount}__\nModerator : <@${message.author.id}>`
                )
                .setTimestamp()
                .setFooter("France bot - /purge");
              message.channel.send(bulkEmbed);
            })
            .catch(err => {
              const errorEmbed = new Discord.RichEmbed()
                .setTitle(":warning: Purge Error")
                .setColor("#ff0000")
                .setDescription(
                  `An error occurred while attempting to perform /purge :\n\`\`\`​${err}\`\`\`\nNote : Messages older than 2 weeks cannot be deleted.`
                )
                .setTimestamp();
              message.channel.send(errorEmbed);
              console.error(err);
            });
        } else {
          if (Number(amount) >= 99 ) {
            message.channel.send(`Error : Cannot delete more than __99__ messages at once! Your amount (${amount}) is ${Number(amount) - 99} messages over the limit!`)
          } else {
            message.channel.send(`Error : Cannot delete a zero or negative amount of messages!`)
          };
        }
      } else {
        message.reply("You didn't provide the amount of messages to delete!");
      }
    } else {
      message.reply("You do not have permissions!");
    }
  }
});
// join message
client.on("guildMemberAdd", member => {
  const welcomeEmbed = new Discord.RichEmbed()
    .setColor("#00ff00")
    .setTitle("Someone just joined!")
    .setDescription(
      "Welcome to the France discord server, " +
        member +
        "\nMake sure to set your nickname to Nation | IGN | Town , if you are a citizen/mayor/ally please go to <#700355160391548958> and follow the pinned format!\n" +
        `We now have ${member.guild.memberCount} members!`
    )
    .setTimestamp();
  member.guild.channels.get("513863400737079296").send(welcomeEmbed);
  const role = member.guild.roles.find(role => role.name === "Foreigner");
  member.addRole(role);
});
// quit message
client.on("guildMemberRemove", member => {
  const quitroasts = [
    `Goodbye ${member.user.tag}, we will miss trying to avoid you around here!`,
    `${member.user.tag} did a baguette overdose`,
    `${member.user.tag} earned the biggay from leaving!`,
    `${member.user.tag} was slain by a Frenchie using [Baguette]`,
    `${member.user.tag} visited the guillotine and didn't come back`,
    `${member.user.tag} wasn't enough epic to stay here`,
    `${member.user.tag} litteraly left the server!`,
    `${member.user.tag} was probably ggovi :flushed:`,
    `${member.user.tag} left. How rude!`,
    `The Unepic of the year goes to ${member.user.tag} who just left!`
  ];

  const quitEmbed = new Discord.RichEmbed()
    .setColor("#ff0000")
    .setTitle("Someone just left!")
    .setDescription(
      quitroasts[Math.floor(Math.random() * quitroasts.length)] +
        "\n" +
        `We now have ${member.guild.memberCount} members.`
    )
    .setTimestamp();
  member.guild.channels.get("513863400737079296").send(quitEmbed);
});
// Music commands (experimental)
client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith("/")) return;

  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`/play`)) {
    execute(message, serverQueue);
    return;
  } else if (message.content.startsWith(`/skip`)) {
    skip(message, serverQueue);
    return;
  } else if (message.content.startsWith(`/stop`)) {
    stop(message, serverQueue);
    return;
  } else;
});

async function execute(message, serverQueue) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voiceChannel;
  if (!voiceChannel)
    return message.channel.send(
      "You need to be in a voice channel to play music!"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "I need the permissions to join and speak in your voice channel!"
    );
  }

  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
    title: songInfo.title,
    url: songInfo.video_url
  };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
      message.channel.send(`Now playing **${song.title}** !`);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(
      `**${song.title}** has been added to the queue !`
    );
  }
}

function skip(message, serverQueue) {
  if (!message.member.voiceChannel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  if (!serverQueue)
    return message.channel.send("There is no song that I could skip!");
  serverQueue.connection.dispatcher.end();
  message.channel.send("Skipped !");
}

function stop(message, serverQueue) {
  if (!message.member.voiceChannel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
  message.channel.send("Stopped the music!");
}

function play(guild, song, message) {
  const serverQueue = queue.get(guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    message.channel.send(
      "Left the channel since all songs in the queue ended !"
    );
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .playStream(ytdl(song.url))
    .on("end", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => {
      message.channel.send(error);
    });
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}

// /kick
client.on("message", message => {
  if (!message.guild) return;
  if (message.content.startsWith("/kick")) {
    if (!message.member.hasPermission("KICK_MEMBERS"))
      return message.channel.send("You do not have permissions!");
    const user = message.mentions.users.first();
    if (user) {
      const member = message.guild.member(user);
      if (member) {
        member
          .kick("Kicked by " + message.member.user.tag + " using France bot")
          .then(() => {
            message.reply(`Successfully kicked ${user.tag}`);
          })
          .catch(err => {
            message.reply("Couldn't kick user!");
            console.error(err);
          });
      } else {
        message.reply("That user isn't in this server!");
      }
    } else {
      message.reply("You didn't mention the user to kick!");
    }
  }
});
// /ban
client.on("message", message => {
  if (!message.guild) return;
  if (message.content.startsWith("/ban")) {
    if (!message.member.hasPermission("BAN_MEMBERS"))
      return message.channel.send("You do not have permissions!");
    const user = message.mentions.users.first();
    if (user) {
      const member = message.guild.member(user);
      if (member) {
        member
          .ban({
            reason:
              "Banned by " + message.member.user.tag + " using France bot "
          })
          .then(() => {
            message.reply(`Successfully banned ${user.tag}`);
          })
          .catch(err => {
            message.reply("Couldn't ban user!");
            console.error(err);
          });
      } else {
        message.reply("That user isn't in this guild!");
      }
    } else {
      message.reply("You didn't mention the user to ban!");
    }
  }
});
// /mute
client.on("message", message => {
  if (!message.guild) return;
  if (message.content.startsWith("/mute")) {
    if (!message.member.hasPermission("MANAGE_MESSAGES"))
      return message.channel.send("You don't have permissions!");
    const user = message.mentions.users.first();
    if (user) {
      const member = message.guild.member(user);
      if (member) {
        let role = message.guild.roles.find(r => r.name === "Muted");
        member
          .addRole(role)
          .then(() => {
            message.reply(`Successfully muted ${user.tag}`);
          })
          .catch(err => {
            message.reply("Couldn't mute user!");
            console.error(err);
          });
      } else {
        message.reply("That user isn't in this server!");
      }
    } else {
      message.reply("You didn't mention the user to mute!");
    }
  }
});
// /unmute
client.on("message", message => {
  if (!message.guild) return;
  if (message.content.startsWith("/unmute")) {
    if (!message.member.hasPermission("MANAGE_MESSAGES"))
      return message.channel.send("You do not have permissions!");
    const user = message.mentions.users.first();
    if (user) {
      const member = message.guild.member(user);
      if (member) {
        let role = message.guild.roles.find(r => r.name === "Muted");
        member
          .removeRole(role)
          .then(() => {
            message.reply(`Successfully unmuted ${user.tag}`);
          })
          .catch(err => {
            message.reply("Couldn't mute user!");
            console.error(err);
          });
      } else {
        message.reply("That user isn't in this server!");
      }
    } else {
      message.reply("You didn't mention the user to mute!");
    }
  }
});
// /rolemute
client.on("message", message => {
  if (message.content === "/rolemute") {
    message.channel.send("Setting overrides for the muted role...");
    message.guild.channels.forEach(async (channel, id) => {
      let role = message.guild.roles.find(r => r.name === "Muted");
      await channel.overwritePermissions(role, {
        SEND_MESSAGES: false,
        ADD_REACTIONS: false
      });
    });
  }
});
// /bidder
client.on("message", message => {
  if (message.content === "/bidder") {
    const bidrole = "700377301019525201";
    message.member.addRole(bidrole);
    message.reply("Successfully added the Bidder role!");
  }
});
// /unbidder
client.on("message", message => {
  if (message.content === "/unbidder") {
    const bidrole = "700377301019525201";
    message.member.removeRole(bidrole);
    message.reply("Successfully removed the Bidder role!");
  }
});
// /cat
client.on("message", message => {
  if (message.content === "/cat") {
    message.reply("Cat ", {
      files: [
        "https://media.discordapp.net/attachments/313329522332139522/655471787102044260/cat.gif"
      ]
    });
  }
});
// /howgay
client.on("message", message => {
  if (message.content.startsWith("/howgay")) {
    var gay = Math.floor(Math.random() * 101);
    if (message.content.slice(8) === "")
      return message.channel.send(
        "Please ping the user i need to check gayness"
      );
    const member = message.content.slice(8);
    const gayEmbed = new Discord.RichEmbed()
      .setColor("#ff2244")
      .setTitle("Gay rate machine")
      .setDescription(member + " is " + gay + "% gay");
    message.channel.send(gayEmbed);
  }
});
// /pengun
// Peak uselessness
client.on("message", message => {
  if (message.content === "/pengun") {
    message.reply("Pengun");
  }
});
// /eng
client.on("message", message => {
  if (message.content === "/eng") {
    const enrole = message.guild.roles.find(role => role.name === "ENG");
    message.member.addRole(enrole);
    message.reply("Successfully added the ENG role!");
  }
});
// /fr
client.on("message", message => {
  if (message.content === "/fr") {
    const frrole = message.guild.roles.find(role => role.name === "FR");
    message.member.addRole(frrole);
    message.reply("Successfully added the FR role!");
  }
});
// /noeng
client.on("message", message => {
  if (message.content === "/noeng") {
    const enrole = message.guild.roles.find(role => role.name === "ENG");
    message.member.removeRole(enrole);
    message.reply("Successfully removed the ENG role!");
  }
});
// /nofr
client.on("message", message => {
  if (message.content === "/nofr") {
    const frrole = message.guild.roles.find(role => role.name === "FR");
    message.member.removeRole(frrole);
    message.reply("Successfully removed the FR role!");
  }
});
// /meme
client.on("message", async message => {
  if (message.content === "/meme") {
    const { url } = await fetch("https://meme-api.herokuapp.com/gimme").then(
      response => response.json()
    );
    const memeEmbed = new Discord.RichEmbed()
      .setColor("#ff9900")
      .setTitle("Meme")
      .setDescription(`Requested by ${message.member.user.tag}`)
      .setImage(url)
      .setTimestamp()
      .setFooter("France bot - /meme");
    message.channel.send(memeEmbed);
  }
});
// /embed
client.on("message", message => {
  if (message.content.startsWith("/embed")) {
    const daContent = message.content.slice(7);
    if (daContent === "")
      return message.channel.send("Cant send empty embed dummie");
    var colors = [
      "#ff0000",
      "#00ff00",
      "#0000ff",
      "#ffff00",
      "#00ffff",
      "#ff00ff"
    ];
    var color = Math.floor(Math.random() * colors.length);
    const Embed = new Discord.RichEmbed()
      .setColor(colors[color])
      .setDescription(daContent)
      .setFooter(message.member.user.tag);
    message.channel.send(Embed).catch();
    message.delete();
  }
});
// /say
/* client.on("message", message => {
  if (message.content.startsWith("/say")) {
    const daContent = message.content.slice(5);
    if (daContent === "")
      return message.reply("Cant send empty message dummie");
    else
      message.channel.send(daContent + "\n`- " + message.member.user.tag + "`").catch();
    message.delete();
    //  message.channel.send("An internal error has occurred when attempting to perform this command. <undefined>");
  }
}); */

// /birb
client.on("message", async message => {
  if (message.content === "/birb") {
    const { link } = await fetch("https://some-random-api.ml/img/birb").then(
      response => response.json()
    );
    const birbEmbed = new Discord.RichEmbed()
      .setColor("#0077ff")
      .setTitle("Birb")
      .setDescription(`Requested by ${message.member.user.tag}`)
      .setImage(link)
      .setTimestamp()
      .setFooter("France bot - /birb");
    message.channel.send(birbEmbed);
  }
});



// anti autosleep module
const http = require("http");
const app = express();
app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

//token
client.login(process.env.TOKEN);