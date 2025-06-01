import { NextResponse } from "next/server"

export async function GET() {
  const testHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS Test</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #333;
        }
        
        .container {
            background: white;
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            width: 90%;
        }
        
        h1 {
            color: #667eea;
            margin-bottom: 1rem;
            font-size: 2rem;
        }
        
        p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 1.5rem;
        }
        
        .button {
            background: #667eea;
            color: white;
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 0.5rem;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .button:hover {
            background: #5a67d8;
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>CSS is Working!</h1>
        <p>This is a test page to verify that CSS is being properly applied. If you can see styled text with a gradient background and a white container with shadow, then CSS is working correctly.</p>
        <button class="button" onclick="alert('CSS and JavaScript are both working!')">Test Button</button>
    </div>
</body>
</html>
  `

  return NextResponse.json({
    success: true,
    html: testHtml,
    fullCode: testHtml,
  })
}
