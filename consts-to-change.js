// Constants to change.
const testing = false;

const REPO_OWNER = testing ? "Nathan-Mulugeta" : "Expensify";

const REPO_NAME = REPO_OWNER === "Expensify" ? "App" : "feedback-app";

const SLACK_URL = process.argv[2];

// Comment body
const COMMENT_BODY = process.argv[3];

module.exports = { COMMENT_BODY, REPO_NAME, REPO_OWNER, SLACK_URL };
