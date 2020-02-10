import { UseInterceptors } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RedisPropagatorInterceptor } from '@app/shared/redis-propagator/redis-propagator.interceptor';

@UseInterceptors(RedisPropagatorInterceptor)
@WebSocketGateway()
export class EventsGateway {
  @SubscribeMessage('events')
  public findAll(): Observable<any> {
    return from([1, 2, 3]).pipe(
      map((item) => {
        return { event: 'events', data: item };
      }),
    );
  }
}
