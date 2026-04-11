import { getAllEvaluations } from "@/app/actions/evaluation"
import AdminEvaluationsDashboard from "@/components/admin/evaluations/AdminEvaluationsDashboard"
import { redirect } from "next/navigation"
import AdminErrorState from "@/components/AdminErrorState"

export default async function AdminEvaluationsPage() {
  const { evaluations, error } = await getAllEvaluations()

  if (error) {
    if (error.includes("Unauthorized")) {
      redirect("/login")
    }
    return <AdminErrorState title="Error Loading Evaluations" message="Unable to load evaluations." error={error} />
  }

  return <AdminEvaluationsDashboard initialEvaluations={evaluations || []} />
}
