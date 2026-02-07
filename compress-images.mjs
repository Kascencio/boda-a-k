import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { join, parse } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const INPUT_DIR = join(__dirname, 'src/assets');
const OUTPUT_DIR = join(__dirname, 'src/assets/optimized');

async function compressImages() {
  console.log('🚀 Iniciando compresión de imágenes...\n');
  
  // Crear directorio de salida
  try {
    await mkdir(OUTPUT_DIR, { recursive: true });
  } catch (e) {
    // directorio ya existe
  }
  
  const files = await readdir(INPUT_DIR);
  const imageFiles = files.filter(f => 
    f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg')
  );
  
  console.log(`📁 Encontradas ${imageFiles.length} imágenes para comprimir\n`);
  
  for (const file of imageFiles) {
    const inputPath = join(INPUT_DIR, file);
    const { name } = parse(file);
    const outputPath = join(OUTPUT_DIR, `${name}.webp`);
    
    try {
      const inputStats = await sharp(inputPath).metadata();
      
      await sharp(inputPath)
        .webp({ 
          quality: 80,
          effort: 6 // balance entre velocidad y compresión
        })
        .resize({
          width: Math.min(inputStats.width || 1920, 1920),
          height: Math.min(inputStats.height || 1920, 1920),
          fit: 'inside',
          withoutEnlargement: true
        })
        .toFile(outputPath);
      
      const outputStats = await sharp(outputPath).metadata();
      const inputSize = (inputStats.size || 0) / (1024 * 1024);
      const outputSize = (outputStats.size || 0) / (1024 * 1024);
      
      console.log(`✅ ${file}`);
      console.log(`   ${inputSize.toFixed(2)} MB → Comprimido a WebP`);
      
    } catch (error) {
      console.error(`❌ Error procesando ${file}:`, error.message);
    }
  }
  
  // También procesar SVG si existe
  const svgFiles = files.filter(f => f.endsWith('.svg'));
  for (const file of svgFiles) {
    const inputPath = join(INPUT_DIR, file);
    const { name } = parse(file);
    const outputPath = join(OUTPUT_DIR, `${name}.webp`);
    
    try {
      await sharp(inputPath)
        .webp({ quality: 85 })
        .resize({
          width: 1920,
          height: 1920,
          fit: 'inside',
          withoutEnlargement: true
        })
        .toFile(outputPath);
      
      console.log(`✅ ${file} → Convertido a WebP`);
    } catch (error) {
      console.error(`❌ Error procesando ${file}:`, error.message);
    }
  }
  
  console.log('\n✨ ¡Compresión completada!');
  console.log(`📁 Imágenes optimizadas en: ${OUTPUT_DIR}`);
}

compressImages().catch(console.error);
