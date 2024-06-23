import { TIOServer, TServerSocket } from "src/types";
import { MongoAPI } from "src/Mongo/API";

export const registerUtilEvents = (io: TIOServer, socket: TServerSocket) => {
    socket.on("requestUsersList", async (userSearch, cb) => {
        const users = await MongoAPI.getUsersFuzzy(userSearch, true)
        const usernames = users.map(user => user.username)
        cb(usernames)
    })
}
