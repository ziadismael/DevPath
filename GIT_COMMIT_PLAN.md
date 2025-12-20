# Git Commit Plan for Projects and Community Features

## Branch Strategy
Create new feature branch from current branch:
```bash
git checkout -b feat/projects-community-overhaul
```

## Atomic Commits (in order)

### 1. Type System Updates
**Files**: `client/src/types/index.ts`
```bash
git add client/src/types/index.ts
git commit -m "feat(types): add Team property to Project interface for ownership checking"
```

### 2. Projects Modal Enhancement
**Files**: `client/src/components/ProjectModal.tsx`
```bash
git add client/src/components/ProjectModal.tsx
git commit -m "feat(projects): add view/edit/create modal modes with conditional rendering"
```

### 3. Projects Page Overhaul
**Files**: `client/src/pages/Projects.tsx`
```bash
git add client/src/pages/Projects.tsx
git commit -m "feat(projects): remove dummy data and implement ownership-based modal logic"
```

### 4. Post Detail Modal Component
**Files**: `client/src/components/PostDetailModal.tsx`
```bash
git add client/src/components/PostDetailModal.tsx
git commit -m "feat(community): create PostDetailModal for full post viewing with likes and comments"
```

### 5. User Stats Widget Component
**Files**: `client/src/components/UserStatsWidget.tsx`
```bash
git add client/src/components/UserStatsWidget.tsx
git commit -m "feat(community): create UserStatsWidget with followers/following stats and user search"
```

### 6. Community Page Overhaul
**Files**: `client/src/pages/Community.tsx`
```bash
git add client/src/pages/Community.tsx
git commit -m "feat(community): switch to global feed and integrate PostDetailModal and UserStatsWidget"
```

## Execution Commands

```bash
# Create and checkout new feature branch
git checkout -b feat/projects-community-overhaul

# Commit 1: Type updates
git add client/src/types/index.ts
git commit -m "feat(types): add Team property to Project interface for ownership checking"

# Commit 2: Projects modal
git add client/src/components/ProjectModal.tsx
git commit -m "feat(projects): add view/edit/create modal modes with conditional rendering"

# Commit 3: Projects page
git add client/src/pages/Projects.tsx
git commit -m "feat(projects): remove dummy data and implement ownership-based modal logic"

# Commit 4: Post detail modal
git add client/src/components/PostDetailModal.tsx
git commit -m "feat(community): create PostDetailModal for full post viewing with likes and comments"

# Commit 5: User stats widget
git add client/src/components/UserStatsWidget.tsx
git commit -m "feat(community): create UserStatsWidget with followers/following stats and user search"

# Commit 6: Community page
git add client/src/pages/Community.tsx
git commit -m "feat(community): switch to global feed and integrate PostDetailModal and UserStatsWidget"

# Verify commits
git log --oneline -6
```

## Notes
- DO NOT push to remote
- DO NOT merge to main
- All commits are atomic and follow conventional commits format
- Each commit represents a logical unit of work
