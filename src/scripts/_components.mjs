import { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js'

function streamerData(iconUrl, sreamTitle, streamUrl, atividade) {
    return new EmbedBuilder()
        .setURL(streamUrl)
        .setTitle(sreamTitle)
        .setDescription('Fabin ta no ' + atividade)
        .setThumbnail(iconUrl)
}

function linkButton(url) {
    return new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setEmoji('<:twitchIcon1:1135021544863703050>')
                .setLabel('Assistir')
                .setURL(url)
        )
}

export {
    streamerData,
    linkButton
}