# UI Components

## Overview

Reusable React components built with TypeScript and Tailwind CSS.

---

## Button Components

### PrimaryButton

Main call-to-action button with gradient background.

**Props:**

- `children`: Button content
- `onClick`: Click handler
- `disabled`: Disable state
- `loading`: Show loading spinner
- `type`: "button" | "submit"

**States:** default, hover, active, disabled, loading

---

### SecondaryButton

Secondary action button with glass effect.

**Props:** Same as PrimaryButton

---

### DangerButton

Destructive action button (delete).

**Props:** Same as PrimaryButton

---

## Input Components

### TextField

Standard text input field.

**Props:**

- `label`: Field label
- `placeholder`: Placeholder text
- `value`: Controlled value
- `onChange`: Change handler
- `error`: Error message
- `maxLength`: Character limit
- `required`: Required field

**States:** default, focus, error, disabled

---

### TextArea

Multi-line text input.

**Props:** Same as TextField plus:

- `rows`: Number of visible rows

---

## Task Components

### TaskCard

Individual task display with actions.

**Props:**

- `task`: Task object
- `onToggle`: Toggle completion handler
- `onEdit`: Edit handler
- `onDelete`: Delete handler

**Features:**

- Custom checkbox with animation
- Title with strikethrough when complete
- Description (truncated if long)
- Created date
- Edit and delete action buttons
- Hover lift effect

---

### TaskList

Collection of TaskCard components.

**Props:**

- `tasks`: Array of tasks
- `onToggle`: Toggle handler
- `onEdit`: Edit handler
- `onDelete`: Delete handler

**Features:**

- Staggered entrance animation
- Empty state when no tasks

---

### AddTaskForm

Form for creating new tasks.

**Props:**

- `onSubmit`: Submit handler

**Features:**

- Title input with character counter
- Description textarea with character counter
- Submit button with loading state
- Form validation

---

## Navigation Components

### Header

Top navigation bar.

**Features:**

- Logo/Brand
- User avatar/menu
- Logout button

---

### UserMenu

Dropdown menu for user actions.

**Features:**

- User name/email display
- Logout option
- Settings link (future)

---

## Feedback Components

### Toast

Notification for actions.

**Types:** success, error, info

**Features:**

- Auto-dismiss (3s default)
- Manual dismiss
- Icon based on type

---

### SkeletonLoader

Loading placeholder for content.

**Variants:**

- SkeletonCard: Task card placeholder
- SkeletonList: Multiple cards

---

### EmptyState

Displayed when no data.

**Props:**

- `icon`: Emoji or icon
- `title`: Heading text
- `message`: Description
- `action`: Optional CTA button

---

## Design Tokens

All components use shared design tokens:

- **Colors:** Primary, accent, neutral, semantic
- **Spacing:** 8px grid system
- **Typography:** Inter font family
- **Shadows:** Elevation system (soft, base, medium, large)
- **Radius:** Consistent border radius (xl, 2xl)
- **Transitions:** Smooth 300ms default
