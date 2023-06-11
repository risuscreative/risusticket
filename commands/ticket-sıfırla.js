const Discord = require("discord.js")
const db = require("croxydb");
const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "ticket-sıfırla",
  description: "Ticket Sistemini Kurar!",
  type: 1,
  options: [],
  run: async (client, interaction) => {

    const ayarla = db.get(`ticketSistem_${interaction.guild.id}`)


        if (!ayarla) return interaction.reply({ content : `Ticket zaten ayarlı degğil broo`, ephemeral: true })

    const { user, customId, guild } = interaction;

    interaction.reply({content : "Başarıyla sıfırlandı."})

    db.delete(`ticketKatagor_${guild.id}`)
    db.delete(`ticketSistem_${guild.id}`)
  }
}
