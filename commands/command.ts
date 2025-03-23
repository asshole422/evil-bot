import {SlashCommandBuilder, CommandInteraction, type SlashCommandOptionsOnlyBuilder} from 'discord.js';

export class Command {
    constructor(
        public name: string, 
        public description: string,
        public slash_cmd : SlashCommandBuilder | SlashCommandOptionsOnlyBuilder
    ) { }

    // Override function
    public async execute(interaction : CommandInteraction) : Promise<void> { }

    public toJSON() { 
        this.slash_cmd.setName(this.name);
        this.slash_cmd.setDescription(this.description);
        return this.slash_cmd.toJSON();
    }

}