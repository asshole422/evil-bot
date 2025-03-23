import { Command } from "./command.ts"
import { CommandInteraction, EmbedBuilder, SlashCommandBuilder, User } from "discord.js"

export class PingCommand extends Command {
    constructor() {
        super("ping", "shows current API latency", new SlashCommandBuilder());
    }

    public async execute(interaction : CommandInteraction) {
        await interaction.reply("pong!!!!!!!!!!! API latency: " + Math.round(interaction.client.ws.ping));
    }
}

export class AvatarCommand extends Command {
    constructor() {
        super("avatar", "gets avatar of user", new SlashCommandBuilder()
            .addUserOption(option => option
                            .setName("user")
                            .setDescription("user in question")
                            .setRequired(true)
                        )
        );
    }

    public async execute(interaction : CommandInteraction) {
        // @ts-ignore
        const user : User | null = interaction.options.getUser("user");
        const url : string = user?.avatarURL({ size: 1024 }) ?? "";
        if (url == "") {
            throw Error("No avatar URL")
        }
        const embed = new EmbedBuilder()
            .setColor("#ff0100")
            .setTimestamp(0)
            .setImage(url)
            .setTitle("Avatar of user " + user?.displayName + " (@" + user?.username + ")")
            .setDescription("the evil has occurred")
            .setURL(url);
        interaction.reply({embeds: [embed]});
    }
}

export class AboutCommand extends Command {
    constructor() {
        super("about", "about the bot itself", new SlashCommandBuilder());
    }

    public async execute(interaction : CommandInteraction) {
        await interaction.reply("i am evil. here's my [source code](https://github.com/asshole422/evil-bot) btw");
    }
}