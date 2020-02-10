import { RedisSocketEventEmitDTO } from './socket-event-emit.dto';

export class RedisSocketEventSendDTO extends RedisSocketEventEmitDTO {
  public readonly userId: string;
  public readonly socketId: string;
}
