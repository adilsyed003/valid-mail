import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Mail, 
  Search, 
  CheckCircle, 
  XCircle, 
  Shield, 
  Globe, 
  ChevronDown,
  ArrowLeft,
  Loader2,
  Server,
  AlertTriangle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ValidationResult {
  email: string;
  domain: string;
  has_mx: boolean;
  has_spf: boolean;
  has_dmarc: boolean;
  mx_record: string;
  spf_record: string;
  dmarc_record: string;
  is_disposable: boolean;
  is_safe: boolean;
  verdict: string;
  mx_geo: string;
}

const EmailCheck = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [showTechnical, setShowTechnical] = useState({
    mx: false,
    spf: false,
    dmarc: false
  });

  const validateEmail = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8081/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to validate email");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to validate email. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      validateEmail();
    }
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="w-5 h-5 text-accent" />
    ) : (
      <XCircle className="w-5 h-5 text-destructive" />
    );
  };

  const getStatusBadge = (status: boolean, trueText: string, falseText: string) => {
    return (
      <Badge variant={status ? "default" : "destructive"} className="ml-2">
        {status ? trueText : falseText}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card"></div>
      <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-primary/10 via-transparent to-accent/10"></div>

      {/* Navigation */}
      <nav className="relative z-50 flex justify-between items-center p-6 lg:px-12">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="hover-glow"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold glow-text">EmailValidator</span>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 glow-text">
            Email Validation Tool
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Enter an email address to validate its authenticity, security, and deliverability
          </p>
        </div>

        {/* Search Form */}
        <Card className="card-gradient glow-border mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="Enter email address (e.g., help@indeed.com)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="text-lg py-6 bg-background/50 border-border glow-border"
                  disabled={loading}
                />
              </div>
              <Button
                onClick={validateEmail}
                disabled={loading}
                size="lg"
                className="bg-primary hover:bg-primary/90 hover-glow px-8 py-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Validating...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Validate
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-fade-in">
            {/* Main Status */}
            <Card className="card-gradient glow-border">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Validation Results</h2>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(result.is_safe)}
                    <span className="text-lg font-semibold">
                      {result.is_safe ? "Safe" : "Unsafe"}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Email Address</span>
                      <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                        {result.email}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Domain</span>
                      <span className="font-semibold">{result.domain}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Disposable Email</span>
                      <div className="flex items-center">
                        {getStatusIcon(!result.is_disposable)}
                        {getStatusBadge(!result.is_disposable, "Not Disposable", "Disposable")}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">MX Record</span>
                      <div className="flex items-center">
                        {getStatusIcon(result.has_mx)}
                        {getStatusBadge(result.has_mx, "Valid", "Invalid")}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">SPF Record</span>
                      <div className="flex items-center">
                        {getStatusIcon(result.has_spf)}
                        {getStatusBadge(result.has_spf, "Configured", "Missing")}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">DMARC Record</span>
                      <div className="flex items-center">
                        {getStatusIcon(result.has_dmarc)}
                        {getStatusBadge(result.has_dmarc, "Configured", "Missing")}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-background/50 rounded-lg border">
                  <div className="flex items-center space-x-2 mb-2">
                    {result.is_safe ? (
                      <CheckCircle className="w-5 h-5 text-accent" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                    )}
                    <span className="font-semibold">Verdict</span>
                  </div>
                  <p className="text-muted-foreground">{result.verdict}</p>
                </div>
              </CardContent>
            </Card>

            {/* Location Info */}
            <Card className="card-gradient glow-border">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Globe className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold mb-1">MX Server Location</h3>
                    <p className="text-muted-foreground">{result.mx_geo}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical Details */}
            <Card className="card-gradient glow-border">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Server className="w-5 h-5 mr-2" />
                  Technical Details
                </h3>

                <div className="space-y-4">
                  {/* MX Records */}
                  <Collapsible
                    open={showTechnical.mx}
                    onOpenChange={(open) => setShowTechnical(prev => ({ ...prev, mx: open }))}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between p-4 h-auto hover:bg-background/50"
                      >
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span>MX Records</span>
                          {getStatusBadge(result.has_mx, "Found", "Not Found")}
                        </div>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 pb-4">
                      <div className="bg-background/30 rounded p-3">
                        <code className="text-sm text-muted-foreground break-all">
                          {result.mx_record || "No MX records found"}
                        </code>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* SPF Records */}
                  <Collapsible
                    open={showTechnical.spf}
                    onOpenChange={(open) => setShowTechnical(prev => ({ ...prev, spf: open }))}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between p-4 h-auto hover:bg-background/50"
                      >
                        <div className="flex items-center space-x-2">
                          <Shield className="w-4 h-4" />
                          <span>SPF Records</span>
                          {getStatusBadge(result.has_spf, "Found", "Not Found")}
                        </div>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 pb-4">
                      <div className="bg-background/30 rounded p-3">
                        <code className="text-sm text-muted-foreground break-all">
                          {result.spf_record || "No SPF records found"}
                        </code>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* DMARC Records */}
                  <Collapsible
                    open={showTechnical.dmarc}
                    onOpenChange={(open) => setShowTechnical(prev => ({ ...prev, dmarc: open }))}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between p-4 h-auto hover:bg-background/50"
                      >
                        <div className="flex items-center space-x-2">
                          <Shield className="w-4 h-4" />
                          <span>DMARC Records</span>
                          {getStatusBadge(result.has_dmarc, "Found", "Not Found")}
                        </div>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 pb-4">
                      <div className="bg-background/30 rounded p-3">
                        <code className="text-sm text-muted-foreground break-all">
                          {result.dmarc_record || "No DMARC records found"}
                        </code>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => {
                  setEmail("");
                  setResult(null);
                }}
                variant="outline"
                size="lg"
                className="hover-glow"
              >
                Validate Another Email
              </Button>
              <Button
                onClick={() => navigate("/")}
                size="lg"
                className="bg-primary hover:bg-primary/90 hover-glow"
              >
                Back to Home
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailCheck;