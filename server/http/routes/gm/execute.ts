import { Request, Response } from "express";
import Gameserver from "../../../tcp/Gameserver";

export default function handler(req: Request, res: Response) {
    const { session_id, cmd } = req.query
    const session = Gameserver.getInstance().sessions.get(Array.isArray(session_id) ? session_id.pop() as string : session_id as string)

    if(!cmd||!session) {
        return res.status(400).json({ retcode: 1, msg: "Invalid parameter!" })
    }
    
    let args = (cmd as string).split(' ') || []
    const command = args.shift()

    import(__dirname + `/../../../commands/${command}`).then(async r => {
        await r.default(session, ...args);
    }).then(() => {
        return res.status(200).json({ retcode: 0, msg: "Success!" })
    }).catch(err => {
        return res.status(400).json({ retcode: 2, msg: typeof err === 'string' ? err : "Command failed to execute!" })
    })
}