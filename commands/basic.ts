import { Command } from "./command.ts"
import { AttachmentBuilder, Client, CommandInteraction, EmbedBuilder, SlashCommandBuilder, User } from "discord.js"

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

    private getUptimeStr(uptime : number) {
        let totalSeconds = (uptime / 1000);
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        return `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
    }

    // TODO: add stats to it or somethin
    public async execute(interaction : CommandInteraction) {
        var uptime = interaction.client.uptime ?? 0;

        const embed = new EmbedBuilder()
            .setTitle("the evil bot")
            // replace this w/ your nickname or somethin
            .setDescription("maintained by @some_one.jpg\n[source code](https://github.com/asshole422/evil-bot)")
            .addFields(
              {
                name: "total guilds",
                value: interaction.client.guilds.cache.size.toString(),
                inline: true
              },
              {
                name: "current uptime",
                value: this.getUptimeStr(uptime),
                inline: true
              },
            )
            .setThumbnail("https://cdn.discordapp.com/avatars/1172519392836341830/886cdcc8dc4813fcf3ed9c23052579da.webp?size=1024&format=webp")
            .setColor("#f40000");
    
    await interaction.reply({embeds: [embed]});
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