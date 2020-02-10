import { Module } from '@nestjs/common'
import { SocketStateService } from './socket-state.service'

@Module({
  providers: [SocketStateService],
  exports: [SocketStateService],
})
export class SocketStateModule {}
