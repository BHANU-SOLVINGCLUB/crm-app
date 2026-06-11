import { Boxes, Layers3, Package, Tags } from 'lucide-react'
import PageHeader from '../Components/PageHeader'
import './EnterpriseSuite.css'

const products = [
  { name: 'Laptop Package', sku: 'BND-LTP-100', category: 'Electronics', brand: 'Krisantec', price: '$1,249', cost: '$920', tax: '18% GST', stock: 48, status: 'Published' },
  { name: 'CRM Enterprise License', sku: 'SVC-CRM-ENT', category: 'Software', brand: 'Krisantec Cloud', price: '$149/user', cost: '$38/user', tax: '18% GST', stock: 999, status: 'Published' },
  { name: 'Implementation Sprint', sku: 'SRV-IMP-30', category: 'Services', brand: 'Krisantec Consulting', price: '$8,500', cost: '$5,200', tax: '18% GST', stock: 12, status: 'Draft' },
]

const bundles = [
  { title: 'Laptop Package', items: 'Laptop, Mouse, Keyboard', priceBook: 'Retail Pricing', margin: '26%' },
  { title: 'Distributor Starter Kit', items: 'CRM License, Support SLA, Training', priceBook: 'Distributor Pricing', margin: '34%' },
  { title: 'Wholesale Support Pack', items: 'Implementation, Data Migration, Admin Training', priceBook: 'Wholesale Pricing', margin: '29%' },
]

export default function ProductCatalogPage() {
  return (
    <div className="suite-page">
      <PageHeader
        eyebrow="Product Catalog"
        title="Products, pricing, inventory"
        subtitle="Manage products and services, brands, categories, price books, bundles, taxes, stock, warehouses, and reorder levels."
        actions={<button className="btn-primary" type="button"><Package size={16} /> Create Product</button>}
      />

      <div className="suite-grid four">
        <div className="suite-panel suite-panel-pad suite-kpi">
          <div><div className="suite-kpi-label">Active products</div><div className="suite-kpi-value">248</div><div className="suite-kpi-note">Across electronics, software, and services</div></div>
          <div className="suite-icon"><Boxes size={20} /></div>
        </div>
        <div className="suite-panel suite-panel-pad suite-kpi">
          <div><div className="suite-kpi-label">Categories</div><div className="suite-kpi-value">18</div><div className="suite-kpi-note">Electronics, Software, Services</div></div>
          <div className="suite-icon"><Layers3 size={20} /></div>
        </div>
        <div className="suite-panel suite-panel-pad suite-kpi">
          <div><div className="suite-kpi-label">Price books</div><div className="suite-kpi-value">3</div><div className="suite-kpi-note">Retail, Wholesale, Distributor</div></div>
          <div className="suite-icon"><Tags size={20} /></div>
        </div>
        <div className="suite-panel suite-panel-pad suite-kpi">
          <div><div className="suite-kpi-label">Reorder alerts</div><div className="suite-kpi-value">11</div><div className="suite-kpi-note">Warehouse stock below threshold</div></div>
          <div className="suite-icon"><Package size={20} /></div>
        </div>
      </div>

      <section className="suite-section suite-panel">
        <div className="suite-table-wrap">
          <table className="suite-table">
            <thead>
              <tr><th>Product</th><th>SKU</th><th>Category</th><th>Brand</th><th>Price</th><th>Cost</th><th>Tax</th><th>Stock</th><th>Status</th></tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.sku}>
                  <td><div className="suite-name">{product.name}</div><div className="suite-muted">Images, description, and publish workflow ready</div></td>
                  <td>{product.sku}</td><td>{product.category}</td><td>{product.brand}</td><td>{product.price}</td><td>{product.cost}</td><td>{product.tax}</td><td>{product.stock}</td>
                  <td><span className={`suite-pill ${product.status === 'Published' ? 'green' : 'amber'}`}>{product.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="suite-section">
        <h2 className="suite-section-title">Product bundles</h2>
        <div className="suite-grid three">
          {bundles.map((bundle) => (
            <div className="suite-panel suite-panel-pad" key={bundle.title}>
              <div className="suite-name">{bundle.title}</div>
              <p className="suite-muted mt-2">{bundle.items}</p>
              <div className="suite-task-meta">
                <span className="suite-pill">{bundle.priceBook}</span>
                <span className="suite-pill green">{bundle.margin} margin</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
