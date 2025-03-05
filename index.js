const { Client, Intents } = require("discord.js-selfbot-v13");
const fs = require("fs");
const colors = require("colors");

const validTokens = [];
const invalidTokens = [];

let totalScanned = 0;
let emailConnected = 0;
let phoneConnected = 0;
let bothConnected = 0;
let twoFAEnabled = 0;

async function checkToken(token) {
    const client = new Client({
        intents: [Intents.FLAGS.GUILDS],
        checkUpdate: false,
    });

    try {
        await client.login(token);
    } catch (error) {
        console.log(`Token: ${token.slice(0, 20)}... is invalid!`.red);
        invalidTokens.push(token);
        totalScanned++;
        return;
    }

    const user = client.user;
    if (user) {
        console.log(`\nToken: ${token.slice(0, 20)}... is valid!`.green);
        console.log(`Username: ${user.tag}`.cyan);
        console.log(`User ID: ${user.id}`.cyan);
        console.log(`Email Verified: ${user.verified ? "Yes" : "No"}`.cyan);
        console.log(`2FA Enabled: ${user.mfaEnabled ? "Yes" : "No"}`.cyan);
        console.log(`Phone Verified: ${user.phone ? "Yes" : "No"}`.cyan);
        console.log(`Join Date: ${user.createdAt.toISOString()}`.cyan); 

        if (user.verified) emailConnected++;
        if (user.phone) phoneConnected++;
        if (user.verified && user.phone) bothConnected++;
        if (user.mfaEnabled) twoFAEnabled++;

        const ownedGuilds = client.guilds.cache.filter((guild) => guild.ownerId === user.id);
        if (ownedGuilds.size > 0) {
            console.log(`Owned Servers: ${ownedGuilds.size}`.yellow);
            ownedGuilds.forEach((guild) => {
                console.log(` - ${guild.name} (ID: ${guild.id})`.yellow);
            });
        } else {
            console.log("Owned Servers: None".yellow);
        }

        validTokens.push({
            token: token,
            username: user.tag,
            userId: user.id,
            emailVerified: user.verified,
            twoFAEnabled: user.mfaEnabled,
            phoneVerified: user.phone,
            joinDate: user.createdAt.toISOString(),
            ownedGuilds: ownedGuilds.map(guild => ({ name: guild.name, id: guild.id }))
        });
    } else {
        console.log("Failed to fetch user information.".red);
    }

    totalScanned++;

    client.destroy();
}

function writeTokensToFiles() {
    fs.writeFileSync("valid_tokens.txt", validTokens.map(t => t.token).join("\n"), "utf-8");

    const detailedTokens = validTokens.map(t => {
        const details = [
            `Token: ${t.token}`,
            `Username: ${t.username}`,
            `User ID: ${t.userId}`,
            `Email Verified: ${t.emailVerified ? "Yes" : "No"}`,
            `2FA Enabled: ${t.twoFAEnabled ? "Yes" : "No"}`,
            `Phone Verified: ${t.phoneVerified ? "Yes" : "No"}`,
            `Join Date: ${t.joinDate}`,
            `Owned Servers: ${t.ownedGuilds.length > 0 ? t.ownedGuilds.map(g => `${g.name} (ID: ${g.id})`).join(", ") : "None"}`
        ];

        return details.join(" | ");
    });

    fs.writeFileSync("detailed_valid_tokens.txt", detailedTokens.join("\n"), "utf-8");

    fs.writeFileSync("invalid_tokens.txt", invalidTokens.join("\n"), "utf-8");

    console.log("\nValid tokens have been saved to valid_tokens.txt".green);
    console.log("Detailed valid tokens have been saved to detailed_valid_tokens.txt".green);
    console.log("Invalid tokens have been saved to invalid_tokens.txt".red);
}

function printMetrics() {
    console.log("\n=== Metrics ===".bold);
    console.log(`Total Tokens Scanned: ${totalScanned}`.cyan);
    console.log(`Tokens with Email Connected: ${emailConnected}`.cyan);
    console.log(`Tokens with Phone Connected: ${phoneConnected}`.cyan);
    console.log(`Tokens with Both Email and Phone Connected: ${bothConnected}`.cyan);
    console.log(`Tokens with 2FA Enabled: ${twoFAEnabled}`.cyan);
}

async function main() {
    try {
        const tokens = fs.readFileSync("tokens.txt", "utf-8").split("\n").filter((token) => token.trim());
        if (tokens.length === 0) {
            console.log("No tokens found in tokens.txt".red);
            return;
        }

        for (const token of tokens) {
            await checkToken(token.trim());
            await new Promise(resolve => setTimeout(resolve, 1)); // delay to avoid rate limit ig 💩
        }

        writeTokensToFiles();

        printMetrics();
    } catch (error) {
        console.log("Error: tokens.txt file not found".red);
    }
}

main();