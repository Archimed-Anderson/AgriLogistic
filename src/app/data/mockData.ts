// Mock data for AgroDeep platform

export const products = [
  {
    id: 1,
    name: "Organic Tomatoes",
    price: 4.99,
    rating: 4.5,
    reviews: 128,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=400&fit=crop",
    description: "Fresh organic tomatoes grown without pesticides. Perfect for salads and cooking.",
    specifications: {
      origin: "California, USA",
      weight: "1 lb",
      certification: "USDA Organic",
      shelfLife: "7 days"
    },
    stock: 156
  },
  {
    id: 2,
    name: "Premium Rice",
    price: 12.99,
    rating: 4.8,
    reviews: 256,
    category: "Grains",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop",
    description: "High-quality basmati rice with excellent aroma and taste.",
    specifications: {
      origin: "India",
      weight: "5 lb",
      certification: "Premium Grade",
      shelfLife: "12 months"
    },
    stock: 89
  },
  {
    id: 3,
    name: "Fresh Carrots",
    price: 3.49,
    rating: 4.3,
    reviews: 87,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop",
    description: "Crunchy and sweet organic carrots, rich in vitamins.",
    specifications: {
      origin: "Washington, USA",
      weight: "2 lb",
      certification: "Organic",
      shelfLife: "14 days"
    },
    stock: 234
  },
  {
    id: 4,
    name: "Wheat Flour",
    price: 8.99,
    rating: 4.6,
    reviews: 192,
    category: "Grains",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop",
    description: "Stone-ground whole wheat flour for baking and cooking.",
    specifications: {
      origin: "Kansas, USA",
      weight: "10 lb",
      certification: "Non-GMO",
      shelfLife: "6 months"
    },
    stock: 145
  },
  {
    id: 5,
    name: "Bell Peppers",
    price: 5.99,
    rating: 4.7,
    reviews: 143,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=400&fit=crop",
    description: "Colorful mix of red, yellow, and green bell peppers.",
    specifications: {
      origin: "Mexico",
      weight: "1.5 lb",
      certification: "Fresh Produce",
      shelfLife: "10 days"
    },
    stock: 178
  },
  {
    id: 6,
    name: "Quinoa Seeds",
    price: 14.99,
    rating: 4.9,
    reviews: 312,
    category: "Grains",
    image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&h=400&fit=crop",
    description: "Protein-rich organic quinoa, perfect for healthy meals.",
    specifications: {
      origin: "Peru",
      weight: "2 lb",
      certification: "USDA Organic",
      shelfLife: "18 months"
    },
    stock: 98
  }
];

export const orders = [
  {
    id: "ORD-2026-001",
    date: "2026-01-08",
    customer: "John Smith",
    items: 3,
    total: 156.48,
    status: "Delivered",
    trackingNumber: "TRK123456789"
  },
  {
    id: "ORD-2026-002",
    date: "2026-01-09",
    customer: "Sarah Johnson",
    items: 5,
    total: 289.99,
    status: "In Transit",
    trackingNumber: "TRK987654321"
  },
  {
    id: "ORD-2026-003",
    date: "2026-01-09",
    customer: "Michael Chen",
    items: 2,
    total: 78.50,
    status: "Processing",
    trackingNumber: "TRK456789123"
  },
  {
    id: "ORD-2026-004",
    date: "2026-01-10",
    customer: "Emily Davis",
    items: 4,
    total: 234.75,
    status: "Pending",
    trackingNumber: "TRK789123456"
  }
];

export const notifications = [
  {
    id: 1,
    type: "order",
    title: "New Order Received",
    message: "Order #ORD-2026-004 has been placed",
    timestamp: "2 minutes ago",
    read: false
  },
  {
    id: 2,
    type: "system",
    title: "System Update",
    message: "Platform maintenance scheduled for tonight",
    timestamp: "1 hour ago",
    read: false
  },
  {
    id: 3,
    type: "payment",
    title: "Payment Confirmed",
    message: "Payment of $289.99 received",
    timestamp: "3 hours ago",
    read: true
  },
  {
    id: 4,
    type: "shipping",
    title: "Shipment Delivered",
    message: "Order #ORD-2026-001 has been delivered",
    timestamp: "5 hours ago",
    read: true
  }
];

export const chatConversations = [
  {
    id: 1,
    name: "John Smith",
    avatar: "JS",
    lastMessage: "When will my order arrive?",
    timestamp: "2m ago",
    unread: 2
  },
  {
    id: 2,
    name: "Sarah Johnson",
    avatar: "SJ",
    lastMessage: "Thank you for the quick delivery!",
    timestamp: "15m ago",
    unread: 0
  },
  {
    id: 3,
    name: "Michael Chen",
    avatar: "MC",
    lastMessage: "I have a question about the pricing",
    timestamp: "1h ago",
    unread: 1
  },
  {
    id: 4,
    name: "Emily Davis",
    avatar: "ED",
    lastMessage: "Can I change my delivery address?",
    timestamp: "2h ago",
    unread: 0
  }
];

export const messages = [
  {
    id: 1,
    sender: "customer",
    text: "Hello, when will my order arrive?",
    timestamp: "10:30 AM"
  },
  {
    id: 2,
    sender: "admin",
    text: "Hi! Your order is currently in transit and should arrive by tomorrow.",
    timestamp: "10:32 AM"
  },
  {
    id: 3,
    sender: "customer",
    text: "Great! Can I track it?",
    timestamp: "10:33 AM"
  },
  {
    id: 4,
    sender: "admin",
    text: "Yes, your tracking number is TRK123456789. You can track it in your dashboard.",
    timestamp: "10:34 AM"
  }
];

export const revenueData = [
  { month: "Jan", revenue: 45000 },
  { month: "Feb", revenue: 52000 },
  { month: "Mar", revenue: 48000 },
  { month: "Apr", revenue: 61000 },
  { month: "May", revenue: 55000 },
  { month: "Jun", revenue: 67000 },
  { month: "Jul", revenue: 72000 },
  { month: "Aug", revenue: 68000 },
  { month: "Sep", revenue: 75000 },
  { month: "Oct", revenue: 82000 },
  { month: "Nov", revenue: 78000 },
  { month: "Dec", revenue: 89000 }
];

export const topProducts = [
  { name: "Organic Tomatoes", sales: 1240 },
  { name: "Premium Rice", sales: 980 },
  { name: "Quinoa Seeds", sales: 875 },
  { name: "Bell Peppers", sales: 756 },
  { name: "Wheat Flour", sales: 642 }
];

export const categoryDistribution = [
  { name: "Vegetables", value: 35 },
  { name: "Grains", value: 28 },
  { name: "Fruits", value: 22 },
  { name: "Dairy", value: 15 }
];
