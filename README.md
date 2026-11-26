# berthlint

Weekly berth allocation manifests for a container terminal, and the editor
tooling that checks them.

## The manifests

`manifests/*.json` list which vessel is assigned to which berth, with the
container count in TEU.

| Berth | Rail slots | Capacity |
|---|---|---|
| B1 | 3 | 4,000 TEU |
| B2 | 2 | 4,000 TEU |
| B3 | 4 | 4,000 TEU |

Two rules apply to every manifest:

1. A berth may not be assigned more than **4,000 TEU** in a week.
2. A berth may hold **one vessel** at a time.

`week47.json` breaks the first rule. `week48.json` breaks both.

Checking these by eye does not scale, which is what the tooling in this
repository is for.
