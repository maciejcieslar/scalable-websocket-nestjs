import { INestApplication } from '@nestjs/common';

import { RedisPropagatorService } from '@app/shared/redis-propagator/redis-propagator.service';
import { SocketStateAdapter } from '@app/shared/socket-state/socket-state.adapter';
import { SocketStateService } from '@app/shared/socket-state/socket-state.service';

export const initAdapters = (app: INestApplication): INestApplication => {
  const socketStateService = app.get(SocketStateService);
  const redisPropagatorService = app.get(RedisPropagatorService);

  app.useWebSocketAdapter(new SocketStateAdapter(app, socketStateService, redisPropagatorService));

  return app;
};
