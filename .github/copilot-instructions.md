# GitHub Copilot Instructions

## Code Style Guidelines

- Write concise, clean code using TypeScript best practices
- Add documentation comments only for:
  - Complex algorithms or business logic
  - Non-obvious implementations
  - Public APIs and exported functions
  - Edge cases and important limitations

## Development Workflow

1. Implement features sequentially through proper layers:
   - Models/schemas first
   - Services/utilities next 
   - API endpoints/controllers
   - UI components last
2. Complete each feature component before moving to the next one
3. Validate each implementation step before proceeding

## Quality Control

- Check for errors after each implementation
- Run appropriate tests when available
- Validate TypeScript types are properly defined
- Ensure API contracts are maintained
- Verify component reusability and adherence to project patterns

## External Resources

- Use Context7 integration to access latest documentation for:
  - Next.js and React
  - TypeScript
  - Radix UI components
  - TanStack libraries (React Query, etc.)
  - Auth0 integration
  - Other project dependencies

## Architecture Principles

- Follow the established project structure
- Maintain separation of concerns
- Leverage existing patterns in the codebase
- Use appropriate hooks and providers for state management
- Keep components focused on a single responsibility

## Commit & Communication

- Group related changes logically
- Use descriptive commit messages following project conventions
- Document any breaking changes clearly
- Explain implementation decisions when they're not obvious
