# ScreenAPI - Code Examples & Integration Guide

Ce document fournit des exemples complets d'intégration de l'API ScreenAPI dans différents langages et frameworks.

## Table des Matières

- [JavaScript/Node.js](#javascriptnodejs)
- [Python](#python)
- [PHP](#php)
- [Ruby](#ruby)
- [Go](#go)
- [Java](#java)
- [C#/.NET](#cnet)
- [Rust](#rust)
- [Use Cases](#use-cases)

---

## JavaScript/Node.js

### Installation

```bash
npm install axios form-data
```

### Basic Screenshot

```javascript
const axios = require('axios');
const fs = require('fs');

async function captureScreenshot(url) {
  try {
    const response = await axios({
      method: 'post',
      url: 'http://localhost:43210/api/v1/screenshot',
      headers: {
        'x-api-key': 'sk_live_your_api_key_here',
        'Content-Type': 'application/json',
      },
      data: {
        url: url,
        format: 'PNG',
        viewportType: 'DESKTOP',
      },
      responseType: 'arraybuffer',
    });

    fs.writeFileSync('screenshot.png', response.data);
    
    console.log('Screenshot saved!');
    console.log('Credits remaining:', response.headers['x-credits-remaining']);
    console.log('Processing time:', response.headers['x-processing-time-ms'], 'ms');
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

captureScreenshot('https://example.com');
```

### Full Page Screenshot with Options

```javascript
const captureFullPage = async (url, options = {}) => {
  const defaultOptions = {
    url,
    format: 'WEBP',
    fullPage: true,
    blockCookies: true,
    blockAds: true,
    hideElements: ['.advertisement', '#cookie-banner'],
    waitForTimeout: 30000,
  };

  const response = await axios.post(
    'http://localhost:43210/api/v1/screenshot',
    { ...defaultOptions, ...options },
    {
      headers: {
        'x-api-key': process.env.SCREENAPI_KEY,
        'Content-Type': 'application/json',
      },
      responseType: 'arraybuffer',
    }
  );

  return {
    buffer: response.data,
    width: parseInt(response.headers['x-screenshot-width']),
    height: parseInt(response.headers['x-screenshot-height']),
    creditsRemaining: parseInt(response.headers['x-credits-remaining']),
    processingTime: parseInt(response.headers['x-processing-time-ms']),
  };
};

// Usage
const result = await captureFullPage('https://example.com');
fs.writeFileSync('fullpage.webp', result.buffer);
console.log(`Captured ${result.width}x${result.height} in ${result.processingTime}ms`);
```

### Mobile Viewport Screenshot

```javascript
async function captureMobileScreenshot(url) {
  const response = await axios.post(
    'http://localhost:43210/api/v1/screenshot',
    {
      url,
      viewportType: 'MOBILE',
      format: 'PNG',
    },
    {
      headers: { 'x-api-key': process.env.SCREENAPI_KEY },
      responseType: 'arraybuffer',
    }
  );

  return response.data;
}
```

### TypeScript with Full Types

```typescript
import axios, { AxiosResponse } from 'axios';
import fs from 'fs/promises';

interface ScreenshotOptions {
  url: string;
  format?: 'PNG' | 'JPEG' | 'WEBP';
  quality?: number;
  viewportType?: 'DESKTOP' | 'MOBILE' | 'TABLET' | 'CUSTOM';
  viewportWidth?: number;
  viewportHeight?: number;
  fullPage?: boolean;
  waitForSelector?: string;
  waitForTimeout?: number;
  hideElements?: string[];
  blockCookies?: boolean;
  blockAds?: boolean;
}

interface ScreenshotResult {
  buffer: Buffer;
  width: number;
  height: number;
  format: string;
  processingTime: number;
  creditsUsed: number;
  creditsRemaining: number;
  requestId: string;
}

class ScreenAPIClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl = 'http://localhost:43210') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async capture(options: ScreenshotOptions): Promise<ScreenshotResult> {
    const response = await axios.post<ArrayBuffer>(
      `${this.baseUrl}/api/v1/screenshot`,
      options,
      {
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      }
    );

    return {
      buffer: Buffer.from(response.data),
      width: parseInt(response.headers['x-screenshot-width']),
      height: parseInt(response.headers['x-screenshot-height']),
      format: response.headers['x-screenshot-format'],
      processingTime: parseInt(response.headers['x-processing-time-ms']),
      creditsUsed: parseInt(response.headers['x-credits-used']),
      creditsRemaining: parseInt(response.headers['x-credits-remaining']),
      requestId: response.headers['x-request-id'],
    };
  }

  async captureToFile(
    options: ScreenshotOptions,
    outputPath: string
  ): Promise<void> {
    const result = await this.capture(options);
    await fs.writeFile(outputPath, result.buffer);
    console.log(`Screenshot saved to ${outputPath}`);
    console.log(`Credits remaining: ${result.creditsRemaining}`);
  }
}

// Usage
const client = new ScreenAPIClient(process.env.SCREENAPI_KEY!);

await client.captureToFile(
  {
    url: 'https://example.com',
    format: 'PNG',
    fullPage: true,
  },
  'output.png'
);
```

---

## Python

### Installation

```bash
pip install requests
```

### Basic Usage

```python
import requests
import os

def capture_screenshot(url, output_path='screenshot.png'):
    response = requests.post(
        'http://localhost:43210/api/v1/screenshot',
        headers={
            'x-api-key': os.environ['SCREENAPI_KEY'],
            'Content-Type': 'application/json'
        },
        json={
            'url': url,
            'format': 'PNG'
        }
    )
    
    if response.status_code == 200:
        with open(output_path, 'wb') as f:
            f.write(response.content)
        
        print(f'Screenshot saved to {output_path}')
        print(f'Credits remaining: {response.headers["x-credits-remaining"]}')
        print(f'Processing time: {response.headers["x-processing-time-ms"]}ms')
    else:
        print(f'Error: {response.json()}')

capture_screenshot('https://example.com')
```

### Advanced Client Class

```python
import requests
from typing import Optional, List
from dataclasses import dataclass

@dataclass
class ScreenshotResult:
    buffer: bytes
    width: int
    height: int
    format: str
    processing_time: int
    credits_remaining: int
    request_id: str

class ScreenAPIClient:
    def __init__(self, api_key: str, base_url: str = 'http://localhost:43210'):
        self.api_key = api_key
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({'x-api-key': api_key})
    
    def capture(
        self,
        url: str,
        format: str = 'PNG',
        quality: Optional[int] = None,
        viewport_type: str = 'DESKTOP',
        viewport_width: Optional[int] = None,
        viewport_height: Optional[int] = None,
        full_page: bool = False,
        wait_for_selector: Optional[str] = None,
        hide_elements: Optional[List[str]] = None,
        block_cookies: bool = True,
        block_ads: bool = False
    ) -> ScreenshotResult:
        data = {
            'url': url,
            'format': format,
            'viewportType': viewport_type,
            'fullPage': full_page,
            'blockCookies': block_cookies,
            'blockAds': block_ads
        }
        
        if quality:
            data['quality'] = quality
        if viewport_width:
            data['viewportWidth'] = viewport_width
        if viewport_height:
            data['viewportHeight'] = viewport_height
        if wait_for_selector:
            data['waitForSelector'] = wait_for_selector
        if hide_elements:
            data['hideElements'] = hide_elements
        
        response = self.session.post(
            f'{self.base_url}/api/v1/screenshot',
            json=data
        )
        response.raise_for_status()
        
        return ScreenshotResult(
            buffer=response.content,
            width=int(response.headers['x-screenshot-width']),
            height=int(response.headers['x-screenshot-height']),
            format=response.headers['x-screenshot-format'],
            processing_time=int(response.headers['x-processing-time-ms']),
            credits_remaining=int(response.headers['x-credits-remaining']),
            request_id=response.headers['x-request-id']
        )
    
    def capture_to_file(self, url: str, output_path: str, **kwargs):
        result = self.capture(url, **kwargs)
        with open(output_path, 'wb') as f:
            f.write(result.buffer)
        return result

# Usage
client = ScreenAPIClient(os.environ['SCREENAPI_KEY'])
result = client.capture_to_file(
    'https://example.com',
    'screenshot.png',
    full_page=True,
    format='PNG'
)
print(f'Captured {result.width}x{result.height} in {result.processing_time}ms')
```

---

## PHP

### Basic Usage

```php
<?php

function captureScreenshot($url, $outputPath = 'screenshot.png') {
    $apiKey = getenv('SCREENAPI_KEY');
    
    $data = [
        'url' => $url,
        'format' => 'PNG'
    ];
    
    $ch = curl_init('http://localhost:43210/api/v1/screenshot');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'x-api-key: ' . $apiKey,
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_HEADERFUNCTION, function($curl, $header) use (&$headers) {
        $headers[] = $header;
        return strlen($header);
    });
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        file_put_contents($outputPath, $response);
        echo "Screenshot saved to $outputPath\n";
    } else {
        echo "Error: HTTP $httpCode\n";
    }
}

captureScreenshot('https://example.com');
?>
```

### OOP Client

```php
<?php

class ScreenAPIClient {
    private string $apiKey;
    private string $baseUrl;
    
    public function __construct(string $apiKey, string $baseUrl = 'http://localhost:43210') {
        $this->apiKey = $apiKey;
        $this->baseUrl = $baseUrl;
    }
    
    public function capture(array $options): array {
        $ch = curl_init($this->baseUrl . '/api/v1/screenshot');
        
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($options),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'x-api-key: ' . $this->apiKey,
                'Content-Type: application/json'
            ],
            CURLOPT_HEADER => true
        ]);
        
        $response = curl_exec($ch);
        $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        
        curl_close($ch);
        
        if ($httpCode !== 200) {
            throw new Exception("API returned HTTP $httpCode");
        }
        
        $headers = substr($response, 0, $headerSize);
        $body = substr($response, $headerSize);
        
        return [
            'buffer' => $body,
            'headers' => $this->parseHeaders($headers)
        ];
    }
    
    public function captureToFile(string $url, string $outputPath, array $options = []): void {
        $options['url'] = $url;
        $result = $this->capture($options);
        file_put_contents($outputPath, $result['buffer']);
    }
    
    private function parseHeaders(string $headers): array {
        $parsed = [];
        $lines = explode("\r\n", $headers);
        foreach ($lines as $line) {
            if (strpos($line, ':') !== false) {
                [$key, $value] = explode(':', $line, 2);
                $parsed[strtolower(trim($key))] = trim($value);
            }
        }
        return $parsed;
    }
}

// Usage
$client = new ScreenAPIClient(getenv('SCREENAPI_KEY'));
$client->captureToFile('https://example.com', 'screenshot.png', [
    'format' => 'PNG',
    'fullPage' => true
]);
?>
```

---

## Ruby

```ruby
require 'net/http'
require 'json'
require 'uri'

class ScreenAPIClient
  def initialize(api_key, base_url = 'http://localhost:43210')
    @api_key = api_key
    @base_url = base_url
  end

  def capture(options)
    uri = URI("#{@base_url}/api/v1/screenshot")
    
    http = Net::HTTP.new(uri.host, uri.port)
    request = Net::HTTP::Post.new(uri.path)
    request['x-api-key'] = @api_key
    request['Content-Type'] = 'application/json'
    request.body = options.to_json

    response = http.request(request)
    
    unless response.is_a?(Net::HTTPSuccess)
      raise "API error: #{response.code} - #{response.body}"
    end

    {
      buffer: response.body,
      width: response['x-screenshot-width'].to_i,
      height: response['x-screenshot-height'].to_i,
      credits_remaining: response['x-credits-remaining'].to_i
    }
  end

  def capture_to_file(url, output_path, options = {})
    result = capture(options.merge(url: url))
    File.binwrite(output_path, result[:buffer])
    result
  end
end

# Usage
client = ScreenAPIClient.new(ENV['SCREENAPI_KEY'])
result = client.capture_to_file('https://example.com', 'screenshot.png', {
  format: 'PNG',
  fullPage: true
})

puts "Screenshot saved! Credits remaining: #{result[:credits_remaining]}"
```

---

## Go

```go
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "os"
)

type ScreenshotOptions struct {
    URL          string   `json:"url"`
    Format       string   `json:"format,omitempty"`
    ViewportType string   `json:"viewportType,omitempty"`
    FullPage     bool     `json:"fullPage,omitempty"`
    BlockCookies bool     `json:"blockCookies,omitempty"`
    HideElements []string `json:"hideElements,omitempty"`
}

type ScreenAPIClient struct {
    APIKey  string
    BaseURL string
    Client  *http.Client
}

func NewScreenAPIClient(apiKey string) *ScreenAPIClient {
    return &ScreenAPIClient{
        APIKey:  apiKey,
        BaseURL: "http://localhost:43210",
        Client:  &http.Client{},
    }
}

func (c *ScreenAPIClient) Capture(opts ScreenshotOptions) ([]byte, error) {
    jsonData, err := json.Marshal(opts)
    if err != nil {
        return nil, err
    }

    req, err := http.NewRequest("POST", c.BaseURL+"/api/v1/screenshot", bytes.NewBuffer(jsonData))
    if err != nil {
        return nil, err
    }

    req.Header.Set("x-api-key", c.APIKey)
    req.Header.Set("Content-Type", "application/json")

    resp, err := c.Client.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        return nil, fmt.Errorf("API error: %d", resp.StatusCode)
    }

    return io.ReadAll(resp.Body)
}

func (c *ScreenAPIClient) CaptureToFile(url, outputPath string, opts ScreenshotOptions) error {
    opts.URL = url
    
    data, err := c.Capture(opts)
    if err != nil {
        return err
    }

    return os.WriteFile(outputPath, data, 0644)
}

func main() {
    client := NewScreenAPIClient(os.Getenv("SCREENAPI_KEY"))
    
    err := client.CaptureToFile("https://example.com", "screenshot.png", ScreenshotOptions{
        Format:   "PNG",
        FullPage: true,
    })
    
    if err != nil {
        fmt.Printf("Error: %v\n", err)
        return
    }
    
    fmt.Println("Screenshot saved!")
}
```

---

## Use Cases

### 1. Website Monitoring

```javascript
const cron = require('node-cron');

// Capture screenshot every hour
cron.schedule('0 * * * *', async () => {
  const screenshot = await client.capture({
    url: 'https://mywebsite.com',
    format: 'PNG',
    fullPage: true,
  });
  
  const filename = `monitoring/${Date.now()}.png`;
  await fs.writeFile(filename, screenshot.buffer);
  
  // Compare with previous screenshot for changes
  // Send alert if significant changes detected
});
```

### 2. Automated Testing

```javascript
describe('Homepage rendering', () => {
  it('should match baseline screenshot', async () => {
    const screenshot = await client.capture({
      url: 'http://localhost:3000',
      viewportType: 'DESKTOP',
    });
    
    expect(screenshot.buffer).toMatchImageSnapshot();
  });
});
```

### 3. PDF Generation

```javascript
async function generatePDF(urls) {
  const screenshots = await Promise.all(
    urls.map(url => client.capture({
      url,
      format: 'PNG',
      fullPage: true,
    }))
  );
  
  // Combine screenshots into PDF
  return createPDFFromImages(screenshots);
}
```

### 4. Social Media Previews

```javascript
async function generateOGImage(url) {
  const screenshot = await client.capture({
    url,
    viewportWidth: 1200,
    viewportHeight: 630,
    viewportType: 'CUSTOM',
    format: 'JPEG',
    quality: 90,
  });
  
  // Upload to CDN
  const ogImageUrl = await uploadToCDN(screenshot.buffer);
  return ogImageUrl;
}
```

---

## Rate Limit Handling

```javascript
async function captureWithRetry(options, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await client.capture(options);
    } catch (error) {
      if (error.response?.status === 429) {
        const retryAfter = parseInt(error.response.headers['retry-after'] || 60);
        console.log(`Rate limited. Retrying after ${retryAfter}s...`);
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      } else {
        throw error;
      }
    }
  }
  throw new Error('Max retries exceeded');
}
```

---

**Plus d'exemples sur:** https://github.com/yourorg/screenapi-examples
