#!/bin/bash

# سكريبت لنشر المشروع على Fly.io

set -e

echo " جاري التحضير لنشر المشروع على Fly.io..."

# التحقق من تثبيت flyctl
if ! command -v flyctl &> /dev/null; then
    echo "flyctl غير مثبت!"
    echo " تثبيت flyctl..."
    
    # للـ Linux/Mac
    curl -L https://fly.io/install.sh | sh
    
    echo " تم تثبيت flyctl"
    echo "  يرجى فتح محطة جديدة ثم تشغيل هذا السكريبت مجدداً"
    exit 1
fi

echo " flyctl مثبت"

# تسجيل الدخول
echo " تسجيل الدخول إلى Fly.io..."
flyctl auth login

# بناء المشروع
echo "بناء المشروع..."
npm run build

# نشر على Fly.io
echo " نشر المشروع على Fly.io..."
flyctl launch --copy-existing-config

# عرض معلومات التطبيق
echo ""
echo "تم النشر بنجاح!"
echo ""
echo " معلومات التطبيق:"
flyctl info

echo ""
echo " الرابط:"
flyctl open
