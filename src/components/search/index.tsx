import axios from "axios";
import { DataFrame } from "dataframe-js";
import React, { useState } from "react";
import cheerio from "cheerio";
import "./index.css"
import { Button, Form, InputGroup } from "react-bootstrap";

const SearchComponent = () => {
  const [searchText, setSearchText] = useState("");

  const apiKey = "YOUR_API_KEY";
  const cx = "YOUR_CUSTOM_SEARCH_CX";
  const maxResults = 10;

  async function getGoogleSearchResults(apiKey, cx, query, startIndex) {
    try {
      const res = await axios.get(
        `https://www.googleapis.com/customsearch/v1?q=${query}&cx=${cx}&key=${apiKey}&start=${startIndex}`
      );
      return res.data.items || [];
    } catch (error) {
      console.error(error);
    }
  }

  async function extractContactNumber(url) {
    try {
      const res = await axios.get(url);
      const $ = cheerio.load(res.data);

      let contactNumber = $("span.contact-number").text().trim();
      if (!contactNumber) {
        contactNumber = $("div.phone-number").text().trim();
      }

      return contactNumber || "N/A";
    } catch (e) {
      console.error(`Error extracting contact number from ${url}: ${e}`);
      return "N/A";
    }
  }

  async function fetchToyShops() {
    const toyShops: any = [];
    let startIndex = 1;

    while (true) {
      const searchResults = await getGoogleSearchResults(
        apiKey,
        cx,
        searchText,
        startIndex
      );

      if (!searchResults?.length) {
        break; // No more results
      }

      for (const result of searchResults) {
        const name = result.title;
        const address = result.snippet;
        const link = result.link;

        const contactNumber = await extractContactNumber(link);

        toyShops.push({
          Name: name,
          Contact_Number: contactNumber,
          Address: address,
        });
      }

      startIndex += maxResults;
    }
    const df = new DataFrame(toyShops);
    df.toCSV("toy_shops.csv");
  }

  const handleSearchClick = () => {
    console.log(`Searching for: ${searchText}`);
    fetchToyShops();
  };

  return (
    <div className="displayContainer">
      <InputGroup className="inputField">
        <Form.Control
          placeholder="Enter search text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button onClick={handleSearchClick}>Search</Button>
      </InputGroup>
    </div>
  );
};

export default SearchComponent;
