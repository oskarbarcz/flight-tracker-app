import type { BreadcrumbItem } from "./Breadcrumbs";

export type TopNavRouteHandle = {
  breadcrumbs: (data: unknown) => BreadcrumbItem[];
};
