# Perth Music Community Forum

A desktop-focused music community forum for Perth using a monorepo architecture. The tech stack includes Next.js for the frontend, Strapi for the backend, and PostgreSQL for the database.

## Architecture

This project uses a Turborepo-powered monorepo structure:

youarewe-monorepo/
├── package.json         # Root package.json for monorepo config
├── turbo.json           # Turborepo configuration
├── packages/            # Shared code packages
│   ├── ui/              # Shared UI components
│   ├── utils/           # Shared utilities
│   └── api-client/      # API client for Strapi
├── apps/
│   ├── web/             # Next.js frontend
│   └── api/             # Strapi backend
└── .env                 # Shared environment variables

## Getting Started

### Prerequisites

- Node.js (>= 16.0.0)
- PostgreSQL
- Git

### Installation

1. Clone the repository:
   git clone https://github.com/clubkids/youarewe-monorepo.git
   cd youarewe-monorepo

2. Install dependencies:
   npm install

3. Set up environment variables:
   cp .env.example .env
   # Edit .env with your configuration

4. Start the development server:
   npm run dev

## Features

- Music-centric forum for discussions
- Music embedding and sharing
- Live chat functionality
- User profiles with music preferences

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
