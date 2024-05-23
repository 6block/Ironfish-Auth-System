import { ApiProperty } from '@nestjs/swagger';

export class ImportWalletDto {
  @ApiProperty({ required: true, example: 'your_token' }) token: string;
  @ApiProperty({ required: true, example: 'your_address' }) address: string;
  @ApiProperty({ required: true, example: 'your_viewKey' }) viewKey: string;
  @ApiProperty({ required: true, example: 'your_incomingViewKey' }) incomingViewKey: string;
  @ApiProperty({ required: true, example: 'your_outgoingViewKey' }) outgoingViewKey: string;
}

export class GetTransactionsParamsDto {
  @ApiProperty({ required: false }) hash: string;
  @ApiProperty({ required: false }) sequence?: number;
  @ApiProperty({ required: false }) limit?: number;
  @ApiProperty({ required: false }) offset?: number;
}

export class GetTransactionsDto {
  @ApiProperty({ required: true, example: 'your_token' }) token: string;
  @ApiProperty({ required: true, example: 'your_address' }) address: string;
  @ApiProperty({ required: false }) params: GetTransactionsParamsDto;
}

export class CreateTransactionOutputDto {
  @ApiProperty({ required: true }) publicAddress: string;
  @ApiProperty({ required: true }) amount: string;
  @ApiProperty({ required: false }) memo?: string;
  @ApiProperty({ required: false }) memoHex?: string;
  @ApiProperty({ required: false }) assetId?: string;
}

export class CreateTransactionMintDto {
  @ApiProperty({ required: false }) assetId?: string;
  @ApiProperty({ required: false }) name?: string;
  @ApiProperty({ required: false }) metadata?: string;
  @ApiProperty({ required: true }) value: string;
  @ApiProperty({ required: false }) transferOwnershipTo?: string;
}

export class CreateTransactionBurnDto {
  @ApiProperty({ required: true }) assetId: string;
  @ApiProperty({ required: true }) value: string;
}

export class CreateTransactionParamsDto {
  @ApiProperty({ required: true, type: [CreateTransactionOutputDto] })
  outputs: CreateTransactionOutputDto[];
  @ApiProperty({ required: false, type: [CreateTransactionMintDto] })
  mints?: CreateTransactionMintDto[];
  @ApiProperty({ required: false, type: [CreateTransactionBurnDto] })
  burns?: CreateTransactionBurnDto[];
  @ApiProperty({ required: false }) fee?: string | null;
  @ApiProperty({ required: false }) feeRate?: string | null;
  @ApiProperty({ required: false }) expiration?: number;
  @ApiProperty({ required: false }) expirationDelta?: number;
  @ApiProperty({ required: false }) confirmations?: number;
  @ApiProperty({ required: false }) notes?: string[];
}

export class CreateTransactionDto {
  @ApiProperty({ required: true, example: 'your_token' }) token: string;
  @ApiProperty({ required: true, example: 'your_address' }) address: string;
  @ApiProperty({ required: false }) params: CreateTransactionParamsDto;
}
