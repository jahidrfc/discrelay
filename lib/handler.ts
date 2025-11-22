import type { Updater } from "use-immer";
import type { AttachmentModel, DataModel } from "@/types";
import type { OmitPartialGroupDMChannel, Message, TextChannel, ThreadChannel } from "discord.js";
import { getAttachmentType } from "@/lib/attachment";
import { DefaultEventsMap, Server } from "socket.io";

export const updateHandler = (
  setData: Updater<DataModel>,
  updates: DataModel
) => {
  setData(draft => {
    Object.keys(updates).forEach(guildId => {
      if (!draft[guildId]) {
        draft[guildId] = { ...updates[guildId]! };
      } else {
        Object.keys(updates[guildId]?.channels!).forEach(channelId => {
          if (!draft[guildId]?.channels[channelId]) {
            draft[guildId]!.channels[channelId] = { ...updates[guildId]?.channels[channelId]! };
          } else {
            draft[guildId]!.channels[channelId]!.messages.push(
              ...updates[guildId]!.channels[channelId]!.messages
            );
          }
        });
      }
    });
  });
};

export const messageHandler = (message: OmitPartialGroupDMChannel<Message<boolean>>, io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
  if (message.guildId === null) {
    return;
  }
  const attachments: AttachmentModel[] = [];
  message.attachments.forEach((attachment) => {
    attachments.push({
      name: attachment.name,
      type: getAttachmentType(attachment.contentType ? attachment.contentType : "text/plain"),
      url: attachment.url,
      size: attachment.size.toString()
    });
  });

  let channel = {
    name: (message.channel as TextChannel).name,
    id: message.channelId
  };
  let category = (message.channel as TextChannel).parent?.name ?? "";

  let thread = {
    name: "",
    id: ""
  };

  if (message.channel.isThread()) {
    thread = {
      name: message.channel.name,
      id: message.channelId
    };
    channel = {
      name: message.channel.parent?.name ?? "",
      id: message.channel.parentId ?? ""
    };
    category = (message.channel as ThreadChannel).parent?.parent?.name ?? "";
  };

  const data: DataModel = {
    [message.guildId]: {
      meta: {
        name: message.guild?.name ?? "",
        url: message.guild?.iconURL({ forceStatic: true }) ?? ""
      },
      channels: {
        [channel.id]: {
          meta: {
            name: channel.name,
            category: category
          },
          messages: [{
            id: message.id,
            author: {
              bot: message.author.bot,
              id: message.author.id,
              name: message.author.displayName,
              username: message.author.username,
              avatar: message.author.avatarURL({ forceStatic: true }) ?? ""
            },
            content: message.cleanContent,
            time: message.createdTimestamp.toString(),
            thread: thread,
            attachments: attachments,
            system: message.system,
            pinned: message.pinned,
            tts: message.tts
          }]
        }
      }
    }
  };

  io.emit("updates", JSON.stringify(data));
};