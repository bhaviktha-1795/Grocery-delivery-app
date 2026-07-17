// User & Authentication
export interface User {
  id: string
  email: string
  name: string
  phone: string
  avatar?: string
  addresses: Address[]
  savedPaymentMethods: PaymentMethod[]
  loyaltyPoints: number
  referralCode: string
  createdAt: Date
}

export interface Address {
  id: string
  label: string
  street: string
  city: string
  state: string
  zipCode: string
  coordinates: {
    lat: number
    lng: number
  }
  isDefault: boolean
}

export interface AuthResponse {
  user: User
  token: string
}

// Products & Categories
export interface Category {
  id: string
  name: string
  icon: string
  description: string
  color: string
}

export interface Product {
  id: string
  name: string
  brand: string
  category: string
  categoryId: string
  price: number
  originalPrice?: number
  discount?: number
  image: string
  brandLogo?: string
  description: string
  rating: number
  reviewCount: number
  inStock: boolean
  quantity?: number
  unit: string
  nutritionInfo?: string
  expiryDate?: string
}

export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  rating: number
  comment: string
  images?: string[]
  createdAt: Date
  verified: boolean
}

// Stores & Delivery
export interface Store {
  id: string
  name: string
  image: string
  distance: number
  rating: number
  reviewCount: number
  deliveryTime: number
  deliveryFee: number
  minOrder: number
  address: string
  coordinates: {
    lat: number
    lng: number
  }
  isOpen: boolean
  agent?: DeliveryAgent
  coupons: Coupon[]
  specialOffers: SpecialOffer[]
}

export interface DeliveryAgent {
  id: string
  name: string
  phone: string
  rating: number
  avatar: string
  vehicle: string
  currentLocation?: {
    lat: number
    lng: number
  }
  estimatedArrival?: number
}

// Cart & Checkout
export interface CartItem {
  productId: string
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  totalPrice: number
  totalDiscount: number
  deliveryFee: number
  tax: number
}

export interface CheckoutData {
  cartItems: CartItem[]
  deliveryAddress: Address
  paymentMethod: PaymentMethod
  couponCode?: string
  scheduledTime?: Date
  instructions?: string
}

export interface PaymentMethod {
  id: string
  type: 'card' | 'upi' | 'wallet' | 'cod'
  last4?: string
  upiId?: string
  isDefault: boolean
  expiryDate?: string
}

// Orders
export interface Order {
  id: string
  userId: string
  storeId: string
  items: CartItem[]
  totalAmount: number
  discountAmount: number
  deliveryFee: number
  tax: number
  paymentMethod: PaymentMethod
  deliveryAddress: Address
  status: OrderStatus
  timeline: OrderEvent[]
  deliveryAgent?: DeliveryAgent
  estimatedDelivery: number
  actualDelivery?: number
  rating?: number
  review?: string
  createdAt: Date
  scheduledFor?: Date
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'

export interface OrderEvent {
  status: OrderStatus
  timestamp: Date
  message: string
  location?: {
    lat: number
    lng: number
  }
}

// Coupons & Offers
export interface Coupon {
  id: string
  code: string
  description: string
  discount: number
  discountType: 'percentage' | 'fixed'
  minOrder: number
  maxUses: number
  usedCount: number
  expiryDate: Date
  applicableCategories?: string[]
  isActive: boolean
  storeIds?: string[]
}

export interface SpecialOffer {
  id: string
  title: string
  description: string
  discount: number
  applicableProducts: string[]
  startDate: Date
  endDate: Date
  bannerImage?: string
}

// Analytics & Business Logic
export interface AnalyticsData {
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
  totalCustomers: number
  activeDeliveryAgents: number
  avgDeliveryTime: number
  customerSatisfaction: number
  topProducts: Product[]
  revenueByCategory: {
    category: string
    revenue: number
  }[]
  ordersByHour: {
    hour: number
    orders: number
  }[]
  storePerformance: {
    storeId: string
    storeName: string
    revenue: number
    orders: number
    avgRating: number
  }[]
}

export interface BusinessMetrics {
  conversionsRate: number
  cartAbandonmentRate: number
  repeatCustomerRate: number
  avgSessionDuration: number
  peakOrderHours: number[]
  customerLifetimeValue: number
  churnRate: number
  referralConversions: number
}

// Subscription
export interface Subscription {
  id: string
  userId: string
  planName: string
  frequency: 'weekly' | 'biweekly' | 'monthly'
  items: CartItem[]
  totalAmount: number
  nextDeliveryDate: Date
  status: 'active' | 'paused' | 'cancelled'
  createdAt: Date
}

// Notifications
export interface Notification {
  id: string
  userId: string
  type:
    | 'order_status'
    | 'delivery'
    | 'promo'
    | 'payment'
    | 'general'
  title: string
  message: string
  read: boolean
  createdAt: Date
  actionUrl?: string
}
