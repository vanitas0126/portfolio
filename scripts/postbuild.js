import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const docsDir = join(__dirname, '..', 'docs');
const indexPath = join(docsDir, 'index.html');
const notFoundPath = join(docsDir, '404.html');

if (!existsSync(docsDir)) {
  mkdirSync(docsDir, { recursive: true });
}

if (existsSync(indexPath)) {
  copyFileSync(indexPath, notFoundPath);
  console.log('Created docs/404.html for SPA routing.');
} else {
  console.error('vite build did not produce docs/index.html. Run npm run build first.');
  process.exit(1);
}


