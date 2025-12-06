# Minimal Accessible Kanban Board

A modern, high-performance, and accessible Kanban board built with **Next.js 15**, **React 19**, and **Tailwind CSS v4**.

This project demonstrates a robust implementation of a drag-and-drop interface with integrated state management, local persistence, and a fully functional dark mode.

![Kanban Demo](https://placehold.co/1200x600/1e293b/ffffff?text=Kanban+Board+Preview)

## 🚀 Features

- **Drag & Drop Interface**: Smooth and accessible drag-and-drop powered by `@dnd-kit`. Supports keyboard navigation for accessibility.
- **Task Management**:
  - **Create**: Add new tasks to any column.
  - **Edit**: Update task details (title, priority, assignee) via a modal.
  - **Delete**: Remove tasks with built-in safeguards.
  - **Move**: Drag tasks between columns or reorder them within the same column.
- **Dark Mode**: 
  - Fully responsive dark/light theme toggle.
  - System preference detection.
  - Smooth color transitions and flicker-free hydration.
- **Persistence**: Automatically saves your board state to `localStorage`.
- **Modern Tech Stack**: Built on the latest Next.js App Router and React Server Components architecture.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/) (Core, Sortable, Utilities)
- **Testing**: [Vitest](https://vitest.dev/) (Unit) & [Playwright](https://playwright.dev/) (E2E/Visual)
- **Language**: TypeScript

## 📦 Installation

clone the repository:

```bash
git clone https://github.com/john2k2/Kanban-minimal.git
cd Kanban-minimal
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🧪 Testing

The project includes a comprehensive test suite.

**Run Unit Tests:**
```bash
npm run test:unit
```

**Run Visual/E2E Tests:**
```bash
npm run test:visual
```

## 📂 Project Structure

```
src/
├── app/               # Next.js App Router pages and layout
│   └── globals.css    # Global styles & Tailwind v4 config
├── components/
│   ├── kanban/        # Core Kanban components
│   │   ├── internal/  # Internal sub-components (Modals, Forms)
│   │   ├── Column.tsx
│   │   ├── TaskCard.tsx
│   │   └── KanbanBoard.tsx
│   └── icons/         # SVG Icon system
├── hooks/             # Custom hooks (useTheme, useKanbanStore)
├── lib/               # Utilities and UI constants
└── ...
```

## 🎨 Theme System

The application uses a custom `useTheme` hook combined with Tailwind v4 CSS variables to ensure:
- Initial render matches system/stored preference (No hydration mismatch).
- Immediate toggle response.
- Persistent state across reloads.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
