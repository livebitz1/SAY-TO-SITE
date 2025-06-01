"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"

const UI_PATTERNS = {
  heroes: [
    {
      name: "Gradient Hero with Floating Elements",
      description: "A modern hero section with gradient background and floating elements",
      preview: "/placeholder.svg?height=300&width=600&query=modern%20website%20hero%20with%20gradient",
      code: `
<section class="hero">
  <div class="hero-background">
    <div class="gradient-orb gradient-orb-1"></div>
    <div class="gradient-orb gradient-orb-2"></div>
    <div class="gradient-orb gradient-orb-3"></div>
  </div>
  <div class="hero-content">
    <h1 class="hero-title">
      <span class="title-line">Build Something</span>
      <span class="title-line gradient-text">Extraordinary</span>
    </h1>
    <p class="hero-description">
      Transform your ideas into reality with our cutting-edge platform
    </p>
    <div class="hero-cta">
      <button class="btn btn-primary">Get Started</button>
      <button class="btn btn-secondary">Learn More</button>
    </div>
  </div>
  <div class="floating-elements">
    <div class="float-element float-1"></div>
    <div class="float-element float-2"></div>
    <div class="float-element float-3"></div>
  </div>
</section>

<style>
  .hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  
  .hero-background {
    position: absolute;
    inset: 0;
    z-index: -1;
  }
  
  .gradient-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.6;
    animation: float 20s infinite ease-in-out;
  }
  
  .gradient-orb-1 {
    width: 600px;
    height: 600px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    top: -200px;
    left: -200px;
    animation-delay: 0s;
  }
  
  .gradient-orb-2 {
    width: 400px;
    height: 400px;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    bottom: -100px;
    right: -100px;
    animation-delay: 5s;
  }
  
  .gradient-orb-3 {
    width: 300px;
    height: 300px;
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation-delay: 10s;
  }
  
  .hero-content {
    text-align: center;
    z-index: 1;
    max-width: 800px;
    padding: 2rem;
  }
  
  .hero-title {
    font-size: clamp(3rem, 8vw, 6rem);
    font-weight: 900;
    line-height: 1.1;
    margin-bottom: 1.5rem;
  }
  
  .title-line {
    display: block;
  }
  
  .gradient-text {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .hero-description {
    font-size: clamp(1.2rem, 3vw, 1.5rem);
    color: #666;
    margin-bottom: 2rem;
    opacity: 0;
    animation: fadeInUp 1s ease-out 0.5s forwards;
  }
  
  .hero-cta {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    opacity: 0;
    animation: fadeInUp 1s ease-out 0.7s forwards;
  }
  
  .btn {
    padding: 1rem 2.5rem;
    font-size: 1.1rem;
    font-weight: 600;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  .btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
  
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
  }
  
  .btn-secondary {
    background: transparent;
    color: #667eea;
    border: 2px solid #667eea;
  }
  
  .btn-secondary:hover {
    background: #667eea;
    color: white;
    transform: translateY(-2px);
  }
  
  .floating-elements {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  
  .float-element {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .float-1 {
    width: 80px;
    height: 80px;
    top: 20%;
    left: 10%;
    animation: float 15s infinite ease-in-out;
  }
  
  .float-2 {
    width: 120px;
    height: 120px;
    top: 60%;
    right: 10%;
    animation: float 20s infinite ease-in-out reverse;
  }
  
  .float-3 {
    width: 60px;
    height: 60px;
    bottom: 20%;
    left: 30%;
    animation: float 18s infinite ease-in-out;
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
      `,
    },
    {
      name: "Split Screen Hero with Video",
      description: "A modern split-screen hero with video background on one side",
      preview: "/placeholder.svg?height=300&width=600&query=split%20screen%20hero%20with%20video",
      code: `
<section class="split-hero">
  <div class="split-content">
    <div class="content-inner">
      <h1 class="split-title">Experience the Future</h1>
      <p class="split-description">
        Immerse yourself in cutting-edge technology that transforms the way you work
      </p>
      <button class="cta-button">
        <span>Start Your Journey</span>
        <svg class="arrow-icon" viewBox="0 0 24 24">
          <path d="M5 12h14m-7-7l7 7-7 7"/>
        </svg>
      </button>
    </div>
  </div>
  <div class="split-media">
    <video autoplay muted loop playsinline>
      <source src="hero-video.mp4" type="video/mp4">
    </video>
    <div class="media-overlay"></div>
  </div>
</section>

<style>
  .split-hero {
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: 100vh;
  }
  
  .split-content {
    display: flex;
    align-items: center;
    padding: 4rem;
    background: #0a0a0a;
    color: white;
  }
  
  .content-inner {
    max-width: 600px;
  }
  
  .split-title {
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 800;
    margin-bottom: 1.5rem;
    line-height: 1.1;
  }
  
  .split-description {
    font-size: 1.25rem;
    color: #888;
    margin-bottom: 2rem;
    line-height: 1.6;
  }
  
  .cta-button {
    display: inline-flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem 2rem;
    background: white;
    color: #0a0a0a;
    border: none;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  .cta-button:hover {
    transform: translateX(5px);
  }
  
  .arrow-icon {
    width: 24px;
    height: 24px;
    stroke: currentColor;
    stroke-width: 2;
    fill: none;
    transition: transform 0.3s ease;
  }
  
  .cta-button:hover .arrow-icon {
    transform: translateX(5px);
  }
  
  .split-media {
    position: relative;
    overflow: hidden;
  }
  
  .split-media video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .media-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, rgba(0,0,0,0.4) 0%, transparent 100%);
  }
  
  @media (max-width: 768px) {
    .split-hero {
      grid-template-columns: 1fr;
    }
    
    .split-content {
      padding: 3rem 2rem;
    }
    
    .split-media {
      height: 300px;
    }
  }
</style>
      `,
    },
  ],
  features: [
    {
      name: "Bento Grid Features",
      description: "A modern bento grid layout for showcasing features",
      preview: "/placeholder.svg?height=300&width=600&query=bento%20grid%20features%20section",
      code: `
<section class="features-section">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">Powerful Features</h2>
      <p class="section-subtitle">Everything you need to succeed</p>
    </div>
    
    <div class="bento-grid">
      <div class="bento-item bento-large">
        <div class="bento-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <h3>Advanced Analytics</h3>
        <p>Get deep insights into your data with our powerful analytics engine</p>
        <div class="bento-visual">
          <div class="chart-bar" style="height: 60%"></div>
          <div class="chart-bar" style="height: 80%"></div>
          <div class="chart-bar" style="height: 40%"></div>
          <div class="chart-bar" style="height: 90%"></div>
          <div class="chart-bar" style="height: 70%"></div>
        </div>
      </div>
      
      <div class="bento-item">
        <div class="bento-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 2v20m-7-7l7 7 7-7"/>
          </svg>
        </div>
        <h3>Real-time Sync</h3>
        <p>Stay updated with instant synchronization across all devices</p>
      </div>
      
      <div class="bento-item">
        <div class="bento-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <h3>Enterprise Security</h3>
        <p>Bank-level encryption and security for your peace of mind</p>
      </div>
      
      <div class="bento-item bento-wide">
        <div class="bento-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M9 9h6v6H9z"/>
          </svg>
        </div>
        <h3>Seamless Integration</h3>
        <p>Connect with your favorite tools and services effortlessly</p>
        <div class="integration-logos">
          <div class="logo-item"></div>
          <div class="logo-item"></div>
          <div class="logo-item"></div>
          <div class="logo-item"></div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .features-section {
    padding: 5rem 0;
    background: #fafafa;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }
  
  .section-header {
    text-align: center;
    margin-bottom: 4rem;
  }
  
  .section-title {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .section-subtitle {
    font-size: 1.25rem;
    color: #666;
  }
  
  .bento-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    grid-auto-flow: dense;
  }
  
  .bento-item {
    background: white;
    padding: 2rem;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  .bento-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }
  
  .bento-large {
    grid-column: span 2;
    grid-row: span 2;
  }
  
  .bento-wide {
    grid-column: span 2;
  }
  
  .bento-icon {
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
  }
  
  .bento-icon svg {
    width: 24px;
    height: 24px;
    stroke: white;
    stroke-width: 2;
  }
  
  .bento-item h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  .bento-item p {
    color: #666;
    line-height: 1.6;
  }
  
  .bento-visual {
    display: flex;
    align-items: flex-end;
    gap: 0.5rem;
    margin-top: 2rem;
    height: 100px;
  }
  
  .chart-bar {
    flex: 1;
    background: linear-gradient(to top, #667eea, #764ba2);
    border-radius: 5px 5px 0 0;
    position: relative;
    opacity: 0;
    animation: growBar 1s ease-out forwards;
  }
  
  @keyframes growBar {
    to {
      opacity: 1;
    }
  }
  
  .integration-logos {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  .logo-item {
    width: 50px;
    height: 50px;
    background: #f0f0f0;
    border-radius: 10px;
    transition: transform 0.3s ease;
  }
  
  .logo-item:hover {
    transform: scale(1.1);
  }
  
  @media (max-width: 768px) {
    .bento-large,
    .bento-wide {
      grid-column: span 1;
      grid-row: span 1;
    }
  }
</style>
      `,
    },
  ],
  navigation: [
    {
      name: "Sticky Navigation with Blur",
      description: "A modern sticky navigation with blur effect",
      preview: "/placeholder.svg?height=300&width=600&query=sticky%20navigation%20with%20blur%20effect",
      code: `
<nav class="navbar">
  <div class="nav-container">
    <a href="#" class="nav-logo">
      <span class="logo-text">Brand</span>
    </a>
    
    <ul class="nav-menu">
      <li class="nav-item">
        <a href="#" class="nav-link">Home</a>
      </li>
      <li class="nav-item">
        <a href="#" class="nav-link">About</a>
      </li>
      <li class="nav-item dropdown">
        <a href="#" class="nav-link">Services</a>
        <ul class="dropdown-menu">
          <li><a href="#">Web Design</a></li>
          <li><a href="#">Development</a></li>
          <li><a href="#">Consulting</a></li>
        </ul>
      </li>
      <li class="nav-item">
        <a href="#" class="nav-link">Contact</a>
      </li>
    </ul>
    
    <button class="nav-toggle" aria-label="Toggle menu">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </div>
</nav>

<style>
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
  
  .navbar.scrolled {
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  }
  
  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .nav-logo {
    font-size: 1.5rem;
    font-weight: 800;
    color: #0a0a0a;
    text-decoration: none;
  }
  
  .nav-menu {
    display: flex;
    list-style: none;
    gap: 2rem;
    margin: 0;
    padding: 0;
  }
  
  .nav-link {
    color: #333;
    text-decoration: none;
    font-weight: 500;
    position: relative;
    transition: color 0.3s ease;
  }
  
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: #667eea;
    transition: width 0.3s ease;
  }
  
  .nav-link:hover {
    color: #667eea;
  }
  
  .nav-link:hover::after {
    width: 100%;
  }
  
  .dropdown {
    position: relative;
  }
  
  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background: white;
    min-width: 200px;
    padding: 1rem 0;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s ease;
    list-style: none;
  }
  
  .dropdown:hover .dropdown-menu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
  
  .dropdown-menu a {
    display: block;
    padding: 0.5rem 1.5rem;
    color: #333;
    text-decoration: none;
    transition: background 0.3s ease;
  }
  
  .dropdown-menu a:hover {
    background: #f5f5f5;
    color: #667eea;
  }
  
  .nav-toggle {
    display: none;
    flex-direction: column;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
  }
  
  .nav-toggle span {
    width: 25px;
    height: 3px;
    background: #333;
    margin: 3px 0;
    transition: all 0.3s ease;
  }
  
  @media (max-width: 768px) {
    .nav-menu {
      position: fixed;
      left: -100%;
      top: 70px;
      flex-direction: column;
      background: white;
      width: 100%;
      text-align: center;
      transition: 0.3s;
      box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
      padding: 2rem 0;
    }
    
    .nav-menu.active {
      left: 0;
    }
    
    .nav-toggle {
      display: flex;
    }
    
    .dropdown-menu {
      position: static;
      opacity: 1;
      visibility: visible;
      transform: none;
      box-shadow: none;
      background: #f5f5f5;
    }
  }
</style>

<script>
  // Scroll effect
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
  
  // Mobile menu toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
  });
</script>
      `,
    },
  ],
  footers: [
    {
      name: "Modern Footer with Newsletter",
      description: "A comprehensive footer with newsletter signup",
      preview: "/placeholder.svg?height=300&width=600&query=modern%20footer%20with%20newsletter",
      code: `
<footer class="footer">
  <div class="footer-content">
    <div class="footer-section footer-brand">
      <h3 class="footer-logo">Brand</h3>
      <p class="footer-tagline">Building the future, one pixel at a time</p>
      <div class="social-links">
        <a href="#" aria-label="Twitter">
          <svg viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
        </a>
        <a href="#" aria-label="GitHub">
          <svg viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>
        </a>
        <a href="#" aria-label="LinkedIn">
          <svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
        </a>
      </div>
    </div>
    
    <div class="footer-section">
      <h4>Product</h4>
      <ul>
        <li><a href="#">Features</a></li>
        <li><a href="#">Pricing</a></li>
        <li><a href="#">Security</a></li>
        <li><a href="#">Roadmap</a></li>
      </ul>
    </div>
    
    <div class="footer-section">
      <h4>Company</h4>
      <ul>
        <li><a href="#">About</a></li>
        <li><a href="#">Blog</a></li>
        <li><a href="#">Careers</a></li>
        <li><a href="#">Press</a></li>
      </ul>
    </div>
    
    <div class="footer-section">
      <h4>Resources</h4>
      <ul>
        <li><a href="#">Documentation</a></li>
        <li><a href="#">Help Center</a></li>
        <li><a href="#">Community</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </div>
    
    <div class="footer-section footer-newsletter">
      <h4>Stay Updated</h4>
      <p>Get the latest news and updates</p>
      <form class="newsletter-form">
        <input type="email" placeholder="Enter your email" required>
        <button type="submit">Subscribe</button>
      </form>
    </div>
  </div>
  
  <div class="footer-bottom">
    <p>&copy; 2024 Brand. All rights reserved.</p>
    <div class="footer-links">
      <a href="#">Privacy Policy</a>
      <a href="#">Terms of Service</a>
      <a href="#">Cookie Policy</a>
    </div>
  </div>
</footer>

<style>
  .footer {
    background: #0a0a0a;
    color: white;
    padding: 4rem 0 2rem;
    margin-top: 5rem;
  }
  
  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 2fr;
    gap: 3rem;
    margin-bottom: 3rem;
  }
  
  .footer-logo {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .footer-tagline {
    color: #888;
    margin-bottom: 1.5rem;
  }
  
  .social-links {
    display: flex;
    gap: 1rem;
  }
  
  .social-links a {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }
  
  .social-links a:hover {
    background: #667eea;
    transform: translateY(-3px);
  }
  
  .social-links svg {
    width: 20px;
    height: 20px;
    fill: white;
  }
  
  .footer-section h4 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
  }
  
  .footer-section ul {
    list-style: none;
    padding: 0;
  }
  
  .footer-section li {
    margin-bottom: 0.75rem;
  }
  
  .footer-section a {
    color: #888;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .footer-section a:hover {
    color: white;
  }
  
  .newsletter-form {
    display: flex;
    margin-top: 1rem;
    border-radius: 50px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.1);
  }
  
  .newsletter-form input {
    flex: 1;
    padding: 0.75rem 1.5rem;
    background: none;
    border: none;
    color: white;
    font-size: 1rem;
  }
  
  .newsletter-form input::placeholder {
    color: #888;
  }
  
  .newsletter-form button {
    padding: 0.75rem 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.3s ease;
  }
  
  .newsletter-form button:hover {
    opacity: 0.9;
  }
  
  .footer-bottom {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .footer-bottom p {
    color: #888;
  }
  
  .footer-links {
    display: flex;
    gap: 2rem;
  }
  
  .footer-links a {
    color: #888;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .footer-links a:hover {
    color: white;
  }
  
  @media (max-width: 768px) {
    .footer-content {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    
    .footer-bottom {
      flex-direction: column;
      text-align: center;
    }
    
    .footer-links {
      flex-direction: column;
      gap: 1rem;
    }
  }
</style>
      `,
    },
  ],
}

export function UIPatternShowcase() {
  const [activeCategory, setActiveCategory] = useState("heroes")
  const [activePattern, setActivePattern] = useState(0)
  const [copied, setCopied] = useState(false)

  const patterns = UI_PATTERNS[activeCategory as keyof typeof UI_PATTERNS]
  const currentPattern = patterns[activePattern]

  const copyCode = () => {
    navigator.clipboard.writeText(currentPattern.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">UI Pattern Library</h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Browse our collection of modern UI patterns to enhance your website design
        </p>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory as any} className="space-y-6">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="heroes">Hero Sections</TabsTrigger>
          <TabsTrigger value="features">Feature Sections</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="footers">Footers</TabsTrigger>
        </TabsList>

        <TabsContent value={activeCategory} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Available Patterns</CardTitle>
                  <CardDescription>Select a pattern to view</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {patterns.map((pattern, index) => (
                      <button
                        key={index}
                        onClick={() => setActivePattern(index)}
                        className={`w-full text-left p-4 transition-colors ${
                          activePattern === index
                            ? "bg-purple-50 dark:bg-purple-950 border-l-4 border-purple-500"
                            : "hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                      >
                        <div className="font-medium">{pattern.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{pattern.description}</div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-3 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{currentPattern.name}</span>
                    <Button variant="outline" size="sm" onClick={copyCode} className="flex items-center gap-2">
                      <Copy className="w-4 h-4" />
                      {copied ? "Copied!" : "Copy Code"}
                    </Button>
                  </CardTitle>
                  <CardDescription>{currentPattern.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="border-t">
                    <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative">
                      <img
                        src={currentPattern.preview || "/placeholder.svg"}
                        alt={currentPattern.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 overflow-auto max-h-[400px]">
                      <pre className="text-sm">
                        <code>{currentPattern.code}</code>
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
