import { Injectable, OnModuleInit } from '@nestjs/common';
import { IronfishSdk } from '@ironfish/sdk';

@Injectable()
export class RpcClientService implements OnModuleInit {
  public client: any;

  async onModuleInit() {
    const sdk = await IronfishSdk.init();
    this.client = await sdk.connectRpc(false, true);
  }
}
