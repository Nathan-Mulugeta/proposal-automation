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

// The main function
async function main() {
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

          // Check if there are duplicate comments with the same body
          const duplicateComments = comments.filter(
            (comment) => comment.body === COMMENT_BODY
          );

          if (duplicateComments.length > 1) {
            // Delete all duplicate comments except one
            for (let i = 1; i < duplicateComments.length; i++) {
              const deleteUrl = `${baseUrl}/repos/${REPO_OWNER}/${REPO_NAME}/issues/comments/${duplicateComments[i].id}`;
              await axios.delete(deleteUrl, { headers });
              console.log("Deleted duplicate comment.");
            }
          }

          // Post the comment if it doesn't exist
          if (duplicateComments.length === 0) {
            await axios.post(commentsUrl, { body: COMMENT_BODY }, { headers });
            console.log("Comment posted successfully.");
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

setInterval(() => {
  main();
}, 1000);
