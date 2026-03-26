/**
 * 将图片转换为base64编码
 * 用于在PDF中嵌入图片
 *
 * 使用方法：
 * node scripts/convertImageToBase64.js public/images/profile.jpg
 */

const fs = require('fs');
const path = require('path');

// 获取命令行参数
const imagePath = process.argv[2];

if (!imagePath) {
  console.error('错误：请提供图片路径');
  console.log('\n使用方法：');
  console.log('  node scripts/convertImageToBase64.js <图片路径>');
  console.log('\n示例：');
  console.log('  node scripts/convertImageToBase64.js public/images/profile.jpg');
  console.log('  node scripts/convertImageToBase64.js public/logos/tju_logo.svg');
  process.exit(1);
}

// 检查文件是否存在
if (!fs.existsSync(imagePath)) {
  console.error(`错误：文件不存在 - ${imagePath}`);
  process.exit(1);
}

try {
  // 读取文件
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');

  // 获取文件扩展名
  const ext = path.extname(imagePath).toLowerCase();

  // 确定MIME类型
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
  };

  const mimeType = mimeTypes[ext] || 'image/jpeg';

  // 生成完整的data URL
  const dataUrl = `data:${mimeType};base64,${base64Image}`;

  // 输出结果
  console.log('\n✅ 转换成功！\n');
  console.log('文件信息：');
  console.log(`  路径：${imagePath}`);
  console.log(`  大小：${(imageBuffer.length / 1024).toFixed(2)} KB`);
  console.log(`  类型：${mimeType}`);
  console.log(`  Base64长度：${base64Image.length} 字符`);
  console.log('\n📋 Base64 Data URL（复制下面的内容到代码中）：\n');
  console.log(dataUrl);
  console.log('\n');

  // 可选：保存到文件
  const outputPath = imagePath + '.base64.txt';
  fs.writeFileSync(outputPath, dataUrl);
  console.log(`✅ 已保存到文件：${outputPath}\n`);

  // 使用提示
  console.log('📖 使用方法：');
  console.log('\n在 lib/exportResumePDF.tsx 中：\n');
  console.log('```typescript');
  console.log('basic: {');
  if (imagePath.includes('profile') || imagePath.includes('photo')) {
    console.log(`  photoUrl: '${dataUrl.substring(0, 50)}...',`);
  } else if (imagePath.includes('logo')) {
    console.log(`  logoUrl: '${dataUrl.substring(0, 50)}...',`);
  } else {
    console.log(`  imageUrl: '${dataUrl.substring(0, 50)}...',`);
  }
  console.log('}');
  console.log('```\n');

  // 性能提示
  if (imageBuffer.length > 200 * 1024) {
    console.log('⚠️  注意：图片较大（>200KB），建议压缩后再使用');
    console.log('   推荐大小：Logo < 50KB，照片 < 100KB\n');
  }

} catch (error) {
  console.error('错误：转换失败', error.message);
  process.exit(1);
}
