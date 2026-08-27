import type {
  DrawMissingResult,
  MyPostcardCollection,
  PostcardCatalogue,
  RedrawOutcome,
} from "~/features/postcard/model";
import { AbstractAuthorizedApiService, type ErrorResponse } from "~/shared/api/api.service";

const ALREADY_DRAWING = 409;

function isAlreadyDrawing(reason: unknown): boolean {
  return (
    typeof reason === "object" && reason !== null && (reason as ErrorResponse<unknown>).statusCode === ALREADY_DRAWING
  );
}

export class PostcardService extends AbstractAuthorizedApiService {
  async fetchCatalogue(): Promise<PostcardCatalogue> {
    return this.fetchWithAuth<PostcardCatalogue>("/api/v1/postcard");
  }

  async drawMissing(): Promise<DrawMissingResult> {
    return this.fetchWithAuth<DrawMissingResult>("/api/v1/postcard/draw-missing", { method: "POST" });
  }

  async redraw(id: string): Promise<RedrawOutcome> {
    try {
      await this.fetchWithAuth<void>(`/api/v1/postcard/${id}/redraw`, { method: "POST" });

      return "replaced";
    } catch (reason) {
      if (isAlreadyDrawing(reason)) {
        return "already-drawing";
      }

      throw reason;
    }
  }
}

export class MyPostcardService extends AbstractAuthorizedApiService {
  async fetchMine(): Promise<MyPostcardCollection> {
    return this.fetchWithAuth<MyPostcardCollection>("/api/v1/user/me/postcard");
  }

  async markSeen(id: string): Promise<void> {
    await this.fetchWithAuth<void>(`/api/v1/user/me/postcard/${id}/seen`, { method: "POST" });
  }
}
