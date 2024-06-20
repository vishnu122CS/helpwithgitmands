const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Function to handle different GitHub queries
async function handleGitHubQuery(query) {
    if (query.includes('repos of')) {
        const username = query.split('repos of ')[1].trim();
        try {
            const response = await axios.get(`https://api.github.com/users/${username}/repos`);
            const repoNames = response.data.map(repo => repo.name).join(', ');
            return `Repositories of ${username} are: ${repoNames}`;
        } catch (error) {
            return `Error fetching repositories for ${username}`;
        }
    } else if (query.includes('followers of')) {
        const username = query.split('followers of ')[1].trim();
        try {
            const response = await axios.get(`https://api.github.com/users/${username}/followers`);
            const followerNames = response.data.map(follower => follower.login).join(', ');
            return `Followers of ${username} are: ${followerNames}`;
        } catch (error) {
            return `Error fetching followers for ${username}`;
        }
    } else if (query.includes('details of')) {
        const username = query.split('details of ')[1].trim();
        try {
            const response = await axios.get(`https://api.github.com/users/${username}`);
            const userDetails = response.data;
            return `Details of ${username}: Name - ${userDetails.name}, Bio - ${userDetails.bio}, Public Repos - ${userDetails.public_repos}, Followers - ${userDetails.followers}`;
        } catch (error) {
            return `Error fetching details for ${username}`;
        }
    } else if (query.includes('repo details of')) {
        const [username, repo] = query.split('repo details of ')[1].trim().split('/');
        try {
            const response = await axios.get(`https://api.github.com/repos/${username}/${repo}`);
            const repoDetails = response.data;
            return `Details of ${username}/${repo}: Name - ${repoDetails.name}, Description - ${repoDetails.description}, Stars - ${repoDetails.stargazers_count}, Forks - ${repoDetails.forks_count}`;
        } catch (error) {
            return `Error fetching repository details for ${username}/${repo}`;
        }
    } else if (query.includes('how to push')) {
        return `To push changes to a GitHub repository, follow these steps:
        1. Stage your changes: \`git add .\`
        2. Commit your changes: \`git commit -m "Your commit message"\`
        3. Push your changes: \`git push origin main\`
        Make sure you replace 'main' with your branch name if it's different.`;
    } else if (query.includes('how to pull')) {
        return `To pull changes from a GitHub repository, follow these steps:
        1. Fetch and merge changes: \`git pull origin main\`
        This command fetches changes from the remote repository and merges them into your current branch.`;
    } else if (query.includes('how to fork')) {
        return `To fork a repository on GitHub, follow these steps:
        1. Navigate to the repository you want to fork.
        2. Click the 'Fork' button at the top-right corner of the page.
        3. Choose your GitHub account where the fork will be created.
        4. Clone your forked repository: \`git clone https://github.com/your-username/forked-repo.git\``;
    } else {
        return 'I can help you with GitHub information and operations. Try asking about "repos of [username]", "followers of [username]", "details of [username]", "repo details of [username]/[repository]", "how to push", "how to pull", or "how to fork".';
    }
}

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    const botResponse = await handleGitHubQuery(userMessage);
    res.json({ message: botResponse });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
