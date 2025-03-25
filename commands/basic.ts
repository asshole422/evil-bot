import { Command } from "./command.ts"
import { AttachmentBuilder, CommandInteraction, EmbedBuilder, SlashCommandBuilder, User } from "discord.js"

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

    // TODO: add stats to it or somethin
    public async execute(interaction : CommandInteraction) {
        await interaction.reply("i am evil. here's my [source code](<https://github.com/asshole422/evil-bot>) btw");
    }
}

export class PrayCommand extends Command {
    constructor() {
        super("florg", "pray to the florg, the creator of the universe", new SlashCommandBuilder());
        this.cooldown_settings = {has_cooldown: true, cooldown_time: 3600}
    }

    public async execute(interaction: CommandInteraction): Promise<void> {
        var the_florg : AttachmentBuilder = new AttachmentBuilder("./the florg.jpg", {name: "god.jpg"});
        await interaction.reply({content:"the florg has blessed you. come back after an hour", files:[the_florg]});
    }
}