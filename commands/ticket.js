const Discord = require("discord.js")
const db = require("croxydb");
const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "ticket-kur",
  description: "Ticket Sistemini Kurar!",
  type: 1,
  options: [],
  run: async (client, interaction) => {


    await interaction.deferReply();
    const { user, options, guild } = interaction;

    if(!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator, false)) {
      return interaction.followUp({ content: "Brom uza git.", ephemeral: true })
    }

    const row = new Discord.ActionRowBuilder()
    .addComponents(
      new Discord.ButtonBuilder()
        .setCustomId(`onayla_${user.id}`)
        .setLabel('Evet, Sistem kurulsun.')
        .setStyle(Discord.ButtonStyle.Primary),
        new Discord.ButtonBuilder()
        .setCustomId(`reddet_${user.id}`)
        .setLabel('Hayır, sistemi kurma.')
        .setStyle(Discord.ButtonStyle.Secondary),
    );


  return interaction.followUp({ content : `Ticketı kuram mı?`, components: [row], fetchReply: true });
  }
}
