import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import Game from '../../lib/game/Game';
import { generateTeam } from '../../lib/utils';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get((req, res) => {
  const players = generateTeam();
  const game = Game.generateGame(players);

  return res.send(game);
});

export default router.handler();
