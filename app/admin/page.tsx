import { getSiteContent } from "@/lib/kv-content-manager"
import { isKVAvailable } from "@/lib/kv-content-manager"
import { AdminTabs } from "@/components/admin/admin-tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle } from "lucide-react"

// Force dynamic rendering to always get fresh data
export const dynamic = "force-dynamic"

export const metadata = {
  title: "Admin Dashboard | Connecticut House Republicans",
  description: "Content management for the Connecticut House Republicans website",
}

export default async function AdminPage() {
  // Get the latest content
  const siteContent = await getSiteContent()
  const kvEnabled = isKVAvailable()

  return (
    <div className="container py-8">
      <h1 className="mb-6 text-3xl font-bold text-primary-navy">Website Content Management</h1>

      {kvEnabled ? (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>Storage Mode: Vercel KV (Redis)</AlertTitle>
          <AlertDescription>
            Changes will be saved to Vercel KV and will persist across deployments. Your changes will be immediately
            visible on the site.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="mb-6 border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle>Storage Mode: Local Only</AlertTitle>
          <AlertDescription>
            Vercel KV is not configured. Changes will only persist locally and won't be saved after deployment. To
            enable persistent storage, add Vercel KV to your project.
          </AlertDescription>
        </Alert>
      )}

      <AdminTabs initialContent={siteContent} />
    </div>
  )
}
