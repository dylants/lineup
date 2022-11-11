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
- Lineup
  - assignments: Assignment[]
  - frame: number
- Game
  - lineups: Lineup[]

## Logic to generate a game lineup

Below is the algorithm to generate a `Game`, which contains a set of `Lineup`s:

### `generateGame`

Given a list of `Player`s who each have a set of `Skill`s for each `Position`, this code uses the `probabilities` library to populate the list of `PositionProbability`s for each `Position` (easy for you to say).

Once these probabilities are generated, generates a `Lineup` for each `frame` within a game.

### `generateLineupOutcome`

Given a list of `Player`s who each have a `PositionProbability`, this code finds the `Player` with the highest `PositionProbability` for each `Position`, and generates an `Assignment` for that `Player` and `Position`.
