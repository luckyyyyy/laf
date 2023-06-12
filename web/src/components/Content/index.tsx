import React from "react";

export default function Content(props: { children: React.ReactNode }) {
  return <div className="flex flex-1 flex-col space-y-1 overflow-hidden">{props.children}</div>;
}
