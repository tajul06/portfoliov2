import React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "exode-mascot": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        mascot?: string;
        src?: string;
        base?: string;
        colors?: string;
        mood?: string | number;
        follow?: string | boolean;
        moments?: string;
      };
    }
  }
}

