import { Scale, AlertTriangle } from "lucide-react"

const NoTrustClientPage = () => {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold text-center mb-8">No Trust Client Page</h1>

      {/* Introduction Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
        <p className="text-gray-700">This page provides information about HB 7259 and its implications.</p>
      </section>

      {/* Real Cases Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Real Cases</h2>
        <p className="text-gray-700">Examples of situations where HB 7259 could be relevant.</p>

        {/* Image Placeholder */}
        <div className="mt-12 bg-white rounded-lg p-8 text-center">
          <div className="text-gray-400 mb-4">
            <Scale className="h-16 w-16 mx-auto mb-4" />
          </div>
        </div>
      </section>

      {/* What HB 7259 Does Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">What HB 7259 Does</h2>
        <p className="text-gray-700">Explanation of the key provisions of HB 7259.</p>

        {/* Image Placeholder */}
        <div className="mt-12 bg-gray-100 rounded-lg p-8 text-center">
          <div className="text-gray-400 mb-4">
            <AlertTriangle className="h-16 w-16 mx-auto mb-4" />
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Resources</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>
            <a href="#" className="text-blue-500 hover:underline">
              Link to HB 7259 Text
            </a>
          </li>
          <li>
            <a href="#" className="text-blue-500 hover:underline">
              Related Articles
            </a>
          </li>
        </ul>
      </section>
    </div>
  )
}

export default NoTrustClientPage
