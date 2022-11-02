## Hierarchy

Below is an outline of the class hierarchy used in the `lineup` codebase:

- Position
  - name: string
- Skill
  - position: Position
  - ability: number
- Player
  - name: string
  - skills: Skill[]
- Assignment
  - player: Player
  - position: Position
- Lineup
  - assignments: Assignment[]
  - frame: number
- Game
  - lineups: Lineup[]
