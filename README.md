# Shughuli — Personal Project & Task Management Tool

Shughuli is a personal task and project management application designed for individuals who want a simple, efficient way to stay organized without the overhead of teams or collaboration features.

---

## ✨ Features

- ✅ Personal project management  
- ✅ Task tracking with priorities and statuses  
- ✅ Comments on tasks  
- ✅ Project-level attachments  
- ✅ Notification system  
- ✅ Role-based access (Admin, Member, Customer)  
- ✅ Authentication with BetterAuth  
- ✅ PostgreSQL + Prisma ORM  
- ✅ Fully responsive UI built with Tailwind CSS and ShadCN  

---

## 🧱 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [BetterAuth](https://github.com/Bijles-aan-Huis/better-auth)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [ShadCN](https://ui.shadcn.dev/)
- **State Management**: Server Components + React hooks
- **Emailing**: Resend (optional)

---

## 🛠️ Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/shughuli.git
   cd shughuli


2. **Install dependacies**

    ```bash
   pnpm install


3. **Set up environment variables**

    ```bash
    DATABASE_URL=postgresql://your-user:your-password@localhost:5432/shughuli
    BASE_URL=<http://localhost:3000>
    BETTERAUTH_SECRET=your-secret-key

4. **Generate Prisma client & apply migrations**

    ```bash
    npx prisma generate
    npx prisma migrate dev --name init

5. **Run the development server**

    ```bash
    pnpm dev


