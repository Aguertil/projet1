import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
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
            <div className="flex items-center gap-4">
              <Badge variant="secondary">Demo Mode</Badge>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Monitor your API usage and manage your account
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Requests</CardDescription>
              <CardTitle className="text-3xl">0</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Credits Used</CardDescription>
              <CardTitle className="text-3xl">0</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500">of 100 available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Success Rate</CardDescription>
              <CardTitle className="text-3xl">100%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Avg Response Time</CardDescription>
              <CardTitle className="text-3xl">0ms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500">Last 100 requests</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Your subscription details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">Free Plan</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      100 screenshots per month
                    </p>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Credits Used</span>
                    <span className="text-sm font-medium">0 / 100</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                      style={{ width: '0%' }}
                    ></div>
                  </div>
                </div>
                <Button className="w-full">Upgrade to Pro</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage your API keys for authentication</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Production Key</span>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <div className="font-mono text-sm bg-white dark:bg-slate-950 p-2 rounded border">
                    sk_live_••••••••••••••••
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Created: Setup required
                  </p>
                </div>
                <div className="text-center">
                  <Button variant="outline" className="w-full">
                    Generate New Key
                  </Button>
                  <p className="text-xs text-slate-500 mt-2">
                    To get started, you need to set up the database and create an account
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest API requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-slate-500">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-lg font-medium mb-2">No activity yet</p>
              <p className="text-sm mb-4">
                Start making API requests to see your activity here
              </p>
              <Link href="/docs">
                <Button>View Documentation</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Start Guide</CardTitle>
            <CardDescription>Get started with the Screenshot API in minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Set up your database</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Run <code className="bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded">npx prisma db push</code> to create the database schema
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Install Playwright browsers</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Run <code className="bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded">npx playwright install chromium</code> to install the browser
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Create your account</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Use the admin endpoint to create a test user and API key
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Make your first request</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Test the API with a simple curl command
                  </p>
                  <div className="bg-slate-950 text-green-400 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                    <pre>{`curl -X POST http://localhost:43210/api/v1/screenshot \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com",
    "format": "PNG"
  }' \\
  --output test.png`}</pre>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
