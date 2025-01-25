import { CreateOperatorDto, EditOperatorDto, Operator } from "~/models";
import { buildApiUrl } from "~/functions/getApiBaseUrl";

export const OperatorService = {
  getToken: (): string => {
    const token: string | null = localStorage.getItem("token");

    if (token === null) {
      throw new Error("Unauthorized");
    }

    return <string>token;
  },

  fetchAll: async (): Promise<Operator[]> => {
    const token = OperatorService.getToken();
    const response = await fetch(buildApiUrl("api/v1/operator"), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      throw new Error("Unauthorized");
    }

    return response.json();
  },

  fetchById: async (id: string): Promise<Operator> => {
    const response = await fetch(buildApiUrl(`api/v1/operator/${id}`), {
      headers: {
        Authorization: `Bearer ${OperatorService.getToken()}`,
      },
    });

    if (response.status === 401) {
      throw new Error("Unauthorized");
    }

    return response.json();
  },

  createNew: async (operator: CreateOperatorDto): Promise<Operator> => {
    const response = await fetch(buildApiUrl("api/v1/operator"), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OperatorService.getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(operator),
    });

    if (response.status === 401) {
      throw new Error("Unauthorized");
    }

    return response.json();
  },

  update: async (id: string, data: EditOperatorDto): Promise<Operator> => {
    const response = await fetch(buildApiUrl(`api/v1/operator/${id}`), {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${OperatorService.getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.status === 401) {
      throw new Error("Unauthorized");
    }

    return response.json();
  },
};
