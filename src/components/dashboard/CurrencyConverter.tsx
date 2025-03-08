
import React, { useState } from "react";
import { Euro, DollarSign, PoundSterling, JapaneseYen, ChevronsUpDown, ArrowRightLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$", icon: DollarSign },
  { code: "EUR", name: "Euro", symbol: "€", icon: Euro },
  { code: "GBP", name: "British Pound", symbol: "£", icon: PoundSterling },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", icon: JapaneseYen },
];

// Exchange rates (simplified, relative to USD as base)
const exchangeRates = {
  USD: 1,
  EUR: 0.91,
  GBP: 0.78,
  JPY: 150.2,
};

export const CurrencyConverter: React.FC = () => {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState("1000");
  const [convertedAmount, setConvertedAmount] = useState<string>("");

  const handleConversion = () => {
    if (!amount || isNaN(Number(amount))) return;
    
    const numericalAmount = parseFloat(amount);
    const fromRate = exchangeRates[fromCurrency as keyof typeof exchangeRates];
    const toRate = exchangeRates[toCurrency as keyof typeof exchangeRates];
    
    // Convert from source currency to USD, then to target currency
    const inUSD = numericalAmount / fromRate;
    const result = inUSD * toRate;
    
    setConvertedAmount(result.toLocaleString(undefined, { 
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }));
  };
  
  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setConvertedAmount("");
  };

  const getSymbol = (code: string) => {
    const currency = currencies.find(c => c.code === code);
    return currency?.symbol || code;
  };
  
  const CurrencyIcon = ({ code }: { code: string }) => {
    const currency = currencies.find(c => c.code === code);
    const Icon = currency?.icon || DollarSign;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-md">
          <ArrowRightLeft className="h-4 w-4" />
          Cross-Border Currency Converter
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-5 gap-2 items-center">
            <div className="col-span-2">
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger className="h-9 border-white/10 bg-white/5">
                  <SelectValue placeholder="From" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code} className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <currency.icon className="h-4 w-4" />
                        <span>{currency.code} - {currency.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-center">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={swapCurrencies}
                className="h-8 w-8 rounded-full"
              >
                <ArrowRightLeft className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="col-span-2">
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger className="h-9 border-white/10 bg-white/5">
                  <SelectValue placeholder="To" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center gap-2">
                        <currency.icon className="h-4 w-4" />
                        <span>{currency.code} - {currency.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <CurrencyIcon code={fromCurrency} />
              <Input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border-white/10 bg-white/5 pl-8"
                placeholder="Enter amount"
              />
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <span className="text-muted-foreground">{getSymbol(fromCurrency)}</span>
              </div>
            </div>
            
            <Button onClick={handleConversion}>
              <ChevronsUpDown className="h-4 w-4 mr-2" />
              Convert
            </Button>
          </div>
          
          {convertedAmount && (
            <div className="rounded-md border border-white/10 bg-white/5 p-3">
              <div className="text-sm text-muted-foreground mb-1">Converted Amount:</div>
              <div className="text-xl font-semibold flex items-center">
                <CurrencyIcon code={toCurrency} />
                <span className="ml-1">{getSymbol(toCurrency)} {convertedAmount}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Rate: 1 {fromCurrency} = {(exchangeRates[toCurrency as keyof typeof exchangeRates] / 
                                         exchangeRates[fromCurrency as keyof typeof exchangeRates]).toFixed(4)} {toCurrency}
              </div>
            </div>
          )}
          
          <p className="text-xs text-muted-foreground mt-2">
            Currency rates are updated daily. Actual transaction rates may vary.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
