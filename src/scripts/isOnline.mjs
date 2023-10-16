import axios from 'axios'
import { Client, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel } from 'discord.js'
import dotenv from 'dotenv'
import { linkButton, streamerData } from './_components.mjs'
dotenv.config()

const endpoint = 'https://decapi.me/twitch/uptime/'
const iconEndpoint = 'https://decapi.me/twitch/avatar/'
const titleEndpoint = 'https://decapi.me/twitch/status/'
const gameEndpoint = 'https://decapi.me/twitch/game/'

const { STREAMER, NOTIFICATIONS_CHANNEL, NOTIFICATIONS_GUILD } = process.env

var [_online_, _notified_] = [false, false]


/**
 * Starts checkin when a streamre is online
 * @param {String} streamer 
 * @param {Client} bot 
 */
async function checkUptime(streamer = STREAMER, bot) {
    try {
        const { data } = await axios.get(endpoint + streamer)

        if (data.includes('offline')) {
            _online_ = false
            _notified_ = false

            await deleteEvent(bot)
        } else {

            if (!_notified_) {
                _notified_ = true
                _online_ = true

                await sendMessages(streamer, bot)
            }

        }

        setTimeout(() => {
            return checkUptime(streamer, bot)
        }, 5000);
    } catch (err) {
        console.log(err)
        console.error('Streamer does not exists.')
    }
}

/**
 * 
 * @param {Client} bot 
 */
async function sendMessages(streamer, bot) {
    const guild = await bot.guilds.fetch(NOTIFICATIONS_GUILD)

    const channel = await guild.channels.fetch(NOTIFICATIONS_CHANNEL)

    const { data: streamerIcon } = await axios.get(iconEndpoint + streamer)
    const { data: streamTitle } = await axios.get(titleEndpoint + streamer)
    const { data: streamGame } = await axios.get(gameEndpoint + streamer)

    const streamUrl = 'https://twitch.tv/' + streamer

    await guild.scheduledEvents.create({
        name: 'Stream ta on!',
        privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
        scheduledStartTime: Date.now() + 10 * 1000,
        scheduledEndTime: Date.now() + 60 * 60 * 1000 * 24,
        entityType: GuildScheduledEventEntityType.External,
        entityMetadata: { location: streamUrl },
        image: streamerIcon,
        reason: "Entra la e deixa seu apoio da um salve!"
    })

    await channel.send({
        content: `||@everyone||`,
        embeds: [
            streamerData(streamerIcon, streamTitle, streamUrl, streamGame)
        ],
        components: [
            linkButton(streamUrl)
        ]
    })
}

/**
 * 
 * @param {Client} bot 
 */
async function deleteEvent(bot) {
    const guild = await bot.guilds.fetch(NOTIFICATIONS_GUILD)

    const events = await guild.scheduledEvents.fetch()

    try {
        await events.first().delete()
    } catch (err) {

    }
}

export default checkUptime