import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TermsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Terms and Conditions</h1>
        <p className="text-muted-foreground">Last updated: May 1, 2023</p>
      </div>

      <Tabs defaultValue="terms">
        <TabsList>
          <TabsTrigger value="terms">Terms of Service</TabsTrigger>
          <TabsTrigger value="usage">Acceptable Use</TabsTrigger>
          <TabsTrigger value="payments">Payment Terms</TabsTrigger>
        </TabsList>

        <TabsContent value="terms" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>1. Introduction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Welcome to FinApp. These Terms and Conditions govern your use of our website and mobile application
                (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms.
              </p>
              <p>
                If you disagree with any part of the terms, you may not access the Service. Your continued use of the
                Service constitutes your acceptance of these Terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Definitions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                <strong>"Service"</strong> refers to the website and mobile application operated by FinApp.
              </p>
              <p>
                <strong>"User"</strong> refers to the individual accessing or using the Service, or the company, or
                other legal entity on behalf of which such individual is accessing or using the Service.
              </p>
              <p>
                <strong>"Content"</strong> refers to all information, text, graphics, photos or other materials
                uploaded, downloaded or appearing on the Service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. User Accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                When you create an account with us, you must provide information that is accurate, complete, and current
                at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate
                termination of your account on our Service.
              </p>
              <p>
                You are responsible for safeguarding the password that you use to access the Service and for any
                activities or actions under your password, whether your password is with our Service or a third-party
                service.
              </p>
              <p>
                You agree not to disclose your password to any third party. You must notify us immediately upon becoming
                aware of any breach of security or unauthorized use of your account.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The Service and its original content, features, and functionality are and will remain the exclusive
                property of FinApp and its licensors. The Service is protected by copyright, trademark, and other laws
                of both the United States and foreign countries.
              </p>
              <p>
                Our trademarks and trade dress may not be used in connection with any product or service without the
                prior written consent of FinApp.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>1. Acceptable Use Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                You agree not to use the Service for any purpose that is prohibited by these Terms. You are responsible
                for all of your activity in connection with the Service.
              </p>
              <p>
                You shall not: (a) take any action that imposes or may impose an unreasonable or disproportionately
                large load on our infrastructure; (b) interfere or attempt to interfere with the proper working of the
                Service or any activities conducted on the Service; (c) bypass any measures we may use to prevent or
                restrict access to the Service; (d) use manual or automated software, devices, or other processes to
                "crawl" or "spider" any page of the Service; or (e) harvest or scrape any Content from the Service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Prohibited Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">You may not engage in any of the following prohibited activities:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Violating any applicable laws or regulations</li>
                <li>Impersonating another person or entity</li>
                <li>Engaging in unauthorized framing or linking to the Service</li>
                <li>Uploading or transmitting viruses or malicious code</li>
                <li>Collecting or tracking personal information of other users</li>
                <li>Spamming, phishing, or pharming</li>
                <li>Using the Service for any illegal purpose</li>
                <li>Interfering with or disrupting the Service</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>1. Payment Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                By using our payment services, you agree to pay all charges at the prices then in effect for your
                purchases, and you authorize us to charge your chosen payment provider for any such amounts.
              </p>
              <p>
                We reserve the right to correct any errors or mistakes in pricing, even if we have already requested or
                received payment.
              </p>
              <p>
                We reserve the right to refuse any order placed through the Service. We may, in our sole discretion,
                limit or cancel quantities purchased per person, per household, or per order.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Refunds and Cancellations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                All sales are final and no refund will be issued except in our sole discretion. If a refund is issued,
                it will be processed to the original method of payment.
              </p>
              <p>
                In case of failed transactions, the amount will be automatically refunded to your wallet or original
                payment method within 5-7 business days.
              </p>
              <p>
                We reserve the right to cancel any transaction if we suspect fraudulent activity or violation of our
                terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Taxes</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                You are responsible for paying all taxes associated with your purchases through the Service. We may
                collect applicable sales tax on products sold to customers in states where we have a legal obligation to
                do so.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
