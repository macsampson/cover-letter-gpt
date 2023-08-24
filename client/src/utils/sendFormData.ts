// sendFormData.ts

// create two constants, one for prod and one for dev
const prod = {
  url: {
    API_URL: "https://cover-letter-gpt.onrender.com",
  },
}

const dev = {
  url: {
    API_URL: "http://localhost:5000",
  },
}

let dev_mode = true

// set the API_URL to the correct constant
const API_URL = dev_mode ? dev.url.API_URL : prod.url.API_URL

interface ResponseState {
  loading: boolean
}

export const sendFormData = async (
  formData: FormData,
  setState: any,
  resultRef: React.MutableRefObject<string>
): Promise<ResponseState> => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    })
    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    let responseText = ""

    while (true) {
      const { done, value } = (await reader?.read()) || { done: true }
      if (done) break // Exit if the stream is done
      responseText += decoder.decode(value, { stream: !done })

      try {
        const lines = responseText
          .split("\n")
          .filter((line) => line.trim() && !line.startsWith(":"))
        responseText = "" // Reset responseText to capture incomplete JSON in the next iteration

        lines.forEach((line) => {
          if (line === "data: [DONE]") return
          const message = line.replace(/^data: /, "")

          const json = JSON.parse(message) // Try parsing each complete line/message

          if (json.choices[0]?.delta?.content) {
            const content = json.choices[0].delta.content.toString()
            resultRef.current += content
            setState((prevState: any) => ({
              ...prevState,
              apiResponse: resultRef.current,
            }))
          }
        })
      } catch (error) {
        console.error("Failed to parse JSON", error)
        // Accumulate partial data for the next iteration
        responseText += decoder.decode(value, { stream: true })
      }
    }

    reader?.cancel() // Ensure the stream is canceled after reading
    return { loading: false }
  } catch (error) {
    console.error(error)
    return { loading: false }
  }
}

export default sendFormData
