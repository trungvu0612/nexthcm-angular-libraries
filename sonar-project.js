const sonarqubeScanner = require('sonarqube-scanner');

sonarqubeScanner({
  options: {
    'sonar.projectKey': 'hcm-angular',
    'sonar.sources': 'libs',
    'sonar.language': 'ts',
    'sonar.typescript.file.suffixes': '.ts',
    'sonar.sourceEncoding': 'UTF-8',
    'sonar.login': 'b5e13f0b703b952350db4cbbc3e89f9b4ba30e46',
    'sonar.host.url': 'https://sonarqube.banvien.com.vn',
  },
});
