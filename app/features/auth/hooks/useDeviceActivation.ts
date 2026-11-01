import { useCallback, useEffect, useRef, useState } from "react";
import { describeDeviceSignInFailure } from "~/features/auth/lib/describeDeviceSignInFailure";
import type { DeviceSignIn } from "~/features/auth/model";
import { useApi } from "~/shared/api/useApi";

export type DeviceDecision = "approve" | "decline";

export type DeviceActivationState =
  | { status: "entering" }
  | { status: "checking"; userCode: string }
  | { status: "unavailable"; userCode: string; message: string }
  | { status: "gone"; userCode: string }
  | { status: "awaiting"; request: DeviceSignIn; deciding: DeviceDecision | null; failure: string | null }
  | { status: "approved"; request: DeviceSignIn }
  | { status: "declined"; request: DeviceSignIn };

export type DeviceActivationControl = {
  state: DeviceActivationState;
  retry: () => void;
  decide: (decision: DeviceDecision) => void;
};

function initialState(userCode: string | null): DeviceActivationState {
  return userCode === null ? { status: "entering" } : { status: "checking", userCode };
}

export function useDeviceActivation(userCode: string | null): DeviceActivationControl {
  const { authService } = useApi();
  const [state, setState] = useState<DeviceActivationState>(() => initialState(userCode));
  const lookupRef = useRef<number>(0);

  const lookUp = useCallback(() => {
    const lookup = ++lookupRef.current;
    setState(initialState(userCode));

    if (userCode === null) {
      return;
    }

    authService
      .fetchDeviceSignIn(userCode)
      .then((request) => {
        if (lookup === lookupRef.current) {
          setState({ status: "awaiting", request, deciding: null, failure: null });
        }
      })
      .catch((reason) => {
        if (lookup !== lookupRef.current) {
          return;
        }

        const failure = describeDeviceSignInFailure(reason, "lookup");
        setState(
          failure.kind === "gone"
            ? { status: "gone", userCode }
            : { status: "unavailable", userCode, message: failure.message },
        );
      });
  }, [authService, userCode]);

  useEffect(() => {
    lookUp();
  }, [lookUp]);

  function decide(decision: DeviceDecision) {
    if (state.status !== "awaiting" || state.deciding !== null) {
      return;
    }

    const { request } = state;
    const lookup = lookupRef.current;
    setState({ status: "awaiting", request, deciding: decision, failure: null });

    const sent =
      decision === "approve"
        ? authService.approveDeviceSignIn(request.userCode)
        : authService.denyDeviceSignIn(request.userCode);

    sent
      .then(() => {
        if (lookup === lookupRef.current) {
          setState(decision === "approve" ? { status: "approved", request } : { status: "declined", request });
        }
      })
      .catch((reason) => {
        if (lookup !== lookupRef.current) {
          return;
        }

        const failure = describeDeviceSignInFailure(reason, decision);
        setState(
          failure.kind === "gone"
            ? { status: "gone", userCode: request.userCode }
            : { status: "awaiting", request, deciding: null, failure: failure.message },
        );
      });
  }

  return { state, retry: lookUp, decide };
}
