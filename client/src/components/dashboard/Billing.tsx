import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Download, Calendar, DollarSign, Receipt, Plus, Eye } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  last4: string;
  brand: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  date: string;
  description: string;
  providerId: string;
  providerName: string;
  serviceName: string;
  paymentMethodId: string;
  receiptUrl?: string;
}

export function Billing() {
  const { user } = useAuth();

  const { data: paymentMethods, isLoading: methodsLoading } = useQuery({
    queryKey: ["/api/billing/payment-methods", user?.id],
    enabled: !!user?.id,
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ["/api/billing/transactions", user?.id],
    enabled: !!user?.id,
  });

  const { data: billingStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/billing/stats", user?.id],
    enabled: !!user?.id,
  });

  if (methodsLoading || transactionsLoading || statsLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Billing & Payments</h2>
          <p className="text-gray-600">Manage your payment methods and view transaction history</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const methods = (paymentMethods as PaymentMethod[]) || [];
  const transactionList = (transactions as Transaction[]) || [];
  const stats = billingStats as any || { totalSpent: 0, totalTransactions: 0, currentMonth: 0 };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCardIcon = (brand: string) => {
    // Return appropriate card brand icon or default
    return <CreditCard className="h-6 w-6" />;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Billing & Payments</h2>
        <p className="text-gray-600">Manage your payment methods and view transaction history</p>
      </div>

      {/* Billing Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900" data-testid="total-spent">
                  ${stats.totalSpent?.toFixed(2) || '0.00'}
                </div>
                <div className="text-sm text-gray-600">Total Spent</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Receipt className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900" data-testid="total-transactions">
                  {stats.totalTransactions || 0}
                </div>
                <div className="text-sm text-gray-600">Transactions</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900" data-testid="current-month-spending">
                  ${stats.currentMonth?.toFixed(2) || '0.00'}
                </div>
                <div className="text-sm text-gray-600">This Month</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Payment Methods</CardTitle>
            <Button className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)]" data-testid="add-payment-method">
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {methods.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No payment methods added yet</p>
              <Button className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)]" data-testid="add-first-payment-method">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Payment Method
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {methods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`payment-method-${method.id}`}>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      {getCardIcon(method.brand)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">
                          {method.brand.toUpperCase()} ending in {method.last4}
                        </span>
                        {method.isDefault && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                      {method.expiryMonth && method.expiryYear && (
                        <span className="text-sm text-gray-600">
                          Expires {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" data-testid={`edit-payment-method-${method.id}`}>
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" data-testid={`remove-payment-method-${method.id}`}>
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Transaction History</CardTitle>
            <Button variant="outline" size="sm" data-testid="download-statements">
              <Download className="h-4 w-4 mr-2" />
              Download Statements
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {transactionList.length === 0 ? (
            <div className="text-center py-8">
              <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactionList.map((transaction) => (
                <div key={transaction.id} className="border-b border-gray-200 pb-4 last:border-b-0" data-testid={`transaction-${transaction.id}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{transaction.serviceName}</h4>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            ${transaction.amount.toFixed(2)} {transaction.currency.toUpperCase()}
                          </div>
                          <Badge variant="secondary" className={`text-xs ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        Provider: {transaction.providerName}
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(transaction.date).toLocaleDateString()}
                        </div>
                        <div className="flex space-x-2">
                          {transaction.receiptUrl && (
                            <Button variant="ghost" size="sm" data-testid={`view-receipt-${transaction.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              Receipt
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" data-testid={`transaction-details-${transaction.id}`}>
                            Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}