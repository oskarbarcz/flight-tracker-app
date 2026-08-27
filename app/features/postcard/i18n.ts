import { PostcardStatus } from "~/features/postcard/model";

export function translatePostcardStatus(status: PostcardStatus): string {
  switch (status) {
    case PostcardStatus.Pending:
      return "Being drawn";
    case PostcardStatus.Ready:
      return "Ready";
    case PostcardStatus.Failed:
      return "Failed";
  }
}
