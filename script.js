const axios = require("axios");
const dotenv = require("dotenv");
const {
  COMMENT_BODY,
  REPO_NAME,
  REPO_OWNER,
  SLACK_URL,
} = require("./consts-to-change.js");

dotenv.config(); // Load environment variables from .env

const baseUrl = "https://api.github.com";

const accessToken = process.env.AUTOMATION_PAT;

console.log(
  "We are currently working on this repo: ",
  REPO_OWNER,
  "/",
  REPO_NAME
);

let mainIsRunning = false;

// The  main funtion
async function main() {
  if (mainIsRunning) {
    console.log("Previous process is not done yet, skipping this call.");
    return;
  }

  mainIsRunning = true;

  try {
    console.log("Running main");

    // Fetch issues
    const issuesUrl = `${baseUrl}/repos/${REPO_OWNER}/${REPO_NAME}/issues`;
    const headers = {
      Authorization: `token ${accessToken}`,
    };

    const response = await axios.get(issuesUrl, { headers });

    if (response.status === 200) {
      const issues = response.data;

      // Check if an issue contains the Slack URL
      for (const issue of issues) {
        if (issue.body.includes(SLACK_URL)) {
          // Check if you already posted a comment on this issue
          const commentsUrl = `${baseUrl}/repos/${REPO_OWNER}/${REPO_NAME}/issues/${issue.number}/comments`;
          const commentsResponse = await axios.get(commentsUrl, { headers });
          const comments = commentsResponse.data;

          const alreadyCommented = comments.some(
            (comment) => comment.body === COMMENT_BODY
          );

          if (alreadyCommented) {
            console.log("Comment already posted. Stopping further comments.");
            clearInterval(intervalId);
            process.exit(0);
          }

          // Post the comment
          await axios.post(commentsUrl, { body: COMMENT_BODY }, { headers });
          console.log("Comment posted successfully.");
          clearInterval(intervalId);

          process.exit(0);
        }
      }
    } else {
      console.log(`Failed to fetch issues. Status code: ${response.status}`);
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mainIsRunning = false;
  }
}

// Schedule the script to run every 2 seconds.
const intervalId = setInterval(main, 2000);
