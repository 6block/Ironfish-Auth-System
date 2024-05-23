import { Module } from '@nestjs/common';
import { RpcClientService } from './rpc.service';

@Module({
  providers: [RpcClientService],
  exports: [RpcClientService],
})
export class RpcClientModule {}
