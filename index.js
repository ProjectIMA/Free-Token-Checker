const { Client, Intents } = require("discord.js-selfbot-v13");
const axios = require("axios"); 
const fs = require("fs");
const colors = require("colors");

const validTokens = [];
const invalidTokens = [];

let totalScanned = 0;
let emailConnected = 0;
let phoneConnected = 0;
let bothConnected = 0;
let twoFAEnabled = 0;
let nitroCount = 0;
let boostAvailableCount = 0; 
let canBoostCount = 0; 

async function checkToken(token) {
    const client = new Client({
        intents: [Intents.FLAGS.GUILDS],
        checkUpdate: false,
    });

    try {
        await client.login(token);
    } catch (error) {
        console.log(`Token: ${token.slice(0, 20)}... is invalid!`.red);
        return false;
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

        const nitroTypes = {
            1: "Nitro Classic",
            2: "Nitro",
            3: "Nitro Basic"
        };
        const nitroStatus = nitroTypes[user.premiumType] || "Inactive";
        if (nitroStatus !== "Inactive") {
            nitroCount++;
            console.log(`Nitro Status: ${nitroStatus}`.magenta);
        } else {
            console.log("Nitro Status: Inactive".magenta);
        }

        let boostsAvailable = 0;
        try {
            const response = await axios.get("https://discord.com/api/v9/users/@me/guilds/premium/subscription-slots", {
                headers: {
                    Authorization: token,
                },
            });

            boostsAvailable = response.data.filter(slot => slot.cooldown_ends_at === null).length;
            console.log(`Boosts Available (API): ${boostsAvailable}`.magenta);
        } catch (error) {
            console.log("Failed to fetch boost information from API.".red);
        }

        const canBoost = nitroStatus !== "Inactive" && boostsAvailable > 0;
        if (canBoost) {
            console.log("This token CAN boost a server.".green);
            canBoostCount++; 
        } else {
            console.log("This token CANNOT boost a server.".red);
        }

        validTokens.push({
            token: token,
            username: user.tag,
            userId: user.id,
            emailVerified: user.verified,
            twoFAEnabled: user.mfaEnabled,
            phoneVerified: user.phone,
            joinDate: user.createdAt.toISOString(),
            nitroStatus: nitroStatus,
            boostsAvailable: boostsAvailable,
            canBoost: canBoost,
        });
    } else {
        console.log("Failed to fetch user information.".red);
    }

    client.destroy();
    return true;
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
            `Nitro Status: ${t.nitroStatus}`,
            `Boosts Available: ${t.boostsAvailable}`,
            `Can Boost: ${t.canBoost ? "Yes" : "No"}`,
        ];

        return details.join(" | ");
    });

    fs.writeFileSync("detailed_valid_tokens.txt", detailedTokens.join("\n\n"), "utf-8");
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
    console.log(`Tokens with Nitro: ${nitroCount}`.magenta);
    console.log(`Tokens that CAN Boost: ${canBoostCount}`.magenta);
}

async function main() {
    try {
        const lines = fs.readFileSync("tokens.txt", "utf-8").split("\n").filter(line => line.trim());
        if (lines.length === 0) {
            console.log("No tokens found in tokens.txt".red);
            return;
        }

        for (const line of lines) {
            const trimmedLine = line.trim();
            const parts = trimmedLine.split(':');
            const token = parts.length >= 3 ? parts[2].trim() : trimmedLine;
            
            const isValid = await checkToken(token);
            totalScanned++;
            
            if (!isValid) {
                invalidTokens.push(trimmedLine);
            }
            
            await new Promise(resolve => setTimeout(resolve, 1));
        }

        writeTokensToFiles();
        printMetrics();
    } catch (error) {
        console.log("Error: tokens.txt file not found".red);
    }
}

main();
