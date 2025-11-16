import * as React from "react"
import { SVGProps } from "react"

export const SewingMachineIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 6c-2.5 0-4.2-2.3-5.5-3.5S13.5 1 11 1H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h2" />
    <path d="M14 13h6" />
    <path d="M4 8h2" />
    <path d="M4 12h2" />
    <path d="M14 13v2a2 2 0 0 1-2 2h-1" />
    <path d="M19 13v2a2 2 0 0 0 2 2h1" />
    <circle cx="16.5" cy="8.5" r="2.5" />
    <path d="M12 19h10" />
    <path d="M4 19h2" />
  </svg>
)
