import {promisify} from 'util';
import micro from 'micro';
import { createError } from 'micro';
import Logger from 'loggee';
import replies from './replies.js';

const server = micro(async req => {
  const {request, session, version} = await micro.json(req);
  console.log('%cserver.js line:8 request', 'color: #007acc;', request);
  console.log('%cserver.js line:9 session', 'color: #007acc;', session);
  console.log('%cserver.js line:10 version', 'color: #007acc;', version);
  if (session.skill_id !== process.env.YA_SKILL_ID) {
    throw createError(403, 'Access denied');
  }
  const response = await replies(request.command);
  response.end_session = true;
  log(session, request.command, response.text, request.type);
  return {version, session, response};
});

function log(session, userText, botText, requestType) {
  const logger = Logger.create(`User ${session.user_id.slice(0, 6)}, type: ${requestType}`);
  logger.log(`-> "${userText}"`);
  logger.log(`<- "${botText}"`);
}

server.listen = promisify(server.listen);
server.close = promisify(server.close);

export default server;
