import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import Lineup from '../../lib/Lineup';
import Player from '../../lib/Player';
import Skill from '../../lib/Skill';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get((req, res) => {
  const players = [
    new Player('point1', Skill.DEFAULT_PG_SKILLS),
    new Player('point2', Skill.DEFAULT_PG_SKILLS),
    new Player('shoot1', Skill.DEFAULT_SG_SKILLS),
    new Player('power2', Skill.DEFAULT_PF_SKILLS),
    new Player('center2', Skill.DEFAULT_C_SKILLS),
    new Player('power3', Skill.DEFAULT_PF_SKILLS),
    new Player('small1', Skill.DEFAULT_SF_SKILLS),
    new Player('power1', Skill.DEFAULT_PF_SKILLS),
    new Player('small2', Skill.DEFAULT_SF_SKILLS),
    new Player('center1', Skill.DEFAULT_C_SKILLS),
  ];
  const lineup = Lineup.generateLineup(players);

  return res.send(lineup);
});

export default router.handler();
