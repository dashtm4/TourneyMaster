import React from 'react';
import PlacesAutocomplete from 'react-places-autocomplete'; // geocodeByAddress, // getLatLng,
import { Input } from 'components/common';
import styles from './styles.module.scss';
import { BindingCbWithOne } from 'common/models';

export interface IPosition {
  lat: number;
  lng: number;
}

interface IPlaceAutocomplete {
  onSelect: BindingCbWithOne<IPosition>;
  onChange: BindingCbWithOne<string>;
  address: string;
}
const PlacesAutocompleteInput = ({
  onSelect,
  onChange,
  address,
}: IPlaceAutocomplete) => {
  const handleSelect = async (value: string) => {
    // const results = await geocodeByAddress(value);
    // const latLng = await getLatLng(results[0]);
    onChange(value);
    // onSelect(latLng);
    onSelect({ lat: 49.842957, lng: 24.031111 });
  };

  return (
    <div>
      <PlacesAutocomplete
        value={address}
        onChange={onChange}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps }) => (
          <div>
            <Input
              {...getInputProps({
                placeholder: 'Search Google Maps',
                label: 'General Location',
                disabled: true,
              })}
            />
            {suggestions.length > 0 && (
              <div className={styles.suggestionsContainer}>
                {suggestions.map(suggestion => {
                  const style = {
                    backgroundColor: suggestion.active
                      ? 'rgba(0, 0, 0, 0.04)'
                      : '#fff',
                    padding: '6px 16px',
                    cursor: 'pointer',
                  };

                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, { style })}
                      key={suggestion.id}
                    >
                      {suggestion.description}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </PlacesAutocomplete>
    </div>
  );
};

export default PlacesAutocompleteInput;
