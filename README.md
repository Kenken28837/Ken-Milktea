# MoonBucks - Coffee Shop E-commerce Application

A modern, full-stack web application for a coffee shop built with Firebase and vanilla JavaScript.

## 🏗️ Project Structure

```
Ken-Milktea/
├── src/                          # Source code
│   ├── config/                   # Configuration files
│   │   └── firebase.js          # Firebase configuration
│   ├── services/                 # Business logic services
│   │   ├── auth.js              # Authentication service
│   │   ├── products.js          # Product management
│   │   ├── orders.js            # Order management
│   │   └── storage.js           # File upload service
│   ├── components/               # Reusable UI components
│   │   ├── Cart.js              # Shopping cart component
│   │   └── ProductCard.js       # Product card component
│   ├── utils/                   # Utility functions
│   │   └── helpers.js           # Helper functions
│   └── styles/                   # CSS stylesheets
│       ├── base.css             # Base styles and variables
│       ├── layout.css            # Layout styles
│       └── components.css       # Component styles
├── public/                       # Public HTML pages
│   ├── index.html               # Main application
│   ├── Login.html               # Authentication page
│   ├── admin.html               # Admin dashboard
│   ├── home.html                # Home page content
│   ├── menu.html                # Menu page content
│   ├── myorders.html            # Order history
│   ├── about.html               # About page
│   ├── admin-ongoing.html       # Order management
│   ├── admin-products.html      # Product management
│   └── admin-add.html           # Add product form
├── functions/                    # Firebase Cloud Functions
│   ├── index.js                 # Cloud functions
│   └── package.json             # Functions dependencies
└── images/                       # Static assets
```

## 🚀 Features

### Customer Features
- **Product Catalog**: Browse coffee products with images, prices, and descriptions
- **Shopping Cart**: Add/remove items, manage quantities
- **Order Placement**: Secure checkout with payment proof upload
- **Order Tracking**: View order status and history
- **Responsive Design**: Mobile-friendly interface

### Admin Features
- **Product Management**: Add, edit, and manage product inventory
- **Order Management**: View all orders, update delivery status
- **User Management**: View registered users, manage accounts
- **Dashboard**: Statistics and analytics
- **Stock Management**: Real-time inventory updates

### Technical Features
- **Authentication**: Email/password with role-based access
- **Real-time Updates**: Live data synchronization
- **File Upload**: Payment proof images
- **Responsive Design**: Mobile-first approach
- **Error Handling**: Comprehensive error management

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend**: Firebase (Firestore, Authentication, Storage, Functions)
- **Styling**: CSS Custom Properties, Flexbox, Grid
- **Icons**: Font Awesome
- **Notifications**: SweetAlert2
- **Charts**: Chart.js

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Ken-Milktea
   ```

2. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

3. **Install dependencies**
   ```bash
   # For Firebase functions
   cd functions
   npm install
   cd ..
   ```

4. **Firebase Setup**
   ```bash
   firebase login
   firebase init
   ```

5. **Configure Firebase**
   - Update `src/config/firebase.js` with your Firebase config
   - Set up Firestore security rules
   - Configure Authentication providers

6. **Deploy**
   ```bash
   firebase deploy
   ```

## 🔧 Configuration

### Firebase Configuration
Update `src/config/firebase.js` with your Firebase project settings:

```javascript
export const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### Environment Variables
Create a `.env` file for sensitive configuration:

```env
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-domain
FIREBASE_PROJECT_ID=your-project-id
```

## 🎨 Styling System

The project uses a modular CSS architecture:

- **Base Styles**: CSS custom properties, reset, typography
- **Layout Styles**: Grid, flexbox, responsive design
- **Component Styles**: Reusable component styles

### CSS Custom Properties
```css
:root {
  --primary: #7c3aed;
  --secondary: #34d399;
  --bg-primary: #0b0d10;
  --text-primary: #e8eef5;
  /* ... more variables */
}
```

## 🔐 Security

- **Authentication**: Firebase Authentication with email verification
- **Authorization**: Role-based access control (user/admin)
- **Data Validation**: Client and server-side validation
- **Security Rules**: Firestore security rules for data protection

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: 480px, 768px, 1024px
- **Flexible Layouts**: CSS Grid and Flexbox
- **Touch Friendly**: Large touch targets

## 🚀 Deployment

### Firebase Hosting
```bash
firebase deploy --only hosting
```

### Firebase Functions
```bash
firebase deploy --only functions
```

### Full Deployment
```bash
firebase deploy
```

## 📊 Performance

- **Lazy Loading**: Images and components
- **Code Splitting**: Modular JavaScript architecture
- **Caching**: Firebase caching strategies
- **Optimization**: Minified CSS and JavaScript

## 🧪 Testing

```bash
# Run tests (if implemented)
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Version History

- **v1.0.0**: Initial release with basic functionality
- **v1.1.0**: Added modular architecture and improved UX
- **v1.2.0**: Enhanced admin features and performance optimizations

---

**MoonBucks** - Where every cup tells a story 🌙☕