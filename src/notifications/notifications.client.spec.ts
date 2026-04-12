import { describe, it, expect, beforeEach, spyOn } from 'bun:test';
import { NotificationsClient } from './notifications.client';

describe('NotificationsClient', () => {
  let client: NotificationsClient;

  beforeEach(() => {
    client = new NotificationsClient();
  });

  it('should return true when the remote responds ok', async () => {
    const fetchMock = spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true } as Response);

    const result = await client.send(42);

    expect(result).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith('https://util.devi.tools/api/v1/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 42 }),
    });

    fetchMock.mockRestore();
  });

  it('should return false when the remote responds not ok', async () => {
    const fetchMock = spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: false } as Response);

    const result = await client.send(42);

    expect(result).toBe(false);

    fetchMock.mockRestore();
  });

  it('should return false when fetch throws', async () => {
    const fetchMock = spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('network down'));

    const result = await client.send(42);

    expect(result).toBe(false);

    fetchMock.mockRestore();
  });
});
