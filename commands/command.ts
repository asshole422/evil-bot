import {SlashCommandBuilder, CommandInteraction, type SlashCommandOptionsOnlyBuilder} from 'discord.js';

export interface CommandCooldownOptions {
    has_cooldown : boolean,
    cooldown_time : number
}

export class Command {
    constructor(
        public name: string, 
        public description: string,
        public slash_cmd : SlashCommandBuilder | SlashCommandOptionsOnlyBuilder,
        public cooldown_settings: CommandCooldownOptions = {has_cooldown: false, cooldown_time: 0},

        private timestamps : {[id : string] : number | undefined} = {}
        
    ) { }

    

    // NOT an override function. One that YOU should use to run the command (since it actually implements the cooldown)
    public async runCommand(interaction : CommandInteraction) : Promise<void> {
        if (this.cooldown_settings.has_cooldown != true) {
            await this.execute(interaction);
            return;
        }
        
        if (this.timestamps[interaction.user.id] != undefined) {
            const expiredTimestamp = Math.round(((this.timestamps[interaction.user.id] ?? 0) + this.cooldown_settings.cooldown_time * 1000) / 1_000);
            await interaction.reply(`You're under cooldown. Wait <t:${expiredTimestamp}:R> to use it again.`);
            return;
        }

        this.timestamps[interaction.user.id] = Date.now();
        await this.execute(interaction);
        setTimeout(() => {this.timestamps[interaction.user.id] = undefined}, this.cooldown_settings.cooldown_time * 1000);
        

    }

    // Override function
    public async execute(interaction : CommandInteraction) : Promise<void> { }

    public toJSON() { 
        this.slash_cmd.setName(this.name);
        this.slash_cmd.setDescription(this.description);
        return this.slash_cmd.toJSON();
    }

}