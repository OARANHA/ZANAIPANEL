#!/bin/bash

# Build script for ZanaiCode VS Code Extension

echo "🚀 Building ZanaiCode Extension..."

# Clean previous builds
rm -rf out
rm -f *.vsix

# Create out directory
mkdir -p out

# Compile TypeScript files
echo "📝 Compiling TypeScript..."
npx tsc src/extension.ts --outDir out --target ES2020 --module commonjs --moduleResolution node --esModuleInterop --allowSyntheticDefaultImports --strict --skipLibCheck --lib ES2020

# Copy package.json
cp package.json out/

# Copy node_modules (only production dependencies)
echo "📦 Copying dependencies..."
cp -r node_modules out/

# Create VSIX package
echo "📦 Creating VSIX package..."
npx vsce package

echo "✅ Build complete!"
echo "📁 Extension files: out/"
echo "📦 VSIX package: *.vsix"