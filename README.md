# Discord Token Checker

This script allows you to check the validity of Discord tokens, retrieve account details, and save the results into organized files. It scans tokens from a file (`tokens.txt`) and categorizes them as valid or invalid.

## Features
- Checks the validity of Discord tokens.
- Retrieves user information such as username, ID, email verification, 2FA status, phone verification, and owned servers.
- Saves valid and invalid tokens into separate files.
- Generates a detailed report of valid tokens.

## Requirements
Before you begin, ensure you have:
- A computer with **Windows, macOS, or Linux**.
- **Node.js** installed (Download from: [Node.js official site](https://nodejs.org/)).
- Basic knowledge of command-line usage.

### Install Node.js (If Not Installed)
If you don't have Node.js installed, follow this guide:
[How to Install Node.js (YouTube Guide)](https://www.youtube.com/watch?v=kQabFyl9r9I)

## Installation
1. **Download or Clone this Repository**
   ```sh
   git clone https://github.com/ProjectIMA/Free-Token-Checker
   cd Free-Token-Checker
   ```
2. **Install Required Dependencies**
   ```sh
   npm install discord.js-selfbot-v13 colors fs
   ```

## How to Use
1. **Prepare Your Tokens**
   - Create a text file named `tokens.txt` in the script's directory.
   - Paste one token per line in `tokens.txt`.

2. **Run the Script**
   ```sh
   node index.js
   ```

3. **Check Output Files**
   - `valid_tokens.txt` → Stores valid tokens.
   - `detailed_valid_tokens.txt` → Stores valid tokens with account details.
   - `invalid_tokens.txt` → Stores invalid tokens.

## Example Output
```
Token: XXXXXXXXXXXXXXX... is valid!
Username: ExampleUser#1234
User ID: 123456789012345678
Email Verified: Yes
2FA Enabled: No
Phone Verified: Yes
Join Date: 2023-01-01T12:00:00.000Z
Nitro Status: Nitro
Boosts Available: 2 (not tested because I couldn't please contact me if it doesn't work infos bellow)
Boosted Servers: 1
 - My Awesome Server (ID: 123456789012345678) - Boosted Since: 2024-07-20T12:34:56.789Z
Owned Servers: 1
 - My Server (ID: 987654321098765432)
```
## Token Formatter

We also have a Token Formatter to help clean and structure your token lists before checking them.
You can find it here: [Token Formatter](https://github.com/ProjectIMA/token-formatter)

## Important Notes
- **This script is for educational purposes only!** Do not use it for malicious activities.
- **Rate limits may apply if too many tokens are checked quickly.** Use a delay if necessary.

## License
This script is open-source. Feel free to modify and distribute as needed.

## Disclaimer
We do not support or promote any illegal activities. This script is for testing purposes only and should be used responsibly.

## Contact

For any inquiries, you can reach me on Discord: **cannon06402**

