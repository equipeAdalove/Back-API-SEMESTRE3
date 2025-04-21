import { SwaggerCustomOptions } from '@nestjs/swagger';
import { css } from '../swagger/custom-css';

export const swaggerCustomOptions: SwaggerCustomOptions = {
  customSiteTitle: 'AdaTrade API Docs',
  customfavIcon: '/public/adalove-icon.jpg',
  swaggerOptions: {
    docExpansion: 'none',
    apisSorter: 'alpha',
  },
  customCss: css,
  customJs: `
  document.addEventListener('DOMContentLoaded', function() {
    // Remove authentication
    const authWrapper = document.querySelector('.scheme-container .auth-wrapper');
    if (authWrapper) {
      authWrapper.remove();
    }
    
    // Add custom header
    const header = document.createElement('div');
    header.style.backgroundColor = '#F9FAFB';
    header.style.padding = '10px';
    header.style.borderBottom = '1px solid #E5E7EB';
    header.style.marginBottom = '20px';
    header.innerHTML = '<p style="margin: 0; color: #6B7280; text-align: center; font-family: \'JetBrains Mono\', monospace;">Estatísticas de Comércio Exterior do Brasil</p>';
    document.querySelector('.information-container').prepend(header);
  });
`,
};
