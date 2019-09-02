import WebSocket from 'ws'
import * as crypto from 'crypto'
import Logger from 'loggee'
import dotenv from 'dotenv';

dotenv.config()

const logger = Logger.create()

function encodeCookie (o, key) {
  try {
    if (key == null) {
      return null
    }
    o.time = Math.floor(Date.now() / 1000) // Add the cookie creation time
    const iv = Buffer.from(crypto.randomBytes(12), 'binary'),
      cipher = crypto.createCipheriv('aes-256-gcm', key.slice(0, 32), iv)
    const crypted = Buffer.concat([
      cipher.update(JSON.stringify(o), 'utf8'),
      cipher.final()
    ])
    return Buffer.concat([iv, cipher.getAuthTag(), crypted])
      .toString('base64')
      .replace(/\+/g, '@')
      .replace(/\//g, '$')
  } catch (e) {
    return null
  }
}

export default function () {
  const loginKey = process.env.MESH_LOGINKEY
  let url = process.env.MESH_URL

  // Cookie authentication
  let ckey = null
  let loginCookie = null
  if (loginKey != null) {
    // User key passed in as argument hex
    if (loginKey.length != 160) {
      loginCookie = loginKey
    }
    ckey = Buffer.from(loginKey, 'hex')
    if (ckey.length != 80) {
      ckey = null
      loginCookie = loginKey
    }
  }

  if (ckey != null) {
    let domainid = process.env.MESH_DOMAIN_ID
    let username = process.env.MESH_USERNAME
    url +=
      '?auth=' +
      encodeCookie(
        { userid: 'user/' + domainid + '/' + username, domainid: domainid },
        ckey
      )
  } else {
    if (loginCookie != null) {
      url += '?auth=' + loginCookie
    }
  }

  const ws = new WebSocket(url)
  ws.on('open', function open () {
      ws.send(
      JSON.stringify({
        action: 'runcommands',
        nodeids: [process.env.MESH_NODE_ID],
        type: 0,
        cmds: 'Rundll32.exe user32.dll,LockWorkStation',
        responseid: 'meshctrl',
        runAsUser: 2
      })
    )
    ws.close()
  })
}
