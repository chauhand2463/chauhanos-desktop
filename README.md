# ChauhanOS Desktop

A modern desktop application built with React, TypeScript, and Vite.

## 🚀 Live Demo

**Check out the live application**: [https://dhairy-chauhan-portfolio.vercel.app/

## 📋 Project Overview

This is a custom desktop application with a modern UI built using cutting-edge web technologies. The application features a responsive design, smooth animations, and an intuitive user interface.

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite for lightning-fast development
- **UI Components**: shadcn/ui component library
- **Styling**: Tailwind CSS for utility-first styling
- **Routing**: React Router for navigation
- **State Management**: Zustand for efficient state management
- **Data Fetching**: React Query (TanStack Query)
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion for smooth transitions
- **Icons**: Lucide React icons
- **Testing**: Vitest with React Testing Library

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/chauhanos-desktop.git
   cd chauhanos-desktop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:5173](http://localhost:5173)

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run build:dev` | Build for development mode |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality checks |
| `npm run test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |

## 🏗️ Project Structure

```
chauhanos-desktop/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions
│   ├── store/         # State management
│   ├── core/          # Core application logic
│   └── apps/          # Application modules
├── public/            # Static assets
├── docs/              # Documentation
└── dist/              # Production build output
```

## 🎨 Features

- ⚡ **Fast Development** - Vite's instant hot module replacement
- 🎯 **Type Safety** - Full TypeScript support
- 🎨 **Modern UI** - Beautiful components with shadcn/ui
- 📱 **Responsive Design** - Works on all device sizes
- 🌙 **Dark Mode** - Built-in theme support
- 🔍 **Search** - Command palette with cmdk
- 📊 **Charts** - Data visualization with Recharts
- 📅 **Date Picker** - Calendar components
- 🎭 **Animations** - Smooth transitions with Framer Motion

## 🧪 Testing

The project uses Vitest for unit testing and React Testing Library for component testing.

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

## 📦 Build & Deploy

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Deployment

The application is deployed on Vercel. To deploy your own version:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy changes"
   git push origin main
   ```

2. **Connect to Vercel**
   - Import your repository on [Vercel](https://vercel.com)
   - Vercel will automatically detect the framework and configure the build settings

3. **Automatic Deployment**
   - Every push to the main branch will trigger a new deployment
   - Preview deployments are created for pull requests

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_API_URL=your_api_url
VITE_APP_TITLE=ChauhanOS Desktop
```

### Tailwind CSS Configuration

The project uses Tailwind CSS with custom configuration in `tailwind.config.ts`. You can customize the theme, colors, and breakpoints as needed.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- [React](https://reactjs.org/) - The library for web and native user interfaces
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript at Any Scale
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautifully designed components
- [Vercel](https://vercel.com/) - Platform for frontend frameworks

## 📞 Support

If you have any questions or need support, feel free to:

- Open an issue on GitHub
- Contact the development team
- Check the documentation

---

**Built with ❤️ by the ChauhanOS Team**
