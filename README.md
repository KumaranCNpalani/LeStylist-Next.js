# LeStylist - Premium Salon Website

A complete Next.js salon management website with admin panel, booking system, and dynamic content management.

## Features

### Public Website
- **Home Page**: Hero video, services showcase, testimonials, offer banner
- **Services Pages**: Women's, Men's, Makeup, Hydrafacial services
- **Gallery**: Categorized image gallery (Hair, Makeup, Skin, Client Photos)
- **About Page**: Company info, awards, shop photos
- **Booking System**: Online appointment booking
- **Testimonials**: Customer reviews and ratings

### Admin Panel
- **Dashboard**: Overview and analytics
- **Gallery Management**: Upload and categorize images
- **Testimonials**: Manage customer reviews
- **Services**: Add/edit/delete services and pricing (150+ services pre-loaded)
- **Offers**: Create and manage promotional offers
- **Settings**: Change password and configurations

## Technology Stack

- **Framework**: Next.js 15 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **Database**: MySQL
- **Authentication**: JWT
- **File Upload**: Local filesystem

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/KumaranCNpalani/LeStylist-Next.js.git
cd LeStylist-Next.js
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Database Setup

```bash
# Import schema
mysql -u username -p database_name < database/schema.sql

# Import services data
mysql -u username -p database_name < database/insert-services.sql
```

### 4. Environment Variables

Create `.env.local`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=lestylist_db
JWT_SECRET=your-secret-key-min-32-chars
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000`

### 6. Build for Production

```bash
pnpm build
pnpm start
```

## Deployment

### Vercel Deployment

See `VERCEL_DEPLOYMENT.md` for complete deployment guide.

**Important**: Vercel doesn't host MySQL databases. Use:
- PlanetScale (Recommended - Free tier)
- Railway ($5/month)
- Your existing MySQL hosting

### cPanel Deployment

See `CPANEL_HOSTING_GUIDE.md` for cPanel deployment instructions.

## Admin Access

- **URL**: `http://localhost:3000/admin/login`
- **Default Credentials**: Check database `admins` table
- **Important**: Change password immediately after first login!

## Project Structure

```
LeStylist-Next.js/
├── app/                    # Next.js app directory
│   ├── (public pages)     # Home, About, Services, Gallery, etc.
│   ├── admin/             # Admin panel
│   ├── api/               # API routes
│   └── services/          # Service category pages
├── components/            # Reusable UI components
├── database/              # SQL files
│   ├── schema.sql        # Database schema
│   └── insert-services.sql # Services data
├── lib/                   # Utilities
├── public/                # Static assets
└── styles/                # Global styles
```

## Features

✅ **100% Database-Driven** - All content managed through admin
✅ **150+ Services** - Pre-loaded service catalog
✅ **Dynamic Offer Banner** - Auto-rotating promotional offers
✅ **Image Management** - Category-based gallery system
✅ **Booking System** - Online appointment scheduling
✅ **Responsive Design** - Works on all devices
✅ **SEO Optimized** - Proper meta tags and semantic HTML

## Documentation

- `VERCEL_DEPLOYMENT.md` - Vercel deployment guide
- `CPANEL_HOSTING_GUIDE.md` - cPanel hosting guide
- `WEBSITE_COMPLETE.md` - Feature documentation
- `ADMIN_GUIDE.md` - Admin panel usage guide
- `LOCALHOST_GUIDE.md` - Local development troubleshooting

## License

Private - All Rights Reserved

## Support

For issues or questions, please contact the development team.

---

**Lé Stylist** - Where Beauty Meets Excellence
