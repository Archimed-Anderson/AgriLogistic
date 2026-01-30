import { redirect } from "next/navigation"

export default function DashboardPage() {
  // Redirect to farmer dashboard by default
  // In production, this would check user role and redirect accordingly
  redirect("/dashboard/farmer")
}
