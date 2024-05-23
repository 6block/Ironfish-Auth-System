import { Controller, Post, Body, Get } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateTransactionDto,
  CreateTransactionParamsDto,
  GetTransactionsDto,
  GetTransactionsParamsDto,
  ImportWalletDto,
} from './wallet.dto';
import { WalletToken } from 'src/schemas/walletToken.schema';

@ApiTags('wallet')
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @ApiOperation({ summary: 'Create token to use wallet api.' })
  @Get('createToken')
  async getToken() {
    return this.walletService.createToken();
  }

  @Get('all')
  async getAllTokens(): Promise<WalletToken[]> {
    return this.walletService.getAllTokens();
  }

  @ApiOperation({ summary: 'Import address to your token' })
  @ApiBody({ type: ImportWalletDto })
  @Post('importAccount')
  async importWallet(@Body() importWalletDto: ImportWalletDto) {
    const { token, address, viewKey, incomingViewKey, outgoingViewKey } = importWalletDto;
    return this.walletService.importAddress(token, address, viewKey, incomingViewKey, outgoingViewKey);
  }

  @ApiOperation({ summary: 'Remove address from token' })
  @ApiBody({ schema: { example: { token: 'your_token', address: 'your_address' } } })
  @Post('removeAccount')
  async removeAccount(@Body('token') token: string, @Body('address') address: string) {
    return this.walletService.removeAccount(token, address);
  }

  @ApiOperation({ summary: 'Get all addresses under the token' })
  @ApiBody({ schema: { example: { token: 'your_token' } } })
  @Post('getAccounts')
  async getAccounts(@Body('token') token: string) {
    return this.walletService.getAddresses(token);
  }

  @ApiOperation({ summary: 'Get the status of an address.' })
  @ApiBody({ schema: { example: { token: 'your_token', address: 'your_address' } } })
  @Post('getAccountStatus')
  async getAccountStatus(@Body('token') token: string, @Body('address') address: string) {
    return this.walletService.getAccountStatus(token, address);
  }

  @ApiOperation({ summary: 'Get balance for the given address' })
  @ApiBody({
    schema: { example: { token: 'your_token', address: 'your_address', assetId: 'assetId' } },
  })
  @Post('getBalance')
  async getBalance(@Body('token') token: string, @Body('address') address: string, @Body('assetId') assetId?: string) {
    return this.walletService.getBalance(token, address, assetId);
  }

  @ApiOperation({ summary: 'Get balance for the given address' })
  @ApiBody({ schema: { example: { token: 'your_token', address: 'your_address' } } })
  @Post('getBalances')
  async getBalances(@Body('token') token: string, @Body('address') address: string) {
    return this.walletService.getBalances(token, address);
  }

  @ApiOperation({ summary: 'Get a transaction for an address' })
  @ApiBody({
    schema: { example: { token: 'your_token', address: 'your_address', hash: 'transaction_hash' } },
  })
  @Post('getAccountTransaction')
  async getAccountTransaction(
    @Body('token') token: string,
    @Body('address') address: string,
    @Body('hash') hash: string,
  ) {
    return this.walletService.getAccountTransaction(token, address, hash);
  }

  @ApiOperation({ summary: 'Get transactions for the given address.' })
  @ApiBody({ type: GetTransactionsDto })
  @Post('getAccountTransactions')
  async getAccountTransactions(
    @Body('token') token: string,
    @Body('address') address: string,
    @Body('params') params?: GetTransactionsParamsDto,
  ) {
    return this.walletService.getAccountTransactions(token, address, params);
  }

  @ApiOperation({ summary: 'Get an asset from the wallet from a given identifier and address' })
  @ApiBody({
    schema: { example: { token: 'your_token', address: 'your_address', id: 'identifier' } },
  })
  @Post('getAsset')
  async getAsset(@Body('token') token: string, @Body('address') address: string, @Body('id') id: string) {
    return this.walletService.getAsset(token, address, id);
  }

  @ApiOperation({ summary: 'Streams all the assets in the wallet of the given account' })
  @ApiBody({
    schema: { example: { token: 'your_token', address: 'your_address' } },
  })
  @Post('getAssets')
  async getAssets(@Body('token') token: string, @Body('address') address: string) {
    return this.walletService.getAssets(token, address);
  }

  @ApiOperation({ summary: 'Creates a raw transaction that is not posted' })
  @ApiBody({ type: CreateTransactionDto })
  @Post('createTransaction')
  async createTransaction(
    @Body('token') token: string,
    @Body('address') address: string,
    @Body('params') params: CreateTransactionParamsDto,
  ) {
    return this.walletService.createTransaction(token, address, params);
  }

  @ApiOperation({ summary: "Broadcast a transaction to the node's peers" })
  @ApiBody({
    schema: {
      example: { token: 'your_token', address: 'your_address', transaction: 'transaction' },
    },
  })
  @Post('broadcastTransaction')
  async broadcastTransaction(
    @Body('token') token: string,
    @Body('address') address: string,
    @Body('transaction') transaction: string,
  ) {
    return this.walletService.broadcastTransaction(token, address, transaction);
  }

  @ApiOperation({ summary: 'Rescans an account in the wallet and updates the balance and available notes' })
  @ApiBody({
    schema: { example: { token: 'your_token', address: 'your_address' } },
  })
  @Post('rescanAccount')
  async rescanAccount(
    @Body('token') token: string,
    @Body('address') address: string,
    @Body('params') params: { follow?: boolean; from?: number },
  ) {
    return this.walletService.rescanAccount(token, address, params);
  }
}
