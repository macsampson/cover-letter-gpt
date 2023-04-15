import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";

type Props = {
  apiResponse: string;
};

function CoverLetter({ apiResponse }: Props) {
  // state object for cover letter
  let [coverLetter, setCoverLetter] = useState("");

  // use effect for updating cover letter
  useEffect(() => {
    setCoverLetter(apiResponse);
  }, [apiResponse]);

  return (
    <TextField
      sx={{ ".MuiInputBase-root": { borderRadius: "10px" } }}
      id="cover-letter-result"
      placeholder="Waiting for cover letter generation..."
      value={coverLetter}
      // onChange={(e) => setApiResponse(e.target.value)}
      multiline
      // style={{ width: '100%' }}
    ></TextField>
  );
}

export default CoverLetter;
