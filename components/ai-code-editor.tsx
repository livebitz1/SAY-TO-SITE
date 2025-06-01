"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Code, Eye, Download, Copy, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { HtmlPreview } from "@/components/html-preview"

interface CodeEditorProps {
  files: { name: string; content: string }[]
  isLoading?: boolean
  onSave?: (files: { name: string; content: string }[]) => void
}

export function AICodeEditor({ files, isLoading = false, onSave }: CodeEditorProps) {
  const [activeTab, setActiveTab] = useState("preview")
  const [editedFiles, setEditedFiles] = useState(files)
  const [copied, setCopied] = useState<Record<string, boolean>>({})
  const editorRefs = useRef<Record<string, HTMLTextAreaElement | null>>({})
  const { toast } = useToast()

  useEffect(() => {
    setEditedFiles(files)
  }, [files])

  const handleCopy = (content: string, fileName: string) => {
    navigator.clipboard.writeText(content)
    setCopied({ ...copied, [fileName]: true })

    toast({
      title: "Copied to clipboard",
      description: `${fileName} has been copied to your clipboard`,
      duration: 2000,
    })

    setTimeout(() => {
      setCopied({ ...copied, [fileName]: false })
    }, 2000)
  }

  const handleChange = (content: string, fileName: string) => {
    const newFiles = editedFiles.map((file) => (file.name === fileName ? { ...file, content } : file))
    setEditedFiles(newFiles)
  }

  const handleSave = () => {
    if (onSave) {
      onSave(editedFiles)
      toast({
        title: "Changes saved",
        description: "Your code changes have been saved",
        duration: 2000,
      })
    }
  }

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-950 overflow-hidden">
      <Tabs defaultValue="preview" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between p-2 border-b border-gray-800">
          <TabsList className="bg-gray-900">
            <TabsTrigger value="preview" className="data-[state=active]:bg-gray-800">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
            {editedFiles.map((file) => (
              <TabsTrigger key={file.name} value={file.name} className="data-[state=active]:bg-gray-800">
                <Code className="h-4 w-4 mr-2" />
                {file.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex items-center space-x-2">
            {activeTab !== "preview" && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleCopy(editedFiles.find((f) => f.name === activeTab)?.content || "", activeTab)}
                className="h-8"
              >
                {copied[activeTab] ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                Copy
              </Button>
            )}
            <Button size="sm" variant="default" onClick={handleSave} className="h-8" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Download className="h-4 w-4 mr-1" />}
              Save Changes
            </Button>
          </div>
        </div>

        <TabsContent value="preview" className="m-0">
          <div className="h-[600px]">
            <HtmlPreview files={editedFiles} height="600px" showDeviceControls={true} showNavigator={true} />
          </div>
        </TabsContent>

        {editedFiles.map((file) => (
          <TabsContent key={file.name} value={file.name} className="m-0">
            <div className="relative h-[600px]">
              <textarea
                ref={(el) => (editorRefs.current[file.name] = el)}
                value={file.content}
                onChange={(e) => handleChange(e.target.value, file.name)}
                className="w-full h-full p-4 bg-gray-950 text-gray-200 font-mono text-sm resize-none focus:outline-none"
                spellCheck="false"
              />
              <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleCopy(file.content, file.name)}
                  className="h-8 bg-gray-800 hover:bg-gray-700"
                >
                  {copied[file.name] ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  Copy All
                </Button>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
