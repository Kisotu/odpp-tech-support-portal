#!/bin/bash

echo "🚀 Setting up ODPP Tech Support Portal..."

# Backend setup
echo ""
echo "📦 Backend Setup (Laravel)"
echo "=========================="
cd backend

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ Created .env file"
fi

echo "Installing PHP dependencies..."
composer install --no-interaction

echo "Generating application key..."
php artisan key:generate

echo ""
echo "⚠️  Please create MySQL database:"
echo "   mysql -u root -e \"CREATE DATABASE odpp_tech_support CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\""
echo ""
read -p "Press Enter after creating the database..."

echo "Running migrations..."
php artisan migrate

echo "Seeding demo users..."
php artisan db:seed

echo ""
echo "✅ Backend setup complete!"
echo ""

# Frontend setup
echo "📦 Frontend Setup (React + Vite)"
echo "================================"
cd ../frontend

echo "Installing Node dependencies..."
npm install

echo ""
echo "✅ Frontend setup complete!"
echo ""

echo "🎉 Setup Complete!"
echo ""
echo "To start the development servers:"
echo ""
echo "  Terminal 1 (Backend):"
echo "  cd backend && php artisan serve"
echo ""
echo "  Terminal 2 (Frontend):"
echo "  cd frontend && npm run dev"
echo ""
echo "Demo Credentials:"
echo "  Admin: admin@odpp.go.ke / password"
echo "  ICT Officer: ict1@odpp.go.ke / password"
echo "  Staff: prosecutor@odpp.go.ke / password"
echo ""
