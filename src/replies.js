import { reply, audio } from 'alice-renderer'
import Mikrotik from './mikrotik.js'
import blockPcOverMesh from './meshcentral.js'
import Logger from 'loggee'
import dotenv from 'dotenv';

dotenv.config()

const logger = Logger.create()

//Создание нового экземпляра устройства const mk = new Mikrotik("host", "port", "user", "password");
const mk1 = new Mikrotik(
  process.env.MK1_IP,
  process.env.MK1_PORT,
  process.env.MK1_LOGIN,
  process.env.MK1_PASS
)
const mk2 = new Mikrotik(
  process.env.MK2_IP,
  process.env.MK2_PORT,
  process.env.MK2_LOGIN,
  process.env.MK2_PASS
)
const mk3 = new Mikrotik(
  process.env.MK3_IP,
  process.env.MK3_PORT,
  process.env.MK3_LOGIN,
  process.env.MK3_PASS
)
const mk4 = new Mikrotik(
  process.env.MK4_IP,
  process.env.MK4_PORT,
  process.env.MK4_LOGIN,
  process.env.MK4_PASS
)
const mk5 = new Mikrotik(
  process.env.MK5_IP,
  process.env.MK5_PORT,
  process.env.MK5_LOGIN,
  process.env.MK5_PASS
)
const mk6 = new Mikrotik(
  process.env.MK6_IP,
  process.env.MK6_PORT,
  process.env.MK6_LOGIN,
  process.env.MK6_PASS
)

export default function (req) {
  return req ? executeCommand(req) : welcome()
}

async function welcome () {
  const res = await mk1.exec()
  console.log('%creplies.js line:16 res', 'color: #007acc;', res)
  return reply.end`
  Привет!
  ${res}
  `
}

async function updateAll () {
  await mk3.update()
  await mk2.update()
  await mk6.update()
  await mk5.update()
  await mk4.update()
  await mk1.update()
}

async function executeCommand (req) {
  switch (req) {
    case 'включить гостевой wi-fi':
      try {
        await mk1.exec('/interface/wireless/enable wlan3')
        return reply.end`${audio('sounds-game-win-1')}
        Гостевой Wi Fi включен. Напомню, имя сети 79 Guest, без пароля`
      } catch (err) {
        logger.error("Ошибка выполнения команды. ERROR: " + err)
        return reply.end`Что-то пошло не так, подробности смотрите в журналах`
      }
    case 'выключить гостевой wi-fi':
      try {
        await mk1.exec('/interface/wireless/disable wlan3')
        return reply.end`Гостевой Wi Fi выключен`
      } catch (err) {
        logger.error("Ошибка выполнения команды. ERROR: " + err)
        return reply.end`Что-то пошло не так, подробности смотрите в журналах`
      }
    case 'перезагрузить роутер':
      try {
        mk1.reboot()
        return reply.end`Роутер отправлен в перезагрузку`
      } catch (err) {
        logger.error("Ошибка выполнения команды. ERROR: " + err)
        return reply.end`Что-то пошло не так, подробности смотрите в журналах`
      }
    case 'обновить сетевые устройства':
      try {
        updateAll()
        return reply.end`Начат процесс обновления сетевых устройств`
      } catch (err) {
        logger.error("Ошибка выполнения команды. ERROR: " + err)
        return reply.end`Что-то пошло не так, подробности смотрите в журналах`
      }
    case 'заблокировать компьютер':
      try {
        blockPcOverMesh()
        return reply.end`нет проблем`
      } catch (err) {
        logger.error("Ошибка выполнения команды. ERROR: " + err)
        return reply.end`Что-то пошло не так, подробности смотрите в журналах`
      }
    default:
      return reply.end`я вас не поняла`
  }
}
