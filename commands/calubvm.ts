import { Command, type CommandCooldownOptions } from "./command.ts";
import { AttachmentBuilder, CommandInteraction, EmbedBuilder, SlashCommandBuilder, User } from "discord.js"
import type { VMInfo, CollabVMUser, ChatLogEntry } from './utils/calubvmAPI';
import { CollabVMAPI } from './utils/calubvmAPI';

// i love @ts-ignore (typescript is such a crybaby smh)

const cooldown_setting : CommandCooldownOptions = {has_cooldown: true, cooldown_time: 5}

export class CVM_VMPreview extends Command {
    constructor(
        private botList = ["AnyOSInstallBot", "PersonalDiskBot", "Emperor Kevin"], // Array of all (official) bots from cvm
        private colorList = ["", "", "🔴", "🟢"]
        
    ) {
        super("vm", "previews the specified vm on collabVM", new SlashCommandBuilder()
            .addStringOption(option => option
                .setName("vm")
                .setDescription("Node ID of the VM")
                .setRequired(true)
                // the evil
                .addChoices({name: "vm0", value:"vm0b0t"})
                .addChoices({name: "vm1", value:"vm1"})
                .addChoices({name: "vm2", value:"vm2"})
                .addChoices({name: "vm3", value:"vm3"})
                .addChoices({name: "vm4", value:"vm4"})
                .addChoices({name: "vm5", value:"vm5"})
                .addChoices({name: "vm6", value:"vm6"})
                .addChoices({name: "vm7", value:"vm7"})
                .addChoices({name: "vm8", value:"vm8"})
            )
        );
        this.cooldown_settings = cooldown_setting;
    }

    public async execute(interaction : CommandInteraction) {
        //@ts-ignore
        const vmNodeID : string = interaction.options.getString("vm").toLowerCase();
        var user : User = interaction.user;
        await interaction.deferReply(); // Incase if collabVM API is painfully slow

        var onlineVMs : string[] | null = null;
        try {
            onlineVMs = await CollabVMAPI.getVMList();
        } catch (exception) {
            console.log("Failed to retrieve online VMs list, continuing...");
        }
        if (onlineVMs != null) {
            if (!onlineVMs.includes(vmNodeID)) {
                await interaction.editReply("This VM is doesn't exist / offline, dumbass");
                return;
            }
        }


        var info : VMInfo | null = {id: "", users: [], turnQueue: [], voteInfo: {Yes: 0, No: 0, Time: 0}};
        try {
            info = await CollabVMAPI.getVMData(vmNodeID);
        } catch (exception) {
            // @ts-ignore
            switch (exception.statusCode) {
                case 404:
                    await interaction.editReply("This VM doesn't exist, dumbass");
                    break;
                case 502:
                    await interaction.editReply("Request failed. CollabVM API is, with 100% certainity, down. (Error code: 502)");
                    break;
                default:
                    // @ts-ignore
                    await interaction.editReply("Request failed. Unhandled HTTP status code (Error code: " + exception.statusCode.toString() + ")");
                    break;
            }
            return;
        }
        if (info == null) {
            await interaction.editReply("Request failed, no body");
            return;
        }
        var usersStr : string = "";
        var checkedUsers  : string[] = [];
        var botsStr : string = "";
        
        // turn queue first, so those in the queue show up first
        if (info.turnQueue != null) {
            info.turnQueue.forEach((value : CollabVMUser, index : number) => {
                if (index == 0) {
                    usersStr += "🔵";
                } else {
                    usersStr += "🟡";
                }
                usersStr += " " + this.colorList[value.rank] + " " + value.username + "\n";
                checkedUsers.push(value.username);
            })
        }

        info.users.forEach(value => {
            if (this.botList.includes(value.username)) { botsStr += this.colorList[value.rank] + " " + value.username + "\n" }
            else if (!(checkedUsers.includes(value.username))) { usersStr += this.colorList[value.rank] + " " + value.username + "\n" }
        })

        // Embedding the link itself is not an option, it sometimes gets fucked by discord, so we HAVE to turn it into a file
        const filename = vmNodeID + "_" + Math.floor(Math.random()).toString() + ".png";
        const attachment = new AttachmentBuilder("https://cvmapi.elijahr.dev/api/v1/screenshot/"+ vmNodeID, { name:filename })
        
        const embed = new EmbedBuilder()
            .setTitle(vmNodeID)
            .setColor("#FF0000")
            .addFields(
                {
                    name: "Users (" + (usersStr.split("\n").length-1).toString() + " total)", 
                    value: usersStr,
                    inline: true
                },
                {
                    name: "Bots ("+ (botsStr.split("\n").length-1).toString() +" total)",
                    value: botsStr,
                    inline: true
                },
            )
            .setImage("attachment://" + filename)
            .setFooter({
                text: "Requested by " + user.displayName + " (@" + user.username + ")",
            });

        await interaction.editReply({embeds: [embed], files:[attachment]});
        
    }
}

export class CVMChatCommand extends Command {
    constructor(
        
    ) {
        super("chat", "Performs a chatlog lookup via CVMAPI with specified arguments.", new SlashCommandBuilder()
            .addStringOption(option => option
                .setName("vm")
                .setDescription("VM in question")
                .setChoices({name: "vm0", value: "VM0"})
                .setChoices({name: "vm1", value: "VM1"})
                .setChoices({name: "vm2", value: "VM2"})
                .setChoices({name: "vm3", value: "VM3"})
                .setChoices({name: "vm4", value: "VM4"})
                .setChoices({name: "vm5", value: "VM5"})
                .setChoices({name: "vm6", value: "VM6"})
                .setChoices({name: "vm7", value: "VM7"})
                .setChoices({name: "vm8", value: "VM8"})
            )
            .addNumberOption(option => option
                .setName("msgs")
                .setDescription("Amount of messages to get. Capped to 30, so you don't fill the entire channel with it.")
                .setMinValue(1)
                .setMaxValue(30)
            )
            .addBooleanOption(option => option
                .setName("random")
                .setDescription("If true, select random messages instead of newest.")
            )
            .addStringOption(option => option
                .setName("username")
                .setDescription("Username to look up")
            )
            .addStringOption(option => option
                .setName("from")
                .setDescription("Filter messages after the specified timestamp. Has to be valid date string (UTC)")
            )
            .addStringOption(option => option
                .setName("to")
                .setDescription("Filter messages before the specified timestamp. Has to be valid date string (UTC)")
            )
        );
    }

    public async execute(interaction : CommandInteraction) {
        // god i love typescript importer
        // @ts-ignore
        const vmNodeID : string = interaction.options.getString("vmNode") ?? "";
        // @ts-ignore
        const msgs : number = interaction.options.getNumber("msgs") ?? 10;
        // @ts-ignore
        const isRand : boolean = interaction.options.getBoolean("isRandom") ?? false;
        // @ts-ignore
        const username : string = interaction.options.getString("username") ?? "";
        // @ts-ignore
        const from_datestr : string = interaction.options.getString("from");
        // @ts-ignore
        const to_datestr : string = interaction.options.getString("to");
        var date_from : Date | undefined = undefined;
        var date_to : Date | undefined = undefined;

        await interaction.deferReply();
        if (from_datestr != null || from_datestr != "") {
            date_from = new Date(from_datestr);
        }
        if (to_datestr != null || to_datestr != "") {
            date_to = new Date(to_datestr);
        }
        var chatData : ChatLogEntry[] | null = null;
        try {
            chatData = await CollabVMAPI.getChatData(vmNodeID, msgs, isRand, username, date_from, date_to);
        }catch (exception) {
            // @ts-ignore
            await interaction.editReply(`Request failed (Error code ${exception.statusCode})`);
            console.log(exception)
            return;
        }
        
        var chatStr : string = "```\n";
        chatData?.forEach((value : ChatLogEntry) => chatStr += `[${value.timestamp}] ${value.username}> ${value.message}`);
        chatStr += "\n```";

        await interaction.editReply("Chat log obtained:\n" + chatStr);
    }
}

export class CVM_FindUser extends Command {
    constructor() {
        super("finduser", "Checks every single (official) VM to find a specified user.", new SlashCommandBuilder()
            .addStringOption(option => option
                .setName("username")
                .setDescription("Username of said user.")
                .setRequired(true)
            )
        );
    }

    public async execute(interaction : CommandInteraction) {
        
    }
}