/** Allocation rules, kept free of the vscode API so they can be unit tested */

export interface Assignment {
    berth: string; 
    vessel: string;
    teu: number;
}

export interface Problem {
    berth: string;
    message: string;
}

/** A berth may not exceed the TEU ceiling, and may hold one vessel.  */

export function findProblems(rows: Assignment[], maxTeu: number): Problem[] {
    const problems: Problem[] = [];
    const totals = new Map<string, number>();
    const counts = new Map<string, number>();

    for (const row of rows) {
        totals.set(row.berth, (totals.get(row.berth) ?? 0) + row.teu);
        counts.set(row.berth, (counts.get(row.berth) ?? 0) + 1);
    }    

    for (const berth of [...totals.keys()].sort()) {
        const teu = totals.get(berth)!;
        const count = counts.get(berth)!;
        if (teu > maxTeu) {
            problems.push({ berth, message: `${berth} is over capacity: ${teu} TEU assigned, limit ${maxTeu}` });
        }
        if (count > 1){
            problems.push({ berth, message: `${berth} has ${count} vessels assigned at once` });
        }
    }
    return problems;
}
