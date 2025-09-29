# Semantic Spread Search

This project is a semantic search engine for spreadsheets, built to allow users to ask natural language questions about their data and receive precise, context-aware answers. It's built with **Node.js**, **Fastify**, and **Google's Gemini API**. This project can be extended to support other document types and a complete RAG pipeline.

---

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- **Node.js** (v18.0.0 or higher)
- **npm**

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Infamia2334/semantic-spread-search.git](https://github.com/Infamia2334/semantic-spread-search.git)
    ```

2.  **Install the dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your environment variables:** Create a `.env` file in the root of the project and add your Gemini API key:
    ```
    GEMINI_API_KEY=your_gemini_api_key
    ```

### Running the Application

- To run the application in **development mode** (with hot-reloading), use:
    ```bash
    npm run start:dev
    ```

- To build and run the application in **production mode**, use:
    ```bash
    npm start
    ```

The server will start on port `8001` by default.

---

## API Endpoints

### `/api/v1/search`

This endpoint accepts a `multipart/form-data` request containing a spreadsheet file and a search query. It returns a JSON object with the search results.

**Request:**

- **Method:** `POST`
- **Headers:** `Content-Type: multipart/form-data`
- **Body:**
    - `file`: The spreadsheet file (`.xlsx`).
    - `search`: The natural language search query.
    - `name`: The name of the file.
    - `mimetype`: The mimetype of the file.
    - `size`: The size of the file.
    - `createdAt`: The creation date of the file.
    - `description`: A description of the file.

**Response:**

A JSON object with the following structure:

```json
{
  "status": "Success",
  "data": [
    {
      "concept": "Q1 Gross Profit Margin",
      "location": {
        "sheet": "Financials",
        "cell": "C15"
      },
      "value": "75%",
      "formula": "=C10/C5",
      "explanation": "This is the gross profit margin for the first quarter.",
      "reasoning": "...",
      "relationships": [
        {
          "concept": "Q1 Revenue",
          "location": {
            "sheet": "Financials",
            "cell": "C5"
          },
          "description": "This is the total revenue for the first quarter, used to calculate the gross profit margin."
        }
      ]
    }
  ],
  "message": "Successfully searched the spreadsheet"
}
```
---

## Project Structure
```.
├── dist/                     # Compiled JavaScript files
├── src/                      # Source code
│   ├── api/v1/index.ts       # API v1 routes
│   ├── config/config.ts      # Configuration management
│   ├── customError/apiError.ts # Custom error class
│   ├── dto/                  # Data Transfer Objects
│   │   ├── api.dto.ts
│   │   └── llm.dto.ts
│   ├── services/             # Business logic
│   │   ├── llmService.ts     # Gemini API interaction
│   │   └── parserService.ts  # Spreadsheet parsing
│   ├── utils/formatter.ts    # Prompt formatting for the LLM
│   └── server.ts             # Server entry point
├── .gitignore
├── LICENSE
├── package-lock.json
├── package.json
└── tsconfig.json
```
---

## Configuration
The application can be configured for different environments (development, staging, production) and cloud providers (gcp, azure, aws). The configuration is managed in src/config/config.ts.
