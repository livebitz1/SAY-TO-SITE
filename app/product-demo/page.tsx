import { ProductListing } from "@/components/product-listing"

const demoProducts = [
  {
    id: 1,
    name: "Product 1",
    price: 19.99,
    image: "/placeholder.svg?height=400&width=400&query=product",
    description: "This is a description for product 1. It has many great features.",
    category: "Electronics",
    rating: 4.5,
    inStock: true,
    onSale: true,
  },
  {
    id: 2,
    name: "Product 2",
    price: 29.99,
    image: "/placeholder.svg?height=400&width=400&query=modern+gadget",
    description: "This is a description for product 2. It has many great features.",
    category: "Electronics",
    rating: 4.2,
    inStock: true,
    onSale: false,
  },
  {
    id: 3,
    name: "Product 3",
    price: 39.99,
    image: "/placeholder.svg?height=400&width=400&query=stylish+accessory",
    description: "This is a description for product 3. It has many great features.",
    category: "Accessories",
    rating: 3.8,
    inStock: true,
    onSale: false,
  },
  {
    id: 4,
    name: "Product 4",
    price: 49.99,
    image: "/placeholder.svg?height=400&width=400&query=premium+device",
    description: "This is a description for product 4. It has many great features.",
    category: "Electronics",
    rating: 4.9,
    inStock: false,
    onSale: false,
  },
]

export default function ProductDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-800">Product Showcase</h1>
        </div>
      </header>

      <main>
        <ProductListing products={demoProducts} />
      </main>
    </div>
  )
}
