import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <nav className="border-b bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ScreenAPI
              </span>
            </Link>
            <Link href="/dashboard">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Dashboard
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">API Documentation</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Complete guide to integrating the Screenshot API
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
              <CardDescription>Secure your API requests with API keys</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                All API requests require authentication using an API key. Include your API key in
                the request header:
              </p>
              <div className="bg-slate-950 text-green-400 rounded-lg p-4 font-mono text-sm">
                <pre>x-api-key: sk_live_your_api_key_here</pre>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Security Note:</strong> Never expose your API keys in client-side code or
                  public repositories. Always keep them secure on your server.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>POST /api/v1/screenshot</CardTitle>
              <CardDescription>Capture a screenshot of any webpage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Request Headers</h3>
                <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-4 font-mono text-sm space-y-1">
                  <div>
                    <span className="text-blue-600 dark:text-blue-400">x-api-key:</span> YOUR_API_KEY
                  </div>
                  <div>
                    <span className="text-blue-600 dark:text-blue-400">Content-Type:</span>{' '}
                    application/json
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Request Body Parameters</h3>
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="font-mono text-sm">url</code>
                      <Badge>required</Badge>
                      <span className="text-sm text-slate-500">string</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      The URL of the webpage to capture
                    </p>
                  </div>

                  <div className="border-l-4 border-slate-300 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="font-mono text-sm">format</code>
                      <Badge variant="outline">optional</Badge>
                      <span className="text-sm text-slate-500">PNG | JPEG | WEBP</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Image format. Default: PNG
                    </p>
                  </div>

                  <div className="border-l-4 border-slate-300 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="font-mono text-sm">quality</code>
                      <Badge variant="outline">optional</Badge>
                      <span className="text-sm text-slate-500">1-100</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      JPEG quality (only for JPEG format). Default: 80
                    </p>
                  </div>

                  <div className="border-l-4 border-slate-300 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="font-mono text-sm">viewportType</code>
                      <Badge variant="outline">optional</Badge>
                      <span className="text-sm text-slate-500">
                        DESKTOP | MOBILE | TABLET | CUSTOM
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Viewport type. Default: DESKTOP (1920x1080)
                    </p>
                  </div>

                  <div className="border-l-4 border-slate-300 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="font-mono text-sm">viewportWidth</code>
                      <Badge variant="outline">optional</Badge>
                      <span className="text-sm text-slate-500">200-3840</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Custom viewport width (required if viewportType is CUSTOM)
                    </p>
                  </div>

                  <div className="border-l-4 border-slate-300 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="font-mono text-sm">viewportHeight</code>
                      <Badge variant="outline">optional</Badge>
                      <span className="text-sm text-slate-500">200-2160</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Custom viewport height (required if viewportType is CUSTOM)
                    </p>
                  </div>

                  <div className="border-l-4 border-slate-300 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="font-mono text-sm">fullPage</code>
                      <Badge variant="outline">optional</Badge>
                      <span className="text-sm text-slate-500">boolean</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Capture the entire page. Default: false
                    </p>
                  </div>

                  <div className="border-l-4 border-slate-300 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="font-mono text-sm">waitForSelector</code>
                      <Badge variant="outline">optional</Badge>
                      <span className="text-sm text-slate-500">string</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      CSS selector to wait for before capturing
                    </p>
                  </div>

                  <div className="border-l-4 border-slate-300 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="font-mono text-sm">hideElements</code>
                      <Badge variant="outline">optional</Badge>
                      <span className="text-sm text-slate-500">string[]</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Array of CSS selectors to hide before capturing
                    </p>
                  </div>

                  <div className="border-l-4 border-slate-300 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="font-mono text-sm">blockCookies</code>
                      <Badge variant="outline">optional</Badge>
                      <span className="text-sm text-slate-500">boolean</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Automatically hide cookie banners. Default: true
                    </p>
                  </div>

                  <div className="border-l-4 border-slate-300 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="font-mono text-sm">blockAds</code>
                      <Badge variant="outline">optional</Badge>
                      <span className="text-sm text-slate-500">boolean</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Block common ad networks. Default: false
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Response</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Returns the screenshot as binary image data with the following headers:
                </p>
                <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-4 font-mono text-sm space-y-1">
                  <div>
                    <span className="text-blue-600 dark:text-blue-400">Content-Type:</span>{' '}
                    image/png | image/jpeg | image/webp
                  </div>
                  <div>
                    <span className="text-blue-600 dark:text-blue-400">X-Screenshot-Width:</span>{' '}
                    1920
                  </div>
                  <div>
                    <span className="text-blue-600 dark:text-blue-400">X-Screenshot-Height:</span>{' '}
                    1080
                  </div>
                  <div>
                    <span className="text-blue-600 dark:text-blue-400">X-Processing-Time-Ms:</span>{' '}
                    2341
                  </div>
                  <div>
                    <span className="text-blue-600 dark:text-blue-400">X-Credits-Used:</span> 1
                  </div>
                  <div>
                    <span className="text-blue-600 dark:text-blue-400">X-Credits-Remaining:</span>{' '}
                    99
                  </div>
                  <div>
                    <span className="text-blue-600 dark:text-blue-400">X-RateLimit-Limit:</span> 60
                  </div>
                  <div>
                    <span className="text-blue-600 dark:text-blue-400">X-RateLimit-Remaining:</span>{' '}
                    59
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Example Requests</CardTitle>
              <CardDescription>Common use cases and code examples</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Basic Screenshot (cURL)</h3>
                <div className="bg-slate-950 text-green-400 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                  <pre>{`curl -X POST http://localhost:43210/api/v1/screenshot \\
  -H "x-api-key: sk_live_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com"
  }' \\
  --output screenshot.png`}</pre>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Full Page Screenshot (cURL)</h3>
                <div className="bg-slate-950 text-green-400 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                  <pre>{`curl -X POST http://localhost:43210/api/v1/screenshot \\
  -H "x-api-key: sk_live_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com",
    "fullPage": true,
    "format": "WEBP"
  }' \\
  --output fullpage.webp`}</pre>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Mobile Screenshot (JavaScript/Node.js)</h3>
                <div className="bg-slate-950 text-green-400 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                  <pre>{`const response = await fetch('http://localhost:43210/api/v1/screenshot', {
  method: 'POST',
  headers: {
    'x-api-key': 'sk_live_your_api_key',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://example.com',
    viewportType: 'MOBILE',
    format: 'PNG'
  })
});

const buffer = await response.arrayBuffer();
await fs.writeFile('mobile-screenshot.png', Buffer.from(buffer));`}</pre>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Custom Viewport (Python)</h3>
                <div className="bg-slate-950 text-green-400 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                  <pre>{`import requests

response = requests.post(
    'http://localhost:43210/api/v1/screenshot',
    headers={
        'x-api-key': 'sk_live_your_api_key',
        'Content-Type': 'application/json'
    },
    json={
        'url': 'https://example.com',
        'viewportType': 'CUSTOM',
        'viewportWidth': 1280,
        'viewportHeight': 720,
        'format': 'JPEG',
        'quality': 90
    }
)

with open('screenshot.jpg', 'wb') as f:
    f.write(response.content)`}</pre>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Error Responses</CardTitle>
              <CardDescription>Handling errors in your integration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-red-500 pl-4">
                  <p className="font-mono text-sm mb-1">401 Unauthorized</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Invalid or missing API key
                  </p>
                </div>

                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-mono text-sm mb-1">402 Payment Required</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Insufficient credits
                  </p>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4">
                  <p className="font-mono text-sm mb-1">429 Too Many Requests</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Rate limit exceeded
                  </p>
                </div>

                <div className="border-l-4 border-red-500 pl-4">
                  <p className="font-mono text-sm mb-1">500 Internal Server Error</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Screenshot capture failed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rate Limits</CardTitle>
              <CardDescription>Understand your plan limits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Free</span>
                  <span className="text-slate-600 dark:text-slate-400">
                    10 requests/minute
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Pro</span>
                  <span className="text-slate-600 dark:text-slate-400">
                    60 requests/minute
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium">Enterprise</span>
                  <span className="text-slate-600 dark:text-slate-400">
                    300 requests/minute
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
