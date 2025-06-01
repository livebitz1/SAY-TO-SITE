import { type NextRequest, NextResponse } from "next/server"
import { Buffer } from "buffer"

export const maxDuration = 60 // Changed from 300 to 60 seconds to comply with Vercel hobby plan limits

export async function POST(request: NextRequest) {
  try {
    const { files, projectName } = await request.json()

    if (!process.env.VERCEL_TOKEN) {
      return NextResponse.json({ error: "VERCEL_TOKEN is not configured" }, { status: 500 })
    }

    // For static HTML sites, we need to prepare files differently
    const deploymentFiles: any[] = []

    // Find the main HTML file
    const htmlFile = files.find((f: any) => f.name === "index.html" || f.name.endsWith("index.html"))

    if (htmlFile) {
      // Deploy as static HTML site
      deploymentFiles.push({
        file: "index.html",
        data: Buffer.from(htmlFile.content).toString("base64"),
        encoding: "base64",
      })

      // Add CSS files
      const cssFiles = files.filter((f: any) => f.name.endsWith(".css"))
      cssFiles.forEach((file: any) => {
        deploymentFiles.push({
          file: file.name.includes("/") ? file.name.split("/").pop() : file.name,
          data: Buffer.from(file.content).toString("base64"),
          encoding: "base64",
        })
      })

      // Add JS files
      const jsFiles = files.filter((f: any) => f.name.endsWith(".js"))
      jsFiles.forEach((file: any) => {
        deploymentFiles.push({
          file: file.name.includes("/") ? file.name.split("/").pop() : file.name,
          data: Buffer.from(file.content).toString("base64"),
          encoding: "base64",
        })
      })

      // Add a simple vercel.json for static hosting
      deploymentFiles.push({
        file: "vercel.json",
        data: Buffer.from(
          JSON.stringify(
            {
              buildCommand: "",
              outputDirectory: ".",
              framework: null,
            },
            null,
            2,
          ),
        ).toString("base64"),
        encoding: "base64",
      })
    } else {
      // If no HTML file found, return error
      return NextResponse.json({ error: "No HTML file found in the generated code" }, { status: 400 })
    }

    // Create deployment directly without creating a project first
    const deploymentPayload = {
      name: projectName.toLowerCase().replace(/\s+/g, "-"),
      files: deploymentFiles,
      target: "production",
      projectSettings: {
        framework: null,
        buildCommand: "",
        outputDirectory: ".",
      },
    }

    console.log("Creating deployment with payload:", {
      name: deploymentPayload.name,
      filesCount: deploymentPayload.files.length,
      target: deploymentPayload.target,
    })

    const deployResponse = await fetch("https://api.vercel.com/v13/deployments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deploymentPayload),
    })

    const deployResponseText = await deployResponse.text()
    console.log("Deploy response status:", deployResponse.status)
    console.log("Deploy response:", deployResponseText)

    if (!deployResponse.ok) {
      // If deployment fails because project doesn't exist, create it first
      if (deployResponse.status === 404 || deployResponseText.includes("not_found")) {
        console.log("Project not found, creating new project...")

        // Create project without framework specification
        const createProjectResponse = await fetch("https://api.vercel.com/v9/projects", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: projectName.toLowerCase().replace(/\s+/g, "-"),
          }),
        })

        if (!createProjectResponse.ok) {
          const errorData = await createProjectResponse.json()
          console.error("Error creating Vercel project:", JSON.stringify(errorData))
          return NextResponse.json(
            { error: `Failed to create Vercel project: ${JSON.stringify(errorData)}` },
            { status: 500 },
          )
        }

        // Retry deployment after creating project
        const retryDeployResponse = await fetch("https://api.vercel.com/v13/deployments", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(deploymentPayload),
        })

        const retryDeployData = await retryDeployResponse.json()

        if (!retryDeployResponse.ok) {
          console.error("Error deploying after project creation:", JSON.stringify(retryDeployData))
          return NextResponse.json(
            { error: `Failed to deploy after creating project: ${JSON.stringify(retryDeployData)}` },
            { status: 500 },
          )
        }

        const deploymentUrl =
          retryDeployData.url || retryDeployData.alias?.[0] || `https://${retryDeployData.name}.vercel.app`

        return NextResponse.json({
          deploymentUrl: deploymentUrl.startsWith("http") ? deploymentUrl : `https://${deploymentUrl}`,
          deploymentId: retryDeployData.id,
        })
      }

      return NextResponse.json({ error: `Failed to deploy: ${deployResponseText}` }, { status: 500 })
    }

    const deployData = JSON.parse(deployResponseText)
    const deploymentUrl = deployData.url || deployData.alias?.[0] || `https://${deployData.name}.vercel.app`

    return NextResponse.json({
      deploymentUrl: deploymentUrl.startsWith("http") ? deploymentUrl : `https://${deploymentUrl}`,
      deploymentId: deployData.id,
    })
  } catch (error) {
    console.error("Error in deploy-to-vercel:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to deploy to Vercel" },
      { status: 500 },
    )
  }
}
