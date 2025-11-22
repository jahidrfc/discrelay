export enum AttachmentType {
    Image,
    Video,
    Audio,
    Document,
    Text
};

export interface AttachmentModel {
    name: string;
    type: AttachmentType;
    url: string;
    size: string;
};

export interface AuthorModel {
    bot: boolean;
    id: string;
    name: string;
    username: string;
    avatar: string;
};

export interface ThreadModel {
    name: string;
    id: string;
};

export interface MessageModel {
    id: string;
    author: AuthorModel;
    content: string;
    time: string;
    thread: ThreadModel;
    attachments: AttachmentModel[];
    system: boolean;
    pinned: boolean;
    tts: boolean;
};

export interface ChannelModel {
    [channelId: string]: {
        meta: {
            name: string;
            category: string;
        };
        messages: MessageModel[];
    };
};

export interface GuildModel {
    meta: {
        name: string;
        url: string;
    };
    channels: ChannelModel;
};

export interface ActiveModel {
    guildId: string;
    channelId: string;
    threadId: string;
    selectedId: string;
};

export interface DataModel {
    [guildId: string]: GuildModel;
};
