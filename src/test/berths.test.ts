import * as assert from 'assert'; 
import { findProblems } from '../berths';

suite('Berth allocation rules', () => {
  test('a berth under the ceiling is clean', () => {
    const rows = [{ berth: 'B1', vessel: 'MSC Aurora', teu: 3800 }];
    assert.strictEqual(findProblems(rows, 4000).length, 0);    
  });

   test('a berth over the ceiling is flagged', () => {
     const rows = [{berth: 'B3', vessel: 'Ever Ocean', teu: 5200}];
     const problems = findProblems(rows, 4000);
     assert.strictEqual(problems.length, 1);
     assert.match(problems[0].message, /over capacity: 5200 TEU assigned, limit 4000/);
  });

    test('two vessels at one berth is flagged', () => {
      const rows = [
        { berth: 'B2', vessel: 'Nordic Star', teu: 1200 },
        { berth: 'B2', vessel: 'Baltic Dawn', teu: 1100 }
      ];
      const problems = findProblems(rows, 4000);
      assert.strictEqual(problems.length, 1);
      assert.match(problems[0].message, /has 2 vessels assigned at once/);
    });

    test('combined totals can breach the ceiling', () => {
      const rows = [
        { berth: 'B1', vessel: 'Baltic Dawn', teu: 2500 },
        { berth: 'B1', vessel: 'Coral Trader', teu: 2600 }
      ];
      assert.strictEqual(findProblems(rows, 4000).length, 2);  
    });
  });