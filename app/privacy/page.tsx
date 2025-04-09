import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: May 1, 2023</p>
      </div>

      <Tabs defaultValue="collection">
        <TabsList>
          <TabsTrigger value="collection">Data Collection</TabsTrigger>
          <TabsTrigger value="usage">Data Usage</TabsTrigger>
          <TabsTrigger value="sharing">Data Sharing</TabsTrigger>
          <TabsTrigger value="rights">Your Rights</TabsTrigger>
        </TabsList>

        <TabsContent value="collection" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We collect several types of information from and about users of our Service, including:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Personal Information:</strong> Name, email address, telephone number, address, and other
                  identifiers by which you may be contacted online or offline.
                </li>
                <li>
                  <strong>Financial Information:</strong> Payment details, transaction history, and billing information.
                </li>
                <li>
                  <strong>Device Information:</strong> Information about your device, internet connection, IP address,
                  and browser type.
                </li>
                <li>
                  <strong>Usage Data:</strong> Information about how you use our Service, including pages visited, time
                  spent, and features used.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How We Collect Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We collect information from you when you:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Register for an account</li>
                <li>Make a transaction</li>
                <li>Fill out forms</li>
                <li>Use our mobile application</li>
                <li>Communicate with us</li>
                <li>Browse our website</li>
              </ul>
              <p>
                We also collect information through cookies, web beacons, and other tracking technologies to analyze
                trends, administer the website, and track users' movements around the site.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We use the information we collect about you to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Provide, maintain, and improve our Service</li>
                <li>Process transactions and send related information</li>
                <li>Send you technical notices, updates, and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Develop new products and services</li>
                <li>Personalize your experience</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Detect, prevent, and address fraud and other illegal activities</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Legal Basis for Processing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We process your personal information based on:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Consent:</strong> You have given us permission to process your personal information.
                </li>
                <li>
                  <strong>Contract:</strong> Processing is necessary for the performance of a contract with you.
                </li>
                <li>
                  <strong>Legal Obligation:</strong> Processing is necessary for compliance with a legal obligation.
                </li>
                <li>
                  <strong>Legitimate Interests:</strong> Processing is necessary for our legitimate interests.
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sharing" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Information Sharing and Disclosure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We may share your personal information with:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Service Providers:</strong> Third parties that perform services on our behalf, such as payment
                  processing, data analysis, and customer service.
                </li>
                <li>
                  <strong>Business Partners:</strong> Companies with whom we partner to offer products or services.
                </li>
                <li>
                  <strong>Legal Authorities:</strong> When required by law or to protect our rights.
                </li>
                <li>
                  <strong>Affiliated Companies:</strong> Our subsidiaries and affiliates.
                </li>
              </ul>
              <p>
                We may also share aggregated or de-identified information, which cannot reasonably be used to identify
                you.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Retention</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this
                Privacy Policy, unless a longer retention period is required or permitted by law.
              </p>
              <p className="mt-2">
                When we no longer need to use your information, we will take steps to securely delete or anonymize it.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rights" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Rights and Choices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Depending on your location, you may have the following rights:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Access:</strong> You can request a copy of the personal information we hold about you.
                </li>
                <li>
                  <strong>Rectification:</strong> You can request that we correct inaccurate or incomplete information.
                </li>
                <li>
                  <strong>Erasure:</strong> You can request that we delete your personal information.
                </li>
                <li>
                  <strong>Restriction:</strong> You can request that we restrict the processing of your information.
                </li>
                <li>
                  <strong>Data Portability:</strong> You can request a copy of your data in a structured, commonly used
                  format.
                </li>
                <li>
                  <strong>Objection:</strong> You can object to our processing of your information.
                </li>
              </ul>
              <p className="mt-2">To exercise these rights, please contact us at privacy@finapp.com.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Our Service is not intended for children under the age of 13. We do not knowingly collect personal
                information from children under 13. If you are a parent or guardian and you are aware that your child
                has provided us with personal information, please contact us.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
