const css = `
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
    
    * {
      font-family: 'JetBrains Mono', monospace;
    }
    
    .swagger-ui .topbar {
      background-color: #F1E0FF;
      padding: 15px 0;
      border-bottom: 1px solid #E0C4FF;
    }
    
    .swagger-ui .topbar .topbar-wrapper {
      align-items: center;
      display: flex;
      justify-content: space-between;
    }
    
    .swagger-ui .topbar .topbar-wrapper img {
      content: url('/public/adalove-icon.jpg');
      height: 40px;
      width: 40px;
      object-fit: contain;
    }
    
    .swagger-ui .topbar .topbar-wrapper .link {
      content: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="180" height="40" viewBox="0 0 180 40"><text x="0" y="28" font-family="JetBrains Mono" font-size="20" font-weight="700" fill="%236b21a8">AdaTrade API</text></svg>');
      border: none;
      width: 180px;
      height: 40px;
    }
    
    .swagger-ui .info .title {
      color: #6b21a8;
      font-size: 24px;
      font-weight: 700;
      font-family: 'JetBrains Mono', monospace;
    }
    
    .swagger-ui .info .description {
      font-size: 14px;
      color: #4b5563;
      margin: 10px 0;
      line-height: 1.5;
    }
    
    .swagger-ui .opblock-tag {
      font-size: 16px;
      margin: 20px 0 10px;
      padding: 10px 0;
      border-bottom: 2px solid #E0C4FF;
      font-weight: 700;
    }
    
    .swagger-ui .opblock .opblock-summary-method {
      border-radius: 4px;
      font-weight: 700;
      font-family: 'JetBrains Mono', monospace;
    }
    
    .swagger-ui .opblock.opblock-get .opblock-summary-method {
      background: #6b21a8;
    }
    
    .swagger-ui .opblock.opblock-post .opblock-summary-method {
      background: #10b981;
    }
    
    .swagger-ui .opblock.opblock-put .opblock-summary-method {
      background: #f59e0b;
    }
    
    .swagger-ui .opblock.opblock-delete .opblock-summary-method {
      background: #ef4444;
    }
    
    .swagger-ui .scheme-container {
      background: #F1E0FF;
      box-shadow: none;
    }
    
    .swagger-ui .model-box {
      background: rgba(241, 224, 255, 0.3);
      border-radius: 4px;
    }
    
    .swagger-ui .tab li {
      color: #6b21a8;
      font-weight: 700;
    }
    
    .swagger-ui .tab li.active {
      border-bottom-color: #6b21a8;
    }
    
    .download-url-wrapper input {
      border: 1px solid #E0C4FF;
      font-family: 'JetBrains Mono', monospace;
    }
    
    .swagger-ui .btn.execute {
      background-color: #6b21a8;
      font-family: 'JetBrains Mono', monospace;
    }
    
    .swagger-ui .response-col_status {
      font-family: 'JetBrains Mono', monospace;
    }
    
    .swagger-ui .response-col_links {
      font-family: 'JetBrains Mono', monospace;
    }
    
    .swagger-ui textarea {
      font-family: 'JetBrains Mono', monospace !important;
    }
    
    .swagger-ui .parameters-col_description input {
      font-family: 'JetBrains Mono', monospace;
    }
    
    .swagger-ui .parameters-col_description select {
      font-family: 'JetBrains Mono', monospace;
    }
    
    .swagger-ui .curl {
      font-family: 'JetBrains Mono', monospace !important;
    }
    
    .swagger-ui .markdown code {
      font-family: 'JetBrains Mono', monospace !important;
    }
  `;
export { css };
