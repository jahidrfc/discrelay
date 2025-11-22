import { AttachmentType } from "@/types";

export const getAttachmentType = (contentType: string): AttachmentType => {
    const [type] = contentType.split('/');
    switch (type) {
        case "image": {
            return AttachmentType.Image;
        };
        case "video": {
            return AttachmentType.Video;
        };
        case "audio": {
            return AttachmentType.Audio;
        };
        case "application": {
            return AttachmentType.Document;
        };
        case "text": {
            return AttachmentType.Text;
        };
        default: {
            return AttachmentType.Document;
        };
    };
};