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
  client.channels.cache
    .get("637663684356997125")
    .send(
      "Bot successfully started ( " + Date.now() + ", " + d.toString() + " )"
    );
  client.user.setPresence({
    status: "online",
    activity: {
      name: `Startup complete !`,
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
      `pepole eat baguette`,
      `/helpdddddd`
    ];
    const activity = activities[Math.floor(Math.random() * activities.length)];
    await client.user.setActivity(activity, { type: "WATCHING" });
  }, 120000);
});
// Error listener
// Websockets and network
client.on("shardError", error => {
  client.channels.cache
    .get("637663684356997125")
    .send(":x: A network error occured...\n```" + error + "```");
});
// API
process.on("unhandledRejection", error => {
  client.channels.cache.get("637663684356997125").send(":x: An API error occured...\n```" + error + "```");
});
// /restart
client.on("message", message => {
  if (message.content === "/restart") {
    if (message.author.id !== "485165406881841152")
      return message.reply("Missing permissions!");
    console.log("Restart occurring using /restart");
    message.channel.send("Restarting...").then(() => {
      process.exit(1);
    });
  }
});

client.on("message", async message => {
  var badWords = [
    "nigga",
    "nigger",
    "nibba",
    "nibber",
    "cunt",
    "asshole",
    "nigg a",
    "n i g g a",
    "n igga",
    "ni gga",
    "n1gga",
    "migga",
    "negro"
  ];
  let msg = message.content.toLowerCase();
  if (badWords.includes(msg) && !message.member.hasPermissions("MANAGE_MESSAGES"))
  {
    await message.delete();
    message.reply("You cannot say that here!").then(msg => msg.delete(10*1000));
  }
  
  // /Help
  if (message.content.startsWith("/help") || message.content.startsWith("/cmds"))
  {
      const helpEmbed = new Discord.MessageEmbed()
      .setTitle("France bot | List of commands")
      .setColor("#2222FF")
      .setDescription(
        "**NOTE** The code is now open to public! go to https://glitch.com/edit/#!/france-bot?path=readme.md to see changelogs, status and the source code.\n\n**MISC**\n`/help`, `/cmds` : Shows this message\n`/minesweeper <rows> <columns> <lines>` : Play some minesweeper\n`/stats` : Shows the stats of this server\n`/mihai` : <@227569538156331008>\n`/howgay <user>` : Check the gayness of someone\n`/pengun` : Pengun\n`/meme` : Get a random popular meme from reddit\n`/embed <message>` : Converts your message to a pretty embed\n`/say <message>` : Make the bot say your message\n`/birb` : Get a random bird image\n\n**MODERATION**\n`/kick <user>` : Kicks the specified user\n`/ban <user>` : Bans the specified user\n`/mute <user>` : Mutes the specified user\n`/unmute <user>` : Unmutes the specified user\n`/purge <amount>` : Deletes the specified amount of messages in the current channel"
      )
      .setTimestamp()
      .setFooter("France bot");
    message.channel.send(helpEmbed);
  }
    
    // /Evalr
    if (message.content.toLowerCase().startsWith("/evalr")) 
    {
      if (message.author.id !== "485165406881841152") return;
      var args = message.content.split(" ").slice(1);
      
      try 
      {
        const code = args.join(" ");
        let evaled = eval(code);

        if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
        
        const theEmbed = new Discord.MessageEmbed()
          .setColor("#00ff00")
          .setTitle("Evaluation Success")
          .setDescription(
            `**Expression**\n\`\`\`​${code}\`\`\`\n**Result**\n\`\`\`​${evaled}\`\`\``
          )
          .setTimestamp();
        message.channel.send(theEmbed);
      } 
      catch (err) 
      {
        const errEmbed = new Discord.MessageEmbed()
          .setTitle("Evaluation Failed")
          .setColor("#ff0000")
          .setDescription(`\`\`\`${err}\`\`\``)
          .setTimestamp();
        message.channel.send(errEmbed);
      }
      message.delete();
    }
    
    if (message.content.startsWith("/evaln"))
    {
      if (message.author.id !== "485165406881841152") return;
      var args = message.content.split(" ").slice(1);
      try 
      {
        const code = args.join(" ");
        let evaled = eval(code);

        if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
      } 
      catch (err) 
      {
        const errEmbed = new Discord.MessageEmbed()
          .setTitle("Evaluation Failed")
          .setColor("#ff0000")
          .setDescription(`\`\`\`${err}\`\`\``)
          .setTimestamp();
        message.channel.send(errEmbed);
      }
      message.delete();
    }
    
    if (message.content.toLowerCase().startsWith("/minesweeper"))
    {
      const args = message.content.split(" ").slice(1);
      
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
    
    if (message.content.toLowerCase().startsWith("/stats") || message.content.toLowerCase().startsWith("/statistics"))
    {
      var ministers = message.guild.roles.cache.get("555403931971223552").members.size;
      var nobles = message.guild.roles.cache.get("582070219380490271").members.size;
      var mayors = message.guild.roles.cache.get("513860816244834314").members.size;
      var citizens = message.guild.roles.cache.get("513860248239603712").members.size;
      
      var statsEmbed = new Discord.MessageEmbed()
      .setTitle("Server Stats")
      .setColor("#ffee00")
      .setTimstamp()
      .setDescription(`${ministers} Ministers\n${nobles} Nobles\n${mayors} Mayors\n${citizens} Citizens\n${message.guild.memberCount} Total Members`)
    }
    
    if (message.content.toLowerCase().startsWith("/mihai"))
    {
      message.channel.send
      (
        new Discord.MessageEmbed()
        .setTitle("Gay rate machine")
        .setColor("#ff2200")
        .setDescription()
        .setDescription("Mihai is 101% gay")
        .setTimestamp()
      )
    }
    
    if (message.content.toLowerCase().startsWith("/purge"))
    {
      if (message.channel.type == "dm") return
      if (!message.member.hasPermissions("MANAGE_MESSAGES") || !message.author.id == "485165406881841152") return message.reply("You don't have permissions!")
      
      const amount = message.content.slice(7);
      if (amount) 
      {
        if (Number(amount) <= 99 && Number(amount) >= 1) 
        {
          message.channel.bulkDelete(Number(amount) + 1).then(() => 
          {
              message.channel.send
              (
                new Discord.MessageEmbed()
                .setTitle(":white_check_mark: Purge Success")
                .setColor("#00ff00")
                .setDescription(`Messages Deleted : __​${amount}__\nModerator : <@${message.author.id}>`)
                .setTimestamp()
                .setFooter("France bot - /purge")
              ).catch(err => 
              {
                console.error(err)
                return message.channel.send
                (
                  new Discord.MessageEmbed()
                  .setTitle(":warning: Purge Error")
                  .setColor("#ff0000")
                  .setDescription(`An error occurred while attempting to perform /purge :\n\`\`\`​${err}\`\`\`\nNote : Messages older than 2 weeks cannot be deleted.`)
                  .setTimestamp()
                )
              })
          })
        } 
        else if (Number(amount) >= 99)
        {
           return message.channel.send(`Error : Cannot delete more than __99__ messages at once! Your amount (${amount}) is ${Number(amount) - 99} messages over the limit!`)
        }
        else
        {
          return message.channel.send(`Error : Cannot delete a zero or negative amount of messages!`)
        }
      }
      else 
      {
        message.reply("You didn't provide the amount of messages to delete!");
      }
    }  
    
    if (message.content.toLowerCase().startsWith("/kick"))
    {
      if (message.channel.type == "dm") return
      if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply("You do not have permissions!")
      
      var member =  message.guild.member(message.mentions.users.first())
      if (!member) return message.reply("Couldn't find that user!")
      member.kick("Kicked by " + message.author.tag + " using France bot.").catch(console.error)
      await message.reply("Successfully kicked " + member.tag)
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
// /pmute
client.on("message", message => {
  if (!message.guild) return;
  if (message.content.startsWith("/pmute")) {
    if (!message.member.hasPermission("MANAGE_MESSAGES"))
      return message.channel.send("You don't have permissions to use this command !");
    const user = message.mentions.users.first();
    if (user) {
      const member = message.guild.member(user);
      if (member) {
        let role = message.guild.roles.cache.find(r => r.name === "Muted");
        member.roles
          .add(role)
          .then(() => {
            message.reply(`Successfully muted ${user.tag} forever!`);
          })
          .catch(err => {
            message.reply("Couldn't mute user!\n```" + err + "```");
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
// /mute
client.on("message", async message => {
  if (message.content.startsWith("/mute")) {
    const args = message.content.slice(5).trim().split(/ +/g);
    if (message.member.hasPermission("MANAGE_MESSAGES")) {
      if (message.content !== "/mute") { 
  let tomute = message.guild.member(
    message.mentions.users.first() || message.guild.members.get(args[0])
  );
  if (!tomute) return message.reply("Couldn't find user.");
  if (tomute.hasPermission("MANAGE_MESSAGES"))
    return message.reply("This user is a mod/admin, i can't mute him!");
  let muterole = message.guild.roles.cache.find(muterole => muterole.name === "Muted");
  //start of create role
  if (!muterole) {
    try {
      muterole = await message.guild.createRole({
        name: "Muted",
        color: "#222222",
        permissions: []
      });
      message.guild.channels.forEach(async (channel, id) => {
        await channel.overwritePermissions(muterole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });
    } catch (e) {
      console.log(e.stack);
    }
  }
  //end of create role
  let mutetime = args[1];
  if (!mutetime) return message.reply("You didn't specify a duration ! Use /pmute to permanently mute users.");

  await tomute.roles.add(muterole.id);
  let amount = 8 + args[0].length + args[1].length;
  let reason = message.content.slice(amount);
  console.log(reason);
  message.reply(`<@${tomute.id}> has been muted for ${ms(ms(mutetime))} for the reason *${reason}*`);

  setTimeout(function() {
    tomute.roles.remove(muterole.id);
  }, ms(mutetime));
      } else message.channel.send("**Command : /mute**\n\nSyntax : `/mute <@user> <duration> <reason>`\nDescription : Mutes an user for the specified duration. Can be unmuted with `/unmute <@user>`\nPermissions required : `MANAGE_MESSAGES`\nAliases : None\n__Arguments__\n`<@user>` : The user to mute\n`<duration>` : The duration of the mute. Must end with s/m/h/d (seconds/minutes/hours/days) e.g: 3s, 15m, 2h, 7d\n`<reason>` : Why you muted this user");
    } else message.reply("You do not have permissions to use this command!");
  } else;
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
        let role = message.guild.roles.cache.find(r => r.name === "Muted");
        member.roles
          .remove(role)
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
// /bidder
client.on("message", message => {
  if (message.content === "/bidder") {
    const bidrole = "700377301019525201";
    message.member.roles.add(bidrole);
    message.reply("Successfully added the Bidder role!");
  }
});
// /unbidder
client.on("message", message => {
  if (message.content === "/unbidder") {
    const bidrole = "700377301019525201";
    message.member.roles.remove(bidrole);
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
    const gayEmbed = new Discord.MessageEmbed()
      .setColor("#ff2244")
      .setTitle("Gay rate machine")
      .setDescription(member + " is " + gay + "% gay");
    message.channel.send(gayEmbed);
  }
});
// /pengun
client.on("message", message => {
  if (message.content === "/pengun") {
    message.reply("Pengun");
  }
});
// /meme
client.on("message", async message => {
  if (message.content === "/meme") {
    const { url } = await fetch("https://meme-api.herokuapp.com/gimme").then(
      response => response.json()
    );
    const memeEmbed = new Discord.MessageEmbed()
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
    const Embed = new Discord.MessageEmbed()
      .setColor(colors[color])
      .setDescription(daContent)
      .setFooter(message.member.user.tag);
    message.channel.send(Embed).catch();
    message.delete();
  }
});

// /birb
client.on("message", async message => {
  if (message.content === "/birb") {
    const { link } = await fetch("https://some-random-api.ml/img/birb").then(
      response => response.json()
    );
    const birbEmbed = new Discord.MessageEmbed()
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

// Someone joins the server
client.on("guildMemberAdd", member => {
  member.guild.channels.cache.get("513863400737079296").send
  (
    new Discord.MessageEmbed()
    .setColor("#00ff00")
    .setTitle("Someone just joined!")
    .setDescription(`Welcome to the France discord server, ${member.user.tag} \nMake sure to set your nickname to Nation | IGN | Town , if you are a citizen/mayor/ally please go to <#700355160391548958> and follow the pinned format! \nWe now have ${member.guild.memberCount} members!`)
  )
  member.roles.add("513859693639368705");
});
// Someone leaves the server
client.on("guildMemberRemove", member => {
  var quitMessages = [
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

  member.guild.channels.cache.get("513863400737079296").send
  (
    new Discord.MessageEmbed()
    .setColor("#ff0000")
    .setTitle("Someone just left!")
    .setDescription(quitMessages[Math.floor(Math.random() * quitMessages.length)] + "\n" + `We now have ${member.guild.memberCount} members.`)
    .setTimestamp()
  );
});
