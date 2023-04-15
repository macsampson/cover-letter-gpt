import React, { useState, useEffect } from "react";
import { TextField, CircularProgress } from "@mui/material";

type Props = {
  onJDInput: (jd: string | "") => void;
};

function JobDescription({ onJDInput }: Props) {
  const [text, setText] = useState("");

  // use effect for passing text to parent component
  useEffect(() => {
    onJDInput(text);
  }, [text]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <div id="job-description">
      <TextField
        sx={{ ".MuiInputBase-root": { borderRadius: "10px" } }}
        id="text-input"
        placeholder="Please paste a job description..."
        value={text}
        onChange={handleInputChange}
        // className={styles.textBox}
        multiline
        maxRows={5}
        minRows={5}
        // style={{ width: '100%' }}
      />
    </div>
  );
}

export default JobDescription;
