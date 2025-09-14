# Fulusin

Fulusin is a web-based financial tracking platform designed to help individuals manage, monitor, and analyze their financial activities within specific timeframes.

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui
- **Database**: PostgreSQL
- **Containerization**: Docker(optional)

## Project Structure

```
fulusin/
├── src/
│   ├── actions/        # Next.js server action handlers
│   ├── app/            # Next.js app router pages
│   ├── components/     # Reusable React components
│   ├── lib/            # Core utilities and helpers
│   ├── provider/       # React Query Client provider configuration
│   ├── schemas/        # Form validation schemas
```

## Key Features
- OAuth integration with Google and GitHub
- React Query for handling server actions functionality
- Allows users to choose their preferred default currency, with automatic formatting and symbol adjustments
- Enables adding, editing, and organizing categories for income and expenses
- Displays transaction history for monthly and yearly periods

## Getting Started

1. Clone the repository:
```sh
git clone https://github.com/ahmadammarm/fulusin.git
```

2. Navigate to the project directory:

```sh
cd fulusin
```

3. Install dependencies:
```bash
npm install
```

4. Configure Environment Variable: Copy the file `.env.example` to `.env` and adjust it to your configuration:

```sh
cp .env.example .env
```

```
NEXTAUTH_SECRET=
DATABASE_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```


5. Run development server:
```bash
npm run dev
```

## Getting Started with Docker

1. Clone the repository:
```sh
git clone https://github.com/ahmadammarm/fulusin.git
```

2. Navigate to the project directory:

```sh
cd fulusin
```

3. Run the Docker Compose:

```sh
docker-compose up
```

or run in detach mode:
```sh
docker-compose up -d
```

4. To stop the Docker Compose:
```sh
docker-compose down
```

Open [http://localhost:3000](http://localhost:3000) to view the application.


## Build and Deployment

```bash
# Production build
npm run build

# Start production server
npm start
```

### This project is open for contributions. Feel free to submit issues or pull requests. Thanks

