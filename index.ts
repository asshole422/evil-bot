import {Client, CommandInteraction, Events, GatewayIntentBits, REST, Routes} from 'discord.js';
import { Command } from "./commands/command.ts";
import { commands } from './commands/cmdList.ts';

const client = new Client({intents: [GatewayIntentBits.Guilds]});
const rest = new REST().setToken(process.env.TOKEN ?? "");

// listen for the client to be ready
client.once(Events.ClientReady, (c) => {
  console.log(`Bot initialized, logged in as ${c.user.tag}`);
});

async function ExceptionHandle(exception : any, interaction : CommandInteraction) : Promise<void> {
  switch (exception) {
    // add exceptions here or something
    default:
      await interaction.reply("Unhandled exception has occurred.");
      console.log("Unhandled exception: " + exception.toString());
  }
}

client.on('interactionCreate', (interaction) => {
  if (!interaction.isCommand()) return;

  // TODO: Make commandList a dictionary and use that instead of iterating thru the commandList like a stupid dumb moron
  commands.forEach(async (value : Command, index : number, array : Command[]) => {
      if (value.name == interaction.commandName) {
        try {
          await value.execute(interaction);
        } catch (ex) {
          await ExceptionHandle(ex, interaction);
        }
        return;
      }
  });
});

commands.map((value) => {value.toJSON()});

// Registering slash commands b4 logging in 

console.log("Refreshing slash (/) commands...");

try {
  // toggle me if you're testing some new commands or somethin vvvvv
  //await rest.put(Routes.applicationGuildCommands(process.env.CLIENT ?? "", "1093230180568404050"), {"body": commands});
  await rest.put(Routes.applicationCommands(process.env.CLIENT ?? ""), {"body": commands});
} catch (error) {
  console.log(error);
}


client.login(process.env.TOKEN);