import React from "react";
import { useState, useEffect } from "react";

const CitySearch = ({allLocations, setCurrentCity, setInfoAlert}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

 useEffect(() => {
   setSuggestions(allLocations);
 }, [allLocations]);

  const handleInputChanged = (event) => {
    const value = event.target.value; //we explicity declared the value twice, from two different perspectives- here; the onChange attribute, and the value attribute. what is the name of this technique?
    const filteredLocations = allLocations ? allLocations.filter((location) => {
      return location.toUpperCase().indexOf(value.toUpperCase()) > -1; }) : [];
    //the event of the onChange will be made as the input value. 
    setQuery(value)
    //if the user input's value is an index of elements in the allLocations array, 
    // it will be added to the local state array, and rendered in a list.
    setSuggestions(filteredLocations);
    let infoText;
    if(filteredLocations.length === 0){
      infoText = 'we cannot find the city you are looking for. Please try another city'
    } else {
      infoText = ''
    }
    setInfoAlert(infoText);
  }

  //upon user click event, the textbox should contain the EXACT same textContent as the listitem ('Berlin, Germany'). this ensures a passable test code 
  const handleItemClicked = (event) => {
    //.textContent is generally used to retrieve plain text from container elements
    const value= event.target.textContent; //the textContent is of the suggested listitem- since that is the element click on during the event.
    setQuery(value);
    setShowSuggestions(false); //to hide suggestions after the user clicked on the chosen listitem. 
    setCurrentCity(value);
    setInfoAlert('');
  }

  return (
    <div>
      <div id='city-search'>
        <input  
          className='city' 
          type="textbox"
          placeholder='enter city here'
          value={query}
          onFocus={()=>{setShowSuggestions(true)}}
          onChange={handleInputChanged}

        ></input>
      { showSuggestions ? (<ul className='suggestions'>
          {/* once the local state is updated with the filteredLocations, map it inside the <ul> as listitems  */}
          {suggestions.map((suggestion) => {
            return <li key={suggestion} onClick={handleItemClicked}>{suggestion}</li>
          })}
          <li key='see all cities' onClick={() =>  {
            setShowSuggestions(false); 
            setQuery('')
            setCurrentCity('See all cities');
            setInfoAlert('');
          }
        }>see all cities from suggestions</li>
        </ul>) : null}
      </div>
    </div>
  )}
export default CitySearch;