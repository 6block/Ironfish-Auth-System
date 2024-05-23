import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  constructor(private readonly walletService: WalletService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCleanup() {
    this.logger.debug('Running daily cleanup task');

    const wallettokens = await this.walletService.getAllTokens();
    const now = new Date();

    for (const wallettoken of wallettokens) {
      const diffDays = Math.ceil((now.getTime() - new Date(wallettoken.lastActive).getTime()) / (1000 * 3600 * 24));
      if (diffDays > 10) {
        let allBalancesLow = true;
        for (const address of wallettoken.addresses) {
          const balance_response = await this.walletService.getBalance(wallettoken.token, address);
          const iron_available_balance = balance_response.respose.available;
          if (iron_available_balance >= 0.01 * 1e8) {
            allBalancesLow = false;
            break;
          } else {
            await this.walletService.removeAccount(wallettoken.token, address);
          }
        }
        if (allBalancesLow) {
          this.logger.debug(`Deleting token ${wallettoken.token} due to inactivity and low balances`);
          await this.walletService.deleteToken(wallettoken.token);
        }
      }
    }
  }
}
