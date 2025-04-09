import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Clock, Globe, Shield, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-6 space-y-12">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold">About FinApp</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          We're on a mission to make digital payments simple, secure, and accessible for everyone.
        </p>
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Our Story</h2>
          <p className="text-muted-foreground">
            Founded in 2018, FinApp started with a simple idea: to make digital payments as easy as sending a text
            message. What began as a small startup with just 5 team members has now grown into a trusted financial
            technology company serving millions of users across the country.
          </p>
          <p className="text-muted-foreground">
            Our journey has been driven by a passion for innovation and a commitment to solving real problems. We've
            continuously evolved our platform to meet the changing needs of our users, adding new features and services
            while maintaining our core focus on simplicity and security.
          </p>
          <p className="text-muted-foreground">
            Today, FinApp is more than just a payment app â€“ it's a comprehensive financial platform that helps users
            manage their money, make payments, and access a wide range of services, all from a single, easy-to-use
            interface.
          </p>
        </div>
        <div className="bg-muted rounded-lg p-6 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Clock className="h-16 w-16 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">5+ Years</h3>
              <p className="text-muted-foreground">Of trusted service</p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="space-y-2">
                <div className="text-3xl font-bold">10M+</div>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold">100M+</div>
                <p className="text-sm text-muted-foreground">Transactions</p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold">99.9%</div>
                <p className="text-sm text-muted-foreground">Uptime</p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold">4.8/5</div>
                <p className="text-sm text-muted-foreground">User Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Our Values</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">User-Centric</h3>
                <p className="text-muted-foreground">
                  We put our users at the center of everything we do. Every feature, every update, and every decision is
                  made with our users' needs and preferences in mind.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Security First</h3>
                <p className="text-muted-foreground">
                  We prioritize the security of our users' data and transactions above all else. We employ the latest
                  security measures and continuously update our systems to stay ahead of potential threats.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Inclusive Innovation</h3>
                <p className="text-muted-foreground">
                  We believe in creating solutions that work for everyone. Our innovations are designed to be accessible
                  and beneficial to users from all walks of life, regardless of their technical expertise.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Our Team</h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto">
          We're a diverse team of engineers, designers, and financial experts united by a common goal: to make financial
          services more accessible and user-friendly.
        </p>
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { name: "Rahul Sharma", role: "CEO & Co-founder" },
            { name: "Priya Patel", role: "CTO & Co-founder" },
            { name: "Amit Kumar", role: "Head of Product" },
            { name: "Neha Singh", role: "Head of Customer Experience" },
          ].map((member, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-2xl font-bold">{member.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="font-bold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          <Button variant="outline">View Full Team</Button>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Awards & Recognition</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { year: "2023", award: "Best FinTech App of the Year", organization: "Tech Innovation Awards" },
            { year: "2022", award: "Excellence in Customer Service", organization: "Customer Experience Summit" },
            { year: "2021", award: "Most Secure Payment Platform", organization: "Digital Security Conference" },
          ].map((award, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{award.year}</p>
                    <h3 className="font-bold">{award.award}</h3>
                    <p className="text-sm text-muted-foreground">{award.organization}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-muted rounded-lg p-8 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl font-bold">Join Our Journey</h2>
          <p className="text-muted-foreground">
            We're always looking for talented individuals who share our passion for innovation and our commitment to
            making financial services more accessible. Check out our current openings or drop us a line.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Button>View Careers</Button>
            <Button variant="outline">Contact Us</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
