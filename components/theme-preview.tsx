"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateCompleteTheme } from "@/utils/theme-generator"
import type { DesignStyle, ColorScheme } from "@/utils/theme-generator"

const styles: DesignStyle[] = ["modern", "minimalist", "bold", "elegant", "playful"]
const schemes: ColorScheme[] = ["vibrant", "monochrome", "pastel", "dark", "custom"]

export function ThemePreview() {
  const [selectedStyle, setSelectedStyle] = useState<DesignStyle>("modern")
  const [selectedScheme, setSelectedScheme] = useState<ColorScheme>("vibrant")

  // Generate theme CSS
  const themeCSS = generateCompleteTheme(selectedStyle, selectedScheme)

  // Sample HTML to showcase the theme
  const sampleHTML = `
    <div class="container">
      <header>
        <nav>
          <div class="logo">Brand</div>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Features</a></li>
            <li><a href="#">Pricing</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </nav>
      </header>
      
      <section class="hero">
        <div>
          <h1>Welcome to our <span class="gradient-text">Platform</span></h1>
          <p>Experience the future of web development with our cutting-edge tools.</p>
          <div class="cta">
            <button class="btn-primary">Get Started</button>
            <button class="btn-outline">Learn More</button>
          </div>
        </div>
      </section>
      
      <section>
        <h2>Our Features</h2>
        <div class="features">
          <div class="card">
            <h3>Feature 1</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
          <div class="card">
            <h3>Feature 2</h3>
            <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
          <div class="card">
            <h3>Feature 3</h3>
            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
          </div>
        </div>
      </section>
      
      <footer>
        <p>&copy; 2024 Brand. All rights reserved.</p>
      </footer>
    </div>
  `

  // Additional CSS for the sample
  const additionalCSS = `
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    header {
      padding: 1rem 0;
    }
    
    nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo {
      font-size: 1.5rem;
      font-weight: 700;
    }
    
    nav ul {
      display: flex;
      list-style: none;
      gap: 1.5rem;
    }
    
    .hero {
      min-height: 60vh;
      display: flex;
      align-items: center;
      text-align: center;
      padding: 2rem 0;
    }
    
    .hero h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    
    .hero p {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .cta {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
    
    section {
      padding: 4rem 0;
      text-align: center;
    }
    
    section h2 {
      font-size: 2rem;
      margin-bottom: 2rem;
    }
    
    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    
    footer {
      text-align: center;
      padding: 2rem 0;
    }
  `

  // Combine all CSS
  const combinedCSS = `
    ${themeCSS}
    ${additionalCSS}
  `

  // Full HTML for the iframe
  const fullHTML = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Theme Preview</title>
        <style>
          ${combinedCSS}
        </style>
      </head>
      <body>
        ${sampleHTML}
      </body>
    </html>
  `

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Theme Preview</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">Explore different design styles and color schemes</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Design Style</CardTitle>
            <CardDescription>Choose a design style for your website</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedStyle} onValueChange={(value) => setSelectedStyle(value as DesignStyle)}>
              <TabsList className="grid grid-cols-5 w-full">
                {styles.map((style) => (
                  <TabsTrigger key={style} value={style}>
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Color Scheme</CardTitle>
            <CardDescription>Choose a color scheme for your website</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedScheme} onValueChange={(value) => setSelectedScheme(value as ColorScheme)}>
              <TabsList className="grid grid-cols-5 w-full">
                {schemes.map((scheme) => (
                  <TabsTrigger key={scheme} value={scheme}>
                    {scheme.charAt(0).toUpperCase() + scheme.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {selectedStyle.charAt(0).toUpperCase() + selectedStyle.slice(1)} +
            {" " + selectedScheme.charAt(0).toUpperCase() + selectedScheme.slice(1)}
          </CardTitle>
          <CardDescription>Preview of the selected theme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden h-[600px]">
            <iframe srcDoc={fullHTML} title="Theme Preview" className="w-full h-full" sandbox="allow-scripts" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
