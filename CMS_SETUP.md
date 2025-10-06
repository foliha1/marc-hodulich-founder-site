# CMS Setup Guide

## Quick Start

Your CMS is now ready! Here's how to get started:

### Step 1: Create Your Admin Account

1. Visit `/auth` on your site to create an account
2. Sign up with your email and password

### Step 2: Grant Admin Access

Since this is your first admin account, you need to manually grant yourself admin permissions:

1. Open the backend to view your database tables
2. Find your `user_id` from the auth users (you'll see it in the backend)
3. Insert a row into the `user_roles` table:
   - `user_id`: Your user ID from step 2
   - `role`: `admin`

**Easy way to do this:**

Go to the backend SQL editor and run:
```sql
-- Replace 'YOUR_EMAIL_HERE' with your actual email
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'YOUR_EMAIL_HERE';
```

### Step 3: Access the CMS

1. Visit `/admin` to access your CMS dashboard
2. You'll see tabs for each editable section:
   - **Hero**: Main landing section
   - **Meet Marc**: 4 content cards
   - **Carousel**: Journey slides
   - **Movement**: 29029 section with video
   - **Podcasts**: Speaking appearances
   - **Social**: Social media posts and links
   - **Contact**: Contact information

### Step 4: Make Your First Edit

1. Click any tab in the CMS
2. Edit the content fields
3. Click "Save Changes"
4. Visit the main site to see your changes live!

## Features

✅ **Secure Authentication** - Email/password login with proper validation
✅ **Role-Based Access** - Admin-only access to CMS
✅ **All Content Editable** - Every section can be managed
✅ **Image Management** - Update images via URLs
✅ **Real-time Updates** - Changes appear immediately
✅ **Easy to Use** - Simple forms for all content

## Security

- All content tables have Row Level Security (RLS) enabled
- Public can read, only admins can write
- Passwords are securely hashed
- Admin access is validated on every request

## Adding More Admins

To give someone else admin access:

```sql
-- Replace USER_EMAIL with their email
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'USER_EMAIL';
```

## Troubleshooting

**Can't login to /admin?**
- Make sure you've added your user to the user_roles table
- Check that the role is set to 'admin'

**Changes not saving?**
- Check the browser console for errors
- Make sure you're logged in as an admin

**Need help?**
- Check the backend for data
- Review RLS policies if access issues occur
