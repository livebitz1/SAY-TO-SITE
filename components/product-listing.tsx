"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Product {
  id: number
  name: string
  price: number
  image: string
  description?: string
  category?: string
  rating?: number
  inStock?: boolean
  onSale?: boolean
}

interface ProductListingProps {
  products: Product[]
}

export function ProductListing({ products = [] }: ProductListingProps) {
  const [cart, setCart] = useState<Product[]>([])
  const [wishlist, setWishlist] = useState<number[]>([])

  const addToCart = (product: Product) => {
    setCart((prev) => [...prev, product])
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const toggleWishlist = (productId: number) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter((id) => id !== productId))
    } else {
      setWishlist([...wishlist, productId])
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold mb-8 text-center">Featured Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="relative h-48 bg-gray-100">
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
              {product.onSale && <Badge className="absolute top-2 right-2 bg-red-500">Sale</Badge>}
              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-2 left-2 p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
              >
                <Heart
                  className={`h-5 w-5 ${wishlist.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                />
              </button>
            </div>

            <CardHeader className="p-4 pb-0">
              <CardTitle className="text-lg">{product.name}</CardTitle>
            </CardHeader>

            <CardContent className="p-4 pt-2">
              <div className="flex justify-between items-center">
                <p className="font-bold text-lg">${product.price.toFixed(2)}</p>
                {product.rating && (
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm ml-1">{product.rating}</span>
                  </div>
                )}
              </div>
              {product.description && <p className="text-gray-500 text-sm mt-2 line-clamp-2">{product.description}</p>}
            </CardContent>

            <CardFooter className="p-4 pt-0">
              <Button onClick={() => addToCart(product)} className="w-full" disabled={product.inStock === false}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                {product.inStock === false ? "Out of Stock" : "Add to Cart"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
