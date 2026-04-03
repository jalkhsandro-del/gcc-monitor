# New feature workflow

Before implementing a new feature:

1. Read the PRD at `docs/PRD.md` to understand the feature spec
2. Read `docs/architecture.md` for structural guidance
3. Read `docs/ui-design.md` for component patterns and styling
4. If the feature involves a new data source, read `docs/data-sources.md`

Implementation steps:

1. Create or update the Drizzle schema if new tables/columns are needed
2. Build the data layer first (lib/ functions, API routes)
3. Build the UI components (components/ directory)
4. Wire into the page (app/ directory)
5. Run `npm run typecheck` to verify no type errors
6. Run `npm run lint` to verify code style
7. Run `npm run build` to verify the build succeeds
8. Test locally with `npm run dev`

Commit with a descriptive message: `feat(module): short description`
