State Management:

- Web: Zustand for its boilerplate-free approach and ease of "Optimistic UI" updates.
- Mobile: Flutter BLoC for strict event-driven architecture, ensuring the UI stays in sync with the heavy hero-caching logic.

Data Flow: UI triggers action $\rightarrow$ Local State updates instantly (Optimistic) $\rightarrow$ API call $\rightarrow$ DB Persist.

Error Handling: Centralized API middleware in Node.js; Bloc "Error States" in Flutter with rollback logic for failed optimistic updates.

Intentionally Not Built: User Authentication (OIDC/Auth0). Reasoning: Focus was kept on the drafting core logic and cross-platform data synchronization within the 48h window.
