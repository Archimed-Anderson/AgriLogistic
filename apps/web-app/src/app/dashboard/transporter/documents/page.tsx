"use client"

import dynamic from "next/dynamic"

const DocumentsPage = dynamic(() => import("@/components/dashboard/transporter/DocumentsPage").then(mod => mod.DocumentsPage), {
  ssr: false,
  loading: () => <div>Chargement Documents...</div>
})

export default function DocsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <DocumentsPage />
    </div>
  )
}
