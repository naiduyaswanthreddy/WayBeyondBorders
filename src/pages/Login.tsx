
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Shield, 
  KeyRound, 
  Smartphone, 
  Check, 
  ChevronRight,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<"phone" | "verification">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep("verification");
      toast({
        title: "Verification code sent",
        description: "A verification code has been sent to your phone.",
      });
    }, 1500);
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Authentication successful",
        description: "Welcome to LogiNexus AI.",
      });
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-nexus-blue/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-nexus-purple/10 blur-3xl"></div>
        <div 
          className="absolute inset-0 opacity-10" 
          style={{
            backgroundImage: "linear-gradient(#ffffff11 1px, transparent 1px), linear-gradient(to right, #ffffff11 1px, transparent 1px)",
            backgroundSize: "70px 70px"
          }}
        ></div>
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
        <div className="mx-auto w-full max-w-md">
          <div className="flex justify-center">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-nexus-blue">
              <div className="absolute inset-0 animate-pulse rounded-xl bg-nexus-blue opacity-50"></div>
              <span className="text-2xl font-bold text-white">L</span>
            </div>
          </div>
          
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            <span className="text-gradient-blue">Logi</span>
            <span className="text-white">Nexus</span>
            <span className="text-gradient-teal">AI</span>
          </h2>
          
          <div className="mt-3 flex items-center justify-center gap-1 text-sm text-muted-foreground">
            <Sparkles className="h-3 w-3 text-nexus-purple" />
            <span>AI-Powered Logistics Optimization</span>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="glass-card p-6 sm:rounded-xl sm:px-8 sm:py-8">
              {step === "phone" ? (
                <>
                  <div className="mb-6 flex items-center justify-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-nexus-blue/20 text-nexus-blue">
                      <Smartphone className="h-4 w-4" />
                    </div>
                    <div className="h-px w-8 bg-muted-foreground/30"></div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-muted-foreground">
                      <KeyRound className="h-4 w-4" />
                    </div>
                    <div className="h-px w-8 bg-muted-foreground/30"></div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-muted-foreground">
                      <Shield className="h-4 w-4" />
                    </div>
                  </div>

                  <h3 className="text-center text-lg font-medium text-white">
                    Enter your phone number
                  </h3>
                  <p className="mt-2 text-center text-sm text-muted-foreground">
                    We'll send you a verification code to secure your account
                  </p>

                  <form onSubmit={handlePhoneSubmit} className="mt-6 space-y-6">
                    <div>
                      <label htmlFor="phone" className="sr-only">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="nexus-input text-white"
                        required
                      />
                    </div>

                    <Button 
                      type="submit"
                      className="nexus-button-primary w-full"
                      disabled={isLoading || !phoneNumber}
                    >
                      {isLoading ? "Sending..." : "Send Verification Code"}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <div className="mb-6 flex items-center justify-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-nexus-blue/20 text-nexus-blue">
                      <Check className="h-4 w-4" />
                    </div>
                    <div className="h-px w-8 bg-nexus-blue/30"></div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-nexus-blue/20 text-nexus-blue">
                      <KeyRound className="h-4 w-4" />
                    </div>
                    <div className="h-px w-8 bg-muted-foreground/30"></div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-muted-foreground">
                      <Shield className="h-4 w-4" />
                    </div>
                  </div>

                  <h3 className="text-center text-lg font-medium text-white">
                    Verify your phone
                  </h3>
                  <p className="mt-2 text-center text-sm text-muted-foreground">
                    Enter the 6-digit code we sent to {phoneNumber}
                  </p>

                  <form onSubmit={handleVerificationSubmit} className="mt-6 space-y-6">
                    <div>
                      <label htmlFor="code" className="sr-only">
                        Verification Code
                      </label>
                      <Input
                        id="code"
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="nexus-input text-white"
                        required
                        maxLength={6}
                      />
                    </div>

                    <Button 
                      type="submit"
                      className="nexus-button-primary w-full"
                      disabled={isLoading || verificationCode.length !== 6}
                    >
                      {isLoading ? "Verifying..." : "Verify & Sign In"}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>

                    <div className="text-center">
                      <Button
                        variant="link"
                        className="h-auto p-0 text-sm text-nexus-blue"
                        onClick={() => setStep("phone")}
                        disabled={isLoading}
                      >
                        Back to phone number
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
