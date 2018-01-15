const searchByUserID = data => {
  return {
    type: 'SEARCH_BY_USER_ID', 
    payload: data
  };
}; 

export default searchByUserID;
