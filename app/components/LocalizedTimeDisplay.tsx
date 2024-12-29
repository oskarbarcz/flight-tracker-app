import { useEffect, useState } from "react";

type LocalizedTimeDisplayProps = {
  timezone: string;
};

function currentTimeInRegion(timezone: string) {
  const now = new Date();

  try {
    return now.toLocaleString("en-US", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } catch {
    console.warn(
      `Invalid timezone: "${timezone}". Falling back to local time.`,
    );
    return now.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }
}

export default function LocalizedTimeDisplay({
  timezone,
}: LocalizedTimeDisplayProps) {
  const [timeString, setTimeString] = useState("");

  useEffect(() => {
    // A function to update the time string
    function updateTime() {
      setTimeString(currentTimeInRegion(timezone));
    }

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [timezone]);

  return <span>{timeString}</span>;
}
