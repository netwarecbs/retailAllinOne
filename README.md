# Retail All-in-One Monorepo

A Dockerized monorepo containing multiple Next.js applications with shared authentication, centralized API logic, and a consistent UI theme.

## 🏗️ Architecture

This monorepo follows a modular architecture with:

- **Apps**: Individual Next.js applications
  - `web` (Port 3000): Main dashboard application
  - `garment` (Port 3001): Garment management system
  - `pharmacy` (Port 3002): Pharmacy management system

- **Packages**: Shared code and components
  - `@retail/shared`: Authentication, API services, and Redux store
  - `@retail/ui`: Reusable UI components with Tailwind CSS and shadcn/ui

## 🚀 Features

- **Dockerized Development**: Complete containerized development environment
- **Shared Authentication**: Centralized login system using username/password
- **Redux State Management**: Centralized state management across all apps
- **Consistent UI**: Professional design system with Tailwind CSS v4 and shadcn/ui
- **Modular Architecture**: Easy to add new applications without breaking existing code
- **API Integration**: Connected to external authentication API

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **State Management**: Redux Toolkit, React Redux
- **API**: Axios for HTTP requests
- **Containerization**: Docker, Docker Compose
- **Package Management**: npm workspaces

## 📋 Prerequisites

- Node.js 18+ 
- npm 9+
- Docker and Docker Compose
- Git

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd retailAllinOne
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp env.example .env
```

The default API endpoint is already configured:
```
NEXT_PUBLIC_API_BASE_URL=http://ecs-netware-view-lb-949622788.ap-south-1.elb.amazonaws.com
```

### 3. Start Development Environment

```bash
# Install dependencies and start all services
npm run dev
```

This will:
- Build and start all Docker containers
- Install dependencies for all packages
- Start development servers for all applications

### 4. Access Applications

- **Main Dashboard**: http://localhost:3000
- **Garment App**: http://localhost:3001
- **Pharmacy App**: http://localhost:3002

## 🔐 Authentication

The system uses username-based authentication (no email required):

**Test Credentials:**
- Username: `rajesh`
- Password: `password`

## 📁 Project Structure

```
retailAllinOne/
├── apps/
│   ├── web/                 # Main dashboard (port 3000)
│   ├── garment/             # Garment management (port 3001)
│   └── pharmacy/            # Pharmacy management (port 3002)
├── packages/
│   ├── shared/              # Shared authentication & API
│   └── ui/                  # Shared UI components
├── docker-compose.yml       # Docker services configuration
├── Dockerfile              # Multi-stage Docker build
├── package.json            # Root workspace configuration
└── README.md               # This file
```

## 🎨 Design System

The applications use a consistent design system featuring:

- **Color Palette**: Purple primary theme with semantic colors
- **Typography**: Inter font family
- **Components**: shadcn/ui component library
- **Layout**: Responsive grid system with Tailwind CSS
- **Icons**: Lucide React icons

## 🔧 Available Scripts

### Root Level Commands

```bash
# Development
npm run dev              # Start all services with Docker
npm run dev:web          # Start only web app
npm run dev:garment      # Start only garment app
npm run dev:pharmacy     # Start only pharmacy app

# Building
npm run build            # Build all applications
npm run build:web        # Build web app only
npm run build:garment    # Build garment app only
npm run build:pharmacy   # Build pharmacy app only

# Docker Management
npm run start            # Start containers
npm run stop             # Stop containers
npm run clean            # Clean up containers and images

# Dependencies
npm run install:all      # Install all dependencies
```

### Individual App Commands

Each app supports standard Next.js commands:

```bash
cd apps/web
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
```

## 🐳 Docker Configuration

The project uses Docker Compose for development with:

- **Multi-stage builds** for optimized production images
- **Volume mounting** for hot reloading
- **Network isolation** between services
- **Environment variable** management

### Container Ports

- `web`: 3000 → 3000
- `garment`: 3001 → 3000
- `pharmacy`: 3002 → 3000

## 🔌 API Integration

The shared package includes:

- **Authentication Service**: Login/logout functionality
- **API Client**: Axios-based HTTP client with interceptors
- **Token Management**: Automatic token handling and refresh
- **Error Handling**: Centralized error management

### API Endpoints

- **Login**: `POST /v1/auth/login`
- **Logout**: `POST /v1/auth/logout`
- **Profile**: `GET /v1/auth/profile`

## 🧪 Adding New Applications

To add a new application to the monorepo:

1. **Create App Directory**:
   ```bash
   mkdir apps/new-app
   cd apps/new-app
   ```

2. **Initialize Next.js**:
   ```bash
   npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"
   ```

3. **Update Package.json**:
   ```json
   {
     "name": "@retail/new-app",
     "dependencies": {
       "@retail/shared": "workspace:*",
       "@retail/ui": "workspace:*"
     }
   }
   ```

4. **Add to Docker Compose**:
   ```yaml
   new-app:
     build:
       context: .
       dockerfile: Dockerfile
       target: development
     container_name: retail-new-app
     ports:
       - "3003:3000"
     volumes:
       - .:/app
       - /app/node_modules
       - /app/apps/new-app/node_modules
     environment:
       - NODE_ENV=development
     working_dir: /app/apps/new-app
     command: npm run dev
     networks:
       - retail-network
   ```

5. **Update Root Scripts**:
   ```json
   {
     "scripts": {
       "dev:new-app": "cd apps/new-app && npm run dev",
       "build:new-app": "cd apps/new-app && npm run build"
     }
   }
   ```

## 🚀 Production Deployment

For production deployment:

1. **Build Images**:
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

2. **Set Environment Variables**:
   ```bash
   export NEXT_PUBLIC_API_BASE_URL=your-production-api-url
   ```

3. **Deploy**:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

1. Check the documentation
2. Review existing issues
3. Create a new issue with detailed information

---

**Built with ❤️ using Next.js, Docker, and modern web technologies**
