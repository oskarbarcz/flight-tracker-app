import type { Route } from ".react-router/types/app/routes/operations/operators/+types/EditOperatorRoute";
import { redirect } from "react-router";
import { operatorEditPath } from "~/features/operator/navigation";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  return redirect(operatorEditPath(`/operators/${params.operatorId}/fleet`));
}

export default function EditOperatorRoute() {
  return null;
}
