# cPanel Hosting Guide for Lé Stylist Website

## Prerequisites
- cPanel hosting account with Node.js support
- FTP/cPanel File Manager access
- Database access (MySQL/PostgreSQL)
- Domain name configured

## Step 1: Prepare Your Files

1. **Build the production version:**
   ```bash
   npm run build
   ```
   This creates an optimized production build in the `.next` folder.

2. **Create a `.env.production` file** with your production environment variables:
   ```
   JWT_SECRET=your-secret-jwt-key-change-this
   DATABASE_URL=your-database-connection-string
   NODE_ENV=production
   ```

## Step 2: Upload Files to cPanel

### Option A: Using cPanel File Manager
1. Log into your cPanel account
2. Navigate to **File Manager**
3. Go to `public_html` (or your domain's root folder)
4. Upload all files EXCEPT:
   - `node_modules` folder (don't upload this)
   - `.git` folder
   - `.next` folder (will be rebuilt on server)
   - `.env.local` (use `.env.production` instead)

### Option B: Using FTP
1. Use an FTP client (FileZilla, WinSCP, etc.)
2. Connect to your cPanel server
3. Upload files to `public_html` directory
4. Exclude `node_modules`, `.git`, and `.next` folders

## Step 3: Install Dependencies on Server

### Via cPanel Terminal (if available):
```bash
cd ~/public_html
npm install --production
npm run build
```

### Via SSH (if you have SSH access):
```bash
cd public_html
npm install --production
npm run build
```

## Step 4: Set Up Database

1. **Create Database in cPanel:**
   - Go to **MySQL Databases** in cPanel
   - Create a new database (e.g., `lestylist_db`)
   - Create a database user and assign it to the database
   - Note down the database name, username, and password

2. **Import Database Schema:**
   - Go to **phpMyAdmin** in cPanel
   - Select your database
   - Click **Import**
   - Upload the `database/schema.sql` file
   - Click **Go** to import

3. **Update Environment Variables:**
   - In cPanel File Manager, create/edit `.env.production`
   - Add your database connection string:
     ```
     DATABASE_URL=mysql://username:password@localhost:3306/database_name
     ```

## Step 5: Configure Node.js App in cPanel

1. **In cPanel, go to "Node.js Selector" or "Setup Node.js App"**
2. **Create a new Node.js application:**
   - Node.js version: Select latest LTS (18.x or 20.x)
   - Application root: `public_html`
   - Application URL: Your domain or subdomain
   - Application startup file: `server.js` (create this file - see below)
   - Application mode: `production`

3. **Create `server.js` file in root directory:**
   ```javascript
   const { createServer } = require('http')
   const { parse } = require('url')
   const next = require('next')

   const dev = process.env.NODE_ENV !== 'production'
   const hostname = 'localhost'
   const port = process.env.PORT || 3000

   const app = next({ dev, hostname, port })
   const handle = app.getRequestHandler()

   app.prepare().then(() => {
     createServer(async (req, res) => {
       try {
         const parsedUrl = parse(req.url, true)
         await handle(req, res, parsedUrl)
       } catch (err) {
         console.error('Error occurred handling', req.url, err)
         res.statusCode = 500
         res.end('internal server error')
       }
     }).listen(port, (err) => {
       if (err) throw err
       console.log(`> Ready on http://${hostname}:${port}`)
     })
   })
   ```

## Step 6: Set Up Environment Variables in cPanel

1. In Node.js App settings, add environment variables:
   - `NODE_ENV=production`
   - `JWT_SECRET=your-secret-key`
   - `DATABASE_URL=your-database-connection-string`

## Step 7: Start the Application

1. In cPanel Node.js App settings, click **"Start"** or **"Restart"**
2. Your application should now be running

## Step 8: Configure Domain/Subdomain

1. **Point your domain to the Node.js app:**
   - In cPanel, go to **Subdomains** or **Addon Domains**
   - Point your domain to the Node.js application directory
   - Or use the URL provided by cPanel Node.js Selector

## Important Files to Upload

✅ **Upload these:**
- All files in root directory (except those listed below)
- `app/` folder
- `components/` folder
- `public/` folder
- `package.json`
- `next.config.js` (if exists)
- `tailwind.config.ts`
- `tsconfig.json`
- `.env.production` (with your production credentials)

❌ **Don't upload:**
- `node_modules/` (install on server)
- `.next/` (will be built on server)
- `.git/`
- `.env.local` (use `.env.production`)

## Troubleshooting

### If the app doesn't start:
1. Check Node.js version (should be 18.x or 20.x)
2. Verify all dependencies are installed: `npm install --production`
3. Check error logs in cPanel
4. Ensure `.env.production` has correct database credentials

### If database connection fails:
1. Verify database credentials in `.env.production`
2. Check if database user has proper permissions
3. Ensure database exists and schema is imported

### If static files don't load:
1. Check `public/` folder is uploaded correctly
2. Verify Next.js Image optimization settings
3. Check file permissions (should be 644 for files, 755 for folders)

## Security Checklist

- [ ] Change default admin password (`admin`/`admin123`)
- [ ] Set strong `JWT_SECRET` in production
- [ ] Use HTTPS/SSL certificate (available in cPanel)
- [ ] Keep Node.js and dependencies updated
- [ ] Regular database backups
- [ ] Secure `.env.production` file (permissions 600)

## Alternative: Static Export (Simpler for cPanel)

If Node.js hosting is complex, you can export as static site:

1. **In `next.config.js`, add:**
   ```javascript
   output: 'export'
   ```

2. **Build static site:**
   ```bash
   npm run build
   ```

3. **Upload `out/` folder contents to `public_html`**

**Note:** Static export won't support:
- API routes (admin panel won't work)
- Server-side features
- Dynamic routes

For full functionality, use Node.js hosting as described above.

## Support

For cPanel-specific issues, contact your hosting provider's support team.

