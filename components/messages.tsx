import { User } from "lucide-react";
import { type MessageModel } from "@/types";
import Markdown from "react-markdown";
import Attachment from "@/components/attachment";
import { formatTimestamp } from "@/lib/format";

export function MessageList({ messages }: { messages: MessageModel[] }) {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className="flex items-start space-x-3 rounded-md border p-3 bg-white shadow-sm"
        >
          {message.author.avatar ? (
            <img
              src={message.author.avatar}
              alt={message.author.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <User />
          )}
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold">{message.author.name}</span>
              <span className="text-xs text-gray-400">{message.time !== "" && formatTimestamp(Number(message.time))}</span>
              {message.tts && <span className="text-sm font-bold">🔊</span>}
            </div>
            <div className="text-gray-700">{<Markdown>{message.content}</Markdown>}</div>
            {message.attachments.length > 0 && (
              <div className="mt-2 flex space-x-3">
                {message.attachments.map((item, index) => (
                  <div
                    key={index}
                  >
                    {Attachment(item)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;