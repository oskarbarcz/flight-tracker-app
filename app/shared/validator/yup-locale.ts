import { setLocale } from "yup";

function humanize(path: string): string {
  const segment = path.split(".").pop() ?? path;
  const cleaned = segment.replace(/\[\d+\]/g, "").trim();
  if (!cleaned) return "This field";
  const spaced = cleaned.replace(/([A-Z])/g, " $1").trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
}

setLocale({
  mixed: {
    default: ({ path }) => `${humanize(path)} is invalid`,
    required: ({ path }) => `${humanize(path)} is required`,
    defined: ({ path }) => `${humanize(path)} is required`,
    notNull: ({ path }) => `${humanize(path)} is required`,
    notType: ({ path, type }) => {
      const expected = type === "number" ? "number" : type === "date" ? "valid date" : "valid value";
      return `${humanize(path)} must be a ${expected}`;
    },
    oneOf: ({ path }) => `${humanize(path)} is not a valid option`,
    notOneOf: ({ path }) => `${humanize(path)} is not allowed`,
  },
  string: {
    length: ({ path, length }) => `${humanize(path)} must be exactly ${length} characters`,
    min: ({ path, min }) => `${humanize(path)} must be at least ${min} characters`,
    max: ({ path, max }) => `${humanize(path)} must be at most ${max} characters`,
    matches: ({ path }) => `${humanize(path)} has an invalid format`,
    email: () => "Please enter a valid email address",
    url: () => "Please enter a valid URL",
    uuid: ({ path }) => `${humanize(path)} is invalid`,
  },
  number: {
    min: ({ path, min }) => `${humanize(path)} must be at least ${min}`,
    max: ({ path, max }) => `${humanize(path)} must be at most ${max}`,
    lessThan: ({ path, less }) => `${humanize(path)} must be less than ${less}`,
    moreThan: ({ path, more }) => `${humanize(path)} must be greater than ${more}`,
    positive: ({ path }) => `${humanize(path)} must be a positive number`,
    negative: ({ path }) => `${humanize(path)} must be a negative number`,
    integer: ({ path }) => `${humanize(path)} must be a whole number`,
  },
  date: {
    min: ({ path }) => `${humanize(path)} is too early`,
    max: ({ path }) => `${humanize(path)} is too late`,
  },
  array: {
    min: ({ path, min }) => `${humanize(path)} must have at least ${min} item${min === 1 ? "" : "s"}`,
    max: ({ path, max }) => `${humanize(path)} must have at most ${max} item${max === 1 ? "" : "s"}`,
    length: ({ path, length }) => `${humanize(path)} must have exactly ${length} item${length === 1 ? "" : "s"}`,
  },
});
