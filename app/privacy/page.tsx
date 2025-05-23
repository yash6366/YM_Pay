import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-3">Information We Collect</h2>
            <p className="text-gray-600">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
              <li>Name and contact information</li>
              <li>Payment and transaction data</li>
              <li>Device and usage information</li>
              <li>Communication preferences</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">How We Use Your Information</h2>
            <p className="text-gray-600">
              We use the collected information to:
            </p>
            <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
              <li>Process your transactions</li>
              <li>Provide customer support</li>
              <li>Improve our services</li>
              <li>Send important updates</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">Data Security</h2>
            <p className="text-gray-600">
              We implement appropriate security measures to protect your personal information from unauthorized access, disclosure, or misuse.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}