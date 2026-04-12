import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsClient {
  async send(userId: number): Promise<boolean> {
    try {
      const response = await fetch('https://util.devi.tools/api/v1/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}
