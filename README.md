# Discord Token Checker

This is an open-source script that allows you to check the validity of Discord tokens. It also provides detailed information about the tokens, such as the username, user ID, email verification status, 2FA status, phone verification status, and more. The script will save the valid and invalid tokens to separate files and provide metrics about the scanned tokens.

## Features

- **Token Validation**: Checks if a Discord token is valid or invalid.
- **Detailed Information**: Provides detailed information about valid tokens, including:
  - Username
  - User ID
  - Email verification status
  - 2FA status
  - Phone verification status
  - Join date
  - Owned servers (if any)
- **Metrics**: Provides metrics about the scanned tokens, such as:
  - Total tokens scanned
  - Tokens with email connected
  - Tokens with phone connected
  - Tokens with both email and phone connected
  - Tokens with 2FA enabled
- **File Output**: Saves valid and invalid tokens to separate files (`valid_tokens.txt`, `detailed_valid_tokens.txt`, and `invalid_tokens.txt`).

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/discord-token-checker.git
   cd discord-token-checker
