import { SharePayLoad, ShareResponse } from "@/types/share.type";
import http from "./api.service";

const shareApi = {
    internalShare: async(payload: SharePayLoad): Promise<ShareResponse> => {
        const { data } = await http.post("/share/internal", payload);
        return data.share
    }
}

export default shareApi;