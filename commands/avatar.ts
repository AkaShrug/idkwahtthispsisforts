import { Socket } from "net";
import GameServer from "../server/GameServer";
import Avatar, { Avatar as AvatarSchema, assignAllAvatar, assignAvatar, removeAvatar } from "../mongodb/Model/Avatar";
import GetAvatarDataReq from "../server/packetsHandler/GetAvatarDataReq";
import GetEquipmentDataReq from "../server/packetsHandler/GetEquipmentDataReq";

export default async (socket: Socket, args: string[]) => {
    const session = GameServer.getInstance().sessions.get(`${socket.remoteAddress}:${socket.remotePort}`)
    const avatars = session?.avatars

    if(!avatars||!session.user) return
    if(isNaN(parseInt(args[2]))&&args[1]!=="giveall") return
    
    switch (args[1]) {
        case "giveall":
            await assignAllAvatar(session.user.uid)
            break
        default:
            try {
                await assignAvatar(parseInt(args[2]), session.user.uid)
            } catch (error) {
                console.error(error)
            }
            break
    }

    session.avatars = await Avatar.find({
        userUid: session.user.uid
    }).toArray()

    await GetEquipmentDataReq(socket, { materialIdList: [0], mechaUniqueIdList: [0], stigmataUniqueIdList: [0], weaponUniqueIdList: [0] })
    GetAvatarDataReq(socket, { avatarIdList: [0] })
}
