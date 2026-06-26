export type Market = "IN" | "UK";

export type Job = {
  id: string;
  m: "in" | "uk" | "both";
  title: string;
  co: string;
  logo: string;
  dark: boolean;
  loc: string;
  mode: string;
  age: string;
  salary: string | null;
  est: { in?: string; uk?: string } | null;
  match: number;
  chips: string[];
  more: number;
  src: string;
  sponsors: boolean;
  about: string;
  reqs: string[];
};

export type TrackStatus =
  | "Applied"
  | "Interviewing"
  | "Assessment"
  | "Offer"
  | "Ghosted"
  | "Rejected";

export type TrackRow = {
  id: string;
  co: string;
  logo: string;
  dark: boolean;
  role: string;
  status: TrackStatus;
  date: string;
};

export type MsgTag = "Interview" | "Verification" | "Assessment" | "Offer" | "Reminder" | "Rejection";

export type Msg = {
  id: string;
  tag: MsgTag;
  from: string;
  addr: string;
  subj: string;
  date: string;
  body: string[];
};
