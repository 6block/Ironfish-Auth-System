import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RpcClientService } from 'src/rpc/rpc.service';

@Injectable()
export class ApiService {
  constructor(private readonly rpcClientService: RpcClientService) {}

  async apiRequest(method: string, params: Record<string, any>): Promise<any> {
    try {
      const response = await this.rpcClientService.client.request(method, params).waitForEnd();
      return {
        respose: response,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.response.stream.error.codeMessage);
    }
  }
}
