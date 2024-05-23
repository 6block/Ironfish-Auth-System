import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletToken, WalletTokenSchema } from 'src/schemas/walletToken.schema';
import { WalletService } from './wallet.service';
import { HttpModule } from '@nestjs/axios';
import { WalletController } from 'src/wallet/wallet.controller';
import { RpcClientService } from 'src/rpc/rpc.service';
import { CleanupService } from 'src/schedule/cleanup.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: WalletToken.name, schema: WalletTokenSchema }], 'iron_auth'),
    HttpModule,
  ],
  controllers: [WalletController],
  providers: [WalletService, RpcClientService, CleanupService],
})
export class WalletModule {}
