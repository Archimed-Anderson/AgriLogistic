import { Package, TruckIcon, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { orders } from '../data/mockData';

interface CustomerDashboardProps {
  onNavigate: (route: string) => void;
}

export function CustomerDashboard({ onNavigate }: CustomerDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, John!</h1>
        <p className="text-muted-foreground mt-2">
          Track your orders and manage your agricultural supply needs.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card
          className="transition-all hover:shadow-md cursor-pointer"
          onClick={() => onNavigate('/market')}
        >
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Package className="h-6 w-6 text-[#2563eb]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Browse</p>
                <h3 className="text-xl font-bold">Marketplace</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="transition-all hover:shadow-md cursor-pointer"
          onClick={() => onNavigate('/customer/tracking')}
        >
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <TruckIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Track</p>
                <h3 className="text-xl font-bold">Shipments</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="transition-all hover:shadow-md cursor-pointer"
          onClick={() => onNavigate('/chat')}
        >
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Get</p>
                <h3 className="text-xl font-bold">Support</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Status */}
      <Card className="transition-all hover:shadow-md">
        <CardHeader>
          <CardTitle>Order Status</CardTitle>
          <p className="text-sm text-muted-foreground">
            Your recent orders and their current status
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {orders.slice(0, 3).map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 rounded-lg border hover:border-[#2563eb] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    order.status === 'Delivered'
                      ? 'bg-green-100'
                      : order.status === 'In Transit'
                      ? 'bg-blue-100'
                      : 'bg-yellow-100'
                  }`}
                >
                  {order.status === 'Delivered' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : order.status === 'In Transit' ? (
                    <TruckIcon className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-yellow-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{order.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.items} items • ${order.total.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.status === 'Delivered'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'In Transit'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {order.status}
                </span>
                <p className="text-sm text-muted-foreground mt-1">{order.date}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tracking Information */}
      <Card className="transition-all hover:shadow-md">
        <CardHeader>
          <CardTitle>Active Shipment Tracking</CardTitle>
          <p className="text-sm text-muted-foreground">Real-time tracking for orders in transit</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {orders
              .filter((o) => o.status === 'In Transit')
              .map((order) => (
                <div key={order.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        Tracking: {order.trackingNumber}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                  <div className="relative">
                    <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-200" />
                    <div className="space-y-4 relative">
                      <div className="flex items-start gap-4">
                        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#2563eb] mt-1 z-10">
                          <div className="h-2 w-2 rounded-full bg-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">In Transit</p>
                          <p className="text-xs text-muted-foreground">
                            Expected delivery: Tomorrow
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#2563eb] mt-1 z-10">
                          <div className="h-2 w-2 rounded-full bg-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">Out for Delivery</p>
                          <p className="text-xs text-muted-foreground">Today at 9:00 AM</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-gray-300 mt-1 z-10">
                          <div className="h-2 w-2 rounded-full bg-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm text-muted-foreground">Processing</p>
                          <p className="text-xs text-muted-foreground">Yesterday at 2:00 PM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
