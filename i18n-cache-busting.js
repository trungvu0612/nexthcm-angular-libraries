const crypto = require('crypto');
const fs = require('fs');
const glob = require('glob');

function generateChecksum(str, algorithm, encoding) {
  return crypto
    .createHash(algorithm || 'md5')
    .update(str, 'utf8')
    .digest(encoding || 'hex');
}

const result = {};

glob.sync(`libs/core/assets/i18n/**/*.json`).forEach((path) => {
  const [, lang] = path.split('libs/core/assets/i18n/');
  const content = fs.readFileSync(path, { encoding: 'utf-8' });
  result[lang.replace('.json', '')] = generateChecksum(content);
});

fs.writeFileSync('libs/core/src/lib/transloco/i18n-cache-busting.json', JSON.stringify(result));
