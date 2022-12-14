export class RobotBO {
    robotUsername: string
    robotNickname: string
    serverId: string
    serverName: string
    channelId: string
    channelName: string
    webhook: string
    key: string
    constructor(robotUsername: string, robotNickname: string, serverId: string, channelId: string, serverName: string, channelName: string, key: string) {
        this.robotUsername = robotUsername
        this.robotNickname = robotNickname
        this.serverId = serverId
        this.serverName = serverName
        this.channelId = channelId
        this.channelName = channelName
        this.key = key
    }
}