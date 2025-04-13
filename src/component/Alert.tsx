import { AlertCircle,Terminal } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import type { AlertData } from "@/types/Alert"
interface AlertComponentProps {
  alert: AlertData
}
export function AlertComponent({ alert }: AlertComponentProps) {
    return (
      <Alert variant="destructive"className="my-3 h-25 w-150">
      <AlertCircle className="h-5 w-5" />
      <AlertTitle className="text-xl">{alert.message}</AlertTitle>
        <AlertDescription className="text-sm">
          Giá trị: {alert.value} ({alert.type}) <br />
          Lúc: {new Date(alert.createdAt).toLocaleString()}
        </AlertDescription>
      </Alert>
    )
  }
