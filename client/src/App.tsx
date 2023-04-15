import React, { useState, useRef, useEffect } from "react";
import PrivacyPolicy from "./components/PrivacyPolicy";
import ResumeUpload from "./components/ResumeUpload";
import JobDescription from "./components/JobDescription";
import CoverLetter from "./components/CoverLetter";
import InputAlert from "./components/InputAlert";
import "./App.css";
import Button from "@mui/material/Button";
import Grid2 from "@mui/material/Unstable_Grid2"; // Grid version 2
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fontSize } from "@mui/system";
import LoadingButton from "@mui/lab/LoadingButton";
import DescriptionIcon from "@mui/icons-material/Description";
import TwitterIcon from "@mui/icons-material/Twitter";
import "typeface-roboto";

const theme = createTheme({
  typography: {
    fontFamily: "Roboto",
  },
});

interface Props {}

const App: React.FC<Props> = () => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState<string | "">("");
  let [apiResponse, setApiResponse] = useState("");
  let [loading, SetLoading] = useState(false);
  let [alert, SetAlert] = useState(false);

  const resultRef = useRef("");

  // function to set file to the file being passed back from resumeupload
  const handleFileUpload = (resume: File | null) => {
    setFile(resume);
  };

  // function to handle jd input and set text to it
  const handleJDInput = (jd: string | "") => {
    setText(jd);
  };

  useEffect(() => {
    resultRef.current = apiResponse;
  }, [apiResponse]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    SetLoading(true);
    setApiResponse("");
    const formData = new FormData();
    if (!file || !text) {
      SetAlert(true);
      SetLoading(false);
      return;
    }
    // const source = new EventSource('/api/upload')
    formData.append("file", file as Blob);
    formData.append("text", text);

    const start = Date.now();
    try {
      const response = await fetch("https://cover-letter-gpt.onrender.com", {
        method: "POST",
        body: formData,
      });

      SetLoading(false);
      const respTime = Date.now() - start;
      console.log(respTime / 1000);
      // if (!reader) return
      const reader = response.body?.getReader();

      if (reader) {
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          const text = decoder.decode(value);
          if (done) {
            // The stream has been fully read
            reader.cancel();
            break;
          }

          let dataDone = false;
          const arr = text.toString().split("\n");
          arr.forEach((data: any) => {
            if (data.length === 0) return; // ignore empty message
            if (data.startsWith(":")) return; // ignore sse comment message
            if (data === "data: [DONE]") {
              dataDone = true;
              return;
            }
            const message = data.replace(/^data: /, "");
            const json = JSON.parse(message);
            // console.log(json)
            if (json.choices[0].delta.content) {
              resultRef.current =
                resultRef.current + json.choices[0].delta.content.toString();
              setApiResponse(resultRef.current);
            }
          });
          if (dataDone) break;

          if (done) {
            // The stream has been fully read
            break;
          }
        }
      }

      console.log("stream complete");
    } catch (error) {
      // console.log()
      console.error(error);
    }
  };

  return (
    <main>
      <ThemeProvider theme={theme}>
        <Grid2
          container
          spacing={2}
          justifyContent="center"
          padding={0}
          fontFamily="Roboto"
          id="title"
          lg={12}
          alignItems="center"
        >
          <h1
            style={{
              marginRight: "15px",
            }}
          >
            Cover Letter GPT
          </h1>
          <img src="/favicon.png" alt="logo" />
        </Grid2>

        <Grid2
          className="mainGrid"
          container
          spacing={2}
          padding={2}
          // justifyContent="center"
          // display="flex"
        >
          <Grid2
            spacing={2}
            justifyContent="center"
            textAlign="center"
            fontFamily="Roboto"
            lg={12}
            padding={2}
          >
            <p>
              Create a professional cover letter in seconds with this
              GPT-powered web app. Simply attach your resume, enter a job
              description, and let it create a cover letter for you.
            </p>
            <br></br>
            <p
              style={{
                textAlign: "center",
              }}
            >
              Try it now and land your dream job!
            </p>
          </Grid2>
          <Grid2 lg={6} sm={12} xs={12}>
            <form onSubmit={handleSubmit}>
              <Grid2>
                <ResumeUpload onFileUpload={handleFileUpload} />
              </Grid2>

              <Grid2>
                <JobDescription onJDInput={handleJDInput} />
              </Grid2>
              <Grid2
                style={{ textAlign: "center" }}
                display="flex"
                justifyContent="center"
                direction="column"
                alignItems="flex-end"
              >
                <LoadingButton
                  type="submit"
                  size="medium"
                  endIcon={<DescriptionIcon />}
                  loading={loading}
                  loadingPosition="end"
                  variant="contained"
                >
                  <span>Generate Cover Letter</span>
                </LoadingButton>
              </Grid2>
            </form>
          </Grid2>
          <Grid2 lg={6} sm={12} xs={12}>
            <Grid2>
              <CoverLetter apiResponse={apiResponse} />
            </Grid2>
          </Grid2>
        </Grid2>
        <InputAlert open={alert} />

        <Grid2
          style={{ textAlign: "center" }}
          display="flex"
          justifyContent="center"
          direction="column"
          alignItems="flex-end"
          paddingRight={3}
          paddingTop={9}
        >
          <Button
            target="_blank"
            href="https://twitter.com/_macsampson_"
            size="small"
            variant="outlined"
            endIcon={<TwitterIcon />}
          >
            Follow me on Twitter
          </Button>
        </Grid2>
        <Grid2
          style={{ textAlign: "center" }}
          display="flex"
          justifyContent="center"
          direction="column"
          alignItems="flex-end"
          paddingRight={3}
          paddingTop={2}
        >
          <PrivacyPolicy />
        </Grid2>
      </ThemeProvider>
    </main>
  );
};

export default App;
