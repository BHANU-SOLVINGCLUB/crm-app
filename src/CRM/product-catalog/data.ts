export type CatalogStatus = 'Active' | 'Draft' | 'Archived'
export type CatalogVisibility = 'Public' | 'Hidden'
export type CatalogProductType = 'Physical' | 'Digital' | 'Bundle' | 'Service'
export type CatalogCurrency = 'USD' | 'INR'
export type CatalogTone = 'blue' | 'teal' | 'amber' | 'rose' | 'slate'
export type CatalogActivityTone = 'info' | 'success' | 'warning'
export type CatalogInventoryActionType = 'Add Stock' | 'Reduce Stock' | 'Adjust Stock'

export interface CatalogCategory {
  id: string
  name: string
  description: string
  status: CatalogStatus
  updatedAt: string
}

export interface CatalogBrand {
  id: string
  name: string
  description: string
  website: string
  logoColor: string
  status: CatalogStatus
  updatedAt: string
}

export interface CatalogVariantGroup {
  id: string
  name: 'Size' | 'Color' | 'Material'
  options: string[]
  description: string
  updatedAt: string
  enabled: boolean
}

export interface CatalogProductVariant {
  name: 'Size' | 'Color' | 'Material'
  values: string[]
}

export interface CatalogInventoryHistoryEntry {
  id: string
  actionType: CatalogInventoryActionType
  quantityChanged: number
  previousQuantity: number
  newQuantity: number
  user: string
  timestamp: string
  notes: string
}

export interface CatalogActivity {
  id: string
  title: string
  note: string
  actor: string
  timestamp: string
  tone: CatalogActivityTone
}

export interface CatalogProduct {
  id: string
  name: string
  sku: string
  productCode: string
  barcode: string
  categoryId: string
  brandId: string
  productType: CatalogProductType
  status: CatalogStatus
  visibility: CatalogVisibility
  featured: boolean
  shortDescription: string
  description: string
  price: number
  salePrice: number
  costPrice: number
  taxRate: number
  currency: CatalogCurrency
  stockQuantity: number
  reservedStock: number
  lowStockThreshold: number
  reorderLevel: number
  warehouse: string
  trackStock: boolean
  images: string[]
  tags: string[]
  variants: CatalogProductVariant[]
  inventoryHistory: CatalogInventoryHistoryEntry[]
  createdAt: string
  updatedAt: string
  activity: CatalogActivity[]
}

export interface CatalogProductForm {
  name: string
  sku: string
  productCode: string
  barcode: string
  categoryId: string
  brandId: string
  productType: CatalogProductType
  status: CatalogStatus
  visibility: CatalogVisibility
  featured: boolean
  shortDescription: string
  description: string
  price: number
  salePrice: number
  costPrice: number
  taxRate: number
  currency: CatalogCurrency
  stockQuantity: number
  reservedStock: number
  lowStockThreshold: number
  reorderLevel: number
  warehouse: string
  trackStock: boolean
  images: string[]
  tags: string[]
  variants: CatalogProductVariant[]
}

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function productImage(label: string, accent: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${accent}" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>
      </defs>
      <rect width="640" height="480" rx="36" fill="url(#g)" />
      <circle cx="530" cy="110" r="86" fill="rgba(255,255,255,0.12)" />
      <rect x="42" y="42" width="556" height="396" rx="28" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" />
      <text x="72" y="170" fill="#ffffff" font-family="Arial, sans-serif" font-size="44" font-weight="700">${escapeXml(label)}</text>
      <text x="72" y="230" fill="rgba(255,255,255,0.84)" font-family="Arial, sans-serif" font-size="24">E-commerce CRM catalog</text>
      <text x="72" y="294" fill="rgba(255,255,255,0.72)" font-family="Arial, sans-serif" font-size="17">Product preview</text>
    </svg>
  `
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

function isoDaysAgo(days: number) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString()
}

function inventoryHistory(
  actionType: CatalogInventoryActionType,
  previousQuantity: number,
  newQuantity: number,
  user: string,
  notes: string,
  timestamp: string
): CatalogInventoryHistoryEntry {
  return {
    id: `${actionType}-${timestamp}`,
    actionType,
    quantityChanged: newQuantity - previousQuantity,
    previousQuantity,
    newQuantity,
    user,
    timestamp,
    notes,
  }
}

const categoryBase: CatalogCategory[] = [
  { id: 'cat-electronics', name: 'Electronics', description: 'Phones, devices, and connected hardware.', status: 'Active', updatedAt: isoDaysAgo(2) },
  { id: 'cat-fashion', name: 'Fashion', description: 'Apparel, footwear, and accessories.', status: 'Active', updatedAt: isoDaysAgo(4) },
  { id: 'cat-home', name: 'Home & Kitchen', description: 'Home goods and daily-use essentials.', status: 'Active', updatedAt: isoDaysAgo(7) },
  { id: 'cat-beauty', name: 'Beauty', description: 'Personal care and wellness items.', status: 'Draft', updatedAt: isoDaysAgo(9) },
]

const brandBase: CatalogBrand[] = [
  { id: 'brand-nova', name: 'Nova', description: 'Fast-moving lifestyle products.', website: 'https://nova.example', logoColor: '#2563eb', status: 'Active', updatedAt: isoDaysAgo(1) },
  { id: 'brand-zenware', name: 'ZenWare', description: 'Smart home and productivity gear.', website: 'https://zenware.example', logoColor: '#0f766e', status: 'Active', updatedAt: isoDaysAgo(5) },
  { id: 'brand-urbanroot', name: 'UrbanRoot', description: 'Modern everyday essentials.', website: 'https://urbanroot.example', logoColor: '#7c3aed', status: 'Active', updatedAt: isoDaysAgo(6) },
]

const variantBase: CatalogVariantGroup[] = [
  { id: 'variant-size', name: 'Size', options: ['S', 'M', 'L', 'XL'], description: 'Use for apparel and pack sizes.', updatedAt: isoDaysAgo(1), enabled: true },
  { id: 'variant-color', name: 'Color', options: ['Black', 'White', 'Blue', 'Green'], description: 'Use for color-based product options.', updatedAt: isoDaysAgo(3), enabled: true },
  { id: 'variant-material', name: 'Material', options: ['Cotton', 'Polyester', 'Leather'], description: 'Use for material or finish variants.', updatedAt: isoDaysAgo(8), enabled: true },
]

const activity = (title: string, note: string, actor: string, tone: CatalogActivityTone, timestamp: string): CatalogActivity => ({
  id: `${title}-${timestamp}`,
  title,
  note,
  actor,
  tone,
  timestamp,
})

export const initialCategories = categoryBase
export const initialBrands = brandBase
export const initialVariantGroups = variantBase

const featuredProducts: CatalogProduct[] = [
  {
    id: 'prod-1001',
    name: 'Aero Wireless Headphones',
    sku: 'AERO-HP-01',
    productCode: 'PRD-1001',
    barcode: '8901001100018',
    categoryId: 'cat-electronics',
    brandId: 'brand-zenware',
    productType: 'Physical',
    status: 'Active',
    visibility: 'Public',
    featured: true,
    shortDescription: 'Noise-cancelling wireless headphones for everyday use.',
    description: 'A premium wireless headphone line with deep bass, quick charge, and 30-hour battery life.',
    price: 12999,
    salePrice: 10999,
    costPrice: 7800,
    taxRate: 18,
    currency: 'INR',
    stockQuantity: 64,
    reservedStock: 9,
    lowStockThreshold: 18,
    reorderLevel: 25,
    warehouse: 'Main Fulfillment Center',
    trackStock: true,
    images: [productImage('Aero Wireless Headphones', '#2563eb')],
    tags: ['audio', 'wireless', 'featured'],
    variants: [
      { name: 'Color', values: ['Black', 'Silver'] },
      { name: 'Material', values: ['Polycarbonate'] },
    ],
    inventoryHistory: [
      inventoryHistory('Add Stock', 24, 64, 'Operations', 'Supplier shipment received and added to inventory.', isoDaysAgo(2)),
      inventoryHistory('Adjust Stock', 68, 64, 'Inventory Manager', 'Corrected physical count after audit.', isoDaysAgo(5)),
    ],
    createdAt: isoDaysAgo(17),
    updatedAt: isoDaysAgo(2),
    activity: [
      activity('Published', 'Product was published in the catalog.', 'Catalog Manager', 'success', isoDaysAgo(2)),
      activity('Price updated', 'Sale price lowered for the summer promotion.', 'Finance Team', 'info', isoDaysAgo(4)),
      activity('Stock received', 'Received 40 units from the supplier.', 'Operations', 'info', isoDaysAgo(7)),
    ],
  },
  {
    id: 'prod-1002',
    name: 'Urban Linen Shirt',
    sku: 'URB-SH-14',
    productCode: 'PRD-1002',
    barcode: '8901001100025',
    categoryId: 'cat-fashion',
    brandId: 'brand-urbanroot',
    productType: 'Physical',
    status: 'Active',
    visibility: 'Public',
    featured: false,
    shortDescription: 'Lightweight shirt with breathable fabric for daily wear.',
    description: 'A versatile cotton-linen shirt available in multiple sizes and colors for retail and online sales.',
    price: 1899,
    salePrice: 1599,
    costPrice: 920,
    taxRate: 5,
    currency: 'INR',
    stockQuantity: 11,
    reservedStock: 3,
    lowStockThreshold: 12,
    reorderLevel: 20,
    warehouse: 'Apparel Warehouse',
    trackStock: true,
    images: [productImage('Urban Linen Shirt', '#7c3aed')],
    tags: ['apparel', 'shirt', 'seasonal'],
    variants: [
      { name: 'Size', values: ['S', 'M', 'L', 'XL'] },
      { name: 'Color', values: ['White', 'Olive'] },
      { name: 'Material', values: ['Cotton Linen'] },
    ],
    inventoryHistory: [
      inventoryHistory('Add Stock', 0, 12, 'Warehouse Team', 'Initial stock from supplier.', isoDaysAgo(10)),
      inventoryHistory('Reduce Stock', 13, 11, 'Sales Ops', 'Allocated to confirmed orders.', isoDaysAgo(1)),
    ],
    createdAt: isoDaysAgo(28),
    updatedAt: isoDaysAgo(1),
    activity: [
      activity('Low stock alert', 'Stock dropped below reorder level.', 'Inventory Bot', 'warning', isoDaysAgo(1)),
      activity('Photo updated', 'Lifestyle image added for the listing.', 'Catalog Manager', 'info', isoDaysAgo(5)),
      activity('Variant refresh', 'New color option added.', 'Merchandising', 'success', isoDaysAgo(10)),
    ],
  },
  {
    id: 'prod-1003',
    name: 'Smart Home Hub Mini',
    sku: 'ZEN-HUB-02',
    productCode: 'PRD-1003',
    barcode: '8901001100032',
    categoryId: 'cat-electronics',
    brandId: 'brand-zenware',
    productType: 'Physical',
    status: 'Draft',
    visibility: 'Hidden',
    featured: false,
    shortDescription: 'Compact smart hub for automations and connected devices.',
    description: 'A compact automation controller with voice assistant support and app-based control for home users.',
    price: 4999,
    salePrice: 4699,
    costPrice: 3200,
    taxRate: 18,
    currency: 'INR',
    stockQuantity: 0,
    reservedStock: 0,
    lowStockThreshold: 10,
    reorderLevel: 15,
    warehouse: 'Tech Storage',
    trackStock: true,
    images: [productImage('Smart Home Hub Mini', '#0f766e')],
    tags: ['smart home', 'draft'],
    variants: [{ name: 'Color', values: ['Black'] }],
    inventoryHistory: [
      inventoryHistory('Adjust Stock', 3, 0, 'Inventory Manager', 'Draft product awaiting launch. Stock reset.', isoDaysAgo(6)),
    ],
    createdAt: isoDaysAgo(9),
    updatedAt: isoDaysAgo(6),
    activity: [
      activity('Created', 'Draft product created by the merchandising team.', 'Riya Kapoor', 'info', isoDaysAgo(9)),
      activity('Visibility changed', 'Product set to hidden until launch.', 'Catalog Manager', 'warning', isoDaysAgo(6)),
    ],
  },
  {
    id: 'prod-1004',
    name: 'Everyday Meal Kit',
    sku: 'KIT-MEAL-04',
    productCode: 'PRD-1004',
    barcode: '8901001100049',
    categoryId: 'cat-home',
    brandId: 'brand-nova',
    productType: 'Bundle',
    status: 'Archived',
    visibility: 'Hidden',
    featured: false,
    shortDescription: 'Bundle of pantry staples for recurring customers.',
    description: 'A curated kitchen bundle for quick commerce and subscriptions, ideal for upsells and repurchase flows.',
    price: 1299,
    salePrice: 1199,
    costPrice: 840,
    taxRate: 5,
    currency: 'INR',
    stockQuantity: 0,
    reservedStock: 0,
    lowStockThreshold: 8,
    reorderLevel: 16,
    warehouse: 'Cold Storage',
    trackStock: false,
    images: [productImage('Everyday Meal Kit', '#d97706')],
    tags: ['bundle', 'grocery', 'archived'],
    variants: [],
    inventoryHistory: [
      inventoryHistory('Reduce Stock', 18, 0, 'Inventory Manager', 'Product archived and stock cleared.', isoDaysAgo(12)),
    ],
    createdAt: isoDaysAgo(41),
    updatedAt: isoDaysAgo(12),
    activity: [
      activity('Archived', 'Bundle retired from the storefront.', 'Operations', 'warning', isoDaysAgo(12)),
      activity('Order spike', 'High interest from repeat subscribers.', 'Sales', 'info', isoDaysAgo(16)),
    ],
  },
  {
    id: 'prod-1005',
    name: 'Doctor Consultation',
    sku: 'SRV-DOC-01',
    productCode: 'PRD-1005',
    barcode: '',
    categoryId: 'cat-beauty',
    brandId: 'brand-nova',
    productType: 'Service',
    status: 'Active',
    visibility: 'Public',
    featured: false,
    shortDescription: 'Online medical consultation session.',
    description: 'A service product used for scheduling virtual consultations with a doctor or specialist.',
    price: 799,
    salePrice: 799,
    costPrice: 0,
    taxRate: 0,
    currency: 'INR',
    stockQuantity: 0,
    reservedStock: 0,
    lowStockThreshold: 0,
    reorderLevel: 0,
    warehouse: 'Not applicable',
    trackStock: false,
    images: [productImage('Doctor Consultation', '#7c3aed')],
    tags: ['service', 'healthcare', 'appointment'],
    variants: [],
    inventoryHistory: [],
    createdAt: isoDaysAgo(5),
    updatedAt: isoDaysAgo(1),
    activity: [
      activity('Published', 'Service product made available for booking.', 'Support', 'success', isoDaysAgo(1)),
    ],
  },
]

const generatedProductNames = [
  'Pulse Fitness Band', 'Breeze Cotton Tee', 'Terra Ceramic Mug', 'Luma Desk Lamp',
  'Swift Travel Backpack', 'Glow Skin Serum', 'Echo Bluetooth Speaker', 'Nest Storage Box',
  'Orbit Phone Case', 'Veda Yoga Mat', 'Metro Running Shoes', 'Pure Steel Bottle',
  'Aura Scented Candle', 'Pixel Tablet Sleeve', 'Cloud Comfort Pillow', 'Forge Laptop Stand',
]

const generatedAccents = ['#2563eb', '#0f766e', '#7c3aed', '#d97706', '#be123c', '#0891b2', '#4f46e5', '#16a34a']

function generatedCatalogProduct(index: number): CatalogProduct {
  const baseName = generatedProductNames[index % generatedProductNames.length]
  const variant = Math.floor(index / generatedProductNames.length) + 1
  const categoryIds = ['cat-electronics', 'cat-fashion', 'cat-home', 'cat-beauty']
  const brandIds = ['brand-nova', 'brand-zenware', 'brand-urbanroot']
  const price = 599 + (index % 18) * 425 + variant * 75
  const stockQuantity = 6 + ((index * 17) % 180)
  const reorderLevel = 10 + (index % 18)
  const productType: CatalogProductType = index % 29 === 0 ? 'Digital' : index % 23 === 0 ? 'Bundle' : 'Physical'
  const trackStock = productType === 'Physical'
  const name = `${baseName} ${variant}`
  return {
    id: `prod-${String(2000 + index)}`,
    name,
    sku: `${baseName.split(' ').map((word) => word[0]).join('').toUpperCase()}-${String(2000 + index)}`,
    productCode: `PRD-${String(2000 + index)}`,
    barcode: `89010012${String(2000 + index).padStart(5, '0')}`,
    categoryId: categoryIds[index % categoryIds.length],
    brandId: brandIds[index % brandIds.length],
    productType,
    status: index % 31 === 0 ? 'Draft' : 'Active',
    visibility: index % 31 === 0 ? 'Hidden' : 'Public',
    featured: index % 37 === 0,
    shortDescription: `Reliable ${baseName.toLowerCase()} for daily ecommerce orders.`,
    description: `${name} is generated mock catalog data used for inventory, orders, and CRM analytics demos.`,
    price,
    salePrice: Math.round(price * (index % 5 === 0 ? 0.88 : 0.94)),
    costPrice: Math.round(price * 0.58),
    taxRate: index % 3 === 0 ? 18 : 12,
    currency: 'INR',
    stockQuantity: trackStock ? stockQuantity : 0,
    reservedStock: trackStock ? index % 9 : 0,
    lowStockThreshold: reorderLevel,
    reorderLevel,
    warehouse: ['Main Fulfillment Center', 'Apparel Warehouse', 'Tech Storage', 'West Zone DC'][index % 4],
    trackStock,
    images: [productImage(name, generatedAccents[index % generatedAccents.length])],
    tags: ['mock-data', categoryIds[index % categoryIds.length].replace('cat-', '')],
    variants: index % 2 === 0 ? [{ name: 'Color', values: ['Black', 'White', 'Blue'] }] : [{ name: 'Size', values: ['S', 'M', 'L'] }],
    inventoryHistory: [
      inventoryHistory('Add Stock', 0, trackStock ? stockQuantity : 0, 'Inventory Seed', 'Generated catalog opening stock.', isoDaysAgo(index % 45)),
    ],
    createdAt: isoDaysAgo(20 + (index % 90)),
    updatedAt: isoDaysAgo(index % 20),
    activity: [
      activity('Created', 'Generated product added for ecommerce CRM mock data.', 'Catalog Seed', 'success', isoDaysAgo(index % 30)),
    ],
  }
}

export const initialProducts: CatalogProduct[] = [
  ...featuredProducts,
  ...Array.from({ length: 195 }, (_, index) => generatedCatalogProduct(index)),
]

export function formatCatalogCurrency(value: number, currency: CatalogCurrency = 'INR') {
  return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatCatalogDate(value: string | undefined | null) {
  if (!value) return 'N/A'
  const date = new Date(value)
  if (isNaN(date.getTime())) return 'Invalid Date'
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function formatCatalogDateTime(value: string | undefined | null) {
  if (!value) return 'N/A'
  const date = new Date(value)
  if (isNaN(date.getTime())) return 'Invalid Date'
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function isInventoryTracked(product: CatalogProduct) {
  return product.productType === 'Physical' && product.trackStock
}

export function getAvailableStock(product: CatalogProduct) {
  if (!isInventoryTracked(product)) return 0
  return Math.max(0, product.stockQuantity - product.reservedStock)
}

export function getInventoryValue(product: CatalogProduct) {
  if (!isInventoryTracked(product)) return 0
  return product.stockQuantity * product.costPrice
}

export function isLowStock(product: CatalogProduct) {
  return isInventoryTracked(product) && product.stockQuantity <= product.reorderLevel
}

export function stockLabel(product: CatalogProduct) {
  if (!isInventoryTracked(product)) return 'Not tracked'
  if (product.stockQuantity <= 0) return 'Out of stock'
  if (product.stockQuantity <= product.reorderLevel) return 'Low stock'
  return 'In stock'
}
