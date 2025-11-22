// bot.ts
import { Client, GatewayIntentBits, Message, type OmitPartialGroupDMChannel } from "discord.js";
import { messageHandler } from "@/lib/handler";
import { DefaultEventsMap, Server } from "socket.io";

export const botInit = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent
        ]
    });

    client.once("clientReady", (client: Client<true>) => {
        console.log(`Logged in as ${client.user.tag}`);
    });

    client.on("messageCreate", (message: OmitPartialGroupDMChannel<Message<boolean>>) => {
        messageHandler(message, io);
    });

    client.login(Bun.env.DISCORD_BOT_TOKEN);
};

export default botInit;
