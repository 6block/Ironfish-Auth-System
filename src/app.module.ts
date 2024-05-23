import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { mongodbUri, mongodbConfig } from './config/config.mongodb';
import { RpcClientModule } from './rpc/rpc.module';
import { WalletModule } from './wallet/wallet.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [
    MongooseModule.forRoot(mongodbUri, mongodbConfig),
    ScheduleModule.forRoot(),
    WalletModule,
    RpcClientModule,
    ApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
