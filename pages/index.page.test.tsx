import 'whatwg-fetch';
import _ from 'lodash';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { SWRConfig } from 'swr';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import Home from './index.page';
import { generateRandomPlayers } from '../lib/utils';
import Game from '../lib/game/Game';

function renderPage() {
  render(
    // disable cache for tests https://swr.vercel.app/docs/advanced/cache#reset-cache-between-test-cases
    <SWRConfig value={{ provider: () => new Map() }}>
      <Home />
    </SWRConfig>
  );
}

describe('index', () => {
  const server = setupServer(
    rest.get('/api/game', (req, res, ctx) => {
      const players = generateRandomPlayers(5);
      const game = Game.generateGame(players);
      return res(ctx.json(game));
    })
  );

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  describe('when the api succeeds', () => {
    beforeEach(() => renderPage());

    it('displays the Lineup page', async () => {
      await screen.findByTestId('main');

      const lineupTables = screen.getAllByTestId('lineup-table');

      expect(lineupTables).toHaveLength(4);

      for (let i = 0; i < 4; i++) {
        const lineupTable = lineupTables[i];
        expect(lineupTable).toHaveTextContent('PG');
        expect(lineupTable).toHaveTextContent('SG');
        expect(lineupTable).toHaveTextContent('SF');
        expect(lineupTable).toHaveTextContent('PF');
        expect(lineupTable).toHaveTextContent('C');
      }
    });

    it('displays a different lineup when requested', async () => {
      await screen.findByTestId('main');
      const players1 = screen.getAllByTestId('player-names');
      const playerNames1 = players1.map((player) => player.textContent);

      await userEvent.click(screen.getByText('Regenerate'));

      await waitFor(() => {
        const players2 = screen.getAllByTestId('player-names');
        const playerNames2 = players2.map((player) => player.textContent);

        const difference = _.difference(playerNames1, playerNames2);
        expect(difference.length).toBeGreaterThan(0);
      });
    });
  });

  describe('when the api call fails', () => {
    beforeEach(() => {
      server.use(
        rest.get('/api/game', (req, res, ctx) => {
          return res(ctx.status(500));
        })
      );

      renderPage();
    });

    it('should show error', async () => {
      await screen.findByTestId('error');
    });
  });
});
