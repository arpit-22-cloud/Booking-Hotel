
// get api user 
export const getUserData = async (req, res) => { 
  try {
    const  role  = req.user.role;
    const  recentSearchedCities  = req.user.recentSearchedCities; 
    res.json({ success: true, role, recentSearchedCities }); 
  } catch (error) {
    res.json({ success: false, message: error.message }); 
  }
};

// Store a city in the user's recent search history (max 3 cities)
export const storeRecentSearchedCities = async (req, res) => { 
  try {
    const { recentSearchedCity } = req.body; 
    const user = await req.user; 

    // Logic to maintain only the 3 most recent searches
    if (user.recentSearchedCities.length < 3) { 
      user.recentSearchedCities.push(recentSearchedCity); 
    } else {
      user.recentSearchedCities.shift(); 
      user.recentSearchedCities.push(recentSearchedCity); 
    }

    await user.save(); 
    res.json({ success: true, message: 'City added' }); 
  } catch (error) {
    res.json({ success: false, message: error.message }); 
  }
};