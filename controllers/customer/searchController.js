const { GlobalSearch } = require("../../services/customer/searchService");

const SearchController = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ message: "Search query must be at least 2 characters" });
    }
    
    const results = await GlobalSearch(q.trim());
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { SearchController };
