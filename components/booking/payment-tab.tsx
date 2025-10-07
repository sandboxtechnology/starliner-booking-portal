"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type PaymentTabProps = {
  cardNumber: string
  setCardNumber: (n: string) => void
  cardName: string
  setCardName: (n: string) => void
  expiryDate: string
  setExpiryDate: (d: string) => void
  cvv: string
  setCvv: (c: string) => void
}

export function PaymentTab({
  cardNumber,
  setCardNumber,
  cardName,
  setCardName,
  expiryDate,
  setExpiryDate,
  cvv,
  setCvv,
}: PaymentTabProps) {
  return (
    <Card className="bg-card shadow-sm">
      <CardHeader>
        <h3 className="text-lg font-semibold">Payment</h3>
        <p className="text-sm text-muted-foreground">Enter your payment details securely.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            maxLength={19}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cardName">Cardholder Name</Label>
          <Input
            id="cardName"
            placeholder="Name on card"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiry">Expiry Date</Label>
            <Input
              id="expiry"
              placeholder="MM/YY"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              maxLength={5}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              placeholder="123"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              maxLength={4}
              type="password"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
