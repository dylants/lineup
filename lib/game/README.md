## Hierarchy

Below is an outline of the class hierarchy used in the `lineup` codebase:

- Position
  - name: string
- Skill
  - position: Position
  - ability: number
- PositionProbability
  - position: Position
  - score: number
- Player
  - name: string
  - skills: Skill[]
  - positionProbabilities: PositionProbability[]
- Assignment
  - player: Player
  - position: Position
  - score?: number
- Lineup
  - assignments: Assignment[]
  - frame: number
- Game
  - lineups: Lineup[]

## Logic to generate a game lineup

Below is the algorithm to generate a `Game`, which contains a set of `Lineup`s:

### `generateGame` : `Game`

Expects as input a list of `Player`s, where each `Player` has a `PositionProbability` for each `Position`. This function uses a combination of `generateLineupOutcome` and `generatePartialLineup` to build 4 `Lineup`s for the `Game`.

### `generateLineupOutcome` : `LineupOutcome`

_(for each position, find best player)_

Accepts a list of `Player`s (who each have a `PositionProbability`) and a `Lineup`. This function finds the `Player` with the highest `PositionProbability` for each `Position`, and generates an `Assignment` for that `Player` and `Position`. We then add the `Assignment`s to the `Lineup`, and return the `Lineup` and list of `Player`s who were not assigned.

### `generatePartialLineup` : `Lineup`

_(for all players, find best position)_

As the name indicates, this generates a `Lineup` without assignments for all positions.

Accepts a list of `Player`s who each have a `PositionProbability`. This function creates a new `Lineup`, and assigns the `Player`s to their highest scoring `PositionProbability`, when compared to the other `Player`s.
