const { Collection, EmbedBuilder, codeBlock } = require("discord.js");
const Discord = require("discord.js")
const db = require("croxydb");
const db2 = require("orio.db")
const { readdirSync } = require("fs");
module.exports = async(client, interaction, member) => {

  if (!interaction.guild) return;
  
  const { user, customId, guild } = interaction;
  
  if(interaction.isButton()) {
    if(interaction.customId === `reddet_${interaction.user.id}`) {
      return interaction.update({ content: "`Ticket sistemi kurulumu iptal edildi.", embeds: [], components: [] })
    }
    
    if(interaction.customId === `onayla_${interaction.user.id}`) {
      interaction.update({ content: "`Destek sistemi kurulumu başarılı.", embeds: [], components: [] });
      
      const ticketac = new Discord.EmbedBuilder()
      .setAuthor({ name: `Alpha Graphic Art Ticket sistemi`, iconURL: `https://media.discordapp.net/attachments/1114899280021430313/1115019028247883786/Developers_Earth_Logo_PNG.png?width=480&height=480` })
      .setDescription(`Buraya Mesaj raysus`)
      .setFooter({ text: `Alpha Graphic Art ® 1999` })
.setColor("#7f00ff")
.setImage("https://cdn.discordapp.com/attachments/1114899280021430313/1115019351771336784/DevelopersEarthEmbedAlt.png")
      const ticketimage = new Discord.EmbedBuilder()
      .setColor("#7f00ff")
.setImage("https://media.discordapp.net/attachments/1114899280021430313/1115019229889036319/KB_Tcket.png")
      const ticketacbuton = new Discord.ActionRowBuilder()
			.addComponents(
				new Discord.ButtonBuilder()
					.setCustomId(`ticketAc_${guild.id}`)
					.setLabel('Destek talebi oluştur.')
          .setEmoji("📨")
					.setStyle(Discord.ButtonStyle.Secondary)
			);
      
      const category = await guild.channels.create({
        name: 'Ticket Log',
        type: Discord.ChannelType.GuildCategory,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [Discord.PermissionsBitField.Flags.ViewChannel],
          },
        ],
      });
      
      const ticketLog = await guild.channels.create({
        name: 'ticket-log',
        type: Discord.ChannelType.GuildText,
        parent: category.id,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [Discord.PermissionsBitField.Flags.ViewChannel],
          },
        ],
      });
      
      db.set(`ticketKatagor_${guild.id}`, { category:  category.id, log: ticketLog.id });
      db.set(`ticketSistem_${guild.id}`, { isOpen: true });
      
      return interaction.channel.send({ embeds: [ticketimage, ticketac], components: [ticketacbuton] })
    }
  }

  if(interaction.customId === `ticketAc_${interaction.guild.id}`) {
      
    const ticketKatagor = db.fetch(`ticketKatagor_${guild.id}`);
    const ticketSistem = db.fetch(`ticketSistem_${guild.id}`);
    const ticketKullanıcı = db2.fetch(`ticketKullanıcı_${user.id}${guild.id}`);
    
    if(!ticketSistem) return;
    if(!ticketKatagor) return;
    
    if(ticketKullanıcı) {
      const channelURL = `https://discord.com/channels/${ticketKullanıcı.guildId}/${ticketKullanıcı.channelId} `
      return interaction.reply({ content: `Zaten bir tane [destek kanalı](${channelURL}) oluşturmuşssun.`, ephemeral: true })
    }
    
    const channel = await guild.channels.create({
      name: `ticket-${user.username}`,
      type: Discord.ChannelType.GuildText,
      parent: ticketKatagor.category,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [Discord.PermissionsBitField.Flags.ViewChannel],
        },
         {
          id: user.id,
          allow: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.SendMessages],
        },
      ],
    });

    db2.set(`ticketKullanıcı_${user.id}${guild.id}`, { isTicketAc: true, channelId: channel.id, guildId: guild.id, date: Date.now() });
    db2.set(`ticketKanalKullanıcı_${channel.id}${guild.id}`, { userId: user.id, channelId: channel.id, guildId: guild.id });
    
    const channelURL = `https://discord.com/channels/${guild.id}/${channel.id} `
    
    const ticketUserEmbed = new Discord.EmbedBuilder()
    .setAuthor({ name: `${user.username} | Destek açıldı`, iconURL: `https://media.discordapp.net/attachments/1114899280021430313/1115019028247883786/Developers_Earth_Logo_PNG.png?width=480&height=480` })
    .setThumbnail(guild.iconURL({ dynmaic: true }))
    .addFields([
      {
        name: "Destek açan:",
        value: `${interaction.user}`,
        inline: true
      },
      {
        name: "Açılış zamanı:",
        value: `<t:${parseInt(channel.createdTimestamp / 1000)}:R>`,
        inline: true
      }
    ])
    .setFooter({ text: `Alpha Graphic Art ® 1999` })    
    .setTimestamp()
.setColor("#7f00ff")
.setImage("https://cdn.discordapp.com/attachments/1114899280021430313/1115019351771336784/DevelopersEarthEmbedAlt.png")
      const ticketimage = new Discord.EmbedBuilder()
      .setColor("#7f00ff")
.setImage("https://media.discordapp.net/attachments/1114899280021430313/1115019229889036319/KB_Tcket.png")
    
    const row = new Discord.ActionRowBuilder()
    .addComponents(
      new Discord.ButtonBuilder()
        .setCustomId(`ticketKapat_${guild.id}${channel.id}`)
        .setLabel('Talebi kapat')
        .setEmoji("❌")
        .setStyle(Discord.ButtonStyle.Secondary),
    );
    
    interaction.reply({ content: `**[Destek kanalın](${channelURL}) oluşturuldu.**`, ephemeral: true })
    const chnlMessage = await channel.send({content: "Yetkililer en kısa zamanda sizinle ilgilenecektir.", embeds: [ticketimage, ticketUserEmbed], components: [row] })
    
    return chnlMessage.pin()
  }

  if(customId === `ticketKapat_${guild.id}${interaction.channel.id}`) {
      
    const ticketKullanıcı = db2.fetch(`ticketKanalKullanıcı_${interaction.channel.id}${guild.id}`);
    if(!ticketKullanıcı) {
        return interaction.channel.delete();
    }

    if(ticketKullanıcı) {
      member = await client.users.cache.get(ticketKullanıcı.userId);
      
      const channel = await client.channels.cache.get(db.fetch(`ticketKatagor_${guild.id}`).log)
    
    const ticketUserClose = new Discord.EmbedBuilder()
    .setAuthor({ name: `${client.user.username} | Ticket Log`, iconURL: `https://media.discordapp.net/attachments/1114899280021430313/1115019028247883786/Developers_Earth_Logo_PNG.png?width=480&height=480` })
    .setDescription(`${member.tag} tarafından açılan destek <t:${parseInt(Date.now() / 1000)}:R> sonlandırıldı`)
    .setThumbnail(user.displayAvatarURL({ dynmaic: true }))
    .addFields([
      {
        name: "Açılış tarihi:",
        value: `<t:${parseInt((ticketKullanıcı.date ?? Date.now()) / 1000)}:R>`,
        inline: true
      },
      {
        name: "Açan kişi:",
        value: `${codeBlock("yaml", member.tag)}`,
        inline: true
      },
      { name: '\u200B', value: '\u200B' },
      {
        name: "Kapanış tarihi:",
        value: `<t:${parseInt(Date.now() / 1000)}:R>`,
        inline: true
      },
      {
        name: "Kapatan kişi:",
        value: `${codeBlock("yaml", user.tag)}`,
        inline: true
      }
    ])
    .setColor("#7f00ff")
.setImage("https://cdn.discordapp.com/attachments/1114899280021430313/1115019351771336784/DevelopersEarthEmbedAlt.png")
    channel.send({ embeds: [ticketUserClose] })
      
     db2.delete(`ticketKullanıcı_${ticketKullanıcı.userId}${guild.id}`)
     db2.delete(`ticketKanalKullanıcı_${interaction.channel.id}${guild.id}`); 
      
      return interaction.channel.delete();
    }
    
    
  }

  if(interaction.isChatInputCommand()) {
    if (!interaction.guildId) return;
    readdirSync('./commands').forEach(f => {
      const cmd = require(`../commands/${f}`);
      if(interaction.commandName.toLowerCase() === cmd.name.toLowerCase()) {
        return cmd.run(client, interaction, db);
      }
});
}
  }

