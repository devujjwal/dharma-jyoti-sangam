

# Fix Plan: Global Search + Missing Share Buttons + VratDetail Share

## Issues Found

1. **Global Search is broken (critical)** — The `global_search` RPC function returns HTTP 400 with error: `"invalid UNION/INTERSECT/EXCEPT ORDER BY clause"`. The `ORDER BY rank` at the end of the UNION ALL query uses an expression alias that Postgres disallows in UNION ORDER BY when called through PostgREST. Fix: wrap the entire UNION in a subquery, then ORDER BY on the outer query.

2. **ShareButton missing on FestivalDetailPage** — No share button on festival detail pages.

3. **ShareButton missing on VratDetailPage** — No share button on vrat detail pages.

## Implementation Steps

### Step 1: Fix `global_search` database function
Create a migration that replaces the function. Wrap all UNION ALL subqueries inside a CTE or subquery, then apply `ORDER BY rank LIMIT result_limit` on the outer SELECT. This avoids the Postgres restriction on expressions in UNION ORDER BY.

```sql
CREATE OR REPLACE FUNCTION public.global_search(...)
RETURNS TABLE(...) AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM (
    (SELECT ... FROM festivals ... LIMIT result_limit)
    UNION ALL
    (SELECT ... FROM articles ... LIMIT result_limit)
    UNION ALL
    (SELECT ... FROM temples ... LIMIT result_limit)
    UNION ALL
    (SELECT ... FROM bhajans ... LIMIT result_limit)
    UNION ALL
    (SELECT ... FROM vrats ... LIMIT result_limit)
  ) AS combined
  ORDER BY combined.rank
  LIMIT result_limit;
END;
$$
```

### Step 2: Add ShareButton to FestivalDetailPage
Import `ShareButton` and add it to the action buttons section alongside "Add to Calendar" and "View All Festivals".

### Step 3: Add ShareButton to VratDetailPage
Import `ShareButton` and add it to the bottom action buttons section.

## Technical Details

- **Migration**: 1 new SQL migration to replace `global_search` function
- **Modified files**: `src/pages/FestivalDetailPage.tsx`, `src/pages/VratDetailPage.tsx`
- **No new dependencies or edge functions needed**

