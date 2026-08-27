import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "~/app-state/useAuth";
import { collected, neverSeen } from "~/features/postcard/lib/collection";
import type { CollectedPostcard, MyPostcardCollection } from "~/features/postcard/model";
import { UserRole } from "~/features/user";
import { useApi } from "~/shared/api/useApi";

type PostcardsState = {
  collection: CollectedPostcard[] | null;
  total: number;
  waiting: CollectedPostcard[];
  acknowledge: (id: string) => void;
  reload: () => void;
};

const EMPTY: PostcardsState = {
  collection: [],
  total: 0,
  waiting: [],
  acknowledge: () => {},
  reload: () => {},
};

const PostcardsContext = createContext<PostcardsState>(EMPTY);

function withSeenAt(answer: MyPostcardCollection, id: string, seenAt: string | null): MyPostcardCollection {
  return {
    ...answer,
    postcards: answer.postcards.map((postcard) => (postcard.id === id ? { ...postcard, seenAt } : postcard)),
  };
}

function keepingSeen(answer: MyPostcardCollection, seen: Map<string, string>): MyPostcardCollection {
  if (seen.size === 0) {
    return answer;
  }

  return {
    ...answer,
    postcards: answer.postcards.map((postcard) => {
      const seenAt = seen.get(postcard.id);

      return seenAt !== undefined && postcard.seenAt === null ? { ...postcard, seenAt } : postcard;
    }),
  };
}

export function PostcardsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { myPostcardService } = useApi();
  const [answer, setAnswer] = useState<MyPostcardCollection | null>(null);
  const acknowledged = useRef(new Map<string, string>());
  const latestRequest = useRef(0);

  const enabled = user?.role === UserRole.CabinCrew;

  const reload = useCallback(() => {
    if (!enabled) {
      return;
    }

    latestRequest.current += 1;
    const request = latestRequest.current;

    myPostcardService
      .fetchMine()
      .then((next) => {
        if (request === latestRequest.current) {
          setAnswer(keepingSeen(next, acknowledged.current));
        }
      })
      .catch((error) => console.error("Failed to load postcards", error));
  }, [enabled, myPostcardService]);

  useEffect(reload, [reload]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    window.addEventListener("focus", reload);

    return () => window.removeEventListener("focus", reload);
  }, [enabled, reload]);

  const acknowledge = useCallback(
    (id: string) => {
      const seenNow = new Date().toISOString();

      setAnswer((current) => (current === null ? current : withSeenAt(current, id, seenNow)));

      myPostcardService
        .markSeen(id)
        .then(() => {
          acknowledged.current.set(id, seenNow);
          setAnswer((current) => (current === null ? current : withSeenAt(current, id, seenNow)));
        })
        .catch(() => {
          if (acknowledged.current.has(id)) {
            return;
          }

          setAnswer((current) => (current === null ? current : withSeenAt(current, id, null)));
        });
    },
    [myPostcardService],
  );

  const state = useMemo<PostcardsState>(() => {
    if (!enabled) {
      return EMPTY;
    }

    if (answer === null) {
      return { collection: null, total: 0, waiting: [], acknowledge, reload };
    }

    const collection = collected(answer.postcards);

    return { collection, total: answer.total, waiting: neverSeen(collection), acknowledge, reload };
  }, [enabled, answer, acknowledge, reload]);

  return <PostcardsContext.Provider value={state}>{children}</PostcardsContext.Provider>;
}

export function usePostcards(): PostcardsState {
  return useContext(PostcardsContext);
}
