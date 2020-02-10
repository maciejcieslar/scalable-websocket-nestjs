import { Injectable } from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { Server } from 'socket.io';

import { RedisService } from '@app/shared/redis/redis.service';
import { SocketStateService } from '@app/shared/socket-state/socket-state.service';

import { RedisSocketEventEmitDTO } from './dto/socket-event-emit.dto';
import { RedisSocketEventSendDTO } from './dto/socket-event-send.dto';
import {
  REDIS_SOCKET_EVENT_EMIT_ALL_NAME,
  REDIS_SOCKET_EVENT_EMIT_AUTHENTICATED_NAME,
  REDIS_SOCKET_EVENT_SEND_NAME,
} from './redis-propagator.constants';

@Injectable()
export class RedisPropagatorService {
  private socketServer: Server;

  public constructor(
    private readonly socketStateService: SocketStateService,
    private readonly redisService: RedisService,
  ) {
    this.redisService
      .fromEvent(REDIS_SOCKET_EVENT_SEND_NAME)
      .pipe(tap(this.consumeSendEvent))
      .subscribe();

    this.redisService
      .fromEvent(REDIS_SOCKET_EVENT_EMIT_ALL_NAME)
      .pipe(tap(this.consumeEmitToAllEvent))
      .subscribe();

    this.redisService
      .fromEvent(REDIS_SOCKET_EVENT_EMIT_AUTHENTICATED_NAME)
      .pipe(tap(this.consumeEmitToAuthenticatedEvent))
      .subscribe();
  }

  public injectSocketServer(server: Server): RedisPropagatorService {
    this.socketServer = server;

    return this;
  }

  private consumeSendEvent = (eventInfo: RedisSocketEventSendDTO): void => {
    const { userId, event, data, socketId } = eventInfo;

    return this.socketStateService
      .get(userId)
      .filter((socket) => socket.id !== socketId)
      .forEach((socket) => socket.emit(event, data));
  };

  private consumeEmitToAllEvent = (
    eventInfo: RedisSocketEventEmitDTO,
  ): void => {
    this.socketServer.emit(eventInfo.event, eventInfo.data);
  };

  private consumeEmitToAuthenticatedEvent = (
    eventInfo: RedisSocketEventEmitDTO,
  ): void => {
    const { event, data } = eventInfo;

    return this.socketStateService
      .getAll()
      .forEach((socket) => socket.emit(event, data));
  };

  public propagateEvent(eventInfo: RedisSocketEventSendDTO): boolean {
    if (!eventInfo.userId) {
      return false;
    }

    this.redisService.publish(REDIS_SOCKET_EVENT_SEND_NAME, eventInfo);

    return true;
  }

  public emitToAuthenticated(eventInfo: RedisSocketEventEmitDTO): boolean {
    this.redisService.publish(
      REDIS_SOCKET_EVENT_EMIT_AUTHENTICATED_NAME,
      eventInfo,
    );

    return true;
  }

  public emitToAll(eventInfo: RedisSocketEventEmitDTO): boolean {
    this.redisService.publish(REDIS_SOCKET_EVENT_EMIT_ALL_NAME, eventInfo);

    return true;
  }
}
