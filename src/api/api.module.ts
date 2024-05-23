import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { RpcClientService } from 'src/rpc/rpc.service';

@Module({
  controllers: [ApiController],
  providers: [ApiService, RpcClientService],
})
export class ApiModule {}
