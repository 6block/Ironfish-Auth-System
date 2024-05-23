import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RpcClientService } from 'src/rpc/rpc.service';
import { WalletToken } from 'src/schemas/walletToken.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(WalletToken.name)
    private walletModel: Model<WalletToken & Document>,
    private readonly rpcClientService: RpcClientService,
  ) {}

  async createToken() {
    let token: string;
    let existingToken: WalletToken;

    do {
      token = uuidv4();
      existingToken = await this.walletModel.findOne({ token });
    } while (existingToken);

    const newToken = new this.walletModel({ token, addresses: [], lastActive: Date.now() });
    await newToken.save();
    return { message: 'Create new token successfully', token: newToken.token };
  }

  async findToken(token: string): Promise<WalletToken> {
    const tokenDoc = await this.walletModel.findOneAndUpdate({ token }, { lastActive: Date.now() }, { new: true });
    return tokenDoc;
  }

  async getAllTokens(): Promise<WalletToken[]> {
    return this.walletModel.find().exec();
  }

  async deleteToken(token: string): Promise<void> {
    await this.walletModel.deleteOne({ token });
  }

  async getAddresses(token: string) {
    const existingToken = await this.findToken(token);
    if (!existingToken) {
      throw new UnauthorizedException('Invalid token');
    }
    try {
      const addresses = existingToken.addresses;
      return { token: token, addresses: addresses, lastActive: existingToken.lastActive };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async importAddress(
    token: string,
    address: string,
    viewKey: string,
    incomingViewKey: string,
    outgoingViewKey: string,
  ) {
    const existingToken = await this.findToken(token);
    if (!existingToken) {
      throw new UnauthorizedException('Invalid token');
    }

    if (existingToken.addresses.includes(address)) {
      throw new ConflictException('Address already exists');
    }

    try {
      await this.rpcClientService.client
        .request('wallet/importAccount', {
          account: {
            publicAddress: address,
            name: address,
            viewKey: viewKey,
            incomingViewKey: incomingViewKey,
            outgoingViewKey: outgoingViewKey,
          },
        })
        .waitForEnd();
      existingToken.addresses.push(address);
      const updatedToken = await existingToken.save();
      return {
        message: 'Address import successfully',
        addresss: updatedToken.addresses,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.response.stream.error.codeMessage, 'Failed to import address');
    }
  }

  async removeAccount(token: string, address: string) {
    const existingToken = await this.findToken(token);
    if (!existingToken) {
      throw new UnauthorizedException('Invalid token');
    }

    const addressIndex = existingToken.addresses.indexOf(address);
    if (addressIndex === -1) {
      throw new NotFoundException('Address not found');
    }

    try {
      await this.rpcClientService.client
        .request('wallet/removeAccount', { account: address, confirm: true })
        .waitForEnd();
      existingToken.addresses.splice(addressIndex, 1);
      const updatedToken = await existingToken.save();
      return {
        message: 'Address removed successfully',
        addresss: updatedToken.addresses,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.response.stream.error.codeMessage, 'Failed to remove address');
    }
  }

  async getBalance(token: string, address: string, assetId?: string) {
    const existingToken = await this.findToken(token);
    if (!existingToken) {
      throw new UnauthorizedException('Invalid token');
    }

    const addressIndex = existingToken.addresses.indexOf(address);
    if (addressIndex === -1) {
      throw new NotFoundException('Address not found');
    }

    try {
      const response = await this.rpcClientService.client
        .request('wallet/getBalance', { account: address, assetId: assetId })
        .waitForEnd();
      return {
        message: 'Get Address balance successfully',
        respose: response.content,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.response.stream.error.codeMessage, 'Failed to get address balance');
    }
  }

  async getBalances(token: string, address: string) {
    const existingToken = await this.findToken(token);
    if (!existingToken) {
      throw new UnauthorizedException('Invalid token');
    }

    const addressIndex = existingToken.addresses.indexOf(address);
    if (addressIndex === -1) {
      throw new NotFoundException('Address not found');
    }

    try {
      const response = await this.rpcClientService.client
        .request('wallet/getBalances', { account: address })
        .waitForEnd();
      return {
        message: 'Get Address Balances successfully',
        respose: response.content,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.response.stream.error.codeMessage, 'Failed to get address balances');
    }
  }

  async getAccountStatus(token: string, address: string) {
    const existingToken = await this.findToken(token);
    if (!existingToken) {
      throw new UnauthorizedException('Invalid token');
    }

    const addressIndex = existingToken.addresses.indexOf(address);
    if (addressIndex === -1) {
      throw new NotFoundException('Address not found');
    }

    try {
      const response = await this.rpcClientService.client
        .request('wallet/getAccountStatus', { account: address })
        .waitForEnd();
      return {
        message: 'Get Address status successfully',
        respose: response.content,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.response.stream.error.codeMessage, 'Failed to get address status');
    }
  }

  async getAccountTransaction(token: string, address: string, hash: string) {
    const existingToken = await this.findToken(token);
    if (!existingToken) {
      throw new UnauthorizedException('Invalid token');
    }

    const addressIndex = existingToken.addresses.indexOf(address);
    if (addressIndex === -1) {
      throw new NotFoundException('Address not found');
    }

    try {
      const response = await this.rpcClientService.client
        .request('wallet/getAccountTransaction', { hash: hash, account: address })
        .waitForEnd();
      return {
        message: 'Get Address transaction successfully',
        respose: response.content,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.response.stream.error.codeMessage,
        'Failed to get address transaction',
      );
    }
  }

  async getAccountTransactions(token: string, address: string, params?: Record<string, any>) {
    const existingToken = await this.findToken(token);
    if (!existingToken) {
      throw new UnauthorizedException('Invalid token');
    }

    const addressIndex = existingToken.addresses.indexOf(address);
    if (addressIndex === -1) {
      throw new NotFoundException('Address not found');
    }

    try {
      const response = await this.rpcClientService.client
        .request('wallet/getAccountTransactions', { ...{ account: address }, ...params })
        .waitForEnd();
      return {
        message: 'Get Address transactions successfully',
        respose: response.stream,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.response.stream.error.codeMessage,
        'Failed to get address transactions',
      );
    }
  }

  async getAsset(token: string, address: string, id: string) {
    const existingToken = await this.findToken(token);
    if (!existingToken) {
      throw new UnauthorizedException('Invalid token');
    }

    const addressIndex = existingToken.addresses.indexOf(address);
    if (addressIndex === -1) {
      throw new NotFoundException('Address not found');
    }

    try {
      const response = await this.rpcClientService.client
        .request('wallet/getAsset', { id: id, account: address })
        .waitForEnd();
      return {
        message: 'Get Address asset successfully',
        respose: response.content,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.response.stream.error.codeMessage, 'Failed to get address asset');
    }
  }

  async getAssets(token: string, address: string) {
    const existingToken = await this.findToken(token);
    if (!existingToken) {
      throw new UnauthorizedException('Invalid token');
    }

    const addressIndex = existingToken.addresses.indexOf(address);
    if (addressIndex === -1) {
      throw new NotFoundException('Address not found');
    }

    try {
      const response = await this.rpcClientService.client
        .request('wallet/getAssets', { account: address })
        .waitForEnd();
      return {
        message: 'Get Address assets successfully',
        respose: response.stream,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.response.stream.error.codeMessage, 'Failed to get address assets');
    }
  }

  async createTransaction(token: string, address: string, params: Record<string, any>) {
    const existingToken = await this.findToken(token);
    if (!existingToken) {
      throw new UnauthorizedException('Invalid token');
    }

    const addressIndex = existingToken.addresses.indexOf(address);
    if (addressIndex === -1) {
      throw new NotFoundException('Address not found');
    }

    try {
      const response = await this.rpcClientService.client
        .request('wallet/createTransaction', {
          ...{ account: address },
          ...params,
        })
        .waitForEnd();
      return {
        message: 'Create Address Transaction successfully',
        respose: response.content,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.response.stream.error.codeMessage,
        'Failed to create address transaction',
      );
    }
  }

  async broadcastTransaction(token: string, address: string, transaction: string) {
    const existingToken = await this.findToken(token);
    if (!existingToken) {
      throw new UnauthorizedException('Invalid token');
    }

    const addressIndex = existingToken.addresses.indexOf(address);
    if (addressIndex === -1) {
      throw new NotFoundException('Address not found');
    }

    try {
      const response = await this.rpcClientService.client
        .request('chain/broadcastTransaction', { transaction: transaction })
        .waitForEnd();
      return {
        message: 'Broadcast Address Transaction successfully',
        respose: response.content,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.response.stream.error.codeMessage,
        'Failed to broadcast address transaction',
      );
    }
  }

  async rescanAccount(token: string, address: string, params: { follow?: boolean; from?: number }) {
    const existingToken = await this.findToken(token);
    if (!existingToken) {
      throw new UnauthorizedException('Invalid token');
    }

    const addressIndex = existingToken.addresses.indexOf(address);
    if (addressIndex === -1) {
      throw new NotFoundException('Address not found');
    }

    try {
      const response = await this.rpcClientService.client.request('wallet/rescanAccount', params).waitForEnd();
      return {
        message: 'Rescan Address successfully',
        respose: response.stream,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.response.stream.error.codeMessage, 'Failed to rescan address');
    }
  }
}
