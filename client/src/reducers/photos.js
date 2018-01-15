const photos = (state=null, action) => {
  switch(action.type) {
    case "INITIALIZE_FEED":
      return action.payload;
      break;
    
    case "SEARCH_BY_TAG":
      return action.payload;
      break;

    case "SEARCH_BY_USER_ID":
      return action.payload;
      break;

    default: 
      return state;
      break;
  };

  return state;
};

export default photos;