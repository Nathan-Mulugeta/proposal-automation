// Constants to change.
const testing = true;

const REPO_OWNER = testing ? "Nathan-Mulugeta" : "Expensify";

const REPO_NAME = REPO_OWNER === "Expensify" ? "App" : "feedback-app";

const SLACK_URL =
  "https://expensify.slack.com/archives/C049HHMV9SM/p169700547429067";

// Comment body
const COMMENT_BODY = `
## Proposal

### Please re-state the problem that we are trying to solve in this issue.
This is changed now

### What is the root cause of that problem?
The root cause of this problem is here on these two lines:
https://github.com/Expensify/App/blob/07b99243ad9a2fe09e857038c80e1c5d6a426d6d/src/components/MoneyRequestConfirmationList.js#L554

and 
https://github.com/Expensify/App/blob/07b99243ad9a2fe09e857038c80e1c5d6a426d6d/src/components/MoneyRequestConfirmationList.js#L576

We are checking if it is a request type before rendering the right arrow. 

### What changes do you think we should make in order to solve the problem?
We can remove the check for the request type by changing this line of code: 
\`\`\`javascript
shouldShowRightIcon={!props.isReadOnly && isTypeRequest} 
\`\`\`

To:
\`\`\`javascript
shouldShowRightIcon={!props.isReadOnly} 
\`\`\`

### What alternative solutions did you explore? (Optional)
NA
`;

module.exports = { COMMENT_BODY, REPO_NAME, REPO_OWNER, SLACK_URL };
