import axios from "axios";
import dotenv from "dotenv";
import {
  COMMENT_BODY,
  REPO_NAME,
  REPO_OWNER,
  SLACK_URL,
} from "./consts-to-change.js";

dotenv.config(); // Load environment variables from .env

const baseUrl = "https://api.github.com";

const accessToken = process.env.AUTOMATION_PAT;

console.log(process.env.AUTOMATION_PAT);

let commentPosted = false;

console.log(REPO_OWNER, "/", REPO_NAME);

async function main() {
  try {
    console.log("running main");
    if (commentPosted) {
      console.log("Comment already posted. Stopping further comments.");
      process.exit(0);
      return;
    }

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
            process.exit(0);
          } else {
            // Post the comment
            await axios.post(commentsUrl, { body: COMMENT_BODY }, { headers });
            console.log("Comment posted successfully.");
            commentPosted = true;
            process.exit(0);
          }
          return;
        }
      }
    } else {
      console.log(`Failed to fetch issues. Status code: ${response.status}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Schedule the script to run every second
const intervalId = setInterval(main, 2000);
if (commentPosted) clearInterval(intervalId);
