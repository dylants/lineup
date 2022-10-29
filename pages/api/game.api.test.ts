import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks, MockRequest, MockResponse } from 'node-mocks-http';
import Game from '../../lib/game/Game';
import handler from './game.api';

describe('/api/game', () => {
  describe('GET', () => {
    it('returns a Game', async () => {
      const {
        req,
        res,
      }: {
        req: MockRequest<NextApiRequest>;
        res: MockResponse<NextApiResponse>;
      } = createMocks({
        method: 'GET',
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);

      const game: Game = res._getData();
      expect(game).toBeTruthy();
      expect(game.lineups.length).toBeGreaterThan(0);
    });
  });
});
