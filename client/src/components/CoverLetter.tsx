import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";

type Props = {
  apiResponse: string;
  submitted: boolean;
};

function CoverLetter({ apiResponse, submitted }: Props) {
  // state object for cover letter
  let [coverLetter, setCoverLetter] = useState("");
  let [placeholder, setPlaceholder] = useState(
    "Your cover letter will appear here."
  );

  // use effect for updating cover letter
  useEffect(() => {
    setCoverLetter(apiResponse);
  }, [apiResponse]);

  useEffect(() => {
    if (submitted) {
      setPlaceholder("Generating cover letter");
      const interval = setInterval(() => {
        setPlaceholder((prevPlaceholder) => {
          if (prevPlaceholder === "Generating cover letter...") {
            return "Generating cover letter";
          } else {
            return prevPlaceholder + ".";
          }
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [submitted]);

  return (
    <TextField
      sx={{ ".MuiInputBase-root": { borderRadius: "10px" } }}
      id="cover-letter-result"
      placeholder={placeholder}
      value={coverLetter}
      multiline
    ></TextField>
  );
}

export default CoverLetter;
