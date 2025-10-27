# Festival Website Setup

This project has been transformed from a Next.js admin dashboard into a complete festival website with admin management capabilities.

## 🎵 What's New

### Landing Page (/)
- **Hero Section**: Eye-catching festival branding with animated backgrounds
- **About Section**: Festival information and features
- **Lineup Section**: Artist showcase with headliners and featured acts
- **Schedule Section**: Interactive day-by-day schedule
- **Tickets Section**: Multiple ticket packages with pricing
- **Contact Section**: Contact form and venue information
- **Footer**: Complete site navigation and newsletter signup

### Admin Dashboard (/admin)
- **Dashboard**: Festival management overview
- **Event Calendar**: Schedule management
- **Forms**: Artist registration and vendor applications
- **Tables**: Attendee lists and data management
- **Analytics**: Ticket sales and performance metrics
- **Settings**: Festival configuration

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Access the Site**
   - Landing Page: http://localhost:3001
   - Admin Dashboard: http://localhost:3001/admin/dashboard

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx              # Root layout
│   └── admin/                  # Admin routes
│       ├── layout.tsx          # Admin layout with sidebar
│       ├── dashboard/          # Main dashboard
│       ├── calendar/           # Event calendar
│       ├── forms/              # Registration forms
│       ├── tables/             # Data tables
│       └── ...
├── components/
│   ├── Landing/                # Landing page components
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Lineup.tsx
│   │   ├── Schedule.tsx
│   │   ├── Tickets.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   └── Layouts/                # Admin layout components
└── css/
    └── style.css               # Custom animations and styles
```

## 🎨 Features

### Landing Page Features
- **Responsive Design**: Mobile-first approach
- **Smooth Animations**: CSS animations and transitions
- **Interactive Elements**: Hover effects and smooth scrolling
- **Modern UI**: Glassmorphism effects and gradients
- **Navigation**: Sticky navbar with smooth scroll to sections

### Admin Features
- **Festival Management**: Comprehensive admin dashboard
- **Data Visualization**: Charts and analytics
- **User Management**: Authentication and profiles
- **Content Management**: Forms and tables
- **Theme Support**: Dark/light mode toggle

## 🛠 Customization

### Update Festival Information
1. Edit `src/components/Landing/Hero.tsx` for main festival details
2. Update `src/components/Landing/Lineup.tsx` for artist information
3. Modify `src/components/Landing/Schedule.tsx` for event schedule
4. Customize `src/components/Landing/Tickets.tsx` for pricing

### Branding
1. Update festival name in `src/components/Landing/Navbar.tsx`
2. Change colors in Tailwind classes throughout components
3. Add your logo to `public/` directory and update references

### Admin Navigation
- Edit `src/components/Layouts/sidebar/data/index.ts` to customize admin menu

## 🎯 Next Steps

1. **Add Real Data**: Connect to a database or CMS
2. **Payment Integration**: Add Stripe or PayPal for ticket sales
3. **User Authentication**: Implement proper auth for admin access
4. **Email Integration**: Add newsletter and contact form functionality
5. **SEO Optimization**: Add meta tags and structured data
6. **Performance**: Optimize images and add caching

## 📱 Mobile Responsive

The entire site is fully responsive and optimized for:
- Mobile phones (320px+)
- Tablets (768px+)
- Desktop (1024px+)
- Large screens (1440px+)

## 🎪 Festival Theme

The design uses a modern festival aesthetic with:
- Purple and pink gradient themes
- Glassmorphism effects
- Smooth animations
- Music-focused iconography
- High-energy visual elements

Enjoy your festival website! 🎉