import SSH2Promise from "ssh2-promise";
import Logger from 'loggee';

const logger = Logger.create()

async function execuation(command) {
    const sshconfig = this.sshconf
    const ssh = new SSH2Promise(sshconfig)
    if (command) {
        try {
            let result = await ssh.exec(command)
            ssh.close()
            if (result == "") {
              return true
            } else {
              throw result
            }
        } catch (err) {
            ssh.close()
            throw err
        }
    }
    else {
        try {
            await ssh.connect()
            ssh.close()
            return "Тестовое соединение установлено";
        } catch (err) {
            ssh.close()
            return `Ошибка соединения: ${err}`;
        }
    }
}

async function reboot () {
    setTimeout(() => this.exec(":execute {/system reboot;}"), 3000);
}

async function update () {
    let command = "{/system/routerboard/settings/set auto-upgrade=yes;"
    command += '/system/package/update/set channel=stable;'
    command += '/system/package/update/check-for-updates;'
    command += ':if ( [/system/package/update/get status] = "New version is available" ) do={ /system scheduler add interval=10s name=autoreboot on-event=":if ( [/log find buffer=memory message=\\"please reboot router to run new firmware\\"]) do={ /system/scheduler/remove autoreboot; /system reboot }" policy=reboot,read,write start-time=startup; /system/package/update/install }};'
    await this.exec(command)
}

export default function (host, port, user, password) {
    this.sshconf = {}
    this.sshconf.host = host;
    this.sshconf.port = port;
    this.sshconf.username = user;
    this.sshconf.password = password;
    this.exec = execuation
    this.reboot = reboot
    this.update = update
}
