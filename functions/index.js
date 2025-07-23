const functions = require("firebase-functions");
const fetch = require("node-fetch");
const cors = require("cors")({ origin: true });

// Proxy for Project Gutenberg text files
exports.getBookText = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    const textUrl = request.query.url;
    if (!textUrl) {
      return response.status(400).send("No URL provided.");
    }
    try {
      const fetchResponse = await fetch(decodeURIComponent(textUrl));
      if (!fetchResponse.ok) {
        return response.status(fetchResponse.status).send("Failed to fetch book content.");
      }
      const textData = await fetchResponse.text();
      return response.status(200).send(textData);
    } catch (error) {
      return response.status(500).send("An error occurred while fetching the book text.");
    }
  });
});

// Proxy for the LibriVox API
exports.getLibrivoxData = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    const librivoxUrl = request.query.url;
    if (!librivoxUrl) {
      return response.status(400).send("No LibriVox API URL provided.");
    }
    try {
      const fetchResponse = await fetch(decodeURIComponent(librivoxUrl));
      if (!fetchResponse.ok) {
        return response.status(fetchResponse.status).send("Failed to fetch from LibriVox API.");
      }
      const data = await fetchResponse.json();
      return response.status(200).json(data);
    } catch (error) {
      return response.status(500).send("An error occurred while fetching from LibriVox.");
    }
  });
});

// Proxy for the Open Library API (for book covers)
exports.getOpenLibraryData = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    const openLibraryUrl = request.query.url;
    if (!openLibraryUrl) {
      return response.status(400).send("No Open Library API URL provided.");
    }
    try {
      const fetchResponse = await fetch(decodeURIComponent(openLibraryUrl));
      if (!fetchResponse.ok) {
        return response.status(fetchResponse.status).send("Failed to fetch from Open Library API.");
      }
      const data = await fetchResponse.json();
      return response.status(200).json(data);
    } catch (error) {
      return response.status(500).send("An error occurred while fetching from Open Library.");
    }
  });
});