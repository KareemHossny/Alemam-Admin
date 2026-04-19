# Admin Module Architecture

This module now follows a feature-based structure:

```text
src/modules/admin
|- features/
|  |- dashboard/
|  |  |- components/
|  |  `- pages/
|  |- projects/
|  |  `- pages/
|  |- tasks/
|  |  `- pages/
|  `- users/
|     `- pages/
|- constants/
|- layouts/
|- utils/
|- AdminModule.jsx
`- AdminRoutes.jsx
```

Guidelines:

- Keep domain-specific UI inside its feature folder.
- Promote only truly reusable primitives to `src/shared/components`.
- Add feature-local `components`, `hooks`, or `services` folders only when a feature needs them.
- Avoid top-level catch-all component folders for admin pages.
