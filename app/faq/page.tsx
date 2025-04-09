"use client"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HelpCircle, Search } from "lucide-react"

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const faqCategories = [
    {
      id: "account",
      name: "Account",
      faqs: [
        {
          question: "How do I create an account?",
          answer:
            "To create an account, download our app from the App Store or Google Play Store, open it, and tap on 'Sign Up'. Follow the on-screen instructions to complete your registration.",
        },
        {
          question: "How do I reset my password?",
          answer:
            "To reset your password, go to the login screen and tap on 'Forgot Password'. Enter your registered email address, and we'll send you a password reset link.",
        },
        {
          question: "Can I have multiple accounts?",
          answer: "No, our policy allows only one account per user. This helps us maintain security and prevent fraud.",
        },
        {
          question: "How do I update my profile information?",
          answer:
            "To update your profile information, go to the Profile section in the app, tap on 'Edit Profile', make your changes, and save them.",
        },
      ],
    },
    {
      id: "payments",
      name: "Payments",
      faqs: [
        {
          question: "What payment methods are accepted?",
          answer:
            "We accept various payment methods including credit/debit cards, UPI, net banking, and wallet balance.",
        },
        {
          question: "How long does it take for a payment to be processed?",
          answer:
            "Most payments are processed instantly. However, in some cases, it might take up to 24 hours depending on your bank's processing time.",
        },
        {
          question: "Is there a limit on transaction amounts?",
          answer:
            "Yes, there are daily and monthly transaction limits. The default limits are â‚¹10,000 per day and â‚¹1,00,000 per month. You can increase these limits by completing KYC verification.",
        },
        {
          question: "What if my payment fails?",
          answer:
            "If your payment fails, the amount will be refunded to your source account within 5-7 business days. You can check the status of your refund in the Transaction History section.",
        },
      ],
    },
    {
      id: "recharges",
      name: "Recharges",
      faqs: [
        {
          question: "How do I recharge my mobile?",
          answer:
            "To recharge your mobile, go to the Mobile Recharge section, enter your mobile number, select your operator, choose a plan or enter an amount, and proceed to payment.",
        },
        {
          question: "How do I recharge my DTH?",
          answer:
            "To recharge your DTH, navigate to the DTH Recharge section, select your DTH operator, enter your subscriber ID, choose a plan or enter an amount, and complete the payment.",
        },
        {
          question: "Can I schedule recurring recharges?",
          answer:
            "Yes, you can schedule recurring recharges for your mobile and DTH. Go to the respective recharge section, complete the recharge process, and enable the 'Schedule Recurring' option before payment.",
        },
        {
          question: "How do I check my recharge history?",
          answer:
            "You can check your recharge history in the Transaction History section. Filter by 'Recharges' to see all your past recharges.",
        },
      ],
    },
    {
      id: "wallet",
      name: "Wallet",
      faqs: [
        {
          question: "How do I add money to my wallet?",
          answer:
            "To add money to your wallet, go to the Wallet section and tap on 'Add Money'. Enter the amount you want to add and select your preferred payment method.",
        },
        {
          question: "Is there a fee for adding money to my wallet?",
          answer:
            "No, there is no fee for adding money to your wallet using UPI or net banking. However, some banks might charge a nominal fee for credit card transactions.",
        },
        {
          question: "Can I withdraw money from my wallet?",
          answer:
            "Yes, you can withdraw money from your wallet to your linked bank account. Go to the Wallet section, tap on 'Withdraw', enter the amount, and confirm.",
        },
        {
          question: "How long does it take to withdraw money from my wallet?",
          answer:
            "Withdrawals are typically processed within 24-48 hours. The exact time depends on your bank's processing time.",
        },
      ],
    },
    {
      id: "security",
      name: "Security",
      faqs: [
        {
          question: "How secure is my data?",
          answer:
            "We take data security very seriously. All your data is encrypted and stored securely. We use industry-standard security measures to protect your information.",
        },
        {
          question: "What should I do if I suspect unauthorized activity?",
          answer:
            "If you suspect unauthorized activity, immediately change your password and contact our customer support. We'll help you secure your account and investigate the issue.",
        },
        {
          question: "How can I enable two-factor authentication?",
          answer:
            "To enable two-factor authentication, go to the Security section in your Profile, tap on 'Two-Factor Authentication', and follow the instructions.",
        },
        {
          question: "Are my transactions secure?",
          answer:
            "Yes, all transactions are secured with end-to-end encryption. We also have fraud detection systems in place to monitor and prevent suspicious activities.",
        },
      ],
    },
  ]

  const filteredFAQs = searchQuery
    ? faqCategories
        .map((category) => ({
          ...category,
          faqs: category.faqs.filter(
            (faq) =>
              faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
              faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
        }))
        .filter((category) => category.faqs.length > 0)
    : faqCategories

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
        <p className="text-muted-foreground">Find answers to common questions about our services</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search for answers..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {searchQuery && filteredFAQs.length === 0 ? (
        <Card>
          <CardContent className="p-8 flex flex-col items-center justify-center">
            <HelpCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No results found</h3>
            <p className="text-muted-foreground text-center mb-4">
              We couldn't find any FAQs matching your search. Try different keywords or contact our support team.
            </p>
            <Button>Contact Support</Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue={faqCategories[0].id}>
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
            {faqCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {filteredFAQs.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                {category.faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          ))}
        </Tabs>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Still have questions?</CardTitle>
          <CardDescription>
            If you couldn't find the answer to your question, our support team is here to help.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Button className="flex-1">Contact Support</Button>
          <Button variant="outline" className="flex-1">
            Browse Help Center
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
