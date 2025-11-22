import { AttachmentType, type AttachmentModel } from "@/types";
import { formatFileSize } from "@/lib/format";

export function Attachment(attachment: AttachmentModel) {
  switch (attachment.type) {
    case AttachmentType.Image:
      return (<div>
        <img src={attachment.url} />
      </div>);
    case AttachmentType.Video:
      return (
        <video src={attachment.url} controls className="max-w-full rounded-md" />
      );
    case AttachmentType.Audio:
      return (
        <audio src={attachment.url} controls className="w-full" />
      );
    case AttachmentType.Document:
    case AttachmentType.Text:
    default:
      return (
        <a
          href={attachment.url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2 py-1 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition"
        >
          <div>
            <div>📎{attachment.name}</div>
            <div>{formatFileSize(Number(attachment.size))}</div>
          </div>
        </a>
      );
  };
};

export default Attachment;