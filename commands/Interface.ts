import { createInterface, Interface as readlineInterface } from "readline";
import GameServer from "../server/GameServer";
import Session from "../server/Session";
import logger from '../util/logger'

export default class Interface{
    private target: Session|undefined
    public readonly rl: readlineInterface
    private static instance: Interface
    
    private constructor() {
        this.rl = createInterface({
            input: process.stdin,
            output: process.stdout
        })
    }

    public static getInstance(): Interface {
        if(!Interface.instance) Interface.instance = new Interface()
        return Interface.instance
    }

    public start(){
        this.rl.question("", async (cmd) => {
            if (!cmd) {
                return Interface.getInstance().start()
            }

            const args = cmd.split(' ')

            if(args[0].toLowerCase()==='exit'){
                console.log("Thanks for using!")
                process.exit(0)
            }

            if(args[0].toLowerCase()==='target'){
                if(!args[1]){
                    const keys = Array.from(GameServer.getInstance().sessions.keys())
                    if(keys.length<1){
                        console.log('No target found!')
                    }
                    keys.map((key) => {
                        console.log(key)
                    })
                    return Interface.getInstance().start()
                }
                this.target = GameServer.getInstance().sessions.get(Array.from(GameServer.getInstance().sessions.keys()).map(key=>key.includes(args[1])?key:"")[0])
                return Interface.getInstance().start()
            }

            if(!this.target){
                logger('Invalid target!', 'danger', 'CMD')
                return Interface.getInstance().start()
            }

            if(cmd[0].toLowerCase()==='target')return Interface.getInstance().start()

            await import(`./${args[0].toLowerCase()}`).then(async r => {
                await r.default(this.target?.socket, args);
            }).catch(() => {
                logger('Invalid command!', 'danger', 'CMD')
            })
            return Interface.getInstance().start()
        })
        this.rl.on('close', () => {
            console.log("Thanks for using!")
            process.exit(0)
        })
    }
}