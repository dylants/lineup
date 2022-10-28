import Head from 'next/head';
import useSWR from 'swr';
import fetcher from '../lib/fetcher';
import Assignment from '../lib/game/Assignment';
import Game from '../lib/game/Game';
import Lineup from '../lib/game/Lineup';

export default function Home() {
  const { data, mutate, error } = useSWR<Game, Error>('/api/game', fetcher, {
    revalidateOnFocus: false,
  });

  if (error) return <div>error</div>;
  if (!data) return <div>loading...</div>;

  const lineups = data.lineups.map((lineup: Lineup) => {
    const lineupRows = lineup.assignments.map((assignment: Assignment) => {
      return (
        <tr key={assignment.player.name}>
          <td>{assignment.position.name}</td>
          <td>{assignment.player.name}</td>
        </tr>
      );
    });

    return (
      <table key={lineup.frame}>
        <thead>
          <tr>
            <th>Position</th>
            <th>Player</th>
          </tr>
        </thead>
        <tbody>{lineupRows}</tbody>
      </table>
    );
  });

  const lineupsToDisplay = <div className="lineups">{lineups}</div>;

  return (
    <>
      <Head>
        <title>Lineup</title>
      </Head>

      <main>
        <h1>Lineup</h1>
        {lineupsToDisplay}
        <div className="buttons">
          <button onClick={() => mutate()}>Regenerate</button>
        </div>
      </main>
    </>
  );
}
