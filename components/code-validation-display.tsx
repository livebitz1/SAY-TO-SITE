import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, XCircle } from "lucide-react"

interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  score: number
}

interface CodeValidationDisplayProps {
  validation: ValidationResult
}

export function CodeValidationDisplay({ validation }: CodeValidationDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-500"
    if (score >= 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="w-5 h-5 text-green-500" />
    if (score >= 70) return <AlertCircle className="w-5 h-5 text-yellow-500" />
    return <XCircle className="w-5 h-5 text-red-500" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Code Quality Score</span>
          <Badge className={`ml-2 ${getScoreColor(validation.score)}`}>{validation.score}/100</Badge>
        </CardTitle>
        <CardDescription>Validation results for your generated code</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          {getScoreIcon(validation.score)}
          <span className="font-medium">
            {validation.isValid ? "Code passed validation" : "Code needs improvement"}
          </span>
        </div>

        {validation.errors.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-red-500">Errors</h4>
            <ul className="list-disc pl-5 space-y-1">
              {validation.errors.map((error, index) => (
                <li key={index} className="text-sm text-red-500">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {validation.warnings.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-yellow-500">Warnings</h4>
            <ul className="list-disc pl-5 space-y-1">
              {validation.warnings.map((warning, index) => (
                <li key={index} className="text-sm text-yellow-500">
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-2 text-sm text-gray-500">
          <p>Improve your score by addressing the issues above.</p>
        </div>
      </CardContent>
    </Card>
  )
}
