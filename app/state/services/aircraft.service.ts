import { Aircraft, CreateAircraftDto, EditAircraftDto } from "~/models";
import { buildApiUrl } from "~/functions/getApiBaseUrl";

export const AircraftService = {
  getToken: (): string => {
    const token: string | null = localStorage.getItem("token");

    if (token === null) {
      throw new Error("Unauthorized");
    }

    return <string>token;
  },

  getAll: async (): Promise<Aircraft[]> => {
    const response = await fetch(buildApiUrl("api/v1/aircraft"), {
      headers: {
        Authorization: `Bearer ${AircraftService.getToken()}`,
      },
    });

    if (response.status === 401) {
      AircraftService.handleUnauthorized();
    }

    return response.json();
  },

  getById: async (id: string): Promise<Aircraft> => {
    const response = await fetch(buildApiUrl(`api/v1/aircraft/${id}`), {
      headers: {
        Authorization: `Bearer ${AircraftService.getToken()}`,
      },
    });

    if (response.status === 401) {
      AircraftService.handleUnauthorized();
    }

    return response.json();
  },

  createNew: async (airport: CreateAircraftDto): Promise<Aircraft> => {
    const response = await fetch(buildApiUrl("api/v1/aircraft"), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AircraftService.getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(airport),
    });

    if (response.status === 401) {
      AircraftService.handleUnauthorized();
    }

    return response.json();
  },

  update: async (id: string, data: EditAircraftDto): Promise<Aircraft> => {
    const response = await fetch(buildApiUrl(`api/v1/aircraft/${id}`), {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${AircraftService.getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.status === 401) {
      AircraftService.handleUnauthorized();
    }

    return response.json();
  },

  handleUnauthorized: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};
