import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HelpCircle, Mail, MessageSquare, Phone } from "lucide-react"

export default function HelpPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Help & Support</h1>
        <p className="text-muted-foreground">Get assistance with your account and services</p>
      </div>

      <Tabs defaultValue="faq">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="faq">FAQs</TabsTrigger>
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-4 pt-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I add money to my wallet?</AccordionTrigger>
              <AccordionContent>
                You can add money to your wallet by clicking on the "Add Money" button on your dashboard. We support
                various payment methods including credit/debit cards, UPI, and net banking.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>How do I recharge my mobile?</AccordionTrigger>
              <AccordionContent>
                To recharge your mobile, go to the Mobile Recharge section, enter your mobile number, select your
                operator, choose a plan or enter an amount, and proceed to payment.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>How do I recharge my DTH?</AccordionTrigger>
              <AccordionContent>
                To recharge your DTH, navigate to the DTH Recharge section, select your DTH operator, enter your
                subscriber ID, choose a plan or enter an amount, and complete the payment.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>How do I refer a friend?</AccordionTrigger>
              <AccordionContent>
                You can refer friends by going to the Referral Program section. Share your unique referral code or link
                with friends. When they sign up and complete their first transaction, both of you will receive rewards.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>What if my recharge fails?</AccordionTrigger>
              <AccordionContent>
                If your recharge fails, the amount will be refunded to your wallet within 24-48 hours. If you don't
                receive the refund, please contact our customer support.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>How do I update my profile information?</AccordionTrigger>
              <AccordionContent>
                You can update your profile information by going to the Profile section in the app. Click on Edit
                Profile to make changes to your personal information.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="contact" className="pt-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Phone className="h-5 w-5" />
                <div>
                  <CardTitle>Call Us</CardTitle>
                  <CardDescription>24/7 Customer Support</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-2">Our support team is available 24/7 to assist you.</p>
                <Button className="w-full">1800-123-4567</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Mail className="h-5 w-5" />
                <div>
                  <CardTitle>Email Us</CardTitle>
                  <CardDescription>Get a response within 24 hours</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-2">Send us an email and we'll get back to you within 24 hours.</p>
                <Button className="w-full">support@finapp.com</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                <div>
                  <CardTitle>Live Chat</CardTitle>
                  <CardDescription>Chat with our support team</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-2">Start a live chat with our support team for immediate assistance.</p>
                <Button className="w-full">Start Chat</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="guides" className="pt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started Guide</CardTitle>
                <CardDescription>Learn how to use the app</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 list-disc pl-5">
                  <li>Creating an account</li>
                  <li>Adding money to your wallet</li>
                  <li>Making your first recharge</li>
                  <li>Navigating the dashboard</li>
                  <li>Setting up payment methods</li>
                </ul>
                <Button className="mt-4 w-full">Read Guide</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Troubleshooting</CardTitle>
                <CardDescription>Solve common issues</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 list-disc pl-5">
                  <li>Payment failures</li>
                  <li>Recharge issues</li>
                  <li>Account verification problems</li>
                  <li>App performance issues</li>
                  <li>Login and security concerns</li>
                </ul>
                <Button className="mt-4 w-full">View Solutions</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-muted p-6 rounded-lg">
        <div className="flex items-start gap-4">
          <HelpCircle className="h-10 w-10 text-primary" />
          <div>
            <h3 className="text-xl font-semibold mb-2">Still need help?</h3>
            <p className="text-muted-foreground mb-4">
              If you couldn't find what you were looking for, our customer support team is ready to assist you.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button>Contact Support</Button>
              <Button variant="outline">Submit a Ticket</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
